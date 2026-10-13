import { createHash } from 'node:crypto';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { parseDocument } from 'yaml';

type Status = 'complete' | 'not-implementing' | 'inapplicable' | 'deferred' | 'active' | 'awaiting-review' | 'blocked' | 'held' | 'paused' | 'pending';
interface Treatment { token: string; label?: string; earns?: boolean; reason?: boolean }
// A step, a deliverable or a task placement in the progress state.
interface ReportNode {
  id: number | string;
  name?: string;
  task?: number | string;
  class?: string;
  weight: number;
  status?: Status;
  reason?: string;
  bullets?: string[];
  children?: ReportNode[];
}
interface ProgressState {
  unit: string;
  mode?: string;
  current: string;
  next: string;
  steps: ReportNode[];
  completed: string[];
  remaining: string[];
  blockers: string[];
  verification: string[];
  candidate: string[];
}
// A task section of the task document: its heading title and its action lines.
interface Task { title: string; bullets: string[]; unchecked: boolean }
type Tasks = Map<number | string, Task>;
interface Parsed { state: ProgressState; tasks: Tasks }
interface Execution { mode: string; scope: { slice: string; task?: number } }
// The fields of a Markdown tree node that the renderer reads.
interface MarkdownNode { type: string; value?: string; depth?: number; lang?: string | null; children?: MarkdownNode[] }

