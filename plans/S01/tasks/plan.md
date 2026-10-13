# Implementation plan: S01 Foundation and home page

The [specification](../SPEC.md) owns the scope and the success criteria. The [task list](todo.md) owns the tasks, their acceptance and their status; [progress.md](progress.md) is generated from it. This plan owns the approach, the decisions, the sources, the risks and, at the end of the slice, the record of the checks.

## Overview

The slice creates the site package, gives it the theme of the [site brief](../../../README.md), builds the layout that each page shares, and builds the home page in two halves. A last deliverable adds motion and proves accessibility over the whole page. Each deliverable leaves a site that builds and passes its checks, and each one is one commit that the owner reviews first.

## Execution

- **Mode.** Supervised from the start of the slice through D1, copilot for D2 and D3, and autonomous for the rest of the slice from D4, each by the word of the owner on 2026-10-13. With the autonomous mode the owner also gave the agent the user-facing choices of the rest of the slice: the agent makes them, records each one in this plan, and lists them for the owner at the close. A fact about the cafe is not such a choice and still waits for the owner. The [project pointer](../../project-state.json) holds the current selection.
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

## Decisions made during delivery

- **TypeScript 6 in the site package.** `astro check` refuses TypeScript 7 and names TypeScript 6 as the supported version. The agents package keeps its own TypeScript 7.
- **`wasm32` in `supportedArchitectures`.** The type check loads a WebAssembly module (`@astrojs/astro2tsx`). pnpm skipped the WebAssembly runtime that the module needs, because other packages name that runtime as optional. The entry in `pnpm-workspace.yaml` makes pnpm install it.
- **The test server runs with `--ignore-lock` on port 4329.** `astro preview` moves to the background when an agent starts it, and Playwright needs a foreground process. The flag gives a foreground server; the port leaves the default port free for a person.
- **No install script was held back.** pnpm reported no ignored build after the install.

- **Space Grotesk stops at weight 700.** The site brief asks for an extra-bold first heading. The font has no heavier weight, so the first heading uses 700.
- **Only the Latin subset and the normal style of each font are loaded.** DM Sans carries the weights 400 to 700 and Pacifico its one weight.

- **The icons come straight from the Phosphor core package.** Astro turns an imported SVG file of the package into a component, so no icon file is copied into the site. The site uses the bold weight.
- **The home page has three stand-in sections** with the identifiers that the links of the header use, until D4 and D5 replace them.
- **The icon of the site is a stand-in**, a letter T on Teekaapi Orange, until the cafe supplies a logo.
- **The footer tagline is the example of the site brief**, marked as a sample in the content data.
- **The header is not fixed to the top of the window.** The site brief asks for a fixed bar only on the menu page.

- **`sharp` is a development dependency of the site package.** Astro could not find its image library from the package under pnpm, and its error names this as the answer.

### Choices that the agent made for the owner

The owner gave the user-facing choices of the rest of the slice to the agent on 2026-10-13. Each one is listed here and given to the owner at the close.

- **Photographs.** Twelve photographs from Unsplash, chosen with no recognisable face and no brand of another business. The agent chose and downloaded them without showing the list first, under the autonomous mode; `CREDITS.md` in the images folder names each one.
- **Hero words.** The flourish “Melbourne brewed” from the site brief; the headline “South Indian soul. Melbourne coffee.”; the line “Specialty coffee and fusion food, served with colour, craft and a little nostalgia.” Each uses only what the site brief states of the cafe. They are marked as samples.
- **Hero look.** The words sit on an Espresso Noir overlay over the photograph, light in both modes, with a grain layer and three shapes in orange, pink and mint.
- **Highlights.** Four cards: Specialty Coffee, Fusion Bites, South Indian Roots and Melbourne Made. “Open Late” and “Melbourne CBD” of the site brief are left out, because the cafe has not confirmed them. The icons are the two-tone Phosphor set.
- **Card hover.** A card rises a little and gets an offset Teekaapi Orange shadow.

### Contrast of the palette

The ratios are computed from the colour values of the site brief, by the WCAG 2 formula. Body text needs 4.5 to 1; large text and the outline of a control need 3 to 1. The style reference page shows the same table.

| Text | Surface | Ratio | Use |
|---|---|---|---|
| Text Dark | Cream Foam | 17.07 | Body text in light mode |
| Espresso Noir | Cream Foam | 16.73 | Headings in light mode |
| Text Dark | Filter Beige | 11.18 | Alternate sections in light mode |
| Text Light | Charcoal Steam | 14.04 | Body text in dark mode |
| Text Light | Espresso Noir | 17.31 | Alternate sections in dark mode |
| Espresso Noir | Teekaapi Orange | 6.97 | Button text |
| Text Light | Teekaapi Orange | 2.48 | Fails; not used |
| Espresso Noir | Fusion Pink | 6.02 | Chip text |
| Text Light | Fusion Pink | 2.88 | Fails; not used |
| Espresso Noir | Mint Kulfi | 11.43 | Chip text |
| Teekaapi Orange | Cream Foam | 2.40 | Fails as text and as an outline |
| Fusion Pink | Cream Foam | 2.78 | Fails as text and as an outline |
| Mint Kulfi | Cream Foam | 1.46 | Fails as text and as an outline |
| Teekaapi Orange | Charcoal Steam | 5.65 | Accent text in dark mode |
| Fusion Pink | Charcoal Steam | 4.88 | Accent text in dark mode |
| Mint Kulfi | Charcoal Steam | 9.28 | Accent text and focus ring in dark mode |

The owner decided the two consequences on 2026-10-13, and the specification records them:

1. A button on Teekaapi Orange carries Espresso Noir text.
2. The focus ring is Mint Kulfi with an Espresso Noir edge in light mode, and Mint Kulfi alone in dark mode.

In light mode the three accents are fills, underlines and decoration only; they are never the colour of text.

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

Through D3 the owner reviewed each deliverable before its commit. From D4 the mode is autonomous: the agent commits each deliverable when its checks pass, runs the independent review, closes the slice and joins it into the main line, with no pause. It stops only for a required check that it cannot make pass, a blocking review finding that it cannot correct inside the scope, or a need outside the scope. Nothing is pushed or published.

## Risks

| Risk | Effect | Answer |
|---|---|---|
| The browser of Playwright is about 100 MB and is downloaded once | The first test run is slow; a machine without it fails | Task 2 asks before the download and writes the install command in the README of the package |
| The session Node is outside the declared range | A check runs on the wrong Node | An `.nvmrc` at the root in Task 1; each check is run with a declared version |
| A fitting Unsplash photograph without a face or another brand is hard to find | A part waits for its picture | The part is built with a neutral cropped still life first; the owner can supply a file at any time |
| Scroll-driven animation is not in every browser | The hero shapes do not move there | The movement is an extra; the page is complete without it |
| Sample text is taken for a fact of the cafe | A wrong claim on a real site | The sample field in the data, the open questions of the specification, and no launch in this roadmap |

## Open questions

The [open questions of the specification](../SPEC.md#open-questions) stand. Tasks 12, 13, 15, 16 and 17 each name the one that they wait for; without an answer they use sample text.

## Verification record

The checks of the whole slice, their results and the checks that were omitted are recorded here at the final proof. Checks by inspection so far:

- On 2026-10-13 the owner accepted the style reference page from screenshots at a desktop and a phone width, in light and in dark mode.
- On 2026-10-13 the owner received screenshots of the header, the phone menu, the footer and the focus ring at a desktop and a phone width in both modes, and raised no change.
