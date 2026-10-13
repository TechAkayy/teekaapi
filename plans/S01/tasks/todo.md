# Task list: S01 Foundation and home page

The [specification](../SPEC.md) owns the scope; the [plan](plan.md) owns the approach and the decisions. This file owns the tasks and their status. [progress.md](progress.md) is generated from the block below; do not edit it by hand.

```vibe-progress
unit: S01
current: The reviewer found 2 defects and 4 smaller points. I correct them.
next: The reviewer assesses the corrections. Then the agent closes the slice and gives the owner its choices.
completed:
  - The owner agreed the specification, the plan and the weights. The slice is started.
  - D1 is done. The site package builds, and its checks run with the checks of the repository.
  - D2 is done. The theme has the colours and the fonts of the site brief.
  - D3 is done. Each page has the header, the footer and the light and dark button.
  - D4 is done. The home page has its hero and its highlights.
  - D5 is done. The home page has its drinks, its food teaser and its social band.
  - D6 is done. The page has its motion, and it passes the accessibility scan in both modes.
remaining:
  - The independent review and the close.
blockers:
  - None.
verification:
  - The build, the type check and 90 browser tests of the site pass.
  - The check of the repository passes with the site included.
  - The owner has not looked at the finished home page. The plan lists this limitation.
candidate:
  - The slice with D1 to D6 complete.
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
        name: Project and checks
        weight: 12
        children:
          - { id: d1-package, task: 1, weight: 5, status: complete }
          - { id: d1-tests, task: 2, weight: 5, status: complete }
          - { id: d1-check, task: 3, weight: 2, status: complete }
      - id: D2
        name: Theme and fonts
        weight: 12
        children:
          - { id: d2-tokens, task: 4, weight: 4, status: complete }
          - { id: d2-fonts, task: 5, weight: 4, status: complete }
          - { id: d2-reference, task: 6, weight: 4, status: complete }
      - id: D3
        name: Shared layout
        weight: 18
        children:
          - { id: d3-layout, task: 7, weight: 5, status: complete }
          - { id: d3-theme, task: 8, weight: 4, status: complete }
          - { id: d3-header, task: 9, weight: 5, status: complete }
          - { id: d3-footer, task: 10, weight: 4, status: complete }
      - id: D4
        name: "Home: hero and highlights"
        weight: 16
        children:
          - { id: d4-photos, task: 11, weight: 4, status: complete }
          - { id: d4-hero, task: 12, weight: 7, status: complete }
          - { id: d4-highlights, task: 13, weight: 5, status: complete }
      - id: D5
        name: "Home: drinks, food and social band"
        weight: 20
        children:
          - { id: d5-photos, task: 14, weight: 4, status: complete }
          - { id: d5-drinks, task: 15, weight: 7, status: complete }
          - { id: d5-food, task: 16, weight: 5, status: complete }
          - { id: d5-social, task: 17, weight: 4, status: complete }
      - id: D6
        name: Motion and accessibility
        weight: 12
        children:
          - { id: d6-motion, task: 18, weight: 6, status: complete }
          - { id: d6-access, task: 19, weight: 6, status: complete }
  - id: 7
    name: Material corrections and contract updates
    class: substantive
    weight: 0
    status: active
  - id: 8
    name: Final proof and freeze
    class: substantive
    weight: 4
    status: complete
  - id: 9
    name: Independent assessments
    class: substantive
    weight: 4
    status: paused
    reason: The reviewer asked for corrections. It assesses them when step 7 is done.
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

The owner agreed the weights on 2026-10-13.

All paths below are in `packages/app` unless they start at the root. Run each command with a Node version of the declared range.

## Task 1 — Create the site package

Manual Astro setup inside the workspace, as the Astro documentation describes, with Tailwind added.

- [x] Verify the current setup steps against the Astro and Tailwind documentation named in the plan, and pin the exact versions.
- [x] Add `package.json` (private, `type: module`, scripts `dev`, `build`, `preview`), `astro.config.mjs` with the Tailwind Vite plugin, a strict `tsconfig.json`, `src/pages/index.astro` with one heading, `src/styles/global.css` with the Tailwind import, and `public/robots.txt`.
- [x] Add `dist/` and `.astro/` to the root `.gitignore`, and an `.nvmrc` at the root with a declared Node version.
- [x] Run `pnpm install`; list each dependency whose install script pnpm holds back and bring the list to the owner before approving any.

**Acceptance:** `pnpm --dir packages/app build` ends without an error and writes `dist/index.html`; a Tailwind utility on the heading is present in the built CSS.
**Verify:** the build command; inspect `dist/`.
**Depends on:** none. **Files:** the six new files, root `.gitignore`, `.nvmrc`, `pnpm-lock.yaml`.

## Task 2 — Add the type check and the first browser test

- [x] Add `@astrojs/check` and `typescript`, and a `check` script that runs `astro check`.
- [x] Add `@playwright/test` and `@axe-core/playwright`; ask the owner before the download of the Chromium browser.
- [x] Add `playwright.config.ts`: Chromium only, a web server that runs `astro preview` on the built site with a time limit, and three projects or viewports of 375, 768 and 1280 pixels wide.
- [x] Add `tests/home.spec.ts` with one test: the page loads, has one `h1`, and has no sideways scroll at each width.
- [x] Add a `test` script that builds and then runs Playwright with a time limit for the suite.

**Acceptance:** `check` and `test` pass; the test report shows that the test ran at the three widths, not zero tests.
**Verify:** `pnpm --dir packages/app check`; `pnpm --dir packages/app test`.
**Depends on:** Task 1. **Files:** `package.json`, `playwright.config.ts`, `tests/home.spec.ts`.

## Task 3 — Join the site to the checks of the repository

- [x] Extend the `check` script of the root `package.json` with the check and the test of the site, and with the freshness check of the progress report.
- [x] Add `README.md` to the package: what it is, the commands, the browser install command. No slice number in it.
- [x] Update the commands paragraph in section 4 of the roadmap and regenerate `roadmap.html`.

**Acceptance:** `pnpm check` from the root runs the agent checks, the roadmap check, the progress check, the type check and the browser tests, and passes.
**Verify:** `pnpm check`.
**Depends on:** Task 2. **Files:** root `package.json`, `README.md` of the package, `plans/roadmap.md`, `plans/roadmap.html`.

## Task 4 — Define the colours and the dark mode switch in the theme

- [x] Define the nine colour tokens of the site brief in `@theme` in `global.css`, with the names of the specification.
- [x] Declare the class-based `dark` variant as the Tailwind documentation gives it.
- [x] Set the base surface and text colours of `body` for both modes.
- [x] Compute the contrast of each text and surface pairing that the site brief implies, in both modes; bring each pair below 4.5 to 1 for body text, or 3 to 1 for large text, to the owner.

**Acceptance:** utilities such as `bg-cream-foam` and `dark:bg-charcoal-steam` exist in the built CSS; no failing pairing is used without a decision of the owner.
**Verify:** build; the contrast table in the plan.
**Depends on:** Task 1. **Files:** `src/styles/global.css`, `plan.md` (the contrast table).

## Task 5 — Add the three fonts, served from the site

- [x] Verify the entry shape of `fonts` and the import of the Fontsource provider against the configuration reference of Astro.
- [x] Configure Space Grotesk, DM Sans and Pacifico with CSS variables, the Latin subset and only the weights that the site brief needs.
- [x] Map the variables to `--font-heading`, `--font-body` and `--font-script` in `@theme inline`.
- [x] Set the heading and body treatments of the site brief: weights, letter spacing and a body line height between 1.5 and 1.7.

**Acceptance:** the built site holds the font files under its own output folder; the built HTML and CSS name no font host; `font-heading`, `font-body` and `font-script` work.
**Verify:** build; search `dist/` for `fonts.googleapis`, `gstatic` and `fontsource.org` and find none.
**Depends on:** Task 4. **Files:** `astro.config.mjs`, `src/styles/global.css`.

## Task 6 — Build the hidden style reference page

- [x] Add `src/pages/styleguide.astro`: a swatch with the name of each colour token, each font with its heading, body and script treatments, a button and a chip in each state.
- [x] Give the page `noindex` and link it from no page.
- [x] Show the page to the owner in light and in dark mode.

**Acceptance:** `/styleguide` builds; it shows each token of the theme; the home page does not link to it.
**Verify:** build; by inspection with the owner, recorded as one dated sentence.
**Depends on:** Task 5. **Files:** `src/pages/styleguide.astro`.

## Task 7 — Build the page frame that each page shares

- [x] Add `src/layouts/BaseLayout.astro` with typed `title` and `description`, the language, the viewport, the icon of the site, the `<Font />` components and the global style sheet.
- [x] Add the inline head script that sets the `dark` class before the first paint from the saved choice or the device.
- [x] Add the skip link as the first focusable element, and the `main` landmark with its target.
- [x] Move `index.astro` and `styleguide.astro` onto the layout.

**Acceptance:** both pages render inside the layout; with the device in dark mode and no saved choice, the first paint is dark; the skip link moves the focus to the main content.
**Verify:** a browser test with an emulated dark colour scheme and each script file refused, which shows that the script in the head alone sets the mode and stands before the first style sheet; a browser test of the skip link.
**Depends on:** Task 6. **Files:** `src/layouts/BaseLayout.astro`, both pages, `public/favicon.svg`, `tests/layout.spec.ts`.

## Task 8 — Add the light and dark button

- [x] Add `src/components/ThemeToggle.astro`: a `button` with an accessible name that says the action, a Phosphor sun and moon icon, and `aria-pressed` or an equal state.
- [x] On click, toggle the class and save the choice; while no choice is saved, follow a change of the device setting.
- [x] Add browser tests: first load follows the device; the button changes the mode; the choice outlasts a reload.

**Acceptance:** the three theme tests pass; the button is reachable by keyboard and has a visible focus ring.
**Verify:** `pnpm --dir packages/app test`.
**Depends on:** Task 7. **Files:** `src/components/ThemeToggle.astro`, `tests/theme.spec.ts`.

## Task 9 — Build the header with its phone menu

- [x] Verify SVG files as components in Astro 7, and add the Phosphor core package for the icons.
- [x] Add `src/components/Header.astro`: the text logo, the links to the drinks, food and moments sections, and the theme button.
- [x] Below the desktop breakpoint, put the links behind a menu button with `aria-expanded` and `aria-controls`; Escape closes the panel and returns the focus.
- [x] Add a browser test at 375 pixels: the button opens and closes the panel by keyboard, and a link in it reaches its section.

**Acceptance:** at 1280 pixels the links are visible and no menu button is offered; at 375 pixels the menu works by touch and by keyboard; no link leads to a page that does not exist.
**Verify:** the browser test; by inspection with the owner.
**Depends on:** Task 8. **Files:** `src/components/Header.astro`, `src/components/Logo.astro`, `tests/layout.spec.ts`, `package.json`.

## Task 10 — Build the footer

- [x] Add `src/components/Footer.astro` on Charcoal Steam in both modes: the text logo, the section links and the tagline.
- [x] Render a social icon only for an account in the content data; with none, render no icon row.
- [x] Do not add a newsletter field.

**Acceptance:** the footer is on each page; its text passes contrast on Charcoal Steam; it holds no form.
**Verify:** build; the layout browser tests; by inspection with the owner.
**Depends on:** Task 9. **Files:** `src/components/Footer.astro`, `src/content/site.ts`.
**Waits for:** open questions 3 and 4 of the specification for the tagline and the accounts; sample tagline until then.

## Task 11 — Choose and add the hero photograph

- [x] Find 2 or 3 candidate photographs on Unsplash that fit the coffee imagery rules of the site brief, with no recognisable face and no other brand.
- [x] Choose the photograph. The owner gave this choice to the agent with the autonomous mode, so the agent chose and downloaded it and did not show the candidates first.
- [x] Store the file in `src/assets/images` and add its line to `CREDITS.md`: the photographer, the source page, the part that uses it.

**Acceptance:** one hero photograph is in the package with its credit line.
**Verify:** the file and the credit line exist. The owner has not seen the choice; the plan lists it for the close.
**Depends on:** Task 7. **Files:** `src/assets/images/`, `src/assets/images/CREDITS.md`.

## Task 12 — Build the hero

- [x] Verify the image component of Astro for local files against its documentation.
- [x] Add `src/components/Hero.astro`: the full-width photograph with the gradient overlay and the grain, the `h1` headline, the supporting line, and the “View Menu” button that goes to the signature drinks section.
- [x] Add the background shapes as decorative elements that assistive technology ignores.
- [x] Give the button the hover scale and gradient of the site brief under `motion-safe`, and a visible focus ring.
- [x] Extend the home browser test: the hero is visible at the three widths and the button moves to the drinks section.

**Acceptance:** the headline and the line pass contrast over the photograph in both modes; the photograph has a text alternative; the page has one `h1`.
**Verify:** the browser test; by inspection with the owner at the three widths.
**Depends on:** Task 11. **Files:** `src/components/Hero.astro`, `src/content/home.ts`, `src/pages/index.astro`, `tests/home.spec.ts`.
**Waits for:** open question 3 for the headline; a proposal is shown to the owner before it is used.

## Task 13 — Build the quick highlights

- [x] Add the highlights as typed data in `src/content/home.ts`, with a Phosphor icon name each.
- [x] Add `src/components/Highlights.astro` and a card component: the icon, the title, one line of text; the lift on hover under `motion-safe`. A card holds no control, so it takes no keyboard focus.
- [x] Lay the cards out as one column on a phone, two at tablet width and one row at desktop width.

**Acceptance:** three or four cards render from the data; the layout matches at the three widths; no card states an unconfirmed fact as true. The line of text of each card is marked as a sample.
**Verify:** the home browser test; by inspection with the owner.
**Depends on:** Task 12. **Files:** `src/components/Highlights.astro`, `src/components/HighlightCard.astro`, `src/content/home.ts`, `src/pages/index.astro`.
**Waits for:** open question 1; until the owner confirms “Open Late” and “Melbourne CBD”, those two cards are left out.

## Task 14 — Choose and add the drink, food and social photographs

- [x] List the photographs that tasks 15 to 17 need, by part, and find candidates on Unsplash under the same rules as Task 11.
- [x] Choose the photographs. The agent chose and downloaded them under the autonomous mode and did not show the list first.
- [x] Store the files and add the credit lines.

**Acceptance:** each photograph that tasks 15 to 17 use is stored and credited.
**Verify:** each file has its credit line. The owner has not seen the list; the plan lists it for the close.
**Depends on:** Task 11. **Files:** `src/assets/images/`, `CREDITS.md`.

## Task 15 — Build the signature drinks row

- [x] Add the drinks as typed data: name, description, photograph, optional chip, the sample field.
- [x] Add `src/components/SignatureDrinks.astro` and a drink card with the rounded crop, the offset shadow and the Mint Kulfi chip.
- [x] On a phone, make the row a labelled, focusable scroll container with scroll snap; add the dots as buttons that scroll to a card and mark the current one.
- [x] From the desktop breakpoint, lay the same cards out as a grid and hide the dots.
- [x] Add browser tests: at 375 pixels a dot moves the row and the current dot changes; arrow keys move the row; at 1280 pixels all cards are visible with no scroll.

**Acceptance:** the section has the `id` that the header link and the hero button target; the row works by touch, by dots and by keyboard; the grid shows at desktop width.
**Verify:** the browser tests; by inspection with the owner.
**Depends on:** Task 14. **Files:** `src/components/SignatureDrinks.astro`, `src/components/DrinkCard.astro`, `src/content/home.ts`, `src/pages/index.astro`, `tests/home.spec.ts`.
**Waits for:** open question 2; sample drinks until then.

## Task 16 — Build the fusion food teaser

- [x] Add the dishes as typed data, three to five entries.
- [x] Add `src/components/FusionFood.astro`: the photograph beside the list on a desktop, stacked on a phone, on the Filter Beige alternate surface.
- [x] Style the list as menu lines with the name, the description and the dotted leader of the site brief; no price in this slice.

**Acceptance:** the section has the `id` that the header link targets; the two layouts match the widths; the text passes contrast on the alternate surface in both modes.
**Verify:** the home browser test; by inspection with the owner.
**Depends on:** Task 14. **Files:** `src/components/FusionFood.astro`, `src/content/home.ts`, `src/pages/index.astro`.
**Waits for:** open question 2; sample dishes until then.

## Task 17 — Build the social band

- [x] Add `src/components/SocialBand.astro`: a row of square photographs. The hashtag is left out, because the cafe has not confirmed it; a script line stands above the heading in its place.
- [x] Add the caption overlay on hover. No tile is a link, because the content data holds no destination, so no tile takes the keyboard focus.
- [x] Make the row wrap or scroll without sideways scroll of the page at 375 pixels.

**Acceptance:** the section has the `id` that the header link targets; each photograph has a text alternative; no tile links to a made-up account.
**Verify:** the home browser test; by inspection with the owner.
**Depends on:** Task 14. **Files:** `src/components/SocialBand.astro`, `src/content/home.ts`, `src/pages/index.astro`.
**Waits for:** open question 4 for the hashtag; the hashtag is left out until the owner confirms it.

## Task 18 — Add the entry animations and the scroll movement

- [x] Add one reveal script and its classes: a section fades and slides up when it enters the view, its cards staggered, each transition between 150 and 250 milliseconds.
- [x] Keep the content visible when scripts do not run and when reduced motion is asked for.
- [x] Add the light scroll movement of the hero shapes with CSS scroll-driven animation, inside a support query and under `motion-safe`.
- [x] Add browser tests with reduced motion emulated: no element of the page has a running animation or a transition longer than zero, and each section is visible.

**Acceptance:** with motion allowed, the sections animate once on entry; with reduced motion, nothing nonessential moves and nothing is hidden.
**Verify:** the browser tests; by inspection with the owner.
**Depends on:** Task 17. **Files:** `src/scripts/reveal.ts`, `src/styles/global.css`, the section components, `tests/motion.spec.ts`.

## Task 19 — Prove accessibility and privacy over the whole page

- [x] Add the axe scan of the home page and of the style reference page, in light and in dark mode, at phone and desktop width; correct each violation in its component.
- [x] Add a focus-order test: Tab from the top reaches the skip link, the header controls, the hero button, the drinks row and its dots, and the footer links, in the order of the page.
- [x] Add a test that fails when the page makes a request to a host other than its own.
- [x] Add a check that fails when a component or a page holds a raw colour value.
- [x] Review each focus ring by eye in both modes. The agent did this from screenshots, in the place of the owner, under the autonomous mode.

**Acceptance:** success criteria 5, 7, 8 and 9 of the specification hold.
**Verify:** `pnpm check` from the root; the dated sentence of the inspection.
**Depends on:** Task 18. **Files:** `tests/a11y.spec.ts`, `tests/privacy.spec.ts`, the components that need a correction.

## Checkpoints

- **After Task 3 (D1):** `pnpm check` passes from the root; the owner reviews before the commit.
- **After Task 6 (D2):** the owner sees the style reference page in both modes; any failing colour pair is decided.
- **After Task 10 (D3):** the owner sees the header, the phone menu, the theme button and the footer.
- **After Task 13 (D4) and Task 17 (D5):** the owner sees the home page at the three widths in both modes.
- **After Task 19 (D6):** the whole page passes its checks; the final proof follows.
