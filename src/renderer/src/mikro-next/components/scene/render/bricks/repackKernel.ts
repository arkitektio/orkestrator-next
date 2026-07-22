import type { RepackBrickInput } from "../../core/octree/brickRepack";
import type { Vec3 } from "../../core/octree/levelGeometry";

/**
 * The fused GPU brick-repack kernel (compute-shader port of `repackBrick`):
 * chunk→brick gather, border edge-replication, and min/max scan in one pass,
 * writing straight into the r32float brick atlas. This module is the PURE
 * half — the WGSL source and the CPU-side dispatch math — so the parameter
 * packing is unit-testable against `repackBrick` without a GPU;
 * `computeRepack.ts` owns all GPUDevice state.
 *
 * ## Kernel shape: one dispatch per (brick, chunk)
 *
 * Instead of binding all of a brick's chunks at once (descriptor arrays,
 * per-stage storage-buffer limits), each source chunk gets its own dispatch
 * over the FULL stored brick. An invocation owns its output texel iff the
 * texel's clamped source voxel falls inside this chunk's overlap box and its
 * channel inside this chunk's channel range — ownership therefore partitions
 * every output texel across the brick's dispatches exactly once (the fetched
 * chunks tile the fetch box, and channel-chunks tile [0, channelCount)).
 *
 * ## Border replication is a clamp
 *
 * `repackBrick`'s three axis-by-axis replication passes reduce to
 * `output[p] = value_at(clamp(destOrigin + p, fetchBox))` — copying the
 * nearest valid texel per axis is exactly a per-axis clamp of the source
 * position. The kernel clamps, so replication needs no second pass.
 *
 * ## Min/max over atomics
 *
 * WGSL atomics are u32-only; f32 values go through the order-preserving bit
 * trick (negative → ~bits, positive → bits | signbit), reduced per workgroup
 * in shared memory and flushed with one atomicMin/atomicMax pair. NaN never
 * contributes — matching the CPU scan, where `NaN < min` is always false.
 * A min/max slot still holding its init sentinels after readback means no
 * finite... no non-NaN voxel contributed; decode maps that to the CPU's
 * `!Number.isFinite(min)` outcome: `{ min: 0, max: 0, uniformValue: 0 }`.
 */

export const REPACK_WORKGROUP_SIZE = 4;

/** Bytes of one packed `Params` struct (36 words, see PARAM layout below). */
export const REPACK_PARAMS_BYTES = 144;
/** Uniform slices need 256-byte alignment for dynamic offsets. */
export const REPACK_PARAMS_STRIDE = 256;

export const MINMAX_ENTRY_BYTES = 8;
export const MINMAX_INIT_MIN = 0xffffffff;
export const MINMAX_INIT_MAX = 0;

export const REPACK_KERNEL_WGSL = /* wgsl */ `
struct Params {
  dest_origin: vec3<i32>,
  stored_z: u32,
  stored_xy: vec2<u32>,
  channel_count: u32,
  brick_index: u32,
  fetch_min: vec3<i32>,
  chan_start: u32,
  fetch_max: vec3<i32>,
  chan_end: u32,
  lo: vec3<i32>,
  fixed_base: u32,
  hi: vec3<i32>,
  stride_c: u32,
  chunk_origin: vec3<i32>,
  stride_x: u32,
  slot_origin: vec3<u32>,
  stride_y: u32,
  stride_z: u32,
}

@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read_write> minmax: array<atomic<u32>>;
@group(0) @binding(2) var out_atlas: texture_storage_3d<r32float, write>;
@group(1) @binding(0) var<storage, read> chunk_data: array<f32>;

var<workgroup> wg_min: atomic<u32>;
var<workgroup> wg_max: atomic<u32>;

// Order-preserving f32 → u32 map: monotone for all non-NaN values.
fn encode_order(v: f32) -> u32 {
  let b = bitcast<u32>(v);
  return select(b | 0x80000000u, ~b, (b & 0x80000000u) != 0u);
}

@compute @workgroup_size(${REPACK_WORKGROUP_SIZE}, ${REPACK_WORKGROUP_SIZE}, ${REPACK_WORKGROUP_SIZE})
fn main(
  @builtin(global_invocation_id) gid: vec3<u32>,
  @builtin(local_invocation_index) lidx: u32,
) {
  if (lidx == 0u) {
    atomicStore(&wg_min, ${MINMAX_INIT_MIN}u);
    atomicStore(&wg_max, ${MINMAX_INIT_MAX}u);
  }
  workgroupBarrier();

  let sz = P.stored_z;
  var contributes = false;
  var value = 0.0;

  // No early returns before the barriers (uniform control flow); out-of-range
  // and non-owned invocations just skip the work.
  if (gid.x < P.stored_xy.x && gid.y < P.stored_xy.y && gid.z < sz * P.channel_count) {
    let c = gid.z / sz;
    let z = gid.z % sz;
    // Clamp into the fetch box: interior texels are unchanged, border texels
    // land on their nearest valid voxel (edge replication).
    let g = clamp(
      P.dest_origin + vec3<i32>(i32(gid.x), i32(gid.y), i32(z)),
      P.fetch_min,
      P.fetch_max - vec3<i32>(1),
    );
    if (all(g >= P.lo) && all(g < P.hi) && c >= P.chan_start && c < P.chan_end) {
      let local = vec3<u32>(g - P.chunk_origin);
      let src = P.fixed_base
        + (c - P.chan_start) * P.stride_c
        + local.z * P.stride_z
        + local.y * P.stride_y
        + local.x * P.stride_x;
      value = chunk_data[src];
      textureStore(
        out_atlas,
        P.slot_origin + vec3<u32>(gid.x, gid.y, c * sz + z),
        vec4<f32>(value, 0.0, 0.0, 0.0),
      );
      contributes = value == value; // NaN never enters min/max (CPU parity)
    }
  }

  if (contributes) {
    let e = encode_order(value);
    atomicMin(&wg_min, e);
    atomicMax(&wg_max, e);
  }
  workgroupBarrier();

  if (lidx == 0u) {
    // Flushing the untouched sentinels is a global no-op — no branch needed.
    atomicMin(&minmax[P.brick_index * 2u], atomicLoad(&wg_min));
    atomicMax(&minmax[P.brick_index * 2u + 1u], atomicLoad(&wg_max));
  }
}
`;

