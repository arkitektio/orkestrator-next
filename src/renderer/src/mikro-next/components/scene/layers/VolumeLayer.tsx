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
import { useModeStore } from '../store/modeStore';
import { LayerState } from '../store/sceneStore';
import { useViewerStore, useViewerStoreApi } from '../store/viewerStore';
import { BasicIndexer } from '../stores/indexer';
import { mapDTypeToMinMax } from '../stores/utils';
import { getColorMapTexture } from '../zarr/colormaps';
import { VolumeTextureMesh, type VolumeRenderMesh } from './VolumeTextureMesh';

type AxisSelection = {
  start: number;
  step: number;
  length: number;
};

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
  spatialSelections: [AxisSelection, AxisSelection, AxisSelection];
};

const MIN_VOLUME_CHUNK_CONCURRENCY = 4;
const MAX_VOLUME_CHUNK_CONCURRENCY = 8;
const VOLUME_UPLOAD_BATCH_CHUNKS = 6;
const VOLUME_UPLOAD_MAX_DELAY_MS = 40;
const VOLUME_PROBE_STEPS = 32;

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
  const volumeMeshRef = useRef<VolumeRenderMesh | null>(null);
  const skipSelectionClickRef = useRef(false);

  const getArrayForStoreId = useViewerStore((s) => s.getArrayForStoreId);
  const probeThreshold = useViewerStore((s) => s.probeThreshold);
  const viewerStoreApi = useViewerStoreApi();
  const isSelected = useSelectionStore((s) => s.selectedLayerId === layer.id);
  const interactionMode = useModeStore((s) => s.interactionMode);
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

  const colorMapTexture = useMemo(
    () => getColorMapTexture(layer.colormap, layer.color),
    [layer.colormap, layer.color],
  );

  const materialSignature = useMemo(
    () => [
      layer.id,
      layer.climMin ?? 0,
      layer.climMax ?? 1,
      layer.colormap ?? 'viridis',
      ...(layer.color ?? []),
    ].join(':'),
    [layer.climMax, layer.climMin, layer.color, layer.colormap, layer.id],
  );

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
          spatialSelections: [xSelection, ySelection, zSelection],
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
  }, [
    getArrayForStoreId,
    invalidate,
    isDebug,
    layer.id,
    layer.lens.dataset.dataArrays,
    layer.lens.dataset.dims,
    layer.lens.slices,
    layer.xDim,
    layer.yDim,
    layer.zDim,
    resolvedVolumeLod,
    volumeDataSignature,
  ]);

  const affineMatrix = useMemo(() => buildAffineMatrix(layer), [layer]);

  const probeCoordinateFromRay = (ray: THREE.Ray): [number, number, number] | null => {
    if (!volumeTexture) {
      return null;
    }

    const mesh = volumeMeshRef.current;
    if (!mesh) {
      return null;
    }

    const inverseMatrix = new THREE.Matrix4().copy(mesh.matrixWorld).invert();
    const localOrigin = ray.origin.clone().applyMatrix4(inverseMatrix);
    const localDirection = ray.direction.clone().transformDirection(inverseMatrix).normalize();
    const bounds = intersectLocalVolumeBox(localOrigin, localDirection);
    if (!bounds) {
      return null;
    }

    const localHit = marchVolumeTexture({
      colorMapTexture,
      dataScale: volumeTexture.dataScale,
      direction: localDirection,
      dimensionOrder: volumeTexture.dimensionOrder,
      maxValue: volumeTexture.maxValue,
      minValue: volumeTexture.minValue,
      origin: localOrigin,
      texture: volumeTexture.texture,
      bounds,
      climMax: layer.climMax ?? 1,
      climMin: layer.climMin ?? 0,
      threshold: probeThreshold,
    });

    if (!localHit) {
      return null;
    }

    return [
      THREE.MathUtils.clamp(localHit[0], -0.5, 0.5),
      THREE.MathUtils.clamp(localHit[1], -0.5, 0.5),
      THREE.MathUtils.clamp(localHit[2], -0.5, 0.5),
    ];
  };

  const updateProbe = (localPos: [number, number, number] | null) => {
    const currentProbe = viewerStoreApi.getState().probedCoordinate;

    if (!localPos) {
      if (currentProbe?.layerId === layer.id) {
        viewerStoreApi.getState().setProbedCoordinate(null);
      }
      return;
    }

    const [xSelection, ySelection, zSelection] = volumeTexture?.spatialSelections ?? [];
    if (!xSelection || !ySelection || !zSelection) {
      return;
    }

    const nextProbe = {
      layerId: layer.id,
      localPos,
      voxelIndex: [
        resolveVoxelIndex(localPos[0] + 0.5, xSelection),
        resolveVoxelIndex(0.5 - localPos[1], ySelection),
        resolveVoxelIndex(localPos[2] + 0.5, zSelection),
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
  };

  const saveCurrentProbe = () => {
    const currentProbe = viewerStoreApi.getState().probedCoordinate;
    if (!currentProbe || currentProbe.layerId !== layer.id) {
      return;
    }

    viewerStoreApi.getState().addSavedProbe(currentProbe);
  };

  if (!volumeTexture) {
    return null;
  }

  return (
    <group
      matrix={affineMatrix}
      matrixAutoUpdate={false}
      onPointerMove={(event) => {
        if (interactionMode !== 'AUTO_PROBE') {
          return;
        }

        if (event.buttons !== 0) {
          return;
        }

        const localPos = probeCoordinateFromRay(event.ray);
        updateProbe(localPos);

        if (localPos) {
          event.stopPropagation();
        }
      }}
      onPointerOut={() => {
        if (interactionMode !== 'AUTO_PROBE') {
          return;
        }

        updateProbe(null);
      }}
      onPointerDown={(event) => {
        if (interactionMode !== 'PROBE' && interactionMode !== 'AUTO_PROBE') {
          return;
        }

        event.stopPropagation();
        skipSelectionClickRef.current = true;

        const localPos = probeCoordinateFromRay(event.ray);
        updateProbe(localPos);

        if (event.shiftKey && localPos) {
          saveCurrentProbe();
        }
      }}
      onClick={(event) => {
        if (skipSelectionClickRef.current) {
          skipSelectionClickRef.current = false;
          return;
        }

        if (interactionMode === 'PROBE' || interactionMode === 'AUTO_PROBE') {
          return;
        }

        if (event.altKey) {
          return;
        }
        event.stopPropagation();
        setSelectedLayerId(isSelected ? null : layer.id);
      }}
    >
      <InvertedHullOutline enabled={isSelected && isDebug}>
        <VolumeTextureMesh
          key={materialSignature}
          volumeMeshRef={volumeMeshRef}
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
): AxisSelection {
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

function resolveVoxelIndex(normalizedPosition: number, selection: AxisSelection): number {
  const clampedPosition = THREE.MathUtils.clamp(normalizedPosition, 0, 0.999999);
  const relativeIndex = Math.min(
    selection.length - 1,
    Math.max(0, Math.floor(clampedPosition * selection.length)),
  );

  return selection.start + relativeIndex * selection.step;
}

function intersectLocalVolumeBox(
  origin: THREE.Vector3,
  direction: THREE.Vector3,
): { start: number; end: number } | null {
  const min = new THREE.Vector3(-0.5, -0.5, -0.5);
  const max = new THREE.Vector3(0.5, 0.5, 0.5);
  let start = -Infinity;
  let end = Infinity;

  for (const axis of ['x', 'y', 'z'] as const) {
    const axisDirection = direction[axis];
    const axisOrigin = origin[axis];

    if (Math.abs(axisDirection) < Number.EPSILON) {
      if (axisOrigin < min[axis] || axisOrigin > max[axis]) {
        return null;
      }
      continue;
    }

    const invDirection = 1 / axisDirection;
    const t1 = (min[axis] - axisOrigin) * invDirection;
    const t2 = (max[axis] - axisOrigin) * invDirection;
    start = Math.max(start, Math.min(t1, t2));
    end = Math.min(end, Math.max(t1, t2));
  }

  if (start > end) {
    return null;
  }

  return {
    start: Math.max(start, 0),
    end,
  };
}

function marchVolumeTexture({
  colorMapTexture,
  dataScale,
  direction,
  dimensionOrder,
  maxValue,
  minValue,
  origin,
  texture,
  bounds,
  climMax,
  climMin,
  threshold,
}: {
  colorMapTexture: THREE.Texture | null;
  dataScale: number;
  direction: THREE.Vector3;
  dimensionOrder: [number, number, number];
  maxValue: number;
  minValue: number;
  origin: THREE.Vector3;
  texture: THREE.Data3DTexture;
  bounds: { start: number; end: number };
  climMax: number;
  climMin: number;
  threshold: number;
}): [number, number, number] | null {
  const image = texture.image as {
    data?: Uint8Array | Float32Array;
    width?: number;
    height?: number;
    depth?: number;
  };
  const textureData = image.data;
  const width = image.width ?? 1;
  const height = image.height ?? 1;
  const depth = image.depth ?? 1;

  if (!textureData || width <= 0 || height <= 0 || depth <= 0) {
    return null;
  }

  const axisOrder = getTextureAxisOrder(dimensionOrder);
  const delta = Math.sqrt(3) / VOLUME_PROBE_STEPS;
  const step = direction.clone().multiplyScalar(delta);
  let distance = bounds.start + delta * 0.5;
  const position = origin.clone().addScaledVector(direction, distance);

  while (distance <= bounds.end) {
    const uvw = position.clone().addScalar(0.5);
    uvw.y = 1.0 - uvw.y;

    if (uvw.x >= 0 && uvw.x <= 1 && uvw.y >= 0 && uvw.y <= 1 && uvw.z >= 0 && uvw.z <= 1) {
      const texCoord = getTextureCoordinate(uvw, axisOrder);
      const texX = Math.min(width - 1, Math.max(0, Math.floor(texCoord.x * width)));
      const texY = Math.min(height - 1, Math.max(0, Math.floor(texCoord.y * height)));
      const texZ = Math.min(depth - 1, Math.max(0, Math.floor(texCoord.z * depth)));
      const rawValue = textureData[(texZ * height + texY) * width + texX] * dataScale;
      const normalized = computeProbeNormalized(rawValue, minValue, maxValue, climMin, climMax);

      if (computeProbeVisibility(normalized, colorMapTexture) > threshold) {
        return [position.x, position.y, position.z];
      }
    }

    position.add(step);
    distance += delta;
  }

  return null;
}

function getTextureAxisOrder(dimensionOrder: [number, number, number]) {
  const sorted = [...dimensionOrder].sort((left, right) => left - right);
  return {
    depthAxis: sorted[sorted.length - 3] ?? 0,
    heightAxis: sorted[sorted.length - 2] ?? 0,
    widthAxis: sorted[sorted.length - 1] ?? 0,
  };
}

function getTextureCoordinate(
  uvw: THREE.Vector3,
  axisOrder: { widthAxis: number; heightAxis: number; depthAxis: number },
): THREE.Vector3 {
  const components = [uvw.x, uvw.y, uvw.z];
  return new THREE.Vector3(
    components[axisOrder.widthAxis] ?? 0,
    components[axisOrder.heightAxis] ?? 0,
    components[axisOrder.depthAxis] ?? 0,
  );
}

function computeProbeNormalized(
  rawValue: number,
  minValue: number,
  maxValue: number,
  climMin: number,
  climMax: number,
): number {
  const baseNorm = THREE.MathUtils.clamp(
    (rawValue - minValue) / Math.max(maxValue - minValue, 0.00001),
    0,
    1,
  );
  const climRange = Math.max(climMax - climMin, 0.00001);
  return THREE.MathUtils.clamp((baseNorm - climMin) / climRange, 0, 0.999);
}

function computeProbeVisibility(normalized: number, colorMapTexture: THREE.Texture | null): number {
  return sampleColorMapAlpha(colorMapTexture, normalized) * normalized;
}

function sampleColorMapAlpha(colorMapTexture: THREE.Texture | null, normalized: number): number {
  const image = colorMapTexture?.image as { data?: Uint8Array; width?: number } | undefined;
  const colorData = image?.data;
  const width = image?.width ?? 0;

  if (!colorData || width <= 0) {
    return 1;
  }

  const scaledIndex = THREE.MathUtils.clamp(normalized, 0, 0.999999) * (width - 1);
  const leftIndex = Math.floor(scaledIndex);
  const rightIndex = Math.min(width - 1, leftIndex + 1);
  const mix = scaledIndex - leftIndex;
  const leftAlpha = (colorData[leftIndex * 4 + 3] ?? 255) / 255;
  const rightAlpha = (colorData[rightIndex * 4 + 3] ?? 255) / 255;

  return THREE.MathUtils.lerp(leftAlpha, rightAlpha, mix);
}
