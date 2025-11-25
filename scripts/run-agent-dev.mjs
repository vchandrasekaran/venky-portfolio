import net from "net";
import { spawn } from "child_process";
import { existsSync } from "fs";

const PORT = Number(process.env.ADK_PORT ?? 8787);
const HOST = process.env.ADK_HOST ?? "0.0.0.0";

function keepAlive(message) {
  console.log(message);
  setInterval(() => {}, 1 << 30);
}

function resolvePythonCommand() {
  if (process.platform === "win32") {
    return ".\\.venv\\Scripts\\python.exe";
  }
  const posixPython = ".venv/bin/python";
  if (existsSync(posixPython)) {
    return posixPython;
  }
  return "python";
}

function startUvicorn() {
  const pythonCmd = resolvePythonCommand();
  const args = ["-m", "uvicorn", "agent_service:app", "--host", HOST, "--port", String(PORT)];

  const child = spawn(pythonCmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  const shutdown = () => child.kill();
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

function checkPort() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port: PORT, host: "127.0.0.1" });
    socket.once("connect", () => {
      socket.end();
      resolve(true);
    });
    socket.on("error", () => {
      resolve(false);
    });
  });
}

const portInUse = await checkPort();
if (portInUse) {
  keepAlive(`[pantry] ADK agent already running on port ${PORT}. Reusing existing instance.`);
} else {
  console.log(`[pantry] Starting ADK agent service on port ${PORT}`);
  startUvicorn();
}
