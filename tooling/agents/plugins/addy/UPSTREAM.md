# Addy upstream source

Source: https://github.com/addyosmani/agent-skills

Revision: `84ee50673804b95c287d1e4eb4f1c1dad7c5188a`, the upstream `main` HEAD fetched on 2026-09-05. The upstream plugin version is `0.6.9`.

This copy includes all 25 skill directories, their bundled resources, all seven shared `references/` documents and the upstream MIT [license](LICENSE). Skill bodies, scripts, local resources and shared references are unchanged from that revision.

Integration changes are limited to the Agent Plugins standard manifest and added `agents/openai.yaml` files: the plugin is named `addy`, and each skill is explicitly invokable with implicit discovery disabled. The manifest retains upstream author, repository and license attribution. These integration files belong to this package, not to upstream skill content.

Local discovery does not execute the collection's methods. Lets Vibe selects relevant methods from the repository-local Addy collection within the user's agreed scope. Upstream references to other hosts describe their native integration; their hooks, personas and host projections are not installed here. A selected method's required tools or host capabilities must be available or its limitation reported before execution. Preserve its native output specifications and resolve a material scope conflict before applying it.

The repository-local Codex setup is documented in `tooling/agents/README.md` of this repository. Future upstream refreshes should replace the vanilla content from one exact revision, retain this provenance and license, and keep the integration metadata changes distinguishable.

## Known reference limitation

At this revision, the [floor-guard example](skills/constraint-driven-development/references/floor-guard.md) discards untracked-file differences: `git diff --no-index` returns exit status `1` when it finds differences, but the example's helper treats that as an error and drops its output. An untracked file containing `// @ts-ignore` therefore reports clean; staging the same unchanged file produces the expected violation. This package does not install this guard. Before any future adoption, correct and verify that handling in your own adaptation: retain diff output for status `1` and report actual command failures separately. Preserve this pinned upstream example unchanged and reassess the limitation on refresh.
