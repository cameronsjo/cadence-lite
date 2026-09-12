# Validation evidence

This change builds on PR #1 at 53a146b12f282c82558b08c1fb384eef940322b7.
The local repository's initial commit is a materialized snapshot of that source;
the published branch uses the actual GitHub commit as its parent.

## Package and process checks

On 2026-09-10, Node.js 24.19.0 and Python 3.12.14:

| Command | Result | What it establishes |
| --- | --- | --- |
| node scripts/generate-agents.mjs --check | 60 artifacts verified | Native adapters and skill-local briefs match their source |
| node --test tests/*.test.mjs | 32 tests passed | Native installation, repeat/update/collision behavior, TOML parsing, isolated skill references, and Pi fixture-process behavior |
| git diff --check 80ec311 | Passed | No whitespace errors across the full change from the materialized base snapshot |

In the published repository, the equivalent base is
53a146b12f282c82558b08c1fb384eef940322b7; use that SHA instead of the local snapshot.

The Pi process tests include literal task argument handling, model/tool/prompt
propagation, prompt cleanup, unsuccessful exit, no report, malformed JSON,
invalid event/content/status shapes, model failure, truncated completion, output
limits, timeout with a resistant child, cancellation, missing binary, and unknown
roles. Linux coverage also checks background-descendant cleanup after the leader
exits. A regression test first
failed because truncated model output was accepted; the corrected dispatcher
requires a completed assistant response.

## Workflow review

Two independent evaluators reviewed the actual change. One exercised the revised
Polish workflow against the repository diff, using code, security, agent-experience,
and developer-experience lenses inline within that evaluation. Those lenses were
not four independent reviewers. The second reviewed the adapter and installer
boundaries and independently reproduced the Pi failures below.

| Finding | Disposition and evidence |
| --- | --- |
| Pi did not automatically discover an extension named index.mjs | Added an explicit package manifest; an installed-package test resolves and imports its declared entry and checks the selected roster |
| Malformed Pi event fields could escape callbacks, crash the host, and leak temporary prompts | Validate event, content, text, stopReason, and errorMessage shapes before use; regressions reject each malformed dispatch and check prompt cleanup |
| CI's whitespace check inspected the empty working tree | Fetch history and check the committed event-base-to-HEAD diff; the local command above likewise names its base |

Review also improved the descendant test's reliability: its process observation
is explicitly Linux-only and allows a bounded interval for SIGKILL delivery.
The adapter evaluator's final bounded follow-up independently confirmed that
both hostile status-field reproductions reject and leave no prompt files.

## Limits

No Pi, Codex, Claude Code, or OpenCode executable is installed in this environment.
No model-backed child or live native-agent discovery was run. No remote npx skills
installation was run. The documented formats and install paths were checked
against the linked primary documentation, and skill directories were exercised
as isolated copies with their references. This is packaging evidence, not a claim
that all harness/model combinations are accepted.

CI is configured to run the package checks on Node.js 22 and 24. A configured CI
job is not a successful run; consult the PR's checks for its actual results.
