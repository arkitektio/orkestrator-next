import { useEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { Chunk, DataType, Slice } from 'zarrita';

import { DimSliceFragment } from '@/mikro-next/api/graphql';

import { getChunkWorker } from '../../../../lib/zarr/runner';
import { setter } from '../../../../lib/zarr/runner/internals/setter';
import { get_strides } from '../../../../lib/zarr/runner/internals/util';
import { workerPool } from '../../../workers/pool';
import { buildAffineMatrix } from '../panels/layer/affine-utils';
import { useSelectionStore } from '../store/layerStore';
import { LayerState } from '../store/sceneStore';
import { useViewerStore } from '../store/viewerStore';
import { BasicIndexer } from '../stores/indexer';
import { mapDTypeToMinMax } from '../stores/utils';
import { getColorMapTexture } from '../zarr/colormaps';
import { VolumeTextureMesh } from './VolumeTextureMesh';

type TextureBufferConfig = {
  data: Uint8Array | Float32Array;
  dataScale: number;
  type: THREE.TextureDataType;
  internalFormat: 'R8' | 'R32F';
};

type VolumeTextureState = {
  texture: THREE.Data3DTexture;
  dataScale: number;
  dimensionOrder: [number, number, number];
  minValue: number;
  maxValue: number;
  volumePosition: [number, number, number];
  volumeSize: [number, number, number];
};

const MIN_VOLUME_CHUNK_CONCURRENCY = 4;
const MAX_VOLUME_CHUNK_CONCURRENCY = 8;
const VOLUME_UPLOAD_BATCH_CHUNKS = 6;
const VOLUME_UPLOAD_MAX_DELAY_MS = 40;

const InvertedHullOutline = ({
  children,
  color = '#10b981',
  thickness = 1.03,
  enabled = true,
}: {
  children: React.ReactNode;
  color?: string;
  thickness?: number;
  enabled?: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!enabled || !groupRef.current) return;

    const outlines: THREE.Mesh[] = [];

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && !child.userData.isOutline) {
        if (
          child.material instanceof THREE.Material &&
          'transparent' in child.material &&
          child.material.transparent &&
          'opacity' in child.material &&
          child.material.opacity < 0.5
        ) {
          return;
        }

        const outlineMesh = new THREE.Mesh(child.geometry);
        outlineMesh.material = new THREE.MeshBasicMaterial({
          color,
          side: THREE.BackSide,
          transparent: true,
          opacity: 0.22,
          depthWrite: false,
          depthTest: true,
          blending: THREE.NormalBlending,
        });

        outlineMesh.scale.copy(child.scale).multiplyScalar(thickness);
        outlineMesh.position.copy(child.position);
        outlineMesh.rotation.copy(child.rotation);
        outlineMesh.userData.isOutline = true;

        child.parent?.add(outlineMesh);
        outlines.push(outlineMesh);
      }
    });

    return () => {
      outlines.forEach((mesh) => {
        mesh.parent?.remove(mesh);
        (mesh.material as THREE.Material).dispose();
      });
    };
  }, [enabled, color, thickness]);

  return <group ref={groupRef}>{children}</group>;
};






// --- 2. The Main Frame Plane ---

