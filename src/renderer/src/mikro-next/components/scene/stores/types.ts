// --- 1. Local Types ---

export type ChunkData = {
  level: number;
  scaleFactors?: number[];
  frame_id: string;
  storeId: string;
  dimensionOrder: number[];
  chunkCoords: number[];
  chunk_shape: number[];
  arrayShape: number[];
  chunkKey: string;
  min_value: number;
  max_value: number;
  /**
   * Present when the plan pins a single index along an axis (the 2D z-slice).
   * `levelIndex` is the selected voxel index in level coordinates; ChunkPlane
   * extracts that slab from the fetched chunk before creating the texture —
   * without this, chunks spanning multiple z slices always display their
   * first slab.
   */
  zSelection?: { axisPosition: number; levelIndex: number };
}
