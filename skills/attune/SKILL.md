---
name: attune
description: Plans or investigates work with consequential unresolved choices, or a request where a guess at what the user wants would change what gets built, before implementation, writing and, when authorized, committing a plan file for substantial decisions. Use for a requested plan; not a specified small fix or continuation of approved work.
---

# Attune

Resolve consequential choices before building. The failure this prevents: making a product or design decision the user never authorized, or repeatedly stopping work they already approved.

## Route first

Choose the lightest approach that resolves the actual uncertainty. The user does not need to choose a workflow tier.

| Tier | Signals | Path |
| --- | --- | --- |
| **Ready to implement** | Clear specification, small and well-understood change | Execute directly within the request; no separate planning gate |
| **Needs plan** | Creative work, design decisions, refactors with choices | The full steps below; plan file persists the decisions |
| **Needs spec** | Large or uncertain work, public interfaces, multi-part change | Plan file plus a requirements section (RFC 2119 keywords, acceptance criteria) that the checklist must satisfy |
| **Needs research** | The unknowns dominate the ask | Deep dive first — read code, run experiments — then re-triage into one of the tiers above |

An investigation request can end with evidence and a recommendation. When investigation is part of an approved implementation, continue once the uncertainty is resolved; seek a decision only if the result changes the agreed scope or introduces a consequential choice.

## Steps

1. **Establish the outcome and the why.** Read the relevant evidence and identify what completion means within the request, without asking what the evidence already answers. Then check what you know about what the user wants and why, and which parts you are filling in yourself; that picture is usually thinner than it feels. When something that would change what gets built is missing (who it is for, the problem behind it, what done looks like, or a choice about how it gets made that the user has signalled they want to own or that is open and costly to reverse), ask before drafting or building: put it in one message, lead with a guess they can correct, or ask one open question when you have no guess, and wait for the answer. Otherwise proceed and name any default you picked as your call. Settling intent is not an approval gate: a plan request still ends in a presented plan, on your stated guesses if the user declines to answer or the session runs without a user.
2. **Resolve consequential choices.** Recommend an approach and explain real alternatives when they matter. A request to draft or propose a plan includes presenting it. Preserve an explicit request to hold a draft. Do not implement a consequential approach the user has not seen — approval of the goal is not approval of the approach. A plan-only request does not authorize implementation.
3. **Review and persist substantial decisions.** Use the [plan template](references/plan-template.md) and [conditional plan review](references/plan-review.md), with its [plan-reviewer brief](references/agents/plan-reviewer.md), for substantial plans. Record status, next action, review evidence, and the decisions needed to implement. Before implementing an approved substantial plan, persist it at the repository's plan location (default `docs/plans/YYYY-MM-DD-<slug>.md`) and commit it when authorized. Preserve an explicit no-commit instruction and report the resulting recovery boundary.
4. **Complete authorized work.** Carry the approved approach through implementation, relevant verification, and requested delivery. Fix failures caused by the change and rerun affected checks. Update the plan with the work if a plan exists; do not ask again for settled choices.

## Scale to fit

A small fix needs no plan artifact. Cross-cutting work or public-interface decisions need enough durable detail to prevent a rewrite. Additional steps alone do not revoke approval. Stop for a new consequential decision, a change in scope, or missing execution authority. Respect requested review, merge, deployment, push, and close-out boundaries — completing the work never implies pushing it or leaving it closed unless that was requested.
