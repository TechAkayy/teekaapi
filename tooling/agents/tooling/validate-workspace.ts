#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateClaudeGate, validateFoundation, validateSkillLinks } from './lib/foundation.ts'
import { slicePattern, validateRecords } from './lib/records.ts'

// records.json gives the form of the project's phase and slice numbers. With no
// file or no form, the rule on those numbers is not checked.
async function sliceForm(root: string): Promise<RegExp | undefined> {
  let text
  try { text = await readFile(path.join(root, 'records.json'), 'utf8') }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined; throw error }
  const form = JSON.parse(text).sliceId
  if (form == null) return undefined
  if (typeof form !== 'string' || !form) throw new Error('records.json: sliceId must be a pattern or null')
  return slicePattern(form)
}

const args = process.argv.slice(2)
if (args.length && (args.length !== 2 || args[0] !== '--root')) {
  console.error('usage: node tooling/validate-workspace.ts [--root <agents-package>]')
  process.exitCode = 1
} else {
  const root = args.length ? path.resolve(args[1]!) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  try {
    const result = await validateFoundation(root)
    result.diagnostics.push(...await validateSkillLinks(root), ...await validateClaudeGate(root))
    for (const item of result.diagnostics) console.error(`${item.file}: ${item.message}`)
    // The record rules cover the whole repository, so their paths are relative to its root.
    const records = await validateRecords(path.resolve(root, '../..'), await sliceForm(root))
    for (const item of records) console.error(`${item.file}${item.line ? `:${item.line}` : ''}: ${item.message}`)
    if (result.diagnostics.length || records.length) process.exitCode = 1
    else console.log(`Agent plugins valid: ${result.skills.length} skills; metadata, invocation policy and discovery links for Codex and Claude, local file links and the record rules checked.`)
  } catch (error) {
    console.error((error as Error).message)
    process.exitCode = 1
  }
}
