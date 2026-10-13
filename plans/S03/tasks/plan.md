# Implementation plan: S03 Gallery, Visit Us and Order / Book

**Status:** specification, plan, review responses and weights released by the orchestrator on 2026-10-13; the replacement independent disposition passed and permits the slice start and build. The [specification](../SPEC.md) owns scope, dated decisions, reasons, alternatives and acceptance. The [task list](todo.md) owns task state, and [progress.md](progress.md) is generated from it.

## Record of the start

The developer wrote this record on 2026-10-13 from the **orchestrator's account** of the user's decisions. The developer has not read the user's original messages in the orchestrator's conversation. Approval wording remains in that conversation and is not copied here. The orchestrator gave the delivery start at 2026-10-13 08:01:53 UTC, after the capability check and interrupt/continue test. This record does not claim that the user inspected or approved a product screen.

| Item | Decision and provenance |
|---|---|
| Scope | One slice, S03, Gallery, Visit Us and Order / Book; no chain. The orchestrator proposed the only remaining planned slice, and the user's answer named no other slice. |
| Mode | The user selected orchestrated mode on 2026-10-13. The orchestrator represents the user for this delivery; the developer works with autonomous progression inside that authority. |
| Developer choice | Codex, GPT-6-Astra (`gpt-6-astra`), reasoning `xhigh`; the host read back that selection, `full-access`, and `default` interaction mode. The developer is a top-level conversation, with no parent, in the project folder. |
| Reviewer choice | Codex, GPT-6.1-Sol (`gpt-6.1-sol`), reasoning `high`; each independent specification, candidate and any handoff read uses this selection. The bounded check's child settings were read back by both roles from the host. |
| Orchestrator settings | Claude, Claude Opus 5.5 (`claude-opus-5-5`), effort `high`, fast mode off, `full-access`, interaction mode `default`, as read back by the host and supplied by the orchestrator. |
| Permission settings | Each session uses the orchestrator's `full-access` setting. The user named no narrower setting. A permission-system refusal is reported and is never bypassed. |
| User's representation decision | On 2026-10-13 the user authorized the orchestrator to take the decisions and give approvals of the run in the user's place, according to the orchestrator's account of its numbered question and the user's answer. The orchestrator told the user how it interpreted that answer. |
| Browser use | On 2026-10-13 the user allowed the host's signed-in browser for a check that needs that sign-in, within the orchestration reference's limits. No such check is currently needed. |
| Provider credential use | On 2026-10-13 the user allowed an existing model-provider credential for a bounded agent test turn, within the reference's limits and with the test named first. No such test is proposed for this static site. |
| Lifted limits | None beyond the two permitted uses above. The prohibitions and conditions of the orchestration reference remain. |
| Owner's product choices | The roadmap's section “Choices that the owner made for S03” remains settled. New decisions belong to the orchestrator; the old autonomous authority for S03 ended before this run. |
| Ceilings | Twelve hours from the delivery start, ending at 2026-10-13 20:01:53 UTC unless the orchestrator grants the permitted extension; three candidate review rounds, with an independent read of the last corrections. |

The [project pointer](../../project-state.json) holds the current selection and the sessions' provider, model, effort, host conversation and log identifiers. The developer's log was found with the marker and find commands; the orchestrator supplied its own log identification. The host uses provider instance `claudeAgent` for the orchestrator; its log format is `claude`.

The slice is worked on its own line and joined into the repository's local integration line after explicit close and join releases. Nothing is pushed, published or submitted as a pull request. Branch names and commit identities belong only in the conversation.

### Check before delivery

These are the actual pre-delivery results of 2026-10-13. The four classifications describe the operation attempted; the evidence states the outcome and its limits. Nothing was refused. Installation and build/test output touched only allowed ignored paths; tracked files, refs and the index remained unchanged. The baseline checks are reusable only for the untouched baseline, not proof of the new pages.

