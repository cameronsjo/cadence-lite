---
name: outro
description: Closes a session by reconciling plans, committing and pushing work within the user's authorization, and recording loose ends. Not for finishing a branch while continuing the session.
---

# Outro

Leave the workspace so a cold session — or tomorrow's you — resumes without archaeology. The failure this prevents: work that ended in conversation but not on disk, and follow-ups that evaporate.

## Steps

1. **Reconcile the plan.** Compare the active plan document against the branch log and PR state; tick what actually shipped, correct its status and next-action line. Git is ground truth; the plan is the index. When no plan exists, report the actual stopping point without creating a plan solely for closeout.
2. **Make work durable.** Commit completed units and push the session's branch within the user's authorization; mark broken checkpoints `wip: broken — <reason>`. Recheck branch and dirty paths before staging, and preserve unrelated work. Honor explicit no-commit, no-push, or leave-open instructions; report the recovery boundary if work must remain local. In an autonomous or background turn, take no unasked write, commit, push, or PR-ready action — list each as pending and leave disk state as is; never mark a draft PR ready without asking.
3. **Disposition every loose end.** Cover every open item surfaced in the session — not only threads this session opened — including ideas, findings, and deferred items. Each one gets an explicit fate: done, filed (issue or plan line, named), deferred (landing spot and verified owner — operator, next session, or peer — named, never disclaimed as "not mine"), or dropped (said out loud). Nothing is silently dropped.
4. **Close with state, not story.** A short report: durable stopping point, verification state with its proving command, and the single next action.
