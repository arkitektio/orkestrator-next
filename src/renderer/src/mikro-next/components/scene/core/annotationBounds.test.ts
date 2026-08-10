// @vitest-environment jsdom
// (the generated `graphql.ts` enums are runtime values, and importing that
// module pulls in the Apollo hooks barrel, which touches `window` on load)
import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { RoiKind, type SceneAnnotationFragment } from "@/mikro-next/api/graphql";
import {
  getAnnotationSelectionPoints,
  getWorldExtent,
  worldExtentToBox3,
} from "./annotationBounds";

const annotation = (
  kind: RoiKind,
  vectors: number[][],
): SceneAnnotationFragment =>
  ({ id: "a1", name: "a", kind, vectors, coordinates: [] }) as unknown as SceneAnnotationFragment;

describe("getAnnotationSelectionPoints", () => {
  it("takes only the first vertex of a POINT", () => {
    const points = getAnnotationSelectionPoints(
      annotation(RoiKind.Point, [[1, 2, 3], [9, 9, 9]]),
      false,
    );
    expect(points).toEqual([[1, 2, 3]]);
  });

  it("keeps every vertex of a LINE", () => {
    const points = getAnnotationSelectionPoints(
      annotation(RoiKind.Line, [[0, 0, 0], [4, 4, 4]]),
      false,
    );
    expect(points).toEqual([[0, 0, 0], [4, 4, 4]]);
  });

  it("expands a flat RECTANGLE corner pair to 4 corners", () => {
    const points = getAnnotationSelectionPoints(
      annotation(RoiKind.Rectangle, [[0, 0, 5], [2, 3, 5]]),
      false,
    );
    expect(points).toHaveLength(4);
    expect(points).toContainEqual([2, 3, 5]);
  });

  it("expands a deep RECTANGLE corner pair to 8 corners", () => {
    const points = getAnnotationSelectionPoints(
      annotation(RoiKind.Rectangle, [[0, 0, 0], [2, 3, 4]]),
      false,
    );
    expect(points).toHaveLength(8);
  });

  it("rings a flat ELLIPSIS once and a deep one twice", () => {
    const flat = getAnnotationSelectionPoints(
      annotation(RoiKind.Ellipsis, [[0, 0, 1], [4, 2, 1]]),
      false,
    );
    const deep = getAnnotationSelectionPoints(
      annotation(RoiKind.Ellipsis, [[0, 0, 0], [4, 2, 6]]),
      false,
    );
    expect(flat).toHaveLength(24);
    expect(deep).toHaveLength(48);
  });

  it("falls back to raw vectors for POLYGON and friends", () => {
    const vectors = [[0, 0, 0], [1, 0, 0], [1, 1, 0]];
    expect(
      getAnnotationSelectionPoints(annotation(RoiKind.Polygon, vectors), false),
    ).toEqual(vectors);
  });

  it("is empty with no vectors", () => {
    expect(getAnnotationSelectionPoints(annotation(RoiKind.Polygon, []), false)).toEqual([]);
  });
});

describe("getWorldExtent", () => {
  it("bounds the shape under the identity matrix", () => {
    const extent = getWorldExtent(
      annotation(RoiKind.Polygon, [[0, 1, 2], [4, 5, 6], [-1, 0, 3]]),
      new THREE.Matrix4(),
    );
    expect(extent).not.toBeNull();
    expect(extent!.bounds).toEqual({ minX: -1, maxX: 4, minY: 0, maxY: 5 });
    expect(extent!.zSpan).toEqual({ min: 2, max: 6 });
  });

  it("applies scale and translation", () => {
    const matrix = new THREE.Matrix4()
      .makeScale(2, 2, 2)
      .setPosition(10, 20, 30);
    const extent = getWorldExtent(
      annotation(RoiKind.Line, [[0, 0, 0], [1, 1, 1]]),
      matrix,
    );
    expect(extent!.bounds).toEqual({ minX: 10, maxX: 12, minY: 20, maxY: 22 });
    expect(extent!.zSpan).toEqual({ min: 30, max: 32 });
  });

  it("gives a POINT a zero-size extent, not null", () => {
    const extent = getWorldExtent(
      annotation(RoiKind.Point, [[3, 4, 5]]),
      new THREE.Matrix4(),
    );
    expect(extent!.bounds).toEqual({ minX: 3, maxX: 3, minY: 4, maxY: 4 });
    expect(extent!.zSpan).toEqual({ min: 5, max: 5 });
  });

  it("is null with no vectors", () => {
    expect(
      getWorldExtent(annotation(RoiKind.Polygon, []), new THREE.Matrix4()),
    ).toBeNull();
  });
});

describe("worldExtentToBox3", () => {
  it("leaves a non-degenerate box untouched", () => {
    const box = worldExtentToBox3(
      { bounds: { minX: 0, maxX: 10, minY: 0, maxY: 10 }, zSpan: { min: 0, max: 10 } },
      1,
    );
    expect(box.min.toArray()).toEqual([0, 0, 0]);
    expect(box.max.toArray()).toEqual([10, 10, 10]);
  });

  it("pads every axis of a point extent", () => {
    const box = worldExtentToBox3(
      { bounds: { minX: 5, maxX: 5, minY: 5, maxY: 5 }, zSpan: { min: 5, max: 5 } },
      2,
    );
    expect(box.min.toArray()).toEqual([3, 3, 3]);
    expect(box.max.toArray()).toEqual([7, 7, 7]);
  });

  it("pads only z of a flat rectangle, keeping the real footprint", () => {
    const box = worldExtentToBox3(
      { bounds: { minX: 0, maxX: 10, minY: 0, maxY: 8 }, zSpan: { min: 4, max: 4 } },
      1,
    );
    expect(box.min.toArray()).toEqual([0, 0, 3]);
    expect(box.max.toArray()).toEqual([10, 8, 5]);
  });
});
