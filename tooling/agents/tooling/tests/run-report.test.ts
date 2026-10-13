import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { stringify } from 'yaml';
import { findMarker, runReport } from '../lib/run-report.ts';

// The report prints the time of day of the machine; the tests fix the zone.
process.env.TZ = 'UTC';

const now = Date.parse('2026-01-02T12:00:00Z');
const at = (minutesBefore: number): string => new Date(now - minutesBefore * 60000).toISOString();
const claudeSession = '11111111-2222-4333-8444-555555555555', codexSession = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';

function tasksDocument(buildStatus: string): string {
  const state = {
    unit: 'U1', current: 'The second task is built.', next: 'The proof of the unit.',
    completed: ['The inputs are read.'], remaining: ['The proof.'], blockers: ['No blocker.'], verification: ['Made-up fixture.'], candidate: ['Not staged.'],
    steps: Array.from({ length: 11 }, (_, index) => ({
      id: index + 1, name: `Authored step ${index + 1}`, class: 'substantive', weight: index < 3 ? 1 : index === 5 ? 96 : index === 7 ? 1 : 0,
      ...(index === 5 ? { children: [
        { id: 'D1', name: 'The first deliverable', weight: 40, children: [{ id: 'd1-t1', task: 1, weight: 40, status: 'complete' }] },
        { id: 'D2', name: 'The second deliverable', weight: 56, children: [
          { id: 'd2-t2', task: 2, weight: 30, children: [{ id: 'd2-t2-1', task: '2.1', weight: 10, status: 'complete' }, { id: 'd2-t2-2', task: '2.2', weight: 20, status: buildStatus }] },
          { id: 'd2-t3', task: 3, weight: 26, status: 'pending' }] }] }
        : index === 7 ? { children: [{ id: 'proof', task: 4, weight: 1, status: 'pending' }] } : { status: index < 3 ? 'complete' : 'pending' }),
    })),
  };
  return `\`\`\`vibe-progress\n${stringify(state)}\`\`\`\n\n## Task 1 — The first task\n\n- [x] Build it.\n\n## Task 2 — The second task\n\n- Build both parts.\n\n## Task 2.1 — Its first part\n\n- [x] Build it.\n\n## Task 2.2 — Its second part\n\n- [x] Write the test.\n- [ ] Build it.\n\n## Task 3 — The third task\n\n- [ ] Build it.\n\n## Task 4 — The proof\n\n- [ ] Run it.\n`;
}

async function ground(t: any, sessions: unknown, buildStatus = 'active', mode = 'orchestrated') {
  const root = await mkdtemp(join(tmpdir(), 'run-report-')), home = join(root, 'home');
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'plans', 'U1', 'tasks'), { recursive: true });
  await mkdir(join(root, 'tooling', 'agents'), { recursive: true });
  await writeFile(join(root, 'plans', 'project-state.json'), JSON.stringify({
    currentSlice: { id: 'U1', parent: null, status: 'in-progress' },
    documents: { roadmap: 'plans/roadmap.md', plan: 'plans/U1/tasks/plan.md', tasks: 'plans/U1/tasks/todo.md' },
    execution: { mode, scope: { slice: 'U1' }, sessions },
  }));
  await writeFile(join(root, 'plans', 'U1', 'tasks', 'todo.md'), tasksDocument(buildStatus));
  await writeFile(join(root, 'plans', 'U1', 'tasks', 'plan.md'), '# Plan\n\n**Owed to the user.**\n\n| Slice | Step or check | How | What depends on it |\n|---|---|---|---|\n| U1 | A look at the real screen | In the browser | Nothing |\n\nMore text.\n');
  await writeFile(join(root, 'plans', 'roadmap.md'), '# Roadmap\n');
  await writeFile(join(root, 'tooling', 'agents', 'run-report.json'), JSON.stringify({ outsideCommands: ['tooling/deploy\\.ts (deploy|return)\\b'] }));
  const claudeLogs = join(home, '.claude', 'projects', root.replace(/[^A-Za-z0-9]/g, '-')), codexLogs = join(home, '.codex', 'sessions', '2026', '01', '02');
  await mkdir(claudeLogs, { recursive: true });
  await mkdir(codexLogs, { recursive: true });
  const git = (...args: string[]): string => args[0] === 'log' ? `${at(20)}\tBuild the first part\n${at(50)}\tStart the unit\n` : args[0] === 'status' ? ' M a.ts\n?? b.ts\n' : 'the-line\n';
  return { root, claudeLogs, codexLogs, inputs: { root, now, minutes: 60, places: { home }, git } };
}

