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
5. **Scripts, not a framework.** The theme button, the phone menu and the dots of the drinks row are `<script>` blocks in their Astro components; the entry animation is one script that the layout loads. The entry animation uses one `IntersectionObserver`; the scroll movement of the hero shapes uses CSS where the browser supports scroll-driven animation and is absent elsewhere.
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
- **Highlights.** Four cards: Specialty Coffee, Fusion Bites, South Indian Roots and Melbourne Made, each with a sample line of text. “Open Late” and “Melbourne CBD” of the site brief are left out, because the cafe has not confirmed them. The icons are the two-tone Phosphor set.
- **Card hover.** A card rises a little and gets an offset Teekaapi Orange shadow.

- **Signature drinks.** Four sample drinks: Filter Kaapi, Jaggery Flat White, Iced Kaapi and Masala Latte. The row is a grid from the tablet width, two across and then four across. Each photograph has a tall rounded crop with an offset shadow, orange and mint in turn. The current dot is a wide filled bar. The small script line above the heading reads “House favourites”.
- **Fusion food.** Four sample dishes, each with a dotted leader to a short tag in place of a price. The photograph has one square corner, a dark border and an offset mint shadow. The script line is “Chef’s pick” from the site brief.
- **Social band.** Six square photographs, two across on a phone and six across on a desktop. A caption appears over a photograph under the pointer. The heading is “Teekaapi moments” with the script line “Come hang out”. The hashtag is left out until the cafe confirms it, and no photograph is a link.

- **Entry animation.** Each heading and each card fades and slides up one time, in 220 milliseconds, with 60 milliseconds between the cards of one group. The drinks row enters as one piece: a card that waits outside a swipe row would stay hidden.
- **Hero shapes.** A quarter disc in Teekaapi Orange in the top corner, a half disc in Fusion Pink at the bottom edge and a Mint Kulfi outline. They drift a little on scroll where the browser supports scroll-driven animation. They stay inside the hero and clear of its words.

- **Accent text on dark surfaces. This one waits for the owner.** The hero flourish and the footer tagline are Mint Kulfi text on dark surfaces in both modes, and the full stop of the logo is Teekaapi Orange decoration. The decision of the owner in the specification says that in light mode the accents are never the colour of text. The agent read it as a rule for light surfaces, which is where the contrast fails. The reviewer holds that this reading is outside what the owner gave to the agent, so the specification keeps the words of the owner. The owner confirmed the reading on 2026-10-13, after the close, and the specification now carries it.
- **Phone header.** The menu button stands to the left of the theme button, so that the order on the screen is the order of the keyboard: the menu button, its links, the theme button.
- **Dish tags and captions.** A dish carries a tag that names its kind (Toastie, Sides, Griddle, Bao), not a dietary claim. The captions of the social band are short neutral phrases.

### Findings of the accessibility scan, and their corrections

- The drinks row and its section had the same accessible name. The row is now a group with a name of its own.
- The first orange shape reached up behind the header, so the scanner read the header links as light text on orange. The shape is now a quarter disc inside the hero.
- At the tablet width the headline ran onto the orange shape, which the scanner cannot see. The shape is smaller there and the headline is narrower; a test now fails if a line of hero text meets a shape.
- A part that was in view at the first paint kept its entry mark, because no transition ran to end it. A timer now clears the mark too.

### Findings of the independent review, and their corrections

The reviewer returned FIX on the candidate of the final proof. Each finding keeps its identifier.

- **R1, blocking.** The last dot of the drinks row never became the current dot, and a stale dot stayed current at the end of the row. The dots now follow the scroll position, with the last dot at the end of the row. A card keeps one width below the tablet width, so each dot has its own position. A test clicks the last dot and scrolls to both ends.
- **R2, should fix.** With the phone menu open, the next stop of the keyboard was outside the panel. The menu button now stands before its links in the page, the panel closes when the focus or a click goes elsewhere, and the test uses the keyboard for each step.
- **R3, should fix.** Lines of text, tags, chips and captions that the site brief does not state were not marked as samples. Each one is now marked in the content data, the lines are reworded so that they claim less, the dietary tags are gone, and the limitations below name all of them.
- **R4, minor.** The task list ticked actions that a delegated choice had replaced. Those lines now say what was done.
- **R5, minor.** Without scripts on a phone, the header links could not be reached and three controls did nothing. Without scripts the links now stay in the header, and the menu button, the theme button and the dots are not shown. A device in dark mode then gets the light mode; the mode needs the script.
- **R6, minor.** Accent text on dark surfaces. The reviewer accepted it in substance and held that the owner must confirm it. It is recorded above under the choices of the agent, as the one that waits for the owner.

The reviewer assessed the corrections and returned PASS, with R1 to R5 resolved and one new minor finding:

