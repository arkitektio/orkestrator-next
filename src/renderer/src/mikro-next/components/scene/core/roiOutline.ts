import type { DrawingTool } from "../store/roiDrawingStore";

/**
 * Outline geometry for the shapes drawn on the scene — the live border while
 * you drag and the border of a shape already committed.
 *
 * Pure and flat by design: everything here lands on one Z plane (the slice being
 * drawn on). `layers/annotation/AnnotationLayer.tsx` keeps its own 3D-aware
 * variants, which extrude a rectangle into a box and an ellipse into a prism
 * when an annotation spans depth — that is a different job from previewing a
 * shape the user is dragging out right now.
 */

export type OutlinePoint = [number, number, number];

export interface OutlinePlanar {
  x: number;
  y: number;
}

/** Enough segments that the border reads as a curve at any sane zoom. */
export const ELLIPSE_SEGMENTS = 48;

/** Closed: the last point repeats the first, so the border has no seam. */
export function rectangleOutline(
  a: OutlinePlanar,
  b: OutlinePlanar,
  z: number,
): OutlinePoint[] {
  return [
    [a.x, a.y, z],
    [b.x, a.y, z],
    [b.x, b.y, z],
    [a.x, b.y, z],
    [a.x, a.y, z],
  ];
}

/**
 * The ellipse inscribed in the drag rectangle, closed the same way. Point count
 * is fixed at `segments + 1` regardless of size, which is what lets the renderer
 * rewrite the border in place while you drag.
 */
export function ellipseOutline(
  a: OutlinePlanar,
  b: OutlinePlanar,
  z: number,
  segments = ELLIPSE_SEGMENTS,
): OutlinePoint[] {
  const cx = (a.x + b.x) / 2;
  const cy = (a.y + b.y) / 2;
  const rx = Math.abs(b.x - a.x) / 2;
  const ry = Math.abs(b.y - a.y) / 2;

  const points: OutlinePoint[] = [];
  for (let index = 0; index <= segments; index += 1) {
    const theta = (index / segments) * Math.PI * 2;
    points.push([cx + rx * Math.cos(theta), cy + ry * Math.sin(theta), z]);
  }
  return points;
}

export function polylineOutline(
  points: readonly OutlinePlanar[],
  z: number,
  close = false,
): OutlinePoint[] {
  const outline: OutlinePoint[] = points.map((point) => [point.x, point.y, z]);
  if (close && outline.length >= 3) outline.push(outline[0]);
  return outline;
}

/**
 * The border for `tool`, given the points gathered so far.
 *
 * Returns `[]` when there is nothing to stroke — a POINT (drawn as a disc, not
 * a line) or too few points yet. Callers can hand the result straight to `Line`,
 * which declines to mount below two points.
 */
export function roiOutline(
  tool: DrawingTool,
  points: readonly OutlinePlanar[],
  z: number,
  options: { closePolygon?: boolean; segments?: number } = {},
): OutlinePoint[] {
  if (tool === "POINT") return [];
  if (points.length < 2) return [];

  // No `default` on purpose. `noImplicitReturns` is on, so widening
  // `DrawingTool` fails the typecheck here — which is what you want. Adding
  // `default: return []` to silence that error would turn a compile-time
  // failure into a tool that silently draws nothing.
  switch (tool) {
    case "RECTANGLE":
      return rectangleOutline(points[0], points[1], z);
    case "ELLIPSIS":
      return ellipseOutline(points[0], points[1], z, options.segments);
    case "LINE":
      return polylineOutline(points.slice(0, 2), z);
    case "POLYGON":
      return polylineOutline(points, z, options.closePolygon ?? true);
    case "PATH":
      return polylineOutline(points, z);
  }
}
