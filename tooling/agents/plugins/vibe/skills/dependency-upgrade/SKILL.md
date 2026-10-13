---
name: dependency-upgrade
description: Upgrade a selected dependency set with release-contract review, controlled lockfile changes and compatibility verification, only when explicitly invoked.
---

# Dependency Upgrade

Update an established dependency set within the agreed scope. Identify the workspace, declared package manager and runtime, current and target versions, registry, affected consumers, acceptance and recovery needs before mutation. Resolve material choices with the user; reuse decisions already given. Initial dependency selection is a planning task, not automatically an upgrade.

Apply the [execution-mode and approval rules](../lets-vibe/references/contract-core.md#execution-modes). This skill does not open or close a slice, publish packages or change a registry. If invoked within an existing delivery, keep its current scope and checkpoints. Use ordinary Git and preserve unrelated changes.

## Addy methods

Use the [shared selection and supervised group checkpoints](../lets-vibe/references/addy-method-gates.md) with the transitions below, not the Lets Vibe delivery-step matrix. Read the actual selected Addy skills and required resources, announce their purpose and outputs, and apply them within the approved upgrade. Keep upstream skill bodies unchanged. Required methods that are unavailable leave an explicit coverage limitation; do not claim they ran.

- Before release-contract review, assess `spec`: use `source-driven-development` for the selected versions' official contracts and `doubt-driven-development` for material compatibility assumptions.
- Before mutation, assess `plan`: use `deprecation-and-migration` when a migration is needed and `planning-and-task-breakdown` for dependent changes.
- Before adapting consumers or fixing regressions, assess `build` for `incremental-implementation` and `test` for changed behavior: `test-driven-development` for behavioral changes or regression fixes, `security-and-hardening` for trust changes, and browser/performance methods when relevant. When TDD applies, demonstrate the failing behavior before implementing the fix. Pure configuration changes do not require TDD.
- Before final verification, reassess `test` for remaining coverage and new failures. A failure may require `debugging-and-error-recovery`; any resulting behavioral fix returns to the preceding `build` and `test` assessment before correction.
- Before presenting the result, assess `review` and apply `code-review-and-quality` to the manifest, lockfile and consumer changes. This is self-review; independent assessment is separately requested.

## Five-step upgrade

1. Inspect manifests, lockfiles, overrides, peer ranges, generated artifacts and repository state. Establish the current resolved versions and the selected target set. Identify the actual consumers and any persisted-data implications.
2. Read official release notes, migration guides, relevant advisories and support policy across the selected range. Explain breaking changes, runtime/platform requirements and expected transitive changes before implementation. For a pinned foundation dependency, locate and follow the project's accepted upstream re-pin runbook and pin manifest; follow its accepted patch/source policy. Reassess each recorded patch against the candidate: retain with evidence, adapt and reverify, or retire when a supported capability supersedes it. A patch applying cleanly is not behavioral compatibility proof. If these inputs are missing, resolve the upgrade baseline rather than inventing a release pin or fork fallback.
3. Change the owning manifests and update the lockfile with the declared package manager. Keep the update coherent and bounded; do not edit generated lockfile entries manually or let an unrelated bulk upgrade enter the result.
4. Inspect every direct and unexpected transitive change. Account for peer, audit, type and deprecation failures rather than suppressing them to obtain a passing command. Correct in-scope consumer migrations and explain unrelated blockers.
5. Complete required migrations and the [applicable verification](references/proof-matrix.md). Review the resulting diff and record the previous version set, executed checks, residual risks and recovery procedure. Restoring package versions does not imply that a data migration is reversible.

## Progress and completion

Use [progress-report](../progress-report/SKILL.md) without another invocation. Report scope and method selection, meaningful upgrade/verification results, blockers and the final reviewable result. Follow its supporting-work reporting rules. Preserve unfinished checks and approved work on resume.

Finish with the old/new dependency set, relevant source links, material lockfile changes, migrated consumers, checks run or reused, unexecuted coverage and recovery limits. Pause at applicable user-review boundaries before committing. Publication or another dependency set requires its own authorization.
