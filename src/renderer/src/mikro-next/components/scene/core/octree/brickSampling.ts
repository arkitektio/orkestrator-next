import type { Vec3 } from "./levelGeometry";

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
  /** Normalized-visibility threshold above which the march reports a hit. */
  threshold: number;
  sample: ResidentSampler;
  steps?: number;
};

const toBaseVoxel = (p: Vec3, baseShape: Vec3): Vec3 => [
  (p[0] + 0.5) * baseShape[0],
  (0.5 - p[1]) * baseShape[1],
  (p[2] + 0.5) * baseShape[2],
];

/** Local-space hit position, or null when no sample crosses the threshold. */
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
}: MarchResidentBricksInput): Vec3 | null {
  const [tNear, tFar] = bounds;
  if (tFar <= tNear) return null;
  const delta = (tFar - tNear) / steps;

  for (let i = 0; i < steps; i++) {
    const t = tNear + i * delta;
    const p: Vec3 = [
      origin[0] + direction[0] * t,
      origin[1] + direction[1] * t,
      origin[2] + direction[2] * t,
    ];

    const rawValue = sample(toBaseVoxel(p, baseShape), desiredLevel, channel);
    if (rawValue === null) continue;

    // Shader-lockstep normalization (see channelNormalize / computeNormalized).
    const baseNorm = Math.min(
      Math.max((rawValue - minValue) / Math.max(maxValue - minValue, 1e-5), 0),
      1,
    );
    const climRange = Math.max(climMax - climMin, 1e-5);
    let normalized = Math.min(Math.max((baseNorm - climMin) / climRange, 0), 0.999);
    normalized = Math.pow(normalized, Math.max(gamma, 1e-4));

    if (normalized > threshold) {
      return [
        Math.min(Math.max(p[0], -0.5), 0.5),
        Math.min(Math.max(p[1], -0.5), 0.5),
        Math.min(Math.max(p[2], -0.5), 0.5),
      ];
    }
  }
  return null;
}
