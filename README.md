# cadence-lite

A small, portable workflow for coding agents: orient, resolve consequential
choices, build, review, and leave enough context to resume.

The skills work without hooks, a plugin runtime, or native subagents. Optional
agent adapters add independent review and bounded test/documentation work.

## Install the skills

With Node.js and Git available, install the five core skills into the current
project for the harnesses you use:

    npx skills add cameronsjo/cadence-lite \
      --skill intro attune polish outro capture \
      --agent pi codex claude-code opencode

Remove harness names you do not use. Add --global for personal installation
across projects. Preview discovery with:

    npx skills add cameronsjo/cadence-lite --list

Optional workflows can be selected separately:

    npx skills add cameronsjo/cadence-lite \
      --skill triage adapt improve-repo --agent codex

The [skills CLI](https://github.com/vercel-labs/skills) installs skill folders and
their references; it does not register the native subagents below. Use
npx skills update to update skills installed this way.

Pi also supports a skills-only Git package:

    pi install git:github.com/cameronsjo/cadence-lite

The explicit Pi manifest loads all eight skills, including the three optional
workflows, and no extensions. Use Pi's resource configuration to disable unwanted
skills. Choose either Pi's package manager or npx skills for a given installation,
so you do not load the same skills twice. See [Pi packages](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/packages.md).

These commands follow the selected repository revision; they do not verify the
maintainer's signing identity. Consumers enforcing the signature policy in
[CONTRIBUTING.md](CONTRIBUTING.md) should install from a checkout already verified
against their trusted maintainer key, using npx skills add ./cadence-lite with the
same selection flags. Verify updates before reinstalling them. A lock or content
hash identifies content; it does not establish who signed it.

## The rhythm

| Skill | Use it when | Result |
| --- | --- | --- |
| [intro](skills/intro/SKILL.md) | A session opens with a greeting or desk-status request | Current state and useful next moves |
| [attune](skills/attune/SKILL.md) | Planning is requested or consequential choices remain | A reviewed plan with status, next action, and completion criteria |
| [polish](skills/polish/SKILL.md) | Preparing or reviewing a branch for a PR | Findings, authorized fixes, and evidence for the final change |
| [outro](skills/outro/SKILL.md) | Ending the session | Durable stopping point and disposition of loose ends |
| [capture](skills/capture/SKILL.md) | A side idea interrupts the task | A durable note and return to the task |
| [triage](skills/triage/SKILL.md) | Reviewing accumulated ideas or a backlog | An ordered shortlist with reasons |
| [adapt](skills/adapt/SKILL.md) | Learning from demonstrated workflow friction | A proportionate improvement or a reason to make no change |
| [improve-repo](skills/improve-repo/SKILL.md) | Improving repository delivery through a real task | Verified improvements within a bounded scope |

There is no execute skill. Specified small changes proceed directly. Existing
approval persists; a request for analysis does not authorize implementation.
Capture, triage, and reflection do not automatically authorize external writes.

Polish identifies the actual repository, base, and complete changed-file set;
selects relevant reviewers; records findings and dispositions; and checks the
final change. A missing or failed review stays visible. Plan review is conditional
on a substantial plan, with additional roles selected by the affected surface.

## Optional native agents

All eleven roles are defined once under [agents/](agents/manifest.json).
Generated skill-local copies let Attune and Polish use their briefs even when
native agents are absent. Native names begin with cadence-lite- to coexist with
full Cadence and other agent collections.

| Installation group | Roles |
| --- | --- |
| core (default) | plan-reviewer, code-reviewer, security-reviewer, agent-experience-reviewer, test-author |
| all | The core roles plus red-team-reviewer, security-posture-reviewer, user-experience-reviewer, developer-experience-reviewer, operability-reviewer, doc-writer |

Core means available, not compulsory on every change. Reviewers return findings;
test-author writes tests against required behavior without changing production
code; doc-writer updates assigned documentation from verified behavior.
The roster excludes Cadence Voice and domain-specific plugin agents.

Clone a stable checkout and run the installer with Node.js 22 or newer:

    git clone https://github.com/cameronsjo/cadence-lite.git
    cd cadence-lite
    node scripts/install-agents.mjs --agent codex --project /absolute/path/to/project --dry-run
    node scripts/install-agents.mjs --agent codex --project /absolute/path/to/project

Choose one of codex, claude-code, opencode, or pi. Add --group all for the full
roster. Replace --project PATH with --global for a personal install.
Restart the harness after installation.

| Harness | Project location | Personal location |
| --- | --- | --- |
| Claude Code | .claude/agents/ | ~/.claude/agents/ |
| Codex | .codex/agents/ | ~/.codex/agents/ |
| OpenCode | .opencode/agents/ | ~/.config/opencode/agents/ |
| Pi | .pi/extensions/cadence-lite/ | ~/.pi/agent/extensions/cadence-lite/ |

The installer copies definitions and records their hashes. Repeating the same
install is harmless. After updating and verifying your checkout, use the same
command with --update: it replaces only files unchanged since installation.
Locally edited or conflicting files are preserved and cause the operation to
stop before writing. Reconcile those files deliberately before retrying.
Symlinked destinations are refused; use the real destination checkout/location
or install manually. Unselected existing roles are retained.

To remove an installation, remove only the cadence-lite-prefixed definitions and
their .cadence-lite-install.json from the chosen native agent directory. For Pi,
remove the dedicated extensions/cadence-lite directory. Skill removal is separate:
use the installer that placed the skills.

### How dispatch differs by harness

The adapters use the documented
[Claude Code](https://code.claude.com/docs/en/sub-agents),
[Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), and
[OpenCode](https://opencode.ai/docs/agents/) formats. They omit model and memory
settings so the harness supplies its normal configuration.

Claude Code, OpenCode, and Pi reviewers have file-reading tools and no shell or
write tools by default. Codex reviewers use its read-only sandbox. This allows
source inspection without claiming live command execution; the caller runs
authorized checks and supplies evidence. Test and documentation writers have
editing capabilities, bounded by their task instructions and host permissions.
A tool list alone is not an OS sandbox.

Pi's optional adapter registers cadence_lite_dispatch. A request such as
"Use cadence-lite-code-reviewer on this branch" starts a fresh Pi process in
the current directory, with the parent's selected model and thinking level.
It accepts one bounded task per call and allows at most four concurrent children.
It uses Pi on PATH, so launch parent and child from the same Pi installation.

Children retain project context and normally discovered extensions. They disable
skill/prompt-template loading and this extension's recursive dispatch.
Parent-only runtime settings and explicitly supplied extension paths are not
automatically inherited. If those provide required controls, configure the child
equivalently or use an inline review; do not use dispatch to evade a restriction.
The extension adds no sandbox or approval bypass.

Child output is bounded; launch errors, malformed output, model errors, incomplete
responses, cancellation, timeout, and empty reports fail visibly. A child finding
real defects is still a completed review, not a transport failure. Prompt files
are removed when the child finishes, and no child transcript is retained.
Pi supports this process architecture through its
[official subagent example](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/subagent/README.md).

## Updating and validating the package

The agent manifest, role bodies, and shared contract are the source of truth.
After changing them:

    npm run generate
    npm run check
    npm test

Generation and installation require Node.js 22+. Tests also use Python 3.11+
to parse actual Codex TOML. There are no npm dependencies or build step for
skill-only consumers. CI checks generated freshness, isolated skill references,
native installation and update behavior, and the Pi process boundary.

These checks establish packaging and fixture behavior. They do not establish
live acceptance on every harness/model. See [validation](docs/validation.md)
for the exercised boundaries and remaining checks.

## Relationship to full Cadence

Lite keeps portable workflow decisions and specialist briefs. Full Cadence adds
runtime enforcement, coordination, routing, and a wider skill surface. Install
those capabilities when they help the work; a harness supporting plugins is
not by itself a reason to load a larger instruction set.

## License and contributions

Apache-2.0 with the Commons Clause; see [LICENSE](LICENSE). This is
source-available, not OSI-approved open source.

See [CONTRIBUTING.md](CONTRIBUTING.md). Maintainer-signed local merging remains
the merge process; the adapters and CI do not change it.
