---
name: polish
description: Review and fix a branch before opening or updating a PR, or when asked to polish it. Not for routine progress checkpoints or session closeout.
---

# Polish

A dedicated review pass before the PR — hunting real defects, not tidying. On non-trivial changes this pass surfaces a real finding more often than not; skipping it ships that finding to the reviewer.

## Steps

1. **Resolve the actual review target.** Identify the repository, base, and net diff, including committed and uncommitted work. A clean working tree is not necessarily an empty branch diff. Preserve unrelated changes.
2. **Review for correctness and simplification.** Check broken assumptions, system boundaries, security-sensitive changes, duplication, and needless abstraction. Scale independent or specialized review to the risk and repository requirements; a fixed number of passes is not the objective.
3. **Fix and verify.** Fix supported findings within the request or explain why they remain. A review-only request permits findings and read-only checks, not edits. Run relevant checks after fixes, read output and exit status, and report what they prove. Reuse valid evidence for an unchanged target; do not repeat checks solely because a workflow phase changed.
4. **Changelog when consumer-visible.** A change to anything released or consumed by others gets its changelog entry in the same branch. Omit only for no-consumer-effect changes (typo, comment, test-only), and say so.
5. **Housekeeping last:** accidental files, debug output, scope creep, commit message quality.

Complete the requested delivery: open or update a PR when authorized, with the problem, change, and verification verdict plus its proving command. A polish-only request ends with the reviewed change and findings. Leaving a PR open, merging, and deploying are distinct outcomes; preserve the user's chosen boundary.
