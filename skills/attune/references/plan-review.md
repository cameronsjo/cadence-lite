# Review a substantial plan

Read the [plan-reviewer brief](agents/plan-reviewer.md) before presenting a
substantial plan. Use an independent reviewer when available, and fold supported
findings into the requested plan without adding a permission gate to present it.
A specified small fix does not need a plan or a panel.

Add only the roles that have a concrete question to answer:

| Role | Trigger |
| --- | --- |
| [Security posture reviewer](agents/security-posture-reviewer.md) | Introducing, activating, weakening, removing, narrowing coverage of, or exposing a security control, including previously merged code |
| [Red team reviewer](agents/red-team-reviewer.md) | Destructive/migration/shared-state operations, rollback claims, or verification recipes that need live-state evidence |
| [Agent experience reviewer](agents/agent-experience-reviewer.md) | Agent-consumed instructions, skills, schemas, or machine output |
| [User experience reviewer](agents/user-experience-reviewer.md) | A consequential change to a user's journey or decision |
| [Developer experience reviewer](agents/developer-experience-reviewer.md) | Setup, build, test, CI, or contributor workflow |
| [Operability reviewer](agents/operability-reviewer.md) | Partial failure, retries, background work, recovery, or operational procedures |

Give a reviewer the goal, complete plan, relevant requirements, target paths, and
a read-only assignment. Native roles use the prefix cadence-lite-. When native
registration is absent, pass the full linked brief to an available generic
subagent. If dispatch is unavailable, use the brief inline and label the review
as inline; never claim independence or fabricate a successful invocation.

Read returned findings and verify them before changing the plan. Record the
roles used, their status and examined revision, decisions on findings, and any
unverified boundary. Missing or empty output is a failed review. Re-review only
the parts changed materially by a revision. Existing approval persists unless
the revision introduces a consequential new choice or changes authorized scope.
