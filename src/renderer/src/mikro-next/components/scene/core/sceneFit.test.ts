import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { computeFitPose, computeSceneWorldBox } from "./sceneFit";
import type { LayerState } from "./layerModel";

/** Minimal layer for the metadata box math (same casting style as visibility.test.ts). */
const makeLayer = (opts: {
  shape: number[]; // [z, y, x] under DIMS below (or use axisNames override)
  axisNames?: string[];
  affineMatrix?: number[][] | null;
  xAxis?: string | null;
}): LayerState =>
  ({
    id: "layer",
    affineMatrix: opts.affineMatrix ?? null,
    xAxis: opts.xAxis === undefined ? "x" : opts.xAxis,
    yAxis: "y",
    zAxis: "z",
    intensityAxis: null,
    lens: { axisNames: opts.axisNames ?? ["z", "y", "x"], shape: opts.shape },
  }) as unknown as LayerState;

describe("computeSceneWorldBox", () => {
  it("centers a single identity-affine layer around the origin", () => {
    // shape [z, y, x] = [20, 50, 100] → world box ±[50, 25, 10] (y-flip is
    // symmetric around 0, so it does not change the extent).
    const box = computeSceneWorldBox([makeLayer({ shape: [20, 50, 100] })])!;
    expect(box.min.toArray()).toEqual([-50, -25, -10]);
    expect(box.max.toArray()).toEqual([50, 25, 10]);
  });

  it("applies affine translation", () => {
    const affine = [
      [1, 0, 0, 100],
      [0, 1, 0, 0],
      [0, 0, 1, -5],
      [0, 0, 0, 1],
    ];
    const box = computeSceneWorldBox([makeLayer({ shape: [20, 50, 100], affineMatrix: affine })])!;
    // centered z ∈ [-10, 10] then tz = -5 → [-15, 5]
    expect(box.min.toArray()).toEqual([50, -25, -15]);
    expect(box.max.toArray()).toEqual([150, 25, 5]);
  });

  it("applies anisotropic affine scale", () => {
    const affine = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 5, 0], // z scaled ×5
      [0, 0, 0, 1],
    ];
    const box = computeSceneWorldBox([makeLayer({ shape: [20, 50, 100], affineMatrix: affine })])!;
    expect(box.min.z).toBe(-50);
    expect(box.max.z).toBe(50);
  });

  it("transforms corners individually under rotation (box ≠ naive min/max)", () => {
    // 90° rotation about z: x' = -y, y' = x → world extents swap.
    const affine = [
      [0, -1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
    const box = computeSceneWorldBox([makeLayer({ shape: [20, 50, 100], affineMatrix: affine })])!;
    expect(box.min.x).toBeCloseTo(-25, 6);
    expect(box.max.x).toBeCloseTo(25, 6);
    expect(box.min.y).toBeCloseTo(-50, 6);
    expect(box.max.y).toBeCloseTo(50, 6);
  });

  it("unions multiple layers", () => {
    const shifted = [
      [1, 0, 0, 200],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
    const box = computeSceneWorldBox([
      makeLayer({ shape: [20, 50, 100] }),
      makeLayer({ shape: [20, 50, 100], affineMatrix: shifted }),
    ])!;
    expect(box.min.x).toBe(-50);
    expect(box.max.x).toBe(250);
  });

  it("returns null for no layers or layers without valid spatial axes", () => {
    expect(computeSceneWorldBox([])).toBeNull();
    expect(computeSceneWorldBox([makeLayer({ shape: [20, 50, 100], xAxis: null })])).toBeNull();
  });

  it("fits a z-less (2D) layer as a flat box", () => {
    const layer = makeLayer({ shape: [50, 100], axisNames: ["y", "x"] });
    (layer as { zAxis: string | null }).zAxis = null;
    const box = computeSceneWorldBox([layer])!;
    expect(box.min.toArray()).toEqual([-50, -25, 0]);
    expect(box.max.toArray()).toEqual([50, 25, 0]);
  });
});

describe("computeFitPose", () => {
  const box = new THREE.Box3(new THREE.Vector3(-50, -25, -10), new THREE.Vector3(50, 25, 10));

  it("orthographic: limiting-axis zoom with 1.1 padding, centered, target z=0", () => {
    const pose = computeFitPose(box, {
      kind: "orthographic",
      viewport: { width: 200, height: 100 },
      cameraZ: 50000,
    });
    // zoomX = 200/(100·1.1) == zoomY = 100/(50·1.1)
    expect(pose.zoom).toBeCloseTo(200 / 110, 6);
    expect(pose.position.toArray()).toEqual([0, 0, 50000]);
    expect(pose.target.toArray()).toEqual([0, 0, 0]);
  });

  it("orthographic: an off-center box centers x/y", () => {
    const shifted = box.clone().translate(new THREE.Vector3(100, -30, 0));
    const pose = computeFitPose(shifted, {
      kind: "orthographic",
      viewport: { width: 200, height: 100 },
      cameraZ: 1,
    });
    expect(pose.position.x).toBe(100);
    expect(pose.position.y).toBe(-30);
    expect(pose.target.toArray()).toEqual([100, -30, 0]);
  });

  it("perspective: distance = sphereRadius/sin(fov/2) · 1.3 along the view direction", () => {
    const radius = Math.sqrt(50 * 50 + 25 * 25 + 10 * 10);
    const pose = computeFitPose(box, {
      kind: "perspective",
      fov: 90,
      viewDirection: new THREE.Vector3(0, 0, 1),
    });
    const expected = (radius / Math.sin(THREE.MathUtils.degToRad(45))) * 1.3;
    expect(pose.position.z).toBeCloseTo(expected, 6);
    expect(pose.position.x).toBeCloseTo(0, 6);
    expect(pose.target.toArray()).toEqual([0, 0, 0]);
  });

  it("perspective: normalizes the view direction", () => {
    const a = computeFitPose(box, {
      kind: "perspective",
      fov: 45,
      viewDirection: new THREE.Vector3(0, -2, 2),
    });
    const b = computeFitPose(box, {
      kind: "perspective",
      fov: 45,
      viewDirection: new THREE.Vector3(0, -200, 200),
    });
    expect(a.position.distanceTo(b.position)).toBeCloseTo(0, 6);
  });
});
