# Spec: S02 Menu and Our Story

This is the specification of the second slice of the [roadmap](../roadmap.md). It owns the scope and the success criteria of the slice. The [site brief](../../README.md) owns the design; the [specification of S01](../S01/SPEC.md) owns the tech stack, the commands, the project structure, the code style and the decisions of the owner on the theme, and they hold for this slice without a copy here.

## Objective

A visitor can read what Teekaapi serves and where it comes from. The slice adds two pages to the site and the links that lead to them:

1. **The menu page**, at `/menu`: the four categories of the site brief, each with grouped items, a description, dietary marks and a price; a “Today’s Special” card at the top; and a category bar that stays in view during scroll.
2. **The story page**, at `/story`: the narrative of the cafe, a timeline of three or four milestones, and portraits with captions.
3. **The way in**: the header and the footer link to both pages, and the “View Menu” button of the home page goes to the menu page.

### Decisions of the owner

The owner made these choices for this slice and for S03 on 2026-10-13.

| Subject | Decision |
|---|---|
| Mode | Autonomous, for S02 and S03, in the session that delivered S01. |
| User-facing choices | The agent makes them, records each one in the plan, and lists them for the owner at the close of each slice. |
| Content | Sample content, marked as samples in the content files. Nothing about where and when the cafe is open is invented. |
| Photographs | From Unsplash, as in S01, stored in the site. |

The decisions of the owner in the specification of S01 stand: the fonts, dark mode, the focus ring, button text, no newsletter field, no request to another host.

### Assumptions

1. The cafe has not supplied its menu, its prices, its story, its milestones or pictures of its people. Each of them is sample content.
2. A sample milestone carries no year, and a sample portrait shows no recognisable face and names no person. A stranger from a stock photograph is never shown as a member of the team.
3. Prices are in Australian dollars and are samples.

## The parts in detail

### The menu page

| Part | Content | Behaviour |
|---|---|---|
| Page heading | The title of the page and one line | — |
| Today’s Special | One card at the top with a name, a description and a price | A soft glow that moves slowly; with reduced motion it does not move |
| Category bar | Coffee, Cold Brew & Specials, Fusion Bites, Desserts | It stays at the top of the window during scroll. A choice moves the page to its category. The bar marks the category that is in view. It works by keyboard and by touch, and it never causes a sideways scroll of the page. |
| Category | A heading, then groups such as “Classics” and “House Signatures” | Every category is on the page at the same time, so a visitor without scripts reads the whole menu |
| Item | A name, a short description, dietary marks and a price, with the dotted leader of the site brief between the name and the price | The item lifts a little under the pointer |
| Dietary key | What each mark means | A mark is never colour alone: it has a letter and a text alternative |

### The story page

| Part | Content | Behaviour |
|---|---|---|
| Narrative | The origin of Teekaapi, its tie to Melbourne and its idea of coffee and fusion food, in three or four short paragraphs | — |
| Timeline | Three or four milestones, each with an icon in the retro style, joined by a line | The line runs down the side on a phone and across the middle on a desktop |
| Portraits | Three or four photographs with captions, of hands at work and of the room | The grain and the offset shadow of the site brief |

### The way in

- The header and the footer list the pages of the site: Menu and Our Story. The links to the sections of the home page leave the header; the home page is reached through the logo.
- The link of the current page is marked for sight and for assistive technology.
- “View Menu” on the home page goes to `/menu`.

## Testing strategy

The browser tests of S01 stay and still pass. This slice adds, at the three widths:

| Concern | Check |
|---|---|
| Menu content | Four categories, each with at least one group and one item; each item has a name and a price; the special card is first |
| Category bar | It stays in view after a scroll; a choice by keyboard and by pointer brings its category into view; the mark follows the scroll; no sideways scroll |
| Story content | The narrative, three or four milestones in order, three or four portraits with text alternatives |
| Navigation | Each link of the header and the footer has a target; the current page is marked; “View Menu” reaches the menu page |
| Accessibility | The axe scan of both pages in light and in dark mode; the focus order of both pages |
| Motion | With reduced motion nothing on either page animates or stays hidden |
| Privacy | Neither page makes a request to another host; no raw colour value |

## Boundaries

The boundaries of the specification of S01 hold. In addition:

- **Never.** Show a recognisable person from a stock photograph as a person of the cafe. State a year, an award, a supplier or a founder as a fact.

## Success criteria

1. `pnpm check` passes from the root of the repository, with the tests of S01 and of this slice.
2. `/menu` shows the special card, the category bar and the four categories with grouped items, descriptions, dietary marks and prices.
3. The category bar stays in view during scroll, moves the page to a category by keyboard, by pointer and by touch, and marks the category in view.
4. `/story` shows the narrative, a timeline of three or four milestones and three or four portraits with captions.
5. Both pages have no sideways scroll at 375, 768 and 1280 pixels, and work in light and in dark mode.
6. The accessibility scan reports no violation on either page in either mode.
7. With reduced motion asked for, no nonessential animation runs on either page, and without scripts the whole content of both pages can be read.
8. The header and the footer link to both pages, each link has a target, and the current page is marked.
9. A visit to either page makes no request to another host, and no component or page holds a raw colour value.
10. Each sample entry is marked in the content files, and each new photograph is credited.

## Out of scope

- The gallery, the visit page and the order and booking preview, which are S03.
- A content management system, a real menu feed and prices from a till system.
- Search-engine work beyond the title and the description of each page.

## Open questions

1. The real menu with its prices and its dietary facts.
2. The real story, its milestones and pictures of the team, with the consent of each person shown.
