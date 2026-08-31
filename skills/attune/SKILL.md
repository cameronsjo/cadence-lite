---
name: attune
description: Use when starting work that will require tools — a feature, design, refactor, investigation, or analysis — before writing any implementation. Triggers on a new task request, "let's build", "add support for", "how should we". Writes and commits a plan file before implementation. NOT for pure factual questions.
---

# Attune

Understand, propose, and get approval before implementing. The failure this prevents: going straight from acceptance criteria to code, so the first design decision the user sees is one already built.

## Route first

Every task lands in one of four tiers. Recognize the tier as the conversation unfolds and suggest it — the user confirms, redirects, or says "just do it". Suggestion, never enforcement.

| Tier | Signals | Path |
| --- | --- | --- |
| **Ready to implement** | Clear specification, small and well-understood change | Execute directly; steps below compress to one short message |
| **Needs plan** | Creative work, design decisions, refactors with choices | The full steps below; plan file persists the decisions |
| **Needs spec** | Large or uncertain work, public interfaces, multi-part change | Plan file plus a requirements section (RFC 2119 keywords, acceptance criteria) that the checklist must satisfy |
| **Needs research** | The unknowns dominate the ask | Deep dive first — read code, run experiments — then re-triage into one of the tiers above |

A research round ends by re-stating the tier it now routes to; research is never the destination. When a task outgrows its tier mid-flight (a plan sprouts interface decisions, a spec reveals unknowns), say so and move up — never silently stay light.

## Steps

1. **Clarify the real ask.** Read the relevant code, tests, and recent history. Restate the goal in one or two sentences; surface any genuinely blocking ambiguity as a question now, not mid-build.
2. **Propose approaches.** Present 2–3 viable approaches, one sentence each, with a named recommendation and why. If only one approach is sensible, say so explicitly ("single obvious approach") rather than manufacturing alternatives.
3. **Hold for approval.** Do not implement until the user approves an approach. Approval of the goal is not approval of an approach.
4. **Persist the plan.** Write the approved plan to `docs/plans/YYYY-MM-DD-<slug>.md` — goal, chosen approach, alternatives declined and why, step checklist — and commit it before implementation starts.
5. **Execute against the plan.** Tick checklist items in the same commit that lands the work. When reality forces a deviation, record it in the plan in that same commit — deviations are signal, not failure.

## Scale to fit

The tier sets the floor. A small, well-understood change compresses steps 1–3 into one short message (ask + recommended approach + "proceeding unless you object") and may skip the plan file. A change that restructures components, adds a subsystem, or changes a public interface always gets the full sequence — and a spec tier gets its requirements section. When in doubt, take the heavier path; upgrade mid-task if hidden complexity appears, never downgrade.
