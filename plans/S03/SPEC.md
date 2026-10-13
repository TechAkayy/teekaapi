# Specification: S03 Gallery, Visit Us and Order / Book

**Status:** closed and locally integrated on 2026-10-13 with the orchestrator's separate releases. The [plan](tasks/plan.md#completion) holds acceptance, close and integration decisions and limits, alongside the start record, sources and review results; the [task list](tasks/todo.md) owns progress.

## Objective and baseline

A visitor can browse the cafe's atmosphere, see which visit details are still unknown, and try an honest three-step order and booking preview. This completes the remaining page scope of the [roadmap](../roadmap.md#3-product-scope), without making a real reservation or order.

The [site brief](../../README.md) owns the visual language. The [foundation specification](../S01/SPEC.md#decisions-of-the-owner) owns the fonts, theme, focus ring, image rules and retained exclusions. The [menu and story specification](../S02/SPEC.md) and current implementation supply the existing page patterns. The later decision ending the earlier autonomous run, recorded in the roadmap, takes precedence over that specification's earlier mode statement. This run has its own orchestrated authority.

The roadmap's [owner choices for S03](../roadmap.md#choices-that-the-owner-made-for-s03) are settled: a locally drawn map card, no embed or automatic request to another host, address/hours/phone shown as “to be confirmed,” and other content marked as samples in its content files. Nothing here reopens those choices.

The capability boundaries are gallery browsing, visit information, and the booking preview. Each uses the existing shared site; none depends on another's state. Site navigation integrates them after their routes exist. At the orchestrator's request these stay in one S03 specification, with separate acceptance and deliverables, rather than separate module specifications.

## Scope and assumptions

- Add `/gallery/`, `/visit/` and `/order/`.
- Add the corresponding header/footer links and the deferred secondary action in the home hero. Keep the menu, story, theme control, logo, footer tagline and existing home content.
- Reuse local credited photographs. No new photograph download, package, framework, provider or service is proposed.
- Keep static Astro pages and small local scripts. Gallery filtering and preview choices have no persistence, network submission or query-string representation. The existing theme preference is unchanged.
- The preview's service options and times are examples, not confirmed services, opening hours or availability. No customer identity, contact details, payment, guest list or order basket is collected.
- English and the existing current-browser target remain. Automated proof uses the installed Chromium browser, with explicit touch emulation; this does not establish real-device or screen-reader coverage.

## Decisions of the orchestrator

The orchestrator released the following decisions on **2026-10-13** after reading the specification, plan, independent review, brief and affected navigation owners. The developer records the decisions from the orchestrator's message. This first release was a design and scope release; subsequent built-screen inspection and acceptance are attributed separately below. No record claims that the user inspected or approved a screen.

| Item | Released decision and reason | Other way considered |
|---|---|---|
| U1 | Regular grid of nine square photographs. The brief permits it, existing home/story pages use grids, square crops fit, and reading order equals keyboard order after filtering. | Masonry. |
| U2 | Dedicated `/order/` page. It matches existing routes, offers ordinary links and browser Back, and needs no phone focus trap. | A modal. |
| U3 | Filters and native disclosures with always-visible titles. This selects the tap side of the brief's “hover or tap” and works with keyboard and touch. | Hover-led disclosure instead of explicit native activation. |
| U4 | Deliver the honest unknown state and keep real directions, call and calendar actions unmet and owed. Explicit unknown facts in one content module preserve the local-map choice without inventing values and give a clear owner for later content/action work. | Omit the three actions. |
| U5 and S03-SPEC-R1 | Keep the three-step preview and focus a described result heading at Finish, with the standing notice and no extra live region. This supplies a defined completion focus/notification without duplicating its announcement or implying a real booking. | A live region with focus left on the control. |
| U6 | Release the link order, menu below 1024 pixels, no-script wrap and outlined hero action, with the words “Try the booking preview.” It keeps the preview honest in ordinary English and fits the existing navigation pattern. | “Book a Table” was refused because it promises a service that does not exist. |
| U7 | Use the specified words and nine existing local photographs, marked as samples. They fit the sample-content scope and reuse credited assets without claiming actual people or cafe services. | Wait for final cafe photographs and words, which remain outside this run. |
| Plan and weights | Release the four deliverables and their proposed weights, with separate proof, review, close and integration. They divide the agreed outcomes into bounded work with visible verification. | Repartition or reweight the deliverables; no such change was needed. |
| A7 clarification | Say that controls needing successful script initialization stay absent. This preserves native no-script disclosures and the intentionally visible disabled visit actions. | Leave the broader wording, which could imply disabled actions must disappear. |
| Gallery proof order | T2 prepares reset; T3 proves it on actual open disclosures. This prevents an empty-population assertion from counting as integration proof. | Treat reset as fully proved in T2 before disclosures exist. |
| Melbourne midnight | Reuse step 1's date validation on each Next and Finish; return to Date & time with its existing error and date focus, retaining time/service. One fixed-clock boundary test and one Review-recovery test are enough because this preview sends nothing and the edge has a small consequence. | A test matrix from both later steps. |
| Roadmap correction | Remove the stale embedded-map-provider option and regenerate HTML. The owner's earlier local-map choice already settled it. The list has no earlier settlement marks, so leave its other entries as they are. | Leave an already-settled provider choice listed as open. |

### U1 — A regular gallery grid

**Selected:** a row-major grid of nine square photographs, one column on a phone, two from 640 pixels and three from 1024 pixels. Use the existing maximum content width, poster heading, rounded frames, restrained grain and alternating mint/orange offset accents. Keep the source order when filtering; do not densely repack or reorder tiles with CSS.

**Why and consequences:** the home drinks and social images, and the story portraits, already use regular grids. Equal rows make the visual and keyboard order easy to follow. One column preserves caption room and touch targets on a phone. The alternative is masonry: it accommodates varied aspect ratios but complicates the relationship between reading order and visual order, particularly after filtering. No masonry dependency is warranted by the current asset set.

### U2 — A dedicated order and booking page

**Selected:** `/order/`, titled “Order / Book preview,” with an explanatory introduction, a persistent preview notice and three steps in one column. On a wide screen the introduction may sit beside the step card; on a phone it sits above it. The steps are “1. Date & time,” “2. Service,” and “3. Review.” Mark the current step in text and with `aria-current="step"`; the step labels are progress, not links that skip validation.

**Why and consequences:** a route fits `/menu/` and `/story/`, offers a normal link from every page, and allows the browser's Back navigation. It avoids a nested scrolling area and focus trap on phones. Each Next/Back transition puts focus on the new step heading. The alternative is a modal, which keeps the previous page behind it but needs opener restoration, a focus trap, dismissal behaviour and more small-screen handling. No modal is proposed for this flow.

### U3 — Filters and disclosure overlays

Above the grid, show wrapping pill buttons “All,” “Coffee,” “Food,” “Space,” and “People.” The selected button has an obvious filled treatment and `aria-pressed`; all buttons remain normal Tab stops and activate by Enter, Space, click or tap. “All” is initially selected. A polite status names the selected category and result count. Changing a filter keeps focus on its button, hides nonmatching cards from layout and the accessibility tree, and closes the cards' open disclosures. Each offered category has content; no search, combined filters or artificial empty state is proposed.

Each tile has an always-visible title strip and disclosure marker at its lower edge. A native `details`/`summary` expands a short description over the bottom of that image. Click, tap, Enter or Space opens and closes it; another tap on the same title closes it. Multiple disclosures may stay open until the filter changes. Tab continues through the document; these are inline overlays, not modal lightboxes. Hover/focus changes the frame treatment; the description uses the same explicit disclosure on every input method. This selects the brief's tap-overlay option. The strip is at least 44 pixels high, has high-contrast text on a solid dark surface, and its focus ring is not clipped. Text must remain readable without cropping at 200% zoom.

Without scripts, show all photos and keep native disclosures usable. Filter controls become available only when filtering has initialized successfully. An image loading failure must leave its text alternative and title/description available.

### U4 — Visit information with honest unavailable actions

Use a two-column layout on a wide screen, stacked on a phone: details and actions first, the map card second. Use definition lists for “Address,” “Opening hours,” and “Phone,” each with “To be confirmed.” Below, show “Parking,” “Public transport,” and “Nearby landmarks,” each with “Details will be added when the location is confirmed.” Keep these visit facts as explicit unknown values in one content module; the page derives its unknown presentation from those values. A later update changes that content and the three action implementations, without searching markup for facts. Build no speculative provider or fact-management framework. Do not invent a tram route, street, opening status, email, landmark or location.

Draw the map card in local CSS/SVG, with a Teekaapi pin, abstract paths and no coordinates, street names or scale. Label it visibly “Illustrative map — location to be confirmed.” It is a schematic, not a claimed geographical position.

Keep the three requested actions visible: “Get Directions,” “Call,” and “Add to Calendar.” **Use disabled native buttons while the required facts are unknown**, with nearby text “These actions will be available when the cafe confirms its visit details.” No fake address, `tel:` value, maps search for an unverified business, calendar download or geolocation request is allowed. The label and explanation remain readable even though disabled controls are not Tab stops.

**Candidate-screen decision of the orchestrator, 2026-10-13:** put that explanation directly before the three buttons in reading and visual order. Give the unavailable state no fill, a dashed border, the ordinary full-contrast text colour, a not-allowed cursor and no hover or press effect in either theme. Preserve the native disabled state, labels, order and minimum 44-pixel height. Reason: the filled controls looked usable, and visitors need the explanation before trying them. Other ways: retain the fill, refused because it obscures the unavailable state; remove the buttons, already refused under U4. The orchestrator inspected the developer's captures, not the user. This change was held until the first candidate read ended and its responses were released; the corrected captures were subsequently accepted as recorded under A11 below.

The orchestrator released this acceptance split: this run proves the honest unavailable state; actual maps, telephone and calendar actions are **not met** until real details and calendar semantics are supplied. No close may call them passed. The plan's “Owed to the user” table names that follow-up. The alternative is to omit the actions completely, which conceals the intended affordances. The settled map-app behaviour remains the required outcome once a confirmed destination exists.

### U5 — Preview steps, validation and result

Keep this notice visible through every step and the result: **“Preview only. Nothing is sent or saved. This is not a booking or an order.”** Introduce the service choices as examples: “Try the steps for a pickup or a table reservation. Services and availability are still to be confirmed.”

1. **Date & time.** Empty, labelled native date and time inputs. Both are required. A date must be today or later in Melbourne; a time is any valid minute of the day. Explain “Times are shown for Melbourne. This preview does not check opening hours or availability.” The date boundary is computed in `Australia/Melbourne`, not the visitor's timezone, and rechecked when advancing. No sample opening window or real slot availability is implied. Date-only validation deliberately does not claim to validate same-day availability or daylight-saving transitions.
2. **Service.** Two native radio choices, initially unselected: “Pickup” (“A sample pickup flow. No food is ordered.”) and “Dine-in reservation” (“A sample table request. No table is reserved.”). Require a choice. Do not add catering, which is not a confirmed service. “Back” retains the date and time.
3. **Review.** Show the chosen date, time labelled Melbourne, and sample service. “Back” retains choices and lets the visitor change them. “Finish preview” changes this same third step to a result, never a fourth numbered step. Reveal and focus a programmatically focusable level-two heading **“Preview complete”**, described through `aria-describedby` by **“Nothing was sent or saved. No booking or order was made.”** Keep the standing notice visible and add no extra live region. “Start again” clears all choices and returns focus to the first heading.

Next must not advance on invalid input. Associate visible errors with their inputs, mark them invalid, and focus the first invalid input. Errors: “Choose a date.”, “Choose today or a later date in Melbourne.”, “Choose a time.”, and “Choose a service.” Native constraints also reject malformed dates and times. A successful correction removes stale errors. Reuse step 1's one date validation on each Next and on Finish. If the date becomes past at Melbourne midnight, return to Date & time, show its existing date error and focus the date input; keep the time and service. Verify this with one fixed-clock boundary test and one recovery from Review, without a matrix of both later steps. No client input becomes HTML markup.

**Candidate-screen decision of the orchestrator, 2026-10-13:** each error line has a warning icon from the installed icon set before its unchanged words, with semi-bold text. Preserve input association, invalid marks and focus. Reason: a plain line of small text did not make the failed Next action clear enough. Leaving it plain was refused. The icon uses the ordinary text colour in both themes; no accent or colour-only meaning is introduced. The icon is decorative to assistive technology because the associated words already convey the error. Show the new date/time and service error states before close and include them in the independent correction read.

Use local fields and `type="button"` controls without a submitting form, so Enter, a script failure or a double click cannot send a GET/POST. Reveal the interactive controls only after their handlers are installed. Without scripts or if initialization fails, retain the notice, an explanation of the three steps and “Turn on JavaScript to try the preview. Nothing can be sent from this page.” No broken Next control is shown. A reload initializes empty values; no cookie, storage entry, URL value, beacon or provider request records the choices. Ordinary local asset requests and the established theme preference are not booking data.

### U6 — Routes, navigation and the home action

**Later decision of the orchestrator, 2026-10-13:** after inspecting the real built screenshot, release wrapping the header's outer row when its contents do not fit, with controls together, unchanged DOM/keyboard order, the 1024-pixel breakpoint and no-script wrap. Reason: fix the fault in its owner and respect the visitor's text size. Other way: shrink the logo or controls; refused because it works against that setting. Preserve ordinary-size presentation on home/menu/story at 375, 768 and 1280 pixels, and add a permanent enlarged-text test. This fault existed in the shared header before this slice and was found by this slice's text-size simulation, which is not browser-zoom evidence. This records orchestrator inspection, not user inspection.

Keep the logo as the way home. In header and footer, use this order: “Menu,” “Our Story,” “Gallery,” “Visit Us,” “Order / Book.” Preserve the current-page underline and `aria-current="page"`. Use the existing menu panel below 1024 pixels so five links fit without squeezing the theme control at tablet widths; from 1024 pixels show the links inline. Without scripts, show wrapping links at every width. Keep the theme control and its keyboard order. The footer links wrap within their container.

Add **“Try the booking preview”** beside “View Menu” in the home hero, stacked if needed on a phone. Both are ordinary links; the new link goes to `/order/`. Its words make the preview status apparent before navigation. Preserve the primary action's prominence; use an outlined secondary treatment with the existing readable foreground and focus tokens. The alternative is “Book a Table,” which suggests a real service that does not exist. If the released words break the hero at 320 or 375 pixels, show the actual screen to the orchestrator for a new decision; do not shorten the words independently.

The orchestrator made a further U6 decision on **2026-10-13**, after inspecting the enlarged-text home screen: add `overflow-wrap: anywhere` only to the hero heading. The heading already clipped “Melbourne” before this slice at 375 pixels with the root font doubled. Reason: keep the complete words readable while retaining the visitor's text size, with one declaration in an already changed component and no ordinary-size appearance change. Other ways were a smaller heading or leaving clipping unmet; both were refused. Add a bounded regression in the existing home test and show the corrected candidate screen. This is text-size simulation, not native browser zoom. For subsequent enlarged-text discoveries, consult on components this slice changes or adds; leave faults in unchanged menu/story content for later work and name them in the plan and at close.

On **2026-10-13**, the orchestrator released the same overflow wrap for the order page's h1, with the same reason and refused alternative as the hero correction. It also released moving the decorative “Teekaapi.” word into the SVG at x 240, y 340, size 36 in the 480-wide viewBox. Reason: that word belongs to the drawing and scales with it; the meaningful figcaption remains normal text that enlarges with the visitor's setting. Preserve the font family, words, colours and pin; verify the built heading font and no pin overlap at ordinary phone/desktop sizes, with a bounded enlarged-text bounds test. Other ways, wrapping the HTML overlay or placing the word below the drawing, were refused because they risk pin overlap or unnecessarily alter the composition. The orchestrator also released this same wrap for any later overlong heading or label on a newly added page only when words, declared size and ordinary appearance stay unchanged; list each actual use at the candidate checkpoint. Other screen decisions still require consultation.

### U7 — Page words and sample photographs

| Page | Script line | Heading | Introductory line |
|---|---|---|---|
| Gallery | A little atmosphere | Gallery | Coffee, food and moments around the table. |
| Visit | Find your way | Visit Us | The details for your next visit, as soon as they are confirmed. |
| Order | Make a little plan | Order / Book preview | Try the steps for a pickup or a table reservation. Services and availability are still to be confirmed. |

Gallery note: “Sample photographs and captions — a taste of the atmosphere.” Use these already-local, credited assets; the titles and descriptions are sample content. The People category shows hands at work, never identifiable guests or named staff.

| Category | Existing image | Title | Description |
|---|---|---|---|
| Coffee | `hero-espresso.jpg` | The first pour | Espresso flows from the machine into a waiting cup. |
| Coffee | `drink-filter-kaapi.jpg` | Filter kaapi | A frothy tumbler with a little South Indian soul. |
| Coffee | `drink-iced-coffee.jpg` | Over ice | Coffee and milk take the cool route. |
| Food | `food-dosa.jpg` | Crisp and golden | A folded dosa with chutneys on the side. |
| Food | `social-dosa-leaf.jpg` | Around the leaf | Dosa, chutney and sambar, ready for the table. |
| Space | `social-booth.jpg` | A quiet corner | Round tables and a long bench invite a pause. |
| Space | `story-room.jpg` | A little green | Green vines and timber bring warmth to the room. |
| People | `story-hands.jpg` | Made by hand | A hand holds the cup for the next pour. |
| People | `social-pour.jpg` | The finishing touch | Steamed milk meets coffee. |

Use crop-accurate alternative text from inspection of the files, retaining the established wording where its crop matches. Sample entries carry `sample: true`. No new claim about a real person or the cafe is introduced.

## Technical approach and commands

Use the installed pins: Astro 7.3.8, Tailwind CSS and its Vite plugin 4.3.3, TypeScript 6.0.3, Playwright 1.64.0, axe 4.13.0 and Phosphor 2.1.1. Reuse `BaseLayout`, the theme, `SectionHeading`, existing image processing and `site.ts` navigation. `Button.astro` currently owns a link; do not make that link pretend to be a disabled visit action or a preview button. There is no reading map or named foundation/peer set; inspect existing owners and pinned dependencies for each material choice.

Run from the repository root with the explicitly selected runtime:

```sh
export PATH="/Users/techakayy/.nvm/versions/node/v24.20.0/bin:$PATH"
pnpm --dir packages/app run check
pnpm --dir packages/app run build
pnpm --dir packages/app exec playwright test tests/gallery.spec.ts
pnpm --dir packages/app exec playwright test tests/visit.spec.ts
pnpm --dir packages/app exec playwright test tests/booking.spec.ts
pnpm check
pnpm --dir tooling/agents run validate
pnpm roadmap:check
pnpm --dir tooling/agents run progress --write
pnpm --dir tooling/agents run progress --check
pnpm --dir packages/app exec astro preview --host 127.0.0.1 --port 4331 --ignore-lock
```

Delivery uses Node 24.20.0, as declared by `.nvmrc` and corrected by the orchestrator on 2026-10-13. The earlier pre-delivery check used Node 24.11.0; the plan preserves that evidence separately. Commands receive execution time limits as specified in the plan; the server is stopped after each review session. Focused browser commands run only after a current build, and the configured runner owns its separate test server. Root `pnpm check` includes a fresh app build and browser suite.

Product code stays in `packages/app`: pages in `src/pages`, small components/scripts in their existing folders, typed sample data in `src/content`, and repeatable browser proof in `tests`. Plans and progress stay here. No generated output is edited directly. Use the existing Astro/TypeScript style, for example the `Moment` entries in `src/content/home.ts`: typed image metadata, descriptive alternative text and `sample: true`.

## Acceptance and verification

These sharpen the roadmap's acceptance. The [plan's close record](tasks/plan.md#completion) gives each actual state and its evidence; the definitions here do not themselves constitute proof. The orchestrator released U4's acceptance split and related owed work on 2026-10-13.

| ID | Acceptance the run can meet | Required evidence |
|---|---|---|
| A1 | Root checks pass with the existing behaviour preserved and a static build of every route. | `pnpm check`, including type checking, the app build and the intended browser tests; count executed tests. |
| A2 | The gallery shows the approved nine images, all four categories, captions and alternatives in a stable responsive grid. | Content and layout assertions at 375, 768 and 1280 pixels; inspect images and credits. |
| A3 | Each filter selects exactly its category; All restores every image. Disclosures open and close by keyboard and touch, and filtering resets them without losing focus. | Repeat mixed filter selections; Tab/Enter/Space interaction; a `hasTouch` browser context using actual tap events; hidden cards excluded from focus and accessibility. |
| A4 | Visit facts and travel notes are explicit unknown values in one content module; the page derives their presentation, the locally drawn labelled map loads no external content, and unavailable actions explain why. | Inspect the content owner and its page consumer; browser assertions for the approved text, button states and request boundary; visual review of both themes. Live directions/call/calendar remain unmet and owed. |
| A5 | Date/time → service → review works in that order, handles required and invalid inputs, retains values on Back, focuses the described result heading on Finish, and resets with first-step focus on Start again. | Exercise real Next/Back/Finish operations by keyboard and touch for both services, invalid-to-valid correction, result focus/description and reset; one fixed-clock Melbourne boundary test and one recovery from Review with retained time/service. |
| A6 | The warning remains visible in every step and result. Nothing is sent or saved, and no live booking/order is claimed. | Observe requests and browser storage through the complete flow, Enter, repeated Finish, reset and reload; assert result words, empty reloaded state and unchanged URL. |
| A7 | Without scripts, gallery images/disclosures, visit content and the preview explanation remain usable; controls that require successful script initialization stay absent. | Isolated no-script browser contexts and normal keyboard interaction with native disclosures; disabled visit actions remain visible. |
| A8 | All pages work in light/dark mode with no page overflow at 375, 768 and 1280 pixels; a 320-pixel inspection and the explicitly accepted enlargement substitute catch narrow-layout risks. | Browser layout and axe assertions in both themes; focus visibility/order including Finish to the described result heading and Start again to the first step, touch targets, reduced-motion checks and screenshot inspection. Doubled text, CSS zoom and the specified viewports are the accepted substitute; native browser zoom remains not executed. |
| A9 | Shared navigation and the new home action reach the real pages, mark the current route, and remain usable at tablet widths. | Update the existing navigation/focus tests for the approved links and breakpoint; inspect all affected pages. |
| A10 | No page or interactive flow automatically contacts another host; styles use theme tokens and samples stay clearly identified. | Extend the existing privacy/token checks, inspect content entries, and observe the preview workflow; no live-service mock is counted as a real booking. |
| A11 | The orchestrator sees and accepts the actual built screens and required states; independent candidate review has no unresolved blocking finding. | Phone and desktop screenshots in both themes for every added/changed screen, plus chosen filter, open disclosure, each booking step, invalid state and completion notice; attributed review and orchestrator release. |

For A11, changed shared chrome affects home, menu, story and styleguide as well as the three new pages. Screenshot artifacts are delivered in the conversation, never kept as repository evidence. The plan records actual inspection as dated sentences. The tests exercise real local browser behaviour; touch is emulated and does not claim a physical phone. No live service is required for this static preview.

On **2026-10-13**, the orchestrator accepted A8's substitute after inspecting the developer's captures. Reason: a narrow viewport in CSS pixels exercises the static page layout produced by desktop zoom, while the doubled-text case supplies the harder text-layout check with retained tests. The other way is a native browser-zoom check, which remains not executed and is never called passed. Physical-phone and screen-reader checks remain not executed. The orchestrator also accepted the gallery states, booking steps and standing notice, hero, shared navigation, header and heading wraps, and SVG map word shown in the candidate captures. A11 then remained open for the two corrected screen states and their independent read. The home Gallery underline was accepted as capture hover, verified by its absent current-page attribute and real pointer movement; the alternative of correcting a current-page mark was unnecessary because no such fault existed. No statement here attributes those inspections to the user or releases close.

On **2026-10-13**, the orchestrator inspected and accepted all eight developer correction captures made with the installed Chromium after the host snapshot tool timed out: visit at 375 and 1280 pixels in light/dark, and date/time and service errors at 375 pixels in light/dark. Reason: the actions now visibly read as unavailable with their explanation before them, and the errors have the required icon and weight. It also read the independent correction PASS with no required defect and declared A11 met for every screen and the candidate reviews ended. The alternative of another product correction/read was not needed because no defect remained. The acceptance is the orchestrator's inspection of the developer's captures, not an inspection by the user; close and integration remain separate releases.

## Boundaries and open decisions

- **Always:** reuse theme and native controls, keep meaningful alternatives and sample marks, test observable transitions, and retain unknown facts honestly.
- **Released:** U1–U7, the specification, plan and weights, and the first review's responses, with the conditions recorded above. A clean replacement disposition releases the slice start and build without another stop.
- **Release first for new work:** every response to a new review finding; any departure from an accepted decision or unresolved screen choice; any new dependency/download; an outside action; close and integration.
- **Never in this run:** collect or submit booking data, invent cafe facts, change reusable instructions/checks, publish, push, open a pull request, or implement a provider.
- **Out of scope:** real booking/ordering, payments, catering promises, CMS, analytics, newsletter/social accounts without supplied details, geolocation, real-content replacement and launch. Existing theme storage remains the owner's accepted exception to the site's broad “stores nothing” wording; booking choices add no storage.

The [accepted weights](tasks/plan.md#deliverables-and-accepted-weights) govern progress. The cafe's missing facts and the blocked live actions are named in the [owed-work table](tasks/plan.md#owed-to-the-user). Close and local integration are complete; this one-slice run ends without a successor or Handoff. The unavailable live actions remain not met and owed.
