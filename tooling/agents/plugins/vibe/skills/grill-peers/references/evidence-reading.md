# Evidence reading

## Investigation loop

1. Select the highest-value unanswered question within the agreed scope.
2. Define sufficient evidence and the files or mechanisms needed to answer it.
3. Search the peer at the selected revision, including relevant terminology variants.
4. Locate the concrete runtime or registration entry point.
5. Trace its material layers: admission, execution, state, output and effects as applicable.
6. Read selected files completely, including relevant types, configuration, tests and documentation. Repair truncated reads; keyword matches do not establish behavior.
7. Inspect direct consumers, errors, cancellation and cleanup where the contract reaches them.
8. Compare the mechanism with the project's current plans, interfaces and implementation.
9. Classify both the reuse opportunity and deliberate non-adoption.
10. Record evidence, recommendation, risk, confidence and likely owners.
11. Identify dependencies and follow-up questions; distinguish necessary missing evidence from possible future research.
12. Repeat until the selected scope is answered or a concrete evidence gap prevents completion.

Choose connected paths through the implementation rather than arbitrary alphabetical file batches. Cover domains relevant to the question: architecture, UI and visual extension points, agent/runtime adapters, process supervision, sessions and persistence, context, tools/plugins, workspaces, concurrency, trust and approvals, credentials, pinning/updates, recovery, diagnostics, tests, packaging and licensing. Do not require every domain for every question.

## Evidence quality and follow-up

Prefer runtime-connected implementation, then tests exercising it, interfaces/types, configuration, architecture documentation, public documentation, comments and naming-based inference. Expose contradictions; planned documentation is not implemented behavior. A negative claim needs the searched surfaces and terminology, not one empty search.

On a follow-up, compare the previously inspected revision with the selected target. Read changed files completely and account for additions, deletions, renames, modes and relevant unchanged consumers. Inspect intervening history when it matters to the question; a net-empty diff does not prove that no behavior changed during the interval. If ancestry was rewritten, establish a new comparison baseline or state the limitation. Reuse earlier facts only after checking that the relevant evidence remains applicable.

## Challenge recommendations

Before concluding, ask whether the evidence confuses a documented promise with working code, an internal interface with a supported public contract, a runtime tool with a visual plugin, or a product-specific trust assumption with a safe project boundary. Check whether asynchronous work, interrupted cleanup, stale state or malformed inputs undermine the mechanism when those failures matter.

Explain why direct reuse, adaptation, pattern reimplementation, deferral or rejection fits the project. Inspect actual licenses and relevant dependencies before recommending copied code. Name project-owned state, trust, process and UI responsibilities that must remain under the project's control. Unknown evidence stays unknown. No reuse candidate or research finding automatically changes accepted product scope.
