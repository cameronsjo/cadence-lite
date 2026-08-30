---
name: outro
description: Use when ending a session — "wrap up the session", "sign off", "good evening", "done for today" — or when the user signals stopping. Commits and pushes unfinished work as part of closing out. NOT for finishing a branch mid-session (use polish).
---

# Outro

Leave the workspace so a cold session — or tomorrow's you — resumes without archaeology. The failure this prevents: work that ended in conversation but not on disk, and follow-ups that evaporate.

## Steps

1. **Reconcile the plan.** Compare the active plan document against the branch log and PR state; tick what actually shipped, correct its status and next-step line. Git is ground truth; the plan is the index.
2. **Make work durable.** Commit completed units; mark broken checkpoints `wip: broken — <reason>`; push any branch that has a remote. Uncommitted work is invisible to recovery.
3. **Disposition every loose end.** List everything raised this session that was not finished — ideas, findings, deferred items. Each one gets an explicit fate: done, filed (issue or plan line, named), deferred (landing spot named), or dropped (said out loud). Nothing is silently dropped.
4. **Close with state, not story.** A short report: durable stopping point, verification state with its proving command, and the single next action. No session narrative.
