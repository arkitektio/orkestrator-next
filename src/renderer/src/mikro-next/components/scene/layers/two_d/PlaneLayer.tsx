import { Slice } from 'zarrita';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import type { ChunkData } from '../../stores/types';
import { mapDTypeToMinMax } from '../../stores/utils';
import { getColorMapTexture } from '../../zarr/colormaps';
import { calculateChunkGrid } from '../../zarr/utils';
import { buildAffineMatrix } from '../../panels/layer/affine-utils';

import { ChunkPlane } from './ChunkPlane';
import { useModeStore } from '../../store/modeStore';
import { useViewerStore, useViewerStoreApi } from '../../store/viewerStore';
import { useSceneStore } from '../../store/sceneStore';
import { DimSliceFragment } from '@/mikro-next/api/graphql';

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

type AxisSelection = {
  start: number;
  step: number;
  length: number;
};

type ProbeGeometryContext = {
  xSelection: AxisSelection;
  ySelection: AxisSelection;
  zSelection: AxisSelection;
  volumePosition: [number, number, number];
  volumeSize: [number, number, number];
};

// --- 2. The Main Plane Layer ---

export const PlaneLayer = ({ layerId }: { layerId: string }) => {
  const [chunks, setChunks] = useState<ChunkData[] | null>(null);
  const [activeLod, setActiveLod] = useState<number>(0);

  // Triggers React to update the chunk list when camera crosses a movement threshold
  const [cameraPanTick, setCameraPanTick] = useState(0);

  const lastCameraRef = useRef(new THREE.Vector2(0, 0));
  const lastZoomRef = useRef(1);

  const zarrCache = useRef<ZarrCache | null>(null);
  const groupRef = useRef<THREE.Group>(null!);

  // Store Hooks
  const register = useViewerStore((s) => s.register);
  const unregister = useViewerStore((s) => s.unregister);
  const getArrayForStoreId = useViewerStore((s) => s.getArrayForStoreId);
  const currentZ = useViewerStore((s) => s.currentZ);
  const lodBias = useViewerStore((state) => state.lodBias);
  const cullRadius = useViewerStore((state) => state.cullRadius);
  const setLodDebugInfo = useViewerStore((s) => s.setLodDebugInfo);
  const viewerStoreApi = useViewerStoreApi();

  // Safely grab the specific layer
  const layer = useSceneStore((s) => s.layers.find((l) => l.id === layerId));

  const zarrSourceSignature = useMemo(() => {
    if (!layer) return null;

    return JSON.stringify({
      dims: layer.lens.dataset.dims,
      dataArrayStoreIds: layer.lens.dataset.dataArrays.map((dataArray) => dataArray.store.id),
      scaleFactors: layer.lens.dataset.dataArrays.map((dataArray) => dataArray.scaleFactors ?? null),
    });
  }, [layer]);

  const chunkLayoutSignature = useMemo(() => {
    if (!layer) return null;

    return JSON.stringify({
      xDim: layer.xDim,
      yDim: layer.yDim,
      zDim: layer.zDim,
      intensityDim: layer.intensityDim,
      fixedLOD: 'fixedLOD' in layer ? layer.fixedLOD : undefined,
      affineMatrix: layer.affineMatrix ?? null,
      slices: layer.lens.slices.map((slice) => ({
        dim: slice.dim,
        start: slice.start ?? null,
        stop: slice.stop ?? null,
        step: slice.step ?? null,
      })),
    });
  }, [layer]);

  const interactionMode = useModeStore((s) => s.interactionMode);

  // Scene Registration
  useEffect(() => {
    const refProxy = { kind: "layer" as const, id: layerId, ref: groupRef };
    register(refProxy);
    return () => unregister(refProxy);
  }, [layerId, register, unregister]);

  // --- Logic: Update Chunks ---
  const updateChunks = useCallback((lodOverride?: number) => {
    if (!zarrCache.current || !layer) return;

    const { dims } = zarrCache.current;
    const lod = lodOverride ?? activeLod;

    const numLevels = zarrCache.current.levels.length;
    const levelsToRender = [lod];
    if (lod + 1 < numLevels) levelsToRender.push(lod + 1);
    if (lod + 2 < numLevels) levelsToRender.push(lod + 2);

    const sliceMap = layer.lens.slices.reduce((acc, slice) => {
      acc[slice.dim] = slice;
      return acc;
    }, {} as Record<string, DimSliceFragment>);

    const xPos = dims.indexOf(layer.xDim ?? "");
    const yPos = dims.indexOf(layer.yDim ?? "");
    const zPos = layer.zDim ? dims.indexOf(layer.zDim) : -1;
    const intensityPos = dims.indexOf(layer.intensityDim ?? "");

    const colormapTexture = getColorMapTexture(layer.colormap, layer.color);

    // We attach chunkRadius temporarily for the culling calculation
    let allGeneratedChunks: { worldX: number; worldY: number; chunkRadius: number; data: ChunkData }[] = [];

    levelsToRender.forEach((levelIdx) => {
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
      const layerAffine = buildAffineMatrix(layer);

      const levelChunks = grid.map(({ chunk_coords, mapping }) => {
        const getDimArraySize = (idx: number) => idx !== -1 ? arr.shape[idx] : 1;
        const scaleX = level.scaleFactors && xPos !== -1 ? level.scaleFactors[xPos] : 1;
        const scaleY = level.scaleFactors && yPos !== -1 ? level.scaleFactors[yPos] : 1;

        const totalX = getDimArraySize(xPos) * scaleX;
        const totalY = getDimArraySize(yPos) * scaleY;
        const gridX = xPos !== -1 ? arr.chunks[xPos] : 1;
        const gridY = yPos !== -1 ? arr.chunks[yPos] : 1;

        const widthScaled = gridX * scaleX;
        const heightScaled = gridY * scaleY;

        // Calculate maximum physical radius of chunk to prevent early popping
        const chunkRadius = Math.sqrt(Math.pow(widthScaled, 2) + Math.pow(heightScaled, 2)) / 2;

        const getChunkCoord = (idx: number) => idx !== -1 ? chunk_coords[idx] : 0;
        const cx = getChunkCoord(xPos) * widthScaled + widthScaled / 2 - totalX / 2;
        const cy = -(getChunkCoord(yPos) * heightScaled + heightScaled / 2 - totalY / 2);

        // Transform the local XY plane coordinate up into World space
        const worldPt = new THREE.Vector3(cx, cy, 0);
        worldPt.applyMatrix4(layerAffine);

        return {
          worldX: worldPt.x,
          worldY: worldPt.y,
          chunkRadius,
          data: {
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
            colormapTexture: colormapTexture,
            level: levelIdx,
            scaleFactors: level.scaleFactors
          }
        };
      });

      allGeneratedChunks = [...allGeneratedChunks, ...levelChunks];
    });

    // Final Distance check logic for Frustum Culling
    const culledChunks = allGeneratedChunks
      .filter(({ worldX, worldY, chunkRadius }) => {
        if (cullRadius <= 0) return true; // Culling disabled

        const effectiveRadius = cullRadius / lastZoomRef.current;
        const dist = Math.sqrt(Math.pow(worldX - lastCameraRef.current.x, 2) + Math.pow(worldY - lastCameraRef.current.y, 2));

        // Add the chunk's radius to allow it to stay visible if its edge is still in view
        return dist <= (effectiveRadius * 1.5) + chunkRadius;
      })
      .map(c => c.data);

    setChunks(prev => {
      const pKeys = prev?.map(c => c.chunkKey).join(',') || '';
      const nKeys = culledChunks.map(c => c.chunkKey).join(',');
      // Only trigger a React update if the exact list of chunks has changed
      return pKeys === nKeys ? prev : culledChunks;
    });
  }, [layer, currentZ, activeLod, cullRadius, cameraPanTick, chunkLayoutSignature]);

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
            const arr = getArrayForStoreId(zarrArray.store.id);
            const store = arr.store;
            return {
              store,
              arr,
              scale: arr.shape,
              scaleFactors: zarrArray.scaleFactors ?? undefined,
            };
          })
        );

        // Guard against writing state if component unmounted
        if (!signal.aborted) {
          const initialLod = Math.max(0, levels.length - 1);
          zarrCache.current = {
            levels,
            dims: layer.lens.dataset.dims
          };
          setActiveLod(initialLod);
          // Populate chunks immediately; avoids startup blank state when active LOD stays unchanged (single-level pyramids).
          updateChunks(initialLod);
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
  }, [layerId, getArrayForStoreId, zarrSourceSignature]);

  // --- Effect: Reactive Updates ---
  useEffect(() => {
    updateChunks();
  }, [updateChunks]);

  // --- LOD & Camera Tracking Frame Loop ---
  useFrame((state) => {
    if (!zarrCache.current || !layer || !groupRef.current) return;

    const camera = state.camera;

    if (camera) {
      let zoomScale = 1;
      if (camera instanceof THREE.OrthographicCamera) {
          zoomScale = camera.zoom;
      } else if (camera instanceof THREE.PerspectiveCamera) {
          const distance = camera.position.distanceTo(groupRef.current.position);
          zoomScale = 1 / Math.max(0.001, distance);
      }

      const effectiveRadius = cullRadius / zoomScale;

      // Threshold update: Only trigger state changes if camera moves significantly
      if (Math.abs(camera.position.x - lastCameraRef.current.x) > (effectiveRadius * 0.1) ||
          Math.abs(camera.position.y - lastCameraRef.current.y) > (effectiveRadius * 0.1) ||
          Math.abs(zoomScale - lastZoomRef.current) > (lastZoomRef.current * 0.1)) {

        lastCameraRef.current.set(camera.position.x, camera.position.y);
        lastZoomRef.current = zoomScale;

        // Triggers the updateChunks useCallback on the next render
        setCameraPanTick((tick) => tick + 1);
      }
    }

    const numLevels = zarrCache.current.levels.length;
    if (numLevels <= 1) return;

    let targetLod = numLevels - 1;
    if ('fixedLOD' in layer && typeof layer.fixedLOD === 'number' && layer.fixedLOD >= 0 && layer.fixedLOD < numLevels) {
      targetLod = layer.fixedLOD;
    } else {
      let zoomScale = lastZoomRef.current;
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

  const resolveProbeGeometryContext = useCallback((): ProbeGeometryContext | null => {
    if (!layer || !zarrCache.current) return null;

    const level = zarrCache.current.levels[activeLod];
    if (!level) return null;

    const { arr, scaleFactors } = level;
    const dims = zarrCache.current.dims;
    const xPos = dims.indexOf(layer.xDim ?? "");
    const yPos = dims.indexOf(layer.yDim ?? "");
    const zPos = layer.zDim ? dims.indexOf(layer.zDim) : -1;
    if (xPos === -1 || yPos === -1 || zPos === -1) return null;

    const sliceMap = layer.lens.slices.reduce((acc, slice) => {
      acc[slice.dim] = slice;
      return acc;
    }, {} as Record<string, DimSliceFragment>);

    const xSelection = resolveSpatialSelection(sliceMap[layer.xDim ?? ""], arr.shape[xPos]);
    const ySelection = resolveSpatialSelection(sliceMap[layer.yDim ?? ""], arr.shape[yPos]);

    let zSelection = resolveSpatialSelection(
      layer.zDim ? sliceMap[layer.zDim] : undefined,
      arr.shape[zPos],
    );

    if (currentZ !== undefined && Number.isFinite(currentZ)) {
      const layerAffine = buildAffineMatrix(layer);
      const inv = layerAffine.clone().invert();
      const pt = new THREE.Vector3(0, 0, currentZ).applyMatrix4(inv);
      const zScale = scaleFactors && scaleFactors.length > zPos ? scaleFactors[zPos] : 1;
      const downscaledZ = Math.round(pt.z / zScale);
      const maxVoxelZ = arr.shape[zPos] - 1;
      const zIndex = Math.max(0, Math.min(maxVoxelZ, downscaledZ));
      zSelection = { start: zIndex, step: 1, length: 1 };
    }

    const scaleX = scaleFactors && scaleFactors.length > xPos ? scaleFactors[xPos] : 1;
    const scaleY = scaleFactors && scaleFactors.length > yPos ? scaleFactors[yPos] : 1;
    const scaleZ = scaleFactors && scaleFactors.length > zPos ? scaleFactors[zPos] : 1;

    const totalX = arr.shape[xPos] * scaleX;
    const totalY = arr.shape[yPos] * scaleY;
    const totalZ = arr.shape[zPos] * scaleZ;

    const width = xSelection.length * xSelection.step * scaleX;
    const height = ySelection.length * ySelection.step * scaleY;
    const depth = zSelection.length * zSelection.step * scaleZ;
    if (width <= 0 || height <= 0 || depth <= 0) return null;

    const volumePosition: [number, number, number] = [
      xSelection.start * scaleX + width / 2 - totalX / 2,
      -(ySelection.start * scaleY + height / 2 - totalY / 2),
      zSelection.start * scaleZ + depth / 2 - totalZ / 2,
    ];

    return {
      xSelection,
      ySelection,
      zSelection,
      volumePosition,
      volumeSize: [width, height, depth],
    };
  }, [activeLod, currentZ, layer]);

  const updateProbe = useCallback((localPoint: THREE.Vector3 | null, save: boolean) => {
    const currentProbe = viewerStoreApi.getState().probedCoordinate;

    if (!localPoint || !layer) {
      if (currentProbe?.layerId === layer?.id) {
        viewerStoreApi.getState().setProbedCoordinate(null);
      }
      return;
    }

    const probeContext = resolveProbeGeometryContext();
    if (!probeContext) return;

    const [volumeX, volumeY] = probeContext.volumePosition;
    const [width, height] = probeContext.volumeSize;

    const normalizedX = (localPoint.x - volumeX) / width;
    const normalizedY = (localPoint.y - volumeY) / height;

    if (normalizedX < 0 || normalizedX > 1 || normalizedY < 0 || normalizedY > 1) {
      if (currentProbe?.layerId === layer.id) {
        viewerStoreApi.getState().setProbedCoordinate(null);
      }
      return;
    }

    const clampedX = THREE.MathUtils.clamp(normalizedX, 0, 1);
    const clampedY = THREE.MathUtils.clamp(normalizedY, 0, 1);

    const localPos: [number, number, number] = [
      clampedX - 0.5,
      clampedY - 0.5,
      0,
    ];

    const nextProbe = {
      layerId: layer.id,
      localPos,
      voxelIndex: [
        resolveVoxelIndex(clampedX, probeContext.xSelection),
        resolveVoxelIndex(1 - clampedY, probeContext.ySelection),
        resolveVoxelIndex(0.5, probeContext.zSelection),
      ] as [number, number, number],
    };

    if (
      currentProbe?.layerId === nextProbe.layerId &&
      currentProbe.voxelIndex[0] === nextProbe.voxelIndex[0] &&
      currentProbe.voxelIndex[1] === nextProbe.voxelIndex[1] &&
      currentProbe.voxelIndex[2] === nextProbe.voxelIndex[2]
    ) {
      return;
    }

    viewerStoreApi.getState().setProbedCoordinate(nextProbe);
    if (save) {
      viewerStoreApi.getState().addSavedProbe(nextProbe);
    }
  }, [layer, resolveProbeGeometryContext, viewerStoreApi]);

  const colorMapTexture = useMemo(() => {
    if (!layer) return null;
    return getColorMapTexture(layer.colormap, layer.color);
  }, [layer]);

  if (layer?.visible === false) return null;
  if (!chunks) return null;

  return (
    <group
      matrix={affineMatrix}
      matrixAutoUpdate={false}
      ref={groupRef}
      onPointerMove={(event) => {
        if (interactionMode !== 'AUTO_PROBE') return;
        if (event.buttons !== 0) return;

        const group = groupRef.current;
        if (!group) return;

        const localPoint = group.worldToLocal(event.point.clone());
        updateProbe(localPoint, false);
        event.stopPropagation();
      }}
      onPointerOut={() => {
        if (interactionMode !== 'AUTO_PROBE') return;
        updateProbe(null, false);
      }}
      onPointerDown={(event) => {
        if (interactionMode !== 'PROBE' && interactionMode !== 'AUTO_PROBE') return;

        const group = groupRef.current;
        if (!group) return;

        event.stopPropagation();
        const localPoint = group.worldToLocal(event.point.clone());
        updateProbe(localPoint, event.shiftKey);
      }}
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

function resolveSpatialSelection(
  slice: DimSliceFragment | undefined,
  axisLength: number,
): AxisSelection {
  const step = Math.max(1, slice?.step ?? 1);
  const start = Math.max(0, Math.min(axisLength, slice?.start ?? 0));
  const stop = Math.max(start, Math.min(axisLength, slice?.stop ?? axisLength));
  const length = stop <= start ? 0 : Math.max(1, Math.ceil((stop - start) / step));

  return { start, step, length };
}

function resolveVoxelIndex(normalizedPosition: number, selection: AxisSelection): number {
  const clampedPosition = THREE.MathUtils.clamp(normalizedPosition, 0, 0.999999);
  const relativeIndex = Math.min(
    selection.length - 1,
    Math.max(0, Math.floor(clampedPosition * selection.length)),
  );

  return selection.start + relativeIndex * selection.step;
}
