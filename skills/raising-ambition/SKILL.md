---
name: raising-ambition
description: Raises the ambition of a task, plan, or deliverable along three lenses (Altitude, Depth, Range) when the user asks to think bigger, raise the bar, or ask what an expert would do, or asks the agent to push its own approach further. Not for prompt wording or deciding what to build (attune).
---

# Raising Ambition

Turn an ordinary ask into a raised one along three lenses: Altitude, Depth, and Range. The lenses come from Felix Rieseberg's post [How to be more ambitious: A tutorial for humans with models](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/) (2026-10-13). This skill paraphrases it; no quote runs longer than a phrase. The post also names Speed (the same work, faster) and skips it; so does this skill.

Apply a lens only when its tell fires. A raised ask that applies every lens to every task is noise, not ambition.

## Where it sits

- It runs inside or after `attune`'s intent check, never instead of it. An ask that is still unclear finishes attune Step 1 first.
- This skill changes what is asked for, not how a prompt sentence is worded.

## Pick the mode

Take the first rule that matches:

1. **The turn is autonomous or unattended** → act mode. Apply only in-scope moves; scope-changing moves go in the final report as one-line proposals.
2. **Work has already started, or the user asked you to raise your own approach or plan** → act mode.
3. **Otherwise** → interview mode.

## The scope-change test

Every lens can produce moves that change scope, Depth included. A move changes scope when it changes any of:

- the artifact's type (a table becomes a decision memo; a deck becomes a monitoring system)
- its audience
- the tools, infrastructure, or data access it needs: anything installed, provisioned, or left running (a database, a service, a scheduled job), or data the ask did not already provide
- the effort: it adds a deliverable, or work the user would notice as clearly extra time (roughly double or more)

A move that changes none of these goes ahead without asking: a sharper method, a held-out check, a stated target, an analysis script over data already in hand. A scope-changing move never goes ahead silently. In interview mode it becomes a question marked `[scope]`; in act mode it becomes a one-line proposal that waits for a go.

## The lenses

### Altitude: the goal beyond the goal

- **Ask:** what should happen after this work is delivered?
- **Tell:** the work feeds a meeting or a decision. If people will meet about it, the real deliverable is the decision.
- **Weak for:** creative work (a poem, a story, a design for its own sake). Skip it there and say why.
- **Moves:** from "update the numbers" to "what changed, why, and what to do"; from "what to do" to "the few decisions that are most urgent, each with arguments for and against"; from "a better report" to "a better way to catch the problem early than this report". Most of these change the artifact's type, so they are scope changes.
- **Prerequisite:** a durable version that takes the human out of the loop usually needs plumbing first: data access, a way to map versions to code, environments to reproduce and verify in. Name that plumbing as a prerequisite. Never write the plan as if it already exists.

### Depth: work the way the field's best practitioner works

- **Tell:** the user wants this done well rather than bigger: "get this right", a number to hit, a result someone will check.
- **Instruments, not vocabulary.** Use the tools the field's best people use: a statistical model, not a markdown table. Sounding like an expert while keeping the same method is the failure this lens exists to prevent. When the instrument needs new tools or infrastructure, propose it rather than building it.
- **Raw material.** Start from the rawest data already in hand, not the summary someone made of it. Fetching data the ask did not provide is a proposal.
- **A specific, hard target.** Ask for 200 ms when the request said 5 s. Treat it as a goal to test, not a promise: work toward it, measure with the outside judge, and report the gap. The post cites goal-setting research (Locke and Latham) finding that specific hard goals beat "do your best". If reaching the target needs clearly more effort than the ask, propose that.
- **Test held beliefs.** Take a belief the user holds ("churn is an onboarding problem") and try to reproduce it from the raw data. Report whether it holds.
- **New knowledge.** Once deep in the data, look for what nobody knows yet, such as an earlier signal, and show it predicts on data it has not seen.

A four-question check for Depth, adapted from the post:

1. What would a top practitioner do here that the ask leaves out?
2. What raw material would they start from?
3. Which specific methods and tools would they use?
4. What, other than you or the user, would show the result is right?

### Range: methods from other fields

- **Tell:** the deliverable is named by its format ("a deck", "a memo") rather than by what it must achieve.
- **Turn the noun into verbs.** "A QBR deck" becomes "get busy people to believe a cause-and-effect story and decide under uncertainty in 30 minutes". The verbs show which fields bear on it.
- **List fields with one concrete method each.** For example: epidemiology adds a control group; journalism adds two independent sources per claim; forensic accounting adds tracing each number back to a ledger entry.
- **Use the method; never voice the practitioner.** Role-play makes the transcript stranger and the result no better.

```text
Don't: "Now, speaking as a short seller, this company smells weak..."
Do:    "A short seller's method: list the three claims the deck rests on,
        find the raw number behind each, and look for the one that fails."
```

## The outside judge

Never grade your own work. Before calling the work done, name a tool, test, measurement, or person that is neither you nor the user: a held-out dataset, a test suite, a benchmark, a reconciliation against the source system, a colleague who will act on the result. If none exists, say "no outside judge available" and name what would serve as one. Self-review, a second pass by the same model, or "it looks right" is never the judge.

## Interview mode

- **One batched round**, written as prose. Use a structured multiple-choice prompt only for a choice between real options.
- **Only the tells that fired.** One or two questions per fired lens, plus the outside judge. Don't ask about a lens you ruled out.
- **Lead with a guess.** Open each question with your best guess for the user to correct ("I'd guess the decision this feeds is next quarter's support headcount; right?").
- **Mark scope.** Prefix `[scope]` on any question whose yes answer would change scope under the test above.
- **Stop after the questions.** No raised ask yet, not even a provisional one; the answers decide it. Don't promise the work itself (the poem, the deck) either: a closing line may say only that the raised ask follows the answers.

After the user answers, output:

1. The raised ask, as the request the user would now make.
2. One line per lens applied: what it changed.
3. One line naming the lenses skipped and why.
4. The outside judge, or "no outside judge available" plus what would serve.

Then hand off: when attune is active, it resumes at Step 2 with the raised ask; otherwise stop, and the user starts the work.

## Act mode

Apply the in-scope moves directly. Hold every scope-changing move for a go; never quietly widen the deliverable, however natural the step looks. Report in this order:

1. What was applied, one line each, with the lens that drove it.
2. Proposals waiting for a go, one line each: the move, which part of the scope-change test it trips, and its cost.
3. One line naming the lenses skipped and why.
4. The outside judge, or "no outside judge available" plus what would serve.

In an autonomous turn, the proposals go in the final report; nothing waits mid-turn.
