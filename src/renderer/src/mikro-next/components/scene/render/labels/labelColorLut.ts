import type * as THREE from "three";
import type { AttributePlanLike } from "@/mikro-next/lib/attributes/attributeTypes";
import type { AttributeLookupEngine } from "@/mikro-next/lib/attributes/lookupEngine";
import {
  allocateColumnLut,
  columnLutTexels,
  columnLutTexture,
  paintColumnLut,
  resolveColumnValues,
  type ColumnLutEntryColorBy,
  type ColumnLutEntryFilterBy,
} from "../attributes/columnLut";
import { readColumnByObjectIdCached } from "../attributes/columnValueCache";

export { LUT_WIDTH } from "../attributes/columnLut";

/**
 * The id → RGBA lookup a LABEL layer's stored `colorBys` / `filterBys` resolve
 * to — the mesh feature's twin, over the same relation and with the same
 * semantics (they live in `render/attributes/columnLut.ts`, shared).
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
 * The largest LUT this will build: 4.2M texels ≈ 16 MB at RGBA8.
 *
 * A cap rather than a fallback, and a LOUD one: over it nothing is built and the
 * reason lands on `skipped`, which the layer surfaces. Silently building a
 * 500 MB texture, or silently painting nothing, are both worse than saying the
 * ids are too sparse to index this way.
 */
export const LABEL_LUT_MAX_TEXELS = 4_194_304;

export type LabelColorLutRequest = {
  colorBy: ColumnLutEntryColorBy | null;
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
};

/** Every id that has a row in any of the entries we managed to read. */
const idsPresent = (
  colorValues: Map<number, unknown> | null,
  ruleValues: readonly (Map<number, unknown> | null)[],
): { min: number; max: number; ids: number[] } | null => {
  const ids = new Set<number>();
  if (colorValues) for (const id of colorValues.keys()) ids.add(id);
  for (const values of ruleValues) {
    if (!values) continue;
    for (const id of values.keys()) ids.add(id);
  }
  if (ids.size === 0) return null;
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const id of ids) {
    if (id < min) min = id;
    if (id > max) max = id;
  }
  return { min, max, ids: [...ids] };
};

export const buildLabelColorLut = async (
  request: LabelColorLutRequest,
): Promise<LabelColorLutResult> => {
  const { colorBy, filterBys, plans, storeId, engine } = request;

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

  const present = idsPresent(colorValues, ruleValues);
  if (!present) {
    // Nothing readable resolved. No texture rather than an all-identity one: the
    // caller switches the LUT off entirely, which is cheaper than binding a
    // texture that says "change nothing".
    return { texture: null, width: 0, height: 0, idOffset: 0, skipped };
  }

  // `slot = id - idOffset`, so the offset is the smallest id present and the
  // lowest id always lands at slot 0. Clamped at 0 because a negative offset
  // would push slots PAST the allocation, and a negative id is not something a
  // segmentation produces anyway.
  const idOffset = Math.max(0, present.min);
  const slotCount = present.max - idOffset + 1;

  if (slotCount <= 0 || columnLutTexels(slotCount) > LABEL_LUT_MAX_TEXELS) {
    skipped.push(
      `ids run ${present.min}…${present.max}, which needs more than ${LABEL_LUT_MAX_TEXELS} lookup texels — too sparse to index directly, so no colouring or filter is applied`,
    );
    return { texture: null, width: 0, height: 0, idOffset: 0, skipped };
  }

  const { data, width, height } = allocateColumnLut(slotCount);

  paintColumnLut({
    data,
    // The label slot mapping — the whole difference from fabriks.
    targets: present.ids.map((id) => ({ objectId: id, slot: id - idOffset })),
    colorBy,
    filterBys,
    colorValues,
    ruleValues,
  });

  return { texture: columnLutTexture(data, width, height), width, height, idOffset, skipped };
};
