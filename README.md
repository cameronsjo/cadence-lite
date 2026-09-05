# cadence-lite

A small set of skills for session rhythm, backlog decisions, and targeted workflow
improvements.

This is the portable core of a larger methodology — the part that needs no hooks, no
binaries, and no plugin runtime. Every skill is a single `SKILL.md` file of plain
markdown. If your agent harness can load a directory of skills, it can run this.

## The rhythm

Four skills mark phases when those phases are needed. Capture rides alongside them.
Triage and adapt are optional workflows, not additional phases.

```text
  intro (no task yet)        attune (unresolved choices)
          │                          │
          └──────▶  execute  ◀────────┘
                       │
          polish (PR preparation) ──▶ outro (session end)

  A specified task starts at execute.
  Capture saves side ideas, then returns to the active phase.
```

| Skill     | When it runs                          | What it prevents                                                     |
| --------- | ------------------------------------- | -------------------------------------------------------------------- |
| `intro`   | First message is a greeting, no task  | Starting blind — redoing finished work, missing an in-flight plan     |
| `attune`  | A requested plan or consequential unresolved choices | Building an unapproved decision or reopening settled choices |
| `polish`  | Before opening or updating a PR       | Shipping the defect a review pass would have caught                   |
| `outro`   | Ending the session                    | Work that ended in conversation but never on disk                     |
| `capture` | An idea lands that is not the work    | A good idea dying in scrollback, or derailing the task it interrupted |
| `triage`  | Reviewing accumulated ideas or a backlog | Stale or duplicated work crowding out useful next steps |
| `adapt`   | Learning from observed workflow friction | Repeating a mistake or adding a permanent rule for one incident |

There is no `execute` skill. Execution follows the user's request and any approved
plan. A specified small fix can proceed directly; the rhythm does not require a
planning ceremony for every edit.

Capture saves an idea; triage recommends which saved ideas to pursue, defer, or drop.
Adapt proposes the smallest evidence-backed workflow improvement, including no
change when that is the better outcome. Neither recommendations nor reflection
authorize implementation or changes to trackers, instructions, or memory.

Each skill is short on purpose. They describe outcomes, decision boundaries, and
non-obvious constraints; they name no tools, no vendor, and no specific agent, so the same
file works unchanged across harnesses.

## Wiring it into a harness

Clone the repo somewhere stable, then symlink each skill into whatever directory your
harness reads skills from.

```sh
git clone https://github.com/cameronsjo/cadence-lite.git ~/.cadence-lite
```

```sh
# Point this at your harness's skills directory.
SKILL_DIR="$HOME/.your-harness/skills"

mkdir -p "$SKILL_DIR"
for skill in intro attune polish outro capture; do
  ln -sfn "$HOME/.cadence-lite/skills/$skill" "$SKILL_DIR/$skill"
done
```

The example installs the five-skill rhythm. To add either optional workflow, repeat
the loop with `for skill in triage adapt; do` (or just the name you want).

Symlinks rather than copies so a `git pull` in the clone updates every harness at once.
If your harness will not follow symlinks, copy the directories instead and re-copy after
each pull.

Pick up changes later with:

```sh
git -C ~/.cadence-lite pull --ff-only
```

### What a harness needs to support

- **A skills directory** it scans at session start.
- **`SKILL.md` with YAML frontmatter** carrying `name` and `description`. The
  `description` is the routing signal — it is what the agent matches against to decide
  whether the skill applies, so keep it intact if you adapt these.

That is the whole contract. There are no scripts, no dependencies, and nothing to build.

## Adapting them

These are behavioral instructions, not documentation — an agent executes them. Edit them
the way you would edit code, and expect a change in wording to change what the agent
does.

Two things are worth keeping if you fork:

- **The "what this prevents" line.** Each skill names the specific failure it exists to
  stop. That sentence is what keeps the skill from being followed as ritual.
- **The `NOT for …` clause in each description.** Skills without a stated boundary get
  invoked for adjacent work they were never shaped for.

## Relationship to full cadence

cadence-lite works without a plugin runtime. The full methodology adds enforcement,
multi-session coordination, dispatch routing, and a wider skill surface. Choose
those capabilities when they help your work; runtime availability alone is not a
reason to install a larger instruction set. Lite remains useful on hosts that also
support plugins or hooks.

## License

Apache-2.0 with the Commons Clause — see [`LICENSE`](LICENSE). Note that this
combination is **source-available, not OSI-approved open source**: the Commons Clause
withholds the right to sell the software. Read it before building anything commercial on
top.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Note the merge process is deliberately
non-standard — pull requests are merged locally and pushed, never merged through the
GitHub web interface.
