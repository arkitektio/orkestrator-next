import type * as THREE from "three";

/**
 * World → screen for an anchored overlay: where a HUD panel that describes a
 * scene object has to sit so it reads as belonging to that object.
 *
 * Pure and allocation-free (both entry points write into caller-owned `out`
 * objects) because the projector calls them once per rendered frame — see
 * `panels/SelectionAnchorProjector`.
 */

export type Point3 = { x: number; y: number; z: number };

export type ScreenPoint = {
  /** CSS pixels from the canvas's top-left corner. */
  x: number;
  y: number;
  /**
   * The point is behind the camera (negative clip w). Its projected x/y are
   * mirrored garbage — the caller must hide the panel rather than place it.
   * Always false under an orthographic camera, where w is 1.
   */
  behind: boolean;
};

/**
 * Project a world point through a combined view-projection matrix.
 *
 * Written out by hand rather than via `Vector3.project` so it takes the MATRIX
 * (which is what the frame callback already has, and what a test can hand it)
 * instead of a live camera — and so the w component survives: `project()`
 * divides it away, losing the behind-the-camera answer.
 */
export function projectToScreen(
  point: Point3,
  viewProjection: THREE.Matrix4,
  viewport: { width: number; height: number },
  out: ScreenPoint,
): ScreenPoint {
  const e = viewProjection.elements;
  const { x, y, z } = point;
  // Column-major: e[3], e[7], e[11], e[15] are the w row.
  const w = e[3] * x + e[7] * y + e[11] * z + e[15];
  const clipX = e[0] * x + e[4] * y + e[8] * z + e[12];
  const clipY = e[1] * x + e[5] * y + e[9] * z + e[13];

  // A w of exactly 0 is the camera plane itself — no finite screen position.
  const safeW = w === 0 ? Number.EPSILON : w;
  const ndcX = clipX / safeW;
  const ndcY = clipY / safeW;

  // NDC is y-up in [-1, 1]; CSS pixels are y-down from the top-left.
  out.x = (ndcX * 0.5 + 0.5) * viewport.width;
  out.y = (-ndcY * 0.5 + 0.5) * viewport.height;
  out.behind = w <= 0;
  return out;
}

/**
 * Where to put the panel's top-left corner so it sits BESIDE its anchor and
 * stays fully on the canvas.
 *
 * Right-and-below of the anchor by `gap` is the preference; each axis flips to
 * the other side when that would overflow, and only then clamps — flipping
 * first is what keeps the panel from covering the very shape it describes when
 * the shape is near the right or bottom edge. A panel too large to fit at all
 * pins to the top-left margin (the clamp's lower bound wins), so it stays
 * readable instead of hanging off the far edge.
 */
export function placeAnchoredPanel(input: {
  anchor: { x: number; y: number };
  panel: { width: number; height: number };
  viewport: { width: number; height: number };
  /** Clearance between the anchor point and the panel's edge. */
  gap?: number;
  /** Clearance between the panel and the canvas edges. */
  margin?: number;
  out: { x: number; y: number };
}): { x: number; y: number } {
  const { anchor, panel, viewport, gap = 14, margin = 8, out } = input;

  const clamp = (value: number, extent: number, panelExtent: number) =>
    Math.max(margin, Math.min(value, Math.max(margin, extent - margin - panelExtent)));

  const right = anchor.x + gap;
  const below = anchor.y + gap;

  out.x =
    right + panel.width > viewport.width - margin ? anchor.x - gap - panel.width : right;
  out.y =
    below + panel.height > viewport.height - margin
      ? anchor.y - gap - panel.height
      : below;

  out.x = clamp(out.x, viewport.width, panel.width);
  out.y = clamp(out.y, viewport.height, panel.height);
  return out;
}

/**
 * The center of a point cloud's axis-aligned bounds, or null when empty.
 *
 * Bounds center rather than mean: it is the point that reads as "the middle of
 * the shape" for a polygon whose vertices bunch up along one edge, which is
 * exactly the case a hand-drawn path produces.
 */
export function boundsCenter(points: readonly Point3[]): Point3 | null {
  if (points.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  for (const point of points) {
    if (point.x < minX) minX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.z < minZ) minZ = point.z;
    if (point.x > maxX) maxX = point.x;
    if (point.y > maxY) maxY = point.y;
    if (point.z > maxZ) maxZ = point.z;
  }
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2, z: (minZ + maxZ) / 2 };
}
