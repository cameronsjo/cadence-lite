---
name: polish
description: Use when finishing a feature branch before opening or updating a PR — "wrap it up", "polish", "prep for PR", "ship it" — for any change beyond a single line. NOT for mid-build checkpoints.
---

# Polish

A dedicated review pass before the PR — hunting real defects, not tidying. On non-trivial changes this pass surfaces a real finding more often than not; skipping it ships that finding to the reviewer.

## Steps

1. **Review the full diff against the base branch, twice, with different questions.**
   - *Correctness pass:* bugs, unhandled edge cases, broken assumptions, missing error handling at system boundaries, security-sensitive spots. Read as a hostile reviewer, not the author.
   - *Simplification pass:* dead code, needless abstraction, duplication of something that already exists in the repo, opportunities to reuse instead of add.
   - If subagent dispatch is available, a fresh-context reviewer agent over the diff is worth one dispatch — its distance catches what the author cannot.
2. **Fix findings now.** Findings fold into the branch before the PR, or are explicitly declined with a one-line reason in the PR body. Never silently dropped.
3. **Run the tests fresh** — the full relevant suite, after the fixes, reading output and exit code. A pre-fix green does not carry forward.
4. **Changelog when consumer-visible.** A change to anything released or consumed by others gets its changelog entry in the same branch. Omit only for no-consumer-effect changes (typo, comment, test-only), and say so.
5. **Housekeeping last:** accidental files, debug output, scope creep, commit message quality.

Then open or update the PR: title and body carry the problem, the scope, exclusions, and the verification verdict with its proving command.
