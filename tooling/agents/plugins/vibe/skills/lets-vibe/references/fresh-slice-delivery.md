# Slice Delivery

This guide is the delivery procedure used by Lets Vibe for one agreed slice. Lets Vibe owns selection and supporting-method routing; the applicable `AGENTS.md` owns repository policy, including Git safety and verification standards; [contract core](contract-core.md#execution-modes) owns the execution modes. Current user approvals remain controlling. This reference is not a separate skill entry point.

The eleven steps distinguish preparation, implementation, verification and closure. They are not eleven mandatory user pauses. Apply the active supervised, copilot, autonomous or orchestrated mode, reuse existing approvals, and honor explicit user checkpoints. Read the sections needed for the current work; on resume, recover completed work and continue at the next unfinished action.

Apply the [UI decision consultation gate](addy-method-gates.md#ui-decision-consultation) throughout these steps: before treating a proposed UI choice as accepted scope/design, and whenever implementation, correction or review exposes a needed decision. Preserve agreed designs and continue work independent of a pending choice.

Use one branch per slice, ordinary Git, and the selected documents or existing task record under [slice-document reuse](requirements-alignment.md#reuse-the-slice-documents). Keep source repositories read-only. Follow the [delivery progress rules](progress.md) and use the [progress-report skill](../../progress-report/SKILL.md) after each completed delivery step, at other meaningful transitions and on request; report actual progress without creating a second tracking record.

## Step 1 — Slice preflight

Inspect the current branch, working tree, index and worktrees before writing. Establish whether this is a new slice or a continuation and identify any unrelated or user-owned changes. Read and reconcile the project pointer under the [project-pointer rules](requirements-alignment.md#project-pointer).

Useful ordinary Git checks are:

```bash
git branch --show-current
git status --short
git worktree list
```

Confirm that the intended checkout and branch can safely host the work. Preserve unrelated changes rather than cleaning them away. Resolve a conflicting writer or ambiguous target before dependent mutations; independent read-only discovery can continue.

For a resumed slice or sub-slice, identify its existing start, approved scope, completed deliverables and outstanding checkpoint. Continue its next unfinished action unless the user explicitly redirects the work. Do not create another start or repeat accepted work.

For new work, establish the slice selection:

- `next-slice`: select the next ready planned slice from the roadmap, or the existing slice explicitly named by the user. An already planned sub-slice may also be selected this way.
- `new-slice`: define newly requested scope as a top-level slice when it does not belong under a completed parent. Check existing plans and specs, propose the next unused top-level ID using the project's numbering convention, and agree its relationship to any remaining planned work.
- `sub-slice`: define newly requested scope under a completed parent slice. The child need not already exist in the roadmap. Identify the parent and propose the next unused child ID using the project's numbering convention; for example, T02.1 after T02, then T02.2 for another addition. Check existing plans and specs before assigning an ID, and resolve an ambiguous parent or conflicting ID with the user.

These are slice-selection choices. All use this same delivery procedure and the independently selected supervised, copilot, autonomous or orchestrated execution mode. Establish the requested outcome before proposing its classification and ID. Until a selection is agreed, retain the last selected pointer and completed history; do not create a branch or scaffold documents just because the roadmap has ended.

## Step 2 — Accepted inputs and semantic baseline

Read the selected slice’s roadmap entry, or the parent’s entry for a proposed sub-slice, together with relevant Addy spec/task files, requirements, architecture, decisions, existing implementation and user steering. For newly requested top-level work with no entry yet, use the user's request and relevant existing project context as the initial baseline. Establish the outcome, exclusions, acceptance and dependencies. Distinguish accepted requirements from research suggestions and historical observations. Complete the [foundation and peer preparation](addy-method-gates.md#foundation-and-peer-preparation) before dependent recommendations.

For a new sub-slice, establish its additional outcome, boundaries, acceptance criteria and dependencies from the user's request. Preserve the parent's completed status and historical acceptance; the child has its own scope and completion. Agree its position relative to the next planned slice, including whether that slice now depends on the new work.

Use source material as evidence within its approved scope. A reference to another repository does not authorize copying its files. Resolve material contradictions before implementation; do not invent missing acceptance criteria or expand scope through documentation wording.

When those materials require reconciliation, follow [requirements alignment](requirements-alignment.md) before dependent implementation.

Establish the owning documents under [slice-document reuse](requirements-alignment.md#reuse-the-slice-documents), linking the accepted baseline rather than copying it into another record.

## Step 3 — Scope and deliverables

Organize the slice into coherent deliverables in dependency order. An owner is a delivered result, not an agent role. For each deliverable, establish its outcome, boundaries, dependencies, acceptance and relevant verification. Include documentation and recovery needs when the change warrants them.

Avoid artificial owners for process narration or trivial corrections. Adjust boundaries when evidence supports a better organization, making consequential scope changes visible.

Create the task document and its progress report in this step, so that the user can follow the slice from its start. Size each task under the [task size and breakdown rule](progress.md#task-size-and-breakdown). Write each task for the agent that does it, with its acceptance and verification; write the progress state for the user under the [language and length rule](progress.md#language-and-length). Add the progress state with every weight set to 0, record the task document in the project pointer and generate the report, following [report creation](progress.md#report-document-and-session-updates). Propose the weights with the deliverables; add them to the task document and generate the report again when the user agrees them.

Present the proposed scope and deliverables. In supervised and copilot modes, obtain scope agreement before implementation; in autonomous mode, proceed within the already authorized outcome and resolve only material unanswered choices. In orchestrated mode, the developer brings the scope and the deliverables to the orchestrator, which agrees them under [orchestrated mode](orchestration.md).

## Step 4 — Slice-start candidate

Prepare the selected documents or existing task record for the start. Where selected, the spec owns scope and acceptance; the task list owns ordered deliverables and their status; the implementation plan owns approach, relevant sources, recovery considerations, special authorization limits and review checkpoints. The project pointer records the selected execution mode and its scope, and the sessions of the run for a [reporter](run-report.md#what-the-pointer-holds). Identify the agreed slice ID and name and link the selected records. Reuse them throughout delivery under the document-reuse rules; do not add a separate start record.

For an agreed new sub-slice, add a concise entry to the relevant plan with its parent, ID, intended outcome and agreed ordering. Link the applicable Addy spec/task files for detailed scope and acceptance, and use those same child documents through completion. Record this agreed work before implementation; it need not have been anticipated in the original roadmap.

For an agreed new top-level slice, add a concise roadmap entry with its ID, intended outcome, dependencies and agreed ordering, linking the selected scope and task records. Preserve completed entries and acceptance history. Use `parent: null` in the project pointer under its existing rules.

Agree the integration branch with the user in the conversation; use the repository's established default unless the user selects another target. Say in the existing slice plan, in words, where the slice is worked and where it is joined; under the [record rules](../../../../../../../AGENTS.md#records) a branch name is not written into a file. Resolve a missing or ambiguous target before creating a new slice branch. Create that branch from the integration branch without disturbing another task's work; on resumption, preserve the existing slice branch. Include the agreed slice selection and document links in the project pointer under those rules. Keep the start candidate limited to the agreed scope, planning, task, generated progress report and pointer changes; implementation belongs in Step 6. A start candidate without a current progress report with agreed weights is incomplete. Review it as a description of the agreed work; do not claim implementation is complete. Resolve incomplete scope or unintended changes before committing.

## Step 5 — Slice start established in the delivery context

With authority to create the start commit, run the [progress freshness check](progress.md#report-document-and-session-updates) and correct a missing or stale report through its generator. Stage only the intended files, including the generated report, and inspect the staged diff and paths. Check whitespace, then use the boundary subject:

```text
Slice start - <ID> <Name>
```

Use the configured Git identity. Verify the resulting commit and status. If commit creation fails, diagnose the failure and preserve the candidate; do not bypass a failing check or reset another actor's changes.

The start identifies one slice. On resume, reuse the established start and branch. A request to stage a comparison does not authorize committing it.

## Step 6 — Deliverable loop

Deliver each agreed deliverable as one coherent, verified commit. Include its implementation, relevant tests and directly affected documentation together. If the work needs multiple independently reviewable results, revise the deliverable breakdown before committing.

For each agreed deliverable:

1. Read the relevant implementation, direct consumers and acceptance.
2. Implement the result and update affected documentation or generated outputs through their owners.
3. Run verification appropriate to the changed behavior and correct in-scope failures.
4. Review the complete changes for correctness, scope and preservation of useful existing content.
5. Present the result, actual checks, findings and limitations at the applicable review checkpoint.
6. Once authorized, stage the intended paths, review the staged diff, check whitespace and commit with a meaningful result subject.
7. Verify the commit and report the completed deliverable and next action.

Apply the [execution-mode rules](contract-core.md#execution-modes) and the repository’s review rules at the presentation and commit actions above. Do not add routine post-commit approval pauses unless requested.

Before the work on a task or sub-task starts, set it IN PROGRESS and regenerate the report. When you stop an unfinished task, put it on hold with the thing that holds it. Divide a task that grows too large. The [in-progress](progress.md#keep-the-in-progress-state-true) and [task size](progress.md#task-size-and-breakdown) rules own the detail.

Before a deliverable is committed, its corrections remain part of that result. After accepted commits, use truthful correction commits when needed; do not rewrite accepted history merely to hide the correction process.

## Step 7 — Material corrections and contract updates

Use this step when user steering, implementation discoveries, failed checks or confirmed review findings require correction. It can occur during the deliverable loop, verification, review or preparation for closure; it is not compulsory work when nothing needs correction.

Verify the issue, identify the responsible component and correct the accepted behavior. Make scope or acceptance changes explicit before dependent work. Preserve review findings until each is resolved, explicitly deferred by the user or shown not to apply.

When the cause affects a shared contract or repeated implementation, inspect the directly affected consumers and correct confirmed in-scope instances together. Keep broader investigation tied to that cause.

Apply the repository’s failure-diagnosis and evidence-reuse rules to affected verification and review. Bind reused results to the recorded outcome and its tested code, inputs and environment. After an interruption, resume unfinished checks when completed outcomes are known; inspect an indeterminate result before deciding whether to rerun it. A correction must not manufacture a new review pass or erase an earlier finding.

Return to unfinished implementation, verification or review as appropriate. Preserve completed work and report the actual remaining obligation.

## Step 8 — Final proof and freeze

Assess the complete slice against acceptance, including integration between deliverables. Inspect the delivered changes and relevant intermediate commits, not only the final net diff, when they affect consumers, compatibility or required evidence. Select the necessary checks from the actual changed behavior and consumers. Use existing repository commands and the declared toolchain; do not invent commands or run every suite by default.

Complete every applicable check required by the accepted spec/task files and repository instructions, interpreting selected methods under the [verification selection guidance](addy-method-gates.md#select-and-apply). Reuse passing results while they remain applicable to the current work and environment; report blocked or unexecuted required checks explicitly, and do not claim completion while required verification remains unmet.

Record the commands actually run, their outcomes, omitted checks and relevant limitations concisely in the implementation plan or existing task record selected under the document-reuse rules, following the [record rules](../../../../../../../AGENTS.md#records): a test that stays in the repository proves a behavior, and a check on real services is one dated sentence. Apply the repository’s final-diff and test-removal rules.

Identify the candidate being presented for review in the conversation: its commit and any uncommitted changes. A record names the candidate in words. Here, freezing means keeping that reviewed candidate stable, not creating a special runtime artifact. If implementation changes during review, disclose the change and reassess affected evidence rather than treating the previous review as current automatically.

A failed check returns to the responsible correction through Step 7; classify setup failures under the repository’s verification rules.

## Step 9 — Independent assessments

Follow [participant coordination](participant-coordination.md) for authorized assignments, reviewer continuity and correction handoffs.

Apply Lets Vibe's [independent-assessment defaults and user overrides](../SKILL.md#independent-assessments). Assign Review Vibe to the completed candidate unless the user waived it; assign Test Vibe only when selected. Complete primary self-review and applicable user review regardless. State which assessments actually occurred and record a user waiver where relevant. If a required assessment cannot be completed, report it as blocked or unexecuted; do not mark it inapplicable or close with an unmet assessment requirement unless the user explicitly changes that requirement.

Give an authorized reviewer the agreed scope and acceptance, the actual candidate, relevant changes and consumers, executed verification, known findings and limitations. Independent testing should address meaningful uncovered behavior or risk, not repeat checks merely to demonstrate independence.

Keep findings specific: location, observed problem, impact and required outcome. Distinguish confirmed defects from suggestions and uncertainties. Review evidence belongs to the reviewer who produced it; do not invent sign-off.

Correct confirmed in-scope issues through Step 7, then reassess affected verification and review. If the user accepts a limitation or elects to proceed without another independent pass, record that decision truthfully rather than relabeling a previous finding as a reviewer pass.

## Step 10 — Slice close

Confirm required deliverables and acceptance are complete, applicable review has occurred, and remaining limitations are explicitly recorded. Unmet required acceptance is not completion.

Update task completion and summarize delivered outcomes, executed verification, review disposition and residual limitations in their selected documents or existing task record, following the document-reuse rules. Present the complete result for the applicable closure review. In supervised and copilot modes, obtain approval before final closure; in autonomous mode, proceed within the authorized scope; in orchestrated mode, the developer closes on the orchestrator's release.

Mark the project pointer closed for this slice under the project-pointer rules, retaining its document links. Review the final staged paths and diff, check whitespace, and create the boundary with ordinary Git:

```text
Slice close - <ID> <Name>
```

Commit only the intended completion changes. If preparation or commit fails, preserve the open work and diagnose the exact failure. Do not discard user changes or rewrite accepted history as routine recovery.

Closure does not authorize pushing, publishing, deploying or starting the next slice. The one exception for the next slice is [a chain of slices](contract-core.md#a-chain-of-slices) that the user authorized and that covers it; Step 11 says what the session then does.

## Step 11 — Final state and successor handoff

Verify the close commit, branch and working tree status. Confirm that the selected documents or existing task record match the delivered result and account for remaining limitations. Report unrelated changes separately rather than hiding or removing them.

Integrate the accepted slice into its agreed integration branch before completing delivery. Inspect the source and target tips and their ancestry, and use ordinary Git to merge the slice, allowing a fast-forward when appropriate. Apply the active execution mode and existing authorization; local integration does not authorize a remote push, PR merge, publication or deployment. If the target is missing or ambiguous, resolve that choice rather than inventing a branch or reporting integration complete.

Preserve unrelated target changes. Resolve in-scope merge conflicts, review the resulting diff and run checks justified by integration changes; reuse passing evidence when the accepted tree is unchanged. Verify that the integration branch contains the accepted slice tip, including its close commit, and record the result in words in the existing completion evidence; name the branch and the commits in the conversation. If integration fails or remains pending, keep Step 11 incomplete even though Step 10 has created the close boundary.

Clean up only task-owned temporary resources and processes that are no longer needed. Identify the next planned slice from the actual roadmap if useful, but leave it unopened. Completing a sub-slice does not start that successor or create another child; further new scope requires its own agreement. The one exception is [a chain of slices](contract-core.md#a-chain-of-slices) that the user authorized and that covers the next slice: after the integration is verified, hand over and start one new session for it under the chain rules, or report the stop of the chain that applies and leave the next slice unopened.

Provide a final handoff with the outcome, relevant commits, verified integration result, actual verification, omitted or blocked checks, residual limitations and any remaining user action. In a chain, add what the [chain rules](contract-core.md#a-chain-of-slices) ask each session to give the user at its close. When the user asks for a handoff to another session, at closure or at any earlier point, use the [Handoff skill](../../handoff/SKILL.md). Creating the successor branch belongs to its own slice start. A defect discovered after accepted closure becomes separately scoped work unless the user authorizes another treatment.
