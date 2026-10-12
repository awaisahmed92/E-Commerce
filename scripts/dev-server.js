#!/usr/bin/env node
/**
 * Wraps `next dev` / `next start` with an auto-incrementing port picker, so running this project
 * alongside other local projects doesn't need manual "-p" juggling every time. Preferred starting
 * port: `-p <port>` / `--port <port>` arg, then $PORT, then 3010 (this repo's long-standing
 * default). If that port is taken, tries the next one (up to 20 higher) and prints which one it
 * actually bound to.
 *
 * Usage: node scripts/dev-server.js dev [-p 3010]
 *        node scripts/dev-server.js start [-p 3010]
 */
const net = require("net");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const MAX_ATTEMPTS = 20;

// Resolve next's binary directly instead of relying on PATH — npm run injects node_modules/.bin
// automatically, but a direct `node scripts/dev-server.js` invocation (e.g. for debugging) doesn't.
const NEXT_BIN = path.join(__dirname, "..", "node_modules", ".bin", process.platform === "win32" ? "next.cmd" : "next");
const nextCommand = fs.existsSync(NEXT_BIN) ? NEXT_BIN : "next";
const mode = process.argv[2] === "start" ? "start" : "dev";

function argPort(argv) {
  const flagIndex = argv.findIndex((a) => a === "-p" || a === "--port");
  if (flagIndex !== -1 && argv[flagIndex + 1]) return Number(argv[flagIndex + 1]);
  return null;
}

const startPort = argPort(process.argv.slice(3)) || Number(process.env.PORT) || 3010;

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => server.close(() => resolve(true)));
    server.listen(port, "0.0.0.0");
  });
}

async function findFreePort(start) {
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const port = start + i;
    if (await isPortFree(port)) return port;
  }
  throw new Error(`No free port found between ${start} and ${start + MAX_ATTEMPTS - 1}.`);
}

(async () => {
  const port = await findFreePort(startPort);
  console.log(
    port === startPort ? `[dev-server] Using port ${port}.` : `[dev-server] Port ${startPort} is in use — using ${port} instead.`
  );

  const child = spawn(nextCommand, [mode, "-H", "0.0.0.0", "-p", String(port)], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  child.on("exit", (code) => process.exit(code ?? 0));
  child.on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
})();
