---
name: lets-vibe
description: Resume agreed work or define a new slice's scope and coordinate its delivery when explicitly invoked.
---

# Lets Vibe

Use this entry skill to coordinate one agreed slice from scope agreement through implementation, verification and completion. Follow repository instructions and the user's current scope, execution mode and approvals.

## Select the work

Follow the [run agreement and checkpoint rules](references/contract-core.md) when establishing or resuming the run and when steering changes its scope or stop conditions.

Read the applicable repository instructions, the `plans/project-state.json` pointer when present, relevant roadmap entry, available spec/task files, accepted user decisions and current Git state. Apply the [project-pointer rules](references/requirements-alignment.md#project-pointer) when selecting or resuming work. Use the user's named slice when supplied. Otherwise resume the active unfinished slice or sub-slice, or propose the next unambiguous planned slice whose prerequisites are complete. Consult historical material when it is an accepted input or directly relevant to the work. On resume or handoff, recover the current agreement and unfinished work; reread guidance when context is missing or the guidance has changed. A roadmap entry alone does not prove readiness or completion.

When no unfinished work or ready planned slice can be established, explain the current state and ask what outcome the user wants to work on next. If the user already describes new work, use that scope and ask only about consequential missing details. A completed roadmap is a scope-discovery starting point; it does not require reopening completed work.

For new work, follow the [slice-selection and preparation rules](references/fresh-slice-delivery.md#step-1--slice-preflight) to select existing planned work, define a new top-level slice, or define a sub-slice under a completed parent. All choices use the same delivery procedure; execution mode remains supervised, copilot, autonomous or orchestrated.

A bare invocation starts scope discovery for a new slice or resumes already approved work. It does not select autonomous or orchestrated mode or release an outstanding review checkpoint. Reuse scope approval already given; otherwise present the proposed scope before implementation.

State the slice ID and name, intended outcome, exclusions, coherent deliverables, acceptance criteria, relevant inputs and verification. Link existing planning records instead of copying them. Ask only about consequential choices the available context does not resolve.

Follow [slice-document reuse](references/requirements-alignment.md#reuse-the-slice-documents) to identify the selected documents or existing task record and carry their exact paths through delivery. Those records hold the slice context and completion notes; no additional slice record is required.

## Establish mode and checkpoints

Apply the [execution-mode and approval rules](references/contract-core.md#execution-modes) and the authority rules in the applicable `AGENTS.md`. Recover the recorded mode and its scope under the [project-pointer rules](references/requirements-alignment.md#project-pointer), preserving applicable authorization across sessions. Carry that mode, scope and outstanding checkpoints into supporting-method assignments. The delivery guide places scope, deliverable and closure reviews within its steps; use [contract core](references/contract-core.md) for user-named checkpoints and steering.

When the user selects orchestrated mode, in these or in like words such as “orchestrator mode”, follow [orchestrated mode](references/orchestration.md) from its start. The selection alone starts it, and the user writes no other instruction: the session that the user told to orchestrate asks its three questions before any other work, and delivers nothing itself.

When the user asks for the reporter, in that word or in like words such as “report on the run”, act as [the reporter](references/run-report.md) of the run, in whichever mode it is, and as nothing else: run the run report, print it as the tool gives it, and tell the user when its first line is not “Nothing needs you.” Print it at once and then at each full hour of the clock, by the means of the application that runs the session, until the run closes or the user stops it. A reporter starts no slice and resumes none, selects no mode and changes no file.

Apply the [UI decision consultation gate](references/addy-method-gates.md#ui-decision-consultation) in every mode, including when no supporting method is selected. Carry agreed designs and outstanding UI choices into planning, implementation, review and delegated assignments.

Compatible steering updates the active slice; a status question does not cancel it. Make consequential scope changes visible and resolve them before dependent work. Resume at the next unfinished action without repeating completed work merely because context changed.

## Route delivery

Follow the bundled [Slice Delivery guide](references/fresh-slice-delivery.md) for implementation, verification, correction and closure. Carry the agreed slice, execution mode, approvals, inputs, deliverables and acceptance into that procedure. Read the sections needed for the current step. The guide is a supporting reference, not a separately invoked skill.

Use one branch per slice and ordinary Git. Slice boundary subjects are `Slice start - <ID> <Name>` and `Slice close - <ID> <Name>`; intermediate subjects describe meaningful results. When resuming, reuse the existing branch and start boundary.

For approved peer-code reuse, follow the [input and preservation guidance](references/contract-core.md#run-agreement-and-inputs).

For an external or irreversible action within the accepted scope, follow [public-boundary preparation and verification](references/public-boundary.md).

Inside a Lets Vibe run, a user request for a handoff to another session starts [Handoff](../handoff/SKILL.md), and a request to be walked through something starts [Walkthrough](../walkthrough/SKILL.md); the user does not need to name either skill. Outside a run, a person types their names, for [the reason given in the agents package](../../../../README.md#why-a-skill-starts-only-when-a-person-asks).

Installing this entry skill does not start a slice.

## Independent assessments

The primary agent owns implementation, verification and self-review using relevant Addy methods. Every slice and sub-slice requires an independent [Review Vibe](../review-vibe/SKILL.md) assessment of the completed candidate before closure by default. Independent [Test Vibe](../test-vibe/SKILL.md) testing remains optional and runs only when the user requests it. Explicit user steering overrides either default; carry the current selection and any review waiver in the existing task context. These defaults do not change execution mode or release user review and commit checkpoints.

Invoking Lets Vibe authorizes the required bounded reviewer assignment without another request to enable it. Reuse one independent reviewer for the slice and affected correction follow-ups needed to assess the final candidate; do not create a reviewer per step or require unchanged work to be reassessed. Either assessment can also be requested directly against existing work. Supply the actual candidate, relevant Addy spec/task files, accepted instructions and current evidence using [participant coordination](references/participant-coordination.md). The implementing agent must not sign its own independent assessment. Review does not activate an independent tester.

Return findings to the implementation task. Resolve corrections within the user's authorized scope and obtain the reviewer's disposition on affected changes before closure, unless the user explicitly changes that requirement. A missing reviewer or unresolved blocking assessment remains visible; do not silently replace independent review with self-review. Preserve applicable user approval before closure; assessment results do not release it.

## Select supporting methods

During an explicitly invoked Lets Vibe run, automatically assess available Addy methods when planning the work, beginning a deliverable, responding to a failure or material scope change, and preparing for review or closure. Follow the explicit group-to-step routing matrix in [Addy method selection](references/addy-method-gates.md): assess every mapped group, then select and apply the smallest relevant method set without requiring separate user invocation. Revisit other groups when concrete new concerns warrant them. Assessment is required at these transitions; applying a particular method depends on the actual work. In supervised mode, follow the reference’s group checkpoints: present each group and stop for user participation and approval before its method work, including approval of a proposed skip. In copilot mode, announce the relevant selection or skip and continue within the agreed deliverable under the reference's mode-aware progression rules. Honor the user's applicable explicit method choices.

Before applying a selected method, read its complete skill instructions and the resources it requires, announce its purpose, and identify the files or other outputs it expects. Link related records rather than duplicating their content. Keep selection proportional; do not load the whole collection or require a method for every step.

Resolve selected Addy methods from the repository-local Addy collection and read their actual skill paths. Use the canonical vanilla Addy bodies and resources. Keep method routing here and execution-mode policy in [contract core](references/contract-core.md#execution-modes); method selection does not authorize changing the upstream skill. Apply each method within the slice's scope and repository rules. If its output or procedure conflicts with the accepted work, explain the specific conflict and resolve it before the affected action.

If no method is relevant, proceed without one. If a selected method is unavailable, report that limitation and assess whether the accepted outcome can still be met using the delivery guide; do not claim the missing method was executed or install it implicitly.

## Show progress

Follow [narration guidance](references/narration.md) for the requested communication density and complete readiness-checkpoint reports.

Use the [progress-report skill](../progress-report/SKILL.md) with [delivery progress rules](references/progress.md) after each completed delivery step, at other meaningful transitions and on request. Pass the actual slice plan and current facts; it needs no separate user invocation during this run. Keep the complete report in the agreed generated document, with short linked conversation updates, under those rules. Create the report at the plan step so that the slice start already has it, write it in Simplified Technical English, keep the in-progress state true and divide a task that grows too large; the delivery progress rules own each of these. Preserve completed work, current action, remaining work, blockers and the next review checkpoint or terminal stop.

Reconcile each task’s structured treatment when its decision, evidence, review or pause state changes, following [reporting transitions](references/progress.md#reporting-transitions). Record resolved non-implementation decisions promptly and keep unresolved acceptance visible.

Do not invent percentages. If the reporting skill or renderer is unavailable, provide a short factual status and identify the limitation without claiming to have generated or checked the report. Reporting must not block otherwise authorized implementation.

## Finish

The delivery guide closes only after required acceptance is met and applicable user review is complete. Complete integration and handoff under [Step 11](references/fresh-slice-delivery.md#step-11--final-state-and-successor-handoff) before reporting delivery complete. Report the result, actual verification, relevant commits and residual limitations; leave incomplete requirements explicit. Closing this slice does not start its successor, unless the user authorized [a chain of slices](references/contract-core.md#a-chain-of-slices) that covers it; then the session hands over and starts one new session for the successor under those rules. When the user asks for a handoff to another session, at closure or earlier, use the [Handoff skill](../handoff/SKILL.md).
