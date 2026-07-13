import type { MeshEncodingSpec, VoxelBox } from "./meshSpec";

/**
 * Geometry-row decoding: Parquet BLOB columns → renderable typed arrays.
 * Pure and renderer-free so the whole contract is unit-testable; the React
 * layer only wraps the output in `BufferGeometry`.
 *
 * ## Geometry row contract (client side of the MeshCollection spec, v1)
 *
 * One row per mesh fragment; a cell renders as the union of its rows.
 *   level        INT     octree level (0 = finest)
 *   cell         BIGINT  Morton cell code on that level's grid (`mortonCell.ts`)
 *   positions    BLOB    vertexCount vertices; layout by `encoding.positions`:
 *                        UINT16_QUANTIZED_PER_CELL — uint16 x,y,z,PAD (stride 8;
 *                          the pad keeps the stride 4-byte aligned, which the
 *                          meshopt vertex codec requires) quantized over the
 *                          CELL's voxel box; FLOAT32 — float32 x,y,z (stride 12)
 *                          already in voxel coordinates
 *   normals      BLOB?   OCT16 octahedral normals: codec NONE → int16 u,v
 *                        (stride 4); codec MESHOPT → meshopt OCTAHEDRAL filter
 *                        output, int16 x,y,z,w (stride 8)
 *   indices      BLOB    triangle list, UINT16 (stride 2) or UINT32 (stride 4)
 *   vertex_count INT
 *   index_count  INT
 *
 * `encoding.codec` — NONE: blobs are raw little-endian arrays; MESHOPT: blobs
 * are meshopt vertex/index streams (decoded through three's MeshoptDecoder).
 * `encoding.compression` ("ZSTD") is Parquet page compression — DuckDB
 * decompresses it before the client ever sees bytes.
 */

export type MeshGeometryRow = {
  positions: Uint8Array;
  normals?: Uint8Array | null;
  indices: Uint8Array;
  vertexCount: number;
  indexCount: number;
};

export type DecodedCellGeometry = {
  /** Dequantized voxel-space positions, xyz interleaved. */
  positions: Float32Array;
  normals: Float32Array | null;
  indices: Uint16Array | Uint32Array;
  /** Approximate CPU/GPU footprint, for the cell cache's byte accounting. */
  bytes: number;
};

/** The subset of three's MeshoptDecoder this module needs (injectable for tests). */
export type MeshoptDecoderLike = {
  decodeVertexBuffer: (
    target: Uint8Array,
    count: number,
    size: number,
    source: Uint8Array,
    filter?: string,
  ) => void;
  decodeIndexBuffer: (target: Uint8Array, count: number, size: number, source: Uint8Array) => void;
};

const POSITION_STRIDES: Record<string, number> = {
  UINT16_QUANTIZED_PER_CELL: 8,
  FLOAT32: 12,
};

const alignedCopy = (bytes: Uint8Array): ArrayBuffer => {
  // Arrow-backed blobs are views at arbitrary offsets; typed-array views
  // require element-aligned offsets, so copy once into a fresh buffer.
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
};

const decodeVertexBlob = (
  blob: Uint8Array,
  count: number,
  stride: number,
  codec: string,
  decoder: MeshoptDecoderLike | null,
  filter?: string,
): ArrayBuffer => {
  if (codec === "MESHOPT") {
    if (!decoder) throw new Error("MESHOPT geometry requires a MeshoptDecoder");
    const target = new Uint8Array(count * stride);
    decoder.decodeVertexBuffer(target, count, stride, blob, filter);
    return target.buffer;
  }
  if (blob.byteLength < count * stride) {
    throw new Error(`vertex blob too short: ${blob.byteLength} < ${count * stride}`);
  }
  return alignedCopy(blob.subarray(0, count * stride));
};

const dequantizePositions = (
  raw: ArrayBuffer,
  count: number,
  positionsEncoding: string,
  cellBox: VoxelBox,
): Float32Array => {
  if (positionsEncoding === "FLOAT32") {
    return new Float32Array(raw, 0, count * 3);
  }
  // UINT16_QUANTIZED_PER_CELL: q/65535 spans the cell's voxel box per axis.
  const quantized = new Uint16Array(raw);
  const out = new Float32Array(count * 3);
  const extent = [
    cellBox.max[0] - cellBox.min[0],
    cellBox.max[1] - cellBox.min[1],
    cellBox.max[2] - cellBox.min[2],
  ];
  for (let v = 0; v < count; v++) {
    const src = v * 4; // x, y, z, pad
    const dst = v * 3;
    out[dst] = cellBox.min[0] + (quantized[src] / 65535) * extent[0];
    out[dst + 1] = cellBox.min[1] + (quantized[src + 1] / 65535) * extent[1];
    out[dst + 2] = cellBox.min[2] + (quantized[src + 2] / 65535) * extent[2];
  }
  return out;
};

