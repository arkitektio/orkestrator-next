import { describe, expect, it } from "vitest";
import { repackBrick, type RepackChunk } from "../../../core/octree/brickRepack";
import type { BrickSpec } from "../../../core/octree/brickSpec";
import { buildLayerLevelGeometry } from "../../../core/octree/levelGeometry";
import { fetchVoxelBox, nodeVoxelBox } from "../../../core/octree/nodeAddress";
import {
  MINMAX_INIT_MAX,
  MINMAX_INIT_MIN,
  buildKernelDispatches,
  decodeMinMax,
  decodeOrderedF32,
  dispatchWorkgroups,
  encodeOrderedF32,
  packKernelParams,
  type KernelDispatch,
  type RepackDispatchInput,
} from "./repackKernel";

/**
 * Parity: a TS simulator executes buildKernelDispatches' output with EXACTLY
 * the kernel's per-invocation algorithm (clamp → ownership → strided read →
 * ordered-u32 min/max) and must reproduce `repackBrick` — output buffer,
 * min/max, and uniform flag. The golden-buffer-tested CPU repack defines
 * truth; this pins the dispatch math the WGSL side consumes. The in-browser
 * self-test covers the WGSL itself.
 */

// Same fixture family as brickRepack.test.ts: dims [c, z, y, x], one
// 12×12×4 level with 2 channels, chunks [1, 4, 8, 8], payload 4³ + border.
const DIMS = ["c", "z", "y", "x"];
const LAYER = { xDim: "x", yDim: "y", zDim: "z", intensityDim: "c" };
const GEO = buildLayerLevelGeometry(DIMS, LAYER, [
  { shape: [2, 4, 12, 12], chunks: [1, 4, 8, 8], dtype: "float32", storeId: "s0" },
])!;
const SPEC: BrickSpec = { payload: [4, 4, 4], border: 1, stored: [6, 6, 6], channelCount: 2 };

const voxelValue = (c: number, z: number, y: number, x: number) =>
  c * 1000 + z * 100 + y * 10 + x;

const makeChunk = (coords: [number, number, number], channelChunk: number): RepackChunk => {
  const [w, h, d] = [8, 8, 4];
  const data = new Float32Array(d * h * w);
  for (let z = 0; z < d; z++)
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const gx = coords[0] * 8 + x;
        const gy = coords[1] * 8 + y;
        const gz = coords[2] * 4 + z;
        data[(z * h + y) * w + x] =
          gx < 12 && gy < 12 ? voxelValue(channelChunk, gz, gy, gx) : -999;
      }
  return {
    coords,
    channelChunk,
    data: data as unknown as RepackChunk["data"],
    shape: [1, 4, 8, 8],
    stride: [256, 64, 8, 1],
  };
};

const makeInput = (brickCoords: [number, number, number]): RepackDispatchInput => {
  const chunks: RepackChunk[] = [];
  for (let channel = 0; channel < 2; channel++)
    for (const cy of [0, 1]) for (const cx of [0, 1]) chunks.push(makeChunk([cx, cy, 0], channel));
  return {
    spec: SPEC,
    level: GEO.levels[0],
    axes: GEO.axes,
    brickBox: nodeVoxelBox(GEO, SPEC, 0, brickCoords),
    fetchBox: fetchVoxelBox(GEO, SPEC, 0, brickCoords),
    fixedOffsets: [0, 0, 0, 0],
    chunks,
  };
};

const clampI = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/**
 * Execute one dispatch exactly as the WGSL kernel does, per invocation.
 * `writes` counts texel coverage so the ownership-partition invariant
 * (every texel written exactly once across a brick's dispatches) is checked.
 */
