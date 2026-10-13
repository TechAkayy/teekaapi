# Public boundary

Use this reference when the accepted work reaches an external or irreversible action, such as pushing, publishing, deploying, releasing, signing packages, changing external configuration, messaging others, destructive cleanup or credential changes. Repository authorization rules control whether the action may proceed. Workflow selection alone does not authorize it.

## Prepare the reviewable action

Complete authorized preparation before requesting any missing approval. Present information relevant to the operation:

- The exact operation and destination, including the environment.
- The candidate or artifact identity and a concise diff or artifact summary.
- Executed validation and actual review disposition, distinguishing missing or unexecuted checks.
- Relevant security, privacy, accessibility and compatibility results or limitations.
- The credential source or account to be used, without secret values or unnecessary sensitive details.
- The expected external effect, recovery or containment approach, residual risk and excluded adjacent actions.

Scale detail to the action. Mark an inapplicable dimension plainly rather than creating an unrelated audit just to fill the report. A material unknown affecting approval must remain visible.

## Approval

Reuse existing explicit authorization when it covers the prepared operation, destination and scope. Identify only the missing decision; do not make the user approve the same action again. A go or cool at a concrete approval checkpoint releases that presented action under [contract core](contract-core.md), not a different environment or an adjacent operation.

If the candidate, target, environment, credential source, verification or risk changes, reassess whether the existing approval still covers the action. Obtain a new decision when the change exceeds it; do not treat every routine edit within an already authorized outcome as new authority.

## Execute and verify

Execute only the authorized operation. Capture sanitized evidence of the actual result, verify the expected external effect and confirm recovery readiness where relevant. If execution is interrupted or the outcome is uncertain, inspect the current state before retrying so the action is not duplicated. Report failures or remaining uncertainty accurately and stop before any adjacent action outside the authorization.
