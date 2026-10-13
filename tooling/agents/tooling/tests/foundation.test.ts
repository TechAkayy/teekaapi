import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { parseSkillFrontmatter, validateClaudeGate, validateFoundation, validateSkillLinks } from '../lib/foundation.ts'

// What a test gets: a temporary workspace with one small package of skills in it.
interface Fixture { root: string; workspace: string; files: Record<string, string>; put: (name: string, data: string) => Promise<void> }

const packageRoot = fileURLToPath(new URL('../../', import.meta.url))
async function fixture(run: (fixture: Fixture) => Promise<void>) {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'vibe-agent-validation-'))
  const root = path.join(workspace, 'packages/agents')
  const files = {
    'package.json': '{"private":true}',
    'plugins/example/plugin.json': '{"$schema":"https://agent-plugins.org/schemas/1.0.0/plugin.schema.json","name":"example","version":"1.0.0","description":"Example skills"}',
    'plugins/example/skills/inspect/SKILL.md': '---\nname: inspect\ndescription: >-\n  Inspect selected work.\nmetadata:\n  category: review\n---\n[Details](../../references/details.md)\n```md\n[Example](missing-example.md)\n```\n',
    'plugins/example/skills/inspect/agents/openai.yaml': 'policy:\n  allow_implicit_invocation: false\n',
    'plugins/example/references/details.md': '# Details\n',
  }
  async function put(name: string, data: string) {
    const target = path.join(root, name)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, data)
  }
  try {
    for (const [name, data] of Object.entries(files)) await put(name, data)
    await mkdir(path.join(workspace, '.agents/skills'), { recursive: true })
    await symlink('../../packages/agents/plugins/example/skills/inspect', path.join(workspace, '.agents/skills/inspect'))
    await mkdir(path.join(workspace, '.claude/skills'), { recursive: true })
    await symlink('../../packages/agents/plugins/example/skills/inspect', path.join(workspace, '.claude/skills/inspect'))
    await writeFile(path.join(workspace, '.claude/settings.json'), '{"skillOverrides":{"inspect":"user-invocable-only"}}')
    // The record rules ask Git for the files, the commits and the branches.
    assert.equal(spawnSync('git', ['-C', workspace, 'init', '--quiet'], { env: { ...process.env, GIT_CONFIG_GLOBAL: os.devNull, GIT_CONFIG_NOSYSTEM: '1' } }).status, 0)
    await run({ root, workspace, files, put })
  } finally { await rm(workspace, { recursive: true, force: true }) }
}

test('validates real plugin files, preserves YAML metadata and leaves bytes unchanged', async () => {
  await fixture(async ({ root, files }) => {
    const result = await validateFoundation(root)
    assert.deepEqual(result.diagnostics, [])
    assert.deepEqual(result.skills, ['example:inspect'])
    for (const [name, data] of Object.entries(files)) assert.equal(await readFile(path.join(root, name), 'utf8'), data)
  })
})

test('reports a broken shared-reference link after its target is removed', async () => {
  await fixture(async ({ root }) => {
    await rm(path.join(root, 'plugins/example/references/details.md'))
    const { diagnostics } = await validateFoundation(root)
    assert.equal(diagnostics.length, 1)
    assert.match(diagnostics[0]!.message, /local link does not resolve/)
  })
})

test('requires false in the actual policy object, not an unrelated field', async () => {
  await fixture(async ({ root, put }) => {
    for (const policy of ['policy:\n  allow_implicit_invocation: true\n', 'interface:\n  allow_implicit_invocation: false\n']) {
      await put('plugins/example/skills/inspect/agents/openai.yaml', policy)
      const { diagnostics } = await validateFoundation(root)
      assert.ok(diagnostics.some(({ file }) => file.endsWith('agents/openai.yaml')))
    }
  })
})

test('rejects duplicate YAML keys and mismatched skill names', async () => {
  assert.throws(() => parseSkillFrontmatter('---\nname: inspect\nname: other\ndescription: test\n---\n'), /unique/)
  await fixture(async ({ root, put }) => {
    await put('plugins/example/skills/inspect/SKILL.md', '---\nname: wrong\ndescription: test\n---\n')
    assert.ok((await validateFoundation(root)).diagnostics.some(({ message }) => message.includes('match its folder')))
  })
})

test('reports an unresolved manifest skill directory', async () => {
  await fixture(async ({ root, put }) => {
    await rm(path.join(root, 'plugins/example/skills'), { recursive: true })
    assert.ok((await validateFoundation(root)).diagnostics.some(({ file }) => file.endsWith('plugin.json')))
  })
})

test('CLI succeeds on valid input and fails on broken input or an empty inventory', async () => {
  await fixture(async ({ root, put }) => {
    const run = () => spawnSync(process.execPath, [path.join(packageRoot, 'tooling/validate-workspace.ts'), '--root', root], { encoding: 'utf8' })
    assert.equal(run().status, 0)
    await put('plugins/example/skills/inspect/agents/openai.yaml', 'policy: {}\n')
    assert.equal(run().status, 1)
    await rm(path.join(root, 'plugins/example'), { recursive: true })
    const empty = run()
    assert.equal(empty.status, 1)
    assert.match(empty.stderr, /no valid skills/)
  })
})