function simulateDispatch(
  d: KernelDispatch,
  chunkData: Float32Array,
  out: Float32Array,
  writes: Uint8Array,
  minmax: { min: number; max: number },
): void {
  const [sx, sy, sz] = d.stored;
  for (let gz = 0; gz < sz * d.channelCount; gz++) {
    const c = Math.floor(gz / sz);
    const z = gz % sz;
    for (let y = 0; y < sy; y++) {
      for (let x = 0; x < sx; x++) {
        const g = [
          clampI(d.destOrigin[0] + x, d.fetchMin[0], d.fetchMax[0] - 1),
          clampI(d.destOrigin[1] + y, d.fetchMin[1], d.fetchMax[1] - 1),
          clampI(d.destOrigin[2] + z, d.fetchMin[2], d.fetchMax[2] - 1),
        ];
        const owned =
          g[0] >= d.lo[0] && g[0] < d.hi[0] &&
          g[1] >= d.lo[1] && g[1] < d.hi[1] &&
          g[2] >= d.lo[2] && g[2] < d.hi[2] &&
          c >= d.chanStart && c < d.chanEnd;
        if (!owned) continue;
        const src =
          d.fixedBase +
          (c - d.chanStart) * d.strideC +
          (g[2] - d.chunkOrigin[2]) * d.strideZ +
          (g[1] - d.chunkOrigin[1]) * d.strideY +
          (g[0] - d.chunkOrigin[0]) * d.strideX;
        const value = chunkData[src];
        const dest = ((c * sz + z) * sy + y) * sx + x;
        out[dest] = value;
        writes[dest] += 1;
        if (value === value) {
          const encoded = encodeOrderedF32(value);
          if (encoded < minmax.min) minmax.min = encoded;
          if (encoded > minmax.max) minmax.max = encoded;
        }
      }
    }
  }
}

const brickElementCount = (input: RepackDispatchInput) =>
  input.spec.stored[0] * input.spec.stored[1] * input.spec.stored[2] * input.spec.channelCount;

function simulateBrick(input: RepackDispatchInput) {
  const elementCount = brickElementCount(input);
  const out = new Float32Array(elementCount);
  const writes = new Uint8Array(elementCount);
  const minmax = { min: MINMAX_INIT_MIN, max: MINMAX_INIT_MAX };
  const dispatches = buildKernelDispatches(input, [0, 0, 0], 0);
  for (const d of dispatches) {
    simulateDispatch(d, input.chunks[d.chunkIndex].data as Float32Array, out, writes, minmax);
  }
  return { out, writes, dispatches, ...decodeMinMax(minmax.min, minmax.max) };
}

function cpuBrick(input: RepackDispatchInput) {
  const output = new Float32Array(brickElementCount(input));
  const result = repackBrick({ ...input, output });
  return { output, result };
}

describe("buildKernelDispatches parity with repackBrick", () => {
  // Corner (all-low replication), interior (real borders across chunks),
  // volume edge (high-side replication past partial chunks).
  it.each([[[0, 0, 0]], [[1, 1, 0]], [[2, 2, 0]]] as [[number, number, number]][])(
    "brick %j matches the CPU repack voxel-for-voxel",
    (brickCoords) => {
      const input = makeInput(brickCoords);
      const gpu = simulateBrick(input);
      const cpu = cpuBrick(input);

      expect([...gpu.out]).toEqual([...cpu.output]);
      expect(gpu.min).toBe(cpu.result.min);
      expect(gpu.max).toBe(cpu.result.max);
      expect(gpu.uniformValue).toBe(cpu.result.uniformValue);
    },
  );

  it("ownership partitions every output texel across dispatches exactly once", () => {
    const gpu = simulateBrick(makeInput([1, 1, 0]));
    expect(gpu.dispatches.length).toBeGreaterThan(1); // fixture straddles chunks
    expect([...gpu.writes].every((count) => count === 1)).toBe(true);
  });

  it("skips chunks that do not overlap the fetch box (CPU `continue` parity)", () => {
    // Brick [0,0,0]'s fetch box ([0,5) on x/y after clamping) lies entirely
    // inside spatial chunk [0,0] — of the 8 chunks provided, only that one
    // survives per channel.
    const dispatches = buildKernelDispatches(makeInput([0, 0, 0]), [0, 0, 0], 0);
    expect(dispatches.length).toBe(2);
    // Brick [1,1,0] (fetch [3,9) on x/y) straddles all four spatial chunks.
    expect(buildKernelDispatches(makeInput([1, 1, 0]), [0, 0, 0], 0).length).toBe(8);
  });

  it("flags uniform bricks through the min/max readback", () => {
    const input = makeInput([0, 0, 0]);
    for (const chunk of input.chunks) (chunk.data as Float32Array).fill(7);
    const gpu = simulateBrick(input);
    expect(gpu.uniformValue).toBe(7);
  });

  it("ignores NaN in min/max like the CPU scan", () => {
    const input = makeInput([0, 0, 0]);
    (input.chunks[0].data as Float32Array)[0] = Number.NaN;
    const gpu = simulateBrick(input);
    const cpu = cpuBrick(input);
    expect(gpu.min).toBe(cpu.result.min);
    expect(gpu.max).toBe(cpu.result.max);
    // The NaN itself lands in the output on both paths.
    expect(Number.isNaN(gpu.out[0])).toBe(Number.isNaN(cpu.output[0]));
  });

  it("maps untouched min/max sentinels to the CPU's all-NaN outcome", () => {
    expect(decodeMinMax(MINMAX_INIT_MIN, MINMAX_INIT_MAX)).toEqual({
      min: 0,
      max: 0,
      uniformValue: 0,
    });
  });
});