export type RepackDispatchInput = Omit<RepackBrickInput, "output">;

/** CPU-side mirror of the WGSL `Params` struct for one (brick, chunk) pass. */
export type KernelDispatch = {
  /** Index into `input.chunks` — selects the chunk-data bind group. */
  chunkIndex: number;
  destOrigin: Vec3;
  stored: Vec3;
  channelCount: number;
  brickIndex: number;
  fetchMin: Vec3;
  fetchMax: Vec3;
  chanStart: number;
  chanEnd: number;
  /** Chunk ∩ fetch-box overlap in level voxels ([lo, hi) per axis). */
  lo: Vec3;
  hi: Vec3;
  fixedBase: number;
  strideX: number;
  strideY: number;
  strideZ: number;
  strideC: number;
  chunkOrigin: Vec3;
  slotOrigin: Vec3;
};

/**
 * Build the per-chunk dispatch list for one brick — the same overlap /
 * stride / channel-range derivation as `repackBrick`'s chunk loop, minus the
 * voxel loops (those become the kernel). Non-overlapping chunks are skipped
 * exactly like the CPU `continue`.
 */
export function buildKernelDispatches(
  input: RepackDispatchInput,
  slotOrigin: Vec3,
  brickIndex: number,
): KernelDispatch[] {
  const { spec, level, axes, brickBox, fetchBox, fixedOffsets, chunks } = input;
  const { xPos, yPos, zPos, intensityPos } = axes;
  const channelCount = spec.channelCount;
  const channelsPerChunk =
    intensityPos !== -1 ? Math.max(1, level.chunks[intensityPos] ?? 1) : 1;

  const destOrigin: Vec3 = [
    brickBox.min[0] - spec.border,
    brickBox.min[1] - spec.border,
    brickBox.min[2] - spec.border,
  ];

  const dispatches: KernelDispatch[] = [];
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunk = chunks[chunkIndex];
    const chunkOrigin: Vec3 = [
      chunk.coords[0] * level.spatialChunks[0],
      chunk.coords[1] * level.spatialChunks[1],
      chunk.coords[2] * level.spatialChunks[2],
    ];

    const lo: number[] = [];
    const hi: number[] = [];
    let overlaps = true;
    for (const axis of [0, 1, 2] as const) {
      lo.push(Math.max(fetchBox.min[axis], chunkOrigin[axis]));
      hi.push(
        Math.min(fetchBox.max[axis], chunkOrigin[axis] + level.spatialChunks[axis]),
      );
      if (hi[axis] <= lo[axis]) overlaps = false;
    }
    if (!overlaps) continue;

    const chanStart = chunk.channelChunk * channelsPerChunk;
    const chanEnd = Math.min(channelCount, chanStart + channelsPerChunk);
    if (chanEnd <= chanStart) continue;

    const strideOf = (pos: number) => (pos !== -1 ? chunk.stride[pos] ?? 0 : 0);
    let fixedBase = 0;
    for (let d = 0; d < fixedOffsets.length; d++) {
      if (fixedOffsets[d] !== 0) fixedBase += fixedOffsets[d] * (chunk.stride[d] ?? 0);
    }

    dispatches.push({
      chunkIndex,
      destOrigin,
      stored: [spec.stored[0], spec.stored[1], spec.stored[2]],
      channelCount,
      brickIndex,
      fetchMin: [fetchBox.min[0], fetchBox.min[1], fetchBox.min[2]],
      fetchMax: [fetchBox.max[0], fetchBox.max[1], fetchBox.max[2]],
      chanStart,
      chanEnd,
      lo: [lo[0], lo[1], lo[2]],
      hi: [hi[0], hi[1], hi[2]],
      fixedBase,
      strideX: strideOf(xPos),
      strideY: strideOf(yPos),
      strideZ: strideOf(zPos),
      strideC: strideOf(intensityPos),
      chunkOrigin,
      slotOrigin,
    });
  }
  return dispatches;
}

