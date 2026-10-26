// Bundle src/estia-card.ts into the committed estia-card.js.
// With --check, fail if the committed file is not what the sources build to.
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const outfile = `${root}../custom_components/estia/frontend/estia-card.js`;
const check = process.argv.includes("--check");

const result = await build({
  entryPoints: [`${root}src/estia-card.ts`],
  bundle: true,
  format: "esm",
  target: "es2021",
  minify: true,
  legalComments: "none",
  write: false,
  outfile,
});
const built = result.outputFiles[0].text;

if (check) {
  let committed = "";
  try {
    committed = readFileSync(outfile, "utf8");
  } catch (error) {
    console.error(`estia-card.js missing: run npm run build (${error.message})`);
    process.exit(1);
  }
  if (committed !== built) {
    console.error("estia-card.js is stale: run npm run build and commit it");
    process.exit(1);
  }
  console.log("estia-card.js is up to date");
} else {
  writeFileSync(outfile, built);
  console.log(`wrote ${outfile} (${built.length} bytes)`);
}
