import { spawn } from 'node:child_process'
import { lstat, readFile } from 'node:fs/promises'
import path from 'node:path'

// The machine-checked part of the record rules in the root AGENTS.md:
// no commit and no branch of this repository in a file, and a phase or slice
// number only under plans/. The proof rule is not checked here. The form of a
// phase or slice number is the project's own: with none given, that rule is
// not checked.
const EXEMPT_LIST = 'plans/record-rules-exempt.txt'
// A package manager writes these; they hold versions and digests from outside.
const LOCK_FILES = new Set(['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock', 'bun.lock', 'Cargo.lock', 'go.sum', 'poetry.lock', 'uv.lock', 'Gemfile.lock', 'composer.lock'])
const HEX = /(?<![0-9A-Za-z_])[0-9a-f]{7,40}(?![0-9A-Za-z_])/g

// The pattern for the project's phase and slice numbers, from the form that the
// project gives. A number counts only where no letter or digit touches it.
export function slicePattern(form: string): RegExp {
  return new RegExp(`(?<![A-Za-z0-9])(?:${form})(?![A-Za-z0-9])`)
}

function git(repo: string, args: string[], input = ''): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['-C', repo, ...args], { stdio: ['pipe', 'pipe', 'pipe'] })
    const out: Buffer[] = []
    let err = ''
    child.stdout.on('data', chunk => out.push(chunk))
    child.stderr.on('data', chunk => { err += chunk })
    child.on('error', reject)
    child.on('close', status => status === 0 ? resolve(Buffer.concat(out).toString('utf8')) : reject(new Error(err.trim() || `git ${args[0]} failed`)))
    child.stdin.on('error', () => {})
    child.stdin.end(input)
  })
}

// Which candidates name a commit of this repository. Git answers; no list of
// permitted strings is kept, so an outside pin or a content digest passes.
async function commitsAmong(repo: string, candidates: string[]): Promise<Set<string>> {
  const commits = new Set<string>()
  if (!candidates.length) return commits
  const answers = (await git(repo, ['cat-file', '--batch-check'], candidates.join('\n') + '\n')).split('\n')
  for (const [index, candidate] of candidates.entries()) {
    const answer = answers[index] ?? ''
    if (/^[0-9a-f]+ commit \d+$/.test(answer)) commits.add(candidate)
    else if (answer.endsWith(' ambiguous')) {
      // A short form that several objects share: a commit only if exactly one of them is a commit.
      try { await git(repo, ['rev-parse', '--verify', '--quiet', `${candidate}^{commit}`]); commits.add(candidate) } catch {}
    }
  }
  return commits
}

async function branchPattern(repo: string): Promise<RegExp | undefined> {
  const names = new Set<string>()
  const refs = (await git(repo, ['for-each-ref', '--format=%(refname)', 'refs/heads', 'refs/remotes'])).split('\n').filter(Boolean)
  for (const ref of refs) {
    const remote = ref.startsWith('refs/remotes/')
    const short = ref.replace(/^refs\/(?:heads|remotes)\//, '')
    const branch = remote ? short.slice(short.indexOf('/') + 1) : short
    // The lines of this repository are named <owner>/<topic>. A name with no
    // slash cannot be told from an ordinary word or a package name.
    if (!branch.includes('/')) continue
    names.add(branch)
    if (remote) names.add(short)
  }
  if (!names.size) return undefined
  const escaped = [...names].sort((a, b) => b.length - a.length).map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return new RegExp(`(?<![A-Za-z0-9._/-])(?:${escaped.join('|')})(?![A-Za-z0-9_/-]|\\.[A-Za-z0-9])`)
}

interface RecordDiagnostic { file: string; line: number | undefined; message: string }

export async function validateRecords(repo: string, slice?: RegExp): Promise<RecordDiagnostic[]> {
  repo = path.resolve(repo)
  let listed: string
  try { listed = await git(repo, ['ls-files', '-z', '--cached', '--others', '--exclude-standard']) }
  catch (error) { throw new Error(`The record rules need Git to list the files and to name commits and branches: ${(error as Error).message}`) }
  const files = [...new Set(listed.split('\0').filter(Boolean))].sort()
  const diagnostics: RecordDiagnostic[] = []
  const issue = (file: string, line: number | undefined, message: string) => diagnostics.push({ file, line, message })

  const exempt: ((file: string) => boolean)[] = []
  if (files.includes(EXEMPT_LIST)) {
    const lines = (await readFile(path.join(repo, EXEMPT_LIST), 'utf8')).split('\n')
    for (const [index, raw] of lines.entries()) {
      const entry = raw.trim()
      if (!entry || entry.startsWith('#')) continue
      const covers = entry.endsWith('/') ? (file: string) => file.startsWith(entry) : (file: string) => file === entry
      if (files.some(covers)) exempt.push(covers)
      else issue(EXEMPT_LIST, index + 1, `exempt entry matches no file: ${entry}`)
    }
  }

  const texts: { file: string; lines: string[] }[] = []
  const candidates = new Set<string>()
  for (const file of files) {
    if (exempt.some(covers => covers(file))) continue
    // The path is checked for each file, also one whose content is not read.
    if (slice && !file.startsWith('plans/') && slice.test(file)) issue(file, undefined, 'the path holds a phase or slice number; these belong only in plans/')
    if (LOCK_FILES.has(path.basename(file))) continue
    let content
    try {
      if (!(await lstat(path.join(repo, file))).isFile()) continue
      const bytes = await readFile(path.join(repo, file))
      if (bytes.subarray(0, 8000).includes(0)) continue
      content = bytes.toString('utf8')
    } catch (error) {
      // A file that Git still lists and the working copy no longer has.
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') continue
      throw error
    }
    const lines = content.split('\n')
    texts.push({ file, lines })
    for (const line of lines) for (const match of line.matchAll(HEX)) candidates.add(match[0])
  }

  const commits = await commitsAmong(repo, [...candidates])
  const branches = await branchPattern(repo)
  for (const { file, lines } of texts) {
    const outsidePlans = !file.startsWith('plans/')
    for (const [index, line] of lines.entries()) {
      for (const match of line.matchAll(HEX)) {
        if (commits.has(match[0])) { issue(file, index + 1, `names a commit of this repository (${match[0].slice(0, 7)}…); a record says the state in words`); break }
      }
      const branch = branches?.exec(line)
      if (branch) issue(file, index + 1, `names a branch of this repository (${branch[0]}); a record says the state in words`)
      if (slice && outsidePlans && slice.test(line)) issue(file, index + 1, `holds a phase or slice number (${slice.exec(line)![0]}); these belong only in plans/`)
    }
  }
  // By file, the path first and then the lines in order.
  return diagnostics.sort((a, b) => a.file < b.file ? -1 : a.file > b.file ? 1 : (a.line ?? 0) - (b.line ?? 0))
}
