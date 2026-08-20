/**
 * In-place writers for `LineSegmentsGeometry`'s interleaved buffers.
 *
 * three's own `LineGeometry.setPositions` / `LineSegments2.computeLineDistances`
 * allocate a fresh Float32Array, a fresh InstancedInterleavedBuffer and fresh
 * InterleavedBufferAttributes on every call. New attribute objects mean new
 * attribute ids, which trips the renderer's `needsGeometryUpdate` and orphans
 * the previous GPU buffers until the geometry is disposed — fine once, ruinous
 * per pointer move.
 *
 * These write into the buffers that already exist, so the caller only has to set
 * `needsUpdate` and the backend issues a single `writeBuffer`. Valid only while
 * the point COUNT is unchanged; the caller falls back to `setPositions` when it
 * is not (`platform/draw/PreviewLine.tsx`).
 */

/** Floats per pair-buffer segment: (start.xyz, end.xyz). */
export const FLOATS_PER_SEGMENT = 6;

/** A polyline of N points is N-1 segments. */
export const segmentCountFor = (pointCount: number): number =>
  Math.max(0, pointCount - 1);

export const pairBufferLength = (pointCount: number): number =>
  segmentCountFor(pointCount) * FLOATS_PER_SEGMENT;

/**
 * Expand a polyline into the PAIR layout `LineGeometry.setPositions` produces:
 * segment `i` occupies `[6i .. 6i+5]` as `(P[i].xyz, P[i+1].xyz)`, so every
 * interior vertex is written twice. That duplication IS the layout, not waste —
 * `instanceStart` and `instanceEnd` are two views onto the same interleaved
 * buffer at offsets 0 and 3.
 *
 * Returns the number of segments written, or -1 when `target` is too small — the
 * caller must then reallocate through `setPositions`.
 */
export function writePolylinePairs(
  target: Float32Array,
  points: readonly (readonly [number, number, number])[],
): number {
  const segments = segmentCountFor(points.length);
  if (segments === 0) return 0;
  if (target.length < segments * FLOATS_PER_SEGMENT) return -1;

  for (let index = 0; index < segments; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const offset = index * FLOATS_PER_SEGMENT;

    target[offset] = start[0];
    target[offset + 1] = start[1];
    target[offset + 2] = start[2];
    target[offset + 3] = end[0];
    target[offset + 4] = end[1];
    target[offset + 5] = end[2];
  }

  return segments;
}

/**
 * Cumulative arc length per segment endpoint, in the `(d0, d1)` interleaved
 * layout the dash shader reads. Stride 2 per segment; `d1` of one segment is
 * `d0` of the next, which is what makes the dash pattern continuous across
 * corners.
 *
 * Leaving these stale while the geometry moves is visibly wrong — the dash pitch
 * drifts near the moving end — so the preview rewrites them alongside the
 * positions.
 */
export function writeLineDistances(
  target: Float32Array,
  pairs: Float32Array,
  segmentCount: number,
): void {
  let distance = 0;

  for (let index = 0; index < segmentCount; index += 1) {
    const offset = index * FLOATS_PER_SEGMENT;
    const dx = pairs[offset + 3] - pairs[offset];
    const dy = pairs[offset + 4] - pairs[offset + 1];
    const dz = pairs[offset + 5] - pairs[offset + 2];

    const slot = index * 2;
    target[slot] = distance;
    distance += Math.sqrt(dx * dx + dy * dy + dz * dz);
    target[slot + 1] = distance;
  }
}
