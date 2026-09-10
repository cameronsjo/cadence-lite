---
name: outro
description: Close a session by reconciling plans, preserving work, and recording loose ends. Not for finishing a branch while continuing the session.
---

# Outro

Leave the workspace so a cold session — or tomorrow's you — resumes without archaeology. The failure this prevents: work that ended in conversation but not on disk, and follow-ups that evaporate.

## Steps

1. **Reconcile the plan.** Compare the active plan document against the branch log and PR state; tick what actually shipped, correct its status and next-action line. Git is ground truth; the plan is the index. When no plan exists, report the actual stopping point without creating a plan solely for closeout.
2. **Make work durable.** Commit completed units and push the session's branch within the user's authorization; mark broken checkpoints `wip: broken — <reason>`. Recheck branch and dirty paths before staging, and preserve unrelated work. Honor explicit no-commit, no-push, or leave-open instructions; report the recovery boundary if work must remain local.
3. **Disposition every loose end.** List everything raised this session that was not finished — ideas, findings, deferred items. Each one gets an explicit fate: done, filed (issue or plan line, named), deferred (landing spot named), or dropped (said out loud). Nothing is silently dropped.
4. **Close with state, not story.** A short report: durable stopping point, verification state with its proving command, and the single next action. No session narrative.
