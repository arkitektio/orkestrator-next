import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { computeSceneVisibility, sameViewRanges, sameVisibleIds } from "./visibility";
import type { LayerState } from "./layerModel";

/**
 * Scene under test: a 100x50 voxel 2D image layer with identity affine. Per
 * the renderer's layout convention the layer occupies world
 * x ∈ [-50, 50], y ∈ [-25, 25], centered at the origin with +y up, while
 * voxel indices run x ∈ [0, 100] left→right and y ∈ [0, 50] top→bottom.
 */
const LAYER_ID = "layer-1";

const makeLayer = (): LayerState =>
  ({
    id: LAYER_ID,
    affineMatrix: null,
    xAxis: "x",
    yAxis: "y",
    zAxis: null,
    intensityAxis: null,
    lens: { axisNames: ["y", "x"], shape: [50, 100] },
  }) as unknown as LayerState;

const makeTrackable = () => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 50, 1));
  return { kind: "layer", id: LAYER_ID, ref: { current: mesh } };
};

/** Orthographic camera showing world x ∈ cx±halfW, y ∈ cy±halfH. */
const makeProjScreenMatrix = (cx: number, cy: number, halfW: number, halfH: number) => {
  const camera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 1000);
  camera.position.set(cx, cy, 10);
  camera.lookAt(cx, cy, 0);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  return new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
};

describe("computeSceneVisibility", () => {
  it("reports the full voxel extent when the whole layer is in view", () => {
    const { visibleIds, ranges } = computeSceneVisibility({
      projScreenMatrix: makeProjScreenMatrix(0, 0, 100, 50),
      viewportSize: { width: 200, height: 100 }, // 1 px per world unit
      trackables: [makeTrackable()],
      layers: [makeLayer()],
    });

    expect(visibleIds.has(LAYER_ID)).toBe(true);
    const range = ranges[LAYER_ID];
    expect(range.xRange).toEqual([0, 100]);
    expect(range.yRange).toEqual([0, 50]);
    expect(range.zRange).toBeNull();
    expect(range.scale).toBeCloseTo(1, 5);
  });

  it("maps a right-half view to the upper voxel x range", () => {
    // Camera over world x ∈ [25, 125]; layer ends at world x = 50.
    const { ranges } = computeSceneVisibility({
      projScreenMatrix: makeProjScreenMatrix(75, 0, 50, 50),
      viewportSize: { width: 100, height: 100 },
      trackables: [makeTrackable()],
      layers: [makeLayer()],
    });

    expect(ranges[LAYER_ID].xRange).toEqual([75, 100]);
  });

  it("maps the world TOP half to LOW voxel y indices (y flip)", () => {
    // Camera over world y ∈ [0, 50]; layer's top edge is world y = 25.
    const { ranges } = computeSceneVisibility({
      projScreenMatrix: makeProjScreenMatrix(0, 25, 100, 25),
      viewportSize: { width: 200, height: 50 },
      trackables: [makeTrackable()],
      layers: [makeLayer()],
    });

    expect(ranges[LAYER_ID].yRange).toEqual([0, 25]);
  });

  it("reports screen pixels per voxel via the viewport size", () => {
    // Same world window rendered into a double-size viewport -> 2 px/voxel.
    const { ranges } = computeSceneVisibility({
      projScreenMatrix: makeProjScreenMatrix(0, 0, 100, 50),
      viewportSize: { width: 400, height: 200 },
      trackables: [makeTrackable()],
      layers: [makeLayer()],
    });

    expect(ranges[LAYER_ID].scale).toBeCloseTo(2, 5);
  });

  it("excludes off-screen trackables entirely", () => {
    const { visibleIds, ranges } = computeSceneVisibility({
      projScreenMatrix: makeProjScreenMatrix(1000, 0, 50, 50),
      viewportSize: { width: 100, height: 100 },
      trackables: [makeTrackable()],
      layers: [makeLayer()],
    });

    expect(visibleIds.size).toBe(0);
    expect(ranges).toEqual({});
  });
});

describe("equality helpers", () => {
  it("sameVisibleIds compares by value", () => {
    expect(sameVisibleIds(["a", "b"], new Set(["b", "a"]))).toBe(true);
    expect(sameVisibleIds(["a"], new Set(["a", "b"]))).toBe(false);
  });

  it("sameViewRanges compares ranges by value", () => {
    const range = {
      xRange: [0, 10] as [number, number],
      yRange: [0, 5] as [number, number],
      zRange: null,
      scale: 1,
      viewportFraction: 0.5,
    };
    expect(sameViewRanges({ a: range }, { a: { ...range, xRange: [0, 10] } })).toBe(true);
    expect(sameViewRanges({ a: range }, { a: { ...range, scale: 2 } })).toBe(false);
    expect(sameViewRanges({ a: range }, {})).toBe(false);
  });

  it("sameViewRanges ignores viewportFraction (cosmetic, not a planning input)", () => {
    // viewportFraction jitters continuously during an orbit; it must NOT gate the
    // hot store write or the whole LayerControlPanel subtree re-renders per tick.
    const range = {
      xRange: [0, 10] as [number, number],
      yRange: [0, 5] as [number, number],
      zRange: null,
      scale: 1,
      viewportFraction: 0.1,
    };
    expect(sameViewRanges({ a: range }, { a: { ...range, viewportFraction: 0.9 } })).toBe(true);
  });

  it("sameViewRanges treats sub-1% scale jitter as equal (orbit foreshortening)", () => {
    const range = {
      xRange: [0, 10] as [number, number],
      yRange: [0, 5] as [number, number],
      zRange: null,
      scale: 2,
      viewportFraction: 0.5,
    };
    // 0.5% change -> ignored; 2% change -> a real LOD-relevant change.
    expect(sameViewRanges({ a: range }, { a: { ...range, scale: 2.01 } })).toBe(true);
    expect(sameViewRanges({ a: range }, { a: { ...range, scale: 2.04 } })).toBe(false);
  });
});
