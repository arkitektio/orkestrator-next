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
import { instanceHue } from "./instanceColormaps";
import type { FabriksObjectEntry } from "./fabriksCatalogs";

/**
 * The ordinal → RGBA lookup a mesh layer's stored `colorBys` / `filterBys`
 * resolve to, and the one thing that makes them more than metadata.
 *
 * ONE texture for both features, because both answer the same per-object
 * question and a second texture would be a second upload of the same walk:
 *  - `rgb` is the active colouring's colour, or white where nothing colours it
 *    (the material multiplies, so white is "leave the base colour alone");
 *  - `a` is visibility — 1 when every active rule keeps the object, 0 when any
 *    drops it. Rules combine with AND, which is what makes one alpha enough.
 *
 * Indexed by the DENSE ordinal, which is what the vertices carry (fabriks
 * README, "Ordinals, not ids, on the GPU") — object ids are sparse and would
 * size the texture by the largest id rather than by the object count.
 *
 * TWO-dimensional, not a strip: ordinals run to fabriks's 2^24 ceiling and no
 * backend accepts a texture that wide, so the ordinal decomposes into
 * `(ordinal % LUT_WIDTH, ordinal / LUT_WIDTH)`. The same decomposition has to
 * be done in the shader; `LUT_WIDTH` is the shared constant.
 *
 * Filtering paints alpha rather than removing geometry: pulling objects out of
 * the BatchedMesh would fight the batch's slot compaction and the byte-bounded
 * LOD eviction, and a filter that changes what is RESIDENT would re-plan and
 * re-fetch on every toggle. Fragment discard over-rasterizes; that is the right
 * trade here.
 *
 * ---------------------------------------------------------------------------
 * LIMITATION, deliberate: only entries with an EMPTY `joinPath` drive the LUT.
 *
 * A joined entry reads a column one or more `references` hops away from the
 * table the collection's ids key into, and executing that hop means knowing
 * each target table's key column. The server publishes the key column for the
 * BASE table (as an attribute plan's `keyColumns`) and not for the hop targets,
 * so the join would rest on inferring "the single INDEX coordinate column" from
 * a docstring — and a wrong join key does not fail, it returns the wrong rows
 * and the LUT paints plausible garbage.
 *
 * Joined entries therefore stay fully authorable and fully persisted; they just
 * do not render yet, and the card badges them so. `readAcross` already takes a
 * store ARRAY, so lifting this is an addition rather than a rewrite.
 */

/** Texture width; the ordinal's low bits. A power of two by habit, not need. */
export const LUT_WIDTH = 2048;

export type ColorLutEntryColorBy = {
  table: string;
  column: string;
  colormap?: ColorMap | null;
  classColors?: unknown;
  joinPath?: readonly { table: string; column: string }[] | null;
};

export type ColorLutEntryFilterBy = {
  table: string;
  column: string;
  min?: number | null;
  max?: number | null;
  values?: readonly string[] | null;
  exclude: boolean;
  joinPath?: readonly { table: string; column: string }[] | null;
};

export type ColorLutRequest = {
  objects: readonly FabriksObjectEntry[];
  colorBy: ColorLutEntryColorBy | null;
  filterBys: readonly ColorLutEntryFilterBy[];
  /** The collection's attribute plans, for each table's store and key column. */
  plans: readonly AttributePlanLike[];
  engine: AttributeLookupEngine;
};

export type ColorLutResult = {
  texture: THREE.DataTexture;
  width: number;
  height: number;
  /** Entries that named a table no plan reaches, or that need an unbuilt join. */
  skipped: string[];
};

/** An entry reaches its column directly when it takes no `references` hop. */
export const isDirectEntry = (entry: {
  joinPath?: readonly { table: string; column: string }[] | null;
}): boolean => (entry.joinPath?.length ?? 0) === 0;

/**
 * Where an entry's column is READ from, and what its rows are keyed by.
 *
 * Both come off the collection's attribute plans rather than from a second
 * GraphQL round trip: a plan for this collection already names the table's
 * parquet store and the column an object id binds to — that is exactly what a
 * plan IS — and the options query publishes neither.
 */
type TableAccess = { store: ParquetStoreLike; keyColumn: string };

