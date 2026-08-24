import type * as THREE from "three";
import type { AttributePlanLike } from "@/mikro-next/lib/attributes/attributeTypes";
import type { AttributeLookupEngine } from "@/mikro-next/lib/attributes/lookupEngine";
import {
  resolveColumnValues,
  type ColumnLutEntryColorBy,
  type ColumnLutEntryFilterBy,
} from "../../platform/attributes/columnLut";
import {
  CODE_NO_VALUE,
  VALUE_LUT_BYTES_PER_TEXEL,
  allocateValueLut,
  encodeValue,
  paintValueLut,
  valueLutTexels,
  valueLutTexture,
} from "../../platform/attributes/valueLut";
import type { SparseReadRequest } from "@/mikro-next/lib/sparse/sparseSource";
import { readColumnByObjectIdCached } from "../../platform/attributes/columnValueCache";

export { LUT_WIDTH } from "../../platform/attributes/columnLut";

/**
 * The id → RGBA lookup a LABEL layer's stored `colorBys` / `filterBys` resolve
 * to — the mesh feature's twin, over the same relation and with the same
 * semantics (they live in `platform/attributes/columnLut.ts`, shared).
 *
 * THE ONE REAL DIFFERENCE: fabriks indexes the LUT by a DENSE ordinal its
 * vertices carry, and a mask's pixels carry SPARSE raw ids with no ordinal
 * anywhere. So this indexes directly by the id, offset to the smallest one
 * present:
 *
 *     slot = id - idOffset        (idOffset = the smallest id, so it lands at 0)
 *
 * Why direct indexing rather than a hash table in the texture: real segmentation
 * ids are dense small integers (skimage, cellpose and friends label 1..N), so the
 * texture is usually a few hundred KB, and the shader stays the same four lines
 * fabriks uses. A shader-side hash would be correct at any sparsity but costs a
 * data-dependent probe loop per fragment — in a shader we cannot unit-test
 * without a GPU — to solve a case that essentially does not occur. The offset
 * handles the one cheap generalisation (ids that all sit above some floor), and
 * `LABEL_LUT_MAX_TEXELS` refuses the pathological rest rather than allocating
 * hundreds of MB.
 *
 * WHERE THE IDS COME FROM: the lookup table's ROWS, not the mask's pixels. A
 * pixel scan would mean reading the whole mask back off the GPU; the table
 * already answers it, because `readColumnByObjectId`'s keys ARE the ids that have
 * a row. An id in the mask with no row keeps the identity texel (white, opaque)
 * and therefore its hue hash and its visibility — a filter must never hide
 * something because a read did not cover it.
 */

/**
 * The largest LUT this will build, as what it has always actually been: a
 * MEMORY budget.
 *
 * A cap rather than a fallback, and a LOUD one: over it nothing is built and the
 * reason lands on `skipped`, which the layer surfaces. Silently building a
 * 500 MB texture, or silently painting nothing, are both worse than refusing.
 *
 * It used to be spelled as a texel count (4,194,304) with "≈ 16 MB at RGBA8" in
 * the comment, which tied the budget to an encoding that is about to change.
 * Stated in bytes it survives that: at RGBA8 it is the same 4,194,304 texels it
 * always was, and a narrower texel buys proportionally more of them.
 *
 * The device is NOT the binding constraint. `LUT_WIDTH` is 2048 and WebGPU
 * guarantees `maxTextureDimension2D >= 8192`, so the smallest legal device
 * still addresses 16,777,216 slots — three times what a 2 µm bin lattice needs.
 * What we are actually rationing is host and GPU memory.
 */
export const LABEL_LUT_MAX_BYTES = 16 * 1024 * 1024;

/** How many slots that budget buys at a given texel width. */
export const labelLutMaxTexels = (bytesPerTexel: number): number =>
  Math.floor(LABEL_LUT_MAX_BYTES / Math.max(1, bytesPerTexel));

