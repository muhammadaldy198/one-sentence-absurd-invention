// One-Sentence Absurd Invention Pitch — entry program (Node 22).
// Pitches a ridiculous invention that fixes a tiny everyday annoyance:
// a phone that, when storage runs out mid-photo, deletes your ex's
// pictures first — starting with the ones where they look happy.
// Writes exactly one sentence (1-220 characters) to /output/entry.txt.
// Deterministic: same sentence, same bytes, every run. No network.

import * as fs from "node:fs";
import * as path from "node:path";

const PITCH =
  "The Closure Phone: when storage runs out mid-photo, it deletes your ex's pictures first, starting with the ones where they look happy.";

const OUT_DIR = "/output";
const OUT_FILE = path.join(OUT_DIR, "entry.txt");
const MAX_CHARS = 220;

function reject(reason: string): never {
  throw new Error(`gate failed: ${reason}`);
}

function checkPitch(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    reject(`length ${chars} outside 1-${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    reject("pitch is only whitespace");
  }
  if (text !== text.trim()) {
    reject("leading or trailing whitespace");
  }
  if (/[\r\n]/.test(text)) {
    reject("more than one line");
  }
  if (/[\u0000-\u001f\u007f]/.test(text)) {
    reject("control character found");
  }
  if (/[\u00a0\u200b]/.test(text)) {
    reject("invisible space found");
  }
  // One sentence: exactly one full stop, and it closes the sentence.
  const body = text.slice(0, -1);
  if (!text.endsWith(".") || body.includes(".")) {
    reject("not exactly one sentence");
  }
}

function run(): void {
  checkPitch(PITCH);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, PITCH, "utf8");
  const back = fs.readFileSync(OUT_FILE, "utf8");
  if (back !== PITCH) {
    reject("round-trip mismatch");
  }
  const bytes = Buffer.byteLength(PITCH, "utf8");
  console.log(`entry.txt written: ${[...PITCH].length} chars, ${bytes} bytes`);
}

run();
