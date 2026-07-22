import { applyPathToCoords, type AxisCoords } from "../coords/axisPath";
import {
  planIdentity,
  type AttributePlanLike,
  type PlanRowsState,
} from "./attributeTypes";
import type { AttributeLookupEngine } from "./lookupEngine";
import {
  buildHeld,
  isBackground,
  resolveSampleIndex,
  type HeldValue,
} from "./planExec";

/**
 * One plan, one point: map the coordinates along the plan's path, sample the
 * field array, look the value up with DuckDB. The single execution pipeline
 * shared by the scene's probe tracker and the standalone attribute service —
 * the ONLY thing a host adds is where `startCoords` came from (the scene
 * assembles them from probe + dim selections; a standalone caller just says
 * them) and, optionally, a resident synchronous sampler as a fast path.
 */

export type ExecutePlanOptions = {
  /** Flip to true when a newer request supersedes this one — checked before
   * expensive work; a stale execution resolves null (deliver nothing). */
  isStale?: () => boolean;
  /**
   * Scene fast path: synchronous resident read for this plan's array (atlas
   * CPU mirror). Null result falls through to the exact chunk read. Omit for
   * the standalone exact-only path.
   */
  sampleSync?: ((index: readonly number[]) => HeldValue | null) | null;
  /** Diagnostics hook for unreachable outcomes (the tracker warn-onces). */
  onUnreachable?: (planKey: string, reason: string, detail?: unknown) => void;
};

export type ExecutePlanDeps = {
  engine: AttributeLookupEngine;
  sampleExact: (
    plan: AttributePlanLike,
    index: readonly number[],
  ) => Promise<HeldValue | null>;
};

export async function executePlanAt(
  deps: ExecutePlanDeps,
  plan: AttributePlanLike,
  startCoords: AxisCoords,
  opts: ExecutePlanOptions = {},
): Promise<PlanRowsState | null> {
  const planKey = planIdentity(plan);
  const isStale = opts.isStale ?? (() => false);
  const unreachable = (reason: string, detail?: unknown): PlanRowsState => {
    opts.onUnreachable?.(planKey, reason, detail);
    return { status: "unreachable", rows: [] };
  };

  const mapped = plan.path.length
    ? applyPathToCoords(plan.path, startCoords)
    : startCoords;
  if (mapped === null) {
    return unreachable("cannot map the probed point along the plan's path", {
      table: plan.table.name,
      startCoords,
      path: plan.path.map(
        (step) => `${step.inverted ? "~" : ""}${step.transformation?.__typename}`,
      ),
    });
  }
  const index = resolveSampleIndex(plan, mapped);
  if (index === null) {
    return unreachable("mapped point does not index the field array", {
      table: plan.table.name,
      mapped,
      axes: [...plan.sample.system.axes]
        .sort((a, b) => a.order - b.order)
        .map((a) => a.name),
      shape: plan.sample.store.shape,
    });
  }

  // Resident-first sampling when the host provides it: the atlas CPU mirror
  // is free and already on screen. The chunk read is the FALLBACK (mask not
  // rendered, mirror stale) — and the only path when no scene is mounted.
  let value = opts.sampleSync?.(index) ?? null;
  let sampleSource: "resident" | "exact" = "resident";
  if (value === null) {
    value = await deps.sampleExact(plan, index);
    sampleSource = "exact";
    if (isStale()) return null;
  }
  if (value === null) {
    return { status: "error", rows: [], error: "could not sample the field array" };
  }
  if (isBackground(value)) {
    return { status: "background", rows: [], sampledValue: value, sampleSource };
  }
  const held = buildHeld(plan, mapped, value);
  if (held === null) {
    return unreachable("held values do not cover the plan's key axes", {
      table: plan.table.name,
      passthrough: plan.sample.passthrough,
      produces: plan.sample.produces,
      mapped,
    });
  }
  const rows = await deps.engine.lookup(plan, held, isStale);
  if (rows === null) return null;
  return { status: "rows", rows, sampledValue: value, sampleSource };
}
