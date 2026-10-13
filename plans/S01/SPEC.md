# Spec: S01 Foundation and home page

This is the specification of the first slice of the [roadmap](../roadmap.md). It owns the scope and the success criteria of the slice. The [site brief](../../README.md) owns the design concept, the palette, the typography, the page structure, the image rules and the interactions; this document links to it and does not repeat it.

## Objective

Teekaapi is a real South Indian cafe in Melbourne, and this site will be put in front of its customers. This slice builds the base that every later page stands on, and the first page a customer sees.

A visitor who opens the home page on a phone sees what Teekaapi is, what it serves and how it feels, in the neo-retro style of the site brief, in light or in dark mode, with or without motion, by touch or by keyboard.

The slice delivers:

1. **The project.** An Astro and Tailwind CSS package in a new `packages/app`, as a member of the pnpm workspace, with its build and its checks joined to the `check` script of the repository.
2. **The theme.** Each colour and each font of the site brief as a named theme token. A page uses the names and no raw colour value.
3. **The shared layout.** The header, the footer, dark mode and reduced motion, used by every page of the site.
4. **The home page.** The five parts that the site brief lists under “Home / Landing”: the hero, the quick highlights, the signature drinks, the fusion food teaser and the social band.

### Decisions of the owner

The owner made these choices for this slice on 2026-10-13. A later slice may add to them; it does not reopen them without the owner.

| Subject | Decision |
|---|---|
| Framework | Astro with Tailwind CSS |
| Heading font | Space Grotesk |
| Body font | DM Sans |
| Script font | Pacifico, for small flourishes only |
| Dark mode | The site follows the setting of the device on the first visit. A button in the header lets the visitor choose light or dark, and the browser remembers the choice. |
| Navigation | The header and the hero show only what exists. The header links to the sections of the home page. The hero has one button, “View Menu”, which goes to the signature drinks. The second hero button of the site brief waits for the slice that builds its page. |
| Newsletter field | Left out of the footer until a newsletter service is chosen. |
| Signature drinks on a phone | A row that the visitor swipes, where each card snaps into place, with dots that show the position. On a desktop it is a grid, as the site brief says. |
| Photographs | Photographs from Unsplash that fit the image rules of the site brief. |

### Assumptions

