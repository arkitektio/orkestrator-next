import { describe, expect, it } from "vitest";
import { extractAxisSlab } from "./slab";

// A [2, 3, 4] C-order array with value = z*100 + y*10 + x.
const makeVolume = () => {
  const data = new Float32Array(2 * 3 * 4);
  let i = 0;
  for (let z = 0; z < 2; z++)
    for (let y = 0; y < 3; y++)
      for (let x = 0; x < 4; x++) data[i++] = z * 100 + y * 10 + x;
  return data;
};

describe("extractAxisSlab", () => {
  const shape = [2, 3, 4];

  it("extracts a leading-axis slab (contiguous)", () => {
    const slab = extractAxisSlab(makeVolume(), shape, 0, 1);
    expect(slab).toHaveLength(12);
    expect(Array.from(slab.slice(0, 4))).toEqual([100, 101, 102, 103]);
    expect(slab[11]).toBe(123); // z=1, y=2, x=3
  });

  it("extracts a middle-axis slab (strided)", () => {
    const slab = extractAxisSlab(makeVolume(), shape, 1, 2);
    // Expect all elements with y=2, order (z, x).
    expect(Array.from(slab)).toEqual([20, 21, 22, 23, 120, 121, 122, 123]);
  });

  it("extracts a trailing-axis slab", () => {
    const slab = extractAxisSlab(makeVolume(), shape, 2, 1);
    expect(Array.from(slab)).toEqual([1, 11, 21, 101, 111, 121]);
  });

  it("clamps out-of-range indices", () => {
    const slab = extractAxisSlab(makeVolume(), shape, 0, 99);
    expect(slab[0]).toBe(100); // clamped to the last z
  });

  it("returns the input unchanged when the axis extent is 1", () => {
    const data = makeVolume();
    expect(extractAxisSlab(data, [1, 6, 4], 0, 0)).toBe(data);
  });

  it("preserves the typed-array kind", () => {
    const bytes = new Uint8Array([0, 1, 2, 3]);
    const slab = extractAxisSlab(bytes, [2, 2], 0, 1);
    expect(slab).toBeInstanceOf(Uint8Array);
    expect(Array.from(slab)).toEqual([2, 3]);
  });
});
