import { open } from 'zarrita';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { ChunkData } from '../../stores/types';
import { mapDTypeToMinMax } from '../../stores/utils';
import { ChunkPlane } from '../ChunkPlane';
import { getColorMapTexture } from '../../zarr/colormaps';
import { Slice } from "zarrita";
import { useSelectionStore } from '../../store/layerStore';
import { useViewerStore } from '../../store/viewerStore';
import {
  DimSliceFragment,
} from '@/mikro-next/api/graphql';
import { calculateChunkGrid } from '../../zarr/utils';
import { useSceneStore } from '../../store/sceneStore';
import { useShallow } from 'zustand/shallow';
import { buildAffineMatrix, physicalToVoxelZ } from '../../panels/layer/affine-utils';

// --- 1. Types & Cache ---

interface ZarrLevel {
  store: any;
  arr: any;
  scale: number[];
  scaleFactors?: number[];
}

interface ZarrCache {
  levels: ZarrLevel[];
  dims: string[];
}

// --- 2. The Main Plane Layer ---

export const PlaneLayer = ({ layerId }: { layerId: string }) => {
  const [chunks, setChunks] = useState<ChunkData[] | null>(null);
  const [activeLod, setActiveLod] = useState<number>(0);

  const zarrCache = useRef<ZarrCache | null>(null);
  const groupRef = useRef<THREE.Group>(null!);

  // Store Hooks
  const register = useViewerStore((s) => s.register);
  const unregister = useViewerStore((s) => s.unregister);
  const storeBuilder = useViewerStore((s) => s.storeBuilder);
  const currentZ = useViewerStore((s) => s.currentZ);
  const isDebug = useViewerStore((state) => state.debug);
  const lodBias = useViewerStore((state) => state.lodBias);
  const setLodDebugInfo = useViewerStore((s) => s.setLodDebugInfo);

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
    if (!zarrCache.current || !layer) return;

    const { dims } = zarrCache.current;

    const numLevels = zarrCache.current.levels.length;
    const levelsToRender = [activeLod];
    if (activeLod + 1 < numLevels) levelsToRender.push(activeLod + 1);
    if (activeLod + 2 < numLevels) levelsToRender.push(activeLod + 2);

    const sliceMap = layer.lens.slices.reduce((acc, slice) => {
      acc[slice.dim] = slice;
      return acc;
    }, {} as Record<string, DimSliceFragment>);

    const xPos = dims.indexOf(layer.xDim);
    const yPos = dims.indexOf(layer.yDim);
    const zPos = layer.zDim ? dims.indexOf(layer.zDim) : -1;
    const intensityPos = dims.indexOf(layer.intensityDim);

    const colormapTexture = getColorMapTexture(layer);
    let allGeneratedChunks: ChunkData[] = [];

    levelsToRender.forEach((levelIdx, index) => {
      const level = zarrCache.current!.levels[levelIdx];
      if (!level) return;
      const { arr, store } = level;

      const selection: (null | Slice | number)[] = dims.map(dim => {
        const slice = sliceMap[dim];
        return slice ? ({
          start: slice.start ?? 0,
          stop: slice.stop ?? undefined,
          step: slice.step ?? 1
        } as Slice) : null;
      });

      if (zPos !== -1 && currentZ !== undefined) {
        const layerAffine = buildAffineMatrix(layer);
        const inv = layerAffine.clone().invert();
        const pt = new THREE.Vector3(0, 0, currentZ);
        pt.applyMatrix4(inv);
        
        const scaleZ = level.scaleFactors && level.scaleFactors.length > zPos ? level.scaleFactors[zPos] : 1;
        const downscaledZ = Math.round(pt.z / scaleZ);
        
        const maxVoxelZ = arr.shape[zPos] - 1;
        selection[zPos] = Math.max(0, Math.min(maxVoxelZ, downscaledZ));
      }

      const [minVal, maxVal] = mapDTypeToMinMax(arr.dtype);
      const grid = calculateChunkGrid(selection, arr.shape, arr.chunks);

      const levelChunks: ChunkData[] = grid.map(({ chunk_coords, mapping }) => ({
        frame_id: layer.id,
        dimensionOrder: [xPos, yPos, intensityPos],
        store: store,
        chunkCoords: chunk_coords,
        chunkKey: `${levelIdx}-${chunk_coords.join("/")}`,
        indexer: mapping,
        chunk_shape: arr.chunks,
        arrayShape: arr.shape,
        min_value: minVal,
        max_value: maxVal,
        cLimMin: Math.ceil(minVal * (layer.climMin || 0)),
        cLimMax: Math.floor(maxVal * (layer.climMax || 1)),
        colormapTexture: colormapTexture,
        level: levelIdx,
        scaleFactors: level.scaleFactors
      }));
      allGeneratedChunks = [...allGeneratedChunks, ...levelChunks];
    });

    setChunks(prev => {
      const pKeys = prev?.map(c => c.chunkKey).join(',') || '';
      const nKeys = allGeneratedChunks.map(c => c.chunkKey).join(',');
      return pKeys === nKeys ? prev : allGeneratedChunks;
    });
  }, [layer, currentZ, activeLod]);

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
        const dataArrays = layer.lens.dataset.dataArrays;
        if (!dataArrays || dataArrays.length === 0 || signal.aborted) return;

        const levels = await Promise.all(
          dataArrays.map(async (zarrArray) => {
            const store = await storeBuilder(zarrArray.store.id, signal);
            const arr = await open.v3(store, { kind: "array" });
            return {
              store,
              arr,
              scale: arr.shape, // Use shape as reference scale for now
              scaleFactors: zarrArray.scaleFactors,
            };
          })
        );

        if (!signal.aborted) {
          zarrCache.current = {
            levels,
            dims: layer.lens.dataset.dims
          };

          setActiveLod(Math.max(0, levels.length - 1)); // Start with lowest resolution
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
  }, [updateChunks]);

  // --- LOD Frame Loop ---
  useFrame((state) => {
    if (!zarrCache.current || !layer || !groupRef.current) return;

    const camera = state.camera;
    const numLevels = zarrCache.current.levels.length;
    if (numLevels <= 1) return;

    let targetLod = numLevels - 1;
    // check fixedLOD override
    if ('fixedLOD' in layer && typeof layer.fixedLOD === 'number' && layer.fixedLOD >= 0 && layer.fixedLOD < numLevels) {
      targetLod = layer.fixedLOD;
    } else {
      let zoomScale = 1;
      if (camera instanceof THREE.OrthographicCamera) {
          zoomScale = camera.zoom;
      } else if (camera instanceof THREE.PerspectiveCamera) {
          const distance = camera.position.distanceTo(groupRef.current.position);
          zoomScale = 1 / Math.max(0.001, distance);
      }

      zoomScale = zoomScale * lodBias;

      if (zoomScale > 2.0) {
          targetLod = 0;
      } else if (zoomScale > 0.5 && numLevels > 1) {
          targetLod = 1;
      } else if (numLevels > 2) {
          targetLod = Math.min(2, numLevels - 1);
      }
      targetLod = Math.max(0, Math.min(numLevels - 1, targetLod));
    }

    if (targetLod !== activeLod) {
      setActiveLod(targetLod);
      if (setLodDebugInfo) {
        
        const levelsToRender = [targetLod];
        if (targetLod + 1 < numLevels) levelsToRender.push(targetLod + 1);
        if (targetLod + 2 < numLevels) levelsToRender.push(targetLod + 2);
        setLodDebugInfo(layerId, { 
          currentLOD: targetLod, 
          targetResolution: zarrCache.current.levels[targetLod].scale?.[0] || 0,
          renderedLevels: levelsToRender
        });

      }
    }
  });

  const affineMatrix = useMemo(() => {
    if (!layer) return new THREE.Matrix4().identity();
    return buildAffineMatrix(layer);
  }, [layer]);

  const colorMapTexture = useMemo(() => {
    if (!layer) return null;
    return getColorMapTexture(layer);
  }, [layer?.colormap]);

  if (layer?.visible === false) return null;
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
