import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I asked Monday for a sick note. It handed me one signed by Tuesday.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = join(outDir, "entry.txt");

if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (LINE !== LINE.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  throw new Error("entry must not contain control characters");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, LINE, "utf8");

const roundTrip = readFileSync(outFile, "utf8");
if (roundTrip !== LINE) {
  throw new Error("round-trip read-back mismatch");
}

console.log(`wrote ${outFile} (${LINE.length} chars)`);