1. The site is in English and has one language.
2. It targets the current versions of Safari, Chrome, Firefox and Edge, on phone and on desktop.
3. The cafe has not yet supplied its logo, its menu, its prices, its address or its hours. Where this slice needs such a fact, it uses a text logo and sample text. [Open questions](#open-questions) lists each one.
4. The site is not made public by this slice. Hosting and launch are outside the roadmap.

The interview that was to confirm the intent of the owner was stopped by the owner after its first answer, which was that the cafe is real. The other points of intent are the assumptions above, not confirmed statements.

## Tech stack

| Part | Choice | Source |
|---|---|---|
| Runtime | Node `^22.18.0` or `^24.11.0`, as the repository declares. Astro asks for 22.12.0 or later and does not support odd-numbered versions. | <https://docs.astro.build/en/install-and-setup/> |
| Package manager | pnpm 11, the workspace of the repository | Root `package.json` |
| Framework | Astro 7; the registry gave 7.3.8 on 2026-10-13 | <https://docs.astro.build/en/install-and-setup/> |
| Styles | Tailwind CSS 4 with its Vite plugin, `tailwindcss` and `@tailwindcss/vite`; the registry gave 4.3.3 for both on 2026-10-13 | <https://tailwindcss.com/docs/installation/framework-guides/astro> |
| Theme tokens | The `@theme` directive in the global style sheet, with the `--color-*` and `--font-*` namespaces | <https://tailwindcss.com/docs/theme> |
| Dark mode | A custom `dark` variant on a class of the root element, with a short inline script in the head that reads the saved choice or the setting of the device | <https://tailwindcss.com/docs/dark-mode> |
| Fonts | The Fonts API of Astro with the Fontsource provider. Astro downloads the font files at build time and serves them from the site, so a visit sends nothing to a font service. | <https://docs.astro.build/en/guides/fonts/> |
| Photographs | Files from Unsplash, kept in the package and processed by Astro at build time | <https://unsplash.com/license> |
| Language | TypeScript in strict mode, in the front matter of Astro files and in scripts | — |

The plan pins the exact versions when the package is created.

**Not verified.** The fonts page of Astro does not say whether the Fonts API is stable in version 7. The plan checks this when the package is created. If it is experimental, the fonts come from the Fontsource packages instead, which also serve the files from the site.

**Interactive parts.** This slice adds no interface framework such as React. The theme button, the dots of the drinks row and the entry animations are small scripts in Astro components.

## Commands

From the root of the repository, after this slice:

```sh
pnpm install                  # install the workspace
pnpm --dir packages/app dev   # development server
pnpm --dir packages/app build # build the static site to packages/app/dist
pnpm --dir packages/app preview
pnpm --dir packages/app check # type and template check
pnpm --dir packages/app test  # browser tests against the built site
pnpm check                    # all checks of the repository, with the site included
```

`dev`, `build` and `preview` are the scripts that the Astro documentation gives. `check` and `test` are scripts that this slice adds; the plan names the tools behind them.

## Project structure

```text
packages/app/
  astro.config.mjs        Astro configuration: the Tailwind plugin and the fonts
  package.json
  tsconfig.json
  public/                 files served as they are: the icon of the site, robots.txt
  src/
    assets/images/        the photographs, with CREDITS.md
    components/           one file for each part: Header, Footer, ThemeToggle, Hero, …
    content/              the text of the home page as data: highlights, drinks, dishes
    layouts/BaseLayout.astro
    pages/index.astro
    styles/global.css     the Tailwind import, the theme tokens, the dark variant
  tests/                  browser tests
```

The text of the cards is kept as data in `src/content`, apart from the markup, so that the cafe can replace sample text without a change to a component.

## Code style

- A component is one `.astro` file, named in PascalCase, with its properties typed in the front matter.
- A colour or a font is always a theme token. A raw colour value appears only in `global.css`, where the tokens are defined.
- Dark mode is written with the `dark:` variant at the place of use.
- Motion is added with the `motion-safe:` variant, so that a visitor who asks for reduced motion gets none of the nonessential animation.
- Each interactive element has a visible focus ring, drawn with the Mint Kulfi token as the site brief says.

The tokens take their names from the site brief:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-espresso-noir: #1b1512;
  --color-cream-foam: #fff5e6;
  --color-teekaapi-orange: #ff7a3c;
  --color-fusion-pink: #f95e8a;
  --color-mint-kulfi: #7be0c3;
  --color-filter-beige: #e2c5a3;
  --color-charcoal-steam: #2a2731;
  --color-text-dark: #141414;
  --color-text-light: #fafafa;
}
```

```astro
---
interface Props {
  title: string
  description: string
}
const { title, description } = Astro.props
---
<article class="rounded-3xl bg-cream-foam p-6 text-text-dark motion-safe:transition motion-safe:hover:-translate-y-1 dark:bg-charcoal-steam dark:text-text-light">
  <h3 class="font-heading text-xl font-semibold">{title}</h3>
  <p class="font-body">{description}</p>