const pair = {
  orchestrator: { provider: 'codex', model: 'model-o', effort: 'high', conversation: 'conversation-o', session: codexSession },
  developer: { provider: 'claudeAgent', model: 'model-d', effort: 'high', conversation: 'conversation-d', session: claudeSession },
  reviewer: { provider: 'codex', model: 'model-r', effort: 'high' },
};
const claudeLine = (minutesBefore: number, type: string, content: unknown): string => JSON.stringify({ timestamp: at(minutesBefore), type, message: { content } });
const developerLog = [
  claudeLine(200, 'assistant', [{ type: 'text', text: 'An old statement.' }]),
  claudeLine(190, 'user', [{ type: 'tool_result', content: 'Permission to use Bash with command git stash list has been denied.' }]),
  claudeLine(40, 'assistant', [{ type: 'tool_use', name: 'Bash', input: { command: 'grep -n deploy tooling/deploy.ts deploy x' } }]),
  claudeLine(30, 'assistant', [{ type: 'tool_use', name: 'Bash', input: { command: 'node tooling/deploy.ts deploy admin' } }]),
  claudeLine(25, 'user', [{ type: 'tool_result', content: 'Permission for this action was denied by the Claude Code auto mode classifier. Reason: [A Reason].' }]),
  claudeLine(20, 'user', [{ type: 'tool_result', is_error: true, content: 'Exit code 1' }]),
  claudeLine(10, 'assistant', [{ type: 'text', text: 'The first part\nis built.' }]),
  claudeLine(5, 'assistant', [{ type: 'text', text: 'The second part is in work.' }]),
].join('\n') + '\n';
const codexLine = (minutesBefore: number, type: string, payload: unknown): string => JSON.stringify({ timestamp: at(minutesBefore), type, payload });
const orchestratorLog = [
  codexLine(100, 'response_item', { type: 'message', role: 'assistant', content: [{ text: 'An old decision.' }] }),
  codexLine(35, 'event_msg', { type: 'stream_error', message: 'the connection ended' }),
  codexLine(33, 'response_item', { type: 'custom_tool_call', input: 'await tools.exec_command({cmd:"cat tooling/deploy.ts"})' }),
  codexLine(31, 'response_item', { type: 'message', role: 'assistant', content: [{ text: 'The first part is accepted.' }] }),
].join('\n') + '\n';

test('the report has a fixed form: the progress with the branch in work, the repository, what is owed, and each conversation', async t => {
  const { claudeLogs, codexLogs, inputs } = await ground(t, pair);
  await writeFile(join(claudeLogs, `${claudeSession}.jsonl`), developerLog);
  await writeFile(join(codexLogs, `rollout-2026-01-02T10-00-00-${codexSession}.jsonl`), orchestratorLog);
  assert.equal(runReport(inputs), [
    'Check: 1 error or limit event(s) of the orchestrator; 1 new refusal(s) by the classifier',
    'RUN REPORT 2026-01-02 12:00, for the last 60 minutes',
    'Slice U1, in-progress, mode orchestrated',
    'U1  ▓▓▓▓▓▓▓▓▓▓·········· 53% — The second task is built.; next: The proof of the unit.',
    '- Step 6 Authored step 6 [1 of 2]',
    '  - D2 The second deliverable [0 of 2]',
    '    - T2 The second task [1 of 2]',
    '      - T2.2 Its second part — IN PROGRESS (1 of 2 actions done)',
    '- Repository: line the-line, 2 uncommitted, 2 commit(s) in the window; latest: "Build the first part"',
    '- Owed to the user: 1',
    '  - U1 | A look at the real screen',
    '- Orchestrator (codex / model-o / high): last activity 31 min ago (11:29)',
    '  - error or limit events in the window: 1',
    '    - 11:25 stream_error the connection ended',
    '  - outside commands in the window: none',
    '  - said 10:20: An old decision.',
    '  - said 11:29: The first part is accepted.',
    '- Developer (claudeAgent / model-d / high): last activity 5 min ago (11:55)',
    '  - refusals: by rule 1 (0 new), by classifier 1 (1 new) | tool errors in the window: 1',
    '    - 11:35 Permission for this action was denied by the Claude Code auto mode classifier. Reason: [A Reason].',
    '  - outside commands in the window: 1',
    '    - 11:30 node tooling/deploy.ts deploy admin',
    '  - said 11:50: The first part is built.',
    '  - said 11:55: The second part is in work.',
    '- Reviewer: codex / model-r / high',
    '',
  ].join('\n'));
});