function requireValue(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function line(value: unknown, label: string): string {
  requireValue(typeof value === 'string' && value.trim() && !/[\r\n\u0000-\u001f]/u.test(value), `${label} must be nonempty single-line text`);
  return value;
}

function plain(node: MarkdownNode): string {
  return node.value ?? (node.children ?? []).map(plain).join('');
}

function walk<N extends { children?: N[] }>(node: N, visit: (node: N) => void): void {
  visit(node);
  for (const child of node.children ?? []) walk(child, visit);
}

export function parseProgress(markdown: string): Parsed {
  const tree = fromMarkdown(markdown);
  const blocks: MarkdownNode[] = [];
  walk<MarkdownNode>(tree, node => { if (node.type === 'code' && node.lang === 'vibe-progress') blocks.push(node); });
  requireValue(blocks.length === 1, 'Expected exactly one vibe-progress block');
  const document = parseDocument(blocks[0]!.value!, { uniqueKeys: true });
  requireValue(!document.errors.length, `Invalid progress YAML: ${document.errors.map(error => error.message).join('; ')}`);
  const state = document.toJS({ maxAliasCount: 0 });
  requireValue(state && typeof state === 'object' && !Array.isArray(state), 'Progress state must be an object');
  const tasks: Tasks = new Map();
  let task: Task | undefined;
  for (const node of tree.children) {
    if (node.type === 'heading' && node.depth <= 2) {
      task = undefined;
      const match = node.depth === 2 && /^Task ([1-9]\d*(?:\.[1-9]\d*)*|D[1-9]\d*[A-Z](?:\.[1-9]\d*)+) — (.+)$/.exec(plain(node));
      if (match) {
        const id = /^\d+$/.test(match[1]!) ? Number(match[1]) : match[1]!;
        requireValue(!tasks.has(id), `Duplicate Task ${id} heading`);
        task = { title: line(match[2], `Task ${id} title`), bullets: [], unchecked: false };
        tasks.set(id, task);
      }
    } else if (task && node.type === 'list') {
      walk<MarkdownNode>(node, item => {
        if (item.type !== 'listItem') return;
        const text = (item.children ?? []).filter(child => child.type !== 'list').map(plain).join(' ').replace(/\s+/g, ' ');
        task!.bullets.push(text);
        if (/^\[ \]/.test(text)) task!.unchecked = true;
      });
    }
  }
  requireValue(tasks.size > 0, 'No canonical Task headings found');
  return { state, tasks };
}

// Existing persisted status keys remain valid; held is the legacy BLOCKED spelling.
const statuses: Record<Status, Treatment> = {
  complete: { token: '[x]', label: 'COMPLETED', earns: true },
  'not-implementing': { token: '[x]', label: 'NOT IMPLEMENTING', earns: true, reason: true },
  inapplicable: { token: '[x]', label: 'NOT APPLICABLE', earns: true, reason: true },
  deferred: { token: '[-]', label: 'DEFERRED', reason: true },
  active: { token: '[…]', label: 'IN PROGRESS' },
  'awaiting-review': { token: '[!]', label: 'AWAITING REVIEW', reason: true },
  blocked: { token: '[!]', label: 'BLOCKED', reason: true },
  held: { token: '[!]', label: 'BLOCKED', reason: true },
  paused: { token: '[!]', label: 'PAUSED', reason: true },
  pending: { token: '[ ]' },
};
const summaryKeys = ['completed', 'remaining', 'blockers', 'verification', 'candidate'] as const;

// The report prints only text written for the user, and the task document
// stays free for agent detail. The mechanical part of its language rule:
// short sentences and short items.
const sentenceWords = 25;
const itemSentences = 3;
function readable(value: string, label: string): void {
  const sentences = value.replace(/^\[(?:x| |…|!|-)\]\s*/u, '').split(/(?<=[.!?;])\s+/u).filter(part => /[\p{L}\p{N}]/u.test(part));
  const longest = Math.max(0, ...sentences.map(part => part.split(/\s+/u).filter(word => /[\p{L}\p{N}]/u.test(word)).length));
  requireValue(sentences.length <= itemSentences && longest <= sentenceWords,
    `${label}: use at most ${itemSentences} sentences of at most ${sentenceWords} words (found ${sentences.length} sentences, longest ${longest} words)`);
}

export function validateProgress({ state, tasks }: Parsed, unit: string, execution?: Execution) {
  const text = (value: unknown, label: string) => { line(value, label); readable(value as string, label); return value; };
  requireValue(state.unit === unit, 'Progress unit must match the selected slice');
  requireValue(Object.keys(state).every(key => ['unit', 'mode', 'current', 'next', 'steps', ...summaryKeys].includes(key)), 'Unknown progress state field');
  line(state.unit, 'unit');
  for (const key of ['current', 'next'] as const) text(state[key], key);
  let mode = state.mode ?? 'supervised';
  let scope = '';
  if (execution !== undefined) {
    requireValue(execution && typeof execution === 'object' && !Array.isArray(execution), 'Invalid execution selection');
    requireValue(execution.scope?.slice === unit, 'Execution scope must match the selected slice');
    mode = execution.mode;
    scope = ` — scope: ${unit}`;
    if (execution.scope.task !== undefined) {
      requireValue(Number.isSafeInteger(execution.scope.task) && tasks.has(execution.scope.task), 'Execution scope must identify a canonical task');
      scope += ` / Task ${execution.scope.task}`;
    }
  }
  requireValue(['supervised', 'copilot', 'autonomous', 'orchestrated'].includes(mode), 'Invalid execution mode');
  for (const key of summaryKeys) {
    requireValue(Array.isArray(state[key]) && state[key].length > 0, `${key} must be a nonempty list`);
    state[key].forEach(value => text(value, key));
  }
  requireValue(Array.isArray(state.steps) && state.steps.length === 11, 'Expected all eleven ordered steps');
  const ids = new Set<number | string>();
  const placements = new Map([...tasks.keys()].map(id => [id, []] as [number | string, ReportNode[]]));
  let deliverable = 0;
  let deliverableSuffix = '';
  function validate(node: ReportNode, kind: 'step' | 'deliverable' | 'task'): void {
    requireValue(node && typeof node === 'object', 'Expected a report node');
    const fields = ['id', 'weight', 'status', 'reason', 'bullets', 'children', ...(kind === 'task' ? ['task'] : ['name']), ...(kind === 'step' ? ['class'] : [])];
    requireValue(Object.keys(node).every(key => fields.includes(key)), `${node.id}: unknown node field`);
    requireValue(!ids.has(node.id), `Duplicate node ${node.id}`);
    ids.add(node.id);
    requireValue(Number.isSafeInteger(node.weight) && node.weight >= 0, `${node.id}: invalid weight`);
    if (kind === 'task') {
      requireValue(typeof node.id === 'string' && /^[A-Za-z0-9-]+$/.test(node.id), 'Invalid placement identifier');
      requireValue(placements.has(node.task!), `${node.id}: missing canonical Task ${node.task}`);
      placements.get(node.task!)!.push(node);
      requireValue(node.name === undefined, `${node.id}: task title belongs in its heading`);
      const title = tasks.get(node.task!)!.title;
      requireValue(!Object.values(statuses).some(({ label }) => label && (title.toUpperCase().startsWith(label + ' — ') || title.toUpperCase().startsWith(label + ' - '))), `Task ${node.task}: treatment belongs in structured status, not the canonical title`);
      // The report prints the heading title.
      text(title, `Task ${node.task} title`);
    } else {
      text(node.name, `${node.id} name`);
      requireValue(node.task === undefined, `${node.id}: task reference only allowed on placements`);
    }
    if (node.bullets !== undefined) {
      requireValue(Array.isArray(node.bullets), `${node.id}: bullets must be a list`);
      node.bullets.forEach(value => text(value, `${node.id} bullet`));
    }
    if (node.children !== undefined) {
      requireValue(Array.isArray(node.children) && node.children.length > 0, `${node.id}: invalid children`);
      requireValue(node.status === undefined && node.reason === undefined, `${node.id}: parent status and reasons derive from children`);
      for (const child of node.children) {
        if (kind === 'step' && /^D[1-9]\d*[A-Z]?$/.test(child.id as string)) {
          const [, base, suffix = ''] = /^D([1-9]\d*)([A-Z]?)$/.exec(child.id as string)!;
          if (suffix) {
            requireValue(Number(base) === deliverable && suffix > deliverableSuffix, 'Inserted deliverables must follow their base in suffix order');
            deliverableSuffix = suffix;
          } else {
            requireValue(Number(base) === ++deliverable, 'Deliverables must be distinct and ordered');
            deliverableSuffix = '';
          }
          validate(child, 'deliverable');
        } else {
          // The report counts a deeper task on the line of its third-level task, so it must be below one.
          if (levelOf(child) > reportLevels) requireValue(kind === 'task' && levelOf(node) >= reportLevels, `${child.id}: a task deeper than ${reportLevels} levels belongs below its third-level task`);
          validate(child, 'task');
          // A sub-task keeps its parent's number, so the breakdown stays traceable.
          if (kind === 'task') requireValue(String(child.task).startsWith(`${node.task}.`), `${child.id}: sub-task reference must extend Task ${node.task}`);
        }
      }
      requireValue(node.children.reduce((sum, child) => sum + child.weight, 0) === node.weight, `${node.id}: child weights must sum to parent`);
    } else {
      requireValue(typeof node.status === 'string' && Object.hasOwn(statuses, node.status), `${node.id}: invalid status`);
      const requiresReason = statuses[node.status].reason;
      if (requiresReason || node.reason !== undefined) {
        text(node.reason, `${node.id} reason`);
      }
    }
  }
  state.steps.forEach((step, index) => {
    requireValue(step.id === index + 1, 'Expected distinct ordered step numbers 1–11');
    requireValue(['supporting', 'substantive'].includes(step.class!), `${step.id}: missing weight class`);
    validate(step, 'step');
  });
  for (const [id, nodes] of placements) {
    requireValue(nodes.length > 0, `Task ${id} has no report placement`);
    const taskComplete = nodes.some(node => statusOf(node) === 'complete')
      && nodes.every(node => statuses[statusOf(node)].earns);
    if (taskComplete) {
      requireValue(!tasks.get(id)!.unchecked, `Task ${id} is complete with unfinished required actions`);
    }
  }
  const total = state.steps.reduce((sum, step) => sum + step.weight, 0);
  const supporting = state.steps.filter(step => step.class === 'supporting').reduce((sum, step) => sum + step.weight, 0);
  requireValue(Number.isSafeInteger(total), 'Total weight must be a safe integer');
  requireValue(supporting * 100 <= total * 5, 'Supporting weight must not exceed five percent');
  return { state, tasks, total, modeLabel: `mode: ${mode}${scope}` };
}

// A line with lines below it has no status of its own. The report asks two things of it: does it count as
// done, and is it completed work. Children that share one treatment give it to the parent; a mix of
// resolved treatments is complete; each other mix is unfinished.
function statusOf(node: ReportNode): Status {
  if (!node.children) return node.status!;
  const states = node.children.map(statusOf);
  if (states.every(status => status === states[0])) return states[0]!;
  if (states.every(status => statuses[status].earns)) return 'complete';
  return 'active';
}

function earned(node: ReportNode): number {
  if (node.children) {
    return node.children.reduce((sum, child) => sum + earned(child), 0);
  }
  if (statuses[node.status!].earns) return node.weight;
  return 0;
}

export const generatedNotice = '<!-- Generated by @lets-vibe/agents progress; edit the linked task source, then regenerate. -->';

// Escape maintained prose; status tokens are rendered separately as inline code.
function markdownText(value: string): string {
  const escaped = value.replace(/[\\`*_{}\[\]<>#!|~]/g, character => `\\${character}`);
  // Leading list markers are prose here, not another level of report hierarchy.
  return escaped.replace(/^(\s*)([-+])/, '$1\\$2').replace(/^(\s*\d{1,9})([.)])(?=\s|$)/, '$1\\$2');
}

function markdownBullet(value: string): string {
  const status = /^(\[(?:x| |…|!|-)\])(?=\s|$)/u.exec(value);
  return status ? `\`${status[1]}\`${markdownText(value.slice(status[1]!.length))}` : markdownText(value);
}

// A report node's display identifier: T5, T5.2, D1 or D1A.1.
function labelOf(node: ReportNode): number | string {
  return node.task ? (typeof node.task === 'number' || /^\d+(?:\.\d+)+$/.test(node.task) ? `T${node.task}` : node.task) : node.id;
}

// The report prints a task number to three levels. A deeper sub-task
// has no line of its own; it is a part of its third-level task.
const reportLevels = 3;
// The levels of a task reference: 1 for 5 and for D1A.1, 3 for 5.2.1.
function levelOf(node: ReportNode): number {
  const parts = String(node.task).split('.');
  return /^D/.test(parts[0]!) ? parts.length - 1 : parts.length;
}
// The display identifier of the third-level task that a deeper sub-task belongs to.
function thirdLevelOf(node: ReportNode): number | string {
  const parts = String(node.task).split('.');
  return labelOf({ ...node, task: parts.slice(0, parts.length - levelOf(node) + reportLevels).join('.') });
}

// Each leaf of the progress state with its status and the line that tells a change of it:
// the box, the deliverable or step, the task, the status and, for a hold, the reason.
function leafLines({ state, tasks }: Parsed): { id: string; status: Status; line: string }[] {
  const leaves: { id: string; status: Status; line: string }[] = [];
  const visit = (node: ReportNode, above: string): void => {
    const title = node.task ? tasks.get(node.task)!.title : node.name!;
    const own = !node.task ? `${typeof node.id === 'number' ? `Step ${node.id}` : node.id} ${title}`
      : levelOf(node) > reportLevels ? `${thirdLevelOf(node)} › ${title}` : `${labelOf(node)} ${title}`;
    if (node.children) { for (const child of node.children) visit(child, node.task ? above : own); return; }
    const told = statuses[node.status!];
    const word = node.status === 'complete' ? 'COMPLETE' : told.label ?? 'NOT STARTED';
    // A step has a number and a placement has a text; the mark keeps the two apart when both read the same.
    leaves.push({ id: typeof node.id === 'number' ? `#${node.id}` : node.id, status: node.status!, line: `${told.token} ${above ? `${above} › ` : ''}${own} — ${word}${told.reason && node.reason ? `: ${node.reason}` : ''}` });
  };
  state.steps.forEach(step => visit(step, ''));
  return leaves;
}

const leafStatuses = /^<!-- Leaf statuses: (.+) -->$/m;

// What a write tells the session: one line for each leaf whose status is not the one in the saved report.
// A report with no saved statuses, for example a first report, has nothing to compare with.
export function statusChanges(previous: string | undefined, markdown: string, unit: string, execution?: Execution): string[] {
  let before: Record<string, unknown>;
  try { before = JSON.parse(leafStatuses.exec(previous ?? '')![1]!); } catch { return []; }
  // A hidden line that somebody altered is not a list of statuses.
  if (!before || typeof before !== 'object' || Array.isArray(before)) return [];
  return leafLines(validateProgress(parseProgress(markdown), unit, execution))
    .filter(leaf => (before[leaf.id] ?? 'pending') !== leaf.status).map(leaf => leaf.line);
}

// The short form for a reader who follows a run: the headline, then only the branch of the tree that is in
// work or on hold, as nested bullets. Plain lines for a terminal; nothing is saved.
export function renderBrief(markdown: string, unit: string, execution?: Execution): string[] {
  const { state, tasks, total } = validateProgress(parseProgress(markdown), unit, execution);
  const completed = state.steps.reduce((sum, step) => sum + earned(step), 0);
  const percent = total === 0 ? undefined : Number(100n * BigInt(completed) / BigInt(total));
  const bar = percent === undefined ? 'percentage unavailable: weights are not agreed'
    : `${'▓'.repeat(Math.floor(percent / 5))}${'·'.repeat(20 - Math.floor(percent / 5))} ${percent}%`;
  const lines = [`${unit}  ${bar} — ${state.current}; next: ${state.next}`];
  const told = (status: Status): boolean => ['active', 'awaiting-review', 'blocked', 'held', 'paused'].includes(status);
  const live = (node: ReportNode): boolean => node.children ? node.children.some(live) : told(node.status!);
  const emit = (node: ReportNode, depth: number): void => {
    if (!live(node)) return;
    const task = node.task ? tasks.get(node.task) : undefined;
    const label = typeof node.id === 'number' ? `Step ${node.id}` : labelOf(node);
    const name = task?.title ?? node.name!;
    let line = `${label} ${name}`;
    if (node.children) {
      line += ` [${node.children.filter(child => statuses[statusOf(child)].earns).length} of ${node.children.length}]`;
    } else {
      const treatment = statuses[node.status!];
      const actions = task?.bullets.filter(bullet => /^\[(?:x| |…|!|-)\](?=\s|$)/u.test(bullet)) ?? [];
      line += ` — ${treatment.label}${actions.length ? ` (${actions.filter(bullet => bullet.startsWith('[x]')).length} of ${actions.length} actions done)` : ''}${treatment.reason && node.reason ? `: ${node.reason}` : ''}`;
    }
    lines.push(`${'  '.repeat(depth)}- ${line}`);
    node.children?.forEach(child => emit(child, depth + 1));
  };
  state.steps.forEach(step => emit(step, 0));
  if (lines.length === 1) lines.push('- Nothing is marked in work or on hold.');
  return lines;
}

export function renderProgress(markdown: string, unit: string, sourceName = 'todo.md', execution?: Execution): string {
  const validated = validateProgress(parseProgress(markdown), unit, execution);
  const { state, tasks, total, modeLabel } = validated;
  const completed = state.steps.reduce((sum, step) => sum + earned(step), 0);
  let headline;
  if (total === 0) {
    // The plan step creates the report before the user agrees the weights.
    headline = `${markdownText(unit)} — percentage unavailable: weights are not agreed; current: ${markdownText(state.current)}; next: ${markdownText(state.next)}`;
  } else {
    const percent = Number(100n * BigInt(completed) / BigInt(total));
    const cells = Math.floor(percent / 5);
    const bar = `${'▓'.repeat(cells)}${'·'.repeat(20 - cells)} ${percent}%`;
    headline = `${markdownText(unit)}  \`${bar}\` — ${markdownText(state.current)}; next: ${markdownText(state.next)}`;
  }
  const lines = [headline, '', markdownText(modeLabel), ''];
  // Name the leaves in work and on hold first, so a stale status is easy to see.
  const working: (number | string)[] = [];
  const waiting: string[] = [];
  const titleOf = (node: ReportNode): string => tasks.get(node.task!)!.title;
  // Count the checklist actions; their text stays in the task document.
  const withActions = (name: string, task: Task): string => {
    const actions = task.bullets.filter(bullet => /^\[(?:x| |…|!|-)\](?=\s|$)/u.test(bullet));
    return actions.length ? `${name} (${actions.filter(bullet => bullet.startsWith('[x]')).length} of ${actions.length} actions done)` : name;
  };
  state.steps.forEach(step => walk(step, node => {
    if (node.children) return;
    const label = node.task ? (levelOf(node) > reportLevels ? `${thirdLevelOf(node)} › ${titleOf(node)}` : labelOf(node))
      : typeof node.id === 'number' ? `Step ${node.id}` : node.id;
    if (node.status === 'active') working.push(label);
    else if (['paused', 'blocked', 'held', 'awaiting-review'].includes(node.status!)) waiting.push(`${label} (${statuses[node.status!].label})`);
  }));
  if (working.length) lines.push(markdownText(`In progress now: ${working.join(', ')}`), '');
  // More than 3 is seldom true. The report says so and refuses nothing: the writer knows what is in work.
  if (working.length > 3) lines.push(markdownText(`Check: ${working.length} tasks show IN PROGRESS. Put on hold each task that is not in work now.`), '');
  if (waiting.length) lines.push(markdownText(`On hold: ${waiting.join(', ')}`), '');
  function render(node: ReportNode, indent = '', step = false): void {
    const task = node.task ? tasks.get(node.task) : undefined;
    let name = task?.title ?? node.name!;
    const id = labelOf(node);
    const status = statusOf(node);
    if (task && !node.children && !['not-implementing', 'inapplicable'].includes(status)) name = withActions(name, task);
    // The sub-tasks deeper than three levels are the parts of this task: count the ones that are not divided again.
    const deeper = task ? node.children?.filter(child => levelOf(child) > reportLevels) ?? [] : [];
    const parts: ReportNode[] = [];
    for (const child of deeper) walk(child, part => { if (!part.children) parts.push(part); });
    const marker = step ? `${id}. ` : '- ';
    let token = statuses[status].token;
    let word = statuses[status].label;
    let reason = node.reason;
    if (node.children) {
      // A line with lines below it has no status word and no reason of its own. Its box shows how many
      // of them are done: its direct children, or the parts of a third-level task.
      const counted = parts.length ? parts : node.children;
      const done = counted.filter(child => statuses[statusOf(child)].earns).length;
      let started = false;
      walk(node, child => { if (!child.children && child.status !== 'pending') started = true; });
      token = done === counted.length ? statuses.complete.token : started ? `[${done} of ${counted.length}${parts.length ? ' parts' : ''}]` : statuses.pending.token;
      word = undefined;
      reason = undefined;
    } else if (status === 'complete') {
      // The checked box says it.
      word = undefined;
    }
    const title = `${word ? `${word} — ` : ''}${name}${reason ? ` — ${reason}` : ''}`;
    lines.push(`${indent}${marker}${step ? '' : `${id}. `}\`${token}\` ${markdownText(title)}`, '');
    // Align child content with the text after the real Markdown list marker.
    const childIndent = indent + ' '.repeat(marker.length);
    // Name each part that has a status to tell, by its title and with no number: a part in work,
    // and a part on hold, deferred or resolved with no implementation, with its reason.
    for (const part of parts) {
      const told = statuses[part.status!];
      if (part.status === 'active') lines.push(`${childIndent}- \`${told.token}\` ${markdownText(`${told.label} — ${withActions(titleOf(part), tasks.get(part.task!)!)}`)}`, '');
      else if (told.reason) lines.push(`${childIndent}- \`${told.token}\` ${markdownText(`${told.label} — ${titleOf(part)} — ${part.reason}`)}`, '');
    }
    node.children?.filter(child => !deeper.includes(child)).forEach(child => render(child, childIndent));
    for (const bullet of node.bullets ?? []) lines.push(`${childIndent}- ${markdownBullet(bullet)}`, '');
  }
  state.steps.forEach(step => render(step, '', true));
  lines.push(total === 0 ? 'Accepted weight: not agreed. The report shows a percentage after the weights are agreed.' : `Accepted weight: ${completed}/${total}. This measures accepted completion, not effort.`, '');
  for (const [label, values] of [
    ['Completed', state.completed], ['Current', [state.current]], ['Remaining', state.remaining],
    ['Blockers', state.blockers], ['Next checkpoint', [state.next]], ['Verification', state.verification], ['Candidate', state.candidate],
  ] as [string, string[]][]) lines.push(`**${label}:**`, '', ...values.map(value => `- ${markdownText(value)}`), '');
  // The report keeps the status of each leaf, so that the next write can tell what changed.
  const saved = `\n<!-- Leaf statuses: ${JSON.stringify(Object.fromEntries(leafLines(validated).map(leaf => [leaf.id, leaf.status]))).replaceAll('>', '\\u003e')} -->`;
  return `${generatedNotice}\n<!-- Task source SHA-256: ${createHash('sha256').update(markdown).digest('hex')} -->${saved}\n\nSource: [${sourceName.replace(/[\[\]]/g, '')}](${encodeURIComponent(sourceName)}). Do not edit this generated view.\n\n${lines.join('\n')}`;
}