test('discovers nested skills and checks their own invocation policy', async () => {
  await fixture(async ({ root, put }) => {
    const nested = 'plugins/example/skills/inspect/references/nested'
    await put(`${nested}/SKILL.md`, '---\nname: nested\ndescription: Nested assessment.\n---\n')
    await put(`${nested}/agents/openai.yaml`, 'policy:\n  allow_implicit_invocation: true\n')
    let result = await validateFoundation(root)
    assert.deepEqual(result.skills, ['example:inspect', 'example:nested'])
    assert.ok(result.diagnostics.some(({ file, message }) => file === `${nested}/agents/openai.yaml` && message.includes('must be false')))
    await put(`${nested}/agents/openai.yaml`, 'policy:\n  allow_implicit_invocation: false\n')
    result = await validateFoundation(root)
    assert.deepEqual(result.diagnostics, [])
  })
})

test('checks skill-root files and linked directories without looping', async () => {
  await fixture(async ({ root, put }) => {
    await put('plugins/example/skills/SKILL.md', '---\nname: skills\ndescription: Root assessment.\n---\n')
    await put('plugins/example/skills/agents/openai.yaml', 'policy:\n  allow_implicit_invocation: false\n')
    await put('plugins/example/resources/linked/SKILL.md', '---\nname: linked\ndescription: Linked assessment.\n---\n')
    await put('plugins/example/resources/linked/agents/openai.yaml', 'policy:\n  allow_implicit_invocation: true\n')
    await symlink('../resources/linked', path.join(root, 'plugins/example/skills/linked'))
    await symlink('../../skills', path.join(root, 'plugins/example/resources/linked/cycle'))
    const result = await validateFoundation(root)
    assert.deepEqual(result.skills, ['example:inspect', 'example:linked', 'example:skills'])
    assert.ok(result.diagnostics.some(({ file, message }) => file.endsWith('linked/agents/openai.yaml') && message.includes('must be false')))
  })
})

test('rejects metadata shapes that would cause Codex to discard the false policy', async () => {
  await fixture(async ({ root, put }) => {
    const invalid = [
      { interface: 42 },
      { interface: { default_prompt: [] } },
      { dependencies: [] },
      { dependencies: { tools: null } },
      { dependencies: { tools: [null] } },
      { dependencies: { tools: [{ value: {} }] } },
      { dependencies: { tools: [{ oauth: { callbackPort: 65536 } }] } },
      { dependencies: { tools: [{ oauth: { callbackPort: 1, callback_port: 1 } }] } },
      { policy: { allow_implicit_invocation: false, products: ['unknown'] } },
      { policy: { allow_implicit_invocation: false, products: null } },
    ]
    for (const extra of invalid) {
      const metadata = { policy: { allow_implicit_invocation: false }, ...extra }
      await put('plugins/example/skills/inspect/agents/openai.yaml', JSON.stringify(metadata))
      const result = await validateFoundation(root)
      assert.ok(result.diagnostics.some(({ file }) => file.endsWith('agents/openai.yaml')), JSON.stringify(extra))
    }
    await put('plugins/example/skills/inspect/agents/openai.yaml', JSON.stringify({
      interface: { display_name: 'Inspect', default_prompt: 'Inspect selected work.', icon_small: null },
      dependencies: { tools: [{ type: 'mcp', value: 'example', oauth: { callback_port: 1234 } }] },
      policy: { allow_implicit_invocation: false, products: ['codex', 'CHATGPT'] },
      custom_extension: { preserved: true },
    }))
    assert.deepEqual((await validateFoundation(root)).diagnostics, [])
  })
})


test('keeps discovery links and invocation prompts aligned through additions and removals', async () => {
  await fixture(async ({ root, workspace, put }) => {
    const links = path.join(workspace, '.agents/skills')
    assert.deepEqual(await validateSkillLinks(root), [])
    await put('plugins/example/skills/new-skill/SKILL.md', '---\nname: new-skill\ndescription: New skill.\n---\n')
    await put('plugins/example/skills/new-skill/agents/openai.yaml', 'policy:\n  allow_implicit_invocation: false\n')
    assert.ok((await validateSkillLinks(root)).some(({ file }) => file.endsWith('/new-skill')))
    await symlink('../../packages/agents/plugins/example/skills/new-skill', path.join(links, 'new-skill'))
    assert.deepEqual(await validateSkillLinks(root), [])
    await put('plugins/example/skills/new-skill/agents/openai.yaml', 'interface:\n  default_prompt: Use $old-name.\npolicy:\n  allow_implicit_invocation: false\n')
    assert.ok((await validateSkillLinks(root)).some(({ message }) => message.includes('default_prompt')))
    await rm(path.join(root, 'plugins/example/skills/new-skill'), { recursive: true })
    assert.ok((await validateSkillLinks(root)).some(({ message }) => message.includes('no canonical skill')))
    await rm(path.join(links, 'new-skill'))
    assert.deepEqual(await validateSkillLinks(root), [])
    await rm(path.join(links, 'inspect'))
    await symlink('../../packages/agents/plugins/example/references', path.join(links, 'inspect'))
    assert.ok((await validateSkillLinks(root)).some(({ message }) => message.includes('canonical skill directory')))
  })
})

