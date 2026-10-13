import assert from 'node:assert/strict';
import test from 'node:test';
import type { TestContext } from 'node:test';
import { parseProgress } from '../lib/progress.ts';

const source = '```vibe-progress\nunit: U1\n```\n\n## Task 1 — Canonical title\n\n- [ ] Required action.\n';

test('reads one state block and canonical task titles and action bullets', () => {
  const { state, tasks } = parseProgress(source);
  assert.equal(state.unit, 'U1');
  assert.deepEqual(tasks.get(1), { title: 'Canonical title', bullets: ['[ ] Required action.'], unchecked: true });
});

test('rejects absent/duplicate blocks, duplicate keys and duplicate task headings', () => {
  for (const input of ['', source + source, source.replace('unit: U1', 'unit: U1\nunit: U2'), source + '\n## Task 1 — Duplicate\n']) {
    assert.throws(() => parseProgress(input));
  }
});

import { stringify } from 'yaml';
import { fromMarkdown } from 'mdast-util-from-markdown';

function nodeText(node: any): string {
  return node.value ?? (node.children ?? []).map(nodeText).join('');
}

function reportNodes(markdown: string): any[] {
  return (fromMarkdown(markdown).children as any[]).find((node: any) => node.type === 'list' && node.ordered).children;
}
import { renderProgress } from '../lib/progress.ts';

function fixtureState(): any {
  return {
    unit: 'U1', mode: 'supervised', current: 'Build report', next: 'Test group',
    completed: ['Inputs accepted.'], remaining: ['D1 review.'], blockers: ['User acceptance pending.'],
    verification: ['Synthetic fixture.'], candidate: ['Unstaged.'],
    steps: Array.from({ length: 11 }, (_, index) => ({
      id: index + 1, name: `Authored step ${index + 1}`, class: 'substantive',
      weight: index < 3 ? 1 : index === 5 ? 95 : index === 7 || index === 8 ? 1 : 0,
      ...(index === 5 ? { children: [{ id: 'D1', name: 'Full deliverable name', weight: 95, children: [{ id: 'build', task: 1, weight: 95, status: 'active' }] }] }
        : index === 7 || index === 8 ? { children: [{ id: `proof-${index}`, task: 2, weight: 1, status: 'pending' }] }
        : { status: index < 3 ? 'complete' : 'pending' }),
    })),
  };
}
function documentFor(state = fixtureState(), checked = false) {
  return `\`\`\`vibe-progress\n${stringify(state)}\`\`\`\n\n## Task 1 — Full canonical title\n\n- [${checked ? 'x' : ' '}] Implement feature.\n- Preserve existing behavior.\n\n## Task 2 — Proof and review\n\n- [${checked ? 'x' : ' '}] Verify and review.\n`;
}

test('renders the eleven steps as native nested lists, with the bar and one line for each placement', () => {
  const input = documentFor();
  const output = renderProgress(input, 'U1');
  assert.equal(output, renderProgress(input, 'U1'));
  assert.match(output, /·{20} 3%/);
  const steps = reportNodes(output);
  assert.equal(steps.length, 11);
  for (let index = 0; index < steps.length; index++) {
    assert.equal(nodeText(steps[index].children[0]), `${index < 3 ? '[x]' : index === 5 ? '[0 of 1]' : '[ ]'} Authored step ${index + 1}`);
  }
  const deliverable = steps[5].children.find((node: any) => node.type === 'list').children[0];
  assert.equal(nodeText(deliverable.children[0]), 'D1. [0 of 1] Full deliverable name');
  const task = deliverable.children.find((node: any) => node.type === 'list').children[0];
  assert.equal(nodeText(task.children[0]), 'T1. […] IN PROGRESS — Full canonical title (0 of 1 actions done)');
  // The action lines stay in the task document: the task has no list below it.
  assert.equal(task.children.find((node: any) => node.type === 'list'), undefined);
  assert.equal((output.match(/T2\. /g) ?? []).length, 2);
  assert.match(output, /^Accepted weight: 3\/100\. /m);
});

test('rejects incomplete coverage, invalid state, allocations and action contradictions', () => {
  const edits: ((s: any) => unknown)[] = [
    s => s.steps.pop(), s => s.steps[1].id = 1, s => s.steps[0].weight = -1,
    s => s.steps[5].weight++, s => s.steps[5].children[0].children[0].task = 3,
    s => s.steps[8].children[0].id = 'proof-7', s => s.steps[0].status = 'unknown',
    s => s.steps[0].status = ['complete'], s => s.steps[5].children[0].children[0].status = ['held'],
    s => s.steps[5].status = 'complete', s => s.steps[0].status = 'held',
    s => s.steps[5].children[0].children[0].status = 'complete',
    s => s.steps[5].class = 'supporting',
    s => { s.steps[7].children[0].task = 1; s.steps[8].children[0].task = 1; },
  ];
  for (const edit of edits) { const state = fixtureState(); edit(state); assert.throws(() => renderProgress(documentFor(state), 'U1')); }
  assert.throws(() => renderProgress(documentFor(), 'U2'), /selected slice/);
});

test('reads held as BLOCKED, counts a resolved task as done and grants a deferred task no completion', () => {
  const state = fixtureState();
  const child = state.steps[5].children[0].children[0];
  child.reason = 'Fixture disposition';
  for (const [status, line, box] of [
    ['held', '[!] BLOCKED — Full canonical title (0 of 1 actions done)', '[0 of 1]'],
    ['inapplicable', '[x] NOT APPLICABLE — Full canonical title', '[x]'],
  ]) {
    child.status = status;
    const step = reportNodes(renderProgress(documentFor(state), 'U1'))[5];
    const deliverable = step.children.find((node: any) => node.type === 'list').children[0];
    const task = deliverable.children.find((node: any) => node.type === 'list').children[0];
    // The word and the reason are on the task. The lines above it show how many of their lines are done.
    assert.equal(nodeText(task.children[0]), `T1. ${line} — Fixture disposition`);
    assert.equal(nodeText(deliverable.children[0]), `D1. ${box} Full deliverable name`);
    assert.equal(nodeText(step.children[0]), `${box} Authored step 6`);
  }
  child.status = 'deferred';
  const deferred = renderProgress(documentFor(state), 'U1');
  assert.match(deferred, /3%/);
  assert.match(deferred, /T1\. `\[-\]` DEFERRED — Full canonical title \(0 of 1 actions done\) — Fixture disposition$/m);
  assert.match(deferred, /D1\. `\[0 of 1\]` Full deliverable name$/m);
});

