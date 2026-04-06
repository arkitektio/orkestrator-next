import { open } from 'zarrita';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import type { ChunkData } from '../stores/types';
import { mapDTypeToMinMax } from '../stores/utils';
import { ChunkPlane } from './ChunkPlane';
import { getColorMapTexture } from '../zarr/colormaps';
import { Slice } from "zarrita";
import { useSelectionStore } from '../store/layerStore';
import { useViewerStore } from '../store/viewerStore';
import {
  DimSliceFragment,
} from '@/mikro-next/api/graphql';
import { calculateChunkGrid } from '../zarr/utils';
import { useSceneStore } from '../store/sceneStore';
import { useShallow } from 'zustand/shallow';
import { buildAffineMatrix, physicalToVoxelZ } from '../panels/layer/affine-utils';

// --- 1. Types & Cache ---

interface ZarrCache {
  store: any;
  arr: any;
  dims: string[];
}

// --- 2. The Main Plane Layer ---

export const PlaneLayer = ({ layerId }: { layerId: string }) => {
  const [chunks, setChunks] = useState<ChunkData[] | null>(null);

  const zarrCache = useRef<ZarrCache | null>(null);
  const groupRef = useRef<THREE.Group>(null!);

  // Store Hooks
  const register = useViewerStore((s) => s.register);
  const unregister = useViewerStore((s) => s.unregister);
  const storeBuilder = useViewerStore((s) => s.storeBuilder);
  const currentZ = useViewerStore((s) => s.currentZ);
  const isDebug = useViewerStore((state) => state.debug);

  // Visibility Guard: Check if this specific layer is in the "visible" set

  const layer = useSceneStore(useShallow((s) => s.layers.find((l) => l.id === layerId)));
  const isSelected = useSelectionStore((s) => layer ? s.selectedLayerId === layer.id : false);
  const setSelectedLayerId = useSelectionStore((s) => s.setSelectedLayerId);

  // Scene Registration
  useEffect(() => {
    const refProxy = { kind: "layer", id: layerId, ref: groupRef };
    register(refProxy);
    return () => unregister(refProxy);
  }, [layerId, register, unregister]);

  // --- Logic: Update Chunks ---
  const updateChunks = useCallback(() => {
    // ABORT if the layer isn't currently visible in the frustum
    if ( !zarrCache.current || !layer) return;

    const { arr, dims } = zarrCache.current;

    const sliceMap = layer.lens.slices.reduce((acc, slice) => {
      acc[slice.dim] = slice;
      return acc;
    }, {} as Record<string, DimSliceFragment>);

    const selection: (null | Slice | number)[] = dims.map(dim => {
      const slice = sliceMap[dim];
      return slice ? ({
        start: slice.start ?? 0,
        stop: slice.stop ?? undefined,
        step: slice.step ?? 1
      } as Slice) : null;
    });

    const xPos = dims.indexOf(layer.xDim);
    const yPos = dims.indexOf(layer.yDim);
    const zPos = layer.zDim ? dims.indexOf(layer.zDim) : -1;
    const intensityPos = dims.indexOf(layer.intensityDim);

    if (zPos !== -1 && currentZ !== undefined) {
      const layerAffine = buildAffineMatrix(layer);
      const maxVoxelZ = arr.shape[zPos] - 1;
      selection[zPos] = physicalToVoxelZ(layerAffine, currentZ, maxVoxelZ);
    }

    const [minVal, maxVal] = mapDTypeToMinMax(arr.dtype);
    const grid = calculateChunkGrid(selection, arr.shape, arr.chunks);
    const colormapTexture = getColorMapTexture(layer);

    const generatedChunks: ChunkData[] = grid.map(({ chunk_coords, mapping }) => ({
      frame_id: layer.id,
      dimensionOrder: [xPos, yPos, intensityPos],
      store: zarrCache.current!.store,
      chunkCoords: chunk_coords,
      chunkKey: chunk_coords.join("/"),
      indexer: mapping,
      chunk_shape: arr.chunks,
      arrayShape: arr.shape,
      min_value: minVal,
      max_value: maxVal,
      cLimMin: Math.ceil(minVal * (layer.climMin || 0)),
      cLimMax: Math.floor(maxVal * (layer.climMax || 1)),
      colormapTexture: colormapTexture
    }));

    setChunks(generatedChunks);
  }, [layer, currentZ]);

  // --- Effect: Initialize Zarr with AbortController ---
  useEffect(() => {
    if (!layer) return;
    console.log(`Initializing Zarr for layer ${layer.id}...`);

    const controller = new AbortController();
    const { signal } = controller;

    const initializeZarr = async () => {
      if (zarrCache.current) {
        updateChunks();
        return;
      }

      try {
        const zarrArray = layer.lens.dataset.dataArrays.at(0);
        if (!zarrArray || signal.aborted) return;

        const store = await storeBuilder(zarrArray.store.id, signal);
        const arr = await open.v3(store, { kind: "array" });

        if (!signal.aborted) {
          zarrCache.current = {
            store,
            arr,
            dims: layer.lens.dataset.dims
          };
          updateChunks();
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log(`Initialization for ${layerId} was cancelled.`);
        } else {
          console.error(`Failed to initialize Zarr store:`, error);
        }
      }
    };

    initializeZarr();

    return () => {
      controller.abort();
      zarrCache.current = null;
    };
  }, [layerId]);

  // --- Effect: Reactive Updates ---
  useEffect(() => {
    updateChunks();
  }, [updateChunks, layer?.climMin, layer?.climMax, layer?.colormap]);

  const affineMatrix = useMemo(() => {
    if (!layer) return new THREE.Matrix4().identity();
    return buildAffineMatrix(layer);
  }, [layer]);

  const colorMapTexture = useMemo(() => {
    if (!layer) return null;
    return getColorMapTexture(layer);
  }, [layer?.colormap]);

  // If not visible, we return null to unmount the meshes and save GPU memory
  if (!chunks) return null;

  return (
    <group
      matrix={affineMatrix}
      matrixAutoUpdate={false}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedLayerId(isSelected ? null : layerId);
      }}
      ref={groupRef}
    >
      {chunks.map((chunk) => (
        <ChunkPlane
          key={chunk.chunkKey}
          chunk={chunk}
          colorMapTexture={colorMapTexture}
        />
      ))}
    </group>
  );
};
