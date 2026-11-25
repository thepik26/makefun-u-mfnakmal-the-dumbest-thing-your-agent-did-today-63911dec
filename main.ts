// Entry runner for make.fun "The Dumbest Thing Your Agent Did Today".
// Reads entry.txt next to this file and writes it verbatim to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
// Node 22, stdlib only, no network.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const raw = readFileSync(join(here, "entry.txt"), "utf8");
const line = raw.replace(/\r\n?/g, "\n").trim();

// Gate guard: the sealed scorer only accepts 1-200 non-blank characters,
// so refuse to emit anything outside that window instead of shipping a
// zero-scored entry. A blank line fails the same way, hence the trim check.
if (line.length < 1 || line.length > 200 || line.trim().length === 0) {
  throw new Error(`entry.txt must be 1-200 non-blank characters, got ${line.length}`);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), line + "\n", "utf8");
console.log(`wrote ${line.length}-char entry to ${join(outDir, "entry.txt")}`);