test('separate placements earn only their own weights; renders 5, 99 and 100 percent', () => {
  const state = fixtureState();
  state.steps[7].children[0].status = 'complete';
  assert.match(renderProgress(documentFor(state), 'U1'), / 4%/);
  state.steps[8].children[0].status = 'complete';
  assert.throws(() => renderProgress(documentFor(state), 'U1'), /unfinished/);
  assert.match(renderProgress(documentFor(state, true), 'U1'), /▓·{19} 5%/);
  state.steps[8].children[0].status = 'pending';
  state.steps[5].children[0].children[0].status = 'complete';
  assert.match(renderProgress(documentFor(state, true), 'U1'), /▓{19}· 99%/);
  state.steps[8].children[0].status = 'complete';
  assert.match(renderProgress(documentFor(state, true), 'U1'), /▓{20} 100%/);
});

import { mkdtemp, mkdir, readFile, writeFile, stat, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../progress-report.ts', import.meta.url));
async function workspace(t: TestContext) {
  const root = await mkdtemp(join(tmpdir(), 'vibe-progress-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'tasks'));
  await mkdir(join(root, 'plans'));
  const sourcePath = join(root, 'tasks', 'todo.md');
  const output = join(root, 'tasks', 'progress.md');
  const pointer = JSON.stringify({ currentSlice: { id: 'U1' }, documents: { tasks: 'tasks/todo.md' } });
  await writeFile(join(root, 'plans', 'project-state.json'), pointer);
  await writeFile(sourcePath, documentFor());
  const run = (...args: string[]) => spawnSync(process.execPath, [cli, '--root', root, ...args], { encoding: 'utf8' });
  return { root, sourcePath, output, pointer, run };
}

test('CLI stdout, write, no-op and freshness cycle preserve the source and pointer', async t => {
  const fixture = await workspace(t);
  const { root, sourcePath, output, pointer, run } = fixture;
  assert.equal(run('--check').status, 1);
  const stdout = run();
  assert.equal(stdout.status, 0, stdout.stderr);
  assert.match(stdout.stdout, / 3%/);
  await assert.rejects(stat(output), { code: 'ENOENT' });
  assert.equal(run('--write').status, 0);
  assert.equal(await readFile(output, 'utf8'), stdout.stdout);
  assert.equal(run('--check').status, 0);
  const before = await stat(output, { bigint: true });
  assert.equal(run('--write').status, 0);
  const after = await stat(output, { bigint: true });
  assert.equal(after.ino, before.ino);
  assert.equal(after.mtimeNs, before.mtimeNs);
  assert.equal(await readFile(sourcePath, 'utf8'), documentFor());
  assert.equal(await readFile(join(root, 'plans', 'project-state.json'), 'utf8'), pointer);
  await writeFile(sourcePath, documentFor().replace('Build report', 'Review report'));
  const stale = run('--check');
  assert.equal(stale.status, 1);
  assert.match(stale.stderr, /stale or altered.*\nRegenerate:/);
  assert.equal(await readFile(output, 'utf8'), stdout.stdout);
  assert.equal(run('--write').status, 0);
  assert.equal(run('--check').status, 0);
  assert.match(await readFile(output, 'utf8'), /Review report/);
  await writeFile(output, (await readFile(output, 'utf8')) + 'manual alteration\n');
  assert.equal(run('--check').status, 1);
  assert.equal(run('--write').status, 0);
  assert.equal(run('--check').status, 0);
});

test('invalid source, conflicting flags and unrelated destinations do not overwrite output', async t => {
  const { sourcePath, output, run } = await workspace(t);
  assert.equal(run('--write').status, 0);
  const original = await readFile(output, 'utf8');
  await writeFile(sourcePath, documentFor().replace('weight: 95', 'weight: -1'));
  for (const args of [[], ['--write'], ['--check'], ['--check', '--write'], ['--unknown']]) assert.equal(run(...args).status, 1);
  assert.equal(await readFile(output, 'utf8'), original);
  await writeFile(sourcePath, documentFor());
  await writeFile(output, 'User-owned notes\n');
  assert.match(run('--write').stderr, /non-generated/);
  assert.equal(await readFile(output, 'utf8'), 'User-owned notes\n');
});

test('refuses symlink output without changing its target', async t => {
  const { root, output, run } = await workspace(t);
  const target = join(root, 'elsewhere.md');
  await writeFile(target, 'Unrelated content');
  await symlink(target, output);
  assert.equal(run('--write').status, 1);
  assert.equal(run('--check').status, 1);
  assert.equal(await readFile(target, 'utf8'), 'Unrelated content');
});

test('renders an unweighted plan-step report; rejects malformed allocations; zero-weight obligations remain visible', () => {
  const zero = fixtureState();
  const clearWeights = (node: any): void => { node.weight = 0; node.children?.forEach(clearWeights); };
  zero.steps.forEach(clearWeights);
  const unweighted = renderProgress(documentFor(zero), 'U1');
  assert.match(unweighted, /^U1 — percentage unavailable: weights are not agreed; current: Build report; next: Test group$/m);
  assert.doesNotMatch(unweighted, /[▓·]|%/);
  assert.match(unweighted, /Accepted weight: not agreed\./);
  assert.equal(reportNodes(unweighted).length, 11);
  assert.match(unweighted, /T1\. `\[…\]` IN PROGRESS — Full canonical title/);
  const state = fixtureState();
  state.steps.slice(0, 3).forEach((step: any) => { step.status = 'pending'; });
  const output = renderProgress(documentFor(state), 'U1');
  assert.match(output, /·{20} 0%/);
  assert.equal(nodeText(reportNodes(output)[10]), '[ ] Authored step 11');
  state.steps[5].children = [];
  assert.throws(() => renderProgress(documentFor(state), 'U1'), /children/);
});

test('CLI freshness detects supporting prose edits and canonical title changes', async t => {
  const { sourcePath, output, run } = await workspace(t);
  assert.equal(run('--write').status, 0);
  const previous = await readFile(output, 'utf8');
  await writeFile(sourcePath, documentFor() + '\nVerification: an updated observation.\n');
  assert.equal(run('--check').status, 1);
  assert.equal(await readFile(output, 'utf8'), previous);
  assert.equal(run('--write').status, 0);
  assert.equal(run('--check').status, 0);
  await writeFile(sourcePath, documentFor().replace('Full canonical title', 'Revised canonical title'));
  assert.equal(run('--check').status, 1);
  assert.equal(run('--write').status, 0);
  assert.match(nodeText(reportNodes(await readFile(output, 'utf8'))[5]), /T1\. \[…\] IN PROGRESS — Revised canonical title/);
  assert.equal(run('--check').status, 0);
});

test('reports the pointer mode and scope while keeping legacy reports readable', () => {
  const state = fixtureState();
  delete state.mode;
  for (const mode of ['supervised', 'copilot', 'autonomous', 'orchestrated']) {
    const execution = { mode, scope: { slice: 'U1' } };
    assert.match(renderProgress(documentFor(state), 'U1', 'todo.md', execution), new RegExp(`mode: ${mode} — scope: U1`));
  }
  const execution = { mode: 'autonomous', scope: { slice: 'U1', task: 1 } };
  assert.match(renderProgress(documentFor(), 'U1', 'todo.md', execution), /mode: autonomous — scope: U1 \/ Task 1/);
  assert.match(renderProgress(documentFor(), 'U1'), /mode: supervised/);
  assert.match(renderProgress(documentFor(state), 'U1'), /mode: supervised/);
});

test('refuses a malformed execution selection or a scope outside the selected tasks', () => {
  for (const execution of [
    null,
    { mode: 'unknown', scope: { slice: 'U1' } },
    { mode: 'autonomous' },
    { mode: 'autonomous', scope: { slice: 'U2' } },
    { mode: 'autonomous', scope: { slice: 'U1', task: 3 } },
    { mode: 'autonomous', scope: { slice: 'U1', task: '1' } },
  ]) {
    assert.throws(() => renderProgress(documentFor(), 'U1', 'todo.md', execution as any), /execution|scope/i);
  }
});

test('CLI names the pointer in the plans folder when it is missing', async t => {
  const { root, run } = await workspace(t);
  await rm(join(root, 'plans', 'project-state.json'));
  const missing = run();
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /plans\/project-state\.json/);
});

test('CLI freshness follows persisted mode and task scope changes across separate invocations', async t => {
  const { root, sourcePath, output, pointer, run } = await workspace(t);
  assert.equal(run('--write').status, 0);
  const originalSource = await readFile(sourcePath, 'utf8');
  const selected = JSON.parse(pointer);
  selected.execution = { mode: 'copilot', scope: { slice: 'U1' } };
  await writeFile(join(root, 'plans', 'project-state.json'), JSON.stringify(selected));
  assert.equal(run('--check').status, 1);
  assert.equal(run('--write').status, 0);
  assert.equal(run('--check').status, 0);
  assert.match(await readFile(output, 'utf8'), /mode: copilot — scope: U1/);
  selected.execution.scope.task = 1;
  await writeFile(join(root, 'plans', 'project-state.json'), JSON.stringify(selected));
  assert.equal(run('--check').status, 1);
  assert.equal(run('--write').status, 0);
  assert.equal(run('--check').status, 0);
  assert.match(await readFile(output, 'utf8'), /mode: copilot — scope: U1 \/ Task 1/);
  assert.equal(await readFile(sourcePath, 'utf8'), originalSource);
});


test('a note stays one list item and keeps its own box, and Markdown-like text retains its literal meaning', () => {
  // A note of the greatest length that the report permits: 3 sentences of 24 words or fewer.
  const prose = 'Preserve this complete sentence when the preview panel is resized, so that the long note of a placement stays one item of its list. '
    + 'The second sentence of the note is as long as the first one, and it must stay in the same item of the list. '
    + 'The third sentence completes the note, which is as long as the rules of the report permit for one item of a list.';
  const literal = '[x] Keep *stars*, `code`, <tags>, ![images](x), and \\paths as text.';
  const open = '[ ] A note with an empty box, which is not an action of the task.';
  const leadingMarkers = ['1. Literal numbered prose', '2) Parenthesized numbering', '- Literal hyphen prose', '+ Literal plus prose', '---'];
  const state = fixtureState();
  state.steps[5].children[0].children[0].bullets = [prose, literal, open, ...leadingMarkers];
  state.steps[10].bullets = [prose];
  const tree: any = fromMarkdown(renderProgress(documentFor(state), 'U1'));
  const list = tree.children.find((node: any) => node.type === 'list' && node.ordered);
  const task = list.children[5].children.find((node: any) => node.type === 'list').children[0]
    .children.find((node: any) => node.type === 'list').children[0];
  const bullets = task.children.find((node: any) => node.type === 'list').children;
  // The notes of the placement are the only lines below the task: the action lines stay in the task document.
  assert.equal(bullets.length, 3 + leadingMarkers.length);
  assert.equal(nodeText(bullets[0]), prose);
  assert.equal(nodeText(bullets[1]), literal);
  assert.deepEqual(bullets[1].children[0].children.map((node: any) => node.type), ['inlineCode', 'text']);
  assert.equal(nodeText(bullets[2]), open);
  assert.equal(bullets[2].children[0].children[0].value, '[ ]');
  for (const [index, value] of leadingMarkers.entries()) {
    assert.equal(bullets[index + 3].children[0].type, 'paragraph');
    assert.equal(nodeText(bullets[index + 3]), value);
  }
  assert.equal(nodeText(list.children[10].children.find((node: any) => node.type === 'list').children[0]), prose);
});


test('step, deliverable and task boxes render as literal inline code', () => {
  const state = fixtureState();
  const statuses = ['complete', 'active', 'pending', 'held', 'inapplicable', 'deferred'];
  const tokens = ['[x]', '[…]', '[ ]', '[!]', '[x]', '[-]'];
  for (let index = 0; index < statuses.length; index++) {
    state.steps[0].status = statuses[index];
    state.steps[0].reason = 'Fixture disposition';
    const steps = reportNodes(renderProgress(documentFor(state), 'U1'));
    assert.equal(steps[0].children[0].children[0].type, 'inlineCode');
    assert.equal(steps[0].children[0].children[0].value, tokens[index]);
    const deliverable = steps[5].children.find((node: any) => node.type === 'list').children[0];
    const task = deliverable.children.find((node: any) => node.type === 'list').children[0];
    // A count is a box too.
    assert.equal(deliverable.children[0].children.find((child: any) => child.type === 'inlineCode').value, '[0 of 1]');
    assert.equal(task.children[0].children.find((child: any) => child.type === 'inlineCode').value, '[…]');
  }
});


test('inserted deliverables preserve task IDs, checklist acceptance and the weighted baseline', () => {
  const state = fixtureState();
  const baseline = renderProgress(documentFor(state), 'U1');
  state.steps[5].children.push({ id: 'D1A', name: 'Required correction', weight: 0,
    children: [{ id: 'inserted-task', task: 'D1A.1', weight: 0, status: 'held', reason: 'Evidence pending' }] });
  const source = () => documentFor(state) + '\n## Task D1A.1 — Qualify correction\n\n- [ ] Exercise boundary.\n';
  const output = renderProgress(source(), 'U1');
  assert.equal(output.match(/Accepted weight: .+/)![0], baseline.match(/Accepted weight: .+/)![0]);
  assert.match(output, /D1A\. `\[0 of 1\]` Required correction$/m);
  assert.match(output, /D1A\.1\. `\[!\]` BLOCKED — Qualify correction \(0 of 1 actions done\) — Evidence pending$/m);
  assert.doesNotMatch(output, /Exercise boundary/);
  state.steps[5].children[1].children[0].status = 'complete';
  assert.throws(() => renderProgress(source(), 'U1'), /unfinished required actions/);
  state.steps[5].children[1].children[0].status = 'pending';
  state.steps[5].children[1].id = 'D2A';
  assert.throws(() => renderProgress(source(), 'U1'), /follow their base/);
});


test('decimal task prerequisites render canonically and enforce unfinished acceptance without reweighting', () => {
  const state = fixtureState();
  const baseline = renderProgress(documentFor(state), 'U1');
  const placement = { id: 'decimal-task', task: '27.1', weight: 0, status: 'pending' };
  state.steps[5].children[0].children.push(placement);
  const source = () => documentFor(state) + '\n## Task 27.1 — Approved UI plugin\n\n- [ ] Verify plugin lifecycle.\n';
  const output = renderProgress(source(), 'U1');
  assert.match(output, /T27\.1\. `\[ \]` Approved UI plugin \(0 of 1 actions done\)$/m);
  assert.doesNotMatch(output, /Verify plugin lifecycle/);
  assert.equal(output.match(/Accepted weight: .+/)![0], baseline.match(/Accepted weight: .+/)![0]);
  placement.status = 'complete';
  assert.throws(() => renderProgress(source(), 'U1'), /unfinished required actions/);
  assert.match(renderProgress(source().replace('[ ] Verify plugin', '[x] Verify plugin'), 'U1'), /T27\.1\. `\[x\]` Approved UI plugin \(1 of 1 actions done\)$/m);
});


test('a task resolved with no implementation needs a reason, earns its weight and claims no executed action', () => {
  const state = fixtureState();
  const child = state.steps[5].children[0].children[0];
  child.status = 'not-implementing';
  assert.throws(() => renderProgress(documentFor(state), 'U1'), /reason/);
  child.reason = 'Accepted comparison found no useful correction.';
  const output = renderProgress(documentFor(state), 'U1');
  assert.match(output, / 98%/);
  assert.match(output, /^Accepted weight: 98\/100\. /m);
  assert.match(output, /T1\. `\[x\]` NOT IMPLEMENTING — Full canonical title — Accepted comparison found no useful correction\.$/m);
  // Its open action is not copied and not counted, so the report does not say that it ran.
  assert.doesNotMatch(output, /Implement feature|Full canonical title \(/);
  // The notes of its placement keep the boxes that the writer gave them: the resolution changes no note.
  child.bullets = ['[x] Reviewed source evidence.', '[ ] A note with an empty box.'];
  for (const status of ['not-implementing', 'inapplicable']) {
    child.status = status;
    const noted = renderProgress(documentFor(state), 'U1');
    assert.match(noted, /^ +- `\[x\]` Reviewed source evidence\.$/m);
    assert.match(noted, /^ +- `\[ \]` A note with an empty box\.$/m);
  }
  child.status = 'complete';
  assert.throws(() => renderProgress(documentFor(state), 'U1'), /unfinished/);
});

test('unresolved treatments require reasons, preserve completed weights and never imply completion', () => {
  for (const [status, label] of [['paused', 'PAUSED'], ['awaiting-review', 'AWAITING REVIEW'], ['blocked', 'BLOCKED'], ['deferred', 'DEFERRED']]) {
    const state = fixtureState();
    const child = state.steps[5].children[0].children[0];
    child.status = status;
    assert.throws(() => renderProgress(documentFor(state), 'U1'), /reason/);
    child.reason = 'Resume after the user supplies the missing decision.';
    const output = renderProgress(documentFor(state), 'U1');
    assert.match(output, / 3%/);
    // The word and the reason are on the task. The step above it shows a count and is not done.
    assert.ok(output.includes(`${label} — Full canonical title (0 of 1 actions done) — Resume after the user supplies the missing decision.`));
    assert.equal(nodeText(reportNodes(output)[5].children[0]), '[0 of 1] Authored step 6');
  }
  const state = fixtureState();
  const deliverable = state.steps[5].children[0];
  deliverable.children[0].weight = 90;
  deliverable.children[0].status = 'complete';
  deliverable.children.push({ id: 'waiting', task: 2, weight: 5, status: 'paused', reason: 'User pause; resume required proof.' });
  assert.match(renderProgress(documentFor(state, true), 'U1'), / 93%/);
  assert.match(renderProgress(documentFor(state, true), 'U1'), /D1\. `\[1 of 2\]` Full deliverable name$/m);
  deliverable.children[1].status = 'not-implementing';
  deliverable.children[1].reason = 'User accepted exclusion.';
  const resolved = renderProgress(documentFor(state, true), 'U1');
  assert.match(resolved, /D1\. `\[x\]` Full deliverable name$/m);
  // The step counts its deliverable as done: a mix of resolved treatments is complete.
  assert.equal(nodeText(reportNodes(resolved)[5].children[0]), '[x] Authored step 6');
});

test('a divided task is complete when its sub-tasks are resolved in a mix, and takes their treatment when they share one', () => {
  const state = fixtureState();
  const parent = state.steps[5].children[0].children[0];
  delete parent.status;
  parent.children = [
    { id: 'part-a', task: '1.1', weight: 60, status: 'complete' },
    { id: 'part-b', task: '1.2', weight: 35, status: 'not-implementing', reason: 'The user accepted no change.' },
  ];
  // The heading of Task 1 itself keeps one open action.
  const source = (first: string) => documentFor(state) + `\n## Task 1.1 — First part\n\n- [${first}] Build the first part.\n\n## Task 1.2 — Second part\n\n- [ ] Build the second part.\n`;
  // A completed sub-task and a resolved one make the task complete, so its own open action is refused.
  assert.throws(() => renderProgress(source('x'), 'U1'), /Task 1 is complete with unfinished required actions/);
  // Sub-tasks that share one treatment give it to the task. It claims no completed work, and its open action stays.
  Object.assign(parent.children[0], { status: 'not-implementing', reason: 'The user accepted no change.' });
  const output = renderProgress(source(' '), 'U1');
  assert.match(output, /T1\. `\[x\]` Full canonical title$/m);
  assert.match(output, / 98%/);
});

test('status belongs in structured state rather than duplicated title prefixes', () => {
  for (const label of ['NOT IMPLEMENTING', 'NOT APPLICABLE', 'PAUSED', 'BLOCKED', 'IN PROGRESS', 'COMPLETED']) {
    assert.throws(() => renderProgress(documentFor().replace('Full canonical title', label + ' — Full canonical title'), 'U1'), /structured status/);
  }
});

test('CLI treatment transition updates labels and weights without rewriting source or authority', async t => {
  const { sourcePath, output, run } = await workspace(t);
  assert.equal(run('--write').status, 0);
  const state = fixtureState();
  Object.assign(state.steps[5].children[0].children[0], { status: 'not-implementing', reason: 'Decision accepted; no justified change.' });
  const changed = documentFor(state);
  await writeFile(sourcePath, changed);
  assert.equal(run('--check').status, 1);
  assert.equal(run('--write').status, 0);
  assert.equal(run('--check').status, 0);
  assert.match(await readFile(output, 'utf8'), /NOT IMPLEMENTING/);
  assert.match(await readFile(output, 'utf8'), / 98%/);
  assert.equal(await readFile(sourcePath, 'utf8'), changed);
});


test('a task breaks down into sub-tasks that share its weight and give it its count', () => {
  const state = fixtureState();
  const parent = state.steps[5].children[0].children[0];
  delete parent.status;
  parent.children = [
    { id: 'build-a', task: '1.1', weight: 60, status: 'complete' },
    { id: 'build-b', task: '1.2', weight: 35, children: [
      { id: 'build-b1', task: '1.2.1', weight: 20, status: 'active' },
      { id: 'build-b2', task: '1.2.2', weight: 15, status: 'paused', reason: 'Waits for T1.2.1.' },
    ] },
  ];
  const source = () => documentFor(state).replace('- [ ] Implement feature.\n- Preserve existing behavior.\n', '- Preserve existing behavior.\n')
    + '\n## Task 1.1 — First part\n\n- [x] Build the first part.\n- Keep the old behavior.\n'
    + '\n## Task 1.2 — Second part\n\n- Keep the old behavior.\n'
    + '\n## Task 1.2.1 — Second part, core\n\n- [ ] Build the core.\n- Keep the old behavior.\n'
    + '\n## Task 1.2.2 — Second part, checks\n\n- [ ] Run the checks.\n- Keep the old behavior.\n';
  const output = renderProgress(source(), 'U1');
  assert.match(output, / 63%/);
  // A divided task shows how many of its sub-tasks are done; the word and the reason are on the sub-task.
  assert.match(output, /T1\. `\[1 of 2\]` Full canonical title$/m);
  assert.match(output, /T1\.1\. `\[x\]` First part \(1 of 1 actions done\)$/m);
  assert.match(output, /T1\.2\. `\[0 of 2\]` Second part$/m);
  assert.match(output, /T1\.2\.1\. `\[…\]` IN PROGRESS — Second part, core \(0 of 1 actions done\)$/m);
  assert.match(output, /T1\.2\.2\. `\[!\]` PAUSED — Second part, checks \(0 of 1 actions done\) — Waits for T1\.2\.1\.$/m);
  assert.match(output, /^In progress now: T1\.2\.1$/m);
  assert.match(output, /^On hold: T1\.2\.2 \(PAUSED\)$/m);
  parent.children[1].children[0].status = 'complete';
  assert.throws(() => renderProgress(source(), 'U1'), /unfinished required actions/);
  parent.children[1].children[0].status = 'active';
  parent.children[0].weight = 59;
  assert.throws(() => renderProgress(source(), 'U1'), /sum to parent/);
  parent.children[0].weight = 60;
  parent.status = 'active';
  assert.throws(() => renderProgress(source(), 'U1'), /derive from children/);
  delete parent.status;
  parent.children[0].task = 2;
  assert.throws(() => renderProgress(source(), 'U1'), /must extend Task 1/);
});

test('names the leaves in work and on hold only when there are some', () => {
  const state = fixtureState();
  assert.match(renderProgress(documentFor(state), 'U1'), /^In progress now: T1$/m);
  assert.doesNotMatch(renderProgress(documentFor(state), 'U1'), /^On hold:/m);
  Object.assign(state.steps[5].children[0].children[0], { status: 'blocked', reason: 'Waits for the user decision.' });
  Object.assign(state.steps[3], { status: 'awaiting-review', reason: 'The user reviews the start.' });
  const output = renderProgress(documentFor(state), 'U1');
  assert.doesNotMatch(output, /^In progress now:/m);
  assert.match(output, /^On hold: Step 4 \(AWAITING REVIEW\), T1 \(BLOCKED\)$/m);
});

test('the report prints reader text only, with short items, and leaves the task document free', () => {
  const longSentence = `${'word '.repeat(26).trim()}.`;
  const fourSentences = 'One. Two. Three. Four.';
  const baseline = renderProgress(documentFor(), 'U1');
  assert.match(baseline, / 3%/);
  assert.match(baseline, /T1\. `\[…\]` IN PROGRESS — Full canonical title \(0 of 1 actions done\)/);
  assert.doesNotMatch(baseline, /Implement feature|Preserve existing behavior/);
  for (const bad of [longSentence, fourSentences, 'One; two; three; four.']) {
    const edits: ((s: any) => unknown)[] = [
      s => s.current = bad, s => s.next = bad, s => s.completed.push(bad), s => s.verification = [bad],
      s => s.steps[0].name = bad, s => s.steps[5].children[0].name = bad,
      s => Object.assign(s.steps[3], { status: 'paused', reason: bad }),
      s => s.steps[5].children[0].children[0].bullets = [bad],
    ];
    for (const edit of edits) {
      const state = fixtureState();
      edit(state);
      assert.throws(() => renderProgress(documentFor(state), 'U1'), /at most 3 sentences of at most 25 words/);
    }
    // A printed heading title is reader text; the task body never is.
    assert.throws(() => renderProgress(documentFor().replace('Full canonical title', bad), 'U1'), /Task 1 title: use at most/);
    const technical = documentFor().replace('Preserve existing behavior.', bad);
    assert.equal(renderProgress(technical, 'U1').split('\n').slice(2).join('\n'), baseline.split('\n').slice(2).join('\n'));
  }
  // The heading is the one title of a task: a second title in the state is refused.
  const state = fixtureState();
  state.steps[5].children[0].children[0].label = 'Build the report';
  assert.throws(() => renderProgress(documentFor(state), 'U1'), /build: unknown node field/);
  delete state.steps[5].children[0].children[0].label;
  state.current = `${'word '.repeat(25).trim()}. A second sentence. A third sentence.`;
  assert.match(renderProgress(documentFor(state), 'U1'), / 3%/);
});

test('the report counts done actions and keeps unfinished acceptance', () => {
  const state = fixtureState();
  const input = documentFor(state).replace('- [ ] Implement feature.', '- [x] Write the tests.\n- [ ] Implement feature.');
  assert.match(renderProgress(input, 'U1'), /Full canonical title \(1 of 2 actions done\)/);
  state.steps[5].children[0].children[0].status = 'complete';
  assert.throws(() => renderProgress(documentFor(state), 'U1'), /unfinished required actions/);
  Object.assign(state.steps[5].children[0].children[0], { status: 'not-implementing', reason: 'The user accepted no change.' });
  const resolved = renderProgress(documentFor(state), 'U1');
  assert.match(resolved, /T1\. `\[x\]` NOT IMPLEMENTING — Full canonical title — The user accepted no change\./);
  assert.doesNotMatch(resolved, /actions done\) — The user/);
});

test('the report prints three levels of tasks, counts the parts below them and names the parts that have a status to tell', () => {
  const state = fixtureState();
  const parent = state.steps[5].children[0].children[0];
  delete parent.status;
  parent.children = [
    { id: 'a', task: '1.1', weight: 60, status: 'complete' },
    { id: 'b', task: '1.2', weight: 35, children: [
      { id: 'b1', task: '1.2.1', weight: 25, children: [
        { id: 'b1a', task: '1.2.1.1', weight: 10, status: 'complete' },
        { id: 'b1b', task: '1.2.1.2', weight: 10, children: [
          { id: 'b1b1', task: '1.2.1.2.1', weight: 5, status: 'active' },
          { id: 'b1b2', task: '1.2.1.2.2', weight: 5, status: 'paused', reason: 'Waits for the answer of the user.' },
        ] },
        { id: 'b1c', task: '1.2.1.3', weight: 3, status: 'pending' },
        { id: 'b1d', task: '1.2.1.4', weight: 2, status: 'deferred', reason: 'Moves to the next slice.' },
      ] },
      { id: 'b2', task: '1.2.2', weight: 10, status: 'pending' },
    ] },
  ];
  const source = documentFor(state).replace('- [ ] Implement feature.\n- Preserve existing behavior.\n', '- Preserve existing behavior.\n')
    + '\n## Task 1.1 — First part\n\n- [x] Build the first part.\n'
    + '\n## Task 1.2 — Second part\n\n- Keep the old behavior.\n'
    + '\n## Task 1.2.1 — Second part, core\n\n- Keep the old behavior.\n'
    + '\n## Task 1.2.1.1 — Bind the destinations\n\n- [x] Bind them.\n'
    + '\n## Task 1.2.1.2 — Protect the target\n\n- Keep the old behavior.\n'
    + '\n## Task 1.2.1.2.1 — Read the markers\n\n- [x] Find them.\n- [ ] Read them.\n'
    + '\n## Task 1.2.1.2.2 — Ask about the lost marker\n\n- [ ] Ask.\n'
    + '\n## Task 1.2.1.3 — Read the inputs\n\n- [ ] Read them.\n'
    + '\n## Task 1.2.1.4 — Write the long guide\n\n- [ ] Write it.\n'
    + '\n## Task 1.2.2 — Second part, checks\n\n- [ ] Run the checks.\n';
  const output = renderProgress(source, 'U1');
  assert.match(output, / 73%/);
  // The first three levels each have their line and their number.
  assert.match(output, /^ +- T1\. `\[1 of 2\]` Full canonical title$/m);
  assert.match(output, /^ +- T1\.1\. `\[x\]` First part \(1 of 1 actions done\)$/m);
  assert.match(output, /^ +- T1\.2\. `\[0 of 2\]` Second part$/m);
  assert.match(output, /^ +- T1\.2\.2\. `\[ \]` Second part, checks \(0 of 1 actions done\)$/m);
  // The third level counts the parts below it: the sub-tasks that are not divided again.
  assert.match(output, /^ +- T1\.2\.1\. `\[1 of 5 parts\]` Second part, core$/m);
  // The part in work is named below that line, by its title and with no number.
  assert.match(output, /^ +- `\[…\]` IN PROGRESS — Read the markers \(1 of 2 actions done\)$/m);
  // A part on hold and a deferred part are named in the same way, with the reason.
  assert.match(output, /^ +- `\[!\]` PAUSED — Ask about the lost marker — Waits for the answer of the user\.$/m);
  assert.match(output, /^ +- `\[-\]` DEFERRED — Write the long guide — Moves to the next slice\.$/m);
  // No number is deeper than three levels, and no other deeper sub-task has a line.
  assert.doesNotMatch(output, /T1\.2\.1\.\d/);
  assert.doesNotMatch(output, /Bind the destinations|Protect the target|Read the inputs/);
  assert.match(output, /^In progress now: T1\.2\.1 › Read the markers$/m);
  assert.match(output, /^On hold: T1\.2\.1 › Ask about the lost marker \(PAUSED\)$/m);
  // A task list that is not divided below the third level has no count of parts.
  assert.doesNotMatch(renderProgress(documentFor(), 'U1'), /parts\]/);
});

test('the report shows a status word only on a task, and a count on a line that has lines below it', () => {
  const state = fixtureState();
  const working = renderProgress(documentFor(state), 'U1');
  // A completed line has its checked box and no word.
  assert.match(working, /^1\. `\[x\]` Authored step 1$/m);
  assert.doesNotMatch(working, /COMPLETED/);
  // A line with lines below it shows how many of them are done, or an empty box when none is started.
  assert.match(working, /^6\. `\[0 of 1\]` Authored step 6$/m);
  assert.match(working, /^ +- D1\. `\[0 of 1\]` Full deliverable name$/m);
  assert.match(working, /^8\. `\[ \]` Authored step 8$/m);
  // The words IN PROGRESS are on the one task in work.
  assert.match(working, /^ +- T1\. `\[…\]` IN PROGRESS — Full canonical title \(0 of 1 actions done\)$/m);
  assert.equal(working.match(/IN PROGRESS —/g)!.length, 1);
  // A hold shows its word and its reason on the task, not on the lines above it.
  Object.assign(state.steps[5].children[0].children[0], { status: 'blocked', reason: 'Waits for the user decision.' });
  const held = renderProgress(documentFor(state), 'U1');
  assert.match(held, /^ +- T1\. `\[!\]` BLOCKED — Full canonical title \(0 of 1 actions done\) — Waits for the user decision\.$/m);
  assert.match(held, /^ +- D1\. `\[0 of 1\]` Full deliverable name$/m);
  assert.match(held, /^6\. `\[0 of 1\]` Authored step 6$/m);
  delete state.steps[5].children[0].children[0].reason;
  state.steps[5].children[0].children[0].status = 'complete';
  const done = renderProgress(documentFor(state, true), 'U1');
  assert.match(done, /^6\. `\[x\]` Authored step 6$/m);
  assert.match(done, /^ +- D1\. `\[x\]` Full deliverable name$/m);
  assert.match(done, /^ +- T1\. `\[x\]` Full canonical title \(1 of 1 actions done\)$/m);
});

test('the report refuses a task deeper than three levels that is not below its third-level task', () => {
  const heading: Record<string, string> = { '1.2': 'Second part', '1.2.3': 'Third level', '1.2.3.4': 'Deep part', '1.2.3.4.5': 'Deeper part' };
  const source = (children: unknown[], ...tasks: string[]) => {
    const state = fixtureState();
    state.steps[5].children[0].children = children;
    return documentFor(state) + tasks.map(task => `\n## Task ${task} — ${heading[task]}\n\n- Keep the old behavior.\n`).join('');
  };
  const refusal = /deep: a task deeper than 3 levels belongs below its third-level task/;
  // Directly below a deliverable, the deep task has no third-level task that can count it.
  const loose = source([{ id: 'rest', task: 1, weight: 90, status: 'pending' }, { id: 'deep', task: '1.2.3.4', weight: 5, status: 'active' }], '1.2.3.4');
  assert.throws(() => renderProgress(loose, 'U1'), refusal);
  // Below a task of the second level, a level is left out.
  const skipped = source([{ id: 'one', task: 1, weight: 95, children: [
    { id: 'two', task: '1.2', weight: 95, children: [{ id: 'deep', task: '1.2.3.4', weight: 95, status: 'active' }] },
  ] }], '1.2', '1.2.3.4');
  assert.throws(() => renderProgress(skipped, 'U1'), refusal);
  // Below its third-level task a part can leave out a level.
  const below = source([{ id: 'one', task: 1, weight: 95, children: [
    { id: 'two', task: '1.2', weight: 95, children: [
      { id: 'three', task: '1.2.3', weight: 95, children: [{ id: 'deeper', task: '1.2.3.4.5', weight: 95, status: 'active' }] },
    ] },
  ] }], '1.2', '1.2.3', '1.2.3.4.5');
  const output = renderProgress(below, 'U1');
  assert.match(output, /T1\.2\.3\. `\[0 of 1 parts\]` Third level$/m);
  assert.match(output, /^In progress now: T1\.2\.3 › Deeper part$/m);
});

test('CLI gives the same report for a pointer with no status, a slice in progress and a closed slice', async t => {
  const { root, sourcePath, output, pointer, run } = await workspace(t);
  const selected = JSON.parse(pointer);
  const select = async (status: string) => {
    selected.currentSlice.status = status;
    await writeFile(join(root, 'plans', 'project-state.json'), JSON.stringify(selected));
  };
  // The pointer of the fixture has no status.
  assert.equal(run('--write').status, 0);
  const report = await readFile(output, 'utf8');
  assert.match(report, /Full canonical title \(0 of 1 actions done\)/);
  assert.doesNotMatch(report, /Implement feature/);
  // The status of the slice changes nothing in the form: the saved report is still current.
  for (const status of ['in-progress', 'closed']) {
    await select(status);
    assert.equal(run('--check').status, 0, status);
    assert.equal(run().stdout, report, status);
  }
  // A long item is refused for each of them, and the saved report stays.
  await writeFile(sourcePath, documentFor().replace('Build report', 'One. Two. Three. Four.'));
  await writeFile(join(root, 'plans', 'project-state.json'), pointer);
  for (const status of ['', 'in-progress', 'closed']) {
    if (status) await select(status);
    const refused = run('--write');
    assert.equal(refused.status, 1, status);
    assert.match(refused.stderr, /current: use at most 3 sentences/);
  }
  assert.equal(await readFile(output, 'utf8'), report);
});

test('CLI prints each status change when it writes the report', async t => {
  const { root, sourcePath, pointer, run } = await workspace(t);
  const selected = JSON.parse(pointer);
  selected.currentSlice.status = 'in-progress';
  await writeFile(join(root, 'plans', 'project-state.json'), JSON.stringify(selected));
  const state = fixtureState();
  // A first report has no earlier status to compare with.
  const first = run('--write');
  assert.equal(first.status, 0);
  assert.equal(first.stdout.trim().split('\n').length, 1);
  // A task goes on hold and a step starts: one line for each, in the symbols of the report.
  Object.assign(state.steps[5].children[0].children[0], { status: 'blocked', reason: 'Waits for the user decision.' });
  state.steps[3].status = 'active';
  await writeFile(sourcePath, documentFor(state));
  const held = run('--write');
  assert.equal(held.status, 0);
  assert.deepEqual(held.stdout.trim().split('\n').slice(1), [
    '[…] Step 4 Authored step 4 — IN PROGRESS',
    '[!] D1 Full deliverable name › T1 Full canonical title — BLOCKED: Waits for the user decision.',
  ]);
  // A change of text with no change of status prints no line.
  state.current = 'Build the next report';
  await writeFile(sourcePath, documentFor(state));
  assert.equal(run('--write').stdout.trim().split('\n').length, 1);
  // The task is completed.
  delete state.steps[5].children[0].children[0].reason;
  state.steps[5].children[0].children[0].status = 'complete';
  await writeFile(sourcePath, documentFor(state, true));
  assert.deepEqual(run('--write').stdout.trim().split('\n').slice(1), ['[x] D1 Full deliverable name › T1 Full canonical title — COMPLETE']);
  // A saved report whose hidden line was altered has nothing to compare with: the write still passes and prints no line.
  for (const altered of ['null', '5', '[]', '"text"']) {
    const report = await readFile(join(root, 'tasks', 'progress.md'), 'utf8');
    await writeFile(join(root, 'tasks', 'progress.md'), report.replace(/<!-- Leaf statuses: .+ -->/, `<!-- Leaf statuses: ${altered} -->`));
    const repaired = run('--write');
    assert.deepEqual([repaired.status, repaired.stdout.trim().split('\n').length], [0, 1], altered);
  }
  // The check and the plain output print no status line, and a second write has nothing to tell.
  assert.equal(run('--check').stdout.trim().split('\n').length, 1);
  assert.match(run('--write').stdout, /unchanged/);
  assert.doesNotMatch(run().stdout, /— COMPLETE$/m);
});

test('the report warns when more than 3 tasks show as in work, and refuses nothing', () => {
  const warning = /^Check: 4 tasks show IN PROGRESS\. Put on hold each task that is not in work now\.$/m;
  const state = fixtureState();
  for (const index of [3, 4]) state.steps[index].status = 'active';
  assert.doesNotMatch(renderProgress(documentFor(state), 'U1'), /^Check:/m);
  state.steps[6].status = 'active';
  const output = renderProgress(documentFor(state), 'U1');
  assert.match(output, /^In progress now: Step 4, Step 5, T1, Step 7$/m);
  assert.match(output, warning);
});

test('the Claude hook writes the report again after an edit of the selected task list, and only then', async t => {
  const { root, sourcePath, output, pointer } = await workspace(t);
  const selected = JSON.parse(pointer);
  selected.currentSlice.status = 'in-progress';
  await writeFile(join(root, 'plans', 'project-state.json'), JSON.stringify(selected));
  const hook = fileURLToPath(new URL('../progress-hook.ts', import.meta.url));
  const edited = (file: string) => spawnSync(process.execPath, [hook, '--root', root],
    { encoding: 'utf8', input: JSON.stringify({ hook_event_name: 'PostToolUse', tool_name: 'Edit', tool_input: { file_path: file } }) });
  // An edit of another file starts nothing.
  const other = edited(join(root, 'plans', 'project-state.json'));
  assert.deepEqual([other.status, other.stdout, other.stderr], [0, '', '']);
  await assert.rejects(readFile(output, 'utf8'), { code: 'ENOENT' });
  // The first edit of the task list writes the report. No status changed, so the session gets no message.
  const first = edited(sourcePath);
  assert.deepEqual([first.status, first.stdout], [0, '']);
  assert.match(await readFile(output, 'utf8'), /Full canonical title/);
  // A changed status reaches the session as context for the agent, with the lines of the command.
  const state = fixtureState();
  Object.assign(state.steps[5].children[0].children[0], { status: 'blocked', reason: 'Waits for the user decision.' });
  await writeFile(sourcePath, documentFor(state));
  const changed = edited(sourcePath);
  assert.equal(changed.status, 0);
  const told = JSON.parse(changed.stdout).hookSpecificOutput;
  assert.equal(told.hookEventName, 'PostToolUse');
  assert.match(told.additionalContext, /^\[!\] D1 Full deliverable name › T1 Full canonical title — BLOCKED: Waits for the user decision\.$/m);
  assert.match(await readFile(output, 'utf8'), /BLOCKED — Full canonical title/);
  // A task list that is not valid gives the refusal to the agent and leaves the saved report.
  const saved = await readFile(output, 'utf8');
  await writeFile(sourcePath, documentFor(state).replace('Build report', 'One. Two. Three. Four.'));
  const refused = edited(sourcePath);
  assert.equal(refused.status, 2);
  assert.match(refused.stderr, /current: use at most 3 sentences/);
  assert.equal(await readFile(output, 'utf8'), saved);
  // Input that is not the input of a hook starts nothing.
  const none = spawnSync(process.execPath, [hook, '--root', root], { encoding: 'utf8', input: 'not JSON' });
  assert.deepEqual([none.status, none.stdout], [0, '']);
});
