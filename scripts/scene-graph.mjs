#!/usr/bin/env node
/**
 * Scene import-graph walker.
 *
 * Reporting tool for the scene restructure (see the plan's Phase 0). It resolves
 * every intra-`scene/` import to a (importer bucket -> imported bucket) edge and
 * prints the matrix plus any edge that violates the target layering.
 *
 * It is DELIBERATELY report-only: during the move phases a violation is expected
 * and informative, not a failure. `scene/architecture.test.ts` is the asserting
 * counterpart, switched on once the tree has landed (Phase 5).
 *
 *   node scripts/scene-graph.mjs              # matrix + violations
 *   node scripts/scene-graph.mjs --edges      # every individual violating edge
 *   node scripts/scene-graph.mjs --json       # machine-readable
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SCENE = join(ROOT, "src/renderer/src/mikro-next/components/scene");
const ALIAS_PREFIX = "@/mikro-next/components/scene/";

/** Bucket a scene-relative path into the unit the layering rules talk about. */
export const bucketOf = (rel) => {
  const parts = rel.split("/");
  if (parts.length === 1) return "(root)";
  // platform/gpu, features/bricks, shell/keyboard — two levels, since the rules
  // distinguish sibling features but not files within one.
  if (parts[0] === "features" || parts[0] === "platform" || parts[0] === "shell") {
    // tier/sub for a nested file; the bare tier for one sitting directly in it.
    return parts.length > 2 ? `${parts[0]}/${parts[1]}` : parts[0];
  }
  return parts[0];
};

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "__fixtures__") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
};

/** Resolve a specifier to a scene-relative file path, or null if it leaves scene/. */
const resolveTarget = (fromFile, spec) => {
  let abs;
  if (spec.startsWith(".")) abs = resolve(dirname(fromFile), spec);
  else if (spec.startsWith(ALIAS_PREFIX)) abs = join(SCENE, spec.slice(ALIAS_PREFIX.length));
  else return null;
  const rel = relative(SCENE, abs);
  if (rel.startsWith("..")) return null; // left the scene
  for (const cand of [abs, `${abs}.ts`, `${abs}.tsx`, join(abs, "index.ts"), join(abs, "index.tsx")]) {
    if (existsSync(cand) && statSync(cand).isFile()) return relative(SCENE, cand);
  }
  return rel; // unresolved (e.g. a worker `.js` twin) — still a real edge
};

const IMPORT_RE = /(?:^|\n)\s*(?:import|export)[\s\S]{0,400}?from\s+["']([^"']+)["']/g;
const TYPE_ONLY_RE = /(?:^|\n)\s*(?:import|export)\s+type\s/;

const files = walk(SCENE);
const edges = [];
for (const file of files) {
  const rel = relative(SCENE, file);
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(IMPORT_RE)) {
    const target = resolveTarget(file, m[1]);
    if (!target) continue;
    edges.push({
      from: rel,
      to: target,
      fromBucket: bucketOf(rel),
      toBucket: bucketOf(target),
      typeOnly: TYPE_ONLY_RE.test(m[0]),
      test: /\.(test|spec)\.tsx?$/.test(rel),
    });
  }
}

/* ---- the target layering rules (plan §Enforcement) ---------------------- */

const FEATURE_ALLOW = new Set([
  "features/volume->features/bricks",
  "features/labels->features/bricks",
  "features/probe->features/bricks",
  "features/annotations->features/bricks",
]);

/**
 * The one documented exception (ARCHITECTURE.md "Open items").
 *
 * viewerStore is the scene's service registry: it carries handles to the brick
 * residency manager and the fabriks managers so components can find them. That
 * makes it NAME three feature types. The imports are `import type` — erased at
 * runtime, so there is no runtime coupling — and dissolving them means
 * splitting ~12 interleaved fields across 33 files in the P17-sensitive render
 * path, which costs far more than three erased type references are worth.
 *
 * Narrow on purpose: platform/stores only, type-only only. Counted and printed
 * separately so it stays visible instead of quietly becoming the norm.
 */
const isDocumentedException = (e) =>
  e.fromBucket === "platform/stores" && e.typeOnly && e.toBucket.startsWith("features/");

const violations = [];
const exceptions = [];
for (const e of edges) {
  if (e.test) continue; // test-only edges are not production layering facts
  const { fromBucket: f, toBucket: t } = e;
  if (f === t) continue;
  if (isDocumentedException(e)) { exceptions.push(e); continue; }
  const tier = (b) => b.split("/")[0];
  if (tier(f) === "platform" && (tier(t) === "features" || tier(t) === "shell"))
    violations.push({ ...e, rule: "platform must not import features/shell" });
  else if (tier(f) === "features" && tier(t) === "features" && !FEATURE_ALLOW.has(`${f}->${t}`))
    violations.push({ ...e, rule: "features must not import sibling features" });
  else if (tier(f) === "features" && tier(t) === "shell")
    violations.push({ ...e, rule: "features must not import shell" });
  else if ((f === "platform/model" || f === "platform/coords") && tier(t) !== "platform")
    violations.push({ ...e, rule: `${f} must be a leaf` });
}

/* ---- output -------------------------------------------------------------- */

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ files: files.length, edges: edges.length, violations }, null, 2));
} else {
  const buckets = [...new Set(edges.flatMap((e) => [e.fromBucket, e.toBucket]))].sort();
  const count = new Map();
  for (const e of edges) count.set(`${e.fromBucket}->${e.toBucket}`, (count.get(`${e.fromBucket}->${e.toBucket}`) ?? 0) + 1);
  const w = Math.max(...buckets.map((b) => b.length)) + 1;
  console.log(`scene import graph — ${files.length} files, ${edges.length} intra-scene edges\n`);
  console.log("rows = importer, cols = imported\n");
  console.log("".padEnd(w) + buckets.map((b) => String(b.length > 6 ? b.slice(-6) : b).padStart(7)).join(""));
  for (const a of buckets)
    console.log(a.padEnd(w) + buckets.map((b) => String(count.get(`${a}->${b}`) ?? ".").padStart(7)).join(""));

  console.log(`\n${violations.length} layering violation(s), ${exceptions.length} documented exception(s)`);
  if (exceptions.length)
    for (const e of exceptions) console.log(`  [ok, documented] ${e.fromBucket} -> ${e.to}  (type-only)`);
  const byRule = new Map();
  for (const v of violations) byRule.set(v.rule, [...(byRule.get(v.rule) ?? []), v]);
  for (const [rule, vs] of byRule) {
    console.log(`\n  ${rule} — ${vs.length}`);
    const show = process.argv.includes("--edges") ? vs : vs.slice(0, 8);
    for (const v of show) console.log(`    ${v.from}\n      -> ${v.to}${v.typeOnly ? "  (type-only)" : ""}`);
    if (!process.argv.includes("--edges") && vs.length > show.length)
      console.log(`    … ${vs.length - show.length} more (--edges to list)`);
  }
}
