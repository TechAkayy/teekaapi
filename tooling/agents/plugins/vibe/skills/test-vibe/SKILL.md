---
name: test-vibe
description: Independently test specified existing behavior using relevant Addy methods and session progress reporting, only when explicitly invoked.
---

# Test Vibe

Return independent behavioral results and reproducible failures for the assigned work. A prior review or Review PASS is not a prerequisite; this skill has one testing role and does not arrange a delivery workflow.

## Assignment and independence

Assess existing work; this invocation does not start implementation, reopen or close a slice, create commits, or authorize fixes. Do not invoke the other assessment skill automatically. Apply the [execution-mode and approval rules](../lets-vibe/references/contract-core.md#execution-modes) to this assessment. A supplied, unambiguous assessment request is scope agreement: state it and proceed without a redundant approval question.

Read applicable repository instructions. Identify the requested checkout, commit or comparison range and included staged, unstaged and untracked changes. Use the supplied Addy spec/task files and the user's accepted instructions as the expected-behavior baseline, together with directly affected existing contracts. Reuse relevant existing plans; do not require a central requirements store, invent requirements, or create a duplicate spec. Resolve consequential missing or conflicting expectations before dependent assessment; continue checks whose expectations are clear.

The assessor must be independent of the implementation. If this agent authored the work, the explicit invocation authorizes one bounded independent subagent to perform this assessment using this skill directly and the assignment guidance in [participant coordination](../lets-vibe/references/participant-coordination.md). The author supplies context and relays the attributed result without signing it. An already independent assessor works directly and does not spawn another assessor. If an independent participant is unavailable, disclose the limitation instead of labeling self-assessment independent. Create a separate user-visible task only on explicit user request.

Keep implementation, committed tests, specs, the index and history unchanged. Return the result in the session unless a result-file path is expressly assigned. Use temporary isolated probes where needed. For install, build, generation or tests that write files, use an isolated checkout or temporary execution copy containing the exact assessed content, including relevant uncommitted changes; a checkout of HEAD alone does not represent dirty work. Coordinate stability or use a fixed snapshot; if the assessed content changes unexpectedly, identify the affected evidence and stop conclusions about that version until resolved.

## Addy methods

An explicit invocation requires this assessor to select and apply relevant Addy methods itself; the implementer's earlier selection is not a substitute. Follow the [shared method-selection procedure](../lets-vibe/references/addy-method-gates.md). Honor its supervised group checkpoints; agreement on the assessment scope alone does not release those boundaries. Resolve actual skill paths from the repository-local Addy collection, read selected skills and required resources, announce each method and purpose, and identify expected outputs before use. Apply assessment portions within this read-only assignment: proposed fixes remain findings, and a method's implementation or release steps grant no new authority. Keep vanilla bodies unchanged. Resolve a material conflict before the affected action.

Choose methods by the accepted behavior: `browser-testing-with-devtools` for browser interactions, `security-and-hardening` for trust boundaries and abuse cases, `performance-optimization` for accepted performance targets, and `debugging-and-error-recovery` for reproducing failures. Use their relevant testing, measurement and diagnosis guidance, leaving product corrections to the implementation task. Do not select `test-driven-development` merely because this is testing: its implementation cycle is not the assignment.

Method assessment and relevant application are mandatory, not use of every method. If no specialized Addy method fits, explain that and perform the agreed behavioral checks. If a required method, environment or tool is unavailable, report the blocked coverage, continue unaffected checks, and never substitute static inspection for claimed runtime execution.

## Exercise behavior

Build a compact test scope from the supplied spec/task files, accepted instructions and affected contracts. Identify expected outcomes, existing evidence, relevant positive and failure cases, and required environment. Use existing adequate tests first; choose additional probes for concrete gaps rather than expanding coverage without an accepted concern.

Apply the repository’s behavioral-testing, isolation, live-service authorization and toolchain rules to each probe. Establish the required runtime, prerequisites and commands before executing the assigned behavior.

For UI behavior, open the actual surface and operate its controls. For live state, change it while the surface is active. For trust boundaries, test the relevant denied or malformed inputs and required absence of side effects as well as valid controls. A negative assertion over an unproven empty population, an assertion of an unchanged default, or a marker/schema check is not sufficient behavioral evidence.

Reuse passing evidence only while its assessed content, inputs and environment remain applicable. Run focused uncovered or invalidated checks; do not repeat suites solely for independence. Confirm filtered commands executed the intended tests. Investigate failures narrowly, distinguish expected refusals from product failures, and resume known unfinished coverage rather than blindly restarting. Record hangs, leaked processes, forced exits and command-order dependencies when they affect the result.

Temporary probes may reproduce a defect without changing implementation or permanent tests. Proposed regression tests belong in the findings. Track and clean up only task-owned processes, probes and execution copies, and report any retained resources or cleanup limitation. Record whether evidence is mocked, local integration or an authorized live service.

## Session progress

Read and use [progress-report](../progress-report/SKILL.md) automatically, without a separate invocation. Establish a short assessment plan in the session. Report after scope and methods are established, at meaningful completed assessment or verification boundaries, on blockers or scope changes, and before the final handoff. Include completed work, current work, remaining work, blockers and the next checkpoint. Use assessment activities rather than slice-delivery steps; no weighted percentages or file persisted solely for progress. If delegated, the assessor reports in its session and the calling agent surfaces meaningful progress in the user's active session. If progress-report is unavailable, report the same facts plainly and disclose the limitation; reporting must not block authorized assessment.

## Results and handoff

Return PASS only when required testing coverage is satisfied with no unresolved blocking failures, FIX for reproducible product failures, or ESCALATE when missing expectations, independence, tools or environment prevent the required conclusion. Do not claim Testing PASS solely because supplied test commands passed if the assigned behavior remains untested.

Identify the assessed version and expected-behavior sources, Addy methods applied, checks executed or reused, actual test counts where available, expected and observed outcomes, cleanup and untested risks. Findings have stable IDs, severity, reproducible commands or interaction steps, evidence, the violated expectation, impact, required outcome and regression guidance. Distinguish failed, blocked, skipped and unexecuted checks; test completion does not authorize delivery closure or fixes.

Stop after the testing handoff. On an explicit retest request, retain prior finding IDs, verify the corrected version and relevant integration effects, and state what now passes, remains failing or was not retested. Do not automatically start implementation, recruit a Reviewer or continue into another delivery.
