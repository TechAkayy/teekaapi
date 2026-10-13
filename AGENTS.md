# Agent Guidelines

When the user replies "cool" to a recommendation, treat it as approval to apply that recommendation and continue to the next step within the agreed scope. Do not ask for the same approval again.

## Scope and context

This repository holds the website of Teekaapi, a South Indian cafe in Melbourne with specialty coffee and a fusion-food menu. It is a pnpm workspace. The [README](README.md) is the site brief: the design concept, the palette, the typography, the page structure, the image rules and the interactions. The [roadmap](plans/roadmap.md) delivers the site in slices. Product code goes in `packages/`, one folder for each package; the site is `packages/app`, which the first slice creates, and a product change touches only that folder unless its plan says more. The agent skills and their tooling are in `tooling/agents`; one-off tooling goes there or in `plans/`, not in a product package.

Keep plans and research in `plans/`. Read the plans and implementation relevant to the current task. The user's current instructions take precedence over older plan or workflow wording.

Consult `plans/project-state.json`, when it exists, for the selected slice and links to its documents, the project roadmap and the reading map; verify the selection against the current task.

For product planning, design, implementation and review, use the reading map linked by `documents.readingMap` in the project pointer, when the project has one, to select relevant decisions and research sections. Read those sections and their necessary context before making dependent decisions; expand into linked sources where the task needs contract evidence. Routine work unrelated to product architecture does not require rereading the entire baseline.

Reuse the capabilities supplied by the project's selected dependencies and existing owners before introducing another implementation.

Before settling a material product or architectural solution, assess the foundation and primary peers that the reading map names, when it names any. Select relevant evidence by the responsibility being designed; inspect the relevant mechanisms before recommendations that depend on them. Apply this during planning, implementation and review, including when a new design question or overlapping behavior emerges. Reuse current applicable evidence rather than rereading every peer for routine changes. Verify interfaces against the project's selected dependency versions; distinguish accepted project decisions, verified behavior, research suggestions and newer upstream behavior. Explain a necessary departure in the owning design or plan.

Carry the relevant source links and their concrete design or acceptance consequences into the existing task plan or review. Keep unresolved compatibility questions visible there. On resumption, recover that bounded context and check for relevant changes; avoid copying whole research reports or creating a separate reading log.

## Keep solutions proportional

Match the solution to the accepted outcome and the consequences of the change. Optimize for the simplest structurally sound solution, not the smallest diff. Investigate a broader architectural problem when evidence warrants it. Avoid speculative abstractions and unrelated cleanup.

Fix root causes in the component responsible for them; avoid stacking workarounds or creating parallel implementations that preserve accidental behavior.

When changing a contract or documented behavior, update its directly affected consumers and documentation within the same change.

Before renaming or removing an identifier, check whether persisted data, public interfaces or independently updated consumers rely on it. Handle any required compatibility or migration within the agreed scope; do not assume an internal-looking name is private.

Change generated artifacts through their owning source and generator. Regenerate affected outputs rather than hand-editing them.

Keep upstream dependency version updates distinguishable from the project's own behavior changes. When an update requires related adaptations, explain the dependency and review the changes together.

Do not replace a model identifier merely because it is unfamiliar. Verify it against the configured provider or current authoritative documentation before proposing a correction, and preserve the user's explicit model choice unless they authorize a change.

Correct execution or communication mistakes directly. Change reusable instructions or tooling only when evidence shows a defect in them; an agent's failure to follow an existing rule is not by itself a reason to rewrite that rule.

Stop when the agreed acceptance criteria are met. Additional investigation, checks or cleanup must address a concrete unresolved requirement or concern within the agreed scope.

Before substantially rewriting a file, read it in full and inspect the directly affected references or consumers. A rename, refactor, format change or request for brevity does not authorize discarding substantive meaning. Preserve requirements, examples, failure handling and rationale unless their removal is within the user's authorized scope, and explain intentional removals in the review.

After a substantial rewrite, compare the complete result with the original to check for unintended omissions and loss of operational detail. Explain where intentionally moved content now lives, and raise unresolved questions about substantive removals before treating the rewrite as complete.

When fixing an existing workflow, preserve its authored step structure, numbering and operational boundaries unless the user authorizes a redesign. Do not treat a targeted correction as permission to merge or remove steps.

Keep `AGENTS.md` limited to durable repository-wide guidance. Rules have three levels: this file holds the rules for everybody; the delivery workflow and its working style are in Lets Vibe and apply to a person who starts it; one person's preferences stay on that person's machine. Put slice- or phase-specific scope, acceptance criteria, migration steps and temporary checkpoints in the relevant plan. Put workflow procedures in the skill that owns them. Keep reusable guidance portable.

Add a nested `AGENTS.md` only when a directory has durable instructions distinct from its parent. Keep those instructions specific to that subtree, avoid repeating parent rules, and link to the relevant architecture or reference documentation.

