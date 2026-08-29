import { AnnotationKind } from "@/mikro-next/api/graphql";

/**
 * Persistence shape for a painted surface — a brush tube or a blob.
 *
 * Vector semantics: `vectors` are the surface's unique vertices and `faces`
 * indexes them in triples. Indexed rather than the triangle soup the extractor
 * hands us for two reasons. It is ~4x smaller — a welded 10k-triangle surface is
 * ~5k vertices plus 10k index triples, against 30k repeated vertices. And it
 * keeps every vertex in `vectors`, which is what the server derives
 * `intrinsicBbox` (and its GiST-indexed copy) from, so the box comes out right
 * with nothing extra sent.
 */
export const SURFACE_KIND = AnnotationKind.Surface;

/**
 * Payload ceiling for a persisted surface; above it the geometry stays
 * preview-only.
 *
 * Left at the soup-era number deliberately. Indexing made the same surface
 * roughly a quarter the bytes, so this could be raised — but the ceiling that
 * matters is not one stroke, it is every stroke in a collection arriving in one
 * `GetSceneSurfaces` response. Raise it against a measurement of what real
 * painted regions actually come in at, not against the compression ratio.
 */
export const MAX_TUBE_SAVE_TRIANGLES = 10_000;

/**
 * Quantization used to decide that two soup vertices are the same one.
 *
 * Marching tets emits a vertex per triangle corner, and the corners that meet at
 * a shared edge are computed from the same interpolation — so they agree to
 * within float noise rather than exactly. Welding on the raw bits would find
 * almost no duplicates and ship the soup under a different name. A micron of a
 * scene unit is far below anything the extraction resolves and far above that
 * noise.
 */
const WELD_PRECISION = 1e-6;

export type SurfaceGeometry = {
  /** Unique vertices in scene WORLD coordinates. */
  vectors: [number, number, number][];
  /** Triangles, as index triples into `vectors`. */
  faces: [number, number, number][];
};

/**
 * World triangle soup → indexed geometry.
 *
 * Degenerate triangles — ones whose corners weld to fewer than three distinct
 * vertices — are dropped rather than stored. Marching tets produces them wherever
 * the isosurface clips a tetrahedron exactly through a corner; they render as
 * nothing and the server refuses nothing, so keeping them would only inflate the
 * payload with triangles of zero area.
 */
export function surfaceGeometry(positions: Float32Array): SurfaceGeometry {
  const vectors: [number, number, number][] = [];
  const faces: [number, number, number][] = [];
  const seen = new Map<string, number>();

  const indexOf = (x: number, y: number, z: number): number => {
    const key = `${Math.round(x / WELD_PRECISION)},${Math.round(y / WELD_PRECISION)},${Math.round(z / WELD_PRECISION)}`;
    const existing = seen.get(key);
    if (existing !== undefined) return existing;
    const index = vectors.length;
    vectors.push([x, y, z]);
    seen.set(key, index);
    return index;
  };

  for (let i = 0; i + 8 < positions.length; i += 9) {
    const a = indexOf(positions[i], positions[i + 1], positions[i + 2]);
    const b = indexOf(positions[i + 3], positions[i + 4], positions[i + 5]);
    const c = indexOf(positions[i + 6], positions[i + 7], positions[i + 8]);
    if (a === b || b === c || a === c) continue;
    faces.push([a, b, c]);
  }

  return { vectors, faces };
}
