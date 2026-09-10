import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { artifacts, loadRoles, root, generate } from "./generate-agents.mjs";

const sha = (text) => crypto.createHash("sha256").update(text).digest("hex");
const projectDirs = { "claude-code": ".claude/agents", codex: ".codex/agents",
  opencode: ".opencode/agents", pi: ".pi/extensions/cadence-lite" };
const globalDirs = { "claude-code": ".claude/agents", codex: ".codex/agents",
  opencode: ".config/opencode/agents", pi: ".pi/agent/extensions/cadence-lite" };

function noSymlinks(target) {
  let current = path.resolve(target);
  while (true) {
    try {
      if (fs.lstatSync(current).isSymbolicLink()) throw new Error("Refusing symlink: " + current);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    const parent = path.dirname(current);
    if (parent === current) return;
    current = parent;
  }
}

function atomicWrite(target, content) {
  const temp = path.join(path.dirname(target), ".cadence-lite-" + crypto.randomUUID() + ".tmp");
  try {
    fs.writeFileSync(temp, content, { flag: "wx", mode: 0o600 });
    fs.renameSync(temp, target);
  } finally {
    if (fs.existsSync(temp)) fs.unlinkSync(temp);
  }
}

export function install({ agent, project, global = false, group = "core", update = false,
  dryRun = false, home = os.homedir(), repo = root } = {}) {
  if (!Object.hasOwn(projectDirs, agent)) throw new Error("Choose --agent claude-code, codex, opencode, or pi.");
  if (Boolean(project) === global) throw new Error("Choose exactly one of --project PATH or --global.");
  if (!["core", "all"].includes(group)) throw new Error("--group must be core or all.");
  const base = path.resolve(global ? home : project);
  if (!fs.statSync(base).isDirectory()) throw new Error("Destination root is not a directory: " + base);
  generate({ check: true, repo });
  const destination = path.join(base, (global ? globalDirs : projectDirs)[agent]);
  noSymlinks(destination);
  const output = artifacts(repo);
  const selected = loadRoles(repo).filter((r) => group === "all" || r.group === "core");
  const files = new Map();
  for (const role of selected) {
    const filename = "cadence-lite-" + role.id + (agent === "codex" ? ".toml" : ".md");
    files.set(agent === "pi" ? "agents/" + filename : filename,
      output.get("adapters/" + agent + "/agents/" + filename));
  }
  if (agent === "pi") {
    for (const name of ["index.mjs", "package.json"]) {
      files.set(name, fs.readFileSync(path.join(repo, "adapters/pi", name), "utf8"));
    }
  }
  const manifestPath = path.join(destination, ".cadence-lite-install.json");
  noSymlinks(manifestPath);
  let previous = { version: 1, files: {} };
  if (fs.existsSync(manifestPath)) {
    previous = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    if (previous.version !== 1 || !previous.files || typeof previous.files !== "object" ||
        Array.isArray(previous.files)) throw new Error("Invalid install manifest: " + manifestPath);
  }
  const writes = [];
  // Check the entire operation before making any changes.
  for (const [relative, content] of files) {
    const target = path.join(destination, relative);
    noSymlinks(target);
    if (fs.existsSync(target)) {
      if (!fs.lstatSync(target).isFile()) throw new Error("Destination is not a file: " + target);
      const current = fs.readFileSync(target, "utf8");
      if (current === content) continue;
      if (!update || previous.files[relative] !== sha(current)) {
        throw new Error("Existing file differs; preserve and reconcile it before installation: " + target +
          (update ? "" : "\nUse --update only for unchanged files from an earlier Cadence Lite install."));
      }
    }
    writes.push({ relative, target, content });
  }
  if (dryRun) return { destination, changed: writes.map((w) => w.relative), dryRun: true };
  fs.mkdirSync(destination, { recursive: true });
  for (const item of writes) {
    noSymlinks(item.target);
    fs.mkdirSync(path.dirname(item.target), { recursive: true });
    atomicWrite(item.target, item.content);
  }
  // Only store hashes. The installer never executes code or paths from this manifest.
  const hashes = Object.fromEntries(Object.entries(previous.files).filter(([key, value]) =>
    /^(agents\/)?cadence-lite-[a-z0-9-]+\.(md|toml)$/.test(key) || ["index.mjs", "package.json"].includes(key)));
  for (const [relative, content] of files) hashes[relative] = sha(content);
  atomicWrite(manifestPath, JSON.stringify({ version: 1, files: hashes }, null, 2) + "\n");
  return { destination, changed: writes.map((w) => w.relative), dryRun: false };
}

function parse(argv) {
  const options = {};
  const valueFlags = new Map([["--agent", "agent"], ["--project", "project"], ["--group", "group"]]);
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    if (valueFlags.has(flag)) {
      if (!argv[i + 1] || argv[i + 1].startsWith("--")) throw new Error("Missing value for " + flag);
      options[valueFlags.get(flag)] = argv[++i];
    } else if (flag === "--global") options.global = true;
    else if (flag === "--update") options.update = true;
    else if (flag === "--dry-run") options.dryRun = true;
    else throw new Error("Unknown option: " + flag);
  }
  return options;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.includes("--help")) {
      console.log("Usage: node scripts/install-agents.mjs --agent <claude-code|codex|opencode|pi> (--project PATH | --global) [--group core|all] [--dry-run] [--update]");
      process.exit(0);
    }
    const result = install(parse(process.argv.slice(2)));
    console.log(JSON.stringify(result, null, 2));
    if (!result.dryRun) console.log("Restart the harness to discover new agents. Existing unselected roles were retained.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
