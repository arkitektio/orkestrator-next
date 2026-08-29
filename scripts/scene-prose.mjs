#!/usr/bin/env node
/**
 * Rewrite prose path references (code comments + .md) after the Phase 1 move.
 *
 * The code is dense with `path/to/file.ts` references inside docblocks; a move
 * leaves every one of them lying. This resolves each against the move manifest.
 * References it CANNOT resolve are reported, not guessed — several were already
 * stale before the restructure and need a human decision.
 *
 *   node scripts/scene-prose.mjs --dry
 *   node scripts/scene-prose.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { SCENE } from "./scene-manifest.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const OLD_TOPS = "core|render|managers|layers|panels|store|overlays|interactions|primitives|theme|cameras|sources|enhancers";

const walk = (d, out = []) => {
  for (const e of readdirSync(d)) {
    if (e === "node_modules" || e === "__fixtures__") continue;
    const f = join(d, e);
    statSync(f).isDirectory() ? walk(f, out) : /\.(tsx?|md)$/.test(e) && out.push(f);
  }
  return out;
};

/**
 * old scene-relative path -> new scene-relative path.
 *
 * Taken from git's rename log for the move commit rather than the manifest:
 * the manifest describes the pre-move tree, which no longer exists on disk,
 * and git's pairing is the ground truth for what actually moved.
 */
const map = new Map();
const log = execFileSync("git", ["show", "--diff-filter=R", "-M", "--name-status", "--format=", "HEAD"], { cwd: ROOT, encoding: "utf8" });
for (const line of log.split("\n")) {
  const m = line.match(/^R\d*\t(\S+)\t(\S+)$/);
  if (!m) continue;
  const [, from, to] = m;
  if (!from.includes("components/scene/")) continue;
  map.set(from.split("components/scene/")[1], to.split("components/scene/")[1]);
}

const TOKEN = new RegExp(`(?<![\\w/.-])(${OLD_TOPS})/[A-Za-z0-9_/.-]*[A-Za-z0-9_]`, "g");
let changed = 0, files = 0;
const unresolved = new Map();

for (const abs of walk(SCENE)) {
  const src = readFileSync(abs, "utf8");
  let out = src, hits = 0;
  out = out.replace(TOKEN, (tok) => {
    // Exact file reference.
    if (map.has(tok)) { hits++; return map.get(tok); }
    for (const ext of [".ts", ".tsx"]) {
      if (map.has(tok + ext)) { hits++; return map.get(tok + ext).replace(new RegExp(`${ext}$`), ""); }
    }
    // Directory reference: rewrite to the deepest directory that still
    // contains every child, so `enhancers/shared` (whose children fan out into
    // subdirs) resolves instead of being declined.
    const kids = [...map].filter(([o]) => o.startsWith(tok + "/"));
    if (kids.length) {
      const segs = kids.map(([, n]) => dirname(n).split("/"));
      const common = segs[0].filter((seg, i) => segs.every((s) => s[i] === seg));
      if (common.length) { hits++; return common.join("/"); }
    }
    unresolved.set(tok, (unresolved.get(tok) ?? 0) + 1);
    return tok;
  });
  if (hits) { files++; changed += hits; if (!DRY) writeFileSync(abs, out); }
}

console.log(`${changed} prose reference(s) rewritten across ${files} file(s)${DRY ? " (dry run)" : ""}`);
if (unresolved.size) {
  console.log(`\n${unresolved.size} reference(s) could NOT be resolved — these need a human look`);
  console.log("(most were already stale before the move):");
  [...unresolved].sort((a, b) => b[1] - a[1]).forEach(([t, n]) => console.log(`  ${String(n).padStart(3)}x  ${t}`));
}
