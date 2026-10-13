# Task list: S03 Gallery, Visit Us and Order / Book

The [specification](../SPEC.md) owns released scope and acceptance. The [plan](plan.md) holds the start record, sources, accepted weights and review decisions. This file owns task state. [progress.md](progress.md) is generated from the block below.

```vibe-progress
unit: S03
current: The visit page passed its checks. The developer builds the preview steps.
next: Verify the preview, then link and inspect all pages.
completed:
  - The delivery checks passed, including the host interrupt and continue test.
  - The developer read the settled choices and the existing pages.
  - The independent reviewer read the drafts and returned one required finding.
  - The orchestrator released the decisions, review responses, plan and weights.
  - The developer applied the released contract corrections and regenerated the roadmap.
  - The replacement reviewer resolved the required finding with no new finding.
  - The developer established the slice start with the released records.
remaining:
  - Build and prove the booking preview.
  - Link the pages, prove their behaviour and show the real screens.
  - Complete independent review, close and local integration.
blockers:
  - None. The start and build are authorized.
verification:
  - The baseline root check passed on Node 24.20.0 with 64 tooling tests and 162 browser tests.
  - The gallery passed type checking, a five-page build and 18 browser tests.
  - The visit page passed type checking, a six-page build and nine browser tests.
candidate:
  - Gallery and visit are built. Preview and shared links remain.
steps:
  - id: 1
    name: Slice preflight
    class: supporting
    weight: 0
    status: complete
  - id: 2
    name: Accepted inputs and semantic baseline
    class: supporting
    weight: 0
    status: complete
  - id: 3
    name: Scope and deliverables
    class: supporting
    weight: 0
    status: complete
  - id: 4
    name: Slice-start candidate
    class: supporting
    weight: 0
    status: complete
  - id: 5
    name: Slice start established in the delivery context
    class: supporting
    weight: 0
    status: complete
  - id: 6
    name: Deliverable loop
    class: substantive
    weight: 90
    children:
      - id: D1
        name: Gallery browsing
        weight: 30
        children:
          - { id: d1-t1, task: 1, weight: 10, status: complete }
          - { id: d1-t2, task: 2, weight: 10, status: complete }
          - { id: d1-t3, task: 3, weight: 10, status: complete }
      - id: D2
        name: Visit information
        weight: 15
        children:
          - { id: d2-t4, task: 4, weight: 9, status: complete }
          - { id: d2-t5, task: 5, weight: 6, status: complete }
      - id: D3
        name: Booking preview
        weight: 30
        children:
          - { id: d3-t6, task: 6, weight: 12, status: active }
          - { id: d3-t7, task: 7, weight: 10, status: pending }
          - { id: d3-t8, task: 8, weight: 8, status: pending }
      - id: D4
        name: Site links and screen checks
        weight: 15
        children:
          - { id: d4-t9, task: 9, weight: 5, status: pending }
          - { id: d4-t10, task: 10, weight: 5, status: pending }
          - { id: d4-t11, task: 11, weight: 5, status: pending }
  - id: 7
    name: Material corrections and contract updates
    class: substantive
    weight: 0
    status: pending
  - id: 8
    name: Final proof and freeze
    class: substantive
    weight: 4
    status: pending
  - id: 9
    name: Independent assessments
    class: substantive
    weight: 4
    status: pending
  - id: 10
    name: Slice close
    class: supporting
    weight: 1
    status: pending
  - id: 11
    name: Final state and successor handoff
    class: supporting
    weight: 1
    status: pending
```

The accepted weights are in the plan and applied above. The structured state and action boxes show the implementation status. Paths in the file lists are relative to `packages/app`. Use the selected Node and bounded commands from the plan. A focused browser run needs a fresh build and must execute the named tests, not an empty filter.

## Task 1 — Show the gallery and its local photographs

- [x] Add approved typed gallery entries with category, image, crop, alternative text, title, description and `sample: true`.
- [x] Build `/gallery/` on the shared layout with the approved regular grid, heading and sample notice.
- [x] Assert the content, source order, image presence and no sideways scroll at the configured widths.

