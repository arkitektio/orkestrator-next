#!/usr/bin/env node
// No-regression type-check gate ("ratchet").
//
// The renderer currently has a large, pre-existing backlog of type errors, so a
// hard `tsc == 0` gate isn't yet achievable. Instead we record the current count
// in `typecheck-baseline.json` and fail CI only when the count INCREASES. As the
// backlog is burned down, lower `maxErrors` so it can never creep back up.
//
// Run a full, cache-free check via tsconfig.typecheck.json (composite/incremental
// off) so nothing is masked.
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baselinePath = resolve(root, "typecheck-baseline.json");

const { maxErrors } = JSON.parse(readFileSync(baselinePath, "utf8"));

const result = spawnSync(
  "npx",
  ["tsc", "-p", "tsconfig.typecheck.json", "--noEmit"],
  { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
);

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
const count = (output.match(/error TS\d+/g) ?? []).length;

console.log(`typecheck: ${count} errors (baseline ${maxErrors})`);

if (count > maxErrors) {
  console.error(
    `\n✗ Type errors increased by ${count - maxErrors} (${maxErrors} → ${count}).` +
      `\n  New type errors were introduced. Fix them, or if intentional, see the` +
      `\n  full output with \`yarn typecheck\`.`,
  );
  process.exit(1);
}

if (count < maxErrors) {
  console.log(
    `\n✓ ${maxErrors - count} fewer error(s) than the baseline. Nice — please lower` +
      `\n  "maxErrors" in typecheck-baseline.json to ${count} to lock in the progress.`,
  );
} else {
  console.log("\n✓ No new type errors.");
}

process.exit(0);
