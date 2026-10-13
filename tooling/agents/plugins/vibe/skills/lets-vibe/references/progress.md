# Live progress

Use the [progress-report skill](../../progress-report/SKILL.md) for presentation and the rules below for Lets Vibe delivery detail. Progress reports do not measure time, cost or effort. Use the agreed generated progress document for the complete view and keep conversation updates short. The source state stays in the selected task document; the report is a derived artifact.

The user reads the report to follow the work. Write it for that reader under [Language and length](#language-and-length), keep its [in-progress state true](#keep-the-in-progress-state-true) and keep its tasks [small enough to show movement](#task-size-and-breakdown).

## Language and length

The user reads the progress report. Agents read the task document, the spec and the implementation plan. Write each one for its reader.

Write every text that the report prints in Simplified Technical English, following the [writing rules](../../progress-report/references/simplified-technical-english.md). The report prints the progress state only: `current`, `next`, the summary lists, step and deliverable names, reasons, placement bullets, and one line for each task to the third level. It also covers the short conversation update that links the report.

The rule does not apply to the body of the task document, the spec or the implementation plan. Write those for the agent, with the full technical detail, acceptance and verification that the work needs, under the [record rules](../../../../../../../AGENTS.md#records). The report does not copy the action lines of a task; it shows how many of them are done. The line for a task is its heading title. Write each task heading in plain English, at each level of sub-tasks, as text for the user. Put the technical detail below the heading, for the agent. The heading is the one title of a task: the renderer refuses a `label` on a task placement.

- Say the result, the current action and the next action. Put the evidence and the history of decisions in the implementation plan, under the record rules, and name the plan section when the reader needs it.
- Write a maximum of 3 sentences in one report item and a maximum of 25 words in one sentence. An instruction has a maximum of 20 words.
- Keep each summary list to a maximum of 7 items. When a list grows, keep the items the reader needs now and move the others to the plan.
- Do not copy a rule, a decision record or a verification log into the report.

The renderer makes this reader report for the selected slice and refuses a printed item of more than 3 sentences or a sentence of more than 25 words. The report has one form, and it does not change when the slice closes. Correct the progress state text; do not shorten the task body to satisfy the check, because the check does not read it. The renderer cannot check word choice, voice or truth; the writer and the independent reviewer check those.

## Plan and status

Identify the selected slice, active execution mode and current authored step. For a sub-slice, include its parent, for example `T02.1 — additional scope under T02`, and report the child’s own delivery progress. Use the actual guide and accepted plan for step names, ordering and deliverables. Do not merge, omit or renumber steps to make progress look simpler. Report uncertainty when current facts cannot be established; never borrow another task's state.

Show accepted deliverables as children of their owning step. Use the structured leaf treatments below. The renderer adds their uppercase prefixes; keep canonical task titles free of treatment prefixes. Existing IDs and weights stay unchanged. A resolved decision is distinct from an implemented result.

| Structured status | Display prefix | Checkbox | Earns its weight | Meaning and required explanation |
| --- | --- | --- | --- | --- |
| `complete` | No text prefix | `[x]` | Yes | Required outcome and checks passed. The checked box says it. |
| `not-implementing` | NOT IMPLEMENTING | `[x]` | Yes | Settled decision not to make the proposed change; `reason` names the evidence and applicable decision authority. No implementation/test execution is implied. |
| `inapplicable` | NOT APPLICABLE | `[x]` | Yes | Conditional work does not apply to the chosen solution; `reason` explains why. |
| `deferred` | DEFERRED | `[-]` | No | Still relevant but postponed; `reason` names its destination or revisit condition. |
| `active` | IN PROGRESS | `[…]` | No | Substantive work has actually touched this specific task, and it remains unfinished; record what was done and what remains. |
| `awaiting-review` | AWAITING REVIEW | `[!]` | No | Ready for required review; `reason` identifies the reviewer/user and next assessment. |
| `blocked` | BLOCKED | `[!]` | No | An obstacle prevents necessary work; `reason` names it and the action needed to unblock it. Legacy `held` remains readable with this same treatment. |
| `paused` | PAUSED | `[!]` | No | An individual task is deliberately suspended for a specific reason; `reason` records its resumption condition and remaining work. |
| `pending` | No text prefix | `[ ]` | No | No substantive work begun. |

Render pending steps, deliverables and tasks as `[ ]` followed directly by their name; the empty checkbox supplies the status without a NOT STARTED prefix. Keep the structured `pending` value for state and weight calculations.

Set IN PROGRESS only when task-specific inspection, investigation, implementation or verification has begun. Creating the plan/checklist, starting a slice, or working on a dependency does not start every task. On a fresh sub-slice, beginning T1 changes T1 and its derived parents; untouched sibling tasks remain NOT STARTED. Do not credit a later task merely because earlier work produced evidence it may reuse. Before updating a task, identify its actual work/evidence in the existing record; do not add timestamps, a second ledger or new tracking fields just to prove it was touched.

### Keep the in-progress state true

IN PROGRESS means that work is going on now. The user reads it to see what the agent is doing at this moment.

- **Start.** Set a leaf to `active` and regenerate the report before its work starts. Do not wait until the leaf is complete. This applies to a task, a sub-task and a sub-task of a sub-task.
- **Parallel work.** More than one leaf is IN PROGRESS only when their work goes on at the same time, for example an independent assessment that runs while implementation continues. When more than 3 leaves show IN PROGRESS, the report prints a line that starts with “Check:”. It refuses nothing. Read it as a sign that a status is stale, and put on hold each leaf that is not in work now.
- **Stop.** When work stops on an unfinished leaf, change its status in the same update. Do not leave a leaf IN PROGRESS because you plan to come back to it. Use `paused` when you stop it to do other work first. Use `blocked` when something outside the leaf prevents its work. Use `awaiting-review` when it waits for its required review.
- **Reason.** The `reason` of a leaf on hold names what holds it: the task or deliverable identifier, the decision, the person or the external event. It also says what lets the work resume. For example: “Waits for T5, which makes the test image.”
- **Resume.** When the work resumes, set the leaf to `active` again before the work continues.
- **Actions.** Tick each action of a task when that action is done, and write the report again. Do not tick them all at the end. The count of actions is the movement that the user sees inside a task.

The report lists the IN PROGRESS leaves and the leaves on hold below its headline. It names a leaf deeper than 3 levels by its third-level task and its title. Read those 2 lines before each user update and correct the task state if they do not match the work. A step, a deliverable or a divided task shows no status word and no reason of its own. Its box shows `[x]` when each line below it is done, `[ ]` when none is started, and in each other case how many of them are done, for example `[2 of 6]`. So each line with the words IN PROGRESS is a task that is in work now, and the number of such lines is the number of tasks in work.

A run-level pause or routine mode checkpoint does not overwrite task treatments. Keep started unfinished tasks IN PROGRESS, untouched tasks NOT STARTED and resolved tasks resolved; record the overall stop in `current`, `next` and `blockers`. Use AWAITING REVIEW only for a task actually ready for its required assessment or approval. Reserve PAUSED for a specifically suspended task, not every task under a paused run. Resuming a run therefore does not require reconstructing prior task states.

For unresolved treatments, put the next action or resumption condition in the same `reason`; do not create another status such as USER ACTION REQUIRED. Verification results retain their own passed/failed/skipped/blocked/unexecuted distinctions. A failed check normally leaves its owning task IN PROGRESS while corrected.

Render each authored step as `<number>. <token> <PREFIX> — <name>`, with native nested unordered deliverable/task lists such as `D1. [2 of 6] Deliverable name` and `T1. [x] NOT IMPLEMENTING — Original task name — reason`. A line with lines below it has its box and its name only; a task that is not divided has its prefix and its reason. Retain all eleven steps and the actual task identifiers. Use inline code for checkbox tokens, including the box of a placement note, so brackets remain literal. Keep prose in the same list paragraph so it wraps at the preview width. Do not add uppercase prefixes manually to headings or repeat them in reasons.

A parent has no treatment of its own in the task state, and the report prints none for it. The renderer derives one from the children only to count what is done and to check a completed task: identical child treatments propagate; a mix of resolved treatments is complete; each other mixture is unfinished, while completed children keep their earned weight. Deferred work never earns completion. Parent reasons are not maintained and not printed; each reason is on the line of its own task.

A NOT IMPLEMENTING or NOT APPLICABLE task may retain its original unchecked conditional action list as historical scope. The report does not copy the action lines and does not count them for such a task, so it does not claim that they ran. Preserve fulfilled alternatives explicitly, such as an accepted no-fix decision preceding skipped coding/checks. Placement notes remain unchanged. Separate placements still retain their own outcomes and weights. A task collectively claiming actual COMPLETED work still cannot have unfinished required checkboxes. Optional placement bullets are factual notes, not implicit verification.

### Task size and breakdown

The user must see movement in the report about every 2 hours of work, not after a day. The report still does not measure time; the 2-hour window is a guide for the size of a task.

- **At the plan step.** If you expect a task to take more than about 2 hours of work, divide it into sub-tasks before the user agrees the plan.
- **During delivery.** If a leaf stays IN PROGRESS for about 2 hours of work and is not near completion, divide it before you continue. Do the same when a task proves larger than planned. If you cannot tell the time, divide a task that has more than about 5 actions or more than 1 result that can be checked independently.
- **How.** Add a `## Task N.M — Title` heading for each sub-task and make each one a child placement of its task. A sub-task can be divided again (`N.M.K`). The weights of the children sum to the weight of the parent, and the box of the parent comes from the children. Give finished work its own completed sub-task, so that its weight shows as earned.
- **What the report shows.** The task list has no limit of depth; the user reads the report, not the task list. The report prints a line for a task of the first, second and third level of task numbers, for example T2, T2.3 and T2.3.4. Below the third level it prints no line with a number. The box of the third-level task shows how many of its parts are done, for example `[4 of 9 parts]`; a part is a sub-task below it that is not divided again. Below that line the report names, by its title and with no number, each part that has a status to tell: a part in work, and a part that is on hold, deferred or resolved with no implementation, with its status and its reason. A pending part and a completed part are not named. Place a sub-task deeper than the third level below its third-level task; the renderer refuses one that is placed in another position. The finer detail stays in the task list.
- **What stays the same.** The parent keeps its title, its weight, its acceptance and its required checks. A division shows the same accepted work in smaller parts. It is therefore not a change to the weighting baseline and needs no new approval. Tell the user about the division in the next update.
- **What still needs approval.** A change to what the task must achieve, to the weight of the parent or to the accepted deliverables is a scope decision, as before.

Keep completed corrections visible with their return reason. When a correction interrupts an incomplete deliverable, preserve that deliverable's partial status and unfinished children. Do not mark earlier work complete simply because the current action belongs to a later step.

For example, a return from correction may read:

```text
6. [0 of 1] Deliverable loop
   D1. [1 of 2] API delivery
       T1. [x] API implementation (2 of 2 actions done)
       T2. […] IN PROGRESS — Integration verification (1 of 3 actions done)
7. [x] Material corrections and contract updates — fixed the failing integration;
   returning to verification
```

## Report document and session updates

Create the report at the plan step, not after the slice starts. During Step 3 of the [delivery guide](fresh-slice-delivery.md#step-3--scope-and-deliverables), when the task document has its deliverables and tasks, add the `vibe-progress` block with every weight set to 0, record the task document in the project pointer and generate `progress.md`. The report then shows the tasks with the unweighted headline. Add the weights when the user agrees them and generate the report again. The slice-start candidate includes the generated report, and the start commit is not made without a current one, so the user can follow the slice from its start.

For a selected local task document, the agreed generated report is its sibling `progress.md`. Use the project’s implemented renderer (the [commands and state format](../../../../../README.md#saved-progress-report)) to regenerate it after meaningful state changes and before review checkpoints. In Claude, a hook writes the report again after each edit of the selected task list with the edit tools, and gives the agent the status lines or the refusal of the renderer. After an edit through a shell command, and in Codex, run the write command yourself. Maintain task state in its existing owner and read the selected execution mode/scope from the project pointer; never edit the generated report’s statuses independently. Keep the full checklist, supporting bullets and readiness details in the document. When a write prints status lines, give them to the user unchanged in the next conversation update: they are made from the same state as the report, so they cannot differ from it. Do not word a status change in another way. For automatic workflow updates, provide a short conversation update with the report link, current action and exact next checkpoint; include substantive findings and approval questions as needed. A direct user invocation of the [progress-report skill](../../progress-report/SKILL.md) requests the complete saved report inline, following that skill's presentation rules; it does not require an additional “show it here” instruction.

Use the implemented freshness check before treating a saved report as current. A missing, stale or altered report is not verified: regenerate it from the source, then check it. The check must not silently repair source state or the report. If rendering is not implemented or available, state that limitation and report the current action briefly without creating a hand-maintained substitute or claiming enforcement. A direct reporting request may refresh the approved derived file; it does not authorize changing task state, implementation or approvals.

## Weighted progress and presentation

Establish the slice's step weights and deliverable allocation in its existing accepted plan during scope and deliverable planning. A sub-slice has its own denominator. Use non-negative integer step weights, classifying each step as supporting or substantive. Until the user agrees the weights, every weight is 0 and the report shows no percentage; the agreed weights have a positive total. Supporting work accounts for at most five percent of the total; substantive implementation, integration, semantic preservation, correction, verification and assessment work accounts for at least ninety-five percent. Assign weights to accepted work, not elapsed time or estimated effort. Do not invent or change them while reporting.

For a step with deliverable children, explicit child weights must sum to the parent weight. If the accepted plan explicitly chooses equal allocation, divide the parent weight equally among its accepted children, retaining exact fractions until the final percentage calculation. Count the children instead of their parent, never both. For a step without children, count its own weight. Changes to accepted steps, deliverables, applicability or weights must be visible scope decisions; obtain the user's approval before changing the weighting baseline. Dividing a task under [Task size and breakdown](#task-size-and-breakdown) keeps the baseline and needs no new approval. Keep the allocation in the selected maintained slice records; the generated report is never its authority.

`totalWeight` is the sum of the accepted step weights, including inapplicable and deferred work. `earnedWeight` is the sum of weights whose treatment earns completion in the table above. All unresolved leaf treatments earn none. A partially complete step earns only its resolved children’s weights, using the earning treatments above. Preserve those child states when a correction interrupts the step. If new evidence invalidates completion, update the affected status and earned weight truthfully. Waiting, repeated unchanged checks and routine narration earn no additional progress.

The generated document contains the complete report as native Markdown lists and summary paragraphs. Keep the report body unfenced so long lines wrap within their list indentation in both the saved preview and direct conversation output. Do not insert fixed-width line breaks. Keep the twenty-cell bar and percentage in inline code for monospace alignment; keep the surrounding headline as wrapping prose. A generated-file notice and source link precede the report. The visible headline follows:

```text
<unit>  <twenty-cell bar> <percent>% — <current>; next: <exact next gate>
```

The unbracketed bar contains exactly twenty cells using filled `▓` and empty `·`. Compute:

```text
percent = floor(100 * earnedWeight / totalWeight)
filledCells = percent === 100 ? 20 : floor(percent / 5)
```

Use `filledCells` filled cells followed by `20 - filledCells` empty cells. Below the headline, identify the execution mode, name the leaves that are in progress and on hold when there are any, and list the authored steps and their accepted deliverable children in order, with statuses and necessary reasons. Include completed results, current work, remaining work, blockers and the next checkpoint; include readiness details when required by [narration](narration.md). The percentage measures accepted weighted completion, not effort remaining or permission to advance. Zero-weight steps still require their acceptance and reporting; even a 100% bar does not waive an outstanding requirement or approval.

When accepted weights or current facts are missing, stale or inconsistent, do not manufacture a percentage or bar. Use `<unit> — percentage unavailable: <reason>; current: <current>; next: <exact next gate>` as the first line and report the known statuses. Before weight agreement, including during initial planning, this is the expected form; the renderer produces it when every weight is 0. Missing percentage data does not itself block authorized work. Do not substitute invented state to make rendering succeed.

## Reporting transitions

Refresh and check the full report document immediately after each authored delivery step completes, before work in its successor, in every execution mode; provide a short linked session update. This includes zero-weight steps. Report a step explicitly determined to be inapplicable before moving to its successor, with the reason. Report blocked or held steps without claiming completion. Do not batch several completed steps into a later report. A report does not create an approval checkpoint in autonomous mode.

Within authorized delivery or maintenance work, reconcile task treatments as work happens: before starting a leaf, after settling an implementation/non-implementation decision, completing a task or check, receiving review findings, encountering a blocker, or pausing/resuming. Follow [Keep the in-progress state true](#keep-the-in-progress-state-true) and [Task size and breakdown](#task-size-and-breakdown). Update the owning structured state and reasons, preserve evidence and approval boundaries, then regenerate and check the report before the next task or user update. Do not wait for the user to identify stale statuses. A decision to defer or reject work must stay within the current authority; formatting cannot grant scope approval. Also report completed deliverables, material scope changes and user requests. When the user requests per-item or per-commit supervision, report the completed item and its commit when applicable, preserving the parent's partial state and remaining items. Identify the exact next boundary and what approval would authorize.

Use the [readiness checklist](narration.md) at review or user-named stop boundaries. Follow [contract core](contract-core.md) for correction-entry and return checkpoints. Reporting an interrupt never authorizes its work. Do not repeat an unchanged report for routine traffic or waiting.
