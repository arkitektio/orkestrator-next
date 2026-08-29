import * as THREE from "three";
import type { AttributePlanLike } from "@/mikro-next/lib/attributes/attributeTypes";
import type { AttributeLookupEngine } from "@/mikro-next/lib/attributes/lookupEngine";
import {
  allocateColumnLut,
  columnLutTexels,
  columnLutTexture,
  isDirectEntry as isDirectColumnEntry,
  paintColumnLut,
  resolveColumnValues,
  accessForTable as tableAccessFor,
  type ColumnLutEntryColorBy,
  type ColumnLutEntryFilterBy,
  type TableAccess,
} from "../../../platform/attributes/columnLut";
import type { SparseReadRequest } from "@/mikro-next/lib/sparse/sparseSource";
import { readColumnByObjectIdCached } from "../../../platform/attributes/columnValueCache";
import type { FabriksObjectEntry } from "./fabriksCatalogs";

export { LUT_WIDTH } from "../../../platform/attributes/columnLut";

/**
 * The ordinal → RGBA lookup a MESH layer's stored `colorBys` / `filterBys`
 * resolve to, and the one thing that makes them more than metadata.
 *
 * The semantics — how a measure becomes a ramp, how a categorical becomes a
 * palette, what a rule keeps, what an unreadable column means — live in
 * `platform/attributes/columnLut.ts`, shared with the LABEL path: a mask's pixel
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
  /**
   * Present only when the active colouring reads a sparse matrix. Supplied by
   * the caller rather than reached for here, so this module stays a pure
   * builder — the same reason `readColumn` is injected.
   */
  sparse?: SparseReadRequest | null;
  /**
   * Reads one slice of ANY matrix, for the RULES — the same injection, for the
   * same reason, as `sparse` is for the colouring. A rule need not name the
   * matrix the colouring does, so its source is resolved by id at read time.
   * Absent means a sparse rule cannot be read and is `skipped`.
   */
  readSparse?:
    | ((
        datasetId: string,
        at: readonly { axis: string; value: number }[],
      ) => Promise<{ values: Map<number, number>; slotCount: number }>)
    | null;
};

/**
 * The budget for a mesh colour table.
 *
 * The label path has had one of these all along; this one never did, and its
 * ordinal map below carries the assumption "which number in the thousands" as a
 * comment rather than a limit. A collection large enough would therefore have
 * silently allocated what the label builder loudly refuses. Same bytes, same
 * discipline, said out loud.
 */
export const MESH_LUT_MAX_BYTES = 16 * 1024 * 1024;

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
  const { objects, colorBy, filterBys, plans, engine, sparse, readSparse } = request;

  // BOTH halves can now read a matrix: `MeshFilterByInput` grew the same
  // `kind`/`dataset`/`at` arm its colouring sibling has, so "keep the objects
  // where this ion is above x" is expressible. `resolveColumnValues` is the
  // DuckDB path and narrows those entries away, answering null for each; the
  // reads below take those nulls' places.
  const { colorValues: columnValues, ruleValues, skipped } = await resolveColumnValues({
    colorBy: sparse ? null : colorBy,
    filterBys,
    plans,
    engine,
    want: { kind: "mesh" },
    // Cached: the LUT rebuilds on every knob nudge (colormap, clim, rule
    // bound), and the column VALUES change with none of them — only the
    // paint does. The full-table scan runs once per column per engine.
    readColumn: readColumnByObjectIdCached,
  });

  // A SPARSE colouring reads a slice of a matrix rather than a column of a
  // table — no SQL and no database in that path. Everything below is
  // indifferent: the painter takes `objectId -> value` and does not care where
  // it came from.
  const colorValues = sparse
    ? ((
        await sparse.read(
          sparse.source,
          (colorBy?.at ?? []).map((position) => ({ axis: position.axis, value: position.value })),
        )
      ).values as Map<number, unknown>)
    : columnValues;

  // A rule that cannot be read is `skipped`, never silently dropped — a filter
  // quietly applying to nothing looks exactly like a filter that works.
  await Promise.all(
    filterBys.map(async (rule, index) => {
      if (rule.dataset == null) return;
      if (!readSparse) {
        skipped.push(
          `rule over matrix ${rule.dataset}: no datalayer connection, so the slice could not be read`,
        );
        return;
      }
      try {
        const read = await readSparse(rule.dataset, rule.at ?? []);
        ruleValues[index] = read.values as Map<number, unknown>;
      } catch (error) {
        skipped.push(
          `rule over matrix ${rule.dataset}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }),
  );

  const ordinalCeiling = objects.reduce((max, object) => Math.max(max, object.ordinal), -1);
  const slotCount = ordinalCeiling + 1;

  // The guard the label path has and this one never did. `allocateColumnLut`
  // has no cap of its own, and the ordinal map below assumes "thousands" — so a
  // collection large enough would silently allocate what the label builder
  // loudly refuses. Same budget, stated the same way.
  if (columnLutTexels(slotCount) * 4 > MESH_LUT_MAX_BYTES) {
    skipped.push(
      `this collection runs to ${slotCount} objects, so the lookup table is ${Math.round((slotCount * 4) / 1e6)} MB against a budget of ${Math.round(MESH_LUT_MAX_BYTES / 1e6)} MB — no colouring or filter is applied`,
    );
    // A 1x1 identity rather than null: this result type is non-nullable, and
    // `setColorLut` disposes what it replaces, so handing back a real texture
    // keeps that contract while colouring nothing.
    const identity = allocateColumnLut(1);
    return {
      texture: columnLutTexture(identity.data, identity.width, identity.height),
      width: identity.width,
      height: identity.height,
      skipped,
    };
  }

  const { data, width, height } = allocateColumnLut(slotCount);

  // The mesh slot mapping: the ordinal IS the slot. Unlike the label path this
  // is a genuine lookup rather than arithmetic, so it stays a map — built once
  // over the collection's objects, which number in the thousands.
  const ordinals = new Map<number, number>();
  for (const object of objects) ordinals.set(object.objectId, object.ordinal);

  paintColumnLut({
    data,
    slotCount,
    slotOf: (objectId) => ordinals.get(objectId) ?? -1,
    colorBy,
    filterBys,
    colorValues,
    ruleValues,
  });

  return { texture: columnLutTexture(data, width, height), width, height, skipped };
};
