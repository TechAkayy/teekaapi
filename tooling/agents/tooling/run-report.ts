#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { realpathSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findMarker, runReport } from './lib/run-report.ts';

const usage = 'Usage: run-report [--root <workspace>] [--minutes <n>] | run-report --mark | run-report --find <marker> [--root <workspace>]';

function main(): void {
  const args = process.argv.slice(2);
  let root = fileURLToPath(new URL('../../../', import.meta.url));
  let minutes = 60;
  let marker: string | undefined;
  while (args.length) {
    const arg = args.shift()!;
    if (arg === '--mark' && !args.length) { process.stdout.write(`run-marker-${randomUUID()}\n`); return; }
    if (arg === '--root' && args[0]) root = resolve(args.shift()!);
    else if (arg === '--minutes' && /^[1-9]\d{0,4}$/.test(args[0] ?? '')) minutes = Number(args.shift());
    else if (arg === '--find' && args[0]) marker = args.shift();
    else throw new Error(usage);
  }
  root = realpathSync(root);
  const places = { home: homedir(), claude: process.env.CLAUDE_CONFIG_DIR, codex: process.env.CODEX_HOME };
  if (marker !== undefined) {
    const found = findMarker(marker, root, places);
    if (found.length !== 1) throw new Error(found.length ? 'More than one log holds that marker; print a new marker and ask again at once' : 'No log holds that marker');
    process.stdout.write(`logs: ${found[0]!.logs}\nsession: ${found[0]!.session}\n`);
    return;
  }
  const git = (...command: string[]): string => {
    try { return execFileSync('git', ['-C', root, ...command], { encoding: 'utf8', timeout: 20000, stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return ''; }
  };
  process.stdout.write(runReport({ root, now: Date.now(), minutes, places, git }));
}

try { main(); } catch (error) { process.stderr.write(`run-report: ${(error as Error).message}\n`); process.exitCode = 1; }
