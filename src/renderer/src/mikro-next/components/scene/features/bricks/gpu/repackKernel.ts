import type { RepackBrickInput } from "../octree/brickRepack";
import type { Vec3 } from "../../../platform/coords/levelGeometry";

/**
 * The fused GPU brick-repack kernel (compute-shader port of `repackBrick`):
 * chunk→brick gather, border edge-replication, and min/max scan in one pass.
 * Two variants share the Params struct and all clamp/ownership math:
 * - **f32** writes straight into the r32float brick atlas (storage texture);
 * - **r8** packs uint8 texels 4-per-u32 into a storage BUFFER arena
 *   (`r8unorm` is not a core storage-texture format), which the device half
 *   then `copyBufferToTexture`s into the r8unorm atlas — rows padded to the
 *   256-byte `bytesPerRow` alignment, addressed via `out_base_word` /
 *   `row_words` (see `r8JobLayout`).
 * This module is the PURE half — the WGSL source and the CPU-side dispatch
 * math — so the parameter packing is unit-testable against `repackBrick`
 * without a GPU; `computeRepack.ts` owns all GPUDevice state.
 *
 * ## Kernel shape: one dispatch per (brick, chunk)
 *
 * Instead of binding all of a brick's chunks at once (descriptor arrays,
 * per-stage storage-buffer limits), each source chunk gets its own dispatch.
 * An invocation owns its output texel iff the texel's clamped source voxel
 * falls inside this chunk's overlap box and its channel inside this chunk's
 * channel range — ownership therefore partitions every output texel across the
 * brick's dispatches exactly once (the fetched chunks tile the fetch box, and
 * channel-chunks tile [0, channelCount)).
 *
 * The grid covers the OWNED sub-box, not the whole stored brick: see
 * `ownedGridBox` for why that set is a box and how its bounds are derived. The
 * per-invocation ownership test remains, both for the workgroup-rounding tail
 * and so that correctness never rests on the grid arithmetic alone.
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

/** Bytes of one packed `Params` struct (40 words, see PARAM layout below). */
export const REPACK_PARAMS_BYTES = 160;
/** Uniform slices need 256-byte alignment for dynamic offsets. */
export const REPACK_PARAMS_STRIDE = 256;

export const MINMAX_ENTRY_BYTES = 8;
export const MINMAX_INIT_MIN = 0xffffffff;
export const MINMAX_INIT_MAX = 0;

/** Shared by both kernel variants; the r8-only addressing scalars ride in
 * what used to be tail padding. `grid_origin`/`z_span` place the dispatch grid
 * on the OWNED sub-box (see `ownedGridBox`) — word 35 is the vec3 alignment
 * pad, so the struct is 160 bytes. */
const PARAMS_STRUCT_WGSL = /* wgsl */ `
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
  out_base_word: u32,
  row_words: u32,
  // Origin of the dispatch grid inside the stored brick, and the number of z
  // texels this chunk owns. gid is relative to these, so the grid covers only
  // the box this dispatch can actually write.
  grid_origin: vec3<u32>,
  z_span: u32,
}
`;

export const REPACK_KERNEL_WGSL = /* wgsl */ `
${PARAMS_STRUCT_WGSL}
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
  // gid is relative to the OWNED sub-box: the grid covers only the texels this
  // dispatch can write, instead of the whole stored brick once per chunk. The
  // guards below still matter for the workgroup-rounding tail.
  let span = max(1u, P.z_span);
  let px = P.grid_origin.x + gid.x;
  let py = P.grid_origin.y + gid.y;
  let c = P.chan_start + gid.z / span;
  let z = P.grid_origin.z + gid.z % span;
  if (px < P.stored_xy.x && py < P.stored_xy.y && z < sz && c < P.chan_end) {
    // Clamp into the fetch box: interior texels are unchanged, border texels
    // land on their nearest valid voxel (edge replication).
    let g = clamp(
      P.dest_origin + vec3<i32>(i32(px), i32(py), i32(z)),
      P.fetch_min,
      P.fetch_max - vec3<i32>(1),
    );
    if (all(g >= P.lo) && all(g < P.hi) && c >= P.chan_start) {
      let local = vec3<u32>(g - P.chunk_origin);
      let src = P.fixed_base
        + (c - P.chan_start) * P.stride_c
        + local.z * P.stride_z
        + local.y * P.stride_y
        + local.x * P.stride_x;
      value = chunk_data[src];
      textureStore(
        out_atlas,
        P.slot_origin + vec3<u32>(px, py, c * sz + z),
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

export const REPACK_KERNEL_R8_WGSL = /* wgsl */ `
${PARAMS_STRUCT_WGSL}
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read_write> minmax: array<atomic<u32>>;
// Output rides in a zero-cleared u32 arena, 4 uint8 texels per word, rows
// padded to P.row_words. atomicOr makes the multi-dispatch-per-brick
// partitioning race-free by construction: each texel is owned by exactly one
// dispatch (same invariant as the f32 kernel) and non-owned bytes contribute
// nothing to the OR.
@group(0) @binding(2) var<storage, read_write> out_words: array<atomic<u32>>;
// The decoded uint8 chunk, reinterpreted as packed u32 words — the strided
// element index below is a BYTE index into this array.
@group(1) @binding(0) var<storage, read> chunk_data: array<u32>;

