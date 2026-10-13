import { readFile, readdir, realpath, stat, lstat, readlink } from 'node:fs/promises'
import path from 'node:path'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { parseDocument } from 'yaml'

const AGENT_PLUGIN_SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json'

interface Diagnostic { file: string; message: string }
type Issue = (file: string, message: string) => void
// The fields of a Markdown tree node that the validator reads.
interface MarkdownNode { type: string; url?: string; children?: MarkdownNode[] }

function yaml(content: string, source: string) {
  const document = parseDocument(content, { uniqueKeys: true })
  if (document.errors.length) throw new Error(`${source}: ${document.errors[0]!.message}`)
  return document.toJS()
}

export function parseSkillFrontmatter(content: string, source = 'SKILL.md') {
  const match = content.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---(?:\n|$)/)
  if (!match) throw new Error(`${source}: missing YAML frontmatter`)
  const metadata = yaml(match[1]!, source)
  if (!metadata || typeof metadata.name !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.name) || metadata.name.length > 64) {
    throw new Error(`${source}: invalid skill name`)
  }
  if (typeof metadata.description !== 'string' || !metadata.description.trim()) {
    throw new Error(`${source}: missing description`)
  }
  if (metadata.metadata !== undefined) {
    const fields = metadata.metadata
    if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
      throw new Error(`${source}: metadata must be a mapping`)
    }
    if (fields['short-description'] != null && typeof fields['short-description'] !== 'string') {
      throw new Error(`${source}: metadata.short-description must be a string or null`)
    }
  }
  return metadata
}

export function parseOpenAiPolicy(content: string, source = 'agents/openai.yaml'): boolean {
  const metadata = yaml(content, source)
  // Codex discards the whole metadata document if a recognized field cannot
  // deserialize. See the source revision and compatibility scope in agents/README.md.
  const fail = (field: string, expected: string): never => { throw new Error(`${source}: ${field} must be ${expected}`) }
  const object = (value: unknown, field: string) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail(field, 'a mapping')
  }
  const strings = (value: Record<string, unknown>, fields: string[], prefix: string) => {
    for (const field of fields) {
      if (value[field] != null && typeof value[field] !== 'string') fail(`${prefix}.${field}`, 'a string or null')
    }
  }
  object(metadata, 'metadata')
  if (metadata.interface != null) {
    object(metadata.interface, 'interface')
    strings(metadata.interface, ['display_name', 'short_description', 'icon_small', 'icon_large', 'brand_color', 'default_prompt'], 'interface')
  }
  if (metadata.dependencies != null) {
    object(metadata.dependencies, 'dependencies')
    const tools = metadata.dependencies.tools
    if (tools !== undefined) {
      if (!Array.isArray(tools)) fail('dependencies.tools', 'a sequence')
      for (const [index, tool] of tools.entries()) {
        const field = `dependencies.tools[${index}]`
        object(tool, field)
        strings(tool, ['type', 'value', 'description', 'transport', 'command', 'url'], field)
        if (tool.oauth != null) {
          object(tool.oauth, `${field}.oauth`)
          const oauth = tool.oauth
          if ('callbackPort' in oauth && 'callback_port' in oauth) fail(`${field}.oauth`, 'a mapping with only one callback-port spelling')
          const port = oauth.callbackPort ?? oauth.callback_port
          if (port != null && (!Number.isInteger(port) || port < 0 || port > 65535)) fail(`${field}.oauth.callbackPort`, 'an unsigned 16-bit integer or null')
        }
      }
    }
  }
  object(metadata.policy, 'policy')
  if (metadata.policy.products !== undefined) {
    const products = metadata.policy.products
    if (!Array.isArray(products) || products.some(product => !['chatgpt', 'codex', 'atlas', 'CHATGPT', 'CODEX', 'ATLAS'].includes(product))) {
      fail('policy.products', 'a sequence of supported product names')
    }
  }
  if (typeof metadata.policy.allow_implicit_invocation !== 'boolean') {
    throw new Error(`${source}: missing boolean policy.allow_implicit_invocation`)
  }
  return metadata.policy.allow_implicit_invocation
}

// Parse Markdown rather than interpreting sample links inside fenced code.
// File targets are checked; anchors and external URLs are outside this check.
export function markdownLocalLinks(content: string): string[] {
  const targets: string[] = []
  const tree = fromMarkdown(content.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, ''))
  function visit(node: MarkdownNode) {
    if (['link', 'image', 'definition'].includes(node.type)) {
      const url = node.url
      if (url && !url.startsWith('#') && !url.startsWith('//') && !/^[a-z][a-z0-9+.-]*:/i.test(url)) {
        targets.push(decodeURIComponent(url.split('#')[0]!.split('?')[0]!))
      }
    }
    for (const child of node.children ?? []) visit(child)
  }
  visit(tree)
  return targets
}

