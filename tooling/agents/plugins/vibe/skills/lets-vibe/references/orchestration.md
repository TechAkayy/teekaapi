# Orchestrated mode

Use this reference when the user selects orchestrated mode under the [execution-mode rules](contract-core.md#execution-modes). It is a mode of this workflow like the other three: it belongs to no one roadmap, slice or agent host.

In orchestrated mode a slice is delivered by a pair of sessions. The **orchestrator** stands in the place of the user. The first orchestrator is the session that the user started and told to orchestrate; in a chain, each later one is started by the orchestrator before it. The **developer** is one separate conversation that the orchestrator starts; it delivers the slice through Lets Vibe and makes every change.

**The developer is an ordinary conversation of its own, and never a subagent.** It is a top-level conversation of the host with a life of its own, as one that the user started: the user can open it, read it and write to it, and it does not end when a task of another conversation ends. A subagent, a child task or a delegated task of the orchestrator's conversation is not a developer, whatever model it runs on. The same holds for each next orchestrator of a chain. Only the independent reviewer may be a subagent or a child task, because its work is one bounded read. The user stays away after the start, and the mode is built to need the user as little as possible.

## The host

The rules name no host. A host can carry this mode when a session on it can:

- start a new ordinary conversation — top-level, and no child of its own conversation — in the same work folder, with a model, an effort and a permission setting that it names;
- read back the folder and the settings that are in force for that conversation, and for itself where the host has that;
- send it a message, wait for it, and read its result;
- receive a question from it and answer it;
- interrupt it, and continue the same conversation later.

The orchestrator finds the host's own tools for these and uses them. A capability that the host does not have is a blocker of the start, said in the first line of its report. It is not a reason to change these rules or a reusable skill. A host that can start only subagents or child tasks cannot carry this mode: the orchestrator does not put one in the developer's place.

A question here is a question of the work. A prompt of a permission system is not one: the orchestrator answers none. Only the user and the host's own settings do.

## The start

The first orchestrator asks the user three things before any other work, in one message, with the choices of the host's live catalogue:

1. **One slice or a chain of slices.** For one slice, which one. For a chain, its slices in their order; the orchestrator proposes them from the roadmap and the recorded decisions, and the user confirms. Reading those for the proposal is part of the question.
2. **The model and the effort of the developer.**
3. **The model and the effort of the independent reviewer.** Each independent read of the run uses them: of a draft specification, of the candidate, and of a handoff.

It does not ask for its own model and effort: the user chose them by starting it. Where the host can read them back, it does; where it cannot, the record says that they are as the host shows them to the user.

A model or an effort that the user names and that the host does not offer is never replaced by another one. The orchestrator says so and asks again.

The developer and each reviewer get the permission setting of the orchestrator's own session. A narrower one is used only when the user names it. No session of the run gets a setting under which the host asks a person before a command: nobody is there to answer, and that session would wait. A reviewer changes nothing in the work folder by its assignment under Review Vibe, which has it run its checks in a copy outside it. To give a new session the orchestrator's setting at its start is no change of a setting; the mode asks for none and makes none wider.

**The user's word that the orchestrator represents the user.** The mode needs it in the user's own message to the first orchestrator: that the orchestrator takes each decision and gives each approval of the run in the user's place. It is a full representation, and no list of actions, because the user cannot know at the start what a slice will need. The user need not write it at the start: to select the mode is enough to begin. Where the user's message does not hold it, the orchestrator asks for it one time, with the three questions, and the user answers in the user's own words; if the user does not give it, this mode does not start, and the orchestrator offers the other modes. The [limits](#limits-that-no-decision-crosses) below still hold; the user lifts one only by naming it. A later message of the user, in either conversation, goes before each decision of the orchestrator.

**The user's signed-in browser, and a credential of a model provider.** With the three questions the orchestrator also asks two things, so that it need not ask them in the middle of a slice: if the user allows the use of the user's signed-in browser of the host for a check that needs the user's sign-in; and if the user allows the use of a credential of a model provider that is already on the machine, for a bounded test turn of the agent. Without a yes of the user, such a check is owed to the user. The [limit](#limits-that-no-decision-crosses) on each holds with a yes too.

**Where the start is recorded, and by whom.** The orchestrator writes nothing in the repository. Until a developer exists, the answers stand in the orchestrator's conversation. At the slice start the developer records them: for a chain in the roadmap section that plans the range, as the [chain rules](contract-core.md#a-chain-of-slices) say, and for one slice in the plan of the slice. The record holds the slice or the slices in order, the mode, the three answers, the settings as they were read back, the date of the user's word, each limit that the user lifted, and each of the two uses that the user allowed, of the signed-in browser and of a credential of a model provider, each with its date. The project pointer holds the mode for the current slice. It also holds the sessions of the run, as [the run report](run-report.md#what-the-pointer-holds) says: in this mode the orchestrator and the developer each find the identifier of their own session log, the orchestrator gives its entry to the developer, and the developer writes both at the slice start.

**What that record is.** It names what the user decided and when, and says who wrote it and from what: the developer reads the user's own messages in the orchestrator's conversation where the host lets it, and otherwise the record says that it has them from the orchestrator's account. It does not copy the words of an approval. Those stay in the conversation where the user wrote them, and each next orchestrator of a chain gets them unchanged in its start message. The authority of the run is the user's word. The orchestrator's messages use that authority and cannot make it wider. A session whose permission system does not accept this treats the approval in question as [owed to the user](#what-never-stops-a-slice).

**The check before delivery starts.** With the first developer started and waiting, the orchestrator shows on this host and in this work folder that the developer's conversation is a top-level one and no child of its own, that each thing under [The host](#the-host) works with the settings that the user chose, has the developer start one reviewer on the model and the effort that the user chose, with its settings read back, and has the developer try the operations that the slice is known to need. For each the developer records one of: run for real; a substitute that changes nothing passed; refused; not tried. Only a refusal is a blocker of the start, told to the user before the user leaves. A setting counts as in force when the host reads it back, and never because a model says so of itself.

## The two roles

**The orchestrator** directs, decides, weighs the evidence and speaks with the user. It reads the source, the changes and the evidence itself when a decision of weight depends on them. It makes no change in the repository and no outside action; it has the developer make each one, and then verifies it. It collects the developer's messages by the host's own way of waiting, so that no question stays unread.

**The developer** is the primary agent of the delivery: it owns the implementation, the checks, each write in the repository, the Git operations and the records. For the developer the mode works as [autonomous mode](contract-core.md#execution-modes) with the orchestrator in the place of the user. Where a rule of this workflow or of the repository gives a decision, an approval, a consultation or a review of the delivery to the user, the developer brings it to the orchestrator and goes on with its answer; this holds for the [UI decision consultation](addy-method-gates.md#ui-decision-consultation) too. Routine work and ordinary commits need no message. The orchestrator's release is needed for the specification and the plan, the answer to a review finding, an outside action, a departure from an accepted decision, the close and the join.

**How a developer is started.** The orchestrator starts one developer for a slice, as a new ordinary conversation by the host's tool for that and not by its tool for a subagent or a delegated task, on the model and the effort of the record. Its first message names the role, the orchestrator's conversation, the slice and the record of the start, and tells it to say in which folder it runs and to wait. For the first slice that record does not exist yet: the message then holds the answers of the start themselves, for the developer to record. The orchestrator reads back the folder and the settings, and only then gives the start. One developer writes in the work folder at a time, and the same pair stays together for the slice and its corrections.

**What tells a session its role.** The start message does. A session that finds the pointer in orchestrated mode and was given no role is neither the orchestrator nor the developer: it asks the user.

**When the orchestrator does not answer.** The developer sends its question one time and goes on with the work that does not depend on it. When no such work is left, it stops, and its last message says what it waits for. It does not decide in the orchestrator's place. The developer sends a message at each decision, stop, failure and completion, because the end of a turn is no notice.

**The independent reviewer** runs on the model and the effort that the user chose, apart from both roles, under [participant coordination](participant-coordination.md). The developer starts it, as [Review Vibe](../../review-vibe/SKILL.md) says, and names its settings; the orchestrator reads them back where the host lets it. The orchestrator is no replacement for it. Where the host cannot continue a reviewer that ended, each further read is a new reviewer that gets the first assignment, the findings and the answers to them, and the record names it as a replacement.

## How the orchestrator decides

The orchestrator decides as the user would, and the project tells it how the user would: the repository rules, the roadmap, the plans, the accepted decisions with their reasons, the reading map and the sources it names. It reads what a decision depends on before it decides.

- **A thing that the records settle is settled.** It follows an accepted decision of the user, and does not open it again because it would choose another way.
- **Where the records are silent,** it takes the simplest solution that is sound in structure and fits the records and the later slices, and has the decision, its reason and the other way recorded.
- **A departure from an accepted decision** is made only when the delivery needs it, and is recorded as a departure, with its reason, in the document that owns that decision.
- **It works by proposal and answer.** The developer brings a concrete proposal with its recommendation, its consequences and the evidence that is still missing. The orchestrator tests the claims that carry weight against the source, then approves, changes or refuses it with a reason.
- **It looks at what a person will see.** For each change of a screen the developer runs the built product and gives the orchestrator the real screens, and the orchestrator looks at them before it accepts them.
- **It asks of each result what it leaves for later work,** and checks that the slice that must take it holds it.
- **It stops when the agreed acceptance is met.**

What it decides: the specification of a slice, after one independent read of its draft; the scope, the plan, the deliverables and the acceptance; each choice of a screen and of its words; product, architecture, compatibility and migration; the answer to each review finding; the close and the join into the agreed line; each outside action inside the limits. Each one is recorded as a decision of the orchestrator. A record never says that the user inspected, signed in, tested or approved a thing unless the user did.

It keeps the evidence honest: a test with mocks, a real local run and a check on a live service are three different things, and a build that passed or an agent's word proves no live behavior. It may make an acceptance sharper before the work that depends on it. It never takes away a requirement that failed, never calls missing evidence a pass, and never calls its own read an independent review.

## Limits that no decision crosses

These hold whatever the orchestrator decides, until the user lifts one by naming it.

- **An outside action needs a way back.** A deployment, a call that changes a provider, or another change of a live service is made only when its way back was tried first where that is possible without the live service, the state before it is read and recorded, it runs as one plain command, and the service is checked after it. When that check fails, the way back is made at once.
- **An action with no way back is not made.** The developer prepares it whole — its tool, its rehearsal and one plain command — and it is owed to the user.
- **The user's own accounts and data, and the resources of other work, are neither removed nor changed.** A live service of the slice that the run did not make is changed only by an outside action that the first limit permits.
- **The user's signed-in browser is used only when the user names it.** It is then used by the developer, only for a check that needs the user's sign-in, and only on the sites of the service under check; nothing else in the profile is opened or read. No credential is entered, no setting of an account is changed and nothing is signed out; these three are not lifted. Nothing is done there in the user's name beyond the check: no purchase, no message or post, no acceptance of terms or of a consent, no grant of access to another application, no removal of data, and no reading out of cookies or stored tokens.
- **No Git push, no pull request and no publication** of a package or of the repository. Other work folders and each stash stay as they are.
- **The rules stay as they are.** No session of the run changes a permission setting, a reusable skill, the repository rules or one of their checks, or a list that the rules give to the user alone.
- **A credential of the user at a model provider is used only when the user allows it.** It is then used by the developer, only for a bounded test turn of the agent in a test project that the run made, with the model and the size of the test named to the orchestrator first. It stays out of each message, each log and each file of the repository. The run signs in at no provider and makes no credential.
- **A refusal of a permission system is not gone round.** It is never split, put in other words, sent another way or taken to another session.
- **No secret is printed or committed.**

## What never stops a slice

- **A refused operation** is owed to the user, and the work that does not depend on it goes on.
- **A question that is only about records** is the orchestrator's to decide. When the permission system refuses the commit of a record, the refused content is written in no file and in no commit message. The close says only that a record was refused, and the report to the user says which.
- **A check that needs the user's own sign-in, account or judgement** is owed to the user. Where the user named the use of the user's signed-in browser, a check that needs only the sign-in is made there by the developer, inside [its limit](#limits-that-no-decision-crosses), and the record says that it was made through the user's profile, and not by the user. A real turn of the agent on a live service needs a credential of a model provider: where the user allowed that use, the developer makes the test inside its limit, and otherwise it is owed.
- **A slice closes with what is owed.** Its specification keeps the acceptance that the run can meet apart from the steps that are owed, so that an owed step holds no close. When a required acceptance turns out to depend on a thing that is refused or owed, the orchestrator moves it to the table of what is owed, as its own recorded decision: the close then says that this acceptance is not met and is owed, and never that it passed.

The record of the start has one table of what is owed to the user: the slice, the step or check, how it is done, and what depends on it. The developer keeps it true.

## What stops the run

The orchestrator starts no further work, leaves a state that can be taken up again, and tells the user, when:

- a live service does not answer as before after the way back was made;
- data outside what the run made is lost or changed;
- a secret was shown;
- a service refuses work because a limit of the user is reached and does not reset;
- the next slice depends on a thing that is refused or owed to the user;
- a slice cannot close inside its ceilings.

**When it needs the user,** the first line of its message begins with the words “Needs you:” and holds the one question; its recommendation follows. It does not ask the same thing twice, and it does not wait for the user for a thing that this reference gives to it.

## Ceilings

The defaults, unless the record of the start names others:

- **Time:** 12 hours for a slice. Then the orchestrator makes it smaller or allows 6 more, one time, with its reason.
- **Reviews:** three rounds for one candidate. A round is one read of the candidate by the independent reviewer, with the corrections that follow it. A read that finds no defect ends the reviews.
- **The last corrections always get one independent read.** After the third round a further read covers only the corrections since the read before it, and is no round. The slice closes when such a read finds no defect. When the time ceiling comes first, the orchestrator closes with the open finding named as a limit of the close, as its own decision and never as a pass of the reviewer, or it stops the run.

## A chain

A chain in this mode is a range of slices, each with a new pair. It follows the [chain rules](contract-core.md#a-chain-of-slices) with these differences, which are part of this mode:

1. The slice is delivered and closed through Lets Vibe, with its join into the agreed line. The developer then waits: it does not run Handoff by itself.
2. The orchestrator verifies the close, the join, what is owed and the next slice by the records. It then tells the same developer to run [Handoff](../../handoff/SKILL.md) one time. The developer returns the short prompt and starts nothing.
3. The orchestrator starts one new orchestrator for the next slice, as a new ordinary conversation, on the model, the effort and the permission setting of the first orchestrator. Its start message holds the role, the handoff prompt unchanged, the path of the record of the start, the name of the next slice, and the user's word of the start unchanged. That session says first in which folder it runs and waits; the settings are read back before it gets its start.
4. The new orchestrator reads the records and starts its own developer. It asks the user nothing that the record of the start answers.
5. After the handoff commit the outgoing pair writes nothing. When the next orchestrator is started, the outgoing pair stops.

Before each slice the orchestrator takes the order from the record of the start, the roadmap and the recorded decisions. At each close it gives the user what the chain rules ask of a session at its close.

## The reporter

A [reporter](run-report.md) can follow a run of this mode from outside the pair, as in each mode. Its report then reads both conversations, and its first line holds the request of the orchestrator when the orchestrator needs the user.

## Continuity

The orchestrator keeps the identifiers of its conversations and of its requests. When a start has an uncertain outcome, it finds and reads the conversation that may exist before it tries again. After an interruption or a compaction it takes up the records, the same pair and the open requests, and makes no new pair for an unfinished slice. When the developer's conversation cannot be continued, it says so to the user in the first line of its message and starts a new developer only on the records, with the state of the work folder read first. For a usage limit or a short outage it keeps the state and uses the host's own way to go on; it changes no model.

## The finish

At the end of one slice, or of the last slice of a chain, the orchestrator reports to the user: first the table of what is owed, then for each slice the decisions that are costly to turn back, each with its other way, then the outcome, the checks that ran, what was made on live services, and the limits. It links the records that own each of them.
