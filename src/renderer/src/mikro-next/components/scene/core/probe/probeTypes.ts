/**
 * Probe data model — the result of probing a layer carries the coordinate
 * (base level-0 voxels, both 2D and 3D), the world hit, and the raw values
 * for every channel slab, tagged with provenance so the UI can distinguish
 * an approximate LOD read from an exact level-0 read.
 */

/** User-selectable probe mode; "auto" dispatches on the layer's projection. */
export type ProbeMode = "auto" | "first-hit" | "max" | "gradient";

/** The march strategy actually executed after auto-dispatch. */
export type ResolvedProbeStrategy =
  | "first-hit"
  | "max"
  | "gradient"
  | "volume-accum";

export interface ProbeChannelValue {
  /** Channel slab index (0..channelSlabCount-1). */
  channel: number;
  /** Raw dtype value; null while unresolvable (pending exact fetch). */
  value: number | null;
}

export interface ProbeProvenance {
  /**
   * "resident" = read from the atlas CPU mirror at `level`;
   * "exact" = level-0 decoded-chunk read;
   * "pending" = nothing readable yet (atlas mirror stale).
   */
  source: "resident" | "exact" | "pending";
  /** LOD level the resident read came from (0 = finest). 0 for exact. */
  level: number;
}

export interface ProbeResult {
  layerId: string;
  /** Normalized local offset the markers / probe-orbit consume. */
  localPos: [number, number, number];
  /** ALWAYS base (level-0) voxels — both 2D and 3D probes. */
  voxelIndex: [number, number, number];
  /** World-space hit position (null when unavailable). */
  worldPos: [number, number, number] | null;
  /** Strategy that produced the hit (after auto dispatch); "plane" for 2D. */
  strategy: ResolvedProbeStrategy | "plane";
  /** One entry per channel slab of the layer. */
  values: ProbeChannelValue[];
  provenance: ProbeProvenance;
  /** Base-level dtype (e.g. "uint16"), for display formatting. */
  dtype: string;
  /** Pool slice signature at probe time — staleness guard for async merges. */
  sliceSignature: string;
}

/** Identity key for async exact-value resolution. */
export interface ProbeFetchKey {
  layerId: string;
  voxelIndex: [number, number, number];
  sliceSignature: string;
}

export const isSameProbeKey = (
  probe: Pick<ProbeResult, "layerId" | "voxelIndex" | "sliceSignature">,
  key: ProbeFetchKey,
): boolean =>
  probe.layerId === key.layerId &&
  probe.sliceSignature === key.sliceSignature &&
  probe.voxelIndex.every((v, i) => v === key.voxelIndex[i]);

const upgradeToExact = (probe: ProbeResult, values: number[]): ProbeResult => ({
  ...probe,
  values: probe.values.map((entry, i) => ({
    channel: entry.channel,
    value: values[i] ?? entry.value,
  })),
  provenance: { source: "exact", level: 0 },
});

/**
 * Patch the active probe and any matching saved probes with exact values.
 * Returns null when nothing matched — callers must treat that as a no-op set
 * (return the same state object) so late async arrivals never cause renders.
 */
export function applyExactValues(
  state: { probedCoordinate: ProbeResult | null; savedProbes: ProbeResult[] },
  key: ProbeFetchKey,
  values: number[],
): {
  probedCoordinate: ProbeResult | null;
  savedProbes: ProbeResult[];
} | null {
  const activeMatches =
    state.probedCoordinate !== null &&
    state.probedCoordinate.provenance.source !== "exact" &&
    isSameProbeKey(state.probedCoordinate, key);

  let savedChanged = false;
  const savedProbes = state.savedProbes.map((probe) => {
    if (probe.provenance.source === "exact" || !isSameProbeKey(probe, key)) {
      return probe;
    }
    savedChanged = true;
    return upgradeToExact(probe, values);
  });

  if (!activeMatches && !savedChanged) return null;
  return {
    probedCoordinate: activeMatches
      ? upgradeToExact(state.probedCoordinate!, values)
      : state.probedCoordinate,
    savedProbes: savedChanged ? savedProbes : state.savedProbes,
  };
}
