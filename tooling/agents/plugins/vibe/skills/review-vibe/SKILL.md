---
name: review-vibe
description: Independently review specified existing work using relevant Addy methods and session progress reporting, when invoked directly or composed by an authorized workflow.
---

# Review Vibe

Return an independent, evidence-backed assessment of specified work and actionable findings. The result informs the user's decision; it does not approve delivery on their behalf.

## Assignment and independence

Assess existing work; this invocation does not start implementation, reopen or close a slice, create commits, or authorize fixes. Invocation may come directly from the user, from [Lets Vibe's assessment selection](../lets-vibe/SKILL.md#independent-assessments) or from [Handoff's record check](../handoff/SKILL.md#3-check-the-records-with-an-independent-reviewer); all use this procedure. Do not invoke the other assessment skill automatically. Apply the [execution-mode and approval rules](../lets-vibe/references/contract-core.md#execution-modes) to this assessment. A supplied, unambiguous assessment request is scope agreement: state it and proceed without a redundant approval question.

Read applicable repository instructions. Identify the requested checkout, commit or comparison range and included staged, unstaged and untracked changes. Use the supplied Addy spec/task files and the user's accepted instructions as the expected-behavior baseline, together with directly affected existing contracts. Reuse relevant existing plans; do not require a central requirements store, invent requirements, or create a duplicate spec. Resolve consequential missing or conflicting expectations before dependent assessment; continue checks whose expectations are clear.

The assessor must be independent of the implementation. If this agent authored the work, this invocation authorizes one bounded independent subagent to perform this assessment using this skill directly and the assignment guidance in [participant coordination](../lets-vibe/references/participant-coordination.md). The author supplies context and relays the attributed result without signing it. An already independent assessor works directly and does not spawn another assessor. If an independent participant is unavailable, disclose the limitation instead of labeling self-assessment independent. Create a separate user-visible task only on explicit user request.

Keep implementation, committed tests, specs, the index and history unchanged. Return the result in the session unless a result-file path is expressly assigned. Use temporary isolated probes where needed. For install, build, generation or tests that write files, use an isolated checkout or temporary execution copy containing the exact assessed content, including relevant uncommitted changes; a checkout of HEAD alone does not represent dirty work. Coordinate stability or use a fixed snapshot; if the assessed content changes unexpectedly, identify the affected evidence and stop conclusions about that version until resolved.

## Addy methods

This invocation requires this assessor to select and apply relevant Addy methods itself; the implementer's earlier selection is not a substitute. Follow the [shared method-selection procedure](../lets-vibe/references/addy-method-gates.md). Honor its supervised group checkpoints; agreement on the assessment scope alone does not release those boundaries. Resolve actual skill paths from the repository-local Addy collection, read selected skills and required resources, announce each method and purpose, and identify expected outputs before use. Apply assessment portions within this read-only assignment: proposed fixes remain findings, and a method's implementation or release steps grant no new authority. Keep vanilla bodies unchanged. Resolve a material conflict before the affected action.

Always use `code-review-and-quality` as the core review method. Select additional methods for actual concerns, such as `security-and-hardening`, `api-and-interface-design`, `deprecation-and-migration`, `documentation-and-adrs` or `doubt-driven-development`. Do not load the whole collection. If the core method or required tools are unavailable, identify the blocked method and available coverage; do not claim a complete Addy-backed review. Continue useful independent inspection and report the limitation.

## Assess the work

Compare the agreed expectations with the changed implementation and directly affected consumers. Examine correctness, maintainability, architecture, security and performance using the core method. Distinguish demonstrated defects from suggestions and unresolved questions; personal style preferences and unrequested features are not blockers.

Assess the specification and implementation together against the project's composition policy and selected foundation contracts, where the project has them. Challenge duplicated foundation or existing application capabilities, reusable behavior placed in a product, duplication across channels, product-specific dependencies in platform code, unsupported interfaces and unproven lifecycle or durability guarantees. Check the proposed owner, required/optional dependencies, provider loss and disposal, persistence/recovery boundaries and acceptance through actual consumers. A specification omission does not waive an applicable durable requirement. A composition selecting both platform and product plugins is not by itself an ownership defect. Use the reading map and current applicable evidence for material gaps; do not repeat a full peer audit or create another assessment stage.

For work with a maintained progress report, check the [structured treatments](../lets-vibe/references/progress.md#plan-and-status) against actual decisions and evidence: resolved non-implementation must not claim executed checks, deferred/blocked work must not earn completion, and remaining acceptance must stay visible. Check that the IN PROGRESS items are the items in work, that each item on hold names what holds it, and that a large unfinished task is divided under the [in-progress and task-size rules](../lets-vibe/references/progress.md#keep-the-in-progress-state-true). Check the report text against the [language and length rule](../lets-vibe/references/progress.md#language-and-length); the renderer checks length only. Do not apply that rule to the task body, the spec or the plan, which are written for agents.

Check UI behavior against recorded user decisions under the [UI decision consultation gate](../lets-vibe/references/addy-method-gates.md#ui-decision-consultation). Report any needed unresolved UI decision to the user through the assignment; a reviewer must not settle it or treat its own preference as approval.

For source adaptation or substantial replacement, inspect the selected original and complete resulting content, including relevant tests, examples, failure handling, deletions, renames and file-type changes. Account for material retained, adapted, moved, superseded or deferred meaning against accepted scope. Independently verify claimed preservation or absence; a filename change or byte comparison alone does not establish semantic completeness. Keep this accounting in assessment evidence rather than creating a migration database.

Assess existing verification against the actual content, inputs, environment and required behavior. Passing commands are not enough when assertions never exercise the affected consumer, observe an empty population, or merely match schema or marker text. Execute focused uncovered challenges when needed; do not rerun adequate current checks just to demonstrate independence. For changed interactive behavior, require actual interaction evidence, including state changes while a surface is open when relevant. Zero additional commands is valid when no material gap remains.

## Session progress

Read and use [progress-report](../progress-report/SKILL.md) automatically, without a separate invocation. Establish a short assessment plan in the session. Report after scope and methods are established, at meaningful completed assessment or verification boundaries, on blockers or scope changes, and before the final handoff. Include completed work, current work, remaining work, blockers and the next checkpoint. Use assessment activities rather than slice-delivery steps; no weighted percentages or file persisted solely for progress. If delegated, the assessor reports in its session and the calling agent surfaces meaningful progress in the user's active session. If progress-report is unavailable, report the same facts plainly and disclose the limitation; reporting must not block authorized assessment.

## Findings and handoff

Return PASS when the assigned review is complete with no unresolved blocking defects, FIX for supported defects requiring correction, or ESCALATE for a material unresolved baseline, independence or evidence gap. A PASS is limited to the inspected scope and version, not a guarantee of defect-free code or permission to commit or release.

Identify the assessed version and baseline sources, Addy methods applied, inspected scope, checks run or reused, omitted coverage and residual limitations. Give each finding a stable ID, severity, location, observed failure, violated expectation, impact, required outcome and suitable regression evidence. Keep optional suggestions separate. Do not invent findings to justify the review.

Stop after returning the assessment and cleaning up task-owned temporary resources. Corrections remain with the implementation task and the user's decision. On an explicit follow-up, reuse the same reviewer where available, inspect the corrected version and affected integration, retain finding IDs and independently disposition earlier findings. Reuse evidence still applicable; do not automatically begin a correction loop or claim another participant's sign-off.