export const VolumeLayer = ({ layer }: { layer: LayerState }) => {
  const [volumeTexture, setVolumeTexture] = useState<VolumeTextureState | null>(null);

  const getArrayForStoreId = useViewerStore((s) => s.getArrayForStoreId);
  const isSelected = useSelectionStore((s) => s.selectedLayerId === layer.id);
  const isDebug = useViewerStore((state) => state.debug);
  const setSelectedLayerId = useSelectionStore((s) => s.setSelectedLayerId);
  const invalidate = useThree((state) => state.invalidate);

  const resolvedVolumeLod = useMemo(() => {
    const highestAvailableLod = Math.max(0, layer.lens.dataset.dataArrays.length - 1);
    if (typeof layer.fixedLOD === 'number' && layer.fixedLOD >= 0 && layer.fixedLOD <= highestAvailableLod) {
      return layer.fixedLOD;
    }
    if (typeof layer.defaultVolumeLOD === 'number' && layer.defaultVolumeLOD >= 0 && layer.defaultVolumeLOD <= highestAvailableLod) {
      return layer.defaultVolumeLOD;
    }
    return highestAvailableLod;
  }, [layer.defaultVolumeLOD, layer.fixedLOD, layer.lens.dataset.dataArrays.length]);

  const volumeDataSignature = useMemo(
    () => JSON.stringify({
      dataArrayStoreId: layer.lens.dataset.dataArrays[resolvedVolumeLod]?.store.id ?? null,
      dims: layer.lens.dataset.dims,
      xDim: layer.xDim,
      yDim: layer.yDim,
      zDim: layer.zDim,
      slices: layer.lens.slices.map((slice) => ({
        dim: slice.dim,
        start: slice.start ?? null,
        stop: slice.stop ?? null,
        step: slice.step ?? null,
      })),
    }),
    [
      layer.lens.dataset.dataArrays,
      layer.lens.dataset.dims,
      layer.lens.slices,
      layer.xDim,
      layer.yDim,
      layer.zDim,
      resolvedVolumeLod,
    ],
  );

  const colorMapTexture = useMemo(() => getColorMapTexture(layer), [layer]);

  useEffect(() => {
    let isMounted = true;
    let uploadFrame = 0;
    let uploadFramePending = false;
    let uploadTimer: ReturnType<typeof setTimeout> | null = null;
    let pendingDirtyChunks = 0;
    const abortController = new AbortController();
    const effectStartedAt = typeof performance !== 'undefined' ? performance.now() : Date.now();
    let firstDecodedChunkLogged = false;
    let firstUploadedBatchLogged = false;

    const logLoadEvent = (label: string, details?: Record<string, number | string>) => {
      if (!isDebug) return;

      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const elapsedMs = Math.round(now - effectStartedAt);
      if (details) {
        console.debug(`[VolumeLayer ${layer.id}] ${label} (+${elapsedMs}ms)`, details);
        return;
      }

      console.debug(`[VolumeLayer ${layer.id}] ${label} (+${elapsedMs}ms)`);
    };

    const queueTextureUpload = (
      texture: THREE.Data3DTexture,
      reason: 'initial' | 'batch' | 'final',
    ) => {
      if (abortController.signal.aborted) return;

      if (uploadTimer) {
        clearTimeout(uploadTimer);
        uploadTimer = null;
      }

      if (uploadFramePending) return;
      uploadFramePending = true;
      uploadFrame = requestAnimationFrame(() => {
        uploadFramePending = false;
        if (abortController.signal.aborted) return;
        texture.needsUpdate = true;
        invalidate();

        if (!firstUploadedBatchLogged && reason !== 'initial') {
          firstUploadedBatchLogged = true;
          logLoadEvent('first uploaded chunk batch');
        }

        pendingDirtyChunks = 0;
      });
    };

    const scheduleTextureUpload = (texture: THREE.Data3DTexture, force = false) => {
      if (abortController.signal.aborted) return;

      pendingDirtyChunks += 1;
      if (force || pendingDirtyChunks >= VOLUME_UPLOAD_BATCH_CHUNKS) {
        queueTextureUpload(texture, force ? 'final' : 'batch');
        return;
      }

      if (uploadTimer) return;
      uploadTimer = setTimeout(() => {
        uploadTimer = null;
        queueTextureUpload(texture, 'batch');
      }, VOLUME_UPLOAD_MAX_DELAY_MS);
    };

    const initializeVolume = async () => {
      let createdTexture: THREE.Data3DTexture | null = null;

      try {
        const dataArray = layer.lens.dataset.dataArrays[resolvedVolumeLod];
        if (!dataArray) {
          setVolumeTexture(null);
          return;
        }

        const dims = layer.lens.dataset.dims;
        const arr = getArrayForStoreId(dataArray.store.id);
        const sliceMap = layer.lens.slices.reduce((acc, slice) => {
          acc[slice.dim] = slice;
          return acc;
        }, {} as Record<string, DimSliceFragment>);

        const xPos = dims.indexOf(layer.xDim);
        const yPos = dims.indexOf(layer.yDim);
        const zPos = layer.zDim ? dims.indexOf(layer.zDim) : -1;

        if (xPos === -1 || yPos === -1 || zPos === -1) {
          console.warn(`Skipping volume render for ${layer.id}: invalid spatial dimensions.`);
          setVolumeTexture(null);
          return;
        }

        const spatialDims = new Set([layer.xDim, layer.yDim, layer.zDim].filter((dim): dim is string => Boolean(dim)));
        const selection: (null | Slice | number)[] = dims.map((dim, dimIndex) => {
          const slice = sliceMap[dim];

          if (!spatialDims.has(dim)) {
            return resolveCollapsedSelection(slice, arr.shape[dimIndex]);
          }

          if (!slice) return null;

          return {
            start: slice.start ?? 0,
            stop: slice.stop ?? undefined,
            step: slice.step ?? 1,
          } as Slice;
        });

        const indexer = new BasicIndexer({
          selection,
          shape: arr.shape,
          chunk_shape: arr.chunks,
        });

        if (indexer.shape.length !== 3) {
          console.warn(`Skipping volume render for ${layer.id}: selection resolves to ${indexer.shape.length} dimensions.`);
          setVolumeTexture(null);
          return;
        }

        const outputAxisBySourceDim = dims.map((_, sourceDim) => {
          if (typeof selection[sourceDim] === 'number') {
            return -1;
          }

          let outputAxis = 0;
          for (let dimIndex = 0; dimIndex <= sourceDim; dimIndex++) {
            if (typeof selection[dimIndex] !== 'number') {
              outputAxis += 1;
            }
          }

          return outputAxis - 1;
        });

        const xOut = outputAxisBySourceDim[xPos];
        const yOut = outputAxisBySourceDim[yPos];
        const zOut = outputAxisBySourceDim[zPos];

        if (xOut === -1 || yOut === -1 || zOut === -1) {
          console.warn(`Skipping volume render for ${layer.id}: a spatial dimension is collapsed.`);
          setVolumeTexture(null);
          return;
        }

        const outputShape = [...indexer.shape] as [number, number, number];
        const textureConfig = createVolumeTextureBuffer(arr.dtype, outputShape.reduce((total, size) => total * size, 1));
        const textureDimensions = getTextureDimensions(outputShape, [xOut, yOut, zOut]);
        const [minValue, maxValue] = mapDTypeToMinMax(arr.dtype);
        const chunkConcurrency = getPreferredVolumeChunkConcurrency();

        createdTexture = new THREE.Data3DTexture(
          textureConfig.data,
          textureDimensions.width,
          textureDimensions.height,
          textureDimensions.depth,
        );
        createdTexture.format = THREE.RedFormat;
        createdTexture.type = textureConfig.type;
        createdTexture.internalFormat = textureConfig.internalFormat;
        createdTexture.unpackAlignment = 1;
        createdTexture.minFilter = THREE.LinearFilter;
        createdTexture.magFilter = THREE.LinearFilter;
        createdTexture.wrapS = THREE.ClampToEdgeWrapping;
        createdTexture.wrapT = THREE.ClampToEdgeWrapping;
        createdTexture.wrapR = THREE.ClampToEdgeWrapping;
        createdTexture.flipY = false;
        createdTexture.needsUpdate = true;

        const destination = setter.prepare(
          textureConfig.data as unknown as Chunk<DataType>['data'],
          outputShape,
          get_strides(outputShape),
        );

        const xSelection = resolveSpatialSelection(selection[xPos], arr.shape[xPos]);
        const ySelection = resolveSpatialSelection(selection[yPos], arr.shape[yPos]);
        const zSelection = resolveSpatialSelection(selection[zPos], arr.shape[zPos]);
        const scaleX = dataArray.scaleFactors?.[xPos] ?? 1;
        const scaleY = dataArray.scaleFactors?.[yPos] ?? 1;
        const scaleZ = dataArray.scaleFactors?.[zPos] ?? 1;

        const totalX = arr.shape[xPos] * scaleX;
        const totalY = arr.shape[yPos] * scaleY;
        const totalZ = arr.shape[zPos] * scaleZ;

        const width = xSelection.length * xSelection.step * scaleX;
        const height = ySelection.length * ySelection.step * scaleY;
        const depth = zSelection.length * zSelection.step * scaleZ;

        const xCenter = xSelection.start * scaleX + width / 2 - totalX / 2;
        const yCenter = -(ySelection.start * scaleY + height / 2 - totalY / 2);
        const zCenter = zSelection.start * scaleZ + depth / 2 - totalZ / 2;

        if (!isMounted || abortController.signal.aborted) {
          createdTexture.dispose();
          return;
        }

        setVolumeTexture({
          texture: createdTexture,
          dataScale: textureConfig.dataScale,
          dimensionOrder: [xOut, yOut, zOut],
          minValue,
          maxValue,
          volumePosition: [xCenter, yCenter, zCenter],
          volumeSize: [width, height, depth],
        });

        queueTextureUpload(createdTexture, 'initial');

        const chunkLoaders = prioritizeChunkLoaders(
          Array.from(indexer),
          [xPos, yPos, zPos],
          [xSelection, ySelection, zSelection],
          arr.chunks,
        );
        const totalChunks = chunkLoaders.length;
        const progressMilestones = createChunkProgressMilestones(totalChunks);
        let completedChunks = 0;

        logLoadEvent('queued aggregate volume fill', {
          chunks: totalChunks,
          concurrency: chunkConcurrency,
          width: textureDimensions.width,
          height: textureDimensions.height,
          depth: textureDimensions.depth,
        });

        await runChunkLoaderQueue(chunkLoaders, chunkConcurrency, async ({ chunk_coords, mapping }) => {
          const chunk = await getChunkWorker(arr, chunk_coords, {
            pool: workerPool,
            priority: resolvedVolumeLod,
            signal: abortController.signal,
            useSharedArrayBuffer: true,
          });

          if (!isMounted || abortController.signal.aborted) return;

          if (!firstDecodedChunkLogged) {
            firstDecodedChunkLogged = true;
            logLoadEvent('first decoded chunk');
          }

          setter.set_from_chunk(
            destination,
            chunk,
            mapping as unknown as Parameters<typeof setter.set_from_chunk>[2],
          );

          completedChunks += 1;
          while (progressMilestones.length > 0 && completedChunks >= progressMilestones[0]) {
            const milestone = progressMilestones.shift() as number;
            logLoadEvent(`loaded ${Math.round((milestone / totalChunks) * 100)}% of chunks`, {
              completed: completedChunks,
              total: totalChunks,
            });
          }

          scheduleTextureUpload(createdTexture as THREE.Data3DTexture);
        });

        if (createdTexture && !abortController.signal.aborted) {
          logLoadEvent('completed aggregate volume fill');
          scheduleTextureUpload(createdTexture, true);
        }
      } catch (error) {
        if (createdTexture) {
          createdTexture.dispose();
        }

        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        console.error(`Failed to initialize volume layer ${layer.id}`, error);
      }
    };

    initializeVolume();

    return () => {
      isMounted = false;
      abortController.abort();
      if (uploadTimer) {
        clearTimeout(uploadTimer);
      }
      if (uploadFrame) {
        cancelAnimationFrame(uploadFrame);
      }
      setVolumeTexture((previous) => {
        previous?.texture.dispose();
        return null;
      });
    };

    function getPreferredVolumeChunkConcurrency(): number {
      const hardwareConcurrency = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : undefined;

      if (typeof hardwareConcurrency !== 'number' || !Number.isFinite(hardwareConcurrency)) {
        return MIN_VOLUME_CHUNK_CONCURRENCY;
      }

      return Math.max(
        MIN_VOLUME_CHUNK_CONCURRENCY,
        Math.min(MAX_VOLUME_CHUNK_CONCURRENCY, Math.floor(hardwareConcurrency / 2)),
      );
    }
  }, [getArrayForStoreId, invalidate, layer.id, resolvedVolumeLod, volumeDataSignature]);

  const affineMatrix = useMemo(() => buildAffineMatrix(layer), [layer]);

  if (!volumeTexture) {
    return null;
  }

  return (
    <group
      matrix={affineMatrix}
      matrixAutoUpdate={false}
      onClick={(event) => {
        event.stopPropagation();
        setSelectedLayerId(isSelected ? null : layer.id);
      }}
    >
      <InvertedHullOutline enabled={isSelected && isDebug}>
        <VolumeTextureMesh
          texture={volumeTexture.texture}
          colorMapTexture={colorMapTexture}
          layerId={layer.id}
          dimensionOrder={volumeTexture.dimensionOrder}
          volumePosition={volumeTexture.volumePosition}
          volumeSize={volumeTexture.volumeSize}
          minValue={volumeTexture.minValue}
          maxValue={volumeTexture.maxValue}
          dataScale={volumeTexture.dataScale}
        />
      </InvertedHullOutline>
    </group>
  );
};

