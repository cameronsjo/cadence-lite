---
name: attune
description: Plan or investigate work with consequential unresolved choices before implementation. Use for a requested plan; not a specified small fix or continuation of approved work.
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

1. **Establish the outcome.** Read the relevant evidence and identify what completion means within the request. Use existing context and approval; ask only for information that materially changes the result.
2. **Resolve consequential choices.** Recommend an approach and explain real alternatives when they matter. A request to draft or propose a plan includes presenting it. Preserve an explicit request to hold a draft. A plan-only request does not authorize implementation.
3. **Persist substantial decisions.** Before implementing an approved substantial plan, commit it at the repository's plan location (default `docs/plans/YYYY-MM-DD-<slug>.md`) with the goal, approach, real alternatives, checklist, and completion evidence.
4. **Complete authorized work.** Carry the approved approach through implementation, relevant verification, and requested delivery. Fix failures caused by the change and rerun affected checks. Update the plan with the work; do not ask again for settled choices.

## Scale to fit

A small fix needs no plan artifact. Cross-cutting work or public-interface decisions need enough durable detail to prevent a rewrite. Additional steps alone do not revoke approval. Stop for a new consequential decision, a change in scope, or missing execution authority. Respect requested review, merge, and deployment boundaries.
