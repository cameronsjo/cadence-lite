---
name: writing-pull-requests
description: Write a pull request title and description, a commit message, or a review comment for a change. Not for reviewing or fixing the change, or for other prose.
---

# Writing pull requests

A PR description, commit message, or review comment is read by someone who was
not in the session. It answers what changes, why it matters, and what shows it
works. The failure this prevents: describing the session instead of the change.
The path taken, the review rounds, and the defects in earlier attempts read as
thoroughness but bury what the reader came for.

## The cold-reader test

Write from the merged state, as if someone else did the work. Cut any sentence
that only makes sense to someone who watched the session.

| Narrates the session | Names the change |
| --- | --- |
| "Round 2 addressed the reviewer." | "Handles the empty-list case." |
| "The first draft missed skipped hosts." | "Checks skipped hosts too." |
| "Part 3 of the cleanup." | Drop it; it names no change. |

## Skeleton

- **Title.** What the change does, in the imperative. On a squash-merge repository
  it becomes the commit subject on the default branch, so it outlives the PR.
- **Opening.** Two or three sentences, no heading: the problem, what is now true,
  and the linked issue, with the host's closing keyword when merging should close
  it. A reviewer sees the link first there.
- **Changes.** A few short bullets, one change each. Add a reason only where the
  change does not explain itself.
- **Verification.** One attributed line per kind of evidence, as below.
- **Not in this PR.** Optional: related work deliberately left out, or the plan.

Omit a section with nothing to say. A repository's PR template or contribution
rules take precedence over this layout. Keep it short; the diff carries the detail.

```markdown
The posture report called a host clean when its probe could not run. Host rows
now name the probe's result. Closes #123.

## Changes

- **Report a skipped probe as unknown, not clean.**

## Verification

- Author-run: 137 assertions pass in tests/posture/run-tests.sh.
- CI: the lint check was skipped on this branch, so it is not a pass.
```

## Attribute verification

Verification is a claim about evidence, so say whose evidence it is; merging the
kinds overstates what was checked.

- **Author-run:** name the command and result, so the reader knows it was not
  independently reproduced.
- **CI:** name the check. A skipped or rate-limited check is not a pass; report
  what happened, not the color.
- **Review:** a completed review whose findings were addressed is evidence. A
  requested review that never completed is not.

Say what was not verified when a reader could assume it was: "Not run on Windows."

## Security fixes

Users of a fixed vulnerability need to know what was exposed, which released
versions are affected, and what to do. A public repository's PR is readable as
soon as it opens, and a private one's by everyone later given access. So unless
the repository is private and the fix is already released, the PR says only that
it includes a security fix and points to the advisory or private tracker. The
exposure details go in the advisory, published with the fixed release. This holds
even when the fix was incidental to the PR.

## Commit messages

The same test applies; a commit body outlives the PR.

- Follow the repository's commit convention. Otherwise use an imperative subject
  of about 70 characters and a body, wrapped near 80, that says why.
- A commit fixing a defect introduced earlier on the same branch states the final
  behavior, not the earlier attempt.
- Reword or squash only unpushed commits. Rewriting a branch under review detaches
  comments from the code they discuss; correct it with a follow-up commit instead.
- Keep closing keywords away from issue numbers you do not mean to close. Hosts
  often parse them anywhere, even in a sentence saying an issue stays open.

## Review comments

Open with the verdict: ready to merge, or what blocks it. Then one finding per
line, anchored to a file and line: `src/parse.rs:42: off-by-one drops the last
row`. Post line-specific findings inline on the diff where the host supports it.
A finding from a second pass reads the same as one from the first; do not number
rounds.

## Before posting

Read only the title, headings, bold text, and each section's first sentence. If
that does not carry what changed, why, and what proves it, revise. Let evidence
make the case rather than praise ("a thorough pass"). If the PR grew beyond its
request, say why in the opening, or the reviewer meets an unexplained diff.

Check the text for secrets, local paths, and internal hostnames before it reaches
a shared place. Writing a description does not authorize opening, updating, or
posting it; follow the requested delivery.