Keep each durable rule or fact in one maintained location and link to it elsewhere. Local instructions should add relevant constraints rather than duplicate architecture documents, package READMEs or parent instructions.

Document verified behavior. Check API names, commands and examples against the implementation or authoritative reference, and distinguish planned behavior from what exists. Preserve useful explanations of decisions and non-obvious constraints without maintaining prose copies of implementation details.

## Records

Git is a tool. The code, the plans and the Git history itself are the source of truth. Do not write a commit or a branch of this repository into any file, and do not write that something was “committed in” one. Name work by what it is, for example “the slice start”. Give a branch and, when needed, a commit in the conversation only, for example in a handoff prompt.

Two things are outside that rule: the version of something outside this repository that the project depends on or adapted, such as a dependency pin or the commit of a peer source; and a content digest that the code itself uses.

Write phase and slice numbers only in `plans/`: not in code, not in tests and not in a README.

Prove a behavior with a test that stays in the repository and can be run again. Record a check on real services as one dated sentence: what was checked, where, and the result. Keep no receipt file, no screenshot as evidence and no temporary log path in a record.

A machine check answers a question of fact by reading the repository, for example the form of a file or a string that Git knows. Do not add a check that needs a record written only to satisfy it, such as a receipt, an approval record or a proof that a command ran. Do not add a check that judges an agent's wording or conduct. The writer and the reviewer keep those rules.

`pnpm --dir tooling/agents run validate` refuses a file that names a commit or a branch of this repository. It also refuses a file outside `plans/` that holds a phase or slice number, when [records.json](tooling/agents/records.json) gives the form of those numbers. Material from before these rules is listed in [plans/record-rules-exempt.txt](plans/record-rules-exempt.txt); only the user adds a path to that list.

## Collaboration and Git

Agree the outcome, scope and acceptance before implementation. Keep changes organized into coherent deliverables that can be reviewed and committed together.

