// @vitest-environment jsdom
// (the AnnotationKind enum import pulls in modules that touch `window`)
import { describe, expect, it } from "vitest";
import { AnnotationKind, type SceneAnnotationFragment } from "@/mikro-next/api/graphql";
import {
  ELLIPSE_SEGMENTS,
  buildOutlineBatches,
  outlinePoints,
  roiForSegment,
} from "./annotationBatch";
import { getVectorPoint } from "./annotationBounds";
import { DEFAULT_STROKE, ACTIVE_STROKE } from "./annotationStyle";
import * as THREE from "three";

/**
 * `outlinePoints` must stay in lockstep with `AnnotationShape`'s
 * Line-producing branches — same points, same open/closed decisions — or the
 * batched view draws different geometry than the per-shape view it replaces.
 */

const annotation = (
  kind: AnnotationKind | string,
  vectors: number[][],
  extra: Partial<SceneAnnotationFragment> = {},
): SceneAnnotationFragment =>
  ({
    id: extra.id ?? "a1",
    kind,
    vectors,
    coordinates: [],
    ...extra,
  }) as unknown as SceneAnnotationFragment;

describe("outlinePoints", () => {
  it("points, painted surfaces and 3D-extruded boxes/spheres draw no fat line", () => {
    expect(outlinePoints(annotation(AnnotationKind.Point, [[1, 2, 3]]), false, null)).toBeNull();
    // A SURFACE's vectors are mesh vertices — a polyline through them is noise.
    expect(
      outlinePoints(
        annotation(AnnotationKind.Surface, [[0, 0, 0], [1, 0, 0], [0, 1, 0]]),
        false,
        null,
      ),
    ).toBeNull();
    // Corners spanning depth in 3D → wireframe box branch, not a Line.
    expect(
      outlinePoints(annotation(AnnotationKind.Rectangle, [[0, 0, 0], [4, 4, 4]]), false, null),
    ).toBeNull();
    expect(
      outlinePoints(annotation(AnnotationKind.Ellipse, [[0, 0, 0], [4, 4, 4]]), false, null),
    ).toBeNull();
  });

  it("a flattened rectangle closes its corner loop at the drawing z", () => {
    const points = outlinePoints(
      annotation(AnnotationKind.Rectangle, [[0, 0, 5], [4, 2, 5]]),
      true,
      null,
    )!;
    const z = getVectorPoint([0, 0, 5], true)[2]; // the flat view's render z
    expect(points).toEqual([
      [0, 0, z],
      [4, 0, z],
      [4, 2, z],
      [0, 2, z],
      [0, 0, z],
    ]);
  });

  it("a polygon closes; a path stays open", () => {
    const vectors = [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
    ];
    const polygon = outlinePoints(annotation(AnnotationKind.Polygon, vectors), false, null)!;
    const path = outlinePoints(annotation(AnnotationKind.Path, vectors), false, null)!;
    expect(polygon).toHaveLength(4);
    expect(polygon[3]).toEqual(polygon[0]);
    expect(path).toHaveLength(3);
  });

  it("a flattened ellipse rings with a closing point", () => {
    const points = outlinePoints(
      annotation(AnnotationKind.Ellipse, [[0, 0, 0], [4, 2, 0]]),
      true,
      null,
    )!;
    expect(points).toHaveLength(ELLIPSE_SEGMENTS + 1);
    expect(points[ELLIPSE_SEGMENTS]).toEqual(points[0]);
  });
});

describe("buildOutlineBatches", () => {
  const roiOf = (id: string) => ({ id });

  it("groups by stroke width, lays segments contiguously, and colors selection", () => {
    const entries = [
      {
        annotation: annotation(AnnotationKind.Line, [[0, 0, 0], [1, 0, 0], [2, 0, 0]], {
          id: "thin",
        }),
        roi: roiOf("thin"),
      },
      {
        annotation: annotation(AnnotationKind.Line, [[0, 1, 0], [1, 1, 0]], {
          id: "thick",
          strokeWidth: 3,
        } as Partial<SceneAnnotationFragment>),
        roi: roiOf("thick"),
      },
      {
        annotation: annotation(AnnotationKind.Line, [[0, 2, 0], [1, 2, 0]], { id: "selected" }),
        roi: roiOf("selected"),
      },
    ];
    const batches = buildOutlineBatches(entries, false, null, (id) => id === "selected");
    expect(batches).toHaveLength(2);

    const thin = batches.find((batch) => batch.lineWidth === 1.5)!;
    const thick = batches.find((batch) => batch.lineWidth === 3)!;
    // 2 segments from "thin" + 1 from "selected"; positions are 6 floats/segment.
    expect(thin.segmentCount).toBe(3);
    expect(thin.positions).toHaveLength(18);
    expect(thin.colors).toHaveLength(18);
    expect(thin.ranges).toEqual([
      { start: 0, end: 2, roi: entries[0].roi },
      { start: 2, end: 3, roi: entries[2].roi },
    ]);
    expect(thick.segmentCount).toBe(1);

    // Selection paints the highlight color; unselected keep the default.
    const active = new THREE.Color(ACTIVE_STROKE);
    const idle = new THREE.Color(DEFAULT_STROKE);
    expect(thin.colors[0]).toBeCloseTo(idle.r);
    expect(thin.colors[2 * 6]).toBeCloseTo(active.r);
    expect(thin.colors[2 * 6 + 1]).toBeCloseTo(active.g);
  });

  it("skips shapes without a fat line (points, 3D boxes)", () => {
    const batches = buildOutlineBatches(
      [
        { annotation: annotation(AnnotationKind.Point, [[0, 0, 0]]), roi: roiOf("p") },
        {
          annotation: annotation(AnnotationKind.Rectangle, [[0, 0, 0], [4, 4, 4]]),
          roi: roiOf("box"),
        },
      ],
      false,
      null,
      () => false,
    );
    expect(batches).toHaveLength(0);
  });
});

describe("roiForSegment", () => {
  it("binary-searches the sorted ranges", () => {
    const ranges = [
      { start: 0, end: 2, roi: "a" },
      { start: 2, end: 3, roi: "b" },
      { start: 3, end: 7, roi: "c" },
    ];
    expect(roiForSegment(ranges, 0)).toBe("a");
    expect(roiForSegment(ranges, 1)).toBe("a");
    expect(roiForSegment(ranges, 2)).toBe("b");
    expect(roiForSegment(ranges, 6)).toBe("c");
    expect(roiForSegment(ranges, 7)).toBeNull();
    expect(roiForSegment(ranges, undefined)).toBeNull();
    expect(roiForSegment([], 0)).toBeNull();
  });
});
