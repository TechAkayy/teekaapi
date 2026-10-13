# Guided phase and slice review

Present materially changed phases first: user-visible outcome, architectural boundary, included slices, dependencies, entry/exit evidence, feasible parallel work, preserved meaning, trade-offs and recommendation. In supervised mode, stop for the user's decision, record it and revise the proposal before advancing.

Then present one materially affected slice per interaction. Cover the following fields, combining their presentation where readable without omitting relevant meaning:

1. Identity, name, phase and predecessor/disposition.
2. What the user or builder can do after completion, in product language.
3. Architectural outcome and responsible boundary.
4. Why this is a separately closable slice rather than part of another.
5. Why it belongs here and its real prerequisite outputs.
6. Prior meaning and identity retained, adapted, moved, superseded or rejected.
7. Consumers and later work it enables.
8. Explicit exclusions.
9. Deferred maturation and the owner or trigger for revisiting it.
10. Safe parallel work and shared ownership/collision risks.
11. Selected evidence and adopt/adapt/reimplement/defer/reject reasoning.
12. Credible merge, split, move or rejection alternatives and their trade-offs.
13. One recommendation, with evidence and residual risk.
14. The user's decision: accept, revise, move, split, combine, defer, reject or request more evidence.

Reuse settled facts; do not ask the user to repeat them. Record decisions in the existing plan or agreed proposal, with affected scope, options, rationale and downstream consequences. A correction explicitly supersedes the earlier decision rather than erasing it. After each decision, update impacted later work and report what changed, what remains settled, what needs reconsideration and the next decision. Resume the same proposal after a pause.

A proposal may change numbering or combine slices when authorized, but the old-to-new mapping and preserved outcomes must be explicit. Each slice needs a coherent outcome, acceptance and verification. Dependency edges must represent real prerequisite outputs. Preserve the project's product goals when evaluating peer ideas; architectural similarity alone is not a reason for adoption.
