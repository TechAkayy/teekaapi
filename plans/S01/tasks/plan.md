# Implementation plan: S01 Foundation and home page

The [specification](../SPEC.md) owns the scope and the success criteria. The [task list](todo.md) owns the tasks, their acceptance and their status; [progress.md](progress.md) is generated from it. This plan owns the approach, the decisions, the sources, the risks and, at the end of the slice, the record of the checks.

## Overview

The slice creates the site package, gives it the theme of the [site brief](../../../README.md), builds the layout that each page shares, and builds the home page in two halves. A last deliverable adds motion and proves accessibility over the whole page. Each deliverable leaves a site that builds and passes its checks, and each one is one commit that the owner reviews first.

## Execution

- **Mode.** Supervised, for this slice, by the word of the owner on 2026-10-13. The agent stops before each method group and before each commit. The [project pointer](../../project-state.json) holds the current selection.
- **Where the slice is worked and joined.** The slice is worked on a line of its own and is joined into the main line of the repository at its close. The main line starts with the workflow adaptation, which the owner committed; the slice start follows it.
- **Independent review.** One Review Vibe assessment of the complete candidate before the close. Independent testing is not selected.

## Architecture decisions

1. **Static output, one package.** `packages/app` is an Astro project with static output. It has no server code and no adapter.
2. **Theme in CSS.** `src/styles/global.css` imports Tailwind, declares the `dark` variant on a class of the root element, and defines the palette and the fonts in `@theme`. Semantic pairs for surfaces and text are plain utilities with a `dark:` partner at the place of use; no second layer of alias tokens is added until a page shows the need.
3. **Fonts.** The `fonts` option of the Astro configuration with the Fontsource provider, one entry each for Space Grotesk, DM Sans and Pacifico, each with a CSS variable. `@theme inline` maps the variables to `--font-heading`, `--font-body` and `--font-script`. The `<Font />` component in the layout head emits them; only the heading and body fonts are preloaded.
4. **Theme switch.** A short inline script in the head sets the `dark` class before the first paint, from the saved choice or from the device. The button writes the choice to `localStorage` and toggles the class. While no choice is saved, a listener follows a change of the device setting.
5. **Scripts, not a framework.** The theme button, the phone menu, the dots of the drinks row and the entry animations are `<script>` blocks in their Astro components. The entry animation uses one `IntersectionObserver`; the scroll movement of the hero shapes uses CSS where the browser supports scroll-driven animation and is absent elsewhere.
6. **Phone menu.** A `<button>` with `aria-expanded` and `aria-controls` that shows a navigation panel. Escape closes it and returns the focus to the button. At desktop width the links are always visible and the button is not rendered as a control.
7. **Drinks row.** A scroll container with CSS scroll snap, an accessible name and keyboard focus, so that arrow keys move it. The dots are buttons that scroll to a card and show the current card. At desktop width the same markup is a grid and the dots are hidden.
8. **Icons.** Phosphor, by the choice of the owner. The needed icons are imported as SVG components from the Phosphor core package, so that only the used icons reach the page and none is loaded from another site.
9. **Photographs.** Files in `src/assets/images`, rendered with the image component of Astro for sizes and modern formats. The grain, the gradient overlay and the offset shadow are CSS. Each file has a line in `CREDITS.md`.
10. **Content as data.** The highlights, the drinks, the dishes and the social tiles are typed arrays in `src/content`. Sample entries carry a `sample: true` field that no page prints.
11. **Style reference page.** `/styleguide` shows each colour and font token in both modes. It is not linked from the site and carries a `noindex` instruction, by the choice of the owner.
12. **Browser tests.** Playwright with the axe scanner, by the choice of the owner, on Chromium only. The tests start `astro preview` on the built site through the web-server setting of Playwright, with a time limit, and stop it at the end.

## Sources

