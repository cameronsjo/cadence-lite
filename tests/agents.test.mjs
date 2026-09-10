import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { artifacts, generate, loadRoles, root } from "../scripts/generate-agents.mjs";
import { install } from "../scripts/install-agents.mjs";
import { loadAgents } from "../adapters/pi/index.mjs";

function temporary(t) {
  const directory = fs.mkdtempSync(path.join(path.dirname(root), ".cadence-lite-tests-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}
const native = ["claude-code", "codex", "opencode", "pi"];

test("portable roster is the agreed set; generated artifacts and Pi definitions load", () => {
  assert.deepEqual(loadRoles().map((r) => r.id).sort(), [
    "agent-experience-reviewer", "code-reviewer", "developer-experience-reviewer",
    "doc-writer", "operability-reviewer", "plan-reviewer", "red-team-reviewer",
    "security-posture-reviewer", "security-reviewer", "test-author", "user-experience-reviewer"
  ]);
  assert.equal(generate({ check: true }), 60);
  assert.equal(loadAgents().size, 11);
});

test("native Codex TOML parses with inherited models and appropriate sandbox modes", () => {
  const result = spawnSync("python3", ["-c",
    "import pathlib,tomllib,json; print(json.dumps([tomllib.loads(p.read_text()) for p in pathlib.Path('adapters/codex/agents').glob('*.toml')]))"
  ], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const configs = JSON.parse(result.stdout);
  assert.equal(configs.length, 11);
  for (const config of configs) {
    const role = loadRoles().find((r) => config.name === "cadence-lite-" + r.id);
    assert.ok(role);
    assert.equal(config.description, role.description);
    assert.equal(config.sandbox_mode, role.access === "review" ? "read-only" : "workspace-write");
    assert.equal(config.model, undefined);
    assert.equal(config.developer_instructions,
      fs.readFileSync(path.join(root, "agents", role.id + ".md"), "utf8").trim() + "\n\n" +
      fs.readFileSync(path.join(root, "agents/contract.md"), "utf8").trim() + "\n");
  }
});

for (const agent of native) {
  test("install and repeat " + agent + " core agents without changing unrelated files", (t) => {
    const project = temporary(t);
    fs.writeFileSync(path.join(project, "keep.txt"), "mine");
    const first = install({ agent, project });
    assert.equal(first.changed.length, agent === "pi" ? 7 : 5);
    assert.equal(install({ agent, project }).changed.length, 0);
    const all = install({ agent, project, group: "all" });
    assert.equal(all.changed.length, 6);
    assert.equal(fs.readFileSync(path.join(project, "keep.txt"), "utf8"), "mine");
    if (agent === "pi") {
      const roles = loadAgents(path.join(all.destination, "agents"));
      assert.equal(roles.size, 11);
      assert.deepEqual(roles.get("cadence-lite-code-reviewer").tools, ["read", "grep", "find", "ls"]);
      assert.ok(roles.get("cadence-lite-test-author").tools.includes("write"));
    }
  });
}

test("dry-run creates no destination or manifest", (t) => {
  const project = temporary(t);
  const result = install({ agent: "codex", project, dryRun: true });
  assert.equal(result.changed.length, 5);
  assert.deepEqual(fs.readdirSync(project), []);
});

test("installed Pi manifest resolves an importable extension with the installed roster", async (t) => {
  const project = temporary(t);
  const result = install({ agent: "pi", project });
  const manifest = JSON.parse(fs.readFileSync(path.join(result.destination, "package.json"), "utf8"));
  assert.equal(manifest.pi.extensions.length, 1);
  const entry = path.resolve(result.destination, manifest.pi.extensions[0]);
  assert.ok(fs.statSync(entry).isFile());
  const extension = await import(pathToFileURL(entry).href);
  let tool;
  extension.default({ registerTool: (definition) => { tool = definition; } });
  assert.equal(tool.name, "cadence_lite_dispatch");
  assert.equal(tool.parameters.properties.agent.enum.length, 5);
});

test("documented CLI accepts selection and dry-run without writing", (t) => {
  const project = temporary(t);
  const result = spawnSync(process.execPath, ["scripts/install-agents.mjs", "--agent", "codex",
    "--project", project, "--group", "all", "--dry-run"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).changed.length, 11);
  assert.deepEqual(fs.readdirSync(project), []);
});

test("a collision prevents the whole install and preserves the existing agent", (t) => {
  const project = temporary(t);
  const dest = path.join(project, ".codex/agents");
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, "cadence-lite-security-reviewer.toml"), "user config");
  assert.throws(() => install({ agent: "codex", project, update: true }), /Existing file differs/);
  assert.deepEqual(fs.readdirSync(dest), ["cadence-lite-security-reviewer.toml"]);
  assert.equal(fs.readFileSync(path.join(dest, "cadence-lite-security-reviewer.toml"), "utf8"), "user config");
});

test("update replaces only unchanged owned files and protects local edits", (t) => {
  const temp = temporary(t);
  const project = path.join(temp, "project"), copy = path.join(temp, "repo");
  fs.mkdirSync(project);
  fs.cpSync(root, copy, { recursive: true, filter: (s) => !s.split(path.sep).includes(".git") });
  const result = install({ agent: "codex", project, repo: copy });
  fs.appendFileSync(path.join(copy, "agents/code-reviewer.md"), "\nAn additional upstream instruction.\n");
  generate({ repo: copy });
  assert.throws(() => install({ agent: "codex", project, repo: copy }), /Existing file differs/);
  assert.deepEqual(install({ agent: "codex", project, repo: copy, update: true }).changed,
    ["cadence-lite-code-reviewer.toml"]);
  const target = path.join(result.destination, "cadence-lite-code-reviewer.toml");
  fs.appendFileSync(target, "\n# My local setting\n");
  fs.appendFileSync(path.join(copy, "agents/code-reviewer.md"), "\nA later upstream instruction.\n");
  generate({ repo: copy });
  assert.throws(() => install({ agent: "codex", project, repo: copy, update: true }), /Existing file differs/);
  assert.ok(fs.readFileSync(target, "utf8").endsWith("# My local setting\n"));
});

test("symlinked destinations and manifests are refused", (t) => {
  const project = temporary(t), outside = temporary(t);
  fs.symlinkSync(outside, path.join(project, ".codex"), "dir");
  assert.throws(() => install({ agent: "codex", project }), /Refusing symlink/);
  assert.deepEqual(fs.readdirSync(outside), []);
  fs.unlinkSync(path.join(project, ".codex"));
  const dest = path.join(project, ".codex/agents");
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(outside, "manifest"), "{}");
  fs.symlinkSync(path.join(outside, "manifest"), path.join(dest, ".cadence-lite-install.json"));
  assert.throws(() => install({ agent: "codex", project }), /Refusing symlink/);
});

test("global install uses the harness's user location; no project/global ambiguity", (t) => {
  const home = temporary(t);
  const result = install({ agent: "pi", global: true, home });
  assert.equal(result.destination, path.join(home, ".pi/agent/extensions/cadence-lite"));
  assert.throws(() => install({ agent: "codex" }), /exactly one/);
  assert.throws(() => install({ agent: "codex", global: true, project: home }), /exactly one/);
});

test("each distributable skill resolves its own references after an isolated copy", (t) => {
  const temp = temporary(t);
  for (const name of fs.readdirSync(path.join(root, "skills"))) {
    const source = path.join(root, "skills", name), copy = path.join(temp, name);
    fs.cpSync(source, copy, { recursive: true });
    const entry = fs.readFileSync(path.join(copy, "SKILL.md"), "utf8");
    assert.match(entry, new RegExp("^---\\nname: " + name + "\\ndescription: .+\\n---\\n"));
    const walk = (dir) => {
      for (const child of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, child.name);
        if (child.isDirectory()) walk(file);
        else if (file.endsWith(".md")) {
          const text = fs.readFileSync(file, "utf8");
          for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
            if (/^(https?:|#)/.test(match[1])) continue;
            const resolved = path.resolve(path.dirname(file), match[1].split("#")[0]);
            assert.ok(resolved.startsWith(copy + path.sep), "Reference escapes skill: " + file);
            assert.ok(fs.existsSync(resolved), "Missing reference: " + resolved);
          }
        }
      }
    };
    walk(copy);
  }
});

test("Pi package remains skill-only and all native outputs are generated from source", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.deepEqual(pkg.pi.skills, ["./skills"]);
  assert.equal(pkg.pi.extensions, undefined);
  for (const [file, expected] of artifacts()) assert.equal(fs.readFileSync(path.join(root, file), "utf8"), expected);
});
