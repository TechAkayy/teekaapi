# Simplified Technical English for reports

Use this reference for text that a person reads to follow the work: the progress report, a handoff prompt and a walkthrough. The owning skill tells you when this reference applies.

This reference does not apply to a task list, a spec, an implementation plan or other records that an agent works from. Write those for the agent, with the full technical detail and evidence, under the [record rules](../../../../../../../AGENTS.md#records). In a task document, only the progress state that the report prints follows these rules, because the user reads it in the report.

The rules below apply the writing rules of ASD-STE100 Simplified Technical English. The ASD-STE100 specification is the authority and it is not copied here. The repository does not contain its controlled dictionary, so no tool checks the approved-word list. The [progress renderer](../../../../../README.md#saved-progress-report) checks sentence length and item length only. The writer and the independent reviewer check the other rules.

## Words

- Use a simple, common word when one is available. Write “use”, not “utilize”. Write “start”, not “commence”.
- Use one word for one meaning. If you call it a “workspace” in one line, do not call it a “project” in the next line.
- Use a word as one part of speech. If “check” is a verb in the report, do not also use it as a noun.
- Technical names are permitted. A technical name is a name the reader must know to do the work, such as “sandbox”, “slice” or “dev server”. Explain a technical name the first time the reader sees it, unless the project already uses it every day.
- Do not put more than three nouns together. Write “the check of the image upgrade”, not “image upgrade admission check result”.
- Do not use abbreviations that the reader did not agree to. Do not use “e.g.”, “i.e.” or “etc.”.
- Do not use slang, idioms or figures of speech.

## Sentences

- Write short sentences. An instruction has a maximum of 20 words. A description has a maximum of 25 words.
- Put one instruction in one sentence. Put one topic in one sentence.
- Use the active voice. Write “The reviewer found two defects”, not “Two defects were found”.
- Use simple verb forms: present, past and future. Write “the test fails”, not “the test has been failing”.
- Write an instruction as a command. Write “Approve the plan”, not “The plan should be approved”.
- If a condition applies, write the condition first. Write “If the check fails, stop”, not “Stop if the check fails”.
- Keep the articles “a”, “an” and “the”. Do not remove words to make the text shorter.
- Write a number as a numeral: “3 tasks”, not “three tasks”.

## Structure

- Write one idea in one item. A report item has a maximum of 3 sentences.
- Write a paragraph of a maximum of 6 sentences.
- If you have more than two parallel things, use a list.
- Write the result first and the detail second.
- Tell the reader what to do next and who must do it.

## What stays out of reader text

Put these in the plan, and give the reader a link if the reader needs them:

- sandbox identifiers, digests and other long identifiers;
- command output, logs and file lists;
- the history of how a result was reached;
- a rule that a linked document already states.

A slice identifier and a task identifier are permitted, because the reader uses them to find the work. A commit or a branch of this repository goes in no file; give it in the conversation when the reader needs it.

## Examples

| Do not write | Write |
|---|---|
| T19.11 a7 roll-up: joined qualification has deployed the reviewed <commit> correction once as a contained carrier, with final 0/0. | The joined check passed. The corrected code is deployed. The plan lists the evidence. |
| Blocked pending upstream. | T6 is on hold. It waits for T5, which makes the test image. |
| Implementation of the allowance enforcement admission reservation reconciliation is underway. | I am building the allowance check. Next, I test two requests at the same time. |
| Should the user wish to proceed, approval may be given. | Approve the plan to continue. |
