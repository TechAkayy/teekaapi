#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { readFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// The Claude hook that keeps the progress report in step with the task list.
// Claude starts it after an edit of a file and gives the edit as JSON. It acts
// only when the edited file is the task list that the pointer selects. It then
// writes the report with the report command and gives the result to the
// session: the status changes as context for the agent, or the refusal of the
// renderer. For each other file, and for input that is not from a hook, it
// does nothing.
const args = process.argv.slice(2);
const root = args[0] === '--root' && args[1] ? resolve(args[1]) : fileURLToPath(new URL('../../../', import.meta.url));

function editedTaskList(): boolean {
  try {
    const edited = JSON.parse(readFileSync(0, 'utf8')).tool_input.file_path;
    const selected = JSON.parse(readFileSync(resolve(root, 'plans', 'project-state.json'), 'utf8')).documents.tasks;
    return realpathSync(edited) === realpathSync(resolve(root, selected));
  } catch { return false; }
}

if (editedTaskList()) {
  const command = fileURLToPath(new URL('./progress-report.ts', import.meta.url));
  const result = spawnSync(process.execPath, [...process.execArgv, command, '--root', root, '--write'], { encoding: 'utf8' });
  if (result.status !== 0) {
    // Exit code 2 shows this text to the agent. The second line is the reason from the report command.
    process.stderr.write(`The progress report is not written again.\n${result.stderr}`);
    process.exitCode = 2;
  } else {
    const changes = result.stdout.trim().split('\n').slice(1);
    if (changes.length) {
      process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse',
        additionalContext: `The progress report is written again. Give these status changes to the user unchanged:\n${changes.join('\n')}` } }));
    }
  }
}