- **R7, minor.** A new test said that it refused each script file, but the built page has no script file to refuse, because Astro writes each script into the page. The test now claims only what it proves: the first load is dark, and the script that sets the mode is in the head before the first style.
- **Suggestion taken.** The entry animation now hides a part only after its own script has started, so a script that fails to load hides nothing.
- **Suggestions not taken.** The last drink card ends at the edge of the screen at the end of the row. The focus ring of the drinks row is cut at the two edges of the screen. No test measures the contrast of the hero words against the photograph; the reviewer measured it, and the thinnest margin was 4.83 against 4.5 at 768 pixels. The site brief asks for darker photographs in dark mode, and the specification does not.

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

## Completion

The slice is closed. It delivered the six deliverables of this plan: the site package with its checks, the theme and the fonts, the shared layout, and the home page with its five parts, its motion and its accessibility proof. Success criteria 1 to 10 of the specification are met. Criterion 11 is open: the owner has not yet looked at the finished home page.

What the owner does next:

1. Look at the home page at a phone, a tablet and a desktop width, in light and in dark mode.
2. Read “Choices that the agent made for the owner” above, and confirm or change each one. The choice on accent text on dark surfaces needs a word from the owner.
3. Answer the open questions of the specification, and supply the real content in place of the sample content that the limitations below name.

A change that the owner asks for after the close is new work, as a sub-slice or inside the next slice.

**Integration.** On 2026-10-13 the slice was joined into the main line of the repository by a fast-forward, with its close included, and the check of the repository passed there. Nothing was pushed or published; the repository has no remote.

## Verification record

### Final proof, 2026-10-13

All checks ran on Node 24.20.0 against the real local build, with no mock and no outside service.

| Check | Result |
|---|---|
| `pnpm install --frozen-lockfile` from the root | Passed |
| `pnpm check` from the root: the agent checks, the roadmap check, the freshness check of the progress report, the type and template check and the browser tests | Passed |
| Type and template check of the site | Passed, with 0 errors, 0 warnings and 0 hints |
| Browser tests: 30 tests, each at 375, 768 and 1280 pixels | 90 passed after the corrections of the review. Before them, 84 of 84 passed in 6 runs. |
| Independent review: one Review Vibe assessment by a reviewer that did not write the work | FIX on the candidate of the final proof, then PASS on the corrected candidate. The reviewer ran `pnpm check` and its own probes at 320 to 1920 pixels. |

How the success criteria of the specification are proven:

| Criterion | Proof |
|---|---|
| 1. Install and check pass | The first two rows above |
| 2. The five parts, the header and the footer | `tests/home.spec.ts`, `tests/layout.spec.ts` |
| 3. No sideways scroll at the three widths; the layouts of the parts | `tests/home.spec.ts` |
| 4. The theme, with no flash of the wrong mode | `tests/theme.spec.ts`; the head script sets the mode before the first paint |
| 5. No accessibility violation in light and in dark mode | `tests/a11y.spec.ts`, the axe scan with the WCAG 2 A and AA rules and the best-practice rules |
| 6. No nonessential animation with reduced motion | `tests/motion.spec.ts` |
| 7. Each control by keyboard, in order, with a focus ring | `tests/a11y.spec.ts`, `tests/layout.spec.ts`, `tests/home.spec.ts` |
| 8. No raw colour value in a component or a page | `tests/privacy.spec.ts` |
| 9. No request to another host | `tests/privacy.spec.ts` |
| 10. Each photograph is credited and has a text alternative | The tests of each part for the alternatives; an inspection on 2026-10-13 found each of the 12 files in `CREDITS.md` and in use |
| 11. The owner accepts the page in a browser | Not met as written. See the limitations. |

Checks by inspection:

- On 2026-10-13 the owner accepted the style reference page from screenshots at a desktop and a phone width, in light and in dark mode.
- On 2026-10-13 the owner received screenshots of the header, the phone menu, the footer and the focus ring at a desktop and a phone width in both modes, and raised no change.
- On 2026-10-13 the agent compared the whole home page with the site brief from screenshots at 375, 768 and 1280 pixels in both modes, in the place of the owner. It corrected one fault that it found: the headline ran onto a hero shape at the tablet width.

Limitations and checks that did not run:

- **Criterion 11.** The owner gave the user-facing choices of D4 to D6 to the agent and has not looked at the finished home page. The agent lists its choices for the owner at the close; a change that the owner then asks for is new work.
- The browser tests run in Chromium only. Safari and Firefox were not tested.
- The accessibility scan finds what a tool can find. No person tested the page with a screen reader.
- The scan cannot judge text over a photograph. The hero keeps its words on an Espresso Noir overlay, and a test keeps them off the coloured shapes.
- No performance measurement ran. The roadmap has no performance target.
- One early run of `pnpm check` failed one time in the tests of the agents package, during D2. It did not fail again in more than 15 later runs, and its cause is not known.
- Sample content: the hero words; the line of text of each highlight card; the drinks with their descriptions and chips; the introduction, the dishes and the tags of the food teaser; the captions of the social band; and the tagline of the footer. The content data marks each one. The photographs, the logo and the icon of the site are stand-ins. The site is not ready to go public with them.
- Without scripts the site shows the light mode on each device, and the drinks row has no dots.
- The reviewer did not open the source pages of the photographs, so the names and the links of `CREDITS.md` come from the search results of Unsplash and no second person checked them.
