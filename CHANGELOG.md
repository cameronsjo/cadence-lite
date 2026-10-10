# Changelog

## Unreleased

- Attune asks before it builds on a guess. Step 1 now checks what the agent
  knows about what the user wants and why; when something that would change what
  gets built is missing, it asks in one message, leading with a guess the user
  can correct. This is not an approval gate: a plan request still ends in a
  presented plan, on stated guesses if the user declines. The description also
  routes a request where a guess at what the user wants would change the result.
- Write every skill description in third person, and link the reviewer briefs
  named in Attune's and Polish's entrypoints directly, following Anthropic's
  skill-authoring best practices.
- Add optional `writing-pull-requests` for PR descriptions, commit messages, and
  review comments written for a reader who missed the session: attributed
  verification and security fixes disclosed through an advisory. Polish points to
  it when installed; the default five-skill installation is unchanged.
- Clarify Polish's changelog step to follow each project's convention; trim generic
  strategy text from improve-repo and a restated prohibition from Outro.
- Add eleven portable specialist roles with generated native Claude Code, Codex,
  OpenCode, and Pi adapters; keep Cadence Voice outside Lite.
- Strengthen Polish with explicit review scope, conditional independent review,
  test/documentation writers, final verification, and honest role outcomes.
- Add conditional plan review and a shared status/next-action plan template.
- Document npx skills and Pi installation; add a collision-safe native installer,
  optional bounded Pi dispatch, generated-file checks, and packaging tests.
- Add optional `improve-repo` for evidence-backed repository delivery improvements,
  grounded in one real task and verified outcomes. Audit requests stay read-only;
  the default five-skill installation and release permissions are unchanged.
- Add optional `triage` for backlog decisions and `adapt` for evidence-backed
  workflow improvements. Both recommend by default and keep writes within the
  user's authorization; the default five-skill installation is unchanged.
- Make planning conditional on unresolved choices and preserve approval through
  the requested delivery. A specified small fix can proceed directly.
- Scope review, capture, and closeout to user authorization; retain evidence
  before completion claims and avoid repeating checks on unchanged targets.
