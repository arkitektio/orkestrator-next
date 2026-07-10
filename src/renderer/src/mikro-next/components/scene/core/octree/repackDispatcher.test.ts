import { describe, expect, it } from "vitest";
import type { BrickSpec } from "./brickSpec";
import { repackBrick, type RepackChunk } from "./brickRepack";
import { buildLayerLevelGeometry } from "./levelGeometry";
import { fetchVoxelBox, nodeVoxelBox } from "./nodeAddress";
import { createRepackDispatcher, createSyncRepackDispatcher } from "./repackDispatcher";

/**
 * The dispatcher must be a pure transport around `repackBrick` — same buffer,
 * same min/max/uniform result. Fixture mirrors `brickRepack.test.ts` (12×12×4
 * level, 2 channels, brick payload 4³ + border).
 */
const DIMS = ["c", "z", "y", "x"];
const LAYER = { xDim: "x", yDim: "y", zDim: "z", intensityDim: "c" };
const GEO = buildLayerLevelGeometry(DIMS, LAYER, [
  { shape: [2, 4, 12, 12], chunks: [1, 4, 8, 8], dtype: "uint8", storeId: "s0" },
])!;
const SPEC: BrickSpec = { payload: [4, 4, 4], border: 1, stored: [6, 6, 6], channelCount: 2 };

const makeChunk = (coords: [number, number, number], channelChunk: number): RepackChunk => {
  const [w, h, d] = [8, 8, 4];
  const data = new Float32Array(d * h * w);
  for (let z = 0; z < d; z++)
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const gx = coords[0] * 8 + x;
        const gy = coords[1] * 8 + y;
        data[(z * h + y) * w + x] =
          gx < 12 && gy < 12 ? channelChunk * 1000 + z * 100 + gy * 10 + gx : -999;
      }
  return { coords, channelChunk, data, shape: [1, 4, 8, 8], stride: [256, 64, 8, 1] };
};

const buildJob = (brickCoords: [number, number, number]) => {
  const chunks: RepackChunk[] = [];
  for (let channel = 0; channel < 2; channel++)
    for (const cy of [0, 1]) for (const cx of [0, 1]) chunks.push(makeChunk([cx, cy, 0], channel));
  return {
    kind: "r32f" as const,
    elementCount: 6 * 6 * 6 * 2,
    input: {
      spec: SPEC,
      level: GEO.levels[0],
      axes: GEO.axes,
      brickBox: nodeVoxelBox(GEO, SPEC, 0, brickCoords),
      fetchBox: fetchVoxelBox(GEO, SPEC, 0, brickCoords),
      fixedOffsets: [0, 0, 0, 0],
      chunks,
    },
  };
};

describe("repackDispatcher (sync impl)", () => {
  it("produces the identical buffer and result as a direct repackBrick call", async () => {
    const job = buildJob([1, 1, 0]);
    const dispatched = await createSyncRepackDispatcher().repack(job);

    const reference = new Float32Array(job.elementCount);
    const referenceResult = repackBrick({ ...job.input, output: reference });

    expect(dispatched.min).toBe(referenceResult.min);
    expect(dispatched.max).toBe(referenceResult.max);
    expect(dispatched.uniformValue).toBe(referenceResult.uniformValue);
    expect(Array.from(dispatched.data)).toEqual(Array.from(reference));
  });

  it("allocates the requested output kind", async () => {
    const job = { ...buildJob([0, 0, 0]), kind: "r8" as const };
    const outcome = await createSyncRepackDispatcher().repack(job);
    expect(outcome.data).toBeInstanceOf(Uint8Array);
  });
});

describe("createRepackDispatcher", () => {
  it("falls back to the sync impl when Worker is unavailable (node/vitest)", async () => {
    // vitest's node environment has no global Worker — the factory must still
    // return a working dispatcher.
    expect(typeof Worker).toBe("undefined");
    const dispatcher = createRepackDispatcher();
    const outcome = await dispatcher.repack(buildJob([0, 0, 0]));
    expect(outcome.data.length).toBe(6 * 6 * 6 * 2);
    dispatcher.dispose();
  });
});
