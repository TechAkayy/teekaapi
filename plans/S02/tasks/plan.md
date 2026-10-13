# Implementation plan: S02 Menu and Our Story

The [specification](../SPEC.md) owns the scope and the success criteria. The [task list](todo.md) owns the tasks and their status; [progress.md](progress.md) is generated from it. This plan owns the approach, the decisions, the choices that the agent makes for the owner, and the record of the checks.

## Overview

Two pages join the site on the layout, the theme and the patterns of the first slice. The menu page is one long page with every category on it and a bar that stays in view; the story page is a narrative, a timeline and portraits. A last deliverable links the pages and proves accessibility, motion and privacy on both.

## Execution

- **Mode.** Autonomous, by the word of the owner on 2026-10-13, with the user-facing choices given to the agent. The agent commits each deliverable when its checks pass, runs one independent review, closes the slice and joins it into the main line. It stops only for a required check that it cannot make pass, a blocking review finding that it cannot correct inside the scope, or a need outside the scope. Nothing is pushed or published.
- **Where the slice is worked and joined.** On a line of its own, joined into the main line of the repository at its close.
- **Methods.** The specification and the plan follow the forms of the first slice. For the build: source-driven work for a framework pattern that the first slice did not use, small steps with a check after each, and the interface practices of the first slice. For the proof: the browser tests and the accessibility scan.

## Architecture decisions

1. **Every category is on the page.** The category bar is a list of links to the headings of the categories. Nothing is hidden behind a tab, so the page reads whole without scripts and a category has an address of its own.
2. **The bar stays in view with CSS.** It uses `position: sticky`. A script only marks the category in view, from the scroll position, the same way the dots of the drinks row work.
3. **Content as data.** `src/content/menu.ts` and `src/content/story.ts`, typed, with the sample field.
4. **Dietary marks.** A mark is a letter in a small disc with a title in words for assistive technology, and a key on the page says what each letter means.
5. **Timeline.** An ordered list. The joining line is a border on the list, so it needs no picture.
6. **Navigation.** The links live in `src/content/site.ts`. The layout tells the header and the footer which page is current.

## Deliverables and weights

| | Deliverable | Tasks | Weight |
|---|---|---|---|
| D1 | Menu page | 1 to 4 | 40 |
| D2 | Story page | 5 to 7 | 25 |
| D3 | Navigation and proof | 8 and 9 | 25 |
| | Final proof (4), independent review (4), close (1), integration (1) | | 10 |

The owner gave the agent the weights with the user-facing choices on 2026-10-13.

## Choices that the agent made for the owner

The agent adds each choice here as it makes it, and gives the list to the owner at the close.

- **Menu categories.** A segmented bar of four pills, not tabs. Every category is on one long page; a pill moves the page to its category, and the pill of the category in view is filled. On a phone the bar scrolls sideways inside itself.
- **Menu layout.** Each category has two groups, side by side from the tablet width. Every second category sits on the alternate surface. An item has its name, a dotted leader, its price, one line of description and its dietary marks.
- **Dietary marks.** Mint Kulfi discs with a letter: V, VG, GF and S, with a key at the foot of the page.
- **Special card.** A Teekaapi Orange card with a dark border above the bar, with a glow that moves between orange and pink.
- **Sample menu.** Twenty-two items in four categories, with prices in dollars, and the special “Ghee Roast Dosa Waffle”. All of it is sample content.
- **Page words.** The script line “Pull up a chair” and the line “Specialty coffee and fusion food, from the first cup to the last bite.”

## Risks

| Risk | Effect | Answer |
|---|---|---|
| A bar that stays in view hides the heading that the page moves to | The visitor lands below the heading | A scroll margin on each category, with a test |
| Four long category names do not fit a phone | A sideways scroll of the page | The bar scrolls sideways inside itself, and the test of sideways scroll covers the page |
| Sample dietary marks are taken for facts | A wrong claim about food | The sample field, the limitations at the close, and no launch in this roadmap |
| A stock photograph of a person is read as a member of the team | A false picture of the cafe | Portraits show hands at work and the room only |

## Verification record

The checks of the slice, their results and the checks that were omitted are recorded here at the final proof.
