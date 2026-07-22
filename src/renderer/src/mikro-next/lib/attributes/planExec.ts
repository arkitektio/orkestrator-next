import type { AxisCoords } from "../coords/axisPath";
import type { AttributePlanLike } from "./attributeTypes";

/**
 * Pure plan-execution arithmetic: turning a path-mapped point plus a sampled
 * value into the held-value map and the DuckDB bind list. Every rule here is
 * a contract from the attribute-plans API:
 *
 *  - zip the sampled value against THIS plan's `produces`, never a shared key
 *    set (sibling edges may name their produced axis differently);
 *  - passthrough axes join the key by name, stated in the PLAN's own space;
 *  - bind order is the parquet path first (the `read_parquet(?)` argument),
 *    then the key values in `keyColumns` order;
 *  - a missing axis is a hard null — a key is never borrowed or guessed.
 */

export type HeldValue = number | bigint;
export type BindParam = string | number | bigint;

/** Background pixels (value 0) have no object — nothing to look up. */
export const isBackground = (value: HeldValue): boolean =>
  typeof value === "bigint" ? value === 0n : value === 0;

/** Narrow a sampled bigint to number when it is safely representable. */
export const narrowHeld = (value: HeldValue): HeldValue =>
  typeof value === "bigint" && Number.isSafeInteger(Number(value))
    ? Number(value)
    : value;

const asIntegerCoordinate = (value: number | undefined): number | null => {
  if (value === undefined || !Number.isFinite(value)) return null;
  return Math.round(value);
};

/**
 * The values the worker holds after sampling: the plan's passthrough axes
 * (integer coordinates in the plan's space) plus the sampled value under the
 * plan's own produced name. Null when the point does not carry a passthrough
 * axis or the plan produces anything but a single scalar axis (a
 * coordinate-valued field is not a lookup key).
 */
export function buildHeld(
  plan: AttributePlanLike,
  coords: AxisCoords,
  sampledValue: HeldValue,
): Record<string, HeldValue> | null {
  if (plan.sample.produces.length !== 1) return null;
  const held: Record<string, HeldValue> = {};
  for (const axis of plan.sample.passthrough) {
    const value = asIntegerCoordinate(coords[axis]);
    if (value === null) return null;
    held[axis] = value;
  }
  held[plan.sample.produces[0]] = narrowHeld(sampledValue);
  return held;
}

/**
 * The key values for `plan.lookup.sql` in `keyColumns` order, each read from
 * `held` by the plan's own axis name. Null when a key axis is missing. The
 * parquet URL is prepended separately (`buildParams`) because it comes from
 * the store's ACCESS GRANT at query time, not from the plan.
 */
export function buildKeyValues(
  plan: AttributePlanLike,
  held: Record<string, HeldValue>,
): BindParam[] | null {
  const values: BindParam[] = [];
  for (const keyColumn of plan.lookup.keyColumns) {
    const value = held[keyColumn.axis];
    if (value === undefined) return null;
    values.push(value);
  }
  return values;
}

/**
 * The full positional bind list: parquet URL first (the `read_parquet(?)`
 * argument), then the key values in `keyColumns` order.
 */
export function buildParams(
  plan: AttributePlanLike,
  parquetUrl: string,
  held: Record<string, HeldValue>,
): BindParam[] | null {
  const keyValues = buildKeyValues(plan, held);
  return keyValues === null ? null : [parquetUrl, ...keyValues];
}

/**
 * Index into the sampled zarr array: one integer per axis of the sample
 * system, in axis order. `consumes` + `passthrough` must cover every array
 * axis (the produced axis is the VALUE of a scalar field, not a dimension).
 * Bounds-checked against `shape` when the store declares one; out of bounds
 * means the point falls outside the field — null, not a clamp.
 */
export function resolveSampleIndex(
  plan: AttributePlanLike,
  coords: AxisCoords,
): number[] | null {
  const axes = [...plan.sample.system.axes].sort((a, b) => a.order - b.order);
  if (axes.length === 0) return null;
  const shape = plan.sample.store.shape ?? null;
  const index: number[] = [];
  for (let i = 0; i < axes.length; i++) {
    const value = asIntegerCoordinate(coords[axes[i].name]);
    if (value === null || value < 0) return null;
    if (shape && shape[i] !== undefined && value >= shape[i]) return null;
    index.push(value);
  }
  return index;
}

/**
 * The probed point as named coordinates in the PROBED layer's level-0 frame:
 * spatial axes from the probe's voxel index (via the lens' render-axis
 * naming), every other axis from the viewer's dim selections (0 when never
 * touched — the slider default).
 */
export function probeCoordsFor(args: {
  axisNames: readonly string[];
  renderAxes: { x: string; y: string; z?: string | null };
  voxelIndex: readonly [number, number, number];
  dimSelections: Record<string, number>;
}): AxisCoords {
  const coords: AxisCoords = {};
  for (const axis of args.axisNames) {
    coords[axis] = args.dimSelections[axis] ?? 0;
  }
  coords[args.renderAxes.x] = args.voxelIndex[0];
  coords[args.renderAxes.y] = args.voxelIndex[1];
  if (args.renderAxes.z) coords[args.renderAxes.z] = args.voxelIndex[2];
  return coords;
}