/** Octahedral → unit vector (u, v in signed-normalized [-1, 1]). */
const octToVector = (u: number, v: number): [number, number, number] => {
  let x = u;
  let y = v;
  const z = 1 - Math.abs(u) - Math.abs(v);
  if (z < 0) {
    const ox = x;
    x = (1 - Math.abs(y)) * (ox >= 0 ? 1 : -1);
    y = (1 - Math.abs(ox)) * (v >= 0 ? 1 : -1);
  }
  const len = Math.hypot(x, y, z) || 1;
  return [x / len, y / len, z / len];
};

const decodeNormals = (
  blob: Uint8Array,
  count: number,
  codec: string,
  decoder: MeshoptDecoderLike | null,
): Float32Array => {
  const out = new Float32Array(count * 3);
  if (codec === "MESHOPT") {
    // meshopt's OCTAHEDRAL filter emits ready int16 x,y,z,w (stride 8).
    const raw = new Int16Array(decodeVertexBlob(blob, count, 8, codec, decoder, "OCTAHEDRAL"));
    for (let v = 0; v < count; v++) {
      const len =
        Math.hypot(raw[v * 4], raw[v * 4 + 1], raw[v * 4 + 2]) || 1;
      out[v * 3] = raw[v * 4] / len;
      out[v * 3 + 1] = raw[v * 4 + 1] / len;
      out[v * 3 + 2] = raw[v * 4 + 2] / len;
    }
    return out;
  }
  // Raw OCT16: int16 u,v per vertex.
  const raw = new Int16Array(decodeVertexBlob(blob, count, 4, codec, decoder));
  for (let v = 0; v < count; v++) {
    const [x, y, z] = octToVector(raw[v * 2] / 32767, raw[v * 2 + 1] / 32767);
    out[v * 3] = x;
    out[v * 3 + 1] = y;
    out[v * 3 + 2] = z;
  }
  return out;
};

const decodeIndices = (
  blob: Uint8Array,
  count: number,
  indicesEncoding: string,
  codec: string,
  decoder: MeshoptDecoderLike | null,
): Uint16Array | Uint32Array => {
  const byteSize = indicesEncoding === "UINT32" ? 4 : 2;
  if (codec === "MESHOPT") {
    if (!decoder) throw new Error("MESHOPT geometry requires a MeshoptDecoder");
    const target = new Uint8Array(count * byteSize);
    decoder.decodeIndexBuffer(target, count, byteSize, blob);
    return byteSize === 4 ? new Uint32Array(target.buffer) : new Uint16Array(target.buffer);
  }
  const raw = alignedCopy(blob.subarray(0, count * byteSize));
  return byteSize === 4 ? new Uint32Array(raw) : new Uint16Array(raw);
};

/** Decode one geometry row into voxel-space arrays. Throws on malformed rows. */
export function decodeGeometryRow(
  row: MeshGeometryRow,
  encoding: MeshEncodingSpec,
  cellBox: VoxelBox,
  decoder: MeshoptDecoderLike | null,
): DecodedCellGeometry {
  const stride = POSITION_STRIDES[encoding.positions];
  if (!stride) throw new Error(`unsupported positions encoding: ${encoding.positions}`);
  if (row.indexCount % 3 !== 0) throw new Error(`index count ${row.indexCount} not a triangle list`);

  const rawPositions = decodeVertexBlob(row.positions, row.vertexCount, stride, encoding.codec, decoder);
  const positions = dequantizePositions(rawPositions, row.vertexCount, encoding.positions, cellBox);
  const normals =
    row.normals && row.normals.byteLength > 0 && encoding.normals
      ? decodeNormals(row.normals, row.vertexCount, encoding.codec, decoder)
      : null;
  const indices = decodeIndices(row.indices, row.indexCount, encoding.indices, encoding.codec, decoder);

  return {
    positions,
    normals,
    indices,
    bytes: positions.byteLength + (normals?.byteLength ?? 0) + indices.byteLength,
  };
}
