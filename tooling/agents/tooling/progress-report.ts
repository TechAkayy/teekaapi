#!/usr/bin/env node
import { readFile, realpath, lstat, writeFile, rename, unlink } from 'node:fs/promises';
import { basename, dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { generatedNotice, renderProgress, statusChanges } from './lib/progress.ts';

function inside(root: string, path: string): boolean {
  const rel = relative(root, path);
  return rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
}

async function main() {
  const args = process.argv.slice(2);
  let root = fileURLToPath(new URL('../../../', import.meta.url));
  let mode = 'stdout';
  let rootSpecified = false;
  while (args.length) {
    const arg = args.shift()!;
    if (arg === '--root' && !rootSpecified && args[0] && !args[0].startsWith('--')) {
      root = resolve(args.shift()!); rootSpecified = true;
    } else if (['--write', '--check'].includes(arg) && mode === 'stdout') mode = arg.slice(2);
    else throw new Error('Usage: progress [--root <workspace>] [--write | --check]');
  }
  root = await realpath(root);
  const pointer = JSON.parse(await readFile(resolve(root, 'plans', 'project-state.json'), 'utf8'));
  const sourcePath = pointer.documents?.tasks;
  if (typeof sourcePath !== 'string' || isAbsolute(sourcePath) || !sourcePath.endsWith('.md')) throw new Error('Pointer must select a local Markdown task document');
  const source = await realpath(resolve(root, sourcePath));
  if (!inside(root, source)) throw new Error('Selected task document must be inside the workspace');
  const output = resolve(dirname(source), 'progress.md');
  if (source === output) throw new Error('Task source cannot also be the generated progress.md');
  const text = await readFile(source, 'utf8');
  const expected = renderProgress(text, pointer.currentSlice?.id, basename(source), pointer.execution);
  if (mode === 'stdout') { process.stdout.write(expected); return; }
  let actual: string | undefined;
  try {
    const info = await lstat(output);
    if (!info.isFile()) throw new Error(`Refusing non-regular report destination: ${output}`);
    actual = await readFile(output, 'utf8');
  } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
  const command = `pnpm --dir tooling/agents run progress --root '${root.replaceAll("'", "'\\''")}' --write`;
  if (mode === 'check') {
    if (actual !== expected) throw new Error(`Report ${actual === undefined ? 'missing' : 'stale or altered'}: ${output}\nRegenerate: ${command}`);
    process.stdout.write(`Progress report is current: ${output}\n`);
    return;
  }
  if (actual !== undefined && !actual.startsWith(generatedNotice + '\n')) throw new Error(`Refusing to overwrite a non-generated report: ${output}`);
  if (actual === expected) { process.stdout.write(`Progress report unchanged: ${output}\n`); return; }
  const temporary = resolve(dirname(output), `.progress-${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, expected, { flag: 'wx' });
    await rename(temporary, output);
  } finally { await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; }); }
  process.stdout.write(`Progress report written: ${output}\n`);
  // Tell the session each status that changed since the saved report.
  for (const change of statusChanges(actual, text, pointer.currentSlice?.id, pointer.execution)) process.stdout.write(`${change}\n`);
}

main().catch(error => { process.stderr.write(`progress: ${error.message}\n`); process.exitCode = 1; });