test('keeps the Claude discovery links the same as the canonical skills', async () => {
  await fixture(async ({ root, workspace, put }) => {
    const links = path.join(workspace, '.claude/skills')
    assert.deepEqual(await validateClaudeGate(root), [])
    await rm(path.join(links, 'inspect'))
    assert.ok((await validateClaudeGate(root)).some(({ file }) => file.endsWith('.claude/skills/inspect')))
    await symlink('../../packages/agents/plugins/example/references', path.join(links, 'inspect'))
    assert.ok((await validateClaudeGate(root)).some(({ message }) => message.includes('canonical skill directory')))
    await rm(path.join(links, 'inspect'))
    await symlink('../../packages/agents/plugins/example/skills/inspect', path.join(links, 'inspect'))
    await symlink('../../packages/agents/plugins/example/skills/inspect', path.join(links, 'left-over'))
    assert.ok((await validateClaudeGate(root)).some(({ message }) => message.includes('no canonical skill')))
  })
})

test('requires the user-invocable-only gate for each skill in the Claude settings', async () => {
  await fixture(async ({ root, workspace }) => {
    const settings = path.join(workspace, '.claude/settings.json')
    const gate = async (content: string) => { await writeFile(settings, content); return validateClaudeGate(root) }
    assert.deepEqual(await gate('{"skillOverrides":{"inspect":"user-invocable-only"},"permissions":{}}'), [])
    assert.ok((await gate('{"skillOverrides":{"inspect":"on"}}')).some(({ message }) => message.includes('inspect must be user-invocable-only')))
    // A skill with no entry is "on" in Claude, so a missing entry opens the gate.
    assert.ok((await gate('{"skillOverrides":{}}')).some(({ message }) => message.includes('inspect must be user-invocable-only')))
    assert.ok((await gate('{}')).some(({ message }) => message.includes('inspect must be user-invocable-only')))
    assert.ok((await gate('{"skillOverrides":{"inspect":"user-invocable-only","gone":"user-invocable-only"}}')).some(({ message }) => message.includes('gone has no canonical skill')))
    assert.ok((await gate('{not json')).some(({ file }) => file.endsWith('.claude/settings.json')))
    await rm(settings)
    assert.ok((await validateClaudeGate(root)).some(({ file }) => file.endsWith('.claude/settings.json')))
  })
})

test('refuses a CLAUDE.md file, because Claude would then stop reading AGENTS.md', async () => {
  for (const name of ['CLAUDE.md', 'CLAUDE.local.md', '.claude/CLAUDE.md']) {
    await fixture(async ({ root, workspace }) => {
      await writeFile(path.join(workspace, name), '# Instructions\n')
      const diagnostics = await validateClaudeGate(root)
      assert.equal(diagnostics.length, 1, name)
      assert.ok(diagnostics[0]!.file.endsWith(name) && diagnostics[0]!.message.includes('AGENTS.md'), name)
    })
  }
})

test('CLI fails when the Claude gate is open and names both hosts when it passes', async () => {
  await fixture(async ({ root, workspace }) => {
    const run = () => spawnSync(process.execPath, [path.join(packageRoot, 'tooling/validate-workspace.ts'), '--root', root], { encoding: 'utf8' })
    const valid = run()
    assert.equal(valid.status, 0)
    assert.match(valid.stdout, /Codex and Claude/)
    await writeFile(path.join(workspace, '.claude/settings.json'), '{"skillOverrides":{}}')
    const open = run()
    assert.equal(open.status, 1)
    assert.match(open.stderr, /user-invocable-only/)
  })
})

test('CLI refuses a record that breaks the record rules', async () => {
  await fixture(async ({ root, workspace, put }) => {
    const run = () => spawnSync(process.execPath, [path.join(packageRoot, 'tooling/validate-workspace.ts'), '--root', root], { encoding: 'utf8' })
    assert.equal(run().status, 0)
    // Built from parts, so that this file passes the check that it tests.
    await writeFile(path.join(workspace, 'notes.md'), `Added for ${'S' + '05'}.\n`)
    // The project has given no form for its slice numbers yet, so none is checked.
    assert.equal(run().status, 0)
    await put('records.json', JSON.stringify({ sliceId: 'S[0-9]{2}' }))
    const refused = run()
    assert.equal(refused.status, 1)
    assert.match(refused.stderr, /notes\.md:1: holds a phase or slice number/)
  })
})
