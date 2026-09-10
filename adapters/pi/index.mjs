import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const allowedTools = new Set(["read", "grep", "find", "ls", "write", "edit", "bash"]);

export function loadAgents(directory = path.join(here, "agents")) {
  const agents = new Map();
  for (const filename of fs.readdirSync(directory).sort()) {
    if (!/^cadence-lite-[a-z0-9-]+\.md$/.test(filename)) continue;
    const target = path.join(directory, filename);
    if (!fs.lstatSync(target).isFile()) throw new Error("Agent must be a regular file: " + target);
    const text = fs.readFileSync(target, "utf8");
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]+)$/);
    if (!match) throw new Error("Invalid agent frontmatter: " + filename);
    const fields = Object.fromEntries(match[1].split("\n").map((line) => {
      const split = line.indexOf(":");
      if (split < 1) throw new Error("Invalid agent field: " + filename);
      return [line.slice(0, split), line.slice(split + 1).trim()];
    }));
    const name = fields.name;
    const tools = (fields.tools || "").split(",").map((t) => t.trim());
    if (name !== filename.slice(0, -3) || agents.has(name) ||
        !tools.length || tools.some((t) => !allowedTools.has(t)) || !match[2].trim()) {
      throw new Error("Invalid agent definition: " + filename);
    }
    agents.set(name, { name, description: JSON.parse(fields.description), tools, prompt: match[2] });
  }
  return agents;
}

export async function runAgent({ agent, task, cwd, model, thinking, signal,
  command = "pi", commandPrefix = [], timeoutMs = 300000, maxBytes = 4 * 1024 * 1024,
  tempRoot = os.tmpdir() }) {
  if (signal?.aborted) throw new Error("Dispatch aborted before launch.");
  if (!task?.trim()) throw new Error("Task must not be empty.");
  if (!model) throw new Error("No active model; select a model before dispatch.");
  const promptDirectory = fs.mkdtempSync(path.join(tempRoot, "cadence-lite-prompt-"));
  fs.chmodSync(promptDirectory, 0o700);
  const promptFile = path.join(promptDirectory, "role.md");
  fs.writeFileSync(promptFile, agent.prompt, { mode: 0o600 });
  const args = ["--mode", "json", "-p", "--no-session", "--no-skills", "--no-prompt-templates",
    "--tools", agent.tools.join(","), "--model", model, "--append-system-prompt", promptFile];
  if (thinking) args.push("--thinking", thinking);
  args.push("--", "Task: " + task);
  try {
    return await new Promise((resolve, reject) => {
      const child = spawn(command, [...commandPrefix, ...args], {
        cwd, shell: false, stdio: ["ignore", "pipe", "pipe"],
        detached: process.platform !== "win32",
        env: { ...process.env, CADENCE_LITE_CHILD: "1" }
      });
      let buffer = "", stderr = "", bytes = 0, lastMessage, failure, closed = false, killTimer;
      const kill = (sig) => {
        if (closed) return;
        try {
          if (process.platform !== "win32" && child.pid) process.kill(-child.pid, sig);
          else child.kill(sig);
        } catch (error) { if (error.code !== "ESRCH") failure ||= error.message; }
      };
      const stop = (reason) => {
        failure ||= reason;
        kill("SIGTERM");
        if (!killTimer) killTimer = setTimeout(() => kill("SIGKILL"), 1000);
      };
      const abort = () => stop("Dispatch aborted.");
      signal?.addEventListener("abort", abort, { once: true });
      if (signal?.aborted) abort();
      const timer = setTimeout(() => stop("Dispatch timed out."), timeoutMs);
      const consume = (line) => {
        if (!line.trim() || failure) return;
        let event;
        try { event = JSON.parse(line); }
        catch { stop("Invalid JSON event from child."); return; }
        if (!event || typeof event !== "object" || Array.isArray(event) || typeof event.type !== "string") {
          stop("Invalid event shape from child."); return;
        }
        if (event.type === "message_end" && event.message?.role === "assistant") {
          if ((event.message.stopReason !== undefined && typeof event.message.stopReason !== "string") ||
              (event.message.errorMessage !== undefined && typeof event.message.errorMessage !== "string")) {
            stop("Invalid assistant status from child."); return;
          }
          if (!Array.isArray(event.message.content) || event.message.content.some((part) =>
            !part || typeof part !== "object" || typeof part.type !== "string" ||
            (part.type === "text" && typeof part.text !== "string"))) {
            stop("Invalid assistant content from child."); return;
          }
          lastMessage = event.message;
          if (["error", "aborted"].includes(lastMessage.stopReason) || lastMessage.errorMessage) {
            stop("Child model failed: " + (lastMessage.errorMessage || lastMessage.stopReason));
          }
        }
      };
      child.stdout.setEncoding("utf8");
      child.stdout.on("data", (chunk) => {
        bytes += Buffer.byteLength(chunk);
        if (bytes > maxBytes) { stop("Child output exceeded the dispatch limit."); return; }
        buffer += chunk;
        let newline;
        while ((newline = buffer.indexOf("\n")) !== -1) {
          consume(buffer.slice(0, newline));
          buffer = buffer.slice(newline + 1);
        }
      });
      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (chunk) => {
        stderr = (stderr + chunk).slice(-16384);
        bytes += Buffer.byteLength(chunk);
        if (bytes > maxBytes) stop("Child output exceeded the dispatch limit.");
      });
      child.on("error", (error) => { failure ||= "Unable to launch child: " + error.message; });
      child.on("close", (code, exitSignal) => {
        if (buffer.trim()) consume(buffer);
        // The leader can exit while a detached background descendant remains.
        // On POSIX, finish the owned process group before releasing the slot.
        kill("SIGKILL");
        closed = true;
        clearTimeout(timer);
        clearTimeout(killTimer);
        signal?.removeEventListener("abort", abort);
        const report = Array.isArray(lastMessage?.content)
          ? lastMessage.content.filter((c) => c.type === "text").map((c) => c.text).join("\n").trim() : "";
        if (lastMessage && lastMessage.stopReason !== "stop") {
          failure ||= "Child returned an incomplete response (" + (lastMessage.stopReason || "unknown stop reason") + ").";
        }
        if (failure || code !== 0 || exitSignal || !report) {
          reject(new Error(failure || (code !== 0 || exitSignal
            ? "Child exited unsuccessfully (" + (exitSignal || code) + "). " + stderr.trim()
            : "Child returned no report.")));
        } else resolve({ report, model, agent: agent.name });
      });
    });
  } finally {
    fs.rmSync(promptDirectory, { recursive: true, force: true });
  }
}

