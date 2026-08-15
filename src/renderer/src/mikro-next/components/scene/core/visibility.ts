import * as THREE from "three";
import { resolveAxisIndices } from "./dims";
import { affineToMatrix4 } from "./worldTransform";
import type { LayerState } from "./layerModel";

/**
 * Pure per-layer visibility computation: frustum-test every trackable and,
 * for image layers, derive the visible voxel ranges + screen-pixels-per-voxel
 * scale. Extracted from the old `VisibilityManager` component so the math is
 * unit-testable and the driver (`managers/visibilityTracker.ts`) is a plain
 * store subscription instead of a React effect.
 */

export interface LayerViewRange {
  xRange: [number, number];
  yRange: [number, number];
  zRange: [number, number] | null;
  /** Screen pixels per image pixel (how many viewer pixels one voxel occupies) */
  scale: number;
}

/** Structural subset of viewerStore's TrackableObject. */
export type VisibilityTrackable = {
  kind: string;
  id: string;
  ref: { current?: THREE.Object3D | null };
};

export type SceneVisibilityInput = {
  projScreenMatrix: THREE.Matrix4;
  viewportSize: { width: number; height: number };
  trackables: Iterable<VisibilityTrackable>;
  layers: readonly LayerState[];
};

export type SceneVisibilityResult = {
  visibleIds: Set<string>;
  ranges: Record<string, LayerViewRange>;
};

// Preallocated scratch objects (single-threaded, one computation at a time).
// This runs once per camera write (~16/s during a zoom, where the 1% scale
// dead-band never saves the recompute), so it must not allocate per call.
const frustum = new THREE.Frustum();
const box = new THREE.Box3();
const corner = new THREE.Vector3();
const invPV = new THREE.Matrix4();
const frustumBox = new THREE.Box3();
const visibleBox = new THREE.Box3();
const invAffine = new THREE.Matrix4();
const localBox = new THREE.Box3();
const localCorner = new THREE.Vector3();
const scaleP0 = new THREE.Vector3();
const scaleP1 = new THREE.Vector3();

export function computeSceneVisibility({
  projScreenMatrix,
  viewportSize,
  trackables,
  layers,
}: SceneVisibilityInput): SceneVisibilityResult {
  frustum.setFromProjectionMatrix(projScreenMatrix);

  // Frustum AABB in world space (for intersecting layer boxes).
  invPV.copy(projScreenMatrix).invert();
  frustumBox.makeEmpty();
  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      for (let z = -1; z <= 1; z += 2) {
        corner.set(x, y, z).applyMatrix4(invPV);
        frustumBox.expandByPoint(corner);
      }
    }
  }

  // O(1) layer lookup — `layers.find` inside the trackable loop was
  // O(trackables × layers) per camera tick.
  const layerById = new Map<string, LayerState>();
  for (const layer of layers) layerById.set(layer.id, layer);

  const visibleIds = new Set<string>();
  const ranges: Record<string, LayerViewRange> = {};

  for (const trackable of trackables) {
    const object = trackable.ref.current;
    if (!object) continue;

    box.setFromObject(object);
    if (!frustum.intersectsBox(box)) continue;

    visibleIds.add(trackable.id);
    if (trackable.kind !== "layer") continue;

    const layer = layerById.get(trackable.id);
    if (!layer) continue;

    visibleBox.copy(box).intersect(frustumBox);
    if (visibleBox.isEmpty()) continue;

    const range = computeLayerViewRange(layer, visibleBox, projScreenMatrix, viewportSize);
    if (range) ranges[trackable.id] = range;
  }

  return { visibleIds, ranges };
}

/** `affineToMatrix4` allocates a Matrix4 per call; the raw affine array's
 * identity is stable across camera ticks (layers are replaced immutably on
 * edit), so cache per identity — this ran per layer per visibility recompute
 * (~17 Hz during a gesture). Null (identity affine) shares one constant. */
const affineMatrixCache = new WeakMap<number[][], THREE.Matrix4>();
const IDENTITY_AFFINE = new THREE.Matrix4();
const cachedAffineMatrix = (raw: number[][] | null | undefined): THREE.Matrix4 => {
  if (!raw) return IDENTITY_AFFINE;
  let matrix = affineMatrixCache.get(raw);
  if (!matrix) {
    matrix = affineToMatrix4(raw);
    affineMatrixCache.set(raw, matrix);
  }
  return matrix;
};

