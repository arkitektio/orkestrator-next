import * as THREE from "three";
import { ColorMap } from "@/mikro-next/api/graphql";
import type {
  AttributePlanLike,
  AttributeRow,
  ParquetStoreLike,
} from "@/mikro-next/lib/attributes/attributeTypes";
import { isMeshSample } from "@/mikro-next/lib/attributes/attributeTypes";
import type { AttributeLookupEngine } from "@/mikro-next/lib/attributes/lookupEngine";
import { escapeSqlIdentifier, escapeSqlLiteral } from "@/mikro-next/lib/attributes/sqlBind";
import { sampleColorMapRgb } from "../colormaps";
import { instanceHue } from "../fabriks/instanceColormaps";

/**
 * The `colorBys` / `filterBys` machinery, shared by MESH collections and LABEL
 * masks.
 *
 * Both answer the same per-object question over the same relation — a mask's
 * pixel values dereference into a table by exactly the FIELD edge a collection's
 * object ids do — so the semantics live here once. They are semantics that must
 * NOT drift between the two features: `exclude` inverts the test and not the
 * answer; an unconfigured rule keeps everything; a column that could not be read
 * applies to nothing; a categorical palette is keyed by the VALUE's rank so every
 * object sharing a value shares its colour; a constant column sits mid-ramp
 * rather than dividing by a zero span.
 *
 * What each caller keeps for itself is only the SLOT MAPPING — where an object's
 * texel lives:
 *
 *  - fabriks indexes by the dense `ordinal` its vertices carry;
 *  - a label mask indexes by `id - idMin`, because a mask's pixels carry SPARSE
 *    raw ids and there is no ordinal anywhere.
 *
 * Hence the two-phase shape: `resolveColumnValues` does the reads, the caller
 * derives its slots from whatever it now knows, and `paintColumnLut` writes the
 * texels. One texture serves both features, because both answer the same
 * per-object question and a second would be a second upload of the same walk:
 * `rgb` is the active colouring's colour (white = leave the base colour alone),
 * and `a` is visibility under the AND of every active rule.
 */

/** Texture width; the slot's low bits. A power of two by habit, not need. */
export const LUT_WIDTH = 2048;

export type ColumnLutEntryColorBy = {
  table: string;
  column: string;
  colormap?: ColorMap | null;
  classColors?: unknown;
  joinPath?: readonly { table: string; column: string }[] | null;
};

export type ColumnLutEntryFilterBy = {
  table: string;
  column: string;
  min?: number | null;
  max?: number | null;
  values?: readonly string[] | null;
  exclude: boolean;
  joinPath?: readonly { table: string; column: string }[] | null;
};

/** Where an entry's column is READ from, and what its rows are keyed by. */
export type TableAccess = { store: ParquetStoreLike; keyColumn: string };

/**
 * Which kind of attribute plan may answer for a table.
 *
 * A MESH plan keys the table by a geometry row's object id; an ARRAY plan keys it
 * by a sampled pixel value. The same table can be reached both ways in one scene,
 * and reading the wrong plan's key column returns the wrong rows — silently — so
 * this is not optional.
 *
 * `storeId` is likewise not optional for the array case: a scene can hold several
 * masks keyed into one table, and picking another mask's plan would resolve this
 * mask's ids against the wrong column.
 */
export type PlanWant = { kind: "mesh" } | { kind: "array"; storeId: string };

/** An entry reaches its column directly when it takes no `references` hop. */
export const isDirectEntry = (entry: {
  joinPath?: readonly { table: string; column: string }[] | null;
}): boolean => (entry.joinPath?.length ?? 0) === 0;

/**
 * The plan that may answer for a table, and the column its rows are keyed by.
 *
 * Comes off the attribute plans rather than a second GraphQL round trip: a plan
 * already names the table's parquet store and the column a sampled value binds
 * to — that is what a plan IS — and the options query publishes neither.
 */
export const accessForTable = (
  plans: readonly AttributePlanLike[],
  tableId: string,
  want: PlanWant,
): TableAccess | null => {
  const plan = plans.find((candidate) => {
    if (candidate.table.id !== tableId) return false;
    if (want.kind === "mesh") return isMeshSample(candidate.sample);
    // An array-sampled plan over THIS array. `sample.store` is the zarr store
    // the values are sampled from, which is what identifies the mask.
    if (isMeshSample(candidate.sample)) return false;
    return candidate.sample.store?.id === want.storeId;
  });
  const keyColumn = plan?.lookup.keyColumns[0]?.column.name;
  if (!plan || !keyColumn) return null;
  return { store: plan.lookup.store, keyColumn };
};

/** `objectId → value` for one column of one table. */
export const readColumnByObjectId = async (
  engine: AttributeLookupEngine,
  access: TableAccess,
  column: string,
): Promise<Map<number, unknown>> => {
  const key = escapeSqlIdentifier(access.keyColumn);
  const value = escapeSqlIdentifier(column);
  const rows: readonly AttributeRow[] = await engine.readAcross(
    [access.store],
    (urlOf) =>
      `SELECT ${key} AS object_id, ${value} AS value FROM read_parquet(${escapeSqlLiteral(
        urlOf(access.store.id),
      )})`,
  );
  const byId = new Map<number, unknown>();
  for (const row of rows) {
    const id = Number(row.object_id);
    if (Number.isFinite(id)) byId.set(id, row.value);
  }
  return byId;
};