function createVolumeTextureBuffer(dataType: DataType, elementCount: number): TextureBufferConfig {
  if (dataType === 'uint8') {
    return {
      data: new Uint8Array(elementCount),
      dataScale: 255.0,
      type: THREE.UnsignedByteType,
      internalFormat: 'R8',
    };
  }

  return {
    data: new Float32Array(elementCount),
    dataScale: 1.0,
    type: THREE.FloatType,
    internalFormat: 'R32F',
  };
}

function getTextureDimensions(
  shape: [number, number, number],
  dimensionOrder: [number, number, number],
): { width: number; height: number; depth: number } {
  const sorted = [...dimensionOrder].sort((a, b) => a - b);
  const fastestIdx = sorted[sorted.length - 1] ?? 0;
  const middleIdx = sorted[sorted.length - 2] ?? 0;
  const slowestIdx = sorted[sorted.length - 3] ?? 0;

  return {
    width: shape[fastestIdx] ?? 1,
    height: shape[middleIdx] ?? 1,
    depth: shape[slowestIdx] ?? 1,
  };
}

function resolveSpatialSelection(
  selection: null | Slice | number,
  axisLength: number,
): { start: number; step: number; length: number } {
  if (typeof selection === 'number') {
    const index = Math.max(0, Math.min(axisLength - 1, selection));
    return { start: index, step: 1, length: 1 };
  }

  const step = Math.max(1, selection?.step ?? 1);
  const start = Math.max(0, Math.min(axisLength, selection?.start ?? 0));
  const stop = Math.max(start, Math.min(axisLength, selection?.stop ?? axisLength));
  const length = stop <= start ? 0 : Math.max(1, Math.ceil((stop - start) / step));

  return { start, step, length };
}

