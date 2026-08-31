// @vitest-environment jsdom
// (the AnnotationKind enum import pulls in modules that touch `window`)
import * as THREE from "three";
import { describe, expect, it } from "vitest";

import { AnnotationKind, type SceneAnnotationFragment } from "@/mikro-next/api/graphql";
import { placeAnnotations, splitPointEntries, sameEntries, type PlacementIdentity } from "./placedAnnotations";

const annotation = (id: string, kind: AnnotationKind, vectors: number[][]): SceneAnnotationFragment =>
  ({ id, name: id, kind, vectors, coordinates: [], strokeColor: null, fillColor: null, strokeWidth: 1.5, filled: false }) as unknown as SceneAnnotationFragment;

const identity: PlacementIdentity = { layerId: "layer", systemId: "cs", axisNames: ["z", "y", "x"] };
const matrix = new THREE.Matrix4();

describe("placeAnnotations", () => {
  it("keeps entry AND roi identity for unchanged rows across recomputes", () => {
    const a = annotation("a", AnnotationKind.Path, [[0, 0, 0], [1, 1, 0]]);
    const b = annotation("b", AnnotationKind.Point, [[2, 2, 2]]);
    const first = placeAnnotations([a, b], matrix, identity);
    // A poll delta: b replaced, a identical (Apollo keeps its row identity).
    const b2 = annotation("b", AnnotationKind.Point, [[3, 3, 3]]);
    const second = placeAnnotations([a, b2], matrix, identity);
    expect(second[0]).toBe(first[0]);
    expect(second[0].roi).toBe(first[0].roi);
    expect(second[1]).not.toBe(first[1]);
  });

  it("re-places everything when the matrix or the layer identity changes", () => {
    const a = annotation("a", AnnotationKind.Path, [[0, 0, 0], [1, 1, 0]]);
    const first = placeAnnotations([a], matrix, identity);
    const moved = placeAnnotations([a], new THREE.Matrix4().makeTranslation(5, 0, 0), identity);
    expect(moved[0]).not.toBe(first[0]);
    expect(moved[0].bounds.minX).toBeCloseTo(first[0].bounds.minX + 5);
  });

  it("splits points from shapes and buckets by opacity", () => {
    const entries = placeAnnotations(
      [
        annotation("p1", AnnotationKind.Point, [[0, 0, 0]]),
        annotation("line", AnnotationKind.Line, [[0, 0, 0], [1, 0, 0]]),
      ],
      matrix,
      identity,
    );
    const { pointGroups, otherShapes } = splitPointEntries(entries, () => false, true);
    expect(pointGroups).toHaveLength(1);
    expect(pointGroups[0][1][0].id).toBe("p1");
    expect(otherShapes.map((e) => e.annotation.id)).toEqual(["line"]);
  });

  it("sameEntries is the cheap change test the store-write gate uses", () => {
    const a = annotation("a", AnnotationKind.Path, [[0, 0, 0], [1, 1, 0]]);
    const first = placeAnnotations([a], matrix, identity);
    const second = placeAnnotations([a], matrix, identity);
    expect(sameEntries(first, second)).toBe(true);
    expect(sameEntries(first, [])).toBe(false);
    expect(sameEntries(null, second)).toBe(false);
  });
});
