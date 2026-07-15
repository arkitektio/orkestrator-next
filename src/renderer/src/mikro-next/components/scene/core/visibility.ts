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
  /**
   * Rough fraction of the viewport this layer covers (0..1). A fast, imprecise
   * estimate: the layer's frustum-clipped world box projected to an NDC 2D AABB.
   */
  viewportFraction: number;
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
const frustum = new THREE.Frustum();
const box = new THREE.Box3();
const corner = new THREE.Vector3();
const ndcCorner = new THREE.Vector3();

export function computeSceneVisibility({
  projScreenMatrix,
  viewportSize,
  trackables,
  layers,
}: SceneVisibilityInput): SceneVisibilityResult {
  frustum.setFromProjectionMatrix(projScreenMatrix);

  // Frustum AABB in world space (for intersecting layer boxes).
  const invPV = projScreenMatrix.clone().invert();
  const frustumBox = new THREE.Box3();
  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      for (let z = -1; z <= 1; z += 2) {
        corner.set(x, y, z).applyMatrix4(invPV);
        frustumBox.expandByPoint(corner);
      }
    }
  }

  const visibleIds = new Set<string>();
  const ranges: Record<string, LayerViewRange> = {};

  for (const trackable of trackables) {
    const object = trackable.ref.current;
    if (!object) continue;

    box.setFromObject(object);
    if (!frustum.intersectsBox(box)) continue;

    visibleIds.add(trackable.id);
    if (trackable.kind !== "layer") continue;

    const layer = layers.find((l) => l.id === trackable.id);
    if (!layer) continue;

    const visibleBox = box.clone().intersect(frustumBox);
    if (visibleBox.isEmpty()) continue;

    const range = computeLayerViewRange(layer, visibleBox, projScreenMatrix, viewportSize);
    if (range) ranges[trackable.id] = range;
  }

  return { visibleIds, ranges };
}

function computeLayerViewRange(
  layer: LayerState,
  visibleWorldBox: THREE.Box3,
  projScreenMatrix: THREE.Matrix4,
  viewportSize: { width: number; height: number },
): LayerViewRange | null {
  const affine = affineToMatrix4(layer.affineMatrix);
  const invAffine = affine.clone().invert();

  // Visible box corners into layer-local space.
  const localBox = new THREE.Box3();
  const c = new THREE.Vector3();
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

  // The layer-local frame is centered at the origin with +y up (see
  // ChunkPlane positioning: coord*size + size/2 - total/2, y negated). Shift
  // by half the extent — and flip y, which swaps min/max — to get voxel
  // indices.
  const voxelXMin = localBox.min.x + xMax / 2;
  const voxelXMax = localBox.max.x + xMax / 2;
  const voxelYMin = yMax / 2 - localBox.max.y;
  const voxelYMax = yMax / 2 - localBox.min.y;

  let zRange: [number, number] | null = null;
  if (layer.zAxis) {
    const zMax = zIdx >= 0 ? layer.lens.shape[zIdx] : 0;
    zRange = [
      Math.max(0, Math.floor(localBox.min.z + zMax / 2)),
      Math.min(zMax, Math.ceil(localBox.max.z + zMax / 2)),
    ];
  }

  // Screen-pixels-per-image-pixel: transform two points 1 voxel apart
  // through affine + projection into screen space.
  const p0 = new THREE.Vector3(0, 0, 0).applyMatrix4(affine).applyMatrix4(projScreenMatrix);
  const p1 = new THREE.Vector3(1, 0, 0).applyMatrix4(affine).applyMatrix4(projScreenMatrix);
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
    viewportFraction: estimateViewportFraction(visibleWorldBox, projScreenMatrix),
  };
}

/**
 * Rough, fast estimate of how much of the viewport a layer covers (0..1).
 * Projects the 8 corners of the frustum-clipped world box to NDC, takes the 2D
 * AABB, clamps it to the [-1,1] NDC square, and returns its area over the full
 * viewport area (2×2 = 4). Not precise — deliberately cheap (8 matrix-vector
 * products). The box is pre-clipped to the frustum, so corners project cleanly.
 */
function estimateViewportFraction(
  visibleWorldBox: THREE.Box3,
  projScreenMatrix: THREE.Matrix4,
): number {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let ix = 0; ix <= 1; ix++) {
    for (let iy = 0; iy <= 1; iy++) {
      for (let iz = 0; iz <= 1; iz++) {
        ndcCorner
          .set(
            ix === 0 ? visibleWorldBox.min.x : visibleWorldBox.max.x,
            iy === 0 ? visibleWorldBox.min.y : visibleWorldBox.max.y,
            iz === 0 ? visibleWorldBox.min.z : visibleWorldBox.max.z,
          )
          .applyMatrix4(projScreenMatrix);
        if (ndcCorner.x < minX) minX = ndcCorner.x;
        if (ndcCorner.x > maxX) maxX = ndcCorner.x;
        if (ndcCorner.y < minY) minY = ndcCorner.y;
        if (ndcCorner.y > maxY) maxY = ndcCorner.y;
      }
    }
  }
  const clampedW = Math.min(1, maxX) - Math.max(-1, minX);
  const clampedH = Math.min(1, maxY) - Math.max(-1, minY);
  const fraction = (Math.max(0, clampedW) * Math.max(0, clampedH)) / 4;
  return Math.min(1, Math.max(0, fraction));
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
 * Only the fields that drive planning are compared: the integer voxel ranges and
 * `scale`. Two fields are deliberately handled with care because they jitter
 * continuously during a 3D orbit and would otherwise rewrite `layerViewRanges`
 * every camera tick — which re-renders the whole `LayerControlPanel` subtree:
 *  - `scale` is compared with a 1% relative tolerance (sub-1% wobble is ignored).
 *  - `viewportFraction` is NOT compared at all: it is cosmetic-only (the panel's
 *    coverage sort / badge) and NOT a planning input, so it must never gate the
 *    hot store write. The panel reads whatever value was last published.
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
