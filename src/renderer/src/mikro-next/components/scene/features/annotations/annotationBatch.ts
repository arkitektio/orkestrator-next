import * as THREE from "three";
import { AnnotationKind, type SceneAnnotationFragment } from "@/mikro-next/api/graphql";
import { ellipsoidCrossSectionScale } from "./primitiveDraw";
import { MIN_DEPTH, ellipseRing, getVectorPoint } from "./annotationBounds";
import { resolveStyle } from "./annotationStyle";

/**
 * Merged annotation outlines: one `LineSegments2` per (collection, stroke
 * width) instead of one `Line2` + `Line2NodeMaterial` per shape. For a
 * thousand-ROI collection that collapses ~a thousand fat-line draw calls and
 * materials into a handful; selection highlights are a color-range rewrite.
 *
 * This module is the PURE half — outline geometry and batch layout, unit
 * tested — so the component side only uploads buffers and maps picks.
 * `outlinePoints` MUST stay in lockstep with `AnnotationShape`'s Line-
 * producing branches (`AnnotationLayer.tsx`): it is the same drawing decision,
 * expressed as data.
 */

// The kill switch (`orkestrator.annotationBatch`, default OFF) lives in
// `platform/draw/lineBatchFlag.ts` so the DebugPanel toggles it without a
// sideways feature edge.
export {
  isLineBatchEnabled as isAnnotationBatchEnabled,
  setLineBatchEnabled as setAnnotationBatchEnabled,
} from "../../platform/draw/lineBatchFlag";

/** Smallest cross-section drawn for an ellipsoid the plane barely grazes. */
export const MIN_CROSS_SECTION_SCALE = 0.05;

export const ELLIPSE_SEGMENTS = 48;

/**
 * The polyline a shape's OUTLINE draws, in the collection's space — exactly
 * the points `AnnotationShape` hands its `<Line>`, or null when the shape
 * draws no fat line (points, and the 3D wireframe box/sphere branches).
 * `planeZ` is the flat view's slice in the collection's space (the ellipsoid
 * section input); null in 3D and in scenes without a z axis.
 */
export function outlinePoints(
  annotation: SceneAnnotationFragment,
  flattenToPlane: boolean,
  planeZ: number | null,
): [number, number, number][] | null {
  const vectors = annotation.vectors;
  if (!vectors || vectors.length === 0) return null;

  if (annotation.kind === AnnotationKind.Point) return null;

  if (annotation.kind === AnnotationKind.Line && vectors.length >= 2) {
    return vectors.map((vector) => getVectorPoint(vector, flattenToPlane));
  }

  if (
    (annotation.kind === AnnotationKind.Rectangle || annotation.kind === AnnotationKind.Cube) &&
    vectors.length >= 2
  ) {
    const [[x0, y0, z0], [x1, y1, z1]] = vectors.map((vector) =>
      getVectorPoint(vector, flattenToPlane),
    );
    // Extruded 3D box: drawn as a wireframe mesh, not a fat line.
    if (!flattenToPlane && Math.abs(z1 - z0) >= MIN_DEPTH) return null;
    return [
      [x0, y0, z0],
      [x1, y0, z0],
      [x1, y1, z0],
      [x0, y1, z0],
      [x0, y0, z0],
    ];
  }

  if (
    (annotation.kind === AnnotationKind.Ellipse || annotation.kind === AnnotationKind.Sphere) &&
    vectors.length >= 2
  ) {
    const [[x0, y0, z0], [x1, y1, z1]] = vectors.map((vector) =>
      getVectorPoint(vector, flattenToPlane),
    );
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const rx = Math.abs(x1 - x0) / 2;
    const ry = Math.abs(y1 - y0) / 2;
    const rz = Math.abs(z1 - z0) / 2;
    // True 3D sphere/ellipsoid: wireframe mesh, not a fat line.
    if (!flattenToPlane && rz >= MIN_DEPTH) return null;

    const depthCenter = ((vectors[0][2] ?? 0) + (vectors[1][2] ?? 0)) / 2;
    const depthRadius = Math.abs((vectors[1][2] ?? 0) - (vectors[0][2] ?? 0)) / 2;
    const section =
      planeZ === null || depthRadius < MIN_DEPTH
        ? 1
        : Math.max(
            ellipsoidCrossSectionScale(planeZ, depthCenter, depthRadius) ?? 0,
            MIN_CROSS_SECTION_SCALE,
          );

    const points = ellipseRing(cx, cy, z0, rx * section, ry * section, ELLIPSE_SEGMENTS);
    points.push(points[0]);
    return points;
  }

  if (
    (annotation.kind === AnnotationKind.Polygon || annotation.kind === AnnotationKind.Path) &&
    vectors.length >= 2
  ) {
    const pts = vectors.map((vector) => getVectorPoint(vector, flattenToPlane));
    if (annotation.kind === AnnotationKind.Polygon) pts.push(pts[0]); // close polygon
    return pts;
  }

  // Fallback: any shape renders as a polyline.
  if (vectors.length >= 2) {
    return vectors.map((vector) => getVectorPoint(vector, flattenToPlane));
  }

  return null;
}

