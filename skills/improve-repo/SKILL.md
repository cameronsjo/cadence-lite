---
name: improve-repo
description: Improve a repository's delivery workflow using a real task to find and fix demonstrated friction. Not for routine feature work, an automatic retrospective, or unbounded cleanup.
---

# Improve Repository Delivery

Own a bounded improvement to how people and agents turn goals into complete,
verified, mergeable changes. The failure this prevents: polishing instructions
while the actual path to shipping still needs repeated intervention.

## Ground the scope

Honor the requested mode: an audit produces findings, not edits. When improvements
are requested, choose a small, high-value scope from evidence and resolve only
consequential open decisions. Preserve existing approval; ownership does not grant
new permissions, release authority, or control over someone else's work. Do not
merge or deploy without authorization.

Orient in the actual product, architecture, agent instructions, skills, development
setup, tests, and CI. Follow one real feature or delivery task through the relevant
interface, backend, persistence, workers, and external services; do not invent
layers or a feature outside the request. Define completion as an observable user
outcome. Note where unfinished work, confusion, or unnecessary effort occurs and
what intervention is needed. Inspect only as deeply as the chosen scope requires.

## Improve the path

- Consolidate or clarify existing mechanisms before adding process. Inspect
  existing code and suitable services before building custom infrastructure or
  integrations. New process needs a demonstrated problem; cleanup needs a
  justified connection to the chosen outcome.
- Keep primary agent instructions short and accurate: product purpose, important
  code locations, critical boundaries, and verification. Link deeper guidance,
  give skills distinct purposes, and load them when relevant. Preserve needed
  domain context while removing duplicated sources of truth.
- Keep one owner accountable for integration and completion. Delegate only
  authorized, bounded, independent work that reduces total effort. Do not delegate
  recursively or repeat review exchanges without new evidence. Match planning,
  testing, and review to risk; separate blocking defects from optional improvements.
- Implement the authorized improvements. If an approach repeatedly fails,
  investigate the cause and change direction rather than repeating it unchanged.

## Verify and stop

Make essential checks easy to run locally and in CI. Exercise the affected delivery
path, preserving useful regression coverage. Remove a test or check only with
evidence that its protection is obsolete, redundant, or ineffective; fix or replace
an ineffective check when that protection is still needed. Measure performance
before and after the change before claiming an improvement.

Report what changed, why it helps, what passed or failed, which parts of the path
were exercised, and what remains unverified or blocked. A component check is not
proof of the whole user outcome. Stop when the agreed scope is complete and
sufficiently verified; report a genuine blocker rather than claiming completion.
Use the observed intervention on this task to recommend the next improvement,
not to expand the current scope automatically.
