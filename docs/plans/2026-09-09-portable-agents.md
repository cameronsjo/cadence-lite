# Portable Cadence Lite agents

Status: implemented, locally validated, and published as draft PR #4
Next action: live harness acceptance and maintainer review of the stacked PR.

## Goal and approved approach

Restore useful Cadence review and test-authoring behavior while keeping Lite's
skills usable without a runtime. Build on PR #1 at `53a146b12f282c82558b08c1fb384eef940322b7`.
The user approved implementation and excluded all Cadence Voice roles.

Keep a single source for eleven concise roles: plan-reviewer, code-reviewer,
security-reviewer, agent-experience-reviewer, test-author, red-team-reviewer,
security-posture-reviewer, user-experience-reviewer, developer-experience-reviewer,
operability-reviewer, and doc-writer. Generate skill-local references and native
Claude Code, Codex, OpenCode, and Pi definitions from those sources. Model choices
stay in harness configuration. Specialized reviews run only when relevant.

Ship an optional, bounded Pi dispatch extension with isolated child processes;
keep the default Pi package and npx skills installation skill-only. Supply an
explicit local installer for native roles and the Pi extension. Refuse collisions
with existing files. Keep review failures and missing capabilities visible.

## Alternatives declined

- Copying full Cadence plugins would bring model, hooks, memory, and runtime
  dependencies into the portable core.
- Publishing a new npm CLI is unnecessary for skill discovery and installation.
- Treating an inline pass as independent review would hide a capability loss.
- Native definitions authored separately would drift from their portable roles.

## Work

- [x] Define roles, shared dispatch contract, and generated adapters.
- [x] Strengthen Polish and connect conditional plan review and plan metadata.
- [x] Add installation recipes, safe installer, optional Pi dispatch, and CI.
- [x] Validate generated files, collision behavior, packaging, and dispatch failures.
- [x] Exercise the revised review workflow on this change and record limitations.
- [x] Publish a branch and PR stacked on PR #1; leave main and merges untouched.

## Completion evidence

See [validation evidence](../validation.md): 60 generated artifacts verified,
32 tests passed, and independent review findings corrected with regression
coverage. Live model-backed acceptance requires the corresponding harness and
credentials and must not be implied by fixture tests.

Delivery: [PR #4](https://github.com/cameronsjo/cadence-lite/pull/4), targeting
PR #1's refactor branch. Land the prerequisite first, then retarget this PR to
main using the repository's maintainer-signed local merge procedure.
