import { describe, expect, it } from "vitest";
import { marchResidentBricks } from "./brickSampling";
import type { Vec3 } from "./levelGeometry";

/**
 * 100³ base volume; a bright box occupies base voxels x ∈ [60, 100) — a ray
 * marching +x must report the first hit at local x ≈ 0.1 (60/100 - 0.5).
 */
const BASE: Vec3 = [100, 100, 100];
const sampler = (baseVoxel: Vec3) => (baseVoxel[0] >= 60 ? 200 : 0);

const march = (threshold: number, sample = sampler) =>
  marchResidentBricks({
    origin: [-0.5, 0, 0],
    direction: [1, 0, 0],
    bounds: [0, 1],
    baseShape: BASE,
    desiredLevel: 0,
    channel: 0,
    minValue: 0,
    maxValue: 255,
    climMin: 0,
    climMax: 1,
    threshold,
    sample,
    steps: 1000,
  });

describe("marchResidentBricks", () => {
  it("reports the first sample crossing the threshold", () => {
    const hit = march(0.5);
    expect(hit).not.toBeNull();
    expect(hit![0]).toBeGreaterThan(0.09);
    expect(hit![0]).toBeLessThan(0.12);
    expect(hit![1]).toBeCloseTo(0, 5);
  });

  it("misses when the threshold exceeds the normalized value", () => {
    // 200/255 ≈ 0.784 normalized.
    expect(march(0.9)).toBeNull();
  });

  it("skips unresident samples instead of treating them as hits", () => {
    const gappy = (baseVoxel: Vec3) => (baseVoxel[0] < 80 ? null : 255);
    const hit = march(0.5, gappy);
    expect(hit).not.toBeNull();
    expect(hit![0]).toBeGreaterThan(0.29);
  });

  it("applies the clim window in shader lockstep", () => {
    // climMin 0.9 pushes 200/255 below any positive threshold.
    const hit = marchResidentBricks({
      origin: [-0.5, 0, 0],
      direction: [1, 0, 0],
      bounds: [0, 1],
      baseShape: BASE,
      desiredLevel: 0,
      channel: 0,
      minValue: 0,
      maxValue: 255,
      climMin: 0.9,
      climMax: 1,
      threshold: 0.01,
      sample: sampler,
    });
    expect(hit).toBeNull();
  });
});
