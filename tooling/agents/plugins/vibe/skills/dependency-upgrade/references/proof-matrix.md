# Dependency verification

Select checks from the actual affected contracts and repository toolchain. A successful install or lockfile diff alone does not prove compatibility.

- Clean resolution from the updated lockfile; exact pins where required; duplicates, overrides and peer-range compatibility.
- Affected typechecks, lint, unit, integration and end-to-end checks.
- Build, packaging, clean consumer installation and runtime startup when those surfaces change.
- Migration of configuration, APIs, styles, assets and generated contracts through their owning generators.
- Supported runtime/platform compatibility, relevant security advisories and license changes.
- Browser interaction, accessibility or performance when changed behavior warrants them.
- Failure cases and consuming-layer behavior, including normal process exit and cleanup.
- Recovery to the previous version set, with separate treatment of persisted-data compatibility and irreversible effects.

Reuse current passing results when applicable, run required aggregates, and diagnose failures before broad reruns under repository verification rules. Do not expand the product or add a new test framework merely to fill this checklist. Report passed, failed, skipped, blocked and unexecuted checks distinctly, including whether evidence is static, mocked, local integration or a live service.
