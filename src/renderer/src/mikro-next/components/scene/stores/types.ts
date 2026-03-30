// --- 1. Local Types ---
import * as THREE from "three";
import type { ZarrStore } from "../zarr/zarr_stores/type";
import { IndexerProjection } from "./indexer";


export type ChunkData = {
  frame_id: string;
  store: ZarrStore;
  dimensionOrder: number[];
  chunkCoords: number[];
  indexer: IndexerProjection[];
  chunk_shape: number[];
  chunkKey: string;
  min_value: number;
  max_value: number;
  cLimMin: number;
  cLimMax: number;
  colormapTexture: THREE.Texture
}