function computeLayerViewRange(
  layer: LayerState,
  visibleWorldBox: THREE.Box3,
  projScreenMatrix: THREE.Matrix4,
  viewportSize: { width: number; height: number },
): LayerViewRange | null {
  const affine = cachedAffineMatrix(layer.affineMatrix);
  invAffine.copy(affine).invert();

  // Visible box corners into layer-local space.
  localBox.makeEmpty();
  const c = localCorner;
  for (let ix = 0; ix <= 1; ix++) {
    for (let iy = 0; iy <= 1; iy++) {
      for (let iz = 0; iz <= 1; iz++) {
        c.set(
          ix === 0 ? visibleWorldBox.min.x : visibleWorldBox.max.x,
          iy === 0 ? visibleWorldBox.min.y : visibleWorldBox.max.y,
          iz === 0 ? visibleWorldBox.min.z : visibleWorldBox.max.z,
        );
        c.applyMatrix4(invAffine);
        localBox.expandByPoint(c);
      }
    }
  }

  const { xPos: xIdx, yPos: yIdx, zPos: zIdx } = resolveAxisIndices(layer.lens.axisNames, layer);
  const xMax = xIdx >= 0 ? layer.lens.shape[xIdx] : 0;
  const yMax = yIdx >= 0 ? layer.lens.shape[yIdx] : 0;

  // The layer-local frame IS voxel space — corner-anchored, no flip
  // (COORDINATE_SYSTEMS.md "Coordinate conventions") — so the local box reads
  // directly as voxel indices.
  const voxelXMin = localBox.min.x;
  const voxelXMax = localBox.max.x;
  const voxelYMin = localBox.min.y;
  const voxelYMax = localBox.max.y;

  let zRange: [number, number] | null = null;
  if (layer.zAxis) {
    const zMax = zIdx >= 0 ? layer.lens.shape[zIdx] : 0;
    zRange = [
      Math.max(0, Math.floor(localBox.min.z)),
      Math.min(zMax, Math.ceil(localBox.max.z)),
    ];
  }

  // Screen-pixels-per-image-pixel: transform two points 1 voxel apart
  // through affine + projection into screen space.
  const p0 = scaleP0.set(0, 0, 0).applyMatrix4(affine).applyMatrix4(projScreenMatrix);
  const p1 = scaleP1.set(1, 0, 0).applyMatrix4(affine).applyMatrix4(projScreenMatrix);
  const hw = viewportSize.width / 2;
  const hh = viewportSize.height / 2;
  const dx = (p1.x - p0.x) * hw;
  const dy = (p1.y - p0.y) * hh;
  const scale = Math.sqrt(dx * dx + dy * dy);

  return {
    xRange: [Math.max(0, Math.floor(voxelXMin)), Math.min(xMax, Math.ceil(voxelXMax))],
    yRange: [Math.max(0, Math.floor(voxelYMin)), Math.min(yMax, Math.ceil(voxelYMax))],
    zRange,
    scale,
  };
}

/** Value equality for a visible-id set against the store's string array. */
export function sameVisibleIds(previous: readonly string[], next: Set<string>): boolean {
  return previous.length === next.size && previous.every((id) => next.has(id));
}

/** Relative equality for the px-per-voxel scale (1% tolerance). */
function sameScale(a: number, b: number): boolean {
  const magnitude = Math.max(Math.abs(a), Math.abs(b), 1e-6);
  return Math.abs(a - b) <= 0.01 * magnitude;
}

/**
 * Value equality for two range maps (skip store writes when nothing changed).
 *
 * Every field is a planning input: the integer voxel ranges and `scale`.
 * `scale` jitters continuously during a 3D orbit, so it is compared with a 1%
 * relative tolerance (sub-1% wobble must not rewrite `layerViewRanges` per
 * camera tick). The cosmetic-only `viewportFraction` estimate that used to
 * ride along here was removed outright — it existed only for a sidebar badge
 * whose prop churn defeated the layer cards' memoization.
 */
export function sameViewRanges(
  previous: Record<string, LayerViewRange>,
  next: Record<string, LayerViewRange>,
): boolean {
  const previousKeys = Object.keys(previous);
  if (previousKeys.length !== Object.keys(next).length) return false;

  return previousKeys.every((key) => {
    const a = previous[key];
    const b = next[key];
    if (!b) return false;
    return (
      sameScale(a.scale, b.scale) &&
      a.xRange[0] === b.xRange[0] &&
      a.xRange[1] === b.xRange[1] &&
      a.yRange[0] === b.yRange[0] &&
      a.yRange[1] === b.yRange[1] &&
      (a.zRange === null) === (b.zRange === null) &&
      (a.zRange === null || (a.zRange[0] === b.zRange![0] && a.zRange[1] === b.zRange![1]))
    );
  });
}
