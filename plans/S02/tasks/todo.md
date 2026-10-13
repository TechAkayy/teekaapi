# Task list: S02 Menu and Our Story

The [specification](../SPEC.md) owns the scope; the [plan](plan.md) owns the approach and the decisions. This file owns the tasks and their status. [progress.md](progress.md) is generated from the block below; do not edit it by hand.

```vibe-progress
unit: S02
current: The corrections of the review are done. The reviewer assesses them now.
next: If the reviewer passes the slice, the agent closes it and stops. S03 is not started.
completed:
  - The owner chose the mode, the content and the user-facing choices for this slice.
  - D1 is done. The menu page shows the sample menu, the special card and the category bar.
  - D2 is done. The story page shows the sample story, the timeline and the portraits.
  - D3 is done. The header and the footer link to both pages, and both pages pass their checks.
remaining:
  - The final proof, the independent review and the close.
blockers:
  - None.
verification:
  - The build, the type check and 156 browser tests of the site pass.
candidate:
  - The slice with D1 to D3 complete and the corrections of the review.
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
        name: "Menu page"
        weight: 40
        children:
          - { id: d1-t1, task: 1, weight: 8, status: complete }
          - { id: d1-t2, task: 2, weight: 14, status: complete }
          - { id: d1-t3, task: 3, weight: 12, status: complete }
          - { id: d1-t4, task: 4, weight: 6, status: complete }
      - id: D2
        name: "Story page"
        weight: 25
        children:
          - { id: d2-t5, task: 5, weight: 8, status: complete }
          - { id: d2-t6, task: 6, weight: 10, status: complete }
          - { id: d2-t7, task: 7, weight: 7, status: complete }
      - id: D3
        name: "Navigation and proof"
        weight: 25
        children:
          - { id: d3-t8, task: 8, weight: 9, status: complete }
          - { id: d3-t9, task: 9, weight: 16, status: complete }
  - id: 7
    name: Material corrections and contract updates
    class: substantive
    weight: 0
    status: complete
  - id: 8
    name: Final proof and freeze
    class: substantive
    weight: 4
    status: complete
  - id: 9
    name: Independent assessments
    class: substantive
    weight: 4
    status: active
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

The owner gave the agent the weights with the user-facing choices on 2026-10-13; the [plan](plan.md) lists them. All paths below are in `packages/app` unless they start at the root. Run each command with a Node version of the declared range.

## Task 1 — Write the sample menu as data

- [x] Add `src/content/menu.ts`: typed categories, groups and items with a name, a description, a price, dietary marks and the sample field; the special; the dietary key.
- [x] Give each of the four categories of the site brief at least two groups.

**Acceptance:** the data type-checks; each entry is marked as a sample.
**Verify:** `pnpm --dir packages/app check`.

## Task 2 — Build the menu page with its categories and items

- [x] Add `src/pages/menu.astro` on the shared layout with a title and a description.
- [x] Add components for a category, a group and an item, with the dotted leader between the name and the price.
- [x] Add the dietary marks with a letter and a text alternative, and the key.
- [x] Add browser tests of the content at the three widths.

**Acceptance:** success criterion 2 without the bar and the special; no sideways scroll.
**Verify:** `pnpm --dir packages/app test`.
**Depends on:** Task 1.

## Task 3 — Add the category bar that stays in view

- [x] Add the bar as a list of links to the categories, fixed to the top of the window during scroll, with a sideways scroll of its own on a narrow screen.
- [x] Mark the category in view with `aria-current`, from the scroll position.
- [x] Keep a category clear of the bar when the page moves to it.
- [x] Add browser tests: the bar stays in view; a choice by keyboard and by pointer brings its category into view; the mark follows the scroll.

**Acceptance:** success criterion 3.
**Verify:** the browser tests.
**Depends on:** Task 2.

## Task 4 — Add the special card

- [x] Add the card at the top of the page from the data, with the glow under `motion-safe`.
- [x] Add a browser test that the card comes before the first category and that the glow does not run with reduced motion.

**Acceptance:** the card is first; the glow is decoration and is off for reduced motion.
**Verify:** the browser tests.
**Depends on:** Task 2.

## Task 5 — Write the sample story and choose its photographs

- [x] Add `src/content/story.ts`: the narrative, the milestones and the portraits, each marked as a sample, with no year and no named person.
- [x] Choose the portraits: photographs of hands at work and of the room, with no recognisable face; store new files and credit them.

**Acceptance:** success criterion 10 for this page.
**Verify:** each file has its credit line; `pnpm --dir packages/app check`.

## Task 6 — Build the story page with its narrative and timeline

- [x] Add `src/pages/story.astro` on the shared layout.
- [x] Add the narrative in a readable measure.
- [x] Add the timeline as an ordered list with an icon for each milestone and a joining line, down the side on a phone and across on a desktop.
- [x] Add browser tests of the narrative and of the order and the count of the milestones.

**Acceptance:** success criterion 4 without the portraits.
**Verify:** the browser tests.
**Depends on:** Task 5.

## Task 7 — Add the portraits

- [x] Add the portraits as figures with captions, with the offset shadow and the grain of the site brief.
- [x] Add a browser test of the count and of the text alternatives.

**Acceptance:** success criterion 4.
**Verify:** the browser tests.
**Depends on:** Task 6.

## Task 8 — Link the pages from the header, the footer and the home page

- [x] Change the links in `src/content/site.ts` to the pages of the site.
- [x] Mark the link of the current page with `aria-current="page"` and a visible mark.
- [x] Point “View Menu” on the home page at `/menu`.
- [x] Update the tests of S01 that name the old links, and add tests of the new ones.

**Acceptance:** success criterion 8.
**Verify:** the browser tests.
**Depends on:** Tasks 2 and 6.

## Task 9 — Prove accessibility, motion and privacy on both pages

- [x] Add both pages to the axe scan in both modes and correct each violation.
- [x] Add both pages to the focus-order test, the reduced-motion test, the no-script test and the test of requests to other hosts.
- [x] Compare both pages with the site brief from screenshots at the three widths in both modes.

**Acceptance:** success criteria 5, 6, 7 and 9.
**Verify:** `pnpm check` from the root.
**Depends on:** Task 8.
