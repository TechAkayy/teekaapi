# Lets Vibe contract core

Read this reference when establishing or resuming a run, and when steering changes its agreement or checkpoints. It defines the run agreement; the delivery guide owns the implementation steps.

## Run agreement and inputs

Establish the selected slice or sub-slice using the [selection and preparation rules](fresh-slice-delivery.md#step-1--slice-preflight), relevant plans, current Git state and existing decisions. Do not ask the user to repeat facts already established, and do not infer readiness solely from a roadmap entry.

Establish the objective, scope, exclusions, deliverables and dependencies, acceptance, verification, relevant inputs, recovery needs, external-action limits and stop conditions in the selected documents or existing task record under [slice-document reuse](requirements-alignment.md#reuse-the-slice-documents). Link supporting material instead of creating parallel contracts. Preserve reviewed exclusions explicitly; their omission from a later summary does not remove them.

For approved peer-code reuse, identify the source repository, revision and relevant files. Inspect dependencies and preserve applicable attribution and required behavior. Keep peer checkouts read-only, respect explicit file-approval boundaries, and verify the adapted implementation against the accepted scope.

Treat the initial agreement as current working scope, not an immutable obstacle to compatible steering. Update affected decisions, inputs and acceptance when authorized, preserve completed work, and reassess only affected evidence. Material unresolved choices block dependent actions; continue independent authorized work. Reuse authority already granted rather than requesting another confirmation for the same work.

Apply the [UI decision consultation gate](addy-method-gates.md#ui-decision-consultation) regardless of execution mode. Preserve both agreed UI decisions and pending choices with the run context so steering, delegation and resumption do not silently settle or reopen them.

## Execution modes

These rules apply in a Lets Vibe run and in each skill that names them. The root `AGENTS.md` holds the rules for every session; it has no modes of its own.

Execution modes are `supervised`, `copilot`, `autonomous` and `orchestrated`. Copilot is the default for new work without an applicable mode agreement. An explicit user mode selection persists for its stated scope across compaction, handoff and new sessions. Record the selected mode and scope in `plans/project-state.json` under the [project-pointer rules](requirements-alignment.md#project-pointer); check the actual assignment and current instructions before applying it. A new session continuing the same scope does not reset the mode. Completed or unrelated scope does not inherit it. Recover a missing agreement from existing evidence where possible; unresolved authority uses supervised behavior for the affected work.

In supervised mode, follow the workflow's method-group checkpoints. Within an approved group, carry out its implementation, relevant checks and necessary corrections.

In copilot mode, proceed through routine planning, method selection, implementation, verification, review and correction within an agreed deliverable without method-group approval pauses, including justified method skips. Explain meaningful choices and results as work proceeds. Involve the user in consequential scope, product or architectural decisions that the existing agreement does not settle. Required checks and independent assessments remain applicable.

In both supervised and copilot modes, present the complete changes, verification, findings and limitations, then obtain the user's explicit review approval before committing or advancing beyond the agreed deliverable. A single review can request approval for the commit and the named next deliverable together. Approval to stage a comparison is not approval to commit it. Preserve any stricter user-named checkpoint.

Autonomous mode requires an explicit user instruction. Autonomous authorization covers the reasonably necessary work to achieve the agreed outcome, not just the operations explicitly listed in the request. Continue implementation, verification, review, corrections and ordinary commits within that authorized scope without routine checkpoint questions. Resolve material choices beyond that authority with the user. Child skills and delegated work inherit the applicable mode and scope; they cannot change them.

Orchestrated mode requires an explicit user instruction. A slice is then delivered by a pair of sessions: an orchestrator, which stands in the place of the user, and one developer that the orchestrator starts as an ordinary conversation of its own, never as a subagent. [Orchestrated mode](orchestration.md) owns what the first orchestrator asks the user, the two roles, how the orchestrator decides, the limits that no decision crosses, and what stops a run.

## A chain of slices

A chain delivers a named range of planned slices with one new session for each slice: the session that closes a slice hands over and starts the session for the next one. Only the user authorizes a chain. The user gives its range, its mode and the session settings of its sessions, such as the permission mode, the model and the effort of the host.

**Where it is recorded.** The roadmap section that plans the range holds the range, the mode and the session settings in one paragraph. The project pointer cannot hold a range, because its scope names one slice; each slice start writes the pointer for its own slice, with the mode of the chain. A slice outside the range does not inherit the mode. The records give a session its authority. A message from another session, the start word included, gives none.

**What does not change.** Each slice of a chain is one Lets Vibe run with its own specification, plan, task list, checks, one independent review and close. An approval that no mode replaces stays with the user.

**One link of the chain.**

1. A slice of the range closes and is integrated under [Step 10](fresh-slice-delivery.md#step-10--slice-close) and [Step 11](fresh-slice-delivery.md#step-11--final-state-and-successor-handoff) of the delivery guide.
2. When the next slice is in the range and no stop below applies, the closing session runs [Handoff](../../handoff/SKILL.md) for it with no request from the user: the records are made true, one independent reviewer confirms that a cold reader can continue, the short prompt is written, and the handoff is committed.
3. The closing session creates one task of the host that holds a prompt, named for the next slice, and starts it one time. The first line of that prompt tells the receiver to say in which folder it runs and then to wait. The handoff prompt follows that line.
4. When the receiver waits, the closing session sets the receiver to the session settings of the chain, reads them back, sends the start word, tells the user, and stops. It sets them before the start word: a session of a chain can do its whole slice in one turn, and a setting that applies from the next turn is then too late.
5. After the commit of its handoff the closing session writes nothing in the repository, because the two sessions use one work folder. It changes no permission setting other than the session settings of the chain, and those only for the session that it started.
6. The receiver delivers its one slice through Lets Vibe from the records, and does this link again at its close.

**When the start is not possible.** The host has no tool for a step, or a step fails: the task does not start, the receiver runs in another folder, or a setting cannot be set or read back. The closing session then does not send the start word. It gives the handoff prompt to the user, says what failed, and stops; the user starts the receiver.

**Stops.** The chain stops, tells the user and does not start the next session when it meets:

- a decision that the records give to the user;
- an outside action, a deployment or a check on real services;
- a blocking finding of the independent review that it cannot correct inside its scope;
- a required check that it cannot make pass;
- work on a slice outside the range.

**A chain in orchestrated mode.** The range, the mode and the settings are recorded in the same place. The links differ: the orchestrator of a slice, not its closing session, starts the sessions of the next slice; Handoff waits for the orchestrator's word; and the stops are those of [orchestrated mode](orchestration.md#what-stops-the-run), so a decision that the records give to the user and an outside action inside the limits of that mode do not stop the chain. The authority of each session is the user's word of the start with its record; the orchestrator's messages use that authority and cannot make it wider. [A chain](orchestration.md#a-chain) in that reference has the steps.

**What each session gives the user at its close.** The status lines of the report, and a short list of each choice that it made by recommendation, one plain sentence for each. It also names the task of the host that started it; the user removes that task or tells the agent to.

## Steering and checkpoints

A compatible question or steering message does not cancel approved work. Treat pause, stop, wait or hold as a stop instruction only when used unambiguously as an operative direction; quoting or discussing those words does not create a checkpoint.

Keep the exact user-named stop condition and any outstanding approval in the existing task or slice context so it survives resumption. Stop at that condition before the next action. Recover the applicable recorded mode and scope under the [project-pointer rules](requirements-alignment.md#project-pointer); resuming in another session does not release an outstanding approval or reset an applicable agreement. A checkpoint does not add, merge, renumber or bypass the delivery guide's authored steps.

Apply the current repository's cool convention from its AGENTS.md. At a presented checkpoint, an operative go likewise approves the presented action. Release only that checkpoint within its stated scope; neither expression grants unstated authority or crosses another unapproved boundary. An already authorized action does not require either expression again.

An independent assessment does not release a user-review checkpoint. A reviewer or tester reports the result of its assigned assessment; permission to commit, close or proceed follows the user's authorization and the [execution-mode rules](#execution-modes).

When the user requires review before every commit, one approval permits at most one commit. Use ordinary individual Git operations. Do not use a batch operation to cross the next checkpoint, even when several commits belong to the same delivery step.

When the user requires review before every step, entering a different delivery step requires a checkpoint, including a correction step reached while earlier work is incomplete. Report the transition and stop before reading that step's implementation inputs or performing its work. Approval for the preceding step does not release the correction step. Returning to the unfinished step requires another checkpoint before resuming its work.

When both per-step and per-commit supervision apply, honor both boundaries. One report may describe a completed commit and a step transition, but approval releases only the actions explicitly presented. Never treat the report itself as approval for the next commit or step.