describe("buildKernelDispatches parity — packed & interleaved channel layouts", () => {
  // Packed c-first: one chunk carries ALL channel slabs (scene-15 coarse
  // levels). channelsPerChunk = 3 → slab separation rests entirely on
  // stride[intensityPos], which the channel-per-chunk fixtures never use.
  const packedInput = (): RepackDispatchInput => {
    const geo = buildLayerLevelGeometry(DIMS, LAYER, [
      { shape: [3, 4, 12, 12], chunks: [3, 4, 8, 8], dtype: "float32", storeId: "p0" },
    ])!;
    const spec: BrickSpec = { payload: [4, 4, 4], border: 1, stored: [6, 6, 6], channelCount: 3 };
    const chunks: RepackChunk[] = ([[0, 0], [1, 0], [0, 1], [1, 1]] as const).map(([cx, cy]) => {
      const data = new Float32Array(3 * 4 * 8 * 8);
      for (let c = 0; c < 3; c++)
        for (let z = 0; z < 4; z++)
          for (let y = 0; y < 8; y++)
            for (let x = 0; x < 8; x++) {
              const gx = cx * 8 + x;
              const gy = cy * 8 + y;
              data[((c * 4 + z) * 8 + y) * 8 + x] =
                gx < 12 && gy < 12 ? voxelValue(c, z, gy, gx) : -999;
            }
      return {
        coords: [cx, cy, 0] as [number, number, number],
        channelChunk: 0,
        data: data as unknown as RepackChunk["data"],
        shape: [3, 4, 8, 8],
        stride: [256, 64, 8, 1],
      };
    });
    return {
      spec,
      level: geo.levels[0],
      axes: geo.axes,
      brickBox: nodeVoxelBox(geo, spec, 0, [1, 1, 0]),
      fetchBox: fetchVoxelBox(geo, spec, 0, [1, 1, 0]),
      fixedOffsets: [0, 0, 0, 0],
      chunks,
    };
  };

  // Interleaved c-last: dims [y, x, c] (scene-2 astronaut layout) — no z
  // axis (zPos = -1, strideZ 0) and strideC = 1.
  const interleavedInput = (): RepackDispatchInput => {
    const geo = buildLayerLevelGeometry(
      ["y", "x", "c"],
      { xDim: "x", yDim: "y", zDim: null, intensityDim: "c" },
      [{ shape: [12, 12, 3], chunks: [8, 8, 3], dtype: "float32", storeId: "i0" }],
    )!;
    const spec: BrickSpec = { payload: [4, 4, 1], border: 0, stored: [4, 4, 1], channelCount: 3 };
    const chunks: RepackChunk[] = ([[0, 0], [1, 0], [0, 1], [1, 1]] as const).map(([cx, cy]) => {
      const data = new Float32Array(8 * 8 * 3);
      for (let y = 0; y < 8; y++)
        for (let x = 0; x < 8; x++)
          for (let c = 0; c < 3; c++) {
            const gx = cx * 8 + x;
            const gy = cy * 8 + y;
            data[(y * 8 + x) * 3 + c] = gx < 12 && gy < 12 ? voxelValue(c, 0, gy, gx) : -999;
          }
      return {
        coords: [cx, cy, 0] as [number, number, number],
        channelChunk: 0,
        data: data as unknown as RepackChunk["data"],
        shape: [8, 8, 3],
        stride: [24, 3, 1],
      };
    });
    return {
      spec,
      level: geo.levels[0],
      axes: geo.axes,
      brickBox: nodeVoxelBox(geo, spec, 0, [1, 1, 0]),
      fetchBox: fetchVoxelBox(geo, spec, 0, [1, 1, 0]),
      fixedOffsets: [0, 0, 0],
      chunks,
    };
  };

  it.each([
    ["packed c-first", packedInput],
    ["interleaved c-last", interleavedInput],
  ])("%s matches the CPU repack voxel-for-voxel", (_label, makeIt) => {
    const input = makeIt();
    const gpu = simulateBrick(input);
    const cpu = cpuBrick(input);
    expect([...gpu.out]).toEqual([...cpu.output]);
    expect(gpu.min).toBe(cpu.result.min);
    expect(gpu.max).toBe(cpu.result.max);
    expect(gpu.uniformValue).toBe(cpu.result.uniformValue);
    expect([...gpu.writes].every((count) => count === 1)).toBe(true);
  });
});

