import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * The scene's import rules, asserted.
 *
 * `ARCHITECTURE.md` states them; this keeps them true. The old `core/` grew to
 * 153 files precisely because nothing checked — docs alone have a short
 * half-life, and every one of the layering violations this suite pins was
 * cheap to introduce and expensive to find.
 *
 * Three rules are hard zeroes. The fourth — features reaching sideways — is a
 * RATCHET against a known list, in the same spirit as `typecheck-baseline.json`:
 * the count may fall, never rise. Removing an entry is the work; adding one
 * needs a reason in ARCHITECTURE.md.
 */

const SCENE = dirname(fileURLToPath(import.meta.url));
const ALIAS_PREFIX = "@/mikro-next/components/scene/";

/** `bricks` is the shared engine — the one folder other features may import. */
const FEATURE_ALLOWLIST = new Set([
  "features/volume->features/bricks",
  "features/labels->features/bricks",
  "features/probe->features/bricks",
  "features/annotations->features/bricks",
]);

/**
 * Sideways edges that exist today, each waiting on a specific piece of work.
 * This list is a ceiling, not a licence.
 */
const KNOWN_SIDEWAYS: Record<string, number> = {
  // The debug panel reaches into brick and mesh internals to report on them.
  // Removed by shell/debugRegistry.ts, where each feature contributes its own
  // section instead.
  "features/debug->features/bricks": 7,
  "features/debug->features/meshes": 1,
  "features/debug->features/annotations": 1,
  // BrickVolumeLayer and useBrickPlaneProbe run annotation drawing inline.
  // Removed when BrickVolumeLayer is split.
  "features/bricks->features/annotations": 5,
  // FabriksCollectionLayer reads the ROI drawing store directly.
  "features/meshes->features/annotations": 1,
  // SelectedPointPanel's "create annotation from probe" action.
  "features/probe->features/annotations": 3,
};

type Edge = { from: string; to: string; fromBucket: string; toBucket: string; typeOnly: boolean };

const walk = (dir: string, out: string[] = []): string[] => {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "__fixtures__") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
};

/** tier/sub for a nested file; the bare tier for one sitting directly in it. */
const bucketOf = (rel: string): string => {
  const parts = rel.split("/");
  if (parts.length === 1) return "(root)";
  if (["features", "platform", "shell"].includes(parts[0])) {
    return parts.length > 2 ? `${parts[0]}/${parts[1]}` : parts[0];
  }
  return parts[0];
};

const resolveTarget = (fromFile: string, spec: string): string | null => {
  let abs: string;
  if (spec.startsWith(".")) abs = resolve(dirname(fromFile), spec);
  else if (spec.startsWith(ALIAS_PREFIX)) abs = join(SCENE, spec.slice(ALIAS_PREFIX.length));
  else return null;
  const rel = relative(SCENE, abs);
  if (rel.startsWith("..")) return null; // left the scene
  for (const cand of [abs, `${abs}.ts`, `${abs}.tsx`, join(abs, "index.ts")]) {
    if (existsSync(cand) && statSync(cand).isFile()) return relative(SCENE, cand);
  }
  return null;
};

const IMPORT_RE = /(?:^|\n)\s*(?:import|export)[\s\S]{0,400}?from\s+["']([^"']+)["']/g;

const edges: Edge[] = [];
for (const file of walk(SCENE)) {
  const rel = relative(SCENE, file);
  // Test-only edges are not production layering facts: a contract test may
  // legitimately reach across to assert two sides agree.
  if (/\.(test|spec)\.tsx?$/.test(rel)) continue;
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(IMPORT_RE)) {
    const to = resolveTarget(file, m[1]);
    if (!to) continue;
    edges.push({
      from: rel,
      to,
      fromBucket: bucketOf(rel),
      toBucket: bucketOf(to),
      typeOnly: /^\s*(?:import|export)\s+type\s/.test(m[0].trim()),
    });
  }
}

const tier = (bucket: string) => bucket.split("/")[0];
const show = (es: Edge[]) => es.map((e) => `  ${e.from}\n    -> ${e.to}`).join("\n");

describe("scene architecture", () => {
  it("finds the import graph", () => {
    // Guards the suite itself: a resolver that silently matches nothing would
    // make every assertion below pass for the wrong reason.
    expect(edges.length).toBeGreaterThan(900);
  });

  it("platform imports nothing from features or shell", () => {
    const bad = edges.filter(
      (e) =>
        tier(e.fromBucket) === "platform" &&
        ["features", "shell"].includes(tier(e.toBucket)) &&
        // The one documented exception: viewerStore is the scene's service
        // registry and names three feature handle types. Type-only, so it is
        // erased at runtime. See ARCHITECTURE.md "Open items".
        !(e.fromBucket === "platform/stores" && e.typeOnly),
    );
    expect(
      bad.length,
      `platform/ must not know about a feature:\n${show(bad)}`,
    ).toBe(0);
  });

  it("features import nothing from shell", () => {
    const bad = edges.filter(
      (e) => tier(e.fromBucket) === "features" && tier(e.toBucket) === "shell",
    );
    expect(
      bad.length,
      `shell/ is the composition root — it knows features, not the reverse:\n${show(bad)}`,
    ).toBe(0);
  });

  it("platform/model and platform/coords are leaves", () => {
    const bad = edges.filter(
      (e) =>
        ["platform/model", "platform/coords"].includes(e.fromBucket) &&
        tier(e.toBucket) !== "platform",
    );
    expect(
      bad.length,
      `the layer vocabulary must depend on nothing above it:\n${show(bad)}`,
    ).toBe(0);
  });

  it("features do not reach sideways beyond the known list", () => {
    const counts: Record<string, number> = {};
    const sideways = edges.filter(
      (e) =>
        tier(e.fromBucket) === "features" &&
        tier(e.toBucket) === "features" &&
        e.fromBucket !== e.toBucket &&
        !FEATURE_ALLOWLIST.has(`${e.fromBucket}->${e.toBucket}`),
    );
    for (const e of sideways) {
      const key = `${e.fromBucket}->${e.toBucket}`;
      counts[key] = (counts[key] ?? 0) + 1;
    }

    for (const [key, n] of Object.entries(counts)) {
      const budget = KNOWN_SIDEWAYS[key];
      expect(
        budget,
        `new sideways edge ${key}:\n${show(sideways.filter((e) => `${e.fromBucket}->${e.toBucket}` === key))}\n` +
          `Invert it, or demote the shared symbol to platform/. Adding it to the ` +
          `list needs a reason in ARCHITECTURE.md.`,
      ).toBeDefined();
      expect(n, `${key} grew from ${budget} to ${n} — the list is a ceiling`).toBeLessThanOrEqual(budget ?? 0);
    }

    // Ratchet down: once an entry is cleared, its budget must come off the list
    // so it cannot silently come back.
    for (const [key, budget] of Object.entries(KNOWN_SIDEWAYS)) {
      const n = counts[key] ?? 0;
      expect(
        n,
        `${key} is down to ${n} (budget ${budget}) — lower or remove its entry in KNOWN_SIDEWAYS`,
      ).toBe(budget);
    }
  });
});
