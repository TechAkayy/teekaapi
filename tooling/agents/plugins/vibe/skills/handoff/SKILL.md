---
name: handoff
description: Hand current work to another session - bring the owning records up to date, have an independent reviewer confirm that a cold reader can continue from them, then give the user a short prompt.
---

# Handoff

Use this skill when the user types its name. Inside a [Lets Vibe](../lets-vibe/SKILL.md) run, use it also when the user asks in plain words for a handoff, a handover or a prompt to continue the work in another session. Outside a Lets Vibe run, plain words do not start it. In [a chain of slices](../lets-vibe/references/contract-core.md#a-chain-of-slices) that the user authorized, the session that closes a slice uses it for the next slice of the range with no request; in orchestrated mode it waits for the orchestrator's word. The receiver is a new session, of this agent or of a different one, that has the repository but not this conversation.

A handoff has 3 parts, in this order: update the records, check them with an independent reviewer, then write a short prompt. The records hold the detail. The prompt only tells the receiver where to start. A long prompt is a sign that a record is incomplete; correct the record and keep the prompt short.

This skill does not start, close or advance work. It does not start the next slice. In an authorized chain it starts the receiver, as part 5 says; in [orchestrated mode](../lets-vibe/references/orchestration.md#a-chain) it starts none, because the orchestrator does. It commits, pushes or changes mode only under the authority that the applicable `AGENTS.md`, the [execution-mode rules](../lets-vibe/references/contract-core.md#execution-modes) and the current agreement already give.

## 1. Establish what is handed over

Read the applicable repository instructions, the `plans/project-state.json` pointer and the [project-pointer rules](../lets-vibe/references/requirements-alignment.md#project-pointer). Identify the work: the slice or task, its branch, its execution mode and scope, and the documents that own it under [slice-document reuse](../lets-vibe/references/requirements-alignment.md#reuse-the-slice-documents). For work that is not a slice, use its existing task record or the files it changes.

If the user did not say what to hand over and more than one piece of work is open, ask which one. Do not combine two pieces of work in one handoff unless the user asks for that.

## 2. Bring the records up to date

Everything the receiver needs must be in the repository records, not only in this conversation. Update the existing owners; do not create a handoff file.

Check each of these and correct the owner where it is missing or old:

- **Scope and decisions** — the spec holds the accepted scope and the decisions the user made in this session, with the reason for each.
- **Current state and next action** — the implementation plan has one clearly named section that says what is complete, what is in progress, what is on hold and why, and the next action. Replace an older state section; do not add a second one beside it.
- **Authority** — the mode and scope in the pointer, what the user approved, what is not yet approved, the next review checkpoint and every stop the user named.
- **Open questions** — each one with the person who must answer it.
- **Evidence and limits** — which checks passed, failed or did not run, and the known limits, written under the [record rules](../../../../../../AGENTS.md#records): a test that stays in the repository proves a behavior, and a check on real services is one dated sentence. The plan says the state in words. A commit or a branch of this repository goes in the prompt of part 4, not in a record.
- **Task state and report** — the task statuses follow the [in-progress rule](../lets-vibe/references/progress.md#keep-the-in-progress-state-true). Generate the progress report again and run its freshness check.
- **Things outside the repository** — a running process, a scheduled job, a temporary resource to clean up, a step that only the user can do. Record where each one is. In a chain, name the task of the host that starts the receiver, by the name that the session gives it. Do not record a secret.

State the working-tree position truthfully in the plan: which changes are committed and which are not. A different checkout cannot see uncommitted work. Commit only when the current agreement permits it; if it does not, tell the user that the handoff includes uncommitted files and name them.

Write the spec, the plan and the task list for the agent that continues the work: exact and complete, with the evidence and technical detail that the agent needs, and without a commit or a branch of this repository. Do not simplify them. Simplified Technical English applies only to the progress state that the report prints and to the prompt in part 4, following the [writing rules](../progress-report/references/simplified-technical-english.md).

## 3. Check the records with an independent reviewer

The writer of the records cannot test them, because the writer knows what they mean. Invoking this skill authorizes one bounded independent reviewer for this check, without another request. Use [Review Vibe](../review-vibe/SKILL.md) and the assignment guidance in [participant coordination](../lets-vibe/references/participant-coordination.md). Reuse the reviewer that already serves this work when there is one.

Give the reviewer the checkout, the candidate with its uncommitted files, and the draft prompt from part 4. Do not give the reviewer a summary of this conversation; the purpose is a cold read. Ask the reviewer to start from the draft prompt and the repository instructions only, and to answer these questions from the records:

1. What is the work, and what is its accepted scope?
2. What is complete, what is in progress, and what is on hold and why?
3. What is the next action, and is the receiver permitted to do it without a new approval?
4. Which mode applies, and where must the receiver stop?
5. Which questions are open, and who answers each one?
6. Where is the evidence, and which checks did not run?
7. Is there something the receiver must know that no record states?

The reviewer returns PASS, or FIX with each gap: the question it could not answer, the record that must hold the answer, and any statement in a record that the files contradict. The reviewer does not edit the records.

Correct each confirmed gap in its owning record, then ask the same reviewer to check the changed parts. Do not answer a gap by adding text to the prompt. Stop when the reviewer returns PASS, or when the user accepts a named remaining gap.

If the user tells you to skip the reviewer, skip it and say so in the result. If no independent reviewer is available, say that the check did not run. Do not call your own read an independent check.

## 4. Write the short prompt

Write the prompt for the receiver after the records pass. Use Simplified Technical English. Put the prompt in one fenced block so that the user can copy it.

The prompt has a maximum of 8 lines and about 120 words. It contains only:

1. The work to continue: the slice identifier and name, or a short name of the task.
2. The branch and, when the receiver needs it, the commit. The prompt is the only place for them.
3. Where to start reading: the repository instructions, the pointer, and the plan section that holds the current state.
4. The mode and the next checkpoint, in one line.
5. The first action.
6. A thing that is not in the repository, if there is one: a step the user must do, or a decision the user gave only in conversation and that cannot be recorded.

Do not put these in the prompt: long identifiers other than that commit, lists of evidence or files, a history of the session, a copy of a rule or decision that a record already states, or instructions that repeat `AGENTS.md`. If the prompt needs one of these to be understood, a record is incomplete; return to part 2.

Example:

```text
Continue <slice ID> — <slice name>.
Branch: <branch name>.
Read AGENTS.md, then plans/project-state.json, then "Current state and next action" in plans/<slice ID>/tasks/plan.md.
Mode: supervised. Stop for my approval before the plan group.
First action: show me the spec changes that I asked for.
I must sign in to the provider myself when you reach the sign-in check.
```

## 5. Report the result

Tell the user, in a short message:

- which records you updated;
- the reviewer result, or that the check was skipped or did not run;
- which changes are committed and which are not;
- any gap that remains, with its owner.

Then give the prompt. Do not continue the handed-over work after the handoff unless the user asks.

**In an authorized chain.** After the commit of the handoff, start the receiver by the tool of the host. [One link of the chain](../lets-vibe/references/contract-core.md#a-chain-of-slices) owns the steps of that start and what to do when it is not possible: where the host has no such tool, or a step fails, give the prompt to the user as above and say what failed. Start no receiver outside an authorized chain; a person starts it. In orchestrated mode, return the prompt to the orchestrator and start no receiver: [the orchestrator starts the next pair](../lets-vibe/references/orchestration.md#a-chain).