describe("ordered f32 encoding", () => {
  it("roundtrips and preserves order across sign, zero, and infinities", () => {
    // All values must be exactly f32-representable (the encode goes through
    // a Float32 view); f64-only denormals like Number.MIN_VALUE round to ±0.
    const values = [
      Number.NEGATIVE_INFINITY, -3.5e8, -1, -1e-38, 0, 1e-38,
      0.5, 1, 65535, 3.5e8, Number.POSITIVE_INFINITY,
    ].map(Math.fround);
    const encoded = values.map(encodeOrderedF32);
    for (const [i, value] of values.entries()) {
      expect(decodeOrderedF32(encoded[i])).toBe(value);
    }
    expect([...encoded].sort((a, b) => a - b)).toEqual(encoded);
  });
});

describe("packKernelParams", () => {
  it("packs the 36-word struct layout, i32 fields as wrapped bit patterns", () => {
    const [d] = buildKernelDispatches(makeInput([0, 0, 0]), [12, 18, 24], 3);
    expect(d.destOrigin).toEqual([-1, -1, -1]); // corner brick: border leaves the volume
    const words = new Uint32Array(40); // deliberately larger: offset write
    packKernelParams(d, words, 4);
    const signed = new Int32Array(words.buffer);
    expect([signed[4], signed[5], signed[6]]).toEqual([-1, -1, -1]); // dest_origin
    expect(words[4 + 3]).toBe(6); // stored_z
    expect([words[4 + 4], words[4 + 5]]).toEqual([6, 6]); // stored_xy
    expect(words[4 + 6]).toBe(2); // channel_count
    expect(words[4 + 7]).toBe(3); // brick_index
    expect([words[4 + 28], words[4 + 29], words[4 + 30]]).toEqual([12, 18, 24]); // slot_origin
    expect(words[0]).toBe(0); // untouched before the offset
  });

  it("covers the stored brick with 4³ workgroups (channel slabs on z)", () => {
    const [d] = buildKernelDispatches(makeInput([0, 0, 0]), [0, 0, 0], 0);
    expect(dispatchWorkgroups(d)).toEqual([2, 2, 3]); // ceil(6/4), ceil(6/4), ceil(12/4)
  });
});