export async function validateFoundation(root: string): Promise<{ skills: string[]; diagnostics: Diagnostic[] }> {
  root = path.resolve(root)
  const diagnostics: Diagnostic[] = []
  const skills: string[] = []
  const names = new Set<string>()
  const issue: Issue = (file, message) => diagnostics.push({ file: path.relative(root, file), message })
  const readJson = async (file: string) => JSON.parse(await readFile(file, 'utf8'))
  const isDirectory = async (file: string) => (await stat(file)).isDirectory()
  const pluginsRoot = path.join(root, 'plugins')
  try {
    const pkg = await readJson(path.join(root, 'package.json'))
    if (pkg.private !== true) issue(path.join(root, 'package.json'), 'agent package must be private')
  } catch (error) { issue(path.join(root, 'package.json'), (error as Error).message) }

  let plugins
  try { plugins = await readdir(pluginsRoot, { withFileTypes: true }) }
  catch (error) { issue(pluginsRoot, (error as Error).message); return { skills, diagnostics } }
  for (const entry of plugins) {
    if (!entry.isDirectory()) continue
    const pluginRoot = path.join(pluginsRoot, entry.name)
    const manifestPath = path.join(pluginRoot, 'plugin.json')
    try {
      const manifest = await readJson(manifestPath)
      if (manifest?.$schema !== AGENT_PLUGIN_SCHEMA) {
        throw new Error(`plugin $schema must be ${AGENT_PLUGIN_SCHEMA}`)
      }
      if (manifest.name !== entry.name || typeof manifest.version !== 'string' || !manifest.version.trim()) {
        throw new Error('plugin name must match its folder and version must be present')
      }
      const skillRoot = path.join(pluginRoot, 'skills')
      if (!await isDirectory(skillRoot)) throw new Error('standard skills directory must exist')
      // Scan the complete source tree, including hidden resources and symlinked
      // directories. This is deliberately broader than host traversal limits.
      const skillPaths: string[] = []
      const visited = new Set<string>()
      async function discover(directory: string): Promise<void> {
        const canonical = await realpath(directory)
        if (visited.has(canonical)) return
        visited.add(canonical)
        for (const item of await readdir(directory, { withFileTypes: true })) {
          const file = path.join(directory, item.name)
          const info = item.isSymbolicLink() ? await stat(file) : item
          if (info.isDirectory()) await discover(file)
          else if (info.isFile() && item.name === 'SKILL.md') skillPaths.push(file)
        }
      }
      await discover(skillRoot)
      for (const skillPath of skillPaths) {
        const directory = path.dirname(skillPath)
        try {
          const metadata = parseSkillFrontmatter(await readFile(skillPath, 'utf8'), skillPath)
          if (metadata.name !== path.basename(directory)) throw new Error('skill name must match its folder')
          const qualified = `${manifest.name}:${metadata.name}`
          if (names.has(metadata.name)) throw new Error(`duplicate skill ${qualified}`)
          names.add(metadata.name)
          skills.push(qualified)
        } catch (error) { issue(skillPath, (error as Error).message) }
        const policyPath = path.join(directory, 'agents/openai.yaml')
        try {
          if (parseOpenAiPolicy(await readFile(policyPath, 'utf8'), policyPath)) {
            throw new Error('allow_implicit_invocation must be false')
          }
        } catch (error) { issue(policyPath, (error as Error).message) }
      }
      if (!skillPaths.length) issue(skillRoot, 'plugin has no SKILL.md files')
    } catch (error) { issue(manifestPath, (error as Error).message) }

    async function checkMarkdown(directory: string): Promise<void> {
      for (const item of await readdir(directory, { withFileTypes: true })) {
        const file = path.join(directory, item.name)
        if (item.isDirectory()) await checkMarkdown(file)
        if (!item.isFile() || !item.name.endsWith('.md')) continue
        try {
          const content = await readFile(file, 'utf8')
          for (const target of markdownLocalLinks(content)) {
            try { await stat(path.resolve(path.dirname(file), target)) }
            catch { issue(file, `local link does not resolve: ${target}`) }
          }
        } catch (error) { issue(file, (error as Error).message) }
      }
    }
    await checkMarkdown(pluginRoot)
  }
  if (!skills.length) issue(pluginsRoot, 'no valid skills found')
  return { skills: skills.sort(), diagnostics }
}

