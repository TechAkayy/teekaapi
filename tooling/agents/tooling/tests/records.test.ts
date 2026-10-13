import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import type { TestContext } from 'node:test'
import { slicePattern, validateRecords } from '../lib/records.ts'

// Each test makes its own temporary repository, so this file names no commit
// and no branch of the real one. Slice and phase numbers are built from parts
// for the same reason: this file is outside plans/ and must pass the check.
const slice = 'S' + '05'
const phase = 'P' + '02'
const added = 'M' + '02'
// The form that these tests give for the numbers of their example project.
// Slice numbers also appear in lower case and without the point, in file and service names.
const form = slicePattern('(?:[sS](?:0[1-9][0-9]{0,2}|[1-4][0-9])|R(?:0[1-9]|1[0-4])|M0[1-9]|P0[1-9])(?:\\.[0-9]{1,2})?')

async function repository(t: TestContext) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'vibe-records-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const env = {
    ...process.env, GIT_CONFIG_GLOBAL: os.devNull, GIT_CONFIG_NOSYSTEM: '1',
    GIT_AUTHOR_NAME: 'Test', GIT_AUTHOR_EMAIL: 'test@example.test', GIT_COMMITTER_NAME: 'Test', GIT_COMMITTER_EMAIL: 'test@example.test',
  }
  const git = (...args: string[]) => {
    const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8', env })
    assert.equal(result.status, 0, result.stderr)
    return result.stdout.trim()
  }
  const put = async (name: string, data: string | Buffer) => {
    await mkdir(path.dirname(path.join(root, name)), { recursive: true })
    await writeFile(path.join(root, name), data)
  }
  git('init', '--quiet')
  await put('README.md', '# Example\n')
  git('add', '-A')
  git('commit', '--quiet', '-m', 'first')
  return { root, git, put, check: () => validateRecords(root, form) }
}

test('refuses a file that names a commit of the repository, in full and in short form', async t => {
  const { git, put, check } = await repository(t)
  const commit = git('rev-parse', 'HEAD')
  await put('notes.md', `No identifier here.\nCorrected in ${commit}.\nSee also (${commit.slice(0, 9)}).\n`)
  const diagnostics = await check()
  assert.deepEqual(diagnostics.map(({ file, line }) => [file, line]), [['notes.md', 2], ['notes.md', 3]])
  for (const { message } of diagnostics) assert.match(message, /commit of this repository/)
})

test('passes a hexadecimal string that is not a commit of the repository', async t => {
  const { git, put, check } = await repository(t)
  const blob = git('hash-object', 'README.md')
  await put('pins.md', [
    `An outside pin: ${'9'.repeat(40)}`,
    `A long content digest: ${'ab12'.repeat(16)}`,
    `The digest of a file, not of a commit: ${blob}`,
    'A date as digits: 20261008',
  ].join('\n'))
  assert.deepEqual(await check(), [])
})

test('refuses a branch of the repository and passes a text that only looks like one', async t => {
  const { git, put, check } = await repository(t)
  git('branch', 'review/first-line')
  git('branch', 'trunk')
  git('branch', 'example-shell')
  await put('notes.md', [
    'An address: https://example.test/review/first-liner and https://example.test/x/review/first-line',
    'A longer name: review/first-line-two',
    'The trunk of the tree is a plain word.',
    'The work is on review/first-line.',
    'The example-shell package has the name of a line with no slash.',
  ].join('\n'))
  const diagnostics = await check()
  assert.deepEqual(diagnostics.map(({ file, line }) => [file, line]), [['notes.md', 4]])
  assert.match(diagnostics[0]!.message, /branch of this repository/)
})

test('refuses a phase or slice number outside the plans folder, in content and in a path', async t => {
  const { put, check } = await repository(t)
  await put('src/notes.md', `Added for ${slice}.\nPart of phase ${phase}.\nThe sub-slice ${slice}.1 changed it.\nNeeded by ${added}.\n`)
  await put(`tools/qualify-${slice.toLowerCase()}-recovery/run.md`, 'A run.\n')
  await put(`tools/update-${'s' + '044'}-sidebar.md`, 'A compact form.\n')
  await put(`assets/${slice.toLowerCase()}-screen.bin`, Buffer.from([0, 1, 2]))
  const diagnostics = await check()
  assert.deepEqual(diagnostics.map(({ file, line }) => [file, line]), [
    [`assets/${slice.toLowerCase()}-screen.bin`, undefined],
    ['src/notes.md', 1], ['src/notes.md', 2], ['src/notes.md', 3], ['src/notes.md', 4],
    [`tools/qualify-${slice.toLowerCase()}-recovery/run.md`, undefined],
    [`tools/update-${'s' + '044'}-sidebar.md`, undefined],
  ])
  for (const { message } of diagnostics) assert.match(message, /phase or slice number/)
})

test('passes a slice number inside the plans folder and look-alikes outside it', async t => {
  const { put, check } = await repository(t)
  await put(`plans/${slice}/SPEC.md`, `The scope of ${slice} in phase ${phase}.\n`)
  await put('src/notes.md', [
    'An R2 bucket, an S3 bucket and a D1 database.',
    'Task T12 of deliverable D3; see 02-upstream-composition.md.',
    'Target es2022; class names such as ms05x and hs256.',
    'An M1 chip, the M365 suite and the size M10.',
  ].join('\n'))
  assert.deepEqual(await check(), [])
})

test('does not check phase and slice numbers when the project gives no form for them', async t => {
  const { root, put } = await repository(t)
  await put('src/notes.md', `Added for ${slice}.\n`)
  await put(`tools/qualify-${slice.toLowerCase()}-recovery/run.md`, 'A run.\n')
  assert.deepEqual(await validateRecords(root), [])
})

test('does not check a path on the exempt list, and refuses a dead entry', async t => {
  const { put, check } = await repository(t)
  await put('legacy/old.md', `From ${slice}.\n`)
  await put('older.md', `From ${slice}.\n`)
  await put('old.md', `From ${slice}.\n`)
  await put('plans/record-rules-exempt.txt', '# Not yet refitted.\nlegacy/\nold.md\n')
  assert.deepEqual((await check()).map(({ file }) => file), ['older.md'])
  await put('plans/record-rules-exempt.txt', 'legacy/\nold.md\nolder.md\ngone/\n')
  const diagnostics = await check()
  assert.deepEqual(diagnostics.map(({ file, line }) => [file, line]), [['plans/record-rules-exempt.txt', 4]])
  assert.match(diagnostics[0]!.message, /matches no file/)
})

test('checks a new file that is not committed, and skips ignored, binary and lock files', async t => {
  const { git, put, check } = await repository(t)
  const commit = git('rev-parse', 'HEAD')
  await put('.gitignore', 'ignored.md\n')
  await put('ignored.md', commit)
  await put('image.bin', Buffer.concat([Buffer.from([0, 1, 2]), Buffer.from(commit)]))
  await put('pnpm-lock.yaml', `integrity: ${commit}\n`)
  await put('new.md', commit)
  assert.deepEqual((await check()).map(({ file }) => file), ['new.md'])
})

test('fails with a clear message when Git cannot answer', async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'vibe-records-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await assert.rejects(validateRecords(root), /record rules need Git/)
})
