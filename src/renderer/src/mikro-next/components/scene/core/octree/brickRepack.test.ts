import { describe, expect, it } from "vitest";
import type { BrickSpec } from "./brickSpec";
import { repackBrick, type RepackChunk } from "./brickRepack";
import { buildLayerLevelGeometry } from "./levelGeometry";
import { fetchVoxelBox, nodeVoxelBox } from "./nodeAddress";

/**
 * Fixture: dims [c, z, y, x], one 12×12×4 level with 2 channels, zarr chunks
 * [1, 4, 8, 8] (channel chunks of 1 → one RepackChunk per channel), brick
 * payload 4³ with a 1-voxel border.
 */
const DIMS = ["c", "z", "y", "x"];
const LAYER = { xDim: "x", yDim: "y", zDim: "z", intensityDim: "c" };
const GEO = buildLayerLevelGeometry(DIMS, LAYER, [
  { shape: [2, 4, 12, 12], chunks: [1, 4, 8, 8], dtype: "uint8", storeId: "s0" },
])!;
const SPEC: BrickSpec = { payload: [4, 4, 4], border: 1, stored: [6, 6, 6], channelCount: 2 };

/** value = c*1000 + z*100 + y*10 + x (global voxel coords) — easy to assert. */
const voxelValue = (c: number, z: number, y: number, x: number) =>
  c * 1000 + z * 100 + y * 10 + x;

const makeChunk = (coords: [number, number, number], channelChunk: number): RepackChunk => {
  const [w, h, d] = [8, 8, 4]; // x, y, z extents of one chunk
  const data = new Float32Array(d * h * w);
  for (let z = 0; z < d; z++)
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const gx = coords[0] * 8 + x;
        const gy = coords[1] * 8 + y;
        const gz = coords[2] * 4 + z;
        // Edge chunks carry garbage outside the array — mark it distinctly.
        data[(z * h + y) * w + x] =
          gx < 12 && gy < 12 ? voxelValue(channelChunk, gz, gy, gx) : -999;
      }
  // dims [c, z, y, x] → chunk shape [1, 4, 8, 8], strides [256, 64, 8, 1]
  return {
    coords,
    channelChunk,
    data: data as unknown as RepackChunk["data"],
    shape: [1, 4, 8, 8],
    stride: [256, 64, 8, 1],
  };
};

const repack = (brickCoords: [number, number, number]) => {
  const level = GEO.levels[0];
  const brickBox = nodeVoxelBox(GEO, SPEC, 0, brickCoords);
  const fetchBox = fetchVoxelBox(GEO, SPEC, 0, brickCoords);
  const output = new Float32Array(6 * 6 * 6 * 2);
  const chunks: RepackChunk[] = [];
  for (let channel = 0; channel < 2; channel++)
    for (const cz of [0])
      for (const cy of [0, 1])
        for (const cx of [0, 1]) chunks.push(makeChunk([cx, cy, cz], channel));
  const result = repackBrick({
    spec: SPEC,
    level,
    axes: GEO.axes,
    brickBox,
    fetchBox,
    fixedOffsets: [0, 0, 0, 0],
    chunks,
    output,
  });
  const at = (c: number, z: number, y: number, x: number) =>
    output[((c * 6 + z) * 6 + y) * 6 + x];
  return { output, result, at };
};

describe("repackBrick", () => {
  it("copies the payload with real neighbor data in the borders", () => {
    const { at } = repack([1, 1, 0]);
    // Brick [1,1,0]: payload x,y ∈ [4,8), z ∈ [0,4). Payload voxel (4,4,0) → dest (1+0,…).
    expect(at(0, 1, 1, 1)).toBe(voxelValue(0, 0, 4, 4));
    // Border voxel at dest x=0 is real neighbor data (x=3), crossing chunk 0→0.
    expect(at(0, 1, 1, 0)).toBe(voxelValue(0, 0, 4, 3));
    // Border crossing the chunk boundary at x=8 (chunk 1).
    expect(at(0, 1, 1, 5)).toBe(voxelValue(0, 0, 4, 8));
    // Second channel slab holds channel-1 data.
    expect(at(1, 1, 1, 1)).toBe(voxelValue(1, 0, 4, 4));
  });

  it("replicates edges where the border leaves the volume", () => {
    const { at } = repack([0, 0, 0]);
    // Low corner: border voxels replicate the first real voxel.
    expect(at(0, 1, 1, 0)).toBe(at(0, 1, 1, 1));
    expect(at(0, 1, 0, 1)).toBe(at(0, 1, 1, 1));
    expect(at(0, 0, 1, 1)).toBe(at(0, 1, 1, 1));
    expect(at(0, 0, 0, 0)).toBe(at(0, 1, 1, 1));
  });

  it("replicates past partial edge bricks (12 % 4 = 0, use y-edge at 8..12)", () => {
    // Brick [2,2,0]: payload x,y ∈ [8,12) — the high borders (x=12, y=12) are
    // outside the volume and must replicate, never read the -999 padding.
    const { at, output } = repack([2, 2, 0]);
    expect(at(0, 1, 1, 5)).toBe(at(0, 1, 1, 4));
    expect(at(0, 1, 5, 1)).toBe(at(0, 1, 4, 1));
    expect([...output].includes(-999)).toBe(false);
  });

  it("flags uniform bricks", () => {
    const level = GEO.levels[0];
    const output = new Float32Array(6 * 6 * 6 * 2);
    const flat = makeChunk([0, 0, 0], 0);
    (flat.data as Float32Array).fill(7);
    const flat2 = { ...makeChunk([0, 0, 0], 1) };
    (flat2.data as Float32Array).fill(7);
    const result = repackBrick({
      spec: { ...SPEC, payload: [4, 4, 4] },
      level,
      axes: GEO.axes,
      brickBox: { min: [0, 0, 0], max: [4, 4, 4] },
      fetchBox: { min: [0, 0, 0], max: [5, 5, 4] },
      fixedOffsets: [0, 0, 0, 0],
      chunks: [flat, flat2],
      output,
    });
    expect(result.uniformValue).toBe(7);
  });

  it("returns a zeroed brick when no chunk overlaps", () => {
    const level = GEO.levels[0];
    const output = new Float32Array(6 * 6 * 6 * 2).fill(5);
    const result = repackBrick({
      spec: SPEC,
      level,
      axes: GEO.axes,
      brickBox: { min: [0, 0, 0], max: [4, 4, 4] },
      fetchBox: { min: [0, 0, 0], max: [5, 5, 4] },
      fixedOffsets: [0, 0, 0, 0],
      chunks: [],
      output,
    });
    expect(result.uniformValue).toBe(0);
    expect(output.every((v) => v === 0)).toBe(true);
  });
});