// The direct standard-plugin inventory: each folder under plugins/<owner>/skills
// that holds a SKILL.md, by its standalone name.
async function canonicalSkills(root: string, issue: Issue): Promise<Map<string, string>> {
  const expected = new Map<string, string>()
  for (const plugin of await readdir(path.join(root, 'plugins'), { withFileTypes: true })) {
    if (!plugin.isDirectory()) continue
    const skillsRoot = path.join(root, 'plugins', plugin.name, 'skills')
    let entries
    try { entries = await readdir(skillsRoot) }
    catch (error) { issue(skillsRoot, (error as Error).message); continue }
    for (const name of entries) {
      const source = path.join(skillsRoot, name)
      try { await stat(path.join(source, 'SKILL.md')) }
      catch { continue }
      if (expected.has(name)) issue(source, `duplicate standalone skill name: ${name}`)
      expected.set(name, source)
    }
  }
  return expected
}

// One host discovery folder: each canonical skill has exactly its relative link,
// and no entry is left over.
async function checkDiscoveryLinks(linksRoot: string, expected: Map<string, string>, issue: Issue): Promise<void> {
  for (const [name, source] of expected) {
    const link = path.join(linksRoot, name)
    try {
      if (!(await lstat(link)).isSymbolicLink()) throw new Error('discovery entry must be a relative symlink')
      const target = await readlink(link)
      if (path.isAbsolute(target) || path.resolve(linksRoot, target) !== source) {
        throw new Error('discovery link must point relatively to its canonical skill directory')
      }
      await stat(path.join(link, 'SKILL.md'))
    } catch (error) { issue(link, (error as Error).message) }
  }
  try {
    for (const name of await readdir(linksRoot)) {
      if (!expected.has(name)) issue(path.join(linksRoot, name), 'discovery entry has no canonical skill')
    }
  } catch (error) { issue(linksRoot, (error as Error).message) }
}

// Check the direct standard-plugin inventory against the repository's host links.
// Keep this separate from the broader source-policy scan above.
export async function validateSkillLinks(root: string): Promise<Diagnostic[]> {
  root = path.resolve(root)
  const diagnostics: Diagnostic[] = []
  const issue: Issue = (file, message) => diagnostics.push({ file: path.relative(root, file), message })
  const expected = await canonicalSkills(root, issue)
  await checkDiscoveryLinks(path.resolve(root, '../../.agents/skills'), expected, issue)
  for (const [name, source] of expected) {
    const metadataPath = path.join(source, 'agents/openai.yaml')
    try {
      const metadata = yaml(await readFile(metadataPath, 'utf8'), metadataPath)
      const prompt = metadata?.interface?.default_prompt
      if (typeof prompt === 'string' && !prompt.match(/\$[a-z0-9]+(?:[-:][a-z0-9]+)*/g)?.includes(`$${name}`)) {
        issue(metadataPath, `default_prompt must invoke $${name}`)
      }
    } catch (error) { issue(metadataPath, (error as Error).message) }
  }
  return diagnostics
}

// The Claude side of the same inventory: the discovery links, the explicit-only
// gate in the committed settings, and no file that hides AGENTS.md from Claude.
// See "Why a skill starts only when a person asks" in agents/README.md.
export async function validateClaudeGate(root: string): Promise<Diagnostic[]> {
  root = path.resolve(root)
  const workspace = path.resolve(root, '../..')
  const diagnostics: Diagnostic[] = []
  const issue: Issue = (file, message) => diagnostics.push({ file: path.relative(root, file), message })
  // validateSkillLinks reports a duplicate name; do not report it twice.
  const expected = await canonicalSkills(root, () => {})
  await checkDiscoveryLinks(path.join(workspace, '.claude/skills'), expected, issue)

  const settingsPath = path.join(workspace, '.claude/settings.json')
  try {
    const overrides = JSON.parse(await readFile(settingsPath, 'utf8'))?.skillOverrides ?? {}
    // Claude treats a skill with no entry as "on", so every skill needs its entry.
    for (const name of expected.keys()) {
      if (overrides[name] !== 'user-invocable-only') issue(settingsPath, `skillOverrides.${name} must be user-invocable-only`)
    }
    for (const name of Object.keys(overrides)) {
      if (!expected.has(name)) issue(settingsPath, `skillOverrides.${name} has no canonical skill`)
    }
  } catch (error) { issue(settingsPath, (error as Error).message) }

  for (const name of ['CLAUDE.md', 'CLAUDE.local.md', '.claude/CLAUDE.md']) {
    const file = path.join(workspace, name)
    try { await lstat(file) }
    catch { continue }
    issue(file, 'remove this file: with it, Claude stops reading AGENTS.md')
  }
  return diagnostics
}