/**
 * The budget in texels for the RG8 value table this module builds.
 *
 * Two bytes a slot rather than four is what brings a 2 µm bin lattice
 * (5,479,660 slots, 11.0 MB) inside the same 16 MB budget that refused it at
 * RGBA8 (21.9 MB). The budget did not move; the texel got narrower.
 */
export const LABEL_LUT_MAX_TEXELS = labelLutMaxTexels(VALUE_LUT_BYTES_PER_TEXEL);

export type LabelColorLutRequest = {
  colorBy: ColumnLutEntryColorBy | null;
  /** Present only when the active colouring reads a sparse matrix. */
  sparse?: SparseReadRequest | null;
  filterBys: readonly ColumnLutEntryFilterBy[];
  /** The mask's attribute plans, for each table's store and key column. */
  plans: readonly AttributePlanLike[];
  /** The zarr store of the mask's level 0 — which ARRAY plan answers for it. */
  storeId: string;
  engine: AttributeLookupEngine;
};

export type LabelColorLutResult = {
  /**
   * Null when nothing could be built — no readable entry, or ids too sparse to
   * index. The caller switches the LUT off and the mask falls back to its hue
   * hash; `skipped` says why, so a refusal is never silent.
   */
  texture: THREE.DataTexture | null;
  width: number;
  height: number;
  /** Subtract from an id to get its slot. The shader's `uLutIdOffset`. */
  idOffset: number;
  /** Entries that were not rendered, and why. */
  skipped: string[];
  /** The range the codes were quantised over — `uLutValueMin`/`Max`. */
  valueMin: number;
  valueMax: number;
};

/**
 * The extent of the ids that have a row in any entry we managed to read.
 *
 * The extent is all the allocation needs — `slot = id - idOffset` addresses the
 * whole range whether or not every id in it has a row. This used to also return
 * the ids themselves, as a `Set` spread into an `Array`, which at a bin
 * lattice's scale was two structures as long as the id range built only to be
 * walked once. The painter iterates the value maps directly instead.
 */
const idExtent = (
  colorValues: Map<number, unknown> | null,
  ruleValues: readonly (Map<number, unknown> | null)[],
): { min: number; max: number } | null => {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  let seen = false;
  const consider = (values: Map<number, unknown> | null) => {
    if (!values) return;
    for (const id of values.keys()) {
      seen = true;
      if (id < min) min = id;
      if (id > max) max = id;
    }
  };
  consider(colorValues);
  for (const values of ruleValues) consider(values);
  return seen ? { min, max } : null;
};

