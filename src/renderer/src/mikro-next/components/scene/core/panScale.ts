import * as THREE from "three";

/**
 * Zoom-sensitive panning for the 3D perspective camera.
 *
 * OrbitControls scales a pan drag by the CAMERA→TARGET distance
 * (`targetDistance` in three-stdlib's `pan()`): one screen-height of drag
 * moves the world by the frustum height AT THE TARGET PLANE. That is only
 * correct while the target sits at the depth of the content on screen. Both
 * zoom paths break that assumption on a volume: a plain dolly multiplies the
 * radius toward zero as the camera approaches the target, and `zoomToCursor`
 * re-seats the target at the collapsed radius on every wheel tick — after a
 * deep zoom the radius is microscopic while the voxels filling the screen sit
 * at real distances, so pan (∝ radius) freezes.
 *
 * Fix: measure where the content actually is — the layer bounding boxes along
 * the camera's view ray — and set `controls.panSpeed = content / target`.
 * three's pan math multiplies by `panSpeed · targetDistance`, so the target
 * term cancels exactly and a drag is screen-space correct at the CONTENT
 * depth, whatever the orbit radius has collapsed to.
 *
 * Pure math here; `cameras/CameraController.tsx` (`PanScaleSync`) is the store
 * glue, same split as `core/orbitPivot.ts`.
 */

/** Ray/AABB slab test returning [tEntry, tExit], or null when the ray misses. */
function slabT(
  origin: THREE.Vector3,
  direction: THREE.Vector3,
  box: THREE.Box3,
): [number, number] | null {
  let tmin = Number.NEGATIVE_INFINITY;
  let tmax = Number.POSITIVE_INFINITY;
  for (const axis of ["x", "y", "z"] as const) {
    const o = origin[axis];
    const d = direction[axis];
    if (Math.abs(d) < 1e-12) {
      if (o < box.min[axis] || o > box.max[axis]) return null;
      continue;
    }
    const inv = 1 / d;
    let t0 = (box.min[axis] - o) * inv;
    let t1 = (box.max[axis] - o) * inv;
    if (t0 > t1) [t0, t1] = [t1, t0];
    if (t0 > tmin) tmin = t0;
    if (t1 < tmax) tmax = t1;
    if (tmin > tmax) return null;
  }
  return [tmin, tmax];
}

/**
 * Distance along the view ray at which the content sits: the nearest layer
 * box's entry point, or — when the camera is INSIDE a box (zoomed into a
 * volume) — the midpoint of the remaining chord, a stable proxy for "the
 * voxels around the camera". Boxes entirely behind the camera are ignored;
 * no hit → `fallback` (the caller passes the target distance, which yields
 * a pan speed of exactly 1 — stock behavior).
 */
export function contentDistanceAlongRay(
  origin: THREE.Vector3,
  direction: THREE.Vector3,
  boxes: readonly THREE.Box3[],
  fallback: number,
): number {
  let best = Number.POSITIVE_INFINITY;
  for (const box of boxes) {
    if (box.isEmpty()) continue;
    const t = slabT(origin, direction, box);
    if (!t) continue;
    const [tEntry, tExit] = t;
    if (tExit <= 0) continue; // entirely behind the camera
    const d = tEntry >= 0 ? tEntry : tExit / 2;
    if (d > 0 && d < best) best = d;
  }
  return Number.isFinite(best) ? best : fallback;
}

/**
 * Where the orbit TARGET should sit along the view ray so that three's OWN
 * radius-proportional math (dolly steps, pan scale, rotate pivot) is
 * zoom-sensitive natively: the midpoint of the visible chord through the
 * nearest layer box. The midpoint rather than the entry surface is what lets
 * a dolly-in actually ENTER the volume — converging on the surface would
 * stall there — while re-seating on every camera settle keeps the pivot ahead
 * of the camera as it advances (the remaining half-chord recedes). No hit →
 * `fallback` (the caller passes the current target distance: a no-op).
 */
export function orbitDepthAlongRay(
  origin: THREE.Vector3,
  direction: THREE.Vector3,
  boxes: readonly THREE.Box3[],
  fallback: number,
): number {
  let bestEntry = Number.POSITIVE_INFINITY;
  let best = fallback;
  for (const box of boxes) {
    if (box.isEmpty()) continue;
    const t = slabT(origin, direction, box);
    if (!t) continue;
    const [tEntry, tExit] = t;
    if (tExit <= 0) continue; // entirely behind the camera
    const entry = Math.max(tEntry, 0);
    if (entry < bestEntry) {
      bestEntry = entry;
      best = (entry + tExit) / 2;
    }
  }
  return best > 0 ? best : fallback;
}

/**
 * The `panSpeed` that makes a drag screen-space correct at `contentDistance`:
 * three multiplies pan by `panSpeed · targetDistance`, so the ratio replaces
 * the target term with the content term exactly. Clamped only against
 * degenerate geometry (collapsed radius, content at the near plane) — within
 * the clamp the target distance cancels and no tuning constant is involved.
 */
export function resolvePanSpeed(
  contentDistance: number,
  targetDistance: number,
  maxRatio = 1e4,
): number {
  if (!(contentDistance > 0) || !(targetDistance > 0)) return 1;
  if (!Number.isFinite(contentDistance) || !Number.isFinite(targetDistance)) return 1;
  return THREE.MathUtils.clamp(contentDistance / targetDistance, 1 / maxRatio, maxRatio);
}