**Acceptance:** A2; all four categories have content, and photographs reuse the existing credits.
**Verify:** app type check, current build and `playwright test tests/gallery.spec.ts`; inspect each selected crop.
**Files:** `src/content/gallery.ts`, `src/pages/gallery.astro`, `src/components/Gallery.astro`, `tests/gallery.spec.ts`.
**Depends on:** orchestrator release of the specification, U1/U7, plan and start boundary.

## Task 2 — Filter the gallery by category

- [x] Add approved filter buttons and the result status; initialize before making controls available.
- [x] Preserve order and filter-button focus, hide nonmatches, and prepare disclosure reset on a new selection; Task 3 proves reset against actual open disclosures.
- [x] Test mixed repeated selections, All reset, keyboard activation and taps in a touch-enabled context.

**Acceptance:** the filtering part of A3 and A7; a filter never creates page overflow or strands focus.
**Verify:** current build and `playwright test tests/gallery.spec.ts`, including no-script and touch cases.
**Files:** `src/components/Gallery.astro`, `src/scripts/gallery.ts` if needed, `tests/gallery.spec.ts`.
**Depends on:** Task 1 and release of U3.

## Task 3 — Reveal gallery captions by keyboard and touch

- [x] Add the approved native disclosure overlay to each card with a readable title strip and focus ring.
- [x] Test open/close with keyboard and touch, multiple open cards, filter reset and no-script operation.
- [x] Inspect 200% zoom, reduced motion and caption contrast in both themes; correct clipping before D1 is presented. This local inspection used CSS zoom and text-size simulation, not native browser zoom; final screen coverage remains in Task 11.

**Acceptance:** overlay parts of A3/A7/A8; no keyboard trap or hover-only text.
**Verify:** focused gallery browser tests and an actual built-screen inspection.
**Files:** `src/components/Gallery.astro`, optional `src/components/GalleryCard.astro`, `tests/gallery.spec.ts`.
**Depends on:** Tasks 1 and 2; any correction to U3 returns for a UI decision.

## Task 4 — Show visit details and the map card

- [x] Add one visit content module with explicit unknown facts and transport notes; derive the page's unknown presentation from it without invented values or speculative infrastructure.
- [x] Build `/visit/` with the labelled local schematic and Teekaapi marker in the approved responsive layout.
- [x] Test content, image/map accessibility, layout and absence of external map requests.

**Acceptance:** visit presentation in A4 and A8; the map never represents a confirmed geographical location.
**Verify:** type check, current build and `playwright test tests/visit.spec.ts`.
**Files:** `src/content/visit.ts`, `src/pages/visit.astro`, optional `src/components/VisitMap.astro`, `tests/visit.spec.ts`.
**Depends on:** release of U4 and U7. D1 is delivered first for an orderly commit sequence, not a code dependency.

## Task 5 — Explain unavailable visit actions

- [x] Show the approved disabled Directions, Call and Calendar controls with their visible explanation.
- [x] Prove that activating the unavailable area creates no navigation, download, invented destination or request.
- [x] Keep live actions explicitly unmet in the plan's owed-work table and document the current page behaviour.

**Acceptance:** unavailable-state part of A4 under the orchestrator's released acceptance split; no live action is claimed.
**Verify:** current build and `playwright test tests/visit.spec.ts`, plus focused text inspection.
**Files:** `src/pages/visit.astro`, `src/content/visit.ts`, `tests/visit.spec.ts`, `README.md`; the owning plan is updated under `plans/`.
**Depends on:** Task 4 and explicit release of U4's owed-work split.

## Task 6 — Choose a preview time and service

- [ ] Build `/order/` with the persistent notice, sample explanations and no-script fallback.
- [ ] Add date/time and native service choices with local required-field validation; reuse the one date validation on every Next and Finish, with one fixed-clock Melbourne boundary test.
- [ ] Test invalid-to-valid changes, keyboard/touch progression, Back retention and focus on the current step.

**Acceptance:** first two steps of A5, with A6's warning visible and no submitting form.
**Verify:** type check, current build and `playwright test tests/booking.spec.ts`; use fixed test clocks and synthetic values.
**Files:** `src/content/booking.ts`, `src/pages/order.astro`, `src/components/BookingPreview.astro`, `src/scripts/booking.ts`, `tests/booking.spec.ts`.
**Depends on:** release of U2/U5/U7; D2 precedes it in delivery order.

