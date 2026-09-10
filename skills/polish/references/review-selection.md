# Select review and writing roles

Use the role's linked brief for a native dispatch or an explicit inline fallback.
Installed native names have the prefix cadence-lite-. Installation is optional;
these briefs travel with the skill and work without native registration.

| Role | When it adds value |
| --- | --- |
| [Code reviewer](agents/code-reviewer.md) | Consequential implementation changes; correctness, regressions, and unnecessary complexity |
| [Security reviewer](agents/security-reviewer.md) | Untrusted input, authentication, authorization, sensitive data, or agent capability/instruction changes |
| [Agent experience reviewer](agents/agent-experience-reviewer.md) | Skills, agents, rules, tool schemas, or output an agent must interpret |
| [Red team reviewer](agents/red-team-reviewer.md) | Operational assumptions or executable recipes whose correctness depends on actual state |
| [User experience reviewer](agents/user-experience-reviewer.md) | Changed user journey, CLI interface, prompts, quickstart, or recovery messages |
| [Developer experience reviewer](agents/developer-experience-reviewer.md) | Setup, build, test, CI, tooling, or contributor-path changes |
| [Operability reviewer](agents/operability-reviewer.md) | Partial failure, retries, migrations, background jobs, recovery, or audit trails |
| [Test author](agents/test-author.md) | A concrete gap in required behavioral or regression coverage; authorized test-file edits only |
| [Documentation writer](agents/doc-writer.md) | Changed behavior needs verified installation, usage, API, or runbook documentation |

A narrow, low-risk change can be reviewed directly. Core installation means the
roles are available, not that every role runs on every change.

A dispatch brief includes the goal and requirements, absolute repository or plan
path, base and files where relevant, allowed actions or owned write paths, and
the expected evidence. Resolve these before starting the role. Prefer a single
owner for integration. Reviewers may run independently; writers must not overlap
each other or the files currently being reviewed. Review again only where later
edits change the evidence.

If a native role is absent but generic subagents are available, supply its full
linked brief to a generic agent with appropriate host permissions. If no independent
context is available, use the brief inline and disclose that limitation. Do not
invent a native tool, claim a tool allowlist is an OS sandbox, or retry a denied
operation through a less restricted child. Return reviewer results as text; a
special report-file protocol is unnecessary.
