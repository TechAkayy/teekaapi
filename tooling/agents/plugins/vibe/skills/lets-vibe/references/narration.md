# Narration

Honor the user's selected narration density: summary, normal, thinking or verbose. Thinking mode supplies bounded summaries of intent, observations, evidence-based interpretations, decisions and next actions, never private internal reasoning. Density changes how much explanation accompanies the work, not its acceptance criteria or approval boundaries.

Keep one coherent user-facing stream through the primary agent, following repository collaboration instructions. In orchestrated mode that stream is the orchestrator's, and the developer reports to the orchestrator. Helpers return relevant findings and evidence for that stream. When the session that speaks with the user stops for the user — for a decision, an approval or a review — the first line of its message begins with the words “Needs you:” and holds the one thing that it needs; a [reporter](run-report.md) puts that line first. Summarize evidence without exposing secrets, private data or unbounded logs.

At a user-named readiness boundary or an applicable review checkpoint, include the following in the complete report document under the [delivery progress rules](progress.md). Keep the session update short and linked, while stating the review result and any approval question directly:

1. The slice, supervised, copilot, autonomous or orchestrated mode and its scope, and current step from the actual plan or delivery guide.
2. The candidate being reviewed, named in words in the report document. Give its relevant commits, checkout, branch and HEAD in the session update only, together with any uncommitted changes included in the candidate; under the [record rules](../../../../../../../AGENTS.md#records) they are not written into a file.
3. The disposition of staged, unstaged and untracked work; mention stashes or other set-aside work when relevant to the task. Preserve unrelated user work.
4. Passed, failed, skipped, blocked and unexecuted verification, with relevant limitations.
5. Reviewer, tester and helper outcomes, pending sign-off, and running, interrupted or timed-out task processes when applicable. Starting a participant or process is not evidence of completion.
6. The exact next action, what existing authorization covers, and what any requested approval would release. Identify subsequent boundaries that remain unapproved.

Stop at the applicable checkpoint after reporting, as defined in [contract core](contract-core.md). Do not claim a later step is complete, change authored step numbering, or conceal unknown state behind a generic readiness statement. Routine updates follow [progress reporting](progress.md) and do not create new approval pauses.