/**
 * Whether a column's values are measured or naming, from the values themselves.
 *
 * The stored entry does not carry its `ColumnControl` — it carries a table id and
 * a column name — and the column's declared role lives behind another query. The
 * values already in hand answer it directly and without one: what decides the
 * rendering is whether a colormap over these values means anything, and for a
 * column of non-numbers it does not.
 */
export const looksNumeric = (values: Iterable<unknown>): boolean => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    return typeof value === "number" || Number.isFinite(Number(value));
  }
  return false;
};

export const classColorFor = (
  value: string,
  classColors: unknown,
  ordinalOfValue: number,
): [number, number, number] => {
  const explicit =
    classColors && typeof classColors === "object"
      ? (classColors as Record<string, unknown>)[value]
      : undefined;
  if (Array.isArray(explicit) && explicit.length >= 3) {
    return [Number(explicit[0]), Number(explicit[1]), Number(explicit[2])];
  }
  // No declared colour: the same golden-ratio hue scatter the instance palette
  // uses, keyed by the VALUE's rank rather than the object's — so every object
  // sharing a value shares its colour, which is the whole point of colouring by
  // a categorical column.
  const color = new THREE.Color().setHSL(instanceHue(ordinalOfValue), 0.72, 0.58);
  return [Math.round(color.r * 255), Math.round(color.g * 255), Math.round(color.b * 255)];
};

/** Does this rule KEEP the object? `exclude` inverts the answer, not the test. */
export const ruleKeeps = (rule: ColumnLutEntryFilterBy, raw: unknown): boolean => {
  let matches: boolean;
  if (rule.values && rule.values.length > 0) {
    matches = raw !== null && raw !== undefined && rule.values.includes(String(raw));
  } else if (rule.min != null || rule.max != null) {
    const numeric = Number(raw);
    matches =
      Number.isFinite(numeric) &&
      (rule.min == null || numeric >= rule.min) &&
      (rule.max == null || numeric <= rule.max);
  } else {
    // An unconfigured rule states nothing, so it keeps everything. Reading it as
    // "keep nothing" would blank the layer the moment one is switched on.
    return true;
  }
  return rule.exclude ? !matches : matches;
};

export type ResolvedColumnValues = {
  /** `objectId → value` for the active colouring, or null when it could not be read. */
  colorValues: Map<number, unknown> | null;
  /** Per active rule, in order; a null entry could not be read. */
  ruleValues: (Map<number, unknown> | null)[];
  /** Entries that named an unreachable table, or that need an unbuilt join. */
  skipped: string[];
};

/**
 * PHASE 1 — read every active entry's column out of the parquet.
 *
 * Every read is one full-column scan of a parquet the client already has a grant
 * for; they run concurrently because they hit different columns and the engine
 * serializes the connection itself.
 *
 * ---------------------------------------------------------------------------
 * LIMITATION, deliberate: only entries with an EMPTY `joinPath` are read.
 *
 * A joined entry reads a column one or more `references` hops away from the table
 * the ids key into, and executing that hop means knowing each target table's key
 * column. The server publishes the key column for the BASE table (as a plan's
 * `keyColumns`) and not for the hop targets, so the join would rest on inferring
 * "the single INDEX coordinate column" from a docstring — and a wrong join key
 * does not fail, it returns the wrong rows and paints plausible garbage.
 *
 * Joined entries therefore stay fully authorable and fully persisted; they just
 * do not render yet, and the cards badge them so. `readAcross` already takes a
 * store ARRAY, so lifting this is an addition rather than a rewrite.
 */
export const resolveColumnValues = async ({
  colorBy,
  filterBys,
  plans,
  engine,
  want,
}: {
  colorBy: ColumnLutEntryColorBy | null;
  filterBys: readonly ColumnLutEntryFilterBy[];
  plans: readonly AttributePlanLike[];
  engine: AttributeLookupEngine;
  want: PlanWant;
}): Promise<ResolvedColumnValues> => {
  const skipped: string[] = [];

  const resolve = async (
    entry: { table: string; column: string; joinPath?: readonly { table: string; column: string }[] | null },
    what: string,
  ): Promise<Map<number, unknown> | null> => {
    if (!isDirectEntry(entry)) {
      skipped.push(`${what} ${entry.column}: reached through a join, not rendered yet`);
      return null;
    }
    const access = accessForTable(plans, entry.table, want);
    if (!access) {
      skipped.push(`${what} ${entry.column}: no attribute plan reaches table ${entry.table}`);
      return null;
    }
    return readColumnByObjectId(engine, access, entry.column);
  };

  const [colorValues, ruleValues] = await Promise.all([
    colorBy ? resolve(colorBy, "colouring") : Promise.resolve(null),
    Promise.all(filterBys.map((rule) => resolve(rule, "rule"))),
  ]);

  return { colorValues, ruleValues, skipped };
};