## Task 7 — Review choices and finish the preview

- [ ] Add the third-step summary, Back and Finish preview; reveal and focus the described “Preview complete” heading in that same step, with the standing notice and no extra live region.
- [ ] Add Start again and empty-state initialization without persistence.
- [ ] Test both service paths, changes after Back, repeated Finish, result-heading focus/description and full reset with first-step focus; prove one midnight recovery from Review to the date error/input while retaining time/service.

**Acceptance:** remaining A5 and visible-notice parts of A6; no state claims a real booking or order.
**Verify:** current build and `playwright test tests/booking.spec.ts` through actual user operations.
**Files:** `src/components/BookingPreview.astro`, `src/scripts/booking.ts`, `src/content/booking.ts`, `tests/booking.spec.ts`.
**Depends on:** Task 6.

## Task 8 — Prove that the preview sends and saves nothing

- [ ] Observe network and browser storage through both full service paths, Enter, repeated Finish and reset.
- [ ] Reload and verify empty preview fields and an unchanged URL, while preserving the existing theme preference.
- [ ] Prove the no-script/failed-initialization fallback and update package documentation about preview limits.

**Acceptance:** A6/A7/A10 for the preview; evidence is from the real local browser, with no provider mocked into a success.
**Verify:** current build and focused booking/privacy tests; inspect that controls cannot submit without scripts.
**Files:** `tests/booking.spec.ts`, `tests/privacy.spec.ts`, `src/components/BookingPreview.astro`, `src/scripts/booking.ts`, `README.md`.
**Depends on:** Task 7.

## Task 9 — Link the pages from the site

- [ ] Add the three approved links in the existing navigation owner and adapt the header breakpoint/no-script wrap.
- [ ] Add the outlined “Try the booking preview” hero link without changing the primary menu action; show any broken 320/375-pixel layout to the orchestrator for a new decision.
- [ ] Update the direct navigation assertions for all routes and the current-page mark.
- [ ] Apply the released outer-row wrap for enlarged text, keep controls together and add the permanent text-size simulation test; preserve ordinary-size header appearance.

**Acceptance:** A9; all three destinations exist before their links appear.
**Verify:** current build and focused layout/home tests; inspect the header at 768 and 1024 pixels.
**Files:** `src/content/site.ts`, `src/components/Header.astro`, `src/components/Hero.astro`, `tests/layout.spec.ts`, `tests/home.spec.ts`.
**Depends on:** D1, D2 and D3; release of U6.

## Task 10 — Check the pages in both themes

- [ ] Extend the existing axe/focus, no-script, reduced-motion and request checks to the three new pages and active preview states.
- [ ] Update shared focus assertions for the new navigation, retaining tests of all surviving behaviour.
- [ ] Run the root aggregate on the current product and diagnose any failure with the narrowest useful check.

**Acceptance:** A1/A7/A8/A9/A10; count actual executions and distinguish emulator coverage from a physical device.
**Verify:** bounded `pnpm check` from the root; no additional framework or broad unrelated tests.
**Files:** `tests/a11y.spec.ts`, `tests/motion.spec.ts`, `tests/privacy.spec.ts`, `tests/booking.spec.ts`, `tests/gallery.spec.ts`.
**Depends on:** Task 9.

## Task 11 — Show the built screens to the orchestrator

- [ ] Run a bounded local server and capture the plan's phone/desktop, light/dark screen and state matrix through the host preview.
- [ ] Give the orchestrator the real screenshots and resolve its concrete UI decisions before close.
- [ ] Stop the task-owned server and record the actual inspection and any limits in the plan.

**Acceptance:** A11's visual review, including filter, open overlay, all booking steps, errors and the notice; no screenshot kept in the repository.
**Verify:** actual host-browser inspection and attributed orchestrator response; no build result stands in for looking at a screen.
**Files:** product owners only if the orchestrator releases a correction; inspection outcome in the existing plan.
**Depends on:** Task 10. Independent candidate review, final correction reads, close and join still follow their authored steps.
