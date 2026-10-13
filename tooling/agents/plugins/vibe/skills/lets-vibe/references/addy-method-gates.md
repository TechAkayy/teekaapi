# Addy method selection

Use this reference during an explicitly invoked Lets Vibe, Review Vibe, Test Vibe, Dependency Upgrade, Grill Peers or Roadmap Review run. The routing matrix below defines the groups to assess at each Lets Vibe transition; Review Vibe and Test Vibe use the assessment routing below within their own role boundaries. Dependency Upgrade, Grill Peers and Roadmap Review use the transitions in their own entry skills; the user does not need to invoke each selected Addy method separately. In supervised mode, each group has the approval boundary below. Selection stays within the agreed outcome, active execution mode and existing approval boundaries.

The invoking entry skill owns method selection; do not automatically select `using-agent-skills` as another selector. If the user explicitly invokes it, apply it within the agreed scope and execution mode.

## Select and apply

1. Identify concrete needs from the accepted scope, current deliverable, changed interfaces, observed failures and required verification.
2. Assess every group mapped to the current transition by the applicable entry skill or routing below, using its named candidate methods and selection signals. Inspect the actual local descriptions and entry conditions before choosing. The matrix is the required starting point, not an exhaustive limit: a concrete new concern or explicit user choice can make another group or available method relevant at the current step. Explain that addition rather than silently replacing the mapped assessment with free-form discovery.
3. Exclude methods whose concern is absent or whose prerequisites are unmet. Select the smallest set that covers the relevant needs, honoring applicable explicit user choices. Do not stack overlapping methods merely to show activity.
4. Read the complete selected skills and their required resources, announce the group, methods and reasons, identify their expected outputs, and apply them within the current authorization. Use the exact input/output paths established by [slice-document reuse](requirements-alignment.md#reuse-the-slice-documents); update the owning documents instead of creating parallel records.
5. Reassess when the work changes materially or reaches the next selection transition. Reuse an applicable selection during unchanged work; do not repeatedly reload skills or replay completed methods.

Assessing a group is mandatory at its mapped transition; applying every candidate method is not. If an applicable group yields no selected method, briefly explain why when reporting that selection, without repeating unchanged assessments. In supervised mode, obtain the skip approval defined below before continuing without a method. Explain an inapplicable explicit user selection rather than manufacturing scope to use it. If a needed method is unavailable, report the limitation and whether the accepted outcome can still be achieved; do not claim execution or install it implicitly.

When selecting `constraint-driven-development`, account for the [known floor-guard limitation at the pinned revision](../../../../addy/UPSTREAM.md#known-reference-limitation) before proposing enforcement.

Apply the repository's verification policy when interpreting selected Addy methods. Their generic TDD, Definition of Done, pre-commit and browser checklists supply techniques, not additional acceptance requirements. Select checks for the actual changed behavior and identify that coverage in the existing plan or review context; do not copy a full-suite command into acceptance merely because a skill lists it. A method or group can use existing evidence or inspection when sufficient. Keep imported Addy bodies unchanged and honor explicit repository or accepted task checks.

## Mode-aware progression

Apply the execution mode and scope established under the [execution-mode rules](contract-core.md#execution-modes) and the [project-pointer rules](requirements-alignment.md#project-pointer). In copilot mode, assess the same groups, read and apply selected methods, and explain meaningful selections or skips without waiting for method-group approval. Continue through necessary internal actions, verification and corrections within the agreed deliverable. Keep user participation focused on consequential unresolved choices and useful hands-on help; final candidate, commit, next-deliverable and external-action boundaries still follow repository policy. Do not turn each method's internal checklist into another approval sequence when the action is already authorized.

In autonomous mode, progress through groups within the explicit authorization. In orchestrated mode, the developer progresses in the same way and brings to the orchestrator what the other modes bring to the user. In all modes, retain required evidence and assessments, explicit user stops and scope limits. Group assessment is an execution responsibility; permission to implement, commit or publish comes from the applicable agreement. These rules also apply to delegated assessments using this shared procedure.

## UI decision consultation

In supervised, copilot and autonomous modes, consult the user before settling any needed user-facing UI decision that is not already resolved by explicit user direction or an agreed design. This includes choices about layout, navigation, controls, presentation and interaction behavior, including empty, loading, failure and recovery states. These are the surfaces users interact with; the agent must not substitute its own design preference for the user's participation. In orchestrated mode the developer consults the orchestrator, which decides in the user's place under [orchestrated mode](orchestration.md#how-the-orchestrator-decides) and looks at the real screens before it accepts them; the rest of this gate then holds with the orchestrator as the one who is consulted, whose decision is waited for and to whom an open choice returns.

Present the concrete choice, recommendation and relevant consequences; use a sketch, wireframe or example when it helps the user decide. Wait for the user's decision before dependent implementation. Scope approval, autonomous authorization, method selection, a method skip or delegation does not release this gate. It applies at any delivery or assessment transition, even when no UI method is selected. A reviewer's recommendation, silence or elapsed time is not the user's decision. Provisional examples remain proposals until the user decides.

Record the decision and its scope in the existing spec, plan or task context and carry it through delegation, correction and resumption. Reuse decisions already supplied: implementing an agreed design does not require another approval. If steering or new evidence creates an unresolved UI choice, return only that choice to the user and continue independent authorized work while it is pending. This gate does not add or reorder a method group or delivery step.

## Supervised group checkpoints

In supervised mode, stop before beginning the selected method work for each mapped or newly relevant group. Each group (`spec`, `plan`, `build`, `test`, `webperf`, `code-simplify`, `review`, `ship`) is a separate user-participation boundary. Scope agreement or approval of the preceding group does not automatically release it.

1. Establish enough context to present the group: known inputs and decisions, its purpose for the current assignment, proposed methods and outputs, and unresolved choices needing the user's participation. Discovery needed to prepare this presentation is allowed; do not begin the proposed method work or settle the user's choices before approval.
2. Present one group at a time and stop. For `spec`, invite the user to shape the outcome, exclusions and acceptance before treating the slice scope as agreed. For other groups, present the relevant planning, implementation, testing, review or handoff decisions. If no method in a mapped group applies, explain the proposed skip and obtain approval for that disposition.
3. Apply the user's input and proceed only with approval covering that group's stated work. A contextual go or cool releases the presented boundary under [contract core](contract-core.md#steering-and-checkpoints). Carry forward already supplied decisions rather than interviewing the user again about settled matters.
4. Complete the approved work and report its outcome before presenting the next group. Approval covers the selected methods' necessary internal activities within the stated scope, including their prescribed verification; it is not a separate approval request for every method or tool action. If several groups must inform the same implementation action, obtain their approvals one at a time before that dependent action, then execute the agreed methods together.
5. Preserve the active group, approved scope, decisions, proposed skips and next unapproved group in the existing task context and progress report. Resume approved unfinished group work without another approval. Re-entering a group at a later mapped transition, or materially changing its proposed work beyond the existing approval, creates a new boundary. Routine unchanged work within an approved group does not.

These checkpoints apply to the invoking entry skill, including independent assessments using this shared procedure. A delegated assessor reports the proposed group through the primary agent to the user and waits for the actual user decision; the primary agent cannot approve it on the user's behalf. Other commit, delivery-step and external-action checkpoints still apply. A group approval releases only the actions explicitly presented, not a subsequent commit or publication that requires its own approval.

Copilot, autonomous and orchestrated progression follows the mode-aware rules above; preserve any stricter user-requested checkpoint. Selecting a method or delegating an assessment never changes the execution mode or waives a checkpoint.

## Foundation and peer preparation

This preparation applies when the project's reading map names a foundation or primary peers; a project that names neither has no such set to assess, and this section then asks for nothing. At the `spec` transition, use the project's reading map to assess its foundation and primary-peer set before recommendations or interview questions that depend on their capabilities. Establish what the selected foundation already owns, identify the relevant peer mechanisms, and verify the source contracts needed for the project's proposed responsibilities. Preserve the user's desired outcome while making compatibility limits visible. This preparation is required even when no separate source-driven method is selected; in supervised mode, bounded discovery needed to present an informed group proposal is allowed before approval.

Start with the project's exact selected dependency pin and existing application owners. Distinguish a complete reusable capability, a partial solution to extend and an unsupported integration gap before proposing new work. Select relevant primary-peer evidence by the responsibility being designed, independently of client packaging or hosting provider. Establish which reusable platform capability owns the behavior, what a thin product composition selects and which channel differences require adapters; do not make a shared capability product-owned merely because one product consumes it first.

Account for required and optional dependencies, activation and provider loss, disable/re-enable, cancellation and disposal, separate host/browser lifetimes, and persistence, backup and recovery where applicable. Distinguish live state from confirmed durable outcomes. Specify acceptance through actual consumers and affected channels, including absent capabilities and recovery, without inventing a Cartesian product of every possible product and channel. The existing specification or plan must identify what is already supplied, the verified remaining gap and the reason for any necessary departure from the project's composition policy.

Carry the selected source links/revisions, concrete design or acceptance consequences, non-adoption rationale where material, and unresolved proof into the existing spec or plan. Distinguish inspected peer behavior, accepted project decisions and the project's executed evidence. Do not require a fresh audit of every peer or a separate reading log. Revisit the relevant evidence when a material solution question, compatibility gap or overlapping responsibility arises during `plan`, `build` or `review`; reuse current applicable findings for unchanged work. The repository reading map owns peer names and routes so this procedure stays portable.

## Routing matrix

Read the mapped groups before the work they inform. The step numbers refer to [Slice Delivery](fresh-slice-delivery.md); they are ordinary guide references, not runtime stage IDs. Steps 1, 4 and 5 use the accepted selection unless a new concern requires reassessment. A slice and a sub-slice use the same routing.

| Group | Lets Vibe assessment transition | Candidate Addy methods |
|---|---|---|
| `spec` | Step 2 — accepted inputs; revisit when requirements change | `interview-me`, `idea-refine`, `spec-driven-development`, `context-engineering`, `source-driven-development`, `doubt-driven-development` |
| `plan` | Step 3 — scope and deliverables; revisit when interfaces or dependency ordering change | `planning-and-task-breakdown`, `api-and-interface-design`, `frontend-ui-engineering`, `deprecation-and-migration` |
| `build` | Step 6 — each deliverable; Step 7 — corrections | `incremental-implementation`, `test-driven-development`, `frontend-ui-engineering`, `api-and-interface-design`, `context-engineering`, `source-driven-development`, `doubt-driven-development`, `debugging-and-error-recovery` |
| `test` | Steps 6–7 — implementation/corrections; Step 8 — final verification; Step 9 — assessment coverage | `test-driven-development`, `browser-testing-with-devtools`, `debugging-and-error-recovery`, `security-and-hardening`, `performance-optimization` |
| `webperf` | Steps 6–7 — implementation/corrections; Step 8 — final verification | `performance-optimization`, `browser-testing-with-devtools`, `frontend-ui-engineering`, `observability-and-instrumentation` |
| `code-simplify` | Steps 6–7 — assess after a result is functionally complete and before final verification | `code-simplification`, `code-review-and-quality`, `test-driven-development` |
| `review` | Step 9 — review of the current candidate; also at the deliverable review in Step 6 | `code-review-and-quality`, `security-and-hardening`, `performance-optimization`, `doubt-driven-development`, `documentation-and-adrs`, `deprecation-and-migration` |
| `ship` | Step 10 — closure; Step 11 — integration and handoff | `shipping-and-launch`, `git-workflow-and-versioning`, `ci-cd-and-automation`, `documentation-and-adrs`, `deprecation-and-migration`, `observability-and-instrumentation`, `security-and-hardening` |

Resolve the named candidates from the repository-local Addy collection; do not load every body merely to assess a group. Additional available methods may be selected for a concrete need, but do not silently remove mapped candidates or pretend an unavailable method ran. `using-agent-skills` remains explicitly selected only under the rule above.

## Independent-assessment routing

- **Review Vibe:** assess the `review` group and always apply `code-review-and-quality` as required by that entry skill. Assess `test` and `webperf` when verification gaps or runtime/performance concerns warrant them. Other groups may supply relevant assessment methods, such as interface or migration analysis, within the read-only assignment.
- **Test Vibe:** assess the `test` group and `webperf` when runtime, performance or observation concerns apply. Use the entry skill’s behavior-specific selection rules; do not select `test-driven-development` merely because this is testing. Its implementation cycle does not become part of an assessment.
- Each assessor selects and applies its own methods. The implementer’s earlier method use is evidence to inspect, not a substitute for this selection. Establish the selection at assignment start and reassess when the candidate, scope, failure evidence or relevant coverage changes.

Method assessment never launches another participant. The entry skills and [participant coordination](participant-coordination.md) control independent assignments, authorized follow-ups and result attribution.

## Selection signals

| Concern | Consider methods addressing | Unnecessary when |
|---|---|---|
| `spec` — Requirements | Unclear intent, material assumptions, accepted source obligations, competing interpretations, or requirements shared by several consumers | Accepted inputs resolve the consequential choices |
| `plan` — Planning and design | Dependency ordering, public interfaces, UI architecture, or compatibility and migration | The accepted deliverable already resolves the relevant sequence and interfaces |
| `build` — Implementation | Authorized behavior, interface/UI work, peer-code adaptation or a reproduced defect requiring implementation | The work is inspection-only or implementation is not yet authorized |
| `test` — Verification and debugging | Changed observable behavior, browser interactions, trust boundaries, measured performance concerns or reproduced failures | Existing applicable checks adequately cover the outcome and no unresolved failure remains |
| `webperf` — Browser performance and observation | Loading, responsiveness, accessibility behavior, measured performance issues, or operational visibility needed by acceptance | There is no relevant runtime concern or actionable measurement need |
| `code-simplify` — Simplification | Demonstrated duplication or accidental complexity in the current deliverable | Cleanup would be speculative, unrelated, or erase behavior that has not been understood |
| `review` — Review | Correctness, security, performance, unresolved assumptions, documentation or migration concerns in the candidate | The particular concern is absent or its required review is already complete and current |
| `ship` — Release and handoff | Release readiness, CI/CD, documentation, migration, or operational requirements included in scope | The agreed work has no release, operational-readiness or handoff requirement |

## Examples

These scenarios illustrate selection; they are not unconditional bundles. Evaluate the named candidates against the actual assignment and already-current evidence.

| Situation | Groups to assess | Illustrative methods |
|---|---|---|
| Browser UI behavior during Step 6 | `build`, `test`, `webperf` | `frontend-ui-engineering`, `test-driven-development`, `browser-testing-with-devtools`; add performance measurement only when warranted |
| An API change affecting a trust boundary during implementation | `plan`, `build`, `test` | `api-and-interface-design`, `incremental-implementation`, `test-driven-development`, `security-and-hardening`; the interface signal warrants revisiting `plan` even during Step 6 |
| Documentation-only candidate review | `review` | `documentation-and-adrs`; do not invent implementation, browser or release work |
| Measured performance risk during final verification | `test`, `webperf` | `performance-optimization`, `browser-testing-with-devtools`, `observability-and-instrumentation` |
| A reproduced failure requiring correction | `build`, `test` | `debugging-and-error-recovery`, `test-driven-development` when implementing the regression/fix |
| Release readiness and version-control handoff | `ship` | `shipping-and-launch`, `git-workflow-and-versioning`; preparation does not independently authorize publication |

## Failure recovery

Apply repository verification and recovery policy through the selected methods. On a failure, select `debugging-and-error-recovery` when applicable and:

1. Diagnose the bounded failure before editing, including workspace, prerequisites and current build outputs. Identify the responsible contract and inspect direct consumers plus relevant sibling implementations, fixtures, documentation or generated consumers that may share the same faulty assumption. Keep this inspection tied to the evidenced cause.
2. Identify required checks that did not execute because of the failure or interruption. Correct confirmed in-scope instances together rather than fixing only the first visible symptom. In a read-only assessment, return those findings instead of editing implementation.
3. Run the failed behavior through the narrowest useful repository check first. If it still fails, diagnose it before launching broader verification. Once corrected, complete the required previously unexecuted or invalidated checks; stop and diagnose another failure rather than blindly restarting an aggregate.
4. Reassess the necessary verification coverage and choose a sufficient set of actual repository commands. Reuse applicable passing results; avoid selecting both an aggregate and its covered children as duplicate final verification. If an aggregate is explicitly required by accepted task criteria or repository policy, run it even when focused diagnostics have passed. A generic selected-method checklist does not establish that requirement; diagnostics do not waive an actual requirement.
5. Record outcomes against the actual code, inputs and environment. Resume known unfinished work after interruption and inspect indeterminate outcomes before retrying. Use the invoking skill’s progress-reporting rules to keep unfinished work and completed corrections truthful; [delivery progress](progress.md) applies during Lets Vibe, while assessment skills report their own activities.

Recovery remains within the assigned work and does not add a delivery stage. Reassessing method groups follows the supervised group checkpoints above; ordinary correction inside an already approved group does not create another gate. Scope changes and external or destructive actions remain subject to repository authorization and existing user checkpoints.

## Method boundaries

Preserve vanilla Addy skill bodies and resources. Selection policy belongs here and in the invoking entry skill. A method does not change the active execution mode, grant additional authority, introduce another mandatory delivery step or replace an applicable user-review checkpoint. The group checkpoints above are explicit workflow boundaries, not authority granted by a selected method.

A review method used by the implementer supports self-review and does not constitute independent reviewer sign-off. An assigned independent reviewer uses its selected methods to produce its own attributed assessment. Report who performed the review and what evidence exists. Resolve a concrete conflict between a selected method and the accepted scope before the affected action, while continuing independent authorized work.
