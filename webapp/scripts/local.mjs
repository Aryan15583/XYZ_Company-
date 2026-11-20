// `npm run local` — run the whole site on your computer with no database to
// install. PGlite (real Postgres compiled to WebAssembly) runs inside this
// Node process and listens on localhost like a normal Postgres server, so
// Prisma, the migrations (which load the starter catalogue) and the app all
// work unchanged. Data is kept in webapp/.local-db/ between runs; delete
// that folder to start fresh.
//
// Works on Windows, macOS and Linux. Ctrl+C stops everything.
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

const PORT = Number(process.env.LOCAL_DB_PORT || 54329);
const APP_PORT = process.env.PORT || "3000";
const dataDir = join(process.cwd(), ".local-db");
mkdirSync(dataDir, { recursive: true });

const db = await PGlite.create(dataDir);
const server = new PGLiteSocketServer({ db, port: PORT, host: "127.0.0.1", maxConnections: 10 });
await server.start();

const url = `postgresql://postgres:postgres@127.0.0.1:${PORT}/postgres?sslmode=disable&connection_limit=1`;
const env = {
  ...process.env,
  // These override whatever is in .env, so a placeholder Neon URL there is fine.
  DATABASE_URL: url,
  DIRECT_URL: url,
  JWT_SECRET: process.env.JWT_SECRET && !process.env.JWT_SECRET.startsWith("change_this")
    ? process.env.JWT_SECRET
    : randomBytes(32).toString("hex"),
  NEXT_PUBLIC_SITE_URL: `http://localhost:${APP_PORT}`,
  PORT: APP_PORT,
};

// Run a package's CLI with this same Node binary (no shell), so stopping the
// child really stops it, on Windows too.
const bin = (...parts) => join(process.cwd(), "node_modules", ...parts);
function run(script, args) {
  return spawn(process.execPath, [script, ...args], { stdio: "inherit", env });
}

let child;
async function shutdown(code = 0) {
  if (child && child.exitCode === null) child.kill();
  await server.stop().catch(() => {});
  await db.close().catch(() => {});
  process.exit(code);
}
process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log(`\nLocal database ready (stored in ${dataDir}). Setting up tables and products…\n`);
child = run(bin("prisma", "build", "index.js"), ["migrate", "deploy"]);
child.on("exit", (code) => {
  if (code !== 0) {
    console.error("\nCould not set up the local database (see the error above).");
    shutdown(code ?? 1);
    return;
  }
  console.log(`\nStarting the site — open http://localhost:${APP_PORT}\n`);
  child = run(bin("next", "dist", "bin", "next"), ["dev", "-p", APP_PORT]);
  child.on("exit", (c) => shutdown(c ?? 0));
});
