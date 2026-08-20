#!/usr/bin/env node
/**
 * Phase 1 of the scene restructure: move the files, rewrite the specifiers.
 *
 * CONTENT-FROZEN. The only bytes this touches are module-specifier string
 * literals. It deliberately does NOT use ts-morph/jscodeshift: both reprint the
 * file on save, and .prettierrc.yaml disagrees with this tree, so a reprint
 * would reformat every import block and bury the rename in noise (git also
 * stops pairing moved-and-edited files as renames at this volume).
 *
 *   node scripts/scene-move.mjs --dry     # report what would change
 *   node scripts/scene-move.mjs           # git mv + rewrite
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname, relative, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { destinationOf, SCENE } from "./scene-manifest.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src/renderer/src");
const ALIAS = "@/";
const DRY = process.argv.includes("--dry");

const walk = (d, out = []) => {
  for (const e of readdirSync(d)) {
    if (e === "node_modules") continue;
    const f = join(d, e);
    statSync(f).isDirectory() ? walk(f, out) : out.push(f);
  }
  return out;
};

/* ---- 1. the map: absolute old path -> absolute new path ------------------ */
const moves = new Map();
for (const abs of walk(SCENE)) {
  const rel = relative(SCENE, abs);
  if (rel.endsWith(".md")) continue;           // docs are split separately
  const dest = destinationOf(rel);
  if (dest === null) throw new Error(`unmapped: ${rel}`);
  const newRel = dest === "." ? basename(rel) : join(dest, basename(rel));
  if (newRel !== rel) moves.set(abs, join(SCENE, newRel));
}

/** Where a file lives after the move (identity for files that don't move). */
const after = (abs) => moves.get(abs) ?? abs;

/* ---- 2. resolve a specifier against the OLD layout ----------------------- */
const CANDIDATES = ["", ".ts", ".tsx", ".d.ts", "/index.ts", "/index.tsx"];
const resolveSpec = (fromFile, spec) => {
  let abs;
  if (spec.startsWith(".")) abs = resolve(dirname(fromFile), spec);
  else if (spec.startsWith(ALIAS)) abs = join(SRC, spec.slice(ALIAS.length));
  else return null;                             // bare package
  for (const ext of CANDIDATES) {
    const c = abs + ext;
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;                                  // e.g. "./repack-worker.js" — no such file on disk
};

/** Render a new specifier, preserving the caller's alias-vs-relative style. */
const specFor = (fromFileNew, targetNew, wasAlias) => {
  const noExt = targetNew.replace(/\.d\.ts$|\.tsx?$/, "");
  if (wasAlias) return ALIAS + relative(SRC, noExt).split("\\").join("/");
  let r = relative(dirname(fromFileNew), noExt).split("\\").join("/");
  if (!r.startsWith(".")) r = "./" + r;
  return r;
};

/* ---- 3. plan every rewrite (against the old layout) ---------------------- */
const LITERAL = /(["'])((?:\.\.?\/|@\/)[^"'\n]*)\1/g;
const edits = new Map();                        // abs old path -> [{from, to}]
let touched = 0, rewrites = 0;

for (const abs of walk(SRC)) {
  if (!/\.tsx?$/.test(abs)) continue;
  const src = readFileSync(abs, "utf8");
  const fileNew = after(abs);
  const list = [];
  for (const m of src.matchAll(LITERAL)) {
    const target = resolveSpec(abs, m[2]);
    if (!target) continue;
    const targetNew = after(target);
    // Nothing moved on either end -> the specifier is already correct.
    if (targetNew === target && fileNew === abs) continue;
    const next = specFor(fileNew, targetNew, m[2].startsWith(ALIAS));
    if (next !== m[2]) list.push({ from: m[0], to: `${m[1]}${next}${m[1]}` });
  }
  // The same specifier can appear more than once in a file (a second import of
  // the same module, an `await import()` in a test). One replace-all handles
  // every occurrence, so collapse duplicates or the second pass finds nothing.
  const byFrom = new Map(list.map((e) => [e.from, e]));
  list.length = 0;
  list.push(...byFrom.values());
  if (list.length) { edits.set(abs, list); touched++; rewrites += list.length; }
}

console.log(`${moves.size} files to move, ${rewrites} specifier rewrites across ${touched} files`);
const outside = [...edits.keys()].filter((f) => !f.startsWith(SCENE + "/"));
console.log(`${outside.length} file(s) outside scene/ touched:`);
outside.forEach((f) => console.log("   " + relative(ROOT, f)));
if (DRY) {
  console.log("\nsample rewrites:");
  let n = 0;
  for (const [f, l] of edits) { for (const e of l) { if (n++ < 12) console.log(`  ${relative(SCENE, f)}\n     ${e.from} -> ${e.to}`); } }
  process.exit(0);
}

/* ---- 4. move, then rewrite ---------------------------------------------- */
for (const [from, to] of moves) {
  mkdirSync(dirname(to), { recursive: true });
  execFileSync("git", ["mv", from, to], { cwd: ROOT });
}
for (const [abs, list] of edits) {
  const path = after(abs);
  let src = readFileSync(path, "utf8");
  // Guard against a rewrite producing a literal that another rewrite in the
  // same file is still looking for (would double-rewrite one specifier).
  const froms = new Set(list.map((e) => e.from));
  for (const e of list) if (froms.has(e.to)) throw new Error(`rewrite collision in ${path}: ${e.from} -> ${e.to}`);
  for (const { from, to } of list) {
    if (!src.includes(from)) throw new Error(`literal vanished in ${path}: ${from}`);
    src = src.split(from).join(to);             // exact literal, incl. quotes
  }
  writeFileSync(path, src);
}
console.log("done");