| Operation | Classification | Evidence |
|---|---|---|
| Toolchain discovery and selection | run for real | Root declares Node `^22.18.0` or `^24.11.0` and pnpm 11.10.0; the developer shell and explicit PATH selection used Node 24.11.0 and pnpm 11.10.0, already installed. |
| Frozen install | run for real | `pnpm install --frozen-lockfile` passed; all four workspace projects were already up to date. |
| App type check | run for real | `pnpm --dir packages/app run check` passed on 43 files with no error, warning or hint. |
| App build | run for real | `pnpm --dir packages/app run build` passed and built four static pages. |
| Browser suite | run for real | After the build, the existing Playwright suite passed 162 tests in 26.4 seconds across the three configured widths. |
| Root check | run for real | `pnpm check` passed: 64 tooling tests, tooling type checking, roadmap/progress checks, app type checking/build and 162 browser tests. |
| Local server and host preview | run for real | The built home page loaded with HTTP 200 in T3's incognito preview on a local port; a real screenshot was delivered to the orchestrator and the server was stopped. |
| Branch creation substitute | a substitute that changes nothing passed | A Git ref transaction prepared a new slice ref and then aborted; the ref was confirmed absent. |
| Commit substitute | a substitute that changes nothing passed | Git's commit dry run reached the clean-tree result with exit 1 and made no commit; hooks and signing were not exercised. |
| Join substitute | a substitute that changes nothing passed | An ancestry check and a trivial read-only merge-tree check passed on the current equal trees; a later candidate still needs actual integration checks. |
| Agent validation | run for real | `pnpm --dir tooling/agents run validate` passed for 34 skills, metadata, discovery links, local links and record rules. |
| Roadmap check | run for real | `pnpm roadmap:check` passed. |
| Progress check | run for real | `pnpm --dir tooling/agents run progress --check` passed for the previously selected closed slice. |
| Reviewer child | run for real | One identity-only child completed without changes; the host read back Codex, gpt-6.1-sol, reasoning high, full-access and default interaction mode. |
| Developer log marker and lookup | run for real | `run-report --mark` followed by `--find` resolved exactly one Codex session log; its identifier is in the pointer. |
| Question path | run for real | The developer sent one test message through the host to the orchestrator, which replied “received” in the same developer conversation. |
| Interrupt and continue | run for real | The orchestrator interrupted the developer through the host and continued the same conversation; it confirmed the sleep process had ended. |
| Cleanup and unchanged state | run for real | No task-owned processes or test/preview listeners remained; the working tree and index were clean, with no new branch or commit. |

The orchestrator reported that its own shell had Node 26.8.1 and an engine warning. The developer did not use that version. The pre-delivery check above ran on Node 24.11.0. On 2026-10-13 the orchestrator corrected its runtime instruction to Node 24.20.0, which `.nvmrc` declares and which is already installed. Delivery runs on 24.20.0 by that correction. No global install or runtime update is needed.

| Additional baseline operation | Classification | Evidence |
|---|---|---|
| Root check on the corrected delivery runtime | run for real | On 2026-10-13, one `pnpm check` on Node 24.20.0 and pnpm 11.10.0 passed: 64 tooling tests, tooling type checking, roadmap/progress checks, app type checking with no diagnostics, four built pages and 162 local browser tests in 22.7 seconds; the test server stopped. |

This checks the unchanged product baseline with draft planning records, not new product acceptance. The root command had a 900-second process limit and Playwright retained its 600-second suite limit. The attempted environment-based lifecycle-shell hook did not run, so it did not add the intended separate command limits. A subsequent isolated, non-product probe verified the explicit `--config.script-shell` option and its propagation to nested pnpm invocations on Node 24.20.0; future aggregate runs use that verified mechanism. No command timed out. The probe did not repeat the root check, and its temporary files and processes were removed.

## Owed to the user

There is no refused permission operation. The following product obligations remain under U4's acceptance split, explicitly released by the orchestrator on 2026-10-13. No close may call the three live actions passed. The local preview does not establish readiness for public use.

| Slice | Step or check | How it is done | What depends on it |
|---|---|---|---|
| S03 | Confirm address, hours, phone and travel information | The cafe supplies and checks those facts; the site then receives a separately scoped content/action update. | Real directions, a real call and truthful transport/landmark information; none is claimed in this run. |
| S03 | Enable and verify directions, call and calendar actions | Use confirmed facts, choose what calendar event the action represents, then implement and check the actual OS/maps/calendar handoff under a later authorization. | These three live actions are not met by disabled controls; local map-card presentation can be accepted separately. |
| S03 | Replace or approve the sample gallery and service descriptions | The cafe supplies its own photographs and services or explicitly approves replacements and rights before launch. | Public use of the sample content; this run keeps samples identified and makes no service promise. |

