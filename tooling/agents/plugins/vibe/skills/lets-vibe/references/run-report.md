# The reporter and the run report

Use this reference when the user asks for the reporter, in any execution mode.

## The reporter

A reporter is optional. No mode asks for one, and the work neither waits for one nor writes to one. It is any session or program that the user sets to follow a run from outside. It only reads: it changes no file, no setting and no conversation of the run, and it decides nothing.

The reporter prints the run report as the tool gives it and puts no reading of its own into it. It saves it in no file. Where its own application can tell the user, it tells the user when the first line is not “Nothing needs you.”

**It reports at once, and then at each full hour.** Unless the user asks for one report only, the reporter prints the report when it is started, and then again at the next full hour of the clock and at each full hour after it, for example at 12:00 and at 13:00, until the slice or the chain is closed or the user stops it. The first report does not move those times. It uses what its own application has for that — a loop, a scheduled task or a timer — and says in its first message which one it set. These rules name no application. Where the application has no such means, the reporter says so in its first message, and the user asks again for each report.

**It does not trust a schedule that it has not seen fire.** A schedule that an application keeps for a session can stay silent. So with its first setup the reporter also starts a timer that wakes it just after the next full hour, where its application has one. When the timer wakes it and the report of that hour is already printed, the schedule works: the reporter keeps it and starts no further timer. When the report is not printed, the reporter prints it, says that the schedule did not fire, removes that schedule, and from then on starts one timer for each next full hour. A report is never printed twice for one hour.

## The run report

A tool makes the report from the repository and from the session logs that the project pointer names, so each report has the same form and holds facts only:

```sh
pnpm --dir tooling/agents run run-report
```

- **First one line that says if the run needs the user:** “Nothing needs you.”; or the request of the session that speaks with the user, when its last message begins with “Needs you:”; or what to check, when a flag is raised.
- **Then the progress:** the slice, its mode, the bar with the current state and the next one, and under it only the branch of the task tree that is in work or on hold, from the step and the deliverable down to the task and its sub-task.
- **Then the repository:** the line, the count of files that are not committed, the commits of the last hour, and what is owed to the user.
- **Then each session:** when it was last active, its refusals or its error and limit events, the outside commands that it ran in the last hour, and its last two statements as it wrote them.
- **Each line after the progress line is a bullet,** so that the report reads as a list in a conversation.
- **The flags** that the first line names are raised by fixed rules: a new refusal, an error or a limit, a log that is not found, and each session quiet for 45 minutes while the slice is in progress.

## The words “Needs you:”

In each mode the session that speaks with the user begins a message with the words “Needs you:” when it stops for the user: for a decision, an approval or a review. That first line holds the one thing that it needs, and the rest follows. The report puts that line first. In orchestrated mode the session that speaks with the user is the orchestrator; in each other mode it is the working session.

## What the pointer holds

`execution.sessions` in the project pointer names the sessions of the run, under the [pointer rules](requirements-alignment.md#project-pointer):

- **`developer`:** the working session, with its provider, its model, its effort, the host's identifier of its conversation where it has one, and the identifier of its session log.
- **`orchestrator`:** the same, in [orchestrated mode](orchestration.md) only.
- **`reviewer`:** the provider, the model and the effort of the independent reviewer, where they are known.

The working session writes the block at the slice start. A session that takes the slice up later corrects it with its next commit. In orchestrated mode the orchestrator gives its own entry to the developer, which writes both. The block names no person and holds no secret.

The tool finds a log by the identifier in the pointer, and guesses none: a session with no identifier, or of a provider whose logs it cannot read, is said as that in the report. A session finds the identifier of its own log with two commands, one after the other. The first prints a marker, and the second names the one log that holds it, which at that moment is the log of the session that asked:

```sh
pnpm --dir tooling/agents run run-report --mark
pnpm --dir tooling/agents run run-report --find <marker>
```