function resolveCollapsedSelection(
  slice: DimSliceFragment | undefined,
  axisLength: number,
): number {
  if (axisLength <= 1) {
    return 0;
  }

  const step = Math.max(1, slice?.step ?? 1);
  const start = Math.max(0, Math.min(axisLength - 1, slice?.start ?? 0));
  const exclusiveStop = Math.max(start + 1, Math.min(axisLength, slice?.stop ?? start + 1));
  const span = Math.max(1, Math.ceil((exclusiveStop - start) / step));
  const centeredIndex = start + Math.floor((span - 1) / 2) * step;

  return Math.max(0, Math.min(axisLength - 1, centeredIndex));
}

function prioritizeChunkLoaders<T extends { chunk_coords: number[] }>(
  items: T[],
  dimensionPositions: [number, number, number],
  spatialSelections: [
    { start: number; step: number; length: number },
    { start: number; step: number; length: number },
    { start: number; step: number; length: number },
  ],
  chunkShape: readonly number[],
): T[] {
  const [xPos, yPos, zPos] = dimensionPositions;
  const [xSelection, ySelection, zSelection] = spatialSelections;
  const centerChunkCoords = [
    getChunkCenterCoordinate(xSelection, chunkShape[xPos] ?? 1),
    getChunkCenterCoordinate(ySelection, chunkShape[yPos] ?? 1),
    getChunkCenterCoordinate(zSelection, chunkShape[zPos] ?? 1),
  ] as const;

  return [...items].sort((left, right) => {
    const leftDistance =
      Math.pow((left.chunk_coords[xPos] ?? 0) - centerChunkCoords[0], 2) +
      Math.pow((left.chunk_coords[yPos] ?? 0) - centerChunkCoords[1], 2) +
      Math.pow((left.chunk_coords[zPos] ?? 0) - centerChunkCoords[2], 2);
    const rightDistance =
      Math.pow((right.chunk_coords[xPos] ?? 0) - centerChunkCoords[0], 2) +
      Math.pow((right.chunk_coords[yPos] ?? 0) - centerChunkCoords[1], 2) +
      Math.pow((right.chunk_coords[zPos] ?? 0) - centerChunkCoords[2], 2);

    return leftDistance - rightDistance;
  });
}

function getChunkCenterCoordinate(
  selection: { start: number; step: number; length: number },
  chunkSize: number,
): number {
  const effectiveChunkSize = Math.max(1, chunkSize);
  const selectionExtent = Math.max(0, selection.length - 1) * selection.step;
  const centerVoxel = selection.start + selectionExtent / 2;

  return centerVoxel / effectiveChunkSize;
}

function createChunkProgressMilestones(totalChunks: number): number[] {
  if (totalChunks <= 0) {
    return [];
  }

  return Array.from(
    new Set([0.25, 0.5, 1].map((ratio) => Math.max(1, Math.ceil(totalChunks * ratio)))),
  ).sort((left, right) => left - right);
}

async function runChunkLoaderQueue<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  let nextIndex = 0;
  const runnerCount = Math.max(1, Math.min(concurrency, items.length));

  const runners = Array.from({ length: runnerCount }, async () => {
    while (nextIndex < items.length) {
      const item = items[nextIndex++] as T;
      await worker(item);
    }
  });

  await Promise.all(runners);
}