test('a conversation with no recorded session, with an unknown provider or with a missing log is said as that, and nothing is guessed', async t => {
  const { inputs } = await ground(t, { orchestrator: { provider: 'other', model: 'm', effort: 'e', session: 'x1' }, developer: { provider: 'claude', model: 'm', effort: 'e' } }, 'pending');
  const report = runReport(inputs);
  assert.match(report, /^- Nothing is marked in work or on hold\.$/m);
  assert.match(report, /^- Orchestrator \(other \/ m \/ e\): no reader for the logs of this provider; its log is not read$/m);
  assert.match(report, /^- Developer \(claude \/ m \/ e\): no session identifier is recorded; its log is not read$/m);
  assert.match(report, /^- Reviewer: not recorded in the pointer$/m);
  assert.equal(report.split('\n')[0], 'Nothing needs you.');
  const missing = await ground(t, { ...pair, orchestrator: undefined });
  assert.equal(runReport(missing.inputs).split('\n')[0], 'Check: the log of the developer is not found');
});

test('the first line says if the run needs the user: two quiet conversations are a thing to check, and a request of the orchestrator comes first', async t => {
  const { claudeLogs, codexLogs, inputs } = await ground(t, pair);
  await writeFile(join(claudeLogs, `${claudeSession}.jsonl`), claudeLine(50, 'assistant', [{ type: 'text', text: 'I wait.' }]) + '\n');
  await writeFile(join(codexLogs, `rollout-2026-01-02T10-00-00-${codexSession}.jsonl`), codexLine(47, 'response_item', { type: 'message', role: 'assistant', content: [{ text: 'I wait too.' }] }) + '\n');
  assert.equal(runReport(inputs).split('\n')[0], 'Check: both conversations are quiet for 47 minutes');
  await writeFile(join(codexLogs, `rollout-2026-01-02T10-00-00-${codexSession}.jsonl`), codexLine(47, 'response_item', { type: 'message', role: 'assistant', content: [{ text: '**Needs you: may the proof use the second account?**\n\nI recommend yes.' }] }) + '\n');
  assert.deepEqual(runReport(inputs).split('\n').slice(0, 3), ['Needs you: may the proof use the second account?', 'Also check: both conversations are quiet for 47 minutes', 'RUN REPORT 2026-01-02 12:00, for the last 60 minutes']);
});

test('in a mode with one working session the report reads that session, and its request comes first', async t => {
  const { claudeLogs, inputs } = await ground(t, { developer: pair.developer }, 'active', 'autonomous');
  await writeFile(join(claudeLogs, `${claudeSession}.jsonl`), claudeLine(50, 'assistant', [{ type: 'text', text: 'Needs you: approve the commit of the first part.\n\nEach check passed.' }]) + '\n');
  const report = runReport(inputs).split('\n');
  assert.deepEqual(report.slice(0, 3), ['Needs you: approve the commit of the first part.', 'Also check: the conversation is quiet for 50 minutes', 'RUN REPORT 2026-01-02 12:00, for the last 60 minutes']);
  assert.equal(report[3], 'Slice U1, in-progress, mode autonomous');
  assert.equal(report.some(line => line.startsWith('- Orchestrator')), false);
  assert.equal(report.includes('- Developer (claudeAgent / model-d / high): last activity 50 min ago (11:10)'), true);
});

test('a session finds its own log by a marker that only its own log holds', async t => {
  const { root, claudeLogs, codexLogs, inputs } = await ground(t, pair);
  const marker = 'run-marker-0f0f0f0f-1111-4222-8333-444444444444';
  await writeFile(join(claudeLogs, `${claudeSession}.jsonl`), claudeLine(1, 'user', [{ type: 'tool_result', content: marker }]) + '\n');
  await writeFile(join(claudeLogs, 'agent-other.jsonl'), claudeLine(1, 'user', [{ type: 'tool_result', content: marker }]) + '\n');
  await writeFile(join(codexLogs, `rollout-2026-01-02T10-00-00-${codexSession}.jsonl`), orchestratorLog);
  assert.deepEqual(findMarker(marker, root, inputs.places), [{ logs: 'claude', session: claudeSession }]);
  assert.deepEqual(findMarker('run-marker-99999999-1111-4222-8333-444444444444', root, inputs.places), []);
  assert.throws(() => findMarker('anything', root, inputs.places), /Give the marker/);
});