Consult the user before settling or implementing any needed user-facing UI decision, in every execution mode and outside the delivery workflow. Follow the [UI decision consultation gate](tooling/agents/plugins/vibe/skills/lets-vibe/references/addy-method-gates.md#ui-decision-consultation) for proposals, recorded decisions and dependent work; execution-mode authority does not waive it. In orchestrated mode the orchestrator takes this consultation in the place of the user, by the rules of that mode.

After context compaction, recover the current task state and applicable instructions before continuing; preserve prior decisions and approvals, and resume from the next unfinished action.

Inspect the branch, worktrees and working tree status before making changes. Preserve unrelated changes and user-owned work. Use ordinary Git operations, review the complete diff and staged paths before committing, and write commit subjects that state meaningful results. Do not rewrite accepted history without user authorization.

Before an authorized history rewrite or destructive local change, verify the exact target and establish a recoverable backup.

The delivery workflow has four execution modes: supervised, copilot, autonomous and orchestrated. In orchestrated mode an orchestrator session stands in the place of the user for the delivery of one slice or a chain of slices, by the user's own word. Where this file gives a decision, an approval, a consultation or an authorization of that delivery to the user, the orchestrator takes it inside the [limits of that mode](tooling/agents/plugins/vibe/skills/lets-vibe/references/orchestration.md#limits-that-no-decision-crosses); the user's word is the authorization already given for an outside action inside them. What those limits keep stays with the user, and so does each change of these rules, of their checks and of a list that only the user changes. Lets Vibe's [execution-mode rules](tooling/agents/plugins/vibe/skills/lets-vibe/references/contract-core.md#execution-modes) own what each mode permits, the default, how a selection persists and the review approval before a commit. They apply when a person starts Lets Vibe or a skill that uses those rules. Outside that workflow, do what the person asked: commit, push or go on to other work only when asked.

Respect explicit file approvals and limits on destructive and external actions. Do not ask again for authority already granted. If a real conflict blocks work, identify the exact conflict and the smallest decision needed; continue independent authorized work where possible. Respect an explicit user pause.

In every mode, ask early when a bounded user action could materially unblock work or improve required evidence, such as enabling a useful tool, completing an interactive login or entering a credential directly in an isolated application. Explain the specific benefit and any fallback; continue independent authorized work while awaiting help. Avoid repeated workaround attempts when user assistance is likely to resolve the obstacle more directly. Keep credentials out of chat and captured diagnostics. No reply grants additional authority or turns an unexecuted required check into a pass.

Public or externally visible changes require explicit user authorization covering the destination and action. Use authorization already given; permission for local work alone does not authorize publication.

Never commit credentials or secrets. Avoid exposing secrets or sensitive user data in logs, fixtures, screenshots and diagnostic output; use redacted or synthetic examples.

## Skills

Use [Lets Vibe](tooling/agents/plugins/vibe/skills/lets-vibe/SKILL.md) for every slice and sub-slice delivery, including resumption and corrections within that delivery. A user request to start or continue a slice or sub-slice invokes this workflow; the user does not need to name the skill separately. This does not select autonomous or orchestrated mode. Lets Vibe owns its [independent-assessment defaults and user overrides](tooling/agents/plugins/vibe/skills/lets-vibe/SKILL.md#independent-assessments). Lets Vibe is the only skill that plain words start. Every other repository skill starts when a person types its name or when the active workflow composes it; do not start a skill because a task looks like a match. The agents package explains [why a skill starts only when a person asks](tooling/agents/README.md#why-a-skill-starts-only-when-a-person-asks). Follow the invoked skill's instructions for composing supporting methods. Skills and delegated work must stay within the user's authorized scope and applicable repository rules. Keep workflow procedures, method selection and progress-reporting requirements in the skills that own them.

When adding, updating, renaming or deleting a repository skill, keep its canonical source, discovery links, invocation metadata, method routing and affected documentation consistent in the same change. Follow the [skill maintenance procedure](tooling/agents/README.md#skill-maintenance) and run the agent checks before reporting completion.

## Verification and review

Choose verification from the changed behavior and the consequences of failure. Prefer existing checks where sufficient. Reversible presentation, copy or documentation changes may be verified by inspection or an existing focused check without adding permanent tests. Add tests for meaningful required behavior that existing checks do not adequately cover; avoid tests that merely mirror the implementation, unrelated coverage expansion, new test infrastructure or added product complexity solely for test convenience. Complete explicit repository and accepted task requirements; generic skill checklists alone do not require new test machinery or a full-suite run. Once the agreed evidence passes, stop unless changed code, a failure or a concrete unresolved concern justifies further checks. Correct in-scope failures without asking for each ordinary edit or rerun.

When verification fails, diagnose the failure using the narrowest useful check, correct the in-scope cause, and complete any required checks that the failure prevented from running. Reuse passing results while they remain applicable to the current changes and environment.

Before interpreting a verification failure as a code defect, check that the command ran from the correct workspace with its declared prerequisites and current build outputs. Correct setup problems without changing product code to accommodate them.

Do not widen a public API solely to support tests. Test through the appropriate existing interface or use package-local access for internal behavior.

Prefer tests of observable behavior over tests coupled to internal structure. Mock external dependencies at appropriate boundaries; avoid replacing the internal behavior the test is meant to exercise.

Review snapshot and expected-output changes against the intended behavior before accepting them; do not update expectations merely to make a failing test pass.

When testing a state transition or integration, exercise the operation that produces the state and assert its required effects. Do not construct the expected state directly in a way that bypasses the behavior under test.

Automated tests must use isolated configuration, temporary storage and synthetic credentials instead of real user settings, accounts or session data. Tests that intentionally exercise a live service require authorization covering that service and any associated usage.

Use the repository's declared toolchain and runtime versions for verification; do not silently substitute ambient versions.

Builds, typechecks and non-UI tests must run without launching graphical applications. Launch a graphical application only when the task or selected verification explicitly requires it.

Give each long-running command a time limit: a test suite, a build, a server that a check waits for, and each command that runs in the background. In a script that runs more than one suite, give each suite its own limit. When a limit ends a run, name the step that did not end and report that check as not completed; do not start the same run again without a limit, and do not wait for a run that has none.

Track processes started for the task and stop them when finished. Verify process ownership before terminating anything; do not use broad name-based kills or stop the user's running application as routine cleanup.

When removing code, configuration, dependencies, documentation or functionality, remove or update checks dedicated to the removed material and preserve tests for surviving behavior. Do not add or retain tests, fixtures, snapshots, validators, documentation assertions or other permanent checks solely to prove the removed material remains absent, rejected or excluded unless the user explicitly requires that continuing guarantee. A one-time inspection may verify the removal; it must not become permanent repository machinery.

The primary agent directly owns implementation, Git operations and user communication. Keep delegated work bounded; do not hand off primary delivery responsibility or become an approval relay. In orchestrated mode the developer session is the primary agent of the delivery, and the orchestrator owns the communication with the user and the decisions that the mode gives it. Use bounded independent review when warranted and authorized. Keep confirmed findings distinct from suggestions and unverified concerns.

Each participant must read the repository instructions applicable to its work. Invoked skills own their assignment and handoff procedures.

Verify review findings against the current code and evidence before acting. A confirmed defect does not automatically justify the proposed fix; choose a proportionate correction within the authorized scope.

Report what changed, the checks actually run and their outcomes, omitted checks and relevant limitations. A record of a check follows the [record rules](#records). Check the final diff for whitespace errors and unrelated changes. Do not claim completion while required acceptance remains unmet.

Distinguish passed, failed, skipped, blocked and unexecuted checks. State whether evidence comes from mocks, a real local integration or a live external service.

Confirm that filtered test commands actually executed the intended tests; a successful exit with no matching tests is not verification.
