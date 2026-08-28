import { describe, expect, it, vi } from "vitest";

// `api/graphql` is the generated Apollo module, and importing it pulls in the
// mikro client and the whole app shell (which touches `window` at load). All
// this module needs from it is the one enum member, so stub it and keep the
// welding a fast, isolated unit test.
vi.mock("@/mikro-next/api/graphql", () => ({
  AnnotationKind: { Surface: "SURFACE" },
}));

import { surfaceGeometry } from "./tubePersist";

/**
 * Two triangles sharing an edge, as marching tets emits them: a soup of six
 * corners, of which only four are distinct points.
 */
const SHARED_EDGE = new Float32Array([
  0, 0, 0, 1, 0, 0, 0, 1, 0,
  1, 0, 0, 0, 1, 0, 1, 1, 0,
]);

describe("surfaceGeometry", () => {
  it("welds the shared corners and keeps both triangles", () => {
    const { vectors, faces } = surfaceGeometry(SHARED_EDGE);

    expect(vectors).toEqual([
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
    ]);
    expect(faces).toEqual([
      [0, 1, 2],
      [1, 2, 3],
    ]);
  });

  it("welds corners that agree only to within float noise", () => {
    // The corners meeting at a shared edge come out of the same interpolation
    // but not bit-identical. Welding on raw bits would find no duplicates at
    // all and ship the soup under a different name.
    const noisy = new Float32Array([
      0, 0, 0, 1, 0, 0, 0, 1, 0,
      1 + 1e-9, 0, 0, 0, 1, 1e-9, 1, 1, 0,
    ]);

    expect(surfaceGeometry(noisy).vectors).toHaveLength(4);
  });

  it("drops a degenerate triangle rather than storing it", () => {
    // Marching tets clips a tetrahedron exactly through a corner and emits a
    // triangle with two identical corners. It renders as nothing and the server
    // refuses nothing, so keeping it would only inflate the payload.
    const degenerate = new Float32Array([
      0, 0, 0, 1, 0, 0, 1, 0, 0,
      0, 0, 0, 1, 0, 0, 0, 1, 0,
    ]);
    const { faces } = surfaceGeometry(degenerate);

    expect(faces).toEqual([[0, 1, 2]]);
  });

  it("is roughly a third the vertices of the soup it came from", () => {
    // The reason the wire format is indexed at all: a closed surface has each
    // vertex meeting several triangles, so welding is a large constant factor,
    // not a rounding error.
    const { vectors } = surfaceGeometry(SHARED_EDGE);
    expect(vectors.length).toBeLessThan(SHARED_EDGE.length / 3);
  });

  it("has nothing to say about an empty surface", () => {
    expect(surfaceGeometry(new Float32Array([]))).toEqual({ vectors: [], faces: [] });
  });
});
