---
name: walkthrough
description: Walk the user through a part of the project that they choose - a design, a flow, a change, a plan or a decision - in Simplified Technical English with a small number of visuals.
---

# Walkthrough

Use this skill when the user types its name. Inside a [Lets Vibe](../lets-vibe/SKILL.md) run, use it also when the user asks in plain words to be walked through something, or asks for an explanation they can follow step by step. Outside a Lets Vibe run, plain words do not start it. The result is an explanation in the conversation. It helps the user understand; it does not change the work.

A walkthrough reads and explains. It does not change files, task state or Git, and it does not start or advance delivery. It settles no decision for the user. If you find a defect or a gap while you prepare, report it separately at the end.

## 1. Ask what to walk through

Ask before you prepare, unless the request already answers these 3 questions. Ask them together, in one short message, and give your best guess for each:

1. **Subject** — what the user wants to see. Offer 3 or 4 subjects from the current work when that helps, for example “the scope of the current slice”, “how a sandbox upgrade works”, or “what changed in the last commit”.
2. **Purpose** — to decide something, to review something, or to learn how something works. The purpose selects what you show.
3. **Depth** — the short overview, or each step in detail.

Do not ask about things that you can find in the repository. If the answer changes the subject a lot, confirm the new subject in one line and continue.

## 2. Collect the facts

Read the owners of the subject: the spec, the plan, the code, the flow document or the commit. Follow the applicable repository instructions for the reading route. Keep these 3 things apart, and tell the user which one each statement is:

- what the design intends;
- what the code does now;
- what a test or a live check showed.

When you cannot establish a fact, say that it is unknown. Do not fill a gap with a guess.

## 3. Build the walkthrough

Use this structure:

1. **The short answer** — 1 or 2 sentences that give the main point first.
2. **The map** — one small visual or a list of the stops, so that the user sees the full path before the detail.
3. **The stops** — 3 to 7 stops in the order the user must understand them. Each stop has a short heading, 2 to 4 sentences, and a visual only when it helps.
4. **The recap** — a maximum of 3 lines: what to remember, what is still open, and where to read more, with links.

For a purpose of “decide”, end the last stop with the choice, the options and their results. Give your recommendation as a recommendation.

### Language

Write in Simplified Technical English, following the [writing rules](../progress-report/references/simplified-technical-english.md). Explain each technical name the first time you use it. Use one name for one thing through the full walkthrough. Give one real example when a rule or a mechanism is not clear without one.

### Visuals

A visual is useful when it shows a structure that words show badly. Use a small number of visuals; if a sentence does the work, do not add a visual.

| The stop shows | Use |
|---|---|
| A sequence of steps or states | A flow with arrows |
| A comparison of options or of before and after | A table |
| Parts that contain other parts | A tree |
| Events in time order | A timeline |
| One fact, one rule or one result | A sentence, with no visual |

Rules for each visual:

- A maximum of 1 visual for each stop, and usually fewer visuals than stops.
- A maximum of about 9 boxes or rows. If you need more, divide the stop.
- A label has a maximum of 4 words. Use the same names as the text.
- Put one sentence below the visual that says what the user must see in it.
- No decoration: no color, icon or shape that carries no meaning.
- Show only what the collected facts support. Mark a planned part as planned.

Use the best visual form that the session can show: a diagram tool when one is available, otherwise a Markdown table or a plain text diagram in a fenced block. The same rules apply to each form.

## 4. Present it

For the short overview, give the full walkthrough in one message.

For each step in detail, give the short answer and the map first, then one stop at a time. After each stop, stop and let the user choose: continue, go deeper on this stop, or skip. Answer a question at the stop where the user asks it, then return to the path.

Keep each stop short enough to read on one screen. Do not repeat a stop in the recap.

## 5. Close

End with the recap. If you found a defect, a contradiction between records or an unknown that matters, list it after the recap under “Found on the way”, with the place where it is. Do not correct it in this skill.

Keep the walkthrough in the conversation. Save it to a file only when the user asks, and then agree the location first.
