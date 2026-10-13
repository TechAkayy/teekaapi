# Requirements alignment

Use this reference when descriptive requirements and their directly affected plans, architecture, decisions, acceptance, verification or product documentation need reconciliation before implementation. Apply it within the agreed scope when an alignment need exists.

## Reuse the slice documents

When an entry skill selects Addy methods, identify the exact existing spec, implementation plan and task-list paths (or designated tracker) for the selected work. State these in the session before method work and carry the same paths into method assignments, independent assessments and resumed sessions. Link them from the existing implementation plan; the project pointer below may expose those same paths for discovery. Do not create another registry or separate slice-description, completion or review-report file.

The spec owns accepted scope and success criteria. The implementation plan owns approach, decisions and concise completion/verification notes; the task list owns task status and task-specific acceptance. Project architecture and roadmap documents own cross-slice constraints and ordering. Link those sources rather than maintaining duplicate requirements or checklists. Multiple module specs are valid when the accepted capability map calls for them; this rule prevents competing copies, not justified decomposition.

Reuse and update the same documents for the same work. For missing outputs, use the [new-slice document locations](#new-slice-document-locations) below and present the actual paths at the existing spec/plan checkpoint. A path difference is not a reason to create another plan. Do not silently relocate an existing document or overwrite another unfinished plan. Resolve a consequential path or ownership conflict before writing; do not edit vanilla Addy instructions to resolve it.

On an accepted scope change, update its owning spec and affected tasks, preserving completed work and explicit exclusions. At handoff, provide the selected paths, candidate and outstanding decisions. Reviewers and testers assess against those same inputs and return findings; their assessment does not create a replacement spec or authorize changing acceptance.

Keep progress, paragraph reviews and execution discussion in the session. Persist a separate report only when the user requests one or an agreed deliverable requires it. Retain concise evidence and residual limitations in the existing implementation plan when needed for continuation and closure; avoid a running copy of the session. Small work without a selected spec/planning method can use accepted instructions and an existing task record without manufacturing the full document set.

## New-slice document locations

For new slice documents, use the exact agreed slice ID as the directory name:

```text
plans/<slice-id>/
  SPEC.md
  tasks/
    plan.md
    todo.md
    progress.md   generated from todo.md at the plan step
```

For example, a slice with the ID `<slice-id>` uses `plans/<slice-id>/`; a newly agreed first sub-slice uses `plans/<slice-id>.1/` and preserves the completed parent's documents. Existing documents for the same work and explicit user-selected locations take precedence; do not migrate them merely to match this convention.

At the supervised `spec` group checkpoint, present the proposed spec path with the scope. Create or revise it through the selected spec method after the applicable approval. At the supervised `plan` group checkpoint, present the implementation-plan and task-list paths and use the selected planning methods after approval. In copilot mode, identify these paths and continue the selected methods within the agreed outcome without method-group pauses. These are the existing mode-dependent boundaries, not additional gates. Create only outputs needed by the selected methods and accepted work; do not scaffold future slices or empty documents.

This is an output-location convention around vanilla Addy: its default `tasks/plan.md` and `tasks/todo.md` map to the selected slice's `tasks/` directory. Supply the full repository-relative paths to every selected method, assessor and downstream command that needs them. Do not change the execution working directory to the documentation directory or assume a command hardcoded to root `tasks/` will find the selected files. Check an actual consumer's path support before using it and resolve a concrete incompatibility within scope.

For an approved multi-capability slice, keep its capability map and `SPEC-<module-id>.md` files together in the slice directory, using the map as the module-spec index. Agree the map's filename at the spec checkpoint and point `documents.spec` to it. A designated external tracker may replace `todo.md`; retain the implementation plan with links to the tracker rather than a duplicate task checklist.

As outputs are established, update the corresponding document paths in `plans/project-state.json` under the pointer rules below. Leave missing outputs null. This convention selects locations; it does not make an existing project-scope document an Addy implementation plan or prove a method has run.

## Project pointer

The pointer file `plans/project-state.json` identifies the selected slice or sub-slice and points to its existing documents. It is a small discovery aid that also records the user-selected execution mode and its scope. Requirements, detailed progress and action-specific approvals remain in their existing owners. `currentSlice` carries `id`, `parent` (null for a top-level slice) and a coarse `status` (`in-progress` or `closed`). `documents` carries the repository-relative project `roadmap` path, an optional project-wide `readingMap` path, and selected-slice `spec`, `plan` and `tasks` paths; use null where a document has not been established. The reading map locates relevant architecture, decisions and research; it does not own requirements or delivery state. Follow it under the repository's context guidance when present. Do not create documents merely to fill these fields. A designated tracker may supply the task target; an accepted multi-module effort may point to its capability map for the module-spec index.

Read the pointer during selection and resumption, then check the referenced documents, Git state and current user instructions. A closed slice remains the last selected slice; it is not active work and does not imply a ready successor. A missing, malformed or stale pointer does not erase existing work or authorize a fresh start. Recover the actual selection from available evidence, resolve consequential ambiguity with the user, and correct only the confirmed mismatch within the approved scope.

Update the pointer when the user agrees a slice selection or mode change, its document paths change, the mode scope ends, or the slice closes. Include the initial pointer in the existing start changes and mark it closed in the approved close changes; a proposed next slice alone does not replace it. Keep the closed ID and document links until another selection is agreed. A sub-slice uses its own ID and documents with the completed parent's ID in `parent`. Preserve the project roadmap and reading-map links when switching slices; change them only when their maintained locations change. Avoid updates for routine method steps, test runs or corrections. Compare the current pointer before editing and resolve another task's conflicting selection rather than overwriting it.

`execution.mode` is `supervised`, `copilot`, `autonomous` or `orchestrated`. In each mode `execution.sessions` holds the sessions of the run for a [reporter](run-report.md#what-the-pointer-holds): `developer`, and in orchestrated mode `orchestrator`, each with `provider`, `model`, `effort`, `session` and, where the host gives one, `conversation`; and `reviewer` with `provider`, `model` and `effort`. An optional `logs` of `claude` or `codex` names the form of a session's logs where the name of the provider does not tell it. For example, `"execution": { "mode": "copilot", "scope": { "slice": "<slice-id>" } }` records a slice-wide selection. The scope's slice must match `currentSlice.id`; omit `task` for a slice-wide agreement. When present, `task` is the positive integer from the selected task document's canonical `Task N` heading. Finer limits, such as one subpart, a research-only assignment or a stop-before-commit instruction, belong in the existing plan. Record the user's mode choice and its limits there as a historical decision; the pointer is the single maintained current selection.

On resumption, check the recorded scope against the requested work and its completion state. Carry an applicable selection across compaction, handoff and new sessions without asking again. An autonomous Task 4 selection cannot authorize Task 5. At scope completion, return to the applicable agreed mode if that authority is recorded, otherwise the default defined in the [execution-mode rules](contract-core.md#execution-modes); update the pointer accordingly. A new slice uses that default unless explicit authorization covers it. Retain a closed slice's recorded scope as historical context, without treating it as active authority. Current user instructions take precedence over saved state; reconcile a confirmed mismatch rather than silently applying stale authority. A missing execution record does not erase an earlier agreement: recover it from the existing plan or instructions, then record it. Until unresolved authority is settled, use supervised behavior for affected work and continue independent authorized actions.

Keep titles, detailed acceptance, task status, verification, findings, next actions, external permissions and reviewer state in their existing owners. The mode records the user's working agreement; it does not grant arbitrary permissions or release an outstanding checkpoint. Maintain it through ordinary file edits. The progress renderer reads and checks the fields it consumes; no transition service or separate permission registry is required. Selected task progress blocks omit `mode`; legacy blocks without a pointer execution record remain readable for historical reports, with supervised as the fallback when neither supplies a mode.

## Baseline

Identify the selected requirements, architecture, decisions, plan, acceptance, verification, terminology and durable product documentation. Read the relevant material and identify:

- Current user and system outcomes.
- Actors, data, trust, accessibility, compatibility, public and external boundaries.
- Conflicts, duplicates, missing ownership and ambiguous language.
- Downstream implementation or release implications outside the accepted scope.

Do not introduce new runtime, security, privacy, billing, release or public behavior through wording alone. Distinguish accepted decisions from suggestions and unresolved questions.

## Align

Work through affected material in dependency order:

1. Descriptive requirements.
2. Architecture and ownership.
3. Accepted decisions and terminology.
4. Plan and independently closable deliverables.
5. Acceptance criteria.
6. Verification and evidence.
7. Durable product or API documentation.

At each step, preserve accepted meaning or record the exact authorized change in the existing affected material. Link each fact's maintained location rather than duplicating it across documents. A layer that is not affected needs no edit or new document; preserve the order of the relevant layers without manufacturing work.

## Traceability audit

Before treating alignment as complete, check both directions within the selected scope:

- Each accepted requirement traces to the applicable architecture or design, planned outcome, acceptance and verification.
- Each planned behavior traces to an accepted requirement or decision.
- Conflicting and superseded statements have an explicit resolution.
- Deferred work has an identified owner in an existing maintained record and remains visibly incomplete.
- Documentation claims stay within current evidence and distinguish planned behavior.

Use the existing documents and review discussion for this audit; do not create a second permanent tracking system. Alignment can expose implementation work, but does not itself authorize it.
