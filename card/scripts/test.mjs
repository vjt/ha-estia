// Run the card's unit tests: bundle each test/*.test.mjs (which import the
// TypeScript sources) with esbuild, then hand the bundles to node --test.
import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const tests = readdirSync(`${root}test`).filter((name) => name.endsWith(".test.mjs"));
const outdir = mkdtempSync(join(tmpdir(), "estia-card-test-"));

try {
  await build({
    entryPoints: tests.map((name) => `${root}test/${name}`),
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node20",
    outdir,
    outExtension: { ".js": ".mjs" },
    logLevel: "warning",
  });
  const run = spawnSync(process.execPath, ["--test", ...tests.map((name) => join(outdir, name))], {
    stdio: "inherit",
  });
  process.exitCode = run.status ?? 1;
} finally {
  rmSync(outdir, { recursive: true, force: true });
}