var<workgroup> wg_min: atomic<u32>;
var<workgroup> wg_max: atomic<u32>;

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
  var value = 0u;

  // No early returns before the barriers (uniform control flow); out-of-range
  // and non-owned invocations just skip the work.
  // gid is relative to the OWNED sub-box: the grid covers only the texels this
  // dispatch can write, instead of the whole stored brick once per chunk. The
  // guards below still matter for the workgroup-rounding tail.
  let span = max(1u, P.z_span);
  let px = P.grid_origin.x + gid.x;
  let py = P.grid_origin.y + gid.y;
  let c = P.chan_start + gid.z / span;
  let z = P.grid_origin.z + gid.z % span;
  if (px < P.stored_xy.x && py < P.stored_xy.y && z < sz && c < P.chan_end) {
    // Clamp into the fetch box: interior texels are unchanged, border texels
    // land on their nearest valid voxel (edge replication).
    let g = clamp(
      P.dest_origin + vec3<i32>(i32(px), i32(py), i32(z)),
      P.fetch_min,
      P.fetch_max - vec3<i32>(1),
    );
    if (all(g >= P.lo) && all(g < P.hi) && c >= P.chan_start) {
      let local = vec3<u32>(g - P.chunk_origin);
      let src = P.fixed_base
        + (c - P.chan_start) * P.stride_c
        + local.z * P.stride_z
        + local.y * P.stride_y
        + local.x * P.stride_x;
      value = extractBits(chunk_data[src >> 2u], 8u * (src & 3u), 8u);
      let word = P.out_base_word
        + ((c * sz + z) * P.stored_xy.y + py) * P.row_words
        + (px >> 2u);
      atomicOr(&out_words[word], value << (8u * (px & 3u)));
      contributes = true; // u8 has no NaN — every owned texel contributes
    }
  }

  if (contributes) {
    // Raw u8 values are already order-preserving as u32 — no bit trick.
    atomicMin(&wg_min, value);
    atomicMax(&wg_max, value);
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
  /** Origin of the owned sub-box inside the stored brick (see `ownedGridBox`). */
  gridOrigin: Vec3;
  /** Extents of that sub-box. `gridSize[2]` is the per-channel z span. */
  gridSize: Vec3;
};

/**
 * The sub-box of the stored brick that ONE (brick, chunk) dispatch can write.
 *
 * The kernel used to dispatch over the full stored brick for every chunk and
 * let each invocation discard itself if it did not own its texel. With a
 * 66×66×38 brick over 4 channels that is 702,848 invocations per dispatch, of
 * which roughly 1/8 do work — each chunk owns one channel-chunk and about half
 * the z range. Narrowing the grid to the owned box removes the rest.
 *
 * Why the owned set IS a box: the kernel's source position along each axis is
 * `f(p) = clamp(destOrigin + p, fetchMin, fetchMax - 1)`, which is monotone
 * non-decreasing in `p`. Ownership is `lo <= f(p) < hi`, and the preimage of an
 * interval under a monotone function is an interval — so per axis it is a
 * contiguous `[p0, p1)`, with closed forms:
 *
 *  - `p0 = 0` when `lo === fetchMin`, because the border texels below `fetchMin`
 *    clamp UP to `fetchMin` and are therefore owned by exactly the chunk whose
 *    `lo` sits at `fetchMin`. Otherwise `p0 = lo - destOrigin`.
 *  - `p1 = stored` when `hi === fetchMax` (symmetrically: the trailing border
 *    clamps DOWN to `fetchMax - 1`). Otherwise `p1 = hi - destOrigin`.
 *
 * Both are clamped into `[0, stored]`. An empty span means this chunk owns
 * nothing of the brick and the dispatch is skipped entirely.
 *
 * The per-texel ownership test stays in the kernel: the workgroup rounding tail
 * can still overshoot the box, and correctness must not depend on this
 * arithmetic being exactly right.
 */
