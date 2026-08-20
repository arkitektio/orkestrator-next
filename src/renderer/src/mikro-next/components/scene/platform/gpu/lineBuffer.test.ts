import { describe, expect, it } from "vitest";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import {
  FLOATS_PER_SEGMENT,
  pairBufferLength,
  segmentCountFor,
  writeLineDistances,
  writePolylinePairs,
} from "./lineBuffer";

/**
 * The invariant: our in-place writers must produce EXACTLY what three's own
 * `setPositions` / `computeLineDistances` produce. If three ever changes the
 * interleaved pair layout, the fast path in `platform/draw/PreviewLine.tsx`
 * would write garbage into a live buffer — so the first test below compares
 * against a real `LineGeometry` rather than against hand-written expectations.
 *
 * (`LineGeometry` imports only core three, so it loads in the node environment.
 * Its `webgpu/LineSegments2` sibling pulls `three/webgpu` and does not, which is
 * why the distances are checked against hand-computed values instead.)
 */

const flatten = (points: readonly (readonly [number, number, number])[]) =>
  points.flatMap((point) => [point[0], point[1], point[2]]);

describe("segmentCountFor / pairBufferLength", () => {
  it("treats a polyline of N points as N-1 segments", () => {
    expect(segmentCountFor(0)).toBe(0);
    expect(segmentCountFor(1)).toBe(0);
    expect(segmentCountFor(2)).toBe(1);
    expect(segmentCountFor(49)).toBe(48);
  });

  it("sizes the pair buffer at six floats per segment", () => {
    expect(pairBufferLength(5)).toBe(4 * FLOATS_PER_SEGMENT);
  });
});

describe("writePolylinePairs", () => {
  it("reproduces three's interleaved pair layout byte for byte", () => {
    const points: [number, number, number][] = [
      [0, 0, 0],
      [10, 5, 0],
      [10, 25, 0],
      [-3, 25, 0],
    ];

    const geometry = new LineGeometry();
    geometry.setPositions(flatten(points));
    const expected = geometry.attributes.instanceStart.data.array;

    const target = new Float32Array(pairBufferLength(points.length));
    expect(writePolylinePairs(target, points)).toBe(3);
    expect(Array.from(target)).toEqual(Array.from(expected));
  });

  it("writes every interior vertex twice — that duplication is the layout", () => {
    const target = new Float32Array(pairBufferLength(3));
    writePolylinePairs(target, [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);

    // segment 0 = (P0, P1), segment 1 = (P1, P2)
    expect(Array.from(target)).toEqual([1, 2, 3, 4, 5, 6, 4, 5, 6, 7, 8, 9]);
  });

  it("reports -1 when the buffer is too small, so the caller reallocates", () => {
    const target = new Float32Array(FLOATS_PER_SEGMENT); // room for 1 segment
    expect(
      writePolylinePairs(target, [
        [0, 0, 0],
        [1, 0, 0],
        [2, 0, 0],
      ]),
    ).toBe(-1);
  });

  it("writes nothing below two points", () => {
    const target = new Float32Array(FLOATS_PER_SEGMENT);
    expect(writePolylinePairs(target, [[1, 1, 1]])).toBe(0);
    expect(Array.from(target)).toEqual([0, 0, 0, 0, 0, 0]);
  });

  it("has room for an ellipse outline at the default segment count", () => {
    // 49 points (48 segments + the closing repeat) — the count PreviewLine
    // preallocates against.
    const points: [number, number, number][] = Array.from(
      { length: 49 },
      (_, index) => [index, index * 2, 0],
    );
    const target = new Float32Array(pairBufferLength(points.length));
    expect(writePolylinePairs(target, points)).toBe(48);
  });
});

describe("writeLineDistances", () => {
  it("accumulates arc length across segments", () => {
    // 3-4-5 right triangle: (0,0)→(3,0) is 3, (3,0)→(3,4) is 4.
    const points: [number, number, number][] = [
      [0, 0, 0],
      [3, 0, 0],
      [3, 4, 0],
    ];
    const pairs = new Float32Array(pairBufferLength(points.length));
    const segments = writePolylinePairs(pairs, points);

    const distances = new Float32Array(segments * 2);
    writeLineDistances(distances, pairs, segments);

    expect(Array.from(distances)).toEqual([0, 3, 3, 7]);
  });

  it("makes d1 of one segment the d0 of the next, so dashes cross corners cleanly", () => {
    const points: [number, number, number][] = [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ];
    const pairs = new Float32Array(pairBufferLength(points.length));
    const segments = writePolylinePairs(pairs, points);
    const distances = new Float32Array(segments * 2);
    writeLineDistances(distances, pairs, segments);

    expect(distances[0]).toBe(0);
    for (let index = 1; index < segments; index += 1) {
      expect(distances[index * 2]).toBeCloseTo(distances[index * 2 - 1]);
    }
  });

  it("counts depth, not just the xy projection", () => {
    const points: [number, number, number][] = [
      [0, 0, 0],
      [0, 0, 5],
    ];
    const pairs = new Float32Array(pairBufferLength(points.length));
    const segments = writePolylinePairs(pairs, points);
    const distances = new Float32Array(segments * 2);
    writeLineDistances(distances, pairs, segments);

    expect(distances[1]).toBeCloseTo(5);
  });
});