/** Workgroup counts covering the stored brick (z carries the channel slabs). */
export function dispatchWorkgroups(d: KernelDispatch): Vec3 {
  const wg = REPACK_WORKGROUP_SIZE;
  return [
    Math.ceil(d.stored[0] / wg),
    Math.ceil(d.stored[1] / wg),
    Math.ceil((d.stored[2] * d.channelCount) / wg),
  ];
}

/**
 * Pack one dispatch into its 36-word uniform slice. Word layout mirrors the
 * WGSL `Params` struct field-for-field (vec3 aligned to 16 bytes, the scalar
 * riding in the 4th word); i32 values rely on typed-array modulo-2^32 wrap to
 * store their bit pattern.
 */
export function packKernelParams(d: KernelDispatch, out: Uint32Array, wordOffset: number): void {
  const w = out.subarray(wordOffset, wordOffset + REPACK_PARAMS_BYTES / 4);
  w[0] = d.destOrigin[0];
  w[1] = d.destOrigin[1];
  w[2] = d.destOrigin[2];
  w[3] = d.stored[2];
  w[4] = d.stored[0];
  w[5] = d.stored[1];
  w[6] = d.channelCount;
  w[7] = d.brickIndex;
  w[8] = d.fetchMin[0];
  w[9] = d.fetchMin[1];
  w[10] = d.fetchMin[2];
  w[11] = d.chanStart;
  w[12] = d.fetchMax[0];
  w[13] = d.fetchMax[1];
  w[14] = d.fetchMax[2];
  w[15] = d.chanEnd;
  w[16] = d.lo[0];
  w[17] = d.lo[1];
  w[18] = d.lo[2];
  w[19] = d.fixedBase;
  w[20] = d.hi[0];
  w[21] = d.hi[1];
  w[22] = d.hi[2];
  w[23] = d.strideC;
  w[24] = d.chunkOrigin[0];
  w[25] = d.chunkOrigin[1];
  w[26] = d.chunkOrigin[2];
  w[27] = d.strideX;
  w[28] = d.slotOrigin[0];
  w[29] = d.slotOrigin[1];
  w[30] = d.slotOrigin[2];
  w[31] = d.strideY;
  w[32] = d.strideZ;
  w[33] = 0;
  w[34] = 0;
  w[35] = 0;
}

const orderScratch = new DataView(new ArrayBuffer(4));

/** TS mirror of the kernel's `encode_order` (tests + readback decoding). */
export function encodeOrderedF32(value: number): number {
  orderScratch.setFloat32(0, value, true);
  const bits = orderScratch.getUint32(0, true);
  return (bits & 0x80000000) !== 0 ? ~bits >>> 0 : (bits | 0x80000000) >>> 0;
}

export function decodeOrderedF32(encoded: number): number {
  const bits = (encoded & 0x80000000) !== 0 ? encoded ^ 0x80000000 : ~encoded;
  orderScratch.setUint32(0, bits >>> 0, true);
  return orderScratch.getFloat32(0, true);
}

/**
 * Decode one brick's min/max readback words into a `RepackResult`-shaped
 * outcome. Untouched sentinels (only possible when every voxel was NaN) map
 * to the CPU scan's `!Number.isFinite(min)` result: `{0, 0, uniform 0}` —
 * the brick demotes to an EMPTY page entry showing 0, which is what the CPU
 * path renders for such data too.
 */
export function decodeMinMax(
  minWord: number,
  maxWord: number,
): { min: number; max: number; uniformValue: number | null } {
  if (minWord === MINMAX_INIT_MIN && maxWord === MINMAX_INIT_MAX) {
    return { min: 0, max: 0, uniformValue: 0 };
  }
  const min = decodeOrderedF32(minWord);
  const max = decodeOrderedF32(maxWord);
  return { min, max, uniformValue: min === max ? min : null };
}
