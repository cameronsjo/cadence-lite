---
name: perf-audit
description: Audits a repository for performance bottlenecks, latency spikes, CPU or memory churn, and hot-path inefficiencies across Rust, Go, TypeScript/JS, or shell/CLI code by measuring before and after with realistic benchmarks and verifying every speedup.
---

# Performance Audit

Find and fix high-leverage inefficiencies systematically — measure first, hunt the highest-frequency paths, preserve every safety invariant, and prove the delta with a fresh benchmark.

If the user asked for an audit or proposal only, stop after Phase 3 and present the ranked findings with `file:line` citations and baseline numbers. Do not edit files until implementation is authorized.

## Phase 1: Map the Frequency Multipliers

Start with what runs **most often**, not random files:

- **UI / Event-driven (TS/JS):** grep for render hooks (`ui.render`), invalidation triggers (`invalidate`, `redraw`, `requestAnimationFrame`), timers (`setInterval`, `setTimeout`, `clock.after`), and wildcard listeners (`on('*', ...)`).
- **CLIs / Hooks / Middleware (Rust/Go/Shell):** inspect how the caller invokes the binary (hook matchers, filters, shell wrappers, cron/LaunchAgent intervals) and rank entry points by invocations per minute or turn.
- **Daemons / TUIs / Poll loops (Go/Rust/Node):** grep for `NewTicker`, `Ticker`, `setInterval`, `sleep`, `ReadDir`, `WalkDir`, `exec.Command`, `Command::new`.

Produce a ranked list of the top 5–10 hot paths. Skip cold paths unless they block startup or shutdown.

## Phase 2: Measure Before Reading Deeply

Build a small wall-clock harness (`p50`, `p95`, `min`, `n >= 20`, 1 warmup run) against realistic payloads **and** the real production wrapper:

- Always benchmark **both** the direct binary/function and the outer wrapper (e.g., `/bin/sh -c` + wrapper script) so launch/shell overhead is visible.
- Include small, typical, and large (50 KB+ / large-directory) inputs so `O(N)` scans and full-buffer copies stand out.
- Record the baseline table before making any edits.

## Phase 3: Hunt the 8 Universal Anti-Patterns

Split read-only exploration by layer (e.g., UI/render, runtime/IPC, core/dispatch, hot checks) when the repo is large, and probe each hot path for:

1. **Spurious invalidation & fan-out** (`invalidate`, `redraw`, `emit`, `.clear()`): redrawing or flushing on idle ticks or no-op polls instead of gating on observable state changes.
2. **Expensive work before cheap gates**: reading config/TOML/JSON, `canonicalize`/`realpath`, `gethostname`, timezone lookups, regexes, AST parsing, or subprocess spawns before checking cheap in-memory predicates (tool/event name, extension, branch, literal substring, marker `stat`).
3. **Avoidable subprocesses, double-shell wrappers & fixed-sleep polling**:
   - Spawning `git`/`test`/`sh` when an in-process `.git/HEAD` (with linked-worktree `gitdir:`) or `stat` works.
   - Waiting on subprocesses with `try_wait()` + fixed `sleep` instead of EOF / `poll(2)` wakeup.
   - Double-shell wrappers (`sh -c` → `#!/bin/sh` → `$(command -v ...)`) instead of inlining POSIX builtins + cold-path fallback.
   - Spawning OS threads per item for sub-millisecond in-memory work.
4. **Re-parsing & full-file re-reads** (`read_to_string`, `os.ReadFile`, `ReadDir`, `from_str::<Value>`): re-parsing unchanged directory entries every poll tick instead of caching by `(path, mtime, size)`; reading multi-MB logs whole instead of `BufReader` streaming + verified byte-offset resume; multi-pass JSON `Value` deserialization instead of strict-first single-pass.
5. **Regex & linear-scan traps** (`Regex::new`, `new RegExp`, `regexp.Compile`): compiling static regexes inside functions; running N separate regexes instead of `RegexSet` / `AhoCorasick`; scanning without cheap literal pre-filters; evaluating allow-lists or old-text diffs before confirming a primary hit.
6. **Hot-path allocations & cache thrashing** (`.clone()`, `.to_lowercase()`, `.slice(1)`, `.clear()`, `canonicalize`): copying whole buffers/structs on every event; clearing bounded caches instead of evicting the oldest entry; case-folding whole paths to check an extension; skipping UTF-16 `.length <= limit` fast-paths before Unicode width scans.
7. **Leaked timers & uncoalesced queues** (`setTimeout`, `clock.after`, FIFO promise chains): dropping timer handles without cancelling on settle/reset; running superseded state reports sequentially instead of coalescing latest-wins while preserving terminal signals (`release`/`close`).
8. **Build, dispatch & wiring overhead** (`Cargo.toml`, `main.rs`, hook configs): missing `[profile.release]` (`lto = "thin"`, `codegen-units = 1`, `strip = "symbols"`, keeping `panic = "unwind"` if `catch_unwind` is used); building heavy CLI parser trees on hot single-subcommand paths; ungrouped same-trigger hooks or overly broad matchers.

## Phase 4: Implement in Isolated Slices

- Work in an isolated feature worktree or branch, grouped into coherent PRs by repo and risk profile.
- Preserve every safety invariant: fail-open/fail-closed behavior, security checks, panic unwinding, and audit/telemetry rows. Never optimize away a guard.

## Phase 5: Verify Correctness and Delta

1. Run the repo's full test suite, linter, and formatter (`cargo test` / `cargo clippy -- -D warnings`, `go test ./...` / `gofmt`, project test suites).
2. Re-run the exact Phase 2 benchmark against the baseline binary/commit and report `before → after` `p50`/`p95` numbers in the PR body. Never claim a speedup without a fresh measurement.