/** Contiguous segment range one ROI owns inside a batch (`[start, end)`). */
export type OutlineRange<R> = { start: number; end: number; roi: R };

export type OutlineBatch<R> = {
  /** Screen-space stroke width shared by every segment in this batch. */
  lineWidth: number;
  /** Interleaved segment endpoints, 6 floats per segment (xyz, xyz). */
  positions: Float32Array;
  /** Endpoint colors, 6 floats per segment (rgb, rgb). */
  colors: Float32Array;
  /** Sorted by `start`; one entry per contributing shape. */
  ranges: OutlineRange<R>[];
  segmentCount: number;
};

const SCRATCH_COLOR = new THREE.Color();

/**
 * Fold the shown shapes' outlines into one batch per stroke width. Point
 * order inside a batch is entry order, so `ranges` is sorted by construction
 * and `roiForSegment` can binary-search a picked `faceIndex`.
 */
export function buildOutlineBatches<R>(
  entries: readonly { annotation: SceneAnnotationFragment; roi: R }[],
  flattenToPlane: boolean,
  planeZ: number | null,
  isActive: (annotationId: string) => boolean,
): OutlineBatch<R>[] {
  type Accumulator = {
    lineWidth: number;
    positions: number[];
    colors: number[];
    ranges: OutlineRange<R>[];
    segments: number;
  };
  const byWidth = new Map<number, Accumulator>();

  for (const { annotation, roi } of entries) {
    const points = outlinePoints(annotation, flattenToPlane, planeZ);
    if (!points || points.length < 2) continue;
    const style = resolveStyle(annotation, isActive(annotation.id));

    let batch = byWidth.get(style.strokeWidth);
    if (!batch) {
      batch = { lineWidth: style.strokeWidth, positions: [], colors: [], ranges: [], segments: 0 };
      byWidth.set(style.strokeWidth, batch);
    }

    SCRATCH_COLOR.set(style.stroke);
    const r = SCRATCH_COLOR.r;
    const g = SCRATCH_COLOR.g;
    const b = SCRATCH_COLOR.b;

    const start = batch.segments;
    for (let i = 0; i < points.length - 1; i++) {
      const [ax, ay, az] = points[i];
      const [bx, by, bz] = points[i + 1];
      batch.positions.push(ax, ay, az, bx, by, bz);
      batch.colors.push(r, g, b, r, g, b);
    }
    batch.segments += points.length - 1;
    batch.ranges.push({ start, end: batch.segments, roi });
  }

  return [...byWidth.values()]
    .filter((batch) => batch.segments > 0)
    .map((batch) => ({
      lineWidth: batch.lineWidth,
      positions: new Float32Array(batch.positions),
      colors: new Float32Array(batch.colors),
      ranges: batch.ranges,
      segmentCount: batch.segments,
    }));
}

/** The ROI owning a picked segment (`faceIndex` from the fat-line raycast). */
export function roiForSegment<R>(
  ranges: readonly OutlineRange<R>[],
  segmentIndex: number | null | undefined,
): R | null {
  if (segmentIndex === undefined || segmentIndex === null || segmentIndex < 0) return null;
  let lo = 0;
  let hi = ranges.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const range = ranges[mid];
    if (segmentIndex < range.start) hi = mid - 1;
    else if (segmentIndex >= range.end) lo = mid + 1;
    else return range.roi;
  }
  return null;
}
