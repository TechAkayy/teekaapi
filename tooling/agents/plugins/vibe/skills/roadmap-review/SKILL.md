---
name: roadmap-review
description: Review and revise an existing roadmap through evidence-backed phase and slice decisions, only when explicitly invoked.
---

# Roadmap Review

Review the selected roadmap against the user's intended outcome, accepted requirements and chosen evidence. Establish scope, exclusions, the current roadmap and decision records, relevant implementation state, output location and review mode. Evidence can be specs, research, user steering or observed delivery results; no retrospective system is required.

The primary agent owns the proposal and user discussion. Apply the [execution-mode rules](../lets-vibe/references/contract-core.md#execution-modes). Supervised review proceeds phase-first and one materially affected slice at a time under the [guided review](references/guided-review.md). Explicit autonomous authorization can cover proposal preparation for a stated scope, but does not invent user decisions or accept a new product direction on the user's behalf.

Maintain one coherent proposal in the agreed existing planning material or one agreed candidate document. Distinguish proposed changes from accepted roadmap entries. Do not create parallel full/lite copies or machine authority. This skill changes planning documents within approval; it does not open a slice or implement product work.

## Addy methods

Use the [shared selection and supervised group checkpoints](../lets-vibe/references/addy-method-gates.md) with these planning transitions, not the Lets Vibe delivery-step matrix. Read selected skills and required resources, announce their purpose and expected outputs, and apply planning/review activities within this assignment. Preserve native outputs where required, reconcile their purpose/location with existing records, and resolve a conflict before creating a duplicate plan.

- Before reconstruction, assess `spec`: use `doubt-driven-development` for material assumptions, `interview-me` or `idea-refine` for unresolved product choices, and `spec-driven-development` when requirements genuinely need definition.
- Before designing the proposal, assess `plan` and apply `planning-and-task-breakdown` for dependencies and implementable outcomes. Use `api-and-interface-design` or `deprecation-and-migration` for relevant contract and compatibility changes.
- Before finalizing, assess `review`: apply `documentation-and-adrs` to decision traceability and `doubt-driven-development` to unsupported assumptions or omissions. Select other methods only for concrete concerns.

Selection and application are required. If a required method or resource is unavailable, report the affected coverage and continue only work whose conclusions remain supportable. Method use does not authorize implementation or independent-agent creation.

## Seven-stage review

1. **Reconstruct.** Read the actual current roadmap, accepted decisions, relevant specs and implementation. Establish existing phases, slices, dependencies, exclusions, completed outcomes and unfinished obligations before proposing changes. Compare the selected evidence independently; a supplied summary is not the only inventory of requirements.
2. **Prepare the proposal.** Use the agreed planning location. Identify the current baseline, proposed changes and evidence. Account for each current or proposed slice as retained, changed, moved, split, combined, added, deferred or rejected. Preserve predecessor/successor mappings when identities change.
3. **Review phases.** Explain outcomes, boundaries, sequencing, evidence, risks and alternatives. In supervised mode, settle material phase decisions with the user before advancing to slice decisions.
4. **Review slices.** Follow the guided review one materially affected slice at a time. Keep unaffected slices in the dependency/preservation audit without requiring a presentation for each. Do not infer a decision from silence.
5. **Revise after decisions.** Record the user's decision and rationale in existing planning material, update affected dependencies, acceptance, exclusions and mappings, and report downstream effects. Preserve superseded decisions explicitly. Revisit previously reviewed slices only when a change materially affects them.
6. **Audit the complete result.** Compare the proposed roadmap with the original and selected evidence. Account for all current/proposed slices and material requirements, check dependencies and references across the roadmap, and preserve completed outcomes and deferred obligations. A bounded evidence request does not excuse breaking untouched slices. Scale detailed investigation to actual impacts; do not turn a narrow edit into unrelated redesign.
7. **Present and apply.** Present the complete reviewable proposal, changes, verification and unresolved decisions. Seek independent Review Vibe only if requested or included in the accepted scope; its result does not approve the proposal. Obtain the user's approval of the complete roadmap change before applying it as accepted scope. Update directly affected existing records together with ordinary file/Git operations, check the final diff and links, and retain separate commit approval where required.

## Progress and completion

Use [progress-report](../progress-report/SKILL.md) automatically under its supporting-work rules. Report reconstruction, settled decisions, downstream revisions, blockers and the final proposal or accepted update. Preserve the active decision and remaining work on resume.

Finish with accepted changes distinguished from proposals, retained outcomes, deferred items, evidence and verification limits. If the requested output was only a proposal, stop there. Do not start the first resulting slice, recruit independent reviewers automatically or treat approval of one slice as approval of the whole proposal.
