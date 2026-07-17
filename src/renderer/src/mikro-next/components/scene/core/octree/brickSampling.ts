import type { Vec3 } from "./levelGeometry";
import type { ResolvedProbeStrategy } from "../probe/probeTypes";

/**
 * CPU raymarch over the resident brick set — the probe-side mirror of the
 * GPU raymarcher, in lockstep with its normalization (minValue/maxValue →
 * clim window → gamma; opacity 1). The sampler is injected so the math stays
 * pure and unit-testable (`BrickResidencyManager.sampleResident` in the app).
 */

export type ResidentSampler = (
  baseVoxel: Vec3,
  desiredLevel: number,
  channel: number,
) => number | null;

export type ProbeMarchStrategy = ResolvedProbeStrategy;

export type ProbeMarchHit = {
  /** Local unit-box hit position, clamped to [-0.5, 0.5]³. */
  position: Vec3;
  /** Ray parameter of the hit. */
  t: number;
  /** Raw sample value at the hit. */
  rawValue: number;
  /** Shader-lockstep normalized value at the hit. */
  normalized: number;
};

export type MarchResidentBricksInput = {
  /** Ray origin in local unit-box coords ([-0.5, 0.5]³, y up). */
  origin: Vec3;
  /** Normalized local ray direction. */
  direction: Vec3;
  /** Entry/exit distances from `intersectLocalVolumeBox`. */
  bounds: [number, number];
  baseShape: Vec3;
  desiredLevel: number;
  channel: number;
  minValue: number;
  maxValue: number;
  climMin: number;
  climMax: number;
  gamma?: number;
  /** Normalized-visibility threshold (used by the "first-hit" strategy). */
  threshold: number;
  sample: ResidentSampler;
  steps?: number;
  /** Hit-selection strategy along the ray; defaults to "first-hit". */
  strategy?: ProbeMarchStrategy;
};

/**
 * Scales normalized visibility into per-step opacity for the "volume-accum"
 * strategy. A documented visual approximation of the shader's
 * opacity-corrected front-to-back accumulation (colormap alpha is not
 * consulted — see core/opacityCorrection.ts for the real transfer math).
 */
export const VOLUME_ACCUM_GAIN = 4;

const toBaseVoxel = (p: Vec3, baseShape: Vec3): Vec3 => [
  (p[0] + 0.5) * baseShape[0],
  (0.5 - p[1]) * baseShape[1],
  (p[2] + 0.5) * baseShape[2],
];

const clampLocal = (p: Vec3): Vec3 => [
  Math.min(Math.max(p[0], -0.5), 0.5),
  Math.min(Math.max(p[1], -0.5), 0.5),
  Math.min(Math.max(p[2], -0.5), 0.5),
];

/**
 * March the ray and pick a hit according to `strategy`:
 * - "first-hit": first sample whose normalized visibility exceeds `threshold`
 *   (early-out — the AUTO_PROBE hot path).
 * - "max": argmax of normalized visibility over the full ray (matches what
 *   MIP projection shows; no threshold).
 * - "gradient": strongest |Δnormalized| between consecutive RESIDENT samples
 *   (a pair spanning an unresident gap is skipped — a residency edge is not
 *   a data edge); hit at the pair midpoint, value of the far sample.
 * - "volume-accum": front-to-back transmittance accumulation; hit where
 *   accumulated opacity crosses 0.5 (median opacity depth, early-out).
 */
export function marchResidentBricks({
  origin,
  direction,
  bounds,
  baseShape,
  desiredLevel,
  channel,
  minValue,
  maxValue,
  climMin,
  climMax,
  gamma = 1,
  threshold,
  sample,
  steps = 256,
  strategy = "first-hit",
}: MarchResidentBricksInput): ProbeMarchHit | null {
  const [tNear, tFar] = bounds;
  if (tFar <= tNear) return null;
  const delta = (tFar - tNear) / steps;

  // Accumulators for the non-early-out strategies.
  let best: ProbeMarchHit | null = null; // "max"
  let bestEdge = 0; // "gradient"
  let prev: { t: number; normalized: number } | null = null;
  let accumulated = 0; // "volume-accum"

  for (let i = 0; i < steps; i++) {
    const t = tNear + i * delta;
    const p: Vec3 = [
      origin[0] + direction[0] * t,
      origin[1] + direction[1] * t,
      origin[2] + direction[2] * t,
    ];

    const rawValue = sample(toBaseVoxel(p, baseShape), desiredLevel, channel);
    if (rawValue === null) {
      // Unresident: never a hit, and it breaks gradient pair continuity.
      prev = null;
      continue;
    }

    // Shader-lockstep normalization (see channelNormalize / computeNormalized).
    const baseNorm = Math.min(
      Math.max((rawValue - minValue) / Math.max(maxValue - minValue, 1e-5), 0),
      1,
    );
    const climRange = Math.max(climMax - climMin, 1e-5);
    let normalized = Math.min(Math.max((baseNorm - climMin) / climRange, 0), 0.999);
    normalized = Math.pow(normalized, Math.max(gamma, 1e-4));

    switch (strategy) {
      case "first-hit": {
        if (normalized > threshold) {
          return { position: clampLocal(p), t, rawValue, normalized };
        }
        break;
      }
      case "max": {
        if (best === null || normalized > best.normalized) {
          best = { position: clampLocal(p), t, rawValue, normalized };
        }
        break;
      }
      case "gradient": {
        if (prev !== null) {
          const edge = Math.abs(normalized - prev.normalized);
          if (edge > bestEdge) {
            bestEdge = edge;
            const tMid = (t + prev.t) / 2;
            best = {
              position: clampLocal([
                origin[0] + direction[0] * tMid,
                origin[1] + direction[1] * tMid,
                origin[2] + direction[2] * tMid,
              ]),
              t: tMid,
              rawValue,
              normalized,
            };
          }
        }
        prev = { t, normalized };
        break;
      }
      case "volume-accum": {
        const alpha = Math.min(normalized * delta * VOLUME_ACCUM_GAIN, 1);
        accumulated += (1 - accumulated) * alpha;
        if (accumulated >= 0.5) {
          return { position: clampLocal(p), t, rawValue, normalized };
        }
        break;
      }
    }
  }

  if (strategy === "max") {
    return best !== null && best.normalized > 0 ? best : null;
  }
  if (strategy === "gradient") {
    return bestEdge > 0 ? best : null;
  }
  return null;
}
