import * as THREE from "three";
import type { AttributePlanLike } from "@/mikro-next/lib/attributes/attributeTypes";
import type { AttributeLookupEngine } from "@/mikro-next/lib/attributes/lookupEngine";
import {
  allocateColumnLut,
  columnLutTexture,
  isDirectEntry as isDirectColumnEntry,
  paintColumnLut,
  resolveColumnValues,
  accessForTable as tableAccessFor,
  type ColumnLutEntryColorBy,
  type ColumnLutEntryFilterBy,
  type TableAccess,
} from "../attributes/columnLut";
import { readColumnByObjectIdCached } from "../attributes/columnValueCache";
import type { FabriksObjectEntry } from "./fabriksCatalogs";

export { LUT_WIDTH } from "../attributes/columnLut";

/**
 * The ordinal → RGBA lookup a MESH layer's stored `colorBys` / `filterBys`
 * resolve to, and the one thing that makes them more than metadata.
 *
 * The semantics — how a measure becomes a ramp, how a categorical becomes a
 * palette, what a rule keeps, what an unreadable column means — live in
 * `render/attributes/columnLut.ts`, shared with the LABEL path: a mask's pixel
 * values dereference into a table by exactly the FIELD edge a collection's object
 * ids do, so two copies of those rules would mean one of them was wrong.
 *
 * What stays HERE is the one thing that is genuinely mesh-specific: the SLOT
 * MAPPING. Fabriks indexes by the DENSE ordinal its vertices carry (README,
 * "Ordinals, not ids, on the GPU") — object ids are sparse and would size the
 * texture by the largest id rather than by the object count. A label mask has no
 * ordinal and indexes by the id itself; that is the whole difference between the
 * two builders.
 *
 * ONE texture for both features, because both answer the same per-object question
 * and a second texture would be a second upload of the same walk:
 *  - `rgb` is the active colouring's colour, or white where nothing colours it
 *    (the material multiplies, so white is "leave the base colour alone");
 *  - `a` is visibility — 1 when every active rule keeps the object, 0 when any
 *    drops it. Rules combine with AND, which is what makes one alpha enough.
 *
 * TWO-dimensional, not a strip: ordinals run to fabriks's 2^24 ceiling and no
 * backend accepts a texture that wide, so the ordinal decomposes into
 * `(ordinal % LUT_WIDTH, ordinal / LUT_WIDTH)`. The same decomposition has to be
 * done in the shader; `LUT_WIDTH` is the shared constant.
 *
 * Filtering paints alpha rather than removing geometry: pulling objects out of
 * the BatchedMesh would fight the batch's slot compaction and the byte-bounded
 * LOD eviction, and a filter that changes what is RESIDENT would re-plan and
 * re-fetch on every toggle. Fragment discard over-rasterizes; that is the right
 * trade here.
 *
 * The joined-entry limitation is stated once, in `resolveColumnValues`.
 */

export type ColorLutEntryColorBy = ColumnLutEntryColorBy;
export type ColorLutEntryFilterBy = ColumnLutEntryFilterBy;

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
export const isDirectEntry = isDirectColumnEntry;

/**
 * Where a mesh entry's column is read from. MESH-sampled plans only: an
 * array-sampled plan keys the same table by a pixel's value, which a mesh object
 * id is not.
 */
export const accessForTable = (
  plans: readonly AttributePlanLike[],
  tableId: string,
): TableAccess | null => tableAccessFor(plans, tableId, { kind: "mesh" });

/**
 * Build the texture, indexed by the objects' dense ordinals.
 */
export const buildColorLut = async (request: ColorLutRequest): Promise<ColorLutResult> => {
  const { objects, colorBy, filterBys, plans, engine } = request;

  const { colorValues, ruleValues, skipped } = await resolveColumnValues({
    colorBy,
    filterBys,
    plans,
    engine,
    want: { kind: "mesh" },
    // Cached: the LUT rebuilds on every knob nudge (colormap, clim, rule
    // bound), and the column VALUES change with none of them — only the
    // paint does. The full-table scan runs once per column per engine.
    readColumn: readColumnByObjectIdCached,
  });

  const ordinalCeiling = objects.reduce((max, object) => Math.max(max, object.ordinal), -1);
  const { data, width, height } = allocateColumnLut(ordinalCeiling + 1);

  paintColumnLut({
    data,
    // The mesh slot mapping: the ordinal IS the slot.
    targets: objects.map((object) => ({ objectId: object.objectId, slot: object.ordinal })),
    colorBy,
    filterBys,
    colorValues,
    ruleValues,
  });

  return { texture: columnLutTexture(data, width, height), width, height, skipped };
};
