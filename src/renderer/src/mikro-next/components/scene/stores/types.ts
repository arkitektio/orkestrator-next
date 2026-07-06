// --- 1. Local Types ---
import * as THREE from "three";
import type { ZarrStore } from "../zarr/zarr_stores/type";
import { IndexerProjection } from "./indexer";


export type ChunkData = {
  level: number;
  scaleFactors?: number[];
  frame_id: string;
  store: ZarrStore;
  dimensionOrder: number[];
  chunkCoords: number[];
  indexer: IndexerProjection[];
  chunk_shape: number[];
  arrayShape: number[];
  chunkKey: string;
  min_value: number;
  max_value: number;
  // Unused by ChunkPlane (it derives its colormap atlas from the layer's
  // render graph); kept optional for legacy callers.
  cLimMin?: number;
  cLimMax?: number;
  colormapTexture?: THREE.Texture
}
