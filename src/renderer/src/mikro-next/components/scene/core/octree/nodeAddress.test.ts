import { describe, expect, it } from "vitest";
import type { BrickSpec } from "./brickSpec";
import { buildLayerLevelGeometry } from "./levelGeometry";
import {
  brickGridForLevel,
  childrenOf,
  chunksTouchingBrick,
  fetchVoxelBox,
  nodeBaseBox,
  nodeKey,
  nodeVoxelBox,
  parseNodeKey,
  totalBrickCount,
} from "./nodeAddress";

const DIMS = ["c", "z", "y", "x"];
const LAYER = { xDim: "x", yDim: "y", zDim: "z", intensityDim: "c" };

/** 600×500×40 with x/y-only downsampling — quadtree along z. */
const GEO = buildLayerLevelGeometry(DIMS, LAYER, [
  { shape: [3, 40, 500, 600], chunks: [1, 16, 128, 128], dtype: "uint8", storeId: "s0" },
  { shape: [3, 40, 250, 300], chunks: [1, 16, 128, 128], dtype: "uint8", storeId: "s1", scaleFactors: [1, 1, 2, 2] },
])!;

const SPEC: BrickSpec = {
  payload: [64, 64, 40],
  border: 1,
  stored: [66, 66, 42],
  channelCount: 3,
};

describe("node keys", () => {
  it("round-trips", () => {
    const key = nodeKey(2, [4, 5, 6]);
    expect(key).toBe("2:4:5:6");
    expect(parseNodeKey(key)).toEqual({ level: 2, coords: [4, 5, 6] });
  });
});

describe("node boxes", () => {
  it("computes the level brick grid", () => {
    expect(brickGridForLevel(GEO, SPEC, 0)).toEqual([10, 8, 1]);
    expect(brickGridForLevel(GEO, SPEC, 1)).toEqual([5, 4, 1]);
  });

  it("clamps partial edge bricks to the level shape", () => {
    const box = nodeVoxelBox(GEO, SPEC, 0, [9, 7, 0]);
    expect(box.min).toEqual([576, 448, 0]);
    expect(box.max).toEqual([600, 500, 40]);
  });

  it("expands the fetch box by the border, clamped at volume edges", () => {
    const inner = fetchVoxelBox(GEO, SPEC, 0, [1, 1, 0]);
    expect(inner.min).toEqual([63, 63, 0]);
    expect(inner.max).toEqual([129, 129, 40]);

    const corner = fetchVoxelBox(GEO, SPEC, 0, [0, 0, 0]);
    expect(corner.min).toEqual([0, 0, 0]);
    expect(corner.max).toEqual([65, 65, 40]);
  });

  it("scales the payload box into base voxel space per axis", () => {
    const box = nodeBaseBox(GEO, SPEC, 1, [1, 0, 0]);
    expect(box.min).toEqual([128, 0, 0]);
    expect(box.max).toEqual([256, 128, 40]);
  });
});

describe("childrenOf", () => {
  it("yields the 4 finer bricks of a [2,2,1]-ratio pyramid (quadtree in z)", () => {
    expect(childrenOf(GEO, SPEC, 1, [0, 0, 0])).toEqual([
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
    ]);
  });

  it("clamps children to the finer grid at the volume edge", () => {
    // Level-1 brick [4,3,0] covers base x [512,600), y [384,500) — its child
    // window is cut off by the 10×8 level-0 grid.
    expect(childrenOf(GEO, SPEC, 1, [4, 3, 0])).toEqual([
      [8, 6, 0],
      [9, 6, 0],
      [8, 7, 0],
      [9, 7, 0],
    ]);
  });

  it("returns nothing at the finest level", () => {
    expect(childrenOf(GEO, SPEC, 0, [0, 0, 0])).toEqual([]);
  });
});

describe("totalBrickCount", () => {
  it("sums every level's grid — the atlas slot ceiling for small datasets", () => {
    // L0: 10×8×1 = 80, L1: 5×4×1 = 20.
    expect(totalBrickCount(GEO, SPEC)).toBe(100);
  });
});

describe("chunksTouchingBrick", () => {
  it("covers the border-expanded box across misaligned chunk grids", () => {
    // Fetch box x/y [63,129) over 128-chunks → chunk 0 and 1 on both axes;
    // z [0,40) over 16-chunks → chunks 0..2.
    const coords = chunksTouchingBrick(GEO, SPEC, 0, [1, 1, 0]);
    expect(coords).toHaveLength(2 * 2 * 3);
    expect(coords[0]).toEqual([0, 0, 0]);
    expect(coords.at(-1)).toEqual([1, 1, 2]);
  });

  it("needs a single chunk column when the brick sits inside one chunk", () => {
    const coords = chunksTouchingBrick(GEO, SPEC, 0, [0, 0, 0]);
    // x/y [0,65) fit in chunk 0; z spans 3 chunks.
    expect(coords).toEqual([
      [0, 0, 0],
      [0, 0, 1],
      [0, 0, 2],
    ]);
  });
});