export const buildLabelColorLut = async (
  request: LabelColorLutRequest,
): Promise<LabelColorLutResult> => {
  const { colorBy, filterBys, plans, storeId, engine, sparse } = request;

  // A sparse colouring reads a slice of a matrix, not a column of a table, so
  // it bypasses the DuckDB path entirely — there is no SQL and no database in
  // it. Everything downstream is indifferent: the painter takes a
  // `Map<objectId, value>` and does not care where it came from.
  if (colorBy && sparse) {
    const at = (colorBy.at ?? []).map((position) => ({
      axis: position.axis,
      value: position.value,
    }));
    const { values, slotCount: extent } = await sparse.read(sparse.source, at);
    // The slot table spans the OBJECT axis, not the ids that happened to carry
    // a value. That is what makes it gene-independent, and therefore reusable
    // across gene switches.
    const slotCount = Math.max(1, extent);
    const skipped: string[] = [];
    if (valueLutTexels(slotCount) > LABEL_LUT_MAX_TEXELS) {
      skipped.push(
        `'${sparse.source.name}' runs to ${slotCount} objects, so the lookup table is ${Math.round((slotCount * VALUE_LUT_BYTES_PER_TEXEL) / 1e6)} MB against a budget of ${Math.round(LABEL_LUT_MAX_BYTES / 1e6)} MB — no colouring is applied`,
      );
      return { texture: null, width: 0, height: 0, idOffset: 0, skipped, valueMin: 0, valueMax: 1 };
    }

    const lut = allocateValueLut(slotCount);
    // A bin absent from the slice has expression exactly ZERO — a slice is the
    // complete truth for its feature — so the window must include 0 or an
    // all-positive gene would start its ramp at its own minimum.
    let min = 0;
    let max = 0;
    for (const value of values.values()) {
      if (value < min) min = value;
      if (value > max) max = value;
    }
    if (max === min) max = min + 1;
    for (const [objectId, value] of values) {
      if (objectId < 0 || objectId >= slotCount) continue;
      lut.view[objectId] = encodeValue(value, min, max);
    }
    // Every other slot keeps the baseline, which for a sparse colouring MEANS
    // zero rather than "unknown" — so fill the whole table at the code for 0.
    const zero = encodeValue(0, min, max);
    for (let slot = 0; slot < slotCount; slot += 1) {
      if (lut.view[slot] === CODE_NO_VALUE) lut.view[slot] = zero;
    }

    return {
      texture: valueLutTexture(lut.data, lut.width, lut.height),
      width: lut.width,
      height: lut.height,
      // `indptr[id]` IS the object-axis position, so the ids are the slots.
      idOffset: 0,
      skipped,
      valueMin: min,
      valueMax: max,
    };
  }

  const { colorValues, ruleValues, skipped } = await resolveColumnValues({
    colorBy,
    filterBys,
    plans,
    engine,
    want: { kind: "array", storeId },
    // Cached for the same reason as the mesh builder: knob nudges rebuild the
    // LUT, the column values change with none of them.
    readColumn: readColumnByObjectIdCached,
  });

  const present = idExtent(colorValues, ruleValues);
  if (!present) {
    // Nothing readable resolved. No texture rather than an all-identity one: the
    // caller switches the LUT off entirely, which is cheaper than binding a
    // texture that says "change nothing".
    return { texture: null, width: 0, height: 0, idOffset: 0, skipped, valueMin: 0, valueMax: 1 };
  }

  // `slot = id - idOffset`, so the offset is the smallest id present and the
  // lowest id always lands at slot 0. Clamped at 0 because a negative offset
  // would push slots PAST the allocation, and a negative id is not something a
  // segmentation produces anyway.
  const idOffset = Math.max(0, present.min);
  const slotCount = present.max - idOffset + 1;

  if (slotCount <= 0 || valueLutTexels(slotCount) > LABEL_LUT_MAX_TEXELS) {
    // Two different failures wore one message. "Too sparse to index directly" is
    // right for a handful of ids scattered over a huge range, and wrong for a
    // bin lattice, whose ids are contiguous and maximally dense — there the
    // table is simply bigger than the budget.
    const rows = colorValues ? colorValues.size : 0;
    const dense = rows > 0 && rows * 4 > slotCount;
    skipped.push(
      dense
        ? `ids run ${present.min}…${present.max}, so the lookup table is ${slotCount} slots (${Math.round((slotCount * VALUE_LUT_BYTES_PER_TEXEL) / 1e6)} MB) against a budget of ${Math.round(LABEL_LUT_MAX_BYTES / 1e6)} MB — no colouring or filter is applied`
        : `ids run ${present.min}…${present.max} but only ${rows} of them have a row, so indexing them directly would spend ${slotCount} slots on ${rows} values — too sparse to index this way, and no colouring or filter is applied`,
    );
    return { texture: null, width: 0, height: 0, idOffset: 0, skipped, valueMin: 0, valueMax: 1 };
  }

  const lut = allocateValueLut(slotCount);

  const { valueMin, valueMax } = paintValueLut({
    lut,
    // The label slot mapping — the whole difference from fabriks. A function
    // rather than a materialised array: at a bin lattice's scale that array was
    // one heap object per id, allocated only to express `id - idOffset`.
    slotOf: (objectId) => {
      const slot = objectId - idOffset;
      return slot >= 0 && slot < slotCount ? slot : -1;
    },
    colorBy,
    filterBys,
    colorValues,
    ruleValues,
  });

  return {
    texture: valueLutTexture(lut.data, lut.width, lut.height),
    width: lut.width,
    height: lut.height,
    idOffset,
    skipped,
    valueMin,
    valueMax,
  };
};
