import type { AnnotationKind } from "@/mikro-next/api/graphql";

/**
 * Persistence shape for the tube surface.
 *
 * MESH is not in the generated `AnnotationKind` yet — the cast follows the
 * `SPHERE_KIND` precedent (`core/primitiveDraw.ts:19`): the client gets
 * ahead of codegen, the mutation starts succeeding the moment the server
 * learns the kind, and until then a failed save keeps the local preview.
 * Vector semantics: a triangle soup, 3 consecutive vectors per triangle
 * (the MULTI_POINT convention extended with implicit connectivity).
 */
export const MESH_KIND = "MESH" as AnnotationKind;

/**
 * Payload ceiling for a persisted tube: 10k triangles is ~30k vectors of
 * GraphQL JSON — already megabytes. Above it the tube stays preview-only.
 */
export const MAX_TUBE_SAVE_TRIANGLES = 10_000;

/** World triangle soup → the mutation's vector list. */
export function tubeVectors(
  positions: Float32Array,
): [number, number, number][] {
  const vectors: [number, number, number][] = [];
  for (let i = 0; i + 2 < positions.length; i += 3) {
    vectors.push([positions[i], positions[i + 1], positions[i + 2]]);
  }
  return vectors;
}