</article>
```

## The parts in detail

### The shared layout

- **Header.** The text logo, the links to the sections of the home page (drinks, food, moments), and the theme button. On a phone the links are behind a menu button that works by touch and by keyboard.
- **Footer.** Dark, on Charcoal Steam: the text logo, the same links, and a tagline. It has no newsletter field. Social icons appear only for the accounts that the cafe names; see [Open questions](#open-questions).
- **Theme.** No flash of the wrong mode when a page loads. The choice of the visitor outlasts a reload. Without a saved choice the site follows the device, and changes with it.
- **Skip link.** The first focusable element of each page goes to the main content.
- **Page data.** Each page has a title, a description, a language and an icon.

### The home page

| Part | Content | Behaviour |
|---|---|---|
| Hero | A full-width coffee or barista photograph with a gradient overlay, a headline, a short supporting line, and the “View Menu” button | The text stays readable over the photograph in both modes. Background shapes move lightly on scroll, and not at all with reduced motion. |
| Quick highlights | Three or four icon cards | Each card lifts a little on hover and on focus |
| Signature drinks | Cards with a photograph, a name, a short description and, where it applies, a “New” or “Seasonal” chip | A row with snap and dots on a phone; a grid on a desktop. The row can be moved by keyboard. |
| Fusion food teaser | A photograph beside three to five dishes with short descriptions | Side by side on a desktop, stacked on a phone |
| Social band | A row of square photographs and the hashtag | A light overlay on hover and on focus |

Each section fades and slides up when it enters the view, with its cards a little apart in time, and with a duration between 150 and 250 milliseconds as the site brief says.

### Photographs

- Each photograph is chosen to fit the image rules of the site brief: the subject, the crop, the warm and slightly desaturated grading. The grain and the offset shadow are added by the site, not baked into the file.
- The files are stored in the package and served by the site. The site loads nothing from Unsplash when a visitor opens it.
- `src/assets/images/CREDITS.md` names the photographer and the source page of each photograph. The Unsplash licence does not require this; the list lets the cafe find and replace each one.
- A photograph that shows the brand of another business, or the recognisable face of a person, is not used. The Unsplash licence page says nothing about people or brands, and the site brief asks for Teekaapi imagery only.
- The list of chosen photographs is shown to the owner before a file is downloaded.
- Each photograph has a text alternative that says what it shows.

## Testing strategy

| Concern | Check | Kind |
|---|---|---|
| The site builds | `astro build` ends without an error | Automated |
| Types and templates | The type and template check ends without an error | Automated |
| Layout at three widths | At a phone, a tablet and a desktop width, the page has no sideways scroll and each of the five parts is visible | Automated, in a browser |
| Theme | The first load follows the device. The button changes the mode. The choice outlasts a reload. | Automated, in a browser |
| Contrast and structure | An accessibility scan of the page in light and in dark mode reports no violation | Automated, in a browser |
| Reduced motion | With reduced motion asked for, the entry animations and the scroll movement do not run | Automated, in a browser |
| Keyboard | The focus order follows the page, each control has a visible focus ring, and the phone menu and the drinks row work by keyboard | Automated for the order; by inspection for the look of the ring |
| Look and feel | The page is compared with the site brief at the three widths in both modes | By inspection, with the owner |

The browser tests stay in `packages/app/tests` and run against the built site. The plan names the test tool. A check by inspection is recorded as one dated sentence, under the record rules of the repository.

## Boundaries

- **Always.** Use the theme tokens. Keep both modes and reduced motion working in each change. Run the checks of the package before a deliverable is presented. Give each photograph a text alternative and a line in the credits list.
- **Ask first.** A new dependency beyond those named here and in the plan. A user-facing choice that this document does not settle. The download of a file. Any text that states a fact about the cafe.
- **Never.** Load a font, a script or a picture from another site at the time of a visit. Collect or send data of a visitor. Present sample text as a fact of the cafe. Change the site brief. Publish or deploy.

## Success criteria

1. `pnpm install` and then `pnpm check` pass from the root of the repository, and `pnpm check` includes the build, the type and template check and the browser tests of the site.
2. The built home page holds the five parts of the site brief, the header and the footer.
3. At a width of 375, 768 and 1280 pixels the page has no sideways scroll, and each part is laid out as [The parts in detail](#the-parts-in-detail) says.
4. The theme behaves as the decision of the owner says, with no flash of the wrong mode.
5. The accessibility scan reports no violation in light and in dark mode.
6. With reduced motion asked for, no nonessential animation runs.
7. Each control can be reached and used by keyboard, in the order of the page, with a visible focus ring.
8. No colour value appears in a component or a page; each one is a theme token.
9. A visit to the built site makes no request to another host.
10. Each photograph is in the credits list and has a text alternative.
11. The owner has looked at the page in a browser, at the three widths and in both modes, and accepts it against the site brief.

## Out of scope

- The menu, story, gallery, visit and order pages, and the links to them.
- The second hero button and the newsletter field.
- A real booking or ordering service, a content management system and analytics.
- Hosting, a domain, deployment and launch.
- The logo, the final photographs and the real menu of the cafe.
- Search-engine work beyond the title, the description and the icon of the page.

## Open questions

Each of these is a fact about the cafe or a choice of the owner. None blocks the start of the plan; each blocks the text or the part that it names.

1. **Highlights.** The site brief gives “Specialty Coffee”, “Fusion Bites”, “Open Late” and “Melbourne CBD”. The last two are claims about a real cafe. Are both true?
2. **Signature drinks and dishes.** Which drinks and which dishes does the home page name? Without an answer the page shows sample items, marked as samples in the content files.
3. **Headline and tagline.** The site brief gives a tagline only as an example. Does the owner supply the words, or approve a proposal?
4. **Social accounts.** Which accounts does the cafe have, and is `#teekaapimoments` its hashtag? Without an answer the footer has no social icons.
5. **Logo.** A text logo in the heading font stands in until the cafe supplies a logo file.
6. **Launch.** The roadmap has no hosting, no deployment and no real content, and a real cafe needs all three. Does the owner want them added to the roadmap as later slices?