export function ownedGridBox(d: {
  destOrigin: Vec3;
  stored: Vec3;
  fetchMin: Vec3;
  fetchMax: Vec3;
  lo: Vec3;
  hi: Vec3;
}): { gridOrigin: Vec3; gridSize: Vec3 } | null {
  const origin: number[] = [];
  const size: number[] = [];
  for (const axis of [0, 1, 2] as const) {
    const stored = d.stored[axis];
    const p0 =
      d.lo[axis] === d.fetchMin[axis]
        ? 0
        : Math.min(stored, Math.max(0, d.lo[axis] - d.destOrigin[axis]));
    const p1 =
      d.hi[axis] === d.fetchMax[axis]
        ? stored
        : Math.min(stored, Math.max(0, d.hi[axis] - d.destOrigin[axis]));
    if (p1 <= p0) return null;
    origin.push(p0);
    size.push(p1 - p0);
  }
  return {
    gridOrigin: [origin[0], origin[1], origin[2]],
    gridSize: [size[0], size[1], size[2]],
  };
}

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

    const stored: Vec3 = [spec.stored[0], spec.stored[1], spec.stored[2]];
    const fetchMin: Vec3 = [fetchBox.min[0], fetchBox.min[1], fetchBox.min[2]];
    const fetchMax: Vec3 = [fetchBox.max[0], fetchBox.max[1], fetchBox.max[2]];
    const box = ownedGridBox({
      destOrigin,
      stored,
      fetchMin,
      fetchMax,
      lo: [lo[0], lo[1], lo[2]],
      hi: [hi[0], hi[1], hi[2]],
    });
    // Overlaps in level voxels but owns no brick texel (the whole overlap sits
    // in a region another chunk's clamp already covers) — nothing to dispatch.
    if (!box) continue;

    dispatches.push({
      chunkIndex,
      destOrigin,
      stored,
      channelCount,
      brickIndex,
      fetchMin,
      fetchMax,
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
      gridOrigin: box.gridOrigin,
      gridSize: box.gridSize,
    });
  }
  return dispatches;
}

/**
 * Workgroup counts covering the OWNED sub-box (z carries this chunk's channel
 * range). Previously this covered the whole stored brick times the whole
 * channel count for every chunk, so ~7/8 of the invocations existed only to
 * fail the ownership test.
 */
export function dispatchWorkgroups(d: KernelDispatch): Vec3 {
  const wg = REPACK_WORKGROUP_SIZE;
  const channels = Math.max(0, d.chanEnd - d.chanStart);
  return [
    Math.ceil(d.gridSize[0] / wg),
    Math.ceil(d.gridSize[1] / wg),
    Math.ceil((d.gridSize[2] * channels) / wg),
  ];
}

/**
 * Pack one dispatch into its 40-word uniform slice. Word layout mirrors the
 * WGSL `Params` struct field-for-field (vec3 aligned to 16 bytes, the scalar
 * riding in the 4th word); i32 values rely on typed-array modulo-2^32 wrap to
 * store their bit pattern. `r8Out` carries the r8 kernel's arena addressing
 * (words 33/34); the f32 kernel ignores those words.
 */
export function packKernelParams(
  d: KernelDispatch,
  out: Uint32Array,
  wordOffset: number,
  r8Out?: { outBaseWord: number; rowWords: number },
): void {
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
  w[33] = r8Out?.outBaseWord ?? 0;
  w[34] = r8Out?.rowWords ?? 0;
  w[35] = 0; // vec3 alignment pad before grid_origin
  w[36] = d.gridOrigin[0];
  w[37] = d.gridOrigin[1];
  w[38] = d.gridOrigin[2];
  w[39] = d.gridSize[2];
}

/**
 * Arena layout for one r8 job (all of a brick's dispatches share it): rows
 * padded to the 256-byte `copyBufferToTexture` bytesPerRow alignment, one
 * image per output z texel (channel slabs stacked on z, like the atlas slot).
 * `jobBytes` is a multiple of 256 by construction, so consecutive job base
 * offsets stay aligned for both the storage binding and the copy.
 *
 * KNOWN COST, measured and left alone: for a typical 66×66×38 brick over 4
 * channels the row padding is 256 bytes carrying 66 bytes of data, so the arena
 * is 256×66×152 = 2,568,192 B for 662,112 B of texels — 3.88×, all of it
 * cleared, atomicOr'd and strided-copied. Packing rows tighter is not as simple
 * as it looks: `atomicOr` operates at u32 granularity while texels are bytes,
 * so four adjacent x texels share a word and can belong to DIFFERENT dispatches
 * at a chunk boundary. That is what makes the OR (and hence the zero-clear)
 * load-bearing, and why a plain packed write would race. Any change here must
 * first establish word-exclusive ownership.
 */
export function r8JobLayout(
  stored: Vec3,
  channelCount: number,
): { rowBytes: number; imageRows: number; images: number; jobBytes: number } {
  const rowBytes = Math.ceil(stored[0] / 256) * 256;
  const imageRows = stored[1];
  const images = stored[2] * channelCount;
  return { rowBytes, imageRows, images, jobBytes: rowBytes * imageRows * images };
}

/**
 * r8 counterpart of `decodeMinMax`: the kernel reduces RAW u8 values (no
 * order-encoding, no NaN), so the words decode as-is. Untouched sentinels
 * (possible only when no dispatch owned any texel) map to the same `{0, 0,
 * uniform 0}` outcome as the f32 path.
 */
export function decodeMinMaxU8(
  minWord: number,
  maxWord: number,
): { min: number; max: number; uniformValue: number | null } {
  if (minWord === MINMAX_INIT_MIN && maxWord === MINMAX_INIT_MAX) {
    return { min: 0, max: 0, uniformValue: 0 };
  }
  return { min: minWord, max: maxWord, uniformValue: minWord === maxWord ? minWord : null };
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
