# Teekaapi site roadmap

**Delivery state:** S01 and S02 are closed. S03 is selected in the [project pointer](project-state.json) and is in preparation in orchestrated mode. Its specification and plan are released, and the corrected draft passed independent review; the slice start and build are authorized.

This roadmap delivers the website of Teekaapi. The [brief](#brief) below says what the project is; the numbered sections own the approach, the order of delivery and the acceptance of each slice.

## Brief

Teekaapi is a South Indian cafe in Melbourne with specialty coffee and a fusion-food menu. Its website presents the cafe as a playful, premium neo-retro experience: bold, welcoming, a little nostalgic and distinctly modern.

The [site brief](../README.md) in the README of the repository owns the design concept, the colour palette, the typography, the page structure, the image rules, the interactions and the theme instruction. This roadmap does not repeat them; each slice reads the parts of the site brief that it builds.

**Where the project is.** The site package exists in `packages/app` with the theme, the shared layout, the home page, the menu page and the story page. Each page shows sample content and stand-in photographs. The gallery, the visit page and the order and booking preview do not exist yet.

## 1. Implementation approach

- **One package.** The site is `packages/app` in the pnpm workspace of this repository.
- **Starting choice, confirmed in the specification of S01.** Astro builds the pages and Tailwind CSS holds the theme, as the site brief asks for a Tailwind theme. A small interactive component is added only where a page needs state: the menu tabs, the gallery filters and the booking steps.
- **A static site.** It has no server and stores nothing.
- **Theme tokens.** The Tailwind theme names each colour and font of the site brief. A page uses those names and no raw colour value.
- **Built in from the start.** Mobile-first layout, light and dark mode, reduced motion, focus states and WCAG contrast are part of each slice, not a later pass.
- **Placeholder content.** The site uses placeholder photographs with the crops and treatments of the site brief, and placeholder menu items, prices, address and hours, until the cafe supplies its own. The plan of each slice names its placeholders.
- **A preview of booking.** The booking steps send nothing and store nothing. The choice of a booking or ordering provider is outside this roadmap.

## 2. Delivery catalogue

Each slice is delivered through Lets Vibe: a specification, a plan, a task list, the build, the checks, one independent review and a close. A slice gets its documents in `plans/<slice-id>/` when it is selected, and not before.

**The autonomous run of S02.** On 2026-10-13 the owner authorized the delivery of S02 and then S03 in autonomous mode, with the user-facing choices given to the agent, in the session that delivered S01. Later on the same day, during S02, the owner ended that run at the close of S02. S03 is therefore not started and does not inherit the mode: it needs a new word of the owner. The choices that the owner made for S03 on that day stand and are recorded in the scope section below.

| Slice | Title | Disposition | Builds on | Outcome | Acceptance evidence |
|---|---|---|---|---|---|
| **Phase 1 — The Teekaapi site** | | | | | |
| [S01](S01/SPEC.md) | Foundation and home page | Closed; the [plan](S01/tasks/plan.md#completion) records the result and what waits for the owner | The site brief | The Astro and Tailwind project in a new `packages/app`; the theme with the palette and the fonts; the shared layout with the header, the footer, dark mode and reduced motion; the home page with its hero, highlights, signature drinks, fusion food teaser and social band | The build passes; the home page works at phone, tablet and desktop widths in light and dark mode; contrast, focus order and reduced motion checked in a browser |
| [S02](S02/SPEC.md) | Menu and Our Story | Closed; the [plan](S02/tasks/plan.md#completion) records the result and what waits for the owner | S01 | The menu page with its four categories, grouped items, dietary icons, prices, the “Today’s Special” card and the sticky category navigation; the story page with the narrative, the timeline and the portraits | The build passes; each category is reachable by keyboard and by touch; the sticky navigation works during scroll; both pages checked in light and dark mode |
| [S03](S03/SPEC.md) | Gallery, Visit Us and Order / Book | In preparation; the [plan](S03/tasks/plan.md) holds the start record and proposed delivery | S01 | The gallery with overlays and filters; the visit page with the address, hours, map, transport notes and action buttons; the order and booking preview in three steps | The build passes; the filters and overlays work by keyboard and by touch; the booking preview states that it sends nothing; each page checked in light and dark mode |

## 3. Product scope

**In scope.** The seven parts of the structure in the site brief: home, menu, our story, gallery, visit us, order and book, and the footer on each page.

**Not in this roadmap.** A real booking or ordering service, a content management system, a newsletter service behind the signup field, analytics, hosting and deployment, and the final photographs, menu and visit details of the cafe.

### Choices that the owner made for S03

The owner made these choices on 2026-10-13, before S03 was planned. The specification of S03 takes them up when the slice starts.

- **Map.** The visit page gets a map card that the site draws itself, with the Teekaapi marker and a button that opens the maps application of the visitor. No map is embedded, and nothing loads from another host.
- **Facts of the cafe.** The address, the hours and the phone number are shown as “to be confirmed” until the cafe supplies them. No value is invented.
- **Other content.** Sample content, marked as samples in the content files.

### Choices that the site brief leaves open

The site brief gives two options in several places. Each one is a user-facing choice, so the agent asks the user under the [UI decision consultation gate](../tooling/agents/plugins/vibe/skills/lets-vibe/references/addy-method-gates.md#ui-decision-consultation) and records the answer in the specification of the slice:

- the heading font, Space Grotesk or League Spartan; the body font, Inter or DM Sans; the script font, Pacifico or Dancing Script;
- segmented controls or tabs for the menu categories;
- a grid or a masonry layout for the gallery;
- a page or a modal for order and book.

## 4. Document maintenance

The Markdown owns this roadmap; `roadmap.html` is generated from it. From the repository root:

```sh
pnpm roadmap
pnpm roadmap:check
```

`pnpm check` runs the checks of the agent skills, the roadmap check, the freshness check of the progress report, and the type check and the browser tests of the site. The [README of the site package](../packages/app/README.md) lists the commands of the site.

Keep the brief at the top and the four numbered sections. A new slice gets its row at its place in the order of delivery. The project pointer owns the selection of the current slice; this roadmap does not start a slice, and it records no task, no commit and no evidence of a slice that has not run.
