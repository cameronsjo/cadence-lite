---
name: polish
description: Review and fix a branch before opening or updating a PR, or when asked to polish it. Not for routine progress checkpoints or session closeout.
---

# Polish

Find actionable defects in the change that will ship, fix authorized findings,
and leave evidence of what was reviewed. A missing review is not a clean review.

## Establish the target

Identify the repository, branch, base, and changed-file set. Include the net
committed diff and relevant staged, unstaged, and untracked work. A clean working
tree is not necessarily an empty branch diff. Resolve an ambiguous base before
dispatch; never silently review a different checkout or substitute the last commit.

Preserve unrelated work and state whether the request permits fixes or is
review-only. Behavioral Markdown (skills, agents, rules, and tool instructions)
is source for this purpose, even when its extension looks like documentation.

## Review and address findings

Read [review selection](references/review-selection.md). Select roles from the
actual risks and affected surfaces, then read only their linked briefs.
For a consequential change, use a fresh code reviewer when dispatch is available.
Use independent security review for security-sensitive changes and agent capability
changes; add agent-experience review for agent-consumed artifacts.

Give every selected reviewer the same repository, base, file set, and relevant
requirements. Include permitted actions and the evidence needed in the return.
A reviewer does not fix the material it is judging. A failed or unavailable
dispatch stays visible; an inline fallback must be identified as lacking independent
context. Do not make every installed role a mandatory pass.

Fix supported findings within the request. Record each as fixed, deferred with a
named landing spot, or declined with a reason. Use test-author when meaningful
behavioral coverage is missing, and doc-writer when changed behavior needs
documentation. Give writers disjoint, explicit paths; review the combined result.
A review-only request permits neither writer nor source edits.

## Verify the final change

After the last writer, run the repository's configured formatter, linter, and type
checker where applicable, scoped to the changed files when supported. In review-only
mode use non-writing checks. Inspect scope before any tool that could rewrite the
repository; do not introduce new tooling or run a broad rewrite as housekeeping.

Run relevant tests on the final change and inspect output and exit status. Rerun
checks and review affected by a subsequent fix; unchanged evidence can be reused.
A source inspection, generated manifest check, or mocked child process does not
prove a live integration works. Say which boundary remains untested.

Add the project's changelog entry for consumer-visible changes. Check for
accidental files, debug output, and scope creep after substantive work.

## Return evidence and complete delivery

Report the target, findings and dispositions, and each selected role's status:
completed (with findings or none), partial, unavailable, failed, or inline.
An empty return is failed, not completed. Name checks actually run, their results,
and remaining blockers. Evidence applies only to the examined state.

Open or update a PR only when the requested delivery authorizes it. A polish-only
request ends with the reviewed change and findings. Preserve review-only,
no-commit, no-push, leave-open, merge, and deployment boundaries.
