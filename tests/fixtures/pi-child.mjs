import fs from "node:fs";
import { spawn } from "node:child_process";
const kind = process.argv[2];
const args = process.argv.slice(3);
const value = (flag) => args[args.indexOf(flag) + 1];
const message = (text, stopReason = "stop") => JSON.stringify({
  type: "message_end", message: { role: "assistant", stopReason, content: [{ type: "text", text }] }
});
if (kind === "success") {
  const report = JSON.stringify({
    cwd: process.cwd(), model: value("--model"), thinking: value("--thinking"),
    tools: value("--tools"), prompt: fs.readFileSync(value("--append-system-prompt"), "utf8"),
    args, child: process.env.CADENCE_LITE_CHILD
  });
  // Exercise chunk boundaries and a final event without a trailing LF.
  const event = message(report);
  process.stdout.write(event.slice(0, 37));
  setTimeout(() => process.stdout.write(event.slice(37)), 5);
} else if (kind === "nonzero") {
  process.stdout.write(message("Looks fine."));
  process.stderr.write("fixture authentication failed");
  process.exitCode = 2;
} else if (kind === "empty") {
  process.stdout.write(message("  "));
} else if (kind === "malformed") {
  process.stdout.write("not JSON\n");
} else if (kind === "null-event") {
  process.stdout.write("null\n");
} else if (kind === "null-content") {
  process.stdout.write(JSON.stringify({ type: "message_end", message: {
    role: "assistant", stopReason: "stop", content: [null] } }));
} else if (kind === "object-text") {
  process.stdout.write(JSON.stringify({ type: "message_end", message: {
    role: "assistant", stopReason: "stop", content: [{ type: "text", text: {} }] } }));
} else if (kind === "object-stop-reason" || kind === "object-error-message") {
  const event = JSON.parse(message("Partial output"));
  event.message[kind === "object-stop-reason" ? "stopReason" : "errorMessage"] = { toString: null };
  process.stdout.write(JSON.stringify(event));
} else if (kind === "background") {
  const background = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { stdio: "ignore" });
  process.stdout.write(message(JSON.stringify({ pid: background.pid })));
  background.unref();
} else if (kind === "model-error") {
  process.stdout.write(message("Partial output", "error"));
} else if (kind === "truncated") {
  process.stdout.write(message("Partial output", "length"));
} else if (kind === "overflow") {
  process.stdout.write("x".repeat(8192));
} else if (kind === "hang") {
  setInterval(() => {}, 1000);
} else if (kind === "term-resistant") {
  process.on("SIGTERM", () => {});
  process.stdout.write(JSON.stringify({ type: "start" }) + "\n");
  setInterval(() => {}, 1000);
}