/** One object and the texel it owns. `slot` is the caller's own mapping. */
export type ColumnLutTarget = { objectId: number; slot: number };

/**
 * PHASE 2 — allocate the RGBA8 texel buffer, white and opaque.
 *
 * That fill is the IDENTITY: the materials multiply the colour and discard on
 * zero alpha, so a slot no read covered renders exactly as it would with no LUT
 * at all. It is why an object whose id has no row in the table keeps its base
 * colour and stays visible, rather than vanishing because a read did not reach
 * it — a filter must never hide something it never saw.
 */
export const allocateColumnLut = (
  slotCount: number,
): {
  data: Uint8Array;
  width: number;
  height: number;
} => {
  const count = Math.max(1, slotCount);
  const width = Math.min(LUT_WIDTH, count);
  const height = Math.max(1, Math.ceil(count / width));
  const data = new Uint8Array(width * height * 4);
  data.fill(255);
  return { data, width, height };
};

/** Texels a `slotCount` would allocate — for a caller that wants to refuse first. */
export const columnLutTexels = (slotCount: number): number => {
  const count = Math.max(1, slotCount);
  const width = Math.min(LUT_WIDTH, count);
  return width * Math.max(1, Math.ceil(count / width));
};

/**
 * PHASE 3 — write the colour into `rgb` and the AND of every rule into `a`.
 *
 * Mutates `data` in place; the caller wraps it in a texture.
 */
export const paintColumnLut = ({
  data,
  targets,
  colorBy,
  filterBys,
  colorValues,
  ruleValues,
}: {
  data: Uint8Array;
  targets: readonly ColumnLutTarget[];
  colorBy: ColumnLutEntryColorBy | null;
  filterBys: readonly ColumnLutEntryFilterBy[];
} & Pick<ResolvedColumnValues, "colorValues" | "ruleValues">): void => {
  // ------------------------------------------------------------------ colour
  if (colorBy && colorValues) {
    const present = [...colorValues.values()];
    if (looksNumeric(present)) {
      // The range comes from the DATA, not from the entry: a colour-by entry
      // carries a colormap and no bounds, and a colormap over an unknown range
      // would paint every object the same end of the ramp.
      let min = Number.POSITIVE_INFINITY;
      let max = Number.NEGATIVE_INFINITY;
      for (const value of present) {
        const candidate = Number(value);
        if (!Number.isFinite(candidate)) continue;
        if (candidate < min) min = candidate;
        if (candidate > max) max = candidate;
      }
      const span = max - min;
      for (const target of targets) {
        const raw = colorValues.get(target.objectId);
        if (raw === undefined || raw === null) continue;
        const value = Number(raw);
        if (!Number.isFinite(value)) continue;
        // A constant column is not a gradient; put it mid-ramp rather than
        // dividing by a zero span.
        const t = span > 0 ? (value - min) / span : 0.5;
        // `sampleColorMapRgb` answers in 0..1 floats (it feeds shader uniforms
        // and CSS gradients); this texture is RGBA8, and writing the float
        // straight into a Uint8Array truncates every channel to black.
        const [r, g, b] = sampleColorMapRgb(colorBy.colormap ?? ColorMap.Viridis, t);
        const at = target.slot * 4;
        data[at] = Math.round(r * 255);
        data[at + 1] = Math.round(g * 255);
        data[at + 2] = Math.round(b * 255);
      }
    } else {
      // Stable value → rank, so the palette does not reshuffle between builds.
      const ranks = new Map<string, number>();
      for (const value of [...new Set(present.map((entry) => String(entry)))].sort()) {
        ranks.set(value, ranks.size);
      }
      for (const target of targets) {
        const raw = colorValues.get(target.objectId);
        if (raw === undefined || raw === null) continue;
        const value = String(raw);
        const [r, g, b] = classColorFor(value, colorBy.classColors, ranks.get(value) ?? 0);
        const at = target.slot * 4;
        data[at] = r;
        data[at + 1] = g;
        data[at + 2] = b;
      }
    }
  }

  // ------------------------------------------------------------- visibility
  for (let index = 0; index < filterBys.length; index += 1) {
    const rule = filterBys[index];
    const values = ruleValues[index];
    // A rule whose column could not be read applies to nothing rather than to
    // everything: silently hiding every object because a read failed is the
    // worst possible reading of "filter".
    if (!values) continue;
    for (const target of targets) {
      if (data[target.slot * 4 + 3] === 0) continue; // already dropped (AND)
      if (!ruleKeeps(rule, values.get(target.objectId))) {
        data[target.slot * 4 + 3] = 0;
      }
    }
  }
};

/**
 * PHASE 4 — the texture. NEAREST and no mips: this is a table indexed by an
 * exact integer, not an image — any filtering would blend one object's colour
 * into its neighbour's.
 */
export const columnLutTexture = (
  data: Uint8Array,
  width: number,
  height: number,
): THREE.DataTexture => {
  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
};
