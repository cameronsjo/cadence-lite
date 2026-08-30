---
name: attune
description: Use when starting work that will require tools — a feature, design, refactor, investigation, or analysis — before writing any implementation. Triggers on a new task request, "let's build", "add support for", "how should we". Writes and commits a plan file before implementation. NOT for pure factual questions.
---

# Attune

Understand, propose, and get approval before implementing. The failure this prevents: going straight from acceptance criteria to code, so the first design decision the user sees is one already built.

## Steps

1. **Clarify the real ask.** Read the relevant code, tests, and recent history. Restate the goal in one or two sentences; surface any genuinely blocking ambiguity as a question now, not mid-build.
2. **Propose approaches.** Present 2–3 viable approaches, one sentence each, with a named recommendation and why. If only one approach is sensible, say so explicitly ("single obvious approach") rather than manufacturing alternatives.
3. **Hold for approval.** Do not implement until the user approves an approach. Approval of the goal is not approval of an approach.
4. **Persist the plan.** Write the approved plan to `docs/plans/YYYY-MM-DD-<slug>.md` — goal, chosen approach, alternatives declined and why, step checklist — and commit it before implementation starts.
5. **Execute against the plan.** Tick checklist items in the same commit that lands the work. When reality forces a deviation, record it in the plan in that same commit — deviations are signal, not failure.

## Scale to fit

A small, well-understood change compresses steps 1–3 into one short message (ask + recommended approach + "proceeding unless you object") and may skip the plan file. A change that restructures components, adds a subsystem, or changes a public interface always gets the full sequence. When in doubt, take the heavier path; upgrade mid-task if hidden complexity appears, never downgrade.