| Subject | Source | Consequence |
|---|---|---|
| Astro setup and Node range | <https://docs.astro.build/en/install-and-setup/> | Manual setup inside the workspace; Node 22.12 or later |
| Tailwind in Astro | <https://tailwindcss.com/docs/installation/framework-guides/astro> | `tailwindcss` and `@tailwindcss/vite`, the plugin under `vite.plugins`, one `@import "tailwindcss"` |
| Theme variables | <https://tailwindcss.com/docs/theme> | `@theme` with `--color-*` and `--font-*` |
| Dark mode | <https://tailwindcss.com/docs/dark-mode> | `@custom-variant dark (&:where(.dark, .dark *))` and the inline script for the three states |
| Fonts | <https://docs.astro.build/en/guides/fonts/> and <https://docs.astro.build/en/reference/configuration-reference/> | `fonts` is a top-level option of the configuration reference and is not in its list of experimental features; files are served from the site |
| Photographs | <https://unsplash.com/license> | Free use, commercial use included; no credit required |

Still to verify against the documentation when its task starts: the entry shape of a font and the import of the Fontsource provider; SVG files as components in Astro 7; the image component for local files; the web-server setting of Playwright.

## Deliverables and weights

The weights measure accepted work, not time. The owner agreed them on 2026-10-13.

| | Deliverable | Tasks | Weight |
|---|---|---|---|
| D1 | Project and checks | 1 to 3 | 12 |
| D2 | Theme and fonts | 4 to 6 | 12 |
| D3 | Shared layout | 7 to 10 | 18 |
| D4 | Home: hero and highlights | 11 to 13 | 16 |
| D5 | Home: drinks, food and social band | 14 to 17 | 20 |
| D6 | Motion and accessibility | 18 and 19 | 12 |
| | Final proof (4), independent review (4), close (1), integration (1) | | 10 |

Preflight, inputs, scope, the start candidate and the slice start are supporting steps with no weight. The task list holds the weight of each task.

**Order.** D1 comes first because each later check runs through it. D2 comes before any component, so that no component is written with a raw colour. D3 comes before the home page, which sits inside it. D4 and D5 are the two halves of the page from the top down. D6 is last because the scan and the motion rules need the whole page.

## Review checkpoints

- Before each of the `build`, `test`, `webperf`, `code-simplify`, `review` and `ship` method groups, as supervised mode asks.
- Before each commit: the slice start, each of D1 to D6, each correction after an accepted commit, and the close.
- Before each download of photographs: the owner sees the list with the source pages.
- Before any text that states a fact about the cafe.
- At D2, D3, D4 and D5 the owner looks at the result in a browser; the look of the site is the owner's to accept.

## Risks

| Risk | Effect | Answer |
|---|---|---|
| pnpm does not run the install scripts of a dependency, such as the image library, until they are approved | The build or the image step fails | Task 1 lists the scripts that ask for approval and brings the list to the owner |
| The browser of Playwright is about 150 MB and is downloaded once | The first test run is slow; a machine without it fails | Task 2 asks before the download and writes the install command in the README of the package |
| The session Node is outside the declared range | A check runs on the wrong Node | An `.nvmrc` at the root in Task 1; each check is run with a declared version |
| A fitting Unsplash photograph without a face or another brand is hard to find | A part waits for its picture | The part is built with a neutral cropped still life first; the owner can supply a file at any time |
| The palette fails contrast in one pairing, for example orange with light text | The scan fails in D6 | D2 checks each text and surface pairing on the style reference page, so a failing pair is found early and brought to the owner |
| Scroll-driven animation is not in every browser | The hero shapes do not move there | The movement is an extra; the page is complete without it |
| Sample text is taken for a fact of the cafe | A wrong claim on a real site | The sample field in the data, the open questions of the specification, and no launch in this roadmap |

## Open questions

The [open questions of the specification](../SPEC.md#open-questions) stand. Tasks 12, 13, 15, 16 and 17 each name the one that they wait for; without an answer they use sample text.

## Verification record

Nothing has run for this slice yet. The checks that run, their results and the checks that were omitted are recorded here at the final proof.