A real provider, launch, analytics and the newsletter are outside the accepted roadmap, not hidden unfinished implementation in this slice. A physical-device or assistive-technology check is a stated coverage limitation, not a fabricated pass.

## Methods, ownership and sources

For `spec`, assessed the local descriptions of interview, idea refinement, specification, context, source and doubt methods; selected **spec-driven-development** to make the roadmap executable. Intent and one-slice scope are already settled, and the explicitly requested specification review supplies the independent challenge. No extra interview, capability-map gate, helper or separate module documents are introduced. The orchestrator requested the draft and plan together and released them with the corrections recorded in the specification.

For `plan`, assessed planning, interface design, frontend and migration methods; selected **planning-and-task-breakdown** and **frontend-ui-engineering** for ordered page deliverables, native interaction design and accessible states. There is no backend contract, persisted booking model or migration. Product implementation remains with this developer. Later build, test, webperf, simplification, review and ship groups will be assessed at their own transitions, not claimed as executed now.

The existing owners were inspected before choosing an approach:

- [BaseLayout](../../../packages/app/src/layouts/BaseLayout.astro) owns the document, fonts, theme initialization and reveal script. Reuse it on each page; booking state adds no storage.
- [Site navigation data](../../../packages/app/src/content/site.ts), [Header](../../../packages/app/src/components/Header.astro) and [Footer](../../../packages/app/src/components/Footer.astro) own shared route links and current-page marks. Change this one list after the pages exist, with its existing keyboard consumers and tests updated together.
- [SocialBand](../../../packages/app/src/components/SocialBand.astro), [StoryPortraits](../../../packages/app/src/components/StoryPortraits.astro), [global theme](../../../packages/app/src/styles/global.css) and existing page headings supply the visual patterns. Native disclosure supplies explicit accessible gallery interaction; no image viewer library is needed.
- The installed Astro 7.3.8 `Image.astro` and image prop types accept imported `ImageMetadata`, alternative text, widths and sizes. Reuse the established local image pipeline and reserved image dimensions; no runtime image host is added.
- [Astro scripts](https://docs.astro.build/en/guides/client-side-scripts/) document processed component scripts and TypeScript. The current pinned implementation already uses that mechanism; new scripts stay local and do not add a UI framework. Current upstream documentation is supporting evidence, not a dependency upgrade.
- [Native disclosures](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details) supply the open/close mechanism without JavaScript. Use basic `details`/`summary`, not newer exclusive-group or animation features. Native disclosure is not a modal, so no focus trap is added.
- [Native date controls](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date) supply date values and constraints; the project still computes its stated Melbourne boundary and checks it through the consumer. Do not confuse a date field with a provider's slot inventory.
- [Playwright emulation](https://playwright.dev/docs/emulation) documents touch contexts. The installed 1.64.0 tests already use device/viewport configuration; add explicit `hasTouch` and tap coverage because a narrow Desktop Chrome viewport alone proves no touch input.

There is no reading map and no named primary-peer set. The relevant baseline is the repository and its selected pins. API behaviour beyond the inspected interfaces is verified during its owning task before use. New decisions or compatibility gaps return to the orchestrator when material.

## Deliverables and accepted weights

The orchestrator accepted these weights on 2026-10-13; they now govern the generated report. Work is sequential to preserve primary ownership. Each task is bounded to roughly two hours or less and divided further if its actual work exceeds that.

| Deliverable | Result | Tasks and accepted allocation | Weight |
|---|---|---|---|
| D1 | Gallery browsing | T1 visible gallery and local data (10); T2 filters (10); T3 accessible overlays and focused proof (10) | 30 |
| D2 | Honest visit information | T4 details and labelled map (9); T5 unavailable actions and focused proof (6) | 15 |
| D3 | Three-step preview | T6 date/time and sample service steps (12); T7 review, result and reset (10); T8 privacy, fallback and focused proof (8) | 30 |
| D4 | Site integration and screen proof | T9 shared navigation and home action (5); T10 cross-page browser proof (5); T11 real-screen inspection (5) | 15 |

Delivery steps retain their authored numbers and names. Accepted weights: steps 1–5 each 0; step 6 totals 90 as above; step 7 is 0 for contingent corrections; step 8 final proof 4; step 9 independent candidate review 4; step 10 close 1; step 11 integration 1. Supporting work totals 2 of 100. Each zero-weight step still has to be completed honestly.

Build order: shared existing site → D1, D2 and D3 → D4 → final proof → independent candidate read and corrections → orchestrator close release → close → orchestrator join release → local integration. Specification, plan, decisions and weights are released. After a clean replacement disposition of the corrected draft, the developer creates the slice's one branch and start boundary and builds without another approval stop. No implementation goes into the start boundary.

## Implementation and recovery approach

- Keep each page's sample data in its own content module. Gallery reuses the nine approved local images and native disclosures. A small filter script controls only the list and its buttons/status.
- One visit content module owns explicit unknown facts. The page derives its unknown presentation from that module and has no live destination. Draw the map locally with accessible surrounding text, and expose the disabled action reasons in normal page content. Later fact/action work changes these owners without searching for facts in markup. Do not build a speculative provider or configurable calendar system.
- The booking preview owns transient DOM state, native inputs, validation, focus transitions and reset. Finish focuses the described result heading with no extra live region. Reuse one date validation on each Next and Finish; prove the Melbourne boundary once and recovery from Review once, as released. No submitting form, contact details, storage API or fetch path is necessary. Extract a helper only if actual repeated logic warrants it.
- Update navigation in its existing owner and the direct tests together; preserve menu behaviour and existing theme storage. The header's released breakpoint change affects the original pages and is verified there. Use the exact hero words “Try the booking preview”; a broken 320/375-pixel layout returns with its real screen for an orchestrator decision.
- Use the existing Playwright/axe infrastructure. New tests interact with real controls; do not preconstruct the state they are meant to prove. No additional test framework is proposed.
- Each deliverable includes its relevant repeatable tests and documentation in its own ordinary commit. Any later correction remains a truthful correction; accepted history is not rewritten.
- A failed task stops its dependent work, is diagnosed narrowly on the selected runtime/current build, and is corrected within scope. A finding's response and any changed UI choice need the orchestrator's release before correction.
- Recovery is local ordinary Git on the isolated slice line; there is no production deployment to roll back. Preserve user changes and all other work folders/stashes. Before any destructive recovery, verify the target and establish the required backup.

## Verification and screen review

The [specification's acceptance matrix](../SPEC.md#acceptance-and-verification) maps the proof to behaviour. Existing baseline results do not substitute for new flow tests. Run focused checks after a current build and once at final proof run the required root aggregate. The final record distinguishes passed, failed, blocked and unexecuted checks and identifies local browser runs versus mock/live evidence.

Every Node/pnpm command explicitly selects the installed Node 24.20.0 directory in PATH. Use a bounded process runner from the tool invocation, not new repository test machinery. Limits are 180 seconds for a type check or build, 60 seconds for a renderer/validator, 660 seconds for a browser suite, and 900 seconds for the root aggregate. The configured browser suite also has its own 600-second overall and 30-second per-test limits and a 60-second server-start limit. When one task script invokes multiple suites, bound each suite separately as well as the enclosing command. A review server has a 300-second initial lifetime; restart only if another bounded review session is needed. Track the exact process/group and stop it after use. A timeout is not a pass.

Use T3's host preview for real-screen review. Deliver screenshots in the conversation for phone and desktop, light and dark: gallery default, selected filter and an open disclosure; visit details/map/unavailable actions; each booking step, an invalid state and completed preview; and the changed header/footer/home action on existing home, menu, story and styleguide pages. Include the tablet menu state in layout proof. The notice must be visible in every booking capture. The orchestrator inspects the built screens before accepting them. No screenshot path, receipt file or temporary log becomes a repository evidence record.

Risks: five navigation links may overflow a tablet (use the released later inline breakpoint and no-script wrap); overlays can clip enlarged text (test narrow and zoomed layouts); local time can drift from Melbourne (compute and test the date boundary); a preview can look like a real confirmation (persistent notice, result wording and network/storage proof); unknown map facts can mislead (label the schematic and disable unavailable actions). Each is covered by its owning task and the final screen review.

## Reviews and release checkpoints

The first stop presented the draft specification, its independent read, UI proposals U1–U7 and this plan including weights. The orchestrator released them with corrections on 2026-10-13. A replacement reviewer now gets the original assignment, first finding, released answer, exact corrected candidate and current evidence. It changes nothing in the checkout and returns findings in its conversation. Any write-producing probe must use a temporary execution copy, per Review Vibe.

The host requires a new bounded child task for each actual review round. The initial capability-check child was not a review. Later reviewers use the same chosen provider/model/effort and receive the original brief, all prior findings, responses and unresolved objections; identify each as a replacement read rather than claiming continuity of the earlier child. Record the assessment in this plan; IDs of host tasks can be supplied in the conversation for traceability.

The specification/plan, U1–U7, first review responses and weights are released. The [specification](../SPEC.md#decisions-of-the-orchestrator) records the decisions, reasons and alternatives. A clean replacement read permits the start and build without another stop. A required defect returns with the developer's proposed answer. The next required stop otherwise is the candidate with real screens, or an unresolved screen choice. Later finding responses, departures, outside actions, close and join still need release. Routine authorized implementation and ordinary deliverable commits need no extra approval. Each decision, stop, failure and completion is sent once to the orchestrator's host conversation and repeated in the developer's final message. No silence counts as approval.

### Draft assessment

On 2026-10-13 the independent Codex reviewer, gpt-6.1-sol at reasoning high, returned **FIX** after a read-only assessment of the draft specification, plan, tasks, generated progress, pointer and roadmap against the site brief, earlier accepted specifications and current implementation. The host read back that model, effort, full-access and default interaction mode. It applied Review Vibe and `code-review-and-quality`, inspected the existing owners and selected assets, reused the supplied baseline checks, and ran no installs, builds, tests or browser sessions. Its Node selection was 24.11.0 under the instruction then in force. The later authorized runtime correction and corrected-runtime baseline result are developer updates, not results of that independent read.

**S03-SPEC-R1 — medium, required.** The reviewer found that U5 does not define focus or accessible notification when Finish preview replaces Review with the result. U2 defines Next/Back focus and U5 defines Start again, so leaving this transition open would require an unconsulted interaction decision during implementation. The developer confirmed the omission. **Response proposed at the first checkpoint (release recorded below):** focus a programmatically focusable level-two result heading, “Preview complete,” after revealing the result; associate the existing message “Nothing was sent or saved. No booking or order was made.” with that heading through `aria-describedby`. Keep the persistent notice visible. Use the focus change and accessible description instead of an additional live-region announcement that could repeat the same result. Carry this proposal into U5, A5/A8 and T7 only after release. Prove the real keyboard Finish transition, focused heading and description, then Start again with empty values and first-step focus; retain touch coverage as well. This changes neither the three-step numbering nor the result's approved-for-proposal words.

The reviewer also gave four optional suggestions, which remain distinct from the required finding. The developer verified each against the first draft and proposed these responses at that checkpoint; the later release below governs the corrected contracts:

| Suggestion | Historical first-checkpoint proposal |
|---|---|
| A7 could imply that disabled visit buttons disappear without scripts. | Accept the clarification: use “controls that require successful script initialization stay absent.” Keep U4's disabled actions visible. |
| T2 asks for disclosure reset before T3 creates disclosures. | Accept the clarification: T2 prepares reset behaviour; T3 proves it with actual open disclosures. Do not credit an empty-population check as integrated proof. |
| A preview can remain open across Melbourne midnight. | Extend U5 as a proposed recovery choice: recheck the date on each Next and on Finish. If it is now before Melbourne today, return to Date & time, show the existing date error and focus the date input, including when the visitor was on Service or Review. Retain time and service choices. Add fixed-clock browser scenarios that cross midnight from both later steps, recover through the real controls and complete the preview. |
| The roadmap still lists an embedded-map provider as open despite the settled local-map decision. | Remove only that stale open-choice bullet and regenerate the roadmap after release. Preserve the settled owner choice and the three live actions owed to the user. |

The reviewer found no other required defect or material hidden scope expansion. It judged the grid/page proposals, unknown-fact boundary, sample-only preview, reuse of current owners, authority provenance and zero-weight progress coherent. That assessment grants no UI or scope approval. Actual crops, built layouts, contrast, keyboard/touch flow, fallback and privacy remain future implementation evidence; no physical-device, screen-reader or live-service check is claimed.

The paragraphs and optional-response table above preserve what the developer proposed at the first checkpoint. On 2026-10-13 the orchestrator released the required response and the optional clarifications, with proportional midnight proof: one fixed-clock boundary test and one recovery from Review, not the proposed matrix from both later steps. The developer applied the released contracts to U5, A5/A7/A8 and the owning tasks. The same release added U4's explicit unknown-content owner and changed the U6 hero words. All decisions, reasons and alternatives are maintained in the specification. The required finding is still open pending independent disposition; release alone is not a reviewer pass.

### Replacement draft disposition

On 2026-10-13 a new bounded host task on Codex gpt-6.1-sol at reasoning high returned **PASS**: **S03-SPEC-R1 is resolved for specification assessment**, with no new required finding or optional suggestion. This was a replacement read, not continuity of the first child's sign-off. Its assignment carried the original brief, first assessment, released answer and corrected candidate. The host read back the chosen model/effort, full-access and default interaction mode.

The reviewer independently applied Review Vibe and `code-review-and-quality`, including its security/performance references. It confirmed the result-heading contract in U5 and its propagation to A5/A8/T7, and checked U4's unknown-content owner, U6's exact words and small-screen return condition, A7, gallery proof ordering, proportional midnight proof, roadmap correction and accepted-weight progress. It read the complete corrected documents and directly affected existing owners, ran read-only Git/status checks with a passing whitespace check, and reused supplied baseline/document results without rerunning product checks. It wrote nothing, launched no browser, invoked no Node/pnpm command and created no resources. Implementation, real screens, keyboard/touch behaviour and privacy remain unexecuted obligations. The orchestrator's existing conditional release now permits the start and build without another approval stop.

### Product verification and completion

The slice start is established. For D1, assessed the mapped build, test and webperf groups and continued **frontend-ui-engineering** with its accessibility checklist for native controls, local state, responsive layout and image sizing. The existing Playwright/axe runner supplies the required repeatable browser proof and T3 supplies real-screen inspection. The Chrome-DevTools-specific method was read for assessment but is not claimed as executed; no additional browser tooling, state library, instrumentation or new test infrastructure is needed. Simplification and self-review are assessed on the completed deliverable before its commit.

Gallery content, filters and native disclosures passed app type checking (47 files, no diagnostics), a five-page static build and 18 focused browser tests at the configured widths. All nine original images were inspected; alternative text describes each selected crop. Failed-image intrinsic sizing initially caused enlarged-text overflow within the gallery; allowing images and disclosures to shrink within their grid cells corrected it. Tests prove actual keyboard/touch open, close and filter reset, no-script operation and caption text under failed image requests and doubled root font size. The image-failure case deliberately aborts local image requests; the other interactions run the real local static site.

On 2026-10-13 the developer inspected the built gallery through T3 locally at phone width in light mode and with an open caption at doubled CSS zoom in dark mode; caption text remained readable, with no motion added by disclosure, and native browser zoom was not exercised.

The enlarged-root-font probe also found a pre-existing shared-header overflow, separate from gallery content. Its correction belongs to D4: the orchestrator inspected the real screenshot and released outer-row wrapping on 2026-10-13, with the reason, alternative and ordinary-size preservation conditions in U6. The focused gallery assertion measures its owner; the whole-page enlarged-text check is still owed in D4 and is not relabelled a pass.

For D1 simplification and self-review, applied **code-review-and-quality** with its security/performance references: read tests before implementation, checked native semantics, source-order filtering and bounded local DOM state, verified Astro-escaped captions and responsive local images, and found no remaining defect in the gallery owner. No extra abstraction, dependency, storage or network operation is needed. Independent candidate review and the full screen matrix remain ahead.

For D2, assessed build/test/webperf and simplification/review with the same **frontend-ui-engineering** and **code-review-and-quality** methods. One typed content module owns explicit null facts; the page derives unknown text, and the local SVG schematic is labelled as illustrative. Nine browser tests passed across the three widths, including script-disabled use and real pointer/Enter attempts on the disabled action areas with no request, navigation or download. Type checking passed for 51 files with no diagnostics and the six-route build passed. Self-review found no new data flow, dependency or speculative provider abstraction. The real directions/call/calendar obligations remain unmet in the owed-work table. The full visual inspection remains in T11.