export default function cadenceLite(pi) {
  // Avoid recursive dispatch while allowing the child's other discovered policy
  // extensions and project instructions to load normally.
  if (process.env.CADENCE_LITE_CHILD === "1") return;
  const agents = loadAgents();
  let active = 0;
  pi.registerTool({
    name: "cadence_lite_dispatch",
    label: "Cadence Lite agent",
    description: "Delegate one bounded task to a Cadence Lite specialist in a fresh Pi process in the current directory. " +
      "Use reviewers for read-only inspection; test-author and doc-writer can edit assigned paths. " +
      "Children reload discovered extensions and project instructions; parent-only runtime settings and explicit -e extensions are not inherited. " +
      "If those supply required controls, configure the child equivalently or use an inline pass. Available roles: " +
      [...agents.values()].map((a) => a.name + ": " + a.description).join("; "),
    parameters: {
      type: "object", additionalProperties: false,
      properties: {
        agent: { type: "string", enum: [...agents.keys()] },
        task: { type: "string", minLength: 1,
          description: "Goal, target repository/base/files or plan, allowed edits if any, and the requested evidence." }
      },
      required: ["agent", "task"]
    },
    async execute(_id, params, signal, _onUpdate, ctx) {
      const agent = agents.get(params.agent);
      if (!agent) throw new Error("Unknown Cadence Lite agent: " + params.agent);
      if (active >= 4) throw new Error("Four Cadence Lite agents are already running; wait for one to finish.");
      active++;
      try {
        const result = await runAgent({ agent, task: params.task, cwd: ctx.cwd, signal,
          model: ctx.model ? ctx.model.provider + "/" + ctx.model.id : undefined,
          thinking: ctx.thinkingLevel });
        return { content: [{ type: "text", text: result.report }],
          details: { agent: result.agent, model: result.model, status: "completed" } };
      } finally { active--; }
    }
  });
}
