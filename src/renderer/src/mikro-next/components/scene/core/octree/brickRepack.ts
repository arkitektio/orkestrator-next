import type { AxisIndices } from "../dims";
import type { BrickSpec } from "./brickSpec";
import type { LevelGeometry, Vec3 } from "./levelGeometry";
import type { VoxelBox } from "./nodeAddress";

/**
 * Pure CPU repack: copy a brick's voxel box out of one or more decoded zarr
 * chunks into a contiguous stored-brick array, canonicalized to x-fastest
 * [x, y, z, channel-slab] layout (this is what kills the shader-side
 * `dimRemap`). Border voxels come from neighboring data where the fetch box
 * covered them and are edge-replicated at volume boundaries, so linear
 * filtering is defined everywhere. A min==max scan flags uniform bricks —
 * those become EMPTY page entries and consume no atlas slot.
 */

export type BrickArray = Uint8Array | Float32Array;

export type RepackChunk = {
  /** Spatial chunk-grid coords [cx, cy, cz] on the level's grid. */
  coords: Vec3;
  /** Chunk index along the intensity axis (0 when collapsed or absent). */
  channelChunk: number;
  data: BrickArray;
  /** Chunk dims in the array's own dim order (full chunk shape, edge-padded). */
  shape: readonly number[];
  stride: readonly number[];
};

export type RepackBrickInput = {
  spec: BrickSpec;
  level: LevelGeometry;
  axes: AxisIndices;
  /** Payload box of the brick, clamped to the level shape. */
  brickBox: VoxelBox;
  /** Payload + border box, clamped (the voxels the sources actually cover). */
  fetchBox: VoxelBox;
  /**
   * In-chunk element offsets for every non-spatial, non-channel dim (zarr dim
   * order; 0 elsewhere) — collapsed t/other axes resolved by the caller.
   */
  fixedOffsets: readonly number[];
  chunks: readonly RepackChunk[];
  /** Length storedX·storedY·storedZ·channelCount; overwritten fully. */
  output: BrickArray;
};

export type RepackResult = {
  min: number;
  max: number;
  /** Set when every written voxel holds the same value. */
  uniformValue: number | null;
};

export function repackBrick({
  spec,
  level,
  axes,
  brickBox,
  fetchBox,
  fixedOffsets,
  chunks,
  output,
}: RepackBrickInput): RepackResult {
  const { xPos, yPos, zPos, intensityPos } = axes;
  const [sx, sy, sz] = spec.stored;
  const channelCount = spec.channelCount;
  const channelsPerChunk =
    intensityPos !== -1 ? Math.max(1, level.chunks[intensityPos] ?? 1) : 1;

  // Dest origin: the (possibly out-of-volume) unclamped fetch corner.
  const destOrigin: Vec3 = [
    brickBox.min[0] - spec.border,
    brickBox.min[1] - spec.border,
    brickBox.min[2] - spec.border,
  ];

  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const chunk of chunks) {
    const chunkOrigin: Vec3 = [
      chunk.coords[0] * level.spatialChunks[0],
      chunk.coords[1] * level.spatialChunks[1],
      chunk.coords[2] * level.spatialChunks[2],
    ];

    // Spatial overlap of this chunk with the fetch box, in level voxels.
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

    const strideOf = (pos: number) => (pos !== -1 ? chunk.stride[pos] ?? 0 : 0);
    const strideX = strideOf(xPos);
    const strideY = strideOf(yPos);
    const strideZ = strideOf(zPos);
    const strideC = strideOf(intensityPos);

    let fixedBase = 0;
    for (let d = 0; d < fixedOffsets.length; d++) {
      if (fixedOffsets[d] !== 0) fixedBase += fixedOffsets[d] * (chunk.stride[d] ?? 0);
    }

    const chanStart = chunk.channelChunk * channelsPerChunk;
    const chanEnd = Math.min(channelCount, chanStart + channelsPerChunk);

    for (let c = chanStart; c < chanEnd; c++) {
      const srcChanBase = fixedBase + (c - chanStart) * strideC;
      for (let z = lo[2]; z < hi[2]; z++) {
        const srcZBase = srcChanBase + (z - chunkOrigin[2]) * strideZ;
        const destZBase = (c * sz + (z - destOrigin[2])) * sy;
        for (let y = lo[1]; y < hi[1]; y++) {
          let src = srcZBase + (y - chunkOrigin[1]) * strideY + (lo[0] - chunkOrigin[0]) * strideX;
          let dest = (destZBase + (y - destOrigin[1])) * sx + (lo[0] - destOrigin[0]);
          for (let x = lo[0]; x < hi[0]; x++) {
            const value = chunk.data[src];
            output[dest] = value;
            if (value < min) min = value;
            if (value > max) max = value;
            src += strideX;
            dest += 1;
          }
        }
      }
    }
  }

  // Edge replication: fill everything outside the valid (fetch) region by
  // copying the nearest written texel, per channel slab, axis by axis.
  const vlo: Vec3 = [
    fetchBox.min[0] - destOrigin[0],
    fetchBox.min[1] - destOrigin[1],
    fetchBox.min[2] - destOrigin[2],
  ];
  const vhi: Vec3 = [
    vlo[0] + (fetchBox.max[0] - fetchBox.min[0]),
    vlo[1] + (fetchBox.max[1] - fetchBox.min[1]),
    vlo[2] + (fetchBox.max[2] - fetchBox.min[2]),
  ];

  for (let c = 0; c < channelCount; c++) {
    const slab = c * sz;
    // x: replicate columns within valid y/z rows.
    for (let z = vlo[2]; z < vhi[2]; z++) {
      for (let y = vlo[1]; y < vhi[1]; y++) {
        const row = ((slab + z) * sy + y) * sx;
        for (let x = 0; x < vlo[0]; x++) output[row + x] = output[row + vlo[0]];
        for (let x = vhi[0]; x < sx; x++) output[row + x] = output[row + vhi[0] - 1];
      }
    }
    // y: replicate whole rows.
    for (let z = vlo[2]; z < vhi[2]; z++) {
      const plane = (slab + z) * sy;
      const firstRow = (plane + vlo[1]) * sx;
      const lastRow = (plane + vhi[1] - 1) * sx;
      for (let y = 0; y < vlo[1]; y++)
        output.copyWithin((plane + y) * sx, firstRow, firstRow + sx);
      for (let y = vhi[1]; y < sy; y++)
        output.copyWithin((plane + y) * sx, lastRow, lastRow + sx);
    }
    // z: replicate whole planes.
    const planeSize = sy * sx;
    const firstPlane = (slab + vlo[2]) * planeSize;
    const lastPlane = (slab + vhi[2] - 1) * planeSize;
    for (let z = 0; z < vlo[2]; z++)
      output.copyWithin((slab + z) * planeSize, firstPlane, firstPlane + planeSize);
    for (let z = vhi[2]; z < sz; z++)
      output.copyWithin((slab + z) * planeSize, lastPlane, lastPlane + planeSize);
  }

  if (!Number.isFinite(min)) {
    output.fill(0);
    return { min: 0, max: 0, uniformValue: 0 };
  }
  return { min, max, uniformValue: min === max ? min : null };
}
