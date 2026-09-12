import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function loadRoles(repo = root) {
  const roles = JSON.parse(fs.readFileSync(path.join(repo, "agents/manifest.json"), "utf8"));
  const ids = new Set();
  for (const role of roles) {
    if (!/^[a-z][a-z0-9-]+$/.test(role.id) || ids.has(role.id) ||
        !["core", "optional"].includes(role.group) ||
        !["review", "tests", "docs"].includes(role.access) ||
        typeof role.description !== "string" || /[\r\n]/.test(role.description) ||
        !Array.isArray(role.phases) || !role.phases.length ||
        role.phases.some((p) => !["attune", "polish"].includes(p))) {
      throw new Error("Invalid role manifest entry: " + role.id);
    }
    ids.add(role.id);
  }
  return roles;
}

export function artifacts(repo = root) {
  const shared = fs.readFileSync(path.join(repo, "agents/contract.md"), "utf8").trim();
  const result = new Map();
  for (const role of loadRoles(repo)) {
    const name = "cadence-lite-" + role.id;
    const body = fs.readFileSync(path.join(repo, "agents", role.id + ".md"), "utf8").trim();
    const prompt = body + "\n\n" + shared + "\n";
    const header = "---\nname: " + name + "\ndescription: " + JSON.stringify(role.description) + "\n";
    const readOnly = role.access === "review";
    const claudeTools = readOnly ? "Read, Grep, Glob" : "Read, Grep, Glob, Write, Edit, Bash";
    const piTools = readOnly ? "read, grep, find, ls" : "read, grep, find, ls, write, edit, bash";
    result.set("adapters/claude-code/agents/" + name + ".md",
      header + "tools: " + claudeTools + "\n---\n\n" + prompt);
    result.set("adapters/codex/agents/" + name + ".toml",
      "# Generated from agents/; run npm run generate to update.\n" +
      "name = " + JSON.stringify(name) + "\n" +
      "description = " + JSON.stringify(role.description) + "\n" +
      'sandbox_mode = "' + (readOnly ? "read-only" : "workspace-write") + '"\n' +
      "developer_instructions = " + JSON.stringify(prompt) + "\n");
    result.set("adapters/opencode/agents/" + name + ".md",
      "---\ndescription: " + JSON.stringify(role.description) + "\nmode: subagent\n" +
      (readOnly ? "permission:\n  edit: deny\n  bash: deny\n" : "") + "---\n\n" + prompt);
    result.set("adapters/pi/agents/" + name + ".md", header + "tools: " + piTools + "\n---\n\n" + prompt);
    for (const phase of role.phases) {
      result.set("skills/" + phase + "/references/agents/" + role.id + ".md", prompt);
    }
  }
  return result;
}

export function generate({ check = false, repo = root } = {}) {
  const output = artifacts(repo);
  const stale = [];
  for (const [relative, content] of output) {
    const target = path.join(repo, relative);
    if (check) {
      if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== content) stale.push(relative);
    } else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, content);
    }
  }
  // Removed/renamed roles must not leave discoverable native agents behind.
  const dirs = ["adapters/claude-code/agents", "adapters/codex/agents",
    "adapters/opencode/agents", "adapters/pi/agents",
    "skills/attune/references/agents", "skills/polish/references/agents"];
  for (const relative of dirs) {
    const dir = path.join(repo, relative);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      const entry = relative + "/" + name;
      if (!output.has(entry)) stale.push(entry + " (unexpected; remove deliberately)");
    }
  }
  if (stale.length) throw new Error("Generated files are stale:\n" + stale.join("\n"));
  return output.size;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.slice(2).some((a) => a !== "--check")) throw new Error("Usage: node scripts/generate-agents.mjs [--check]");
    const check = process.argv.includes("--check");
    console.log((check ? "Verified " : "Generated ") + generate({ check }) + " artifacts.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
