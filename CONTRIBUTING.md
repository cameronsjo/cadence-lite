# Contributing

Issues and pull requests are welcome. The merge process is unusual, so read this first
if you are opening a PR.

## Every commit on `main` is signed by the maintainer

Machines that consume this repo pull it directly and wire the skill files into a live
agent session. That makes the content in `main` *executable instructions* on every
consuming machine, arriving without review.

The control on that is signature verification: consumers verify that the tip of `main`
carries a good signature from the maintainer's key before they let a change through. A
`main` that admits unsigned or differently-signed commits gives that check nothing to
stand on. The repo enforces this with a ruleset requiring signed commits on `main`.

## Consequence: PRs are not merged through the GitHub web interface

When GitHub merges a PR for you — the green button, in any of its modes — the resulting
merge or squash commit is signed by **GitHub's own web-flow key**, not by the
maintainer's. Consumers would either reject that commit, or would have to trust the
web-flow key, which would mean anything merged through the web interface is
automatically trusted. Neither is acceptable, so the button is not used.

Instead:

1. You open a PR as normal.
2. The maintainer reviews it, fetches the branch, and merges it **locally**.
3. The resulting commits are signed with the maintainer's key and pushed.
4. GitHub marks your PR as merged once the commits land.

Your authorship is preserved — you stay the commit author, and co-author trailers are
added where a change is collaborative. Only the *signature* is the maintainer's, because
the signature is an assertion about review, not about authorship.

Practical effects for you:

- **Do not** rebase or force-push the branch after review starts, without saying so.
- **Do** expect the merge to appear slightly after approval rather than instantly.
- **Do** expect the landed commit SHA to differ from your branch tip.

## What makes a good change here

Each skill is deliberately short, and length is a cost — these files are loaded into an
agent's working context every session that uses them. A change that adds a paragraph
should be able to say what failure that paragraph prevents.

Useful contributions:

- A step that is ambiguous enough that different agents read it differently.
- A wiring recipe for a harness not yet covered in the README.
- A failure mode a skill claims to prevent but does not actually prevent as written.
- An optional skill with a distinct request and useful output, backed by real use
  that demonstrates a gap in the existing skills. Keep the default rhythm small.

Less useful:

- Restating a step in more words.
- Adding vendor-specific instructions to portable skills or role bodies. Native
  tool grants and formats belong in the adapters and generator. Role names and
  their task contracts may be referenced from skills.
- Adding skills that duplicate existing behavior or turn ordinary work into a
  mandatory ceremony. Catalog size and instruction length are costs, not goals.

## Testing a change

Edit role bodies and the shared contract under `agents/`; edit role metadata in
`agents/manifest.json`. Run `npm run generate` after a source change. Native
definitions and skill-local agent briefs are generated, not separately maintained.

Run `npm run check`, `npm test`, and `git diff --check`. Node.js 22+ is required;
tests also use Python 3.11+ for TOML parsing. These checks establish packaging,
reference closure, installer ownership behavior, and the Pi process protocol.

Skill markdown is behavioral code. Also exercise a changed workflow on real work
and record the target, observed result, and limits. An isolated fixture or a parser
check is not live harness acceptance. Keep verification claims bounded by evidence.
