---
name: progress-report
description: Report current task progress on request or during explicitly invoked delivery, assessment, maintenance, research or roadmap work.
---

# Progress report

Report progress from the active plan, observed results and current task context. A direct invocation does not start or resume implementation, change task state or create commits. It may regenerate and check an agreed derived report from the maintained state under the delivery progress rules; it does not run unrelated verification.

## Establish the facts

Use the current task's agreed outcome, mode, plan and checkpoints. For the selected slice, read the recorded mode and scope from the project pointer under the [pointer rules](../lets-vibe/references/requirements-alignment.md#project-pointer); the generated report displays that selection without granting authority. Consult the existing implementation plan, task list or Git state only when needed to resolve missing or stale facts. If the requested task is ambiguous, ask which one rather than borrowing another task's progress.

Distinguish completed work, active work, pending work, blocked work and explicitly deferred or inapplicable work. Completion requires the relevant acceptance, not merely a command being started or a file being written. Keep an interrupted deliverable incomplete until its remaining work is done.

Maintain the structured treatments and uppercase display labels under the [delivery progress rules](../lets-vibe/references/progress.md#plan-and-status). During authorized delivery or maintenance, reconcile settled decisions and unfinished work at each meaningful transition; regenerate from the owner rather than manually prefixing titles or equating NOT IMPLEMENTING with executed work. A standalone reporting request preserves the opening read-only task-state boundary: report discrepancies without inventing decisions or changing task state, while allowing regeneration from the current owner.

Write report text for the person who follows the work. Apply the [language and length rule](../lets-vibe/references/progress.md#language-and-length) and its [Simplified Technical English writing rules](references/simplified-technical-english.md) to the saved report, to its source text and to a report given in the conversation. Give the result and the next action; leave evidence and history in the plan, under the [record rules](../../../../../../AGENTS.md#records).

Use the actual plan's names and ordering. Show deliverable children when they help explain progress; do not invent stages or turn a correction into completed implementation. Make scope changes and their effect on remaining work visible.

## Present the report

When the user invokes this skill directly and the task has an agreed generated `progress.md`, check its freshness and regenerate it from the maintained source if needed, then read and print the complete saved report in the conversation. This applies inside an active Lets Vibe run too. Preserve the saved report's wording, ordering, statuses, weights, hierarchy and Markdown presentation; do not independently reconstruct it, summarize it or substitute a link. Resolve local file links for the conversation without changing the report's meaning. The user need not add “show it here”. Follow an explicit request to only update or open the file instead.

When Lets Vibe invokes this skill automatically, follow the [delivery progress rules](../lets-vibe/references/progress.md) for the complete generated document, its weighted headline and nested Markdown presentation, and short linked session updates. For tasks without an agreed saved report and other assessments, start with **Progress report**, followed by the task or slice name and active execution mode when known. In either form, include:

- **Completed:** meaningful results and relevant verification outcomes.
- **Current:** the active deliverable and what is happening now. Name only the items that are in work at this moment; an item that waits for something else is on hold, with the thing that holds it.
- **Remaining:** the work still needed for the accepted outcome.
- **Blockers:** the exact obstacle and what would resolve it, or none.
- **Next checkpoint:** the next user-review boundary in supervised or copilot mode, or the next milestone and terminal stop in autonomous or orchestrated mode. Preserve any explicit user stop condition.

Keep the report proportional to the task. Use the delivery checklist during Lets Vibe; otherwise use a compact checklist or table when several deliverables need separate statuses. Use the verification outcome labels and evidence distinctions required by the applicable `AGENTS.md`.

During Lets Vibe, calculate weighted completion only from the accepted plan under the delivery progress rules. For other tasks and assessments, use factual statuses without weighted percentages. Do not invent weights, percentages or effort estimates. If facts are unavailable or stale, name the uncertainty. Link supporting evidence rather than reproducing logs or the entire plan; a direct request still prints the complete saved progress report as specified above. For Lets Vibe, maintain only the agreed derived report under the delivery progress rules; do not create a second source of task state. Other reporting remains in the session unless an output artifact is agreed.

## During Lets Vibe

Follow the [delivery progress rules](../lets-vibe/references/progress.md) for step and child statuses, correction history and reporting cadence during Lets Vibe.

At a readiness or review checkpoint, include the [Lets Vibe readiness report](../lets-vibe/references/narration.md) so the candidate, verification and next authorized action are explicit.

An explicit Lets Vibe invocation may use this skill without another user invocation. Report at meaningful transitions: scope agreement, a completed deliverable, material corrections or scope changes, readiness for review, a blocker, and closure. Do not issue repetitive reports for unchanged waits or routine tool calls.

A report does not grant approval or release a checkpoint. After reporting, continue the authorized workflow unless an actual user-review boundary or explicit stop condition requires a pause.

## During Review Vibe and Test Vibe

An explicit Review Vibe or Test Vibe invocation includes this progress hook without another user request. Use the assessment's actual scope and activities, not the slice-delivery guide or its step count. Report established scope and methods, meaningful assessment/check completion, blockers, material changes and the final findings handoff. A findings handoff completes the assessment, not implementation or slice closure. For delegated assessment, report in the assessor's session and have the calling agent surface meaningful progress in the active user session. Keep progress in the conversation; no reporting file or automatic correction loop is required.

## During supporting work

An explicit Dependency Upgrade, Grill Peers or Roadmap Review invocation includes this progress hook without another request. Use the entry skill's own steps and accepted scope. Report established scope and methods, meaningful completed work, verification or evidence limits, blockers, material scope changes, user decisions and the final handoff. Preserve approved unfinished work and the next checkpoint on resume. Standalone supporting work uses factual statuses without weighted percentages or a progress-only file. If the work is part of an already active Lets Vibe delivery, report it beneath the existing owning deliverable using that delivery's accepted weights and checkpoints; do not create another slice or double-count progress.