export const accessForTable = (
  plans: readonly AttributePlanLike[],
  tableId: string,
): TableAccess | null => {
  // MESH-sampled plans only: an array-sampled plan keys the same table by a
  // pixel's value, which a mesh object id is not.
  const plan = plans.find(
    (candidate) => candidate.table.id === tableId && isMeshSample(candidate.sample),
  );
  const keyColumn = plan?.lookup.keyColumns[0]?.column.name;
  if (!plan || !keyColumn) return null;
  return { store: plan.lookup.store, keyColumn };
};

/** `objectId → value` for one column of one table. */
const readColumnByObjectId = async (
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
 * The stored entry does not carry its `ColumnControl` — it carries a table id
 * and a column name — and the column's declared role lives behind another
 * query. The values already in hand answer it directly and without one: what
 * decides the rendering is whether a colormap over these values means
 * anything, and for a column of non-numbers it does not.
 */
const looksNumeric = (values: Iterable<unknown>): boolean => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    return typeof value === "number" || Number.isFinite(Number(value));
  }
  return false;
};

const classColorFor = (
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
const ruleKeeps = (rule: ColorLutEntryFilterBy, raw: unknown): boolean => {
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
    // An unconfigured rule states nothing, so it keeps everything. Reading it
    // as "keep nothing" would blank the layer the moment one is switched on.
    return true;
  }
  return rule.exclude ? !matches : matches;
};

/**
 * Build the texture. Every read is one full-column scan of a parquet the client
 * already has a grant for; they run concurrently because they hit different
 * columns and the engine serializes the connection itself.
 */
export const buildColorLut = async (request: ColorLutRequest): Promise<ColorLutResult> => {
  const { objects, colorBy, filterBys, plans, engine } = request;
  const skipped: string[] = [];

  const ordinalCeiling = objects.reduce((max, object) => Math.max(max, object.ordinal), -1);
  const count = ordinalCeiling + 1;
  const width = Math.min(LUT_WIDTH, Math.max(1, count));
  const height = Math.max(1, Math.ceil(count / width));
  const data = new Uint8Array(width * height * 4);
  // White and opaque: the identity for a material that multiplies the colour
  // and discards on zero alpha, so an ordinal no read covered renders exactly
  // as it does today.
  data.fill(255);

  /** Resolve one entry to (access, values), or record why it was skipped. */
  const resolve = async (
    entry: { table: string; column: string; joinPath?: readonly unknown[] | null },
    what: string,
  ): Promise<Map<number, unknown> | null> => {
    if (!isDirectEntry(entry as { joinPath?: readonly { table: string; column: string }[] })) {
      skipped.push(`${what} ${entry.column}: reached through a join, not rendered yet`);
      return null;
    }
    const access = accessForTable(plans, entry.table);
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

  // ------------------------------------------------------------------ colour
  if (colorBy && colorValues) {
    const present = [...colorValues.values()];
    const numeric = looksNumeric(present);
    if (numeric) {
      // The range comes from the DATA, not from the entry: `MeshColorBy` carries
      // a colormap and no bounds, and a colormap over an unknown range would
      // paint every object the same end of the ramp.
      let min = Number.POSITIVE_INFINITY;
      let max = Number.NEGATIVE_INFINITY;
      for (const value of present) {
        const candidate = Number(value);
        if (!Number.isFinite(candidate)) continue;
        if (candidate < min) min = candidate;
        if (candidate > max) max = candidate;
      }
      const span = max - min;
      for (const object of objects) {
        const raw = colorValues.get(object.objectId);
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
        const at = object.ordinal * 4;
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
      for (const object of objects) {
        const raw = colorValues.get(object.objectId);
        if (raw === undefined || raw === null) continue;
        const value = String(raw);
        const [r, g, b] = classColorFor(value, colorBy.classColors, ranks.get(value) ?? 0);
        const at = object.ordinal * 4;
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
    for (const object of objects) {
      if (data[object.ordinal * 4 + 3] === 0) continue; // already dropped (AND)
      if (!ruleKeeps(rule, values.get(object.objectId))) {
        data[object.ordinal * 4 + 3] = 0;
      }
    }
  }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  // NEAREST and no mips: this is a table indexed by an exact integer, not an
  // image — any filtering would blend one object's colour into its neighbour's.
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  return { texture, width, height, skipped };
};
