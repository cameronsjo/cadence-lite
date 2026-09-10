import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import cadenceLite, { loadAgents, runAgent } from "../adapters/pi/index.mjs";
import { root } from "../scripts/generate-agents.mjs";

const agent = loadAgents().get("cadence-lite-code-reviewer");
const fixture = path.join(root, "tests/fixtures/pi-child.mjs");
function options(t, kind) {
  const tempRoot = fs.mkdtempSync(path.join(path.dirname(root), ".cadence-lite-child-tests-"));
  t.after(() => fs.rmSync(tempRoot, { recursive: true, force: true }));
  return { agent, task: "Review this change; $(touch SHOULD_NOT_EXIST)", cwd: tempRoot,
    model: "example/model", thinking: "medium", command: process.execPath,
    commandPrefix: [fixture, kind], tempRoot, timeoutMs: 3000 };
}
test("child receives literal task, exact model, tools, and prompt; temporary prompts are removed", async (t) => {
  const opts = options(t, "success");
  const result = await runAgent(opts);
  const received = JSON.parse(result.report);
  assert.equal(received.cwd, opts.cwd);
  assert.equal(received.model, opts.model);
  assert.equal(received.thinking, opts.thinking);
  assert.equal(received.tools, "read,grep,find,ls");
  assert.equal(received.prompt, agent.prompt);
  assert.equal(received.child, "1");
  assert.equal(received.args.at(-1), "Task: " + opts.task);
  assert.ok(!received.args.includes("--no-extensions"));
  assert.ok(!received.args.includes("--no-context-files"));
  assert.deepEqual(fs.readdirSync(opts.tempRoot), []);
});

for (const [kind, error] of [
  ["nonzero", /exited unsuccessfully/], ["empty", /no report/],
  ["malformed", /Invalid JSON/], ["model-error", /model failed/],
  ["null-event", /Invalid event shape/], ["null-content", /Invalid assistant content/],
  ["object-text", /Invalid assistant content/],
  ["object-stop-reason", /Invalid assistant status/], ["object-error-message", /Invalid assistant status/],
  ["truncated", /incomplete/], ["overflow", /exceeded/],
  ["hang", /timed out/], ["term-resistant", /timed out/]
]) {
  test("child " + kind + " is a failed dispatch, never a clean review", async (t) => {
    const opts = options(t, kind);
    if (kind === "overflow") opts.maxBytes = 1024;
    if (kind === "hang" || kind === "term-resistant") opts.timeoutMs = 150;
    await assert.rejects(runAgent(opts), error);
    assert.deepEqual(fs.readdirSync(opts.tempRoot), []);
  });
}

test("missing binary, missing model, and cancellation are explicit failures", async (t) => {
  const opts = options(t, "hang");
  await assert.rejects(runAgent({ ...opts, command: path.join(opts.tempRoot, "absent") }), /Unable to launch/);
  await assert.rejects(runAgent({ ...opts, model: undefined }), /No active model/);
  const controller = new AbortController();
  const pending = runAgent({ ...opts, signal: controller.signal });
  controller.abort();
  await assert.rejects(pending, /aborted/);
  await assert.rejects(runAgent({ ...opts, signal: controller.signal }), /before launch/);
  assert.deepEqual(fs.readdirSync(opts.tempRoot), []);
});

test("Linux dispatch terminates background descendants when the leader exits", { skip: process.platform !== "linux" }, async (t) => {
  const opts = options(t, "background");
  const { pid } = JSON.parse((await runAgent(opts)).report);
  // A killed orphan can briefly be a zombie pending init's reap on Linux.
  let alive = true;
  for (let attempt = 0; attempt < 20 && alive; attempt++) {
    try {
      process.kill(pid, 0);
      const stat = fs.readFileSync("/proc/" + pid + "/stat", "utf8");
      alive = stat.slice(stat.lastIndexOf(")") + 2).split(" ")[0] !== "Z";
    } catch (error) {
      if (!["ESRCH", "ENOENT"].includes(error.code)) throw error;
      alive = false;
    }
    if (alive) await new Promise((resolve) => setTimeout(resolve, 25));
  }
  if (alive) process.kill(pid, "SIGKILL");
  assert.equal(alive, false, "Background descendant must be terminated");
});

test("extension registers the declared roster and refuses unknown roles", async () => {
  let tool;
  cadenceLite({ registerTool: (definition) => { tool = definition; } });
  assert.equal(tool.name, "cadence_lite_dispatch");
  assert.deepEqual(tool.parameters.properties.agent.enum, [...loadAgents().keys()]);
  await assert.rejects(tool.execute("test", { agent: "not-a-role", task: "test" }, undefined, undefined, {}),
    /Unknown Cadence Lite agent/);
});
