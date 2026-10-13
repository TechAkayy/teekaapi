// The report of a run in any execution mode, for a reader who follows it from outside. It reads the
// repository and the session logs of the conversations that the project pointer names, and prints facts
// in a fixed form: it quotes and counts, and it reads no meaning into them. It writes nothing.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, isAbsolute, join, resolve } from 'node:path';
import { renderBrief } from './progress.ts';

export interface Role { provider?: string; model?: string; effort?: string; conversation?: string; session?: string; logs?: string }
export interface Sessions { orchestrator?: Role; developer?: Role; reviewer?: Role }
type Stamp = [time: number, text: string];
export interface SessionFacts {
  lastActivity: number;
  refusedByRule: Stamp[];
  refusedByClassifier: Stamp[];
  toolErrors: number;
  events: Stamp[];
  outside: Stamp[];
  statements: Stamp[];
}
export interface Places { home: string; claude?: string; codex?: string }
export interface Inputs {
  root: string;
  now: number;
  minutes: number;
  places: Places;
  // Runs Git in the work folder and gives its output; a failed command gives an empty text.
  git: (...args: string[]) => string;
}

const single = (text: unknown): string => String(text ?? '').replace(/\s+/g, ' ').trim();
// A long unbroken text can be a key or a token. The report prints none.
const safe = (text: unknown, length: number): string => single(text).replace(/[A-Za-z0-9_\-+/=]{40,}/g, '<long text>').slice(0, length);
const clock = (time: number): string => { const date = new Date(time); return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`; };
const lines = (path: string): any[] => readFileSync(path, 'utf8').split('\n').filter(Boolean).flatMap(line => { try { return [JSON.parse(line)]; } catch { return []; } });
const empty = (): SessionFacts => ({ lastActivity: 0, refusedByRule: [], refusedByClassifier: [], toolErrors: 0, events: [], outside: [], statements: [] });

// A command that only reads is no outside command, also when it names a file of one.
const readers = /^(cat|sed|grep|rg|ls|head|tail|wc|git|echo|find|awk|cut|diff|less|stat)\b/;
function outsideIn(command: string, patterns: RegExp[]): boolean {
  return command.split(/&&|\|\||;|\n/).some(part => { const text = part.trim(); return text !== '' && !readers.test(text) && patterns.some(pattern => pattern.test(text)); });
}

// One reader for each form of session log. The form belongs to the provider of the agent, and to no host.
interface LogReader {
  // The log of one session, by the identifier that the pointer holds.
  locate(session: string, root: string, places: Places): string | undefined;
  // Each log that may hold a marker, newest first.
  candidates(root: string, places: Places): string[];
  sessionOf(path: string): string;
  read(path: string, since: number, patterns: RegExp[]): SessionFacts;
}

const claudeFolder = (root: string, places: Places): string => join(places.claude ?? join(places.home, '.claude'), 'projects', root.replace(/[^A-Za-z0-9]/g, '-'));
const newestFirst = (paths: string[]): string[] => paths.map(path => ({ path, time: statSync(path).mtimeMs })).sort((a, b) => b.time - a.time).map(entry => entry.path);
function walk(folder: string, depth: number, test: (name: string) => boolean): string[] {
  let names: string[] = [];
  try { names = readdirSync(folder); } catch { return []; }
  return names.flatMap(name => {
    const path = join(folder, name);
    let directory = false;
    try { directory = statSync(path).isDirectory(); } catch { return []; }
    return directory ? (depth > 0 ? walk(path, depth - 1, test) : []) : test(name) ? [path] : [];
  });
}

const claude: LogReader = {
  locate(session, root, places) {
    if (!/^[A-Za-z0-9-]+$/.test(session)) return undefined;
    const path = join(claudeFolder(root, places), `${session}.jsonl`);
    return existsSync(path) ? path : undefined;
  },
  candidates: (root, places) => newestFirst(walk(claudeFolder(root, places), 0, name => name.endsWith('.jsonl') && !name.startsWith('agent-'))),
  sessionOf: path => basename(path, '.jsonl'),
  read(path, since, patterns) {
    const facts = empty();
    for (const entry of lines(path)) {
      const time = entry.timestamp ? Date.parse(entry.timestamp) : 0;
      if (time) facts.lastActivity = Math.max(facts.lastActivity, time);
      const content = entry.message?.content;
      for (const part of typeof content === 'string' ? [{ type: 'text', text: content }] : Array.isArray(content) ? content : []) {
        if (part.type === 'text' && entry.type === 'assistant' && single(part.text)) facts.statements.push([time, part.text]);
        if (part.type === 'tool_use' && time >= since && typeof part.input?.command === 'string' && outsideIn(part.input.command, patterns)) facts.outside.push([time, part.input.command]);
        if (part.type === 'tool_result') {
          const text = single(typeof part.content === 'string' ? part.content : JSON.stringify(part.content)).slice(0, 600);
          if (/^Permission to use .* has been denied/.test(text)) facts.refusedByRule.push([time, text]);
          else if (/denied by the Claude Code auto mode classifier/i.test(text)) facts.refusedByClassifier.push([time, text]);
          else if (part.is_error && time >= since) facts.toolErrors++;
        }
      }
    }
    return facts;
  },
};

const codexFolder = (places: Places): string => join(places.codex ?? join(places.home, '.codex'), 'sessions');
const codex: LogReader = {
  locate(session, _root, places) {
    if (!/^[A-Za-z0-9-]+$/.test(session)) return undefined;
    return walk(codexFolder(places), 3, name => name.startsWith('rollout-') && name.endsWith(`-${session}.jsonl`))[0];
  },
  candidates: (_root, places) => newestFirst(walk(codexFolder(places), 3, name => name.startsWith('rollout-') && name.endsWith('.jsonl'))),
  // A rollout file is named rollout-<time>-<session>.jsonl, and the session is the last five groups.
  sessionOf: path => basename(path, '.jsonl').split('-').slice(-5).join('-'),
  read(path, since, patterns) {
    const facts = empty();
    for (const entry of lines(path)) {
      const payload = entry.payload ?? {}, time = entry.timestamp ? Date.parse(entry.timestamp) : 0;
      if (time) facts.lastActivity = Math.max(facts.lastActivity, time);
      if (payload.type === 'message' && payload.role === 'assistant') {
        const text = (payload.content ?? []).map((part: any) => part.text ?? '').join(' ');
        if (single(text)) facts.statements.push([time, text]);
      }
      if (entry.type === 'event_msg' && /error|limit|abort/i.test(payload.type ?? '') && time >= since) facts.events.push([time, `${payload.type} ${single(payload.message ?? '')}`]);
      if ((payload.type === 'custom_tool_call' || payload.type === 'function_call') && time >= since) {
        const input = String(payload.input ?? payload.arguments ?? '');
        // A shell command is given as cmd:"…" inside the call.
        for (const match of input.matchAll(/cmd\s*:\s*"((?:[^"\\]|\\.)*)"/g)) if (outsideIn(match[1]!.replace(/\\(.)/g, '$1'), patterns)) facts.outside.push([time, match[1]!]);
      }
    }
    return facts;
  },
};

const logReaders: Record<string, LogReader> = { claude, codex };
// The pointer can name the form of the logs. Without that, the name of the provider tells it.
export function logsOf(role: Role): string | undefined {
  if (role.logs) return Object.hasOwn(logReaders, role.logs) ? role.logs : undefined;
  const provider = (role.provider ?? '').toLowerCase();
  return /claude|anthropic/.test(provider) ? 'claude' : /codex|openai/.test(provider) ? 'codex' : undefined;
}

// A session finds its own log: it prints a marker with one command, and with a second command it asks which
// log holds that marker. At that moment the marker is in the log of that session and in no other.
export function findMarker(marker: string, root: string, places: Places): { logs: string; session: string }[] {
  if (!/^run-marker-[0-9a-f-]{36}$/.test(marker)) throw new Error('Give the marker that --mark printed');
  const found: { logs: string; session: string }[] = [];
  for (const [logs, reader] of Object.entries(logReaders)) {
    for (const path of reader.candidates(root, places).slice(0, 40)) if (readFileSync(path, 'utf8').includes(marker)) found.push({ logs, session: reader.sessionOf(path) });
  }
  return found;
}

function owed(root: string, documents: Record<string, unknown>): string[] {
  const rows: string[] = [];
  for (const key of ['plan', 'roadmap']) {
    const path = documents?.[key];
    if (typeof path !== 'string' || isAbsolute(path)) continue;
    let text: string;
    try { text = readFileSync(resolve(root, path), 'utf8'); } catch { continue; }
    const at = text.indexOf('**Owed to the user.**');
    if (at < 0) continue;
    for (const line of text.slice(at).split('\n').slice(1)) {
      if (line.trim() === '') { if (rows.length || /^\|/.test(line)) break; continue; }
      if (!line.startsWith('|')) break;
      const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
      if (/^-+$/.test(cells[0] ?? '') || cells[0] === 'Slice' || !cells[0]) continue;
      rows.push(`${cells[0]} | ${safe(cells[1], 150)}`);
    }
  }
  return rows;
}

// The orchestrator begins a message that needs the user with these words; the report puts that line first.
const needsUser = /^[\s*_>#-]*needs you:\s*(.+)$/i;

function roleLines(name: string, role: Role | undefined, inputs: Inputs, patterns: RegExp[], since: number, flags: string[]): { lines: string[]; quiet?: number; need?: string } {
  if (!role) return { lines: [`- ${name}: not recorded in the pointer`] };
  const head = `- ${name} (${[role.provider, role.model, role.effort].map(value => value ?? '?').join(' / ')})`;
  const logs = logsOf(role);
  if (!role.session) return { lines: [`${head}: no session identifier is recorded; its log is not read`] };
  if (!logs) return { lines: [`${head}: no reader for the logs of this provider; its log is not read`] };
  const reader = logReaders[logs]!;
  const path = reader.locate(role.session, inputs.root, inputs.places);
  if (!path) { flags.push(`the log of the ${name.toLowerCase()} is not found`); return { lines: [`${head}: the log of session ${role.session} is not found`] }; }
  const facts = reader.read(path, since, patterns);
  const quiet = Math.round((inputs.now - facts.lastActivity) / 60000);
  const fresh = (stamps: Stamp[]) => stamps.filter(([time]) => time >= since);
  const out = [`${head}: last activity ${quiet} min ago (${clock(facts.lastActivity)})`];
  if (logs === 'claude') {
    out.push(`  - refusals: by rule ${facts.refusedByRule.length} (${fresh(facts.refusedByRule).length} new), by classifier ${facts.refusedByClassifier.length} (${fresh(facts.refusedByClassifier).length} new) | tool errors in the window: ${facts.toolErrors}`);
    for (const [time, text] of [...fresh(facts.refusedByRule), ...fresh(facts.refusedByClassifier)].slice(0, 5)) out.push(`    - ${clock(time)} ${safe(text, 200)}`);
    if (fresh(facts.refusedByClassifier).length) flags.push(`${fresh(facts.refusedByClassifier).length} new refusal(s) by the classifier`);
    if (fresh(facts.refusedByRule).length) flags.push(`${fresh(facts.refusedByRule).length} new refusal(s) by a rule`);
  } else {
    out.push(`  - error or limit events in the window: ${facts.events.length}`);
    for (const [time, text] of facts.events.slice(0, 5)) out.push(`    - ${clock(time)} ${safe(text, 200)}`);
    if (facts.events.length) flags.push(`${facts.events.length} error or limit event(s) of the ${name.toLowerCase()}`);
  }
  out.push(`  - outside commands in the window: ${facts.outside.length || 'none'}`);
  for (const [time, text] of facts.outside.slice(0, 8)) out.push(`    - ${clock(time)} ${safe(text, 170)}`);
  for (const [time, text] of facts.statements.slice(-2)) out.push(`  - said ${clock(time)}: ${safe(text, 330)}`);
  const first = (facts.statements.at(-1)?.[1] ?? '').split('\n').find(line => line.trim() !== '') ?? '';
  const need = needsUser.exec(first)?.[1];
  return { lines: out, quiet, need: need === undefined ? undefined : safe(need.replace(/\*+$/, ''), 220) };
}

export function runReport(inputs: Inputs): string {
  const { root, now, minutes, git } = inputs;
  const since = now - minutes * 60000;
  const out: string[] = [`RUN REPORT ${new Date(now).toISOString().slice(0, 10)} ${clock(now)}, for the last ${minutes} minutes`];
  const flags: string[] = [];
  let need: string | undefined;
  // The first line answers one question: does the run need the user now.
  const withStatus = (): string => [need !== undefined ? `Needs you: ${need}` : flags.length ? `Check: ${flags.join('; ')}` : 'Nothing needs you.',
    ...(need !== undefined && flags.length ? [`Also check: ${flags.join('; ')}`] : []), ...out].join('\n') + '\n';
  let pointer: any;
  try { pointer = JSON.parse(readFileSync(resolve(root, 'plans', 'project-state.json'), 'utf8')); } catch { flags.push('the project pointer cannot be read'); return withStatus(); }
  const slice = pointer.currentSlice?.id, status = pointer.currentSlice?.status, execution = pointer.execution;
  out.push(`Slice ${slice ?? '?'}, ${status ?? '?'}, mode ${execution?.mode ?? '?'}`);
  try {
    const tasks = pointer.documents?.tasks;
    if (typeof tasks !== 'string' || isAbsolute(tasks)) throw new Error('the pointer selects no task document');
    out.push(...renderBrief(readFileSync(resolve(root, tasks), 'utf8'), slice, execution));
  } catch (error) { out.push(`- Progress: not available (${safe((error as Error).message, 160)})`); }

  const commits = git('log', `--since=${new Date(since).toISOString()}`, '--format=%cI%x09%s').split('\n').filter(Boolean);
  const changed = git('status', '--porcelain').split('\n').filter(Boolean).length;
  out.push(`- Repository: line ${git('branch', '--show-current').trim() || '(detached)'}, ${changed} uncommitted, ${commits.length} commit(s) in the window${commits.length ? `; latest: "${safe(commits[0]!.split('\t')[1], 110)}"` : ''}`);
  const rows = owed(root, pointer.documents ?? {});
  out.push(`- Owed to the user: ${rows.length || 'nothing is listed'}`, ...rows.map(row => `  - ${row}`));

  let patterns: RegExp[] = [];
  try { patterns = (JSON.parse(readFileSync(resolve(root, 'tooling', 'agents', 'run-report.json'), 'utf8')).outsideCommands as string[]).map(text => new RegExp(text)); } catch { /* No list of outside commands: none is named. */ }
  const sessions: Sessions = execution?.sessions ?? {};
  // In orchestrated mode the orchestrator speaks with the user; in each other mode the one working session does.
  const roles: [string, Role | undefined][] = execution?.mode === 'orchestrated' || sessions.orchestrator
    ? [['Orchestrator', sessions.orchestrator], ['Developer', sessions.developer]] : [['Developer', sessions.developer]];
  const quiet: number[] = [];
  for (const [name, role] of roles) {
    const told = roleLines(name, role, inputs, patterns, since, flags);
    out.push(...told.lines);
    if (told.quiet !== undefined) quiet.push(told.quiet);
    if (name === roles[0]![0]) need = told.need;
  }
  const reviewer = sessions.reviewer;
  out.push(`- Reviewer: ${reviewer ? [reviewer.provider, reviewer.model, reviewer.effort].map(value => value ?? '?').join(' / ') : 'not recorded in the pointer'}`);
  if (status === 'in-progress' && quiet.length === roles.length && Math.min(...quiet) >= 45) {
    flags.push(`${roles.length === 2 ? 'both conversations are' : 'the conversation is'} quiet for ${Math.min(...quiet)} minutes`);
  }
  return withStatus();
}
