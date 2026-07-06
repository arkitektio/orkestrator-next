import { useEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { Chunk, DataType, Slice } from 'zarrita';

import { DimSliceFragment } from '@/mikro-next/api/graphql';
import { getChunkWorker } from '../../../../../lib/zarr/runner';
import { setter } from '../../../../../lib/zarr/runner/internals/setter';
import { get_strides } from '../../../../../lib/zarr/runner/internals/util';
import { workerPool } from '../../../../workers/pool';
import { buildAffineMatrix } from '../../panels/layer/affine-utils';
import { useSelectionStore } from '../../store/layerStore';
import { useModeStore } from '../../store/modeStore';
import { LayerState } from '../../store/sceneStore';
import { useViewerStore, useViewerStoreApi } from '../../store/viewerStore';
import { BasicIndexer } from '../../stores/indexer';
import { mapDTypeToMinMax } from '../../stores/utils';
import { getColorMapTexture } from '../../zarr/colormaps';
import { VolumeTextureMesh, type VolumeRenderMesh } from './VolumeTextureMesh';

import {
  createVolumeTextureBuffer,
  createVolumeBoundsTextureBuffer,
  createBoundsChunk,
  getTextureDimensions,
  resolveSpatialSelection,
  resolveCollapsedSelection,
  prioritizeChunkLoaders,
  runChunkLoaderQueue,
  resolveVoxelIndex,
  intersectLocalVolumeBox,
  marchVolumeTexture,
  type AxisSelection,
} from './volume-math';

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

const InvertedHullOutline = ({ children, color = '#10b981', thickness = 1.03, enabled = true }: { children: React.ReactNode; color?: string; thickness?: number; enabled?: boolean; }) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!enabled || !groupRef.current) return;

    const outlines: THREE.Mesh[] = [];
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && !child.userData.isOutline && (!child.material.transparent || child.material.opacity >= 0.5)) {
        const outlineMesh = new THREE.Mesh(child.geometry, new THREE.MeshBasicMaterial({
          color, side: THREE.BackSide, transparent: true, opacity: 0.22, depthWrite: false, depthTest: true, blending: THREE.NormalBlending,
        }));
        outlineMesh.scale.copy(child.scale).multiplyScalar(thickness);
        outlineMesh.position.copy(child.position);
        outlineMesh.rotation.copy(child.rotation);
        outlineMesh.userData.isOutline = true;
        child.parent?.add(outlineMesh);
        outlines.push(outlineMesh);
      }
    });

    return () => outlines.forEach((mesh) => {
      mesh.parent?.remove(mesh);
      mesh.material.dispose();
    });
  }, [enabled, color, thickness]);

  return <group ref={groupRef}>{children}</group>;
};

export const VolumeLayer = ({ layer }: { layer: LayerState }) => {
  const [volumeTexture, setVolumeTexture] = useState<VolumeTextureState | null>(null);
  const volumeMeshRef = useRef<VolumeRenderMesh | null>(null);
  const skipSelectionClickRef = useRef(false);

  const { getArrayForStoreId, probeThreshold, debug: isDebug } = useViewerStore();
  const viewerStoreApi = useViewerStoreApi();
  const isSelected = useSelectionStore((s) => s.selectedLayerId === layer.id);
  const setSelectedLayerId = useSelectionStore((s) => s.setSelectedLayerId);
  const interactionMode = useModeStore((s) => s.interactionMode);
  const invalidate = useThree((state) => state.invalidate);

  const resolvedVolumeLod = useMemo(() => {
    const maxLod = Math.max(0, layer.lens.dataset.dataArrays.length - 1);
    return [layer.fixedLOD, layer.defaultVolumeLOD].find(lod => typeof lod === 'number' && lod >= 0 && lod <= maxLod) ?? maxLod;
  }, [layer.defaultVolumeLOD, layer.fixedLOD, layer.lens.dataset.dataArrays.length]);

  const colorMapTexture = useMemo(() => getColorMapTexture(layer.colormap, layer.color), [layer.colormap, layer.color]);
  const affineMatrix = useMemo(() => buildAffineMatrix(layer), [layer]);

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;
    let uploadFramePending = false;

    const triggerTextureUpload = (texture: THREE.Data3DTexture) => {
      if (abortController.signal.aborted || uploadFramePending) return;
      uploadFramePending = true;
      requestAnimationFrame(() => {
        uploadFramePending = false;
        if (abortController.signal.aborted) return;
        texture.needsUpdate = true;
        invalidate();
      });
    };

    const initializeVolume = async () => {
      const dataArray = layer.lens.dataset.dataArrays[resolvedVolumeLod];
      if (!dataArray) return setVolumeTexture(null);

      const dims = layer.lens.dataset.dims;
      const arr = getArrayForStoreId(dataArray.store.id);
      const sliceMap = layer.lens.slices.reduce((acc, slice) => ({ ...acc, [slice.dim]: slice }), {} as Record<string, DimSliceFragment>);

      const pos = [dims.indexOf(layer.xDim ?? ""), dims.indexOf(layer.yDim ?? ""), layer.zDim ? dims.indexOf(layer.zDim) : -1];
      if (pos.includes(-1)) return setVolumeTexture(null);

      const spatialDims = new Set([layer.xDim, layer.yDim, layer.zDim].filter(Boolean));
      const selection = dims.map((dim, i) => {
        if (!spatialDims.has(dim)) return resolveCollapsedSelection(sliceMap[dim], arr.shape[i]);
        const s = sliceMap[dim];
        return s ? { start: s.start ?? 0, stop: s.stop ?? undefined, step: s.step ?? 1 } : null;
      });

      const indexer = new BasicIndexer({ selection, shape: arr.shape, chunk_shape: arr.chunks });
      if (indexer.shape.length !== 3) return setVolumeTexture(null);

      const outputAxis = pos.map(p => {
        if (typeof selection[p] === 'number') return -1;
        return selection.slice(0, p + 1).filter(s => typeof s !== 'number').length - 1;
      });
      if (outputAxis.includes(-1)) return setVolumeTexture(null);

      const outputShape = [...indexer.shape] as [number, number, number];
      const elementCount = outputShape.reduce((t, s) => t * s, 1);

      // Determine buffer configuration directly from data type (no more 'fidelity')
      const texConfig = createVolumeTextureBuffer(arr.dtype, elementCount);
      const texDims = getTextureDimensions(outputShape, outputAxis as [number, number, number]);
      const [minValue, maxValue] = mapDTypeToMinMax(arr.dtype);

      const texture = new THREE.Data3DTexture(texConfig.data, texDims.width, texDims.height, texDims.depth);
      texture.format = THREE.RedFormat;
      texture.type = texConfig.type;
      if (texConfig.internalFormat) texture.internalFormat = texConfig.internalFormat;
      texture.unpackAlignment = 1;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.wrapR = THREE.ClampToEdgeWrapping;
      texture.flipY = false;
      texture.needsUpdate = true;

      const destination = setter.prepare(texConfig.data as any, outputShape, get_strides(outputShape));
      const spatialSelections = pos.map((p, i) => resolveSpatialSelection(selection[p], arr.shape[p]));
      const scales = pos.map(p => dataArray.scaleFactors?.[p] ?? 1);
      const sizes = spatialSelections.map((sel, i) => sel.length * sel.step * scales[i]);
      const centers = spatialSelections.map((sel, i) => sel.start * scales[i] + sizes[i] / 2 - (arr.shape[pos[i]] * scales[i]) / 2);
      centers[1] = -centers[1]; // Y inversion

      if (!isMounted || abortController.signal.aborted) {
        texture.dispose();
        return;
      }

      setVolumeTexture({
        texture,
        dataScale: texConfig.dataScale,
        dimensionOrder: outputAxis as [number, number, number],
        minValue, maxValue,
        volumePosition: centers as [number, number, number],
        volumeSize: sizes as [number, number, number],
        spatialSelections: spatialSelections as [AxisSelection, AxisSelection, AxisSelection],
      });

      triggerTextureUpload(texture);

      const chunkLoaders = prioritizeChunkLoaders(Array.from(indexer), pos as [number, number, number], spatialSelections as any, arr.chunks);
      const concurrency = Math.max(4, Math.min(8, Math.floor((navigator.hardwareConcurrency || 8) / 2)));

      await runChunkLoaderQueue(chunkLoaders, concurrency, async ({ chunk_coords, mapping }) => {
        const chunk = await getChunkWorker(arr, chunk_coords, {
            pool: workerPool, priority: resolvedVolumeLod, signal: abortController.signal, useSharedArrayBuffer: true
        });
        if (!isMounted || abortController.signal.aborted) return;

        // Skip CPU normalization—write the raw chunk directly into the TypedArray buffer
        setter.set_from_chunk(destination, chunk, mapping as any);
        triggerTextureUpload(texture);
      });
    };

    initializeVolume().catch(err => {
      if (err.name !== 'AbortError') console.error(`Failed to init volume layer ${layer.id}`, err);
    });

    return () => {
      isMounted = false;
      abortController.abort();
      setVolumeTexture(prev => { prev?.texture.dispose(); return null; });
    };
  }, [getArrayForStoreId, invalidate, layer, resolvedVolumeLod]);

  const probeCoordinateFromRay = (ray: THREE.Ray): [number, number, number] | null => {
    if (!volumeTexture || !volumeMeshRef.current) return null;
    const inverseMatrix = new THREE.Matrix4().copy(volumeMeshRef.current.matrixWorld).invert();
    const localOrigin = ray.origin.clone().applyMatrix4(inverseMatrix);
    const localDirection = ray.direction.clone().transformDirection(inverseMatrix).normalize();
    const bounds = intersectLocalVolumeBox(localOrigin, localDirection);

    if (!bounds) return null;

    const localHit = marchVolumeTexture({
      ...volumeTexture, colorMapTexture, direction: localDirection, origin: localOrigin, bounds,
      climMax: layer.climMax ?? 1, climMin: layer.climMin ?? 0, threshold: probeThreshold,
    });

    return localHit ? [
      THREE.MathUtils.clamp(localHit[0], -0.5, 0.5),
      THREE.MathUtils.clamp(localHit[1], -0.5, 0.5),
      THREE.MathUtils.clamp(localHit[2], -0.5, 0.5),
    ] : null;
  };

  const updateProbe = (localPos: [number, number, number] | null) => {
    const state = viewerStoreApi.getState();
    if (!localPos) {
      if (state.probedCoordinate?.layerId === layer.id) state.setProbedCoordinate(null);
      return;
    }

    const [xSel, ySel, zSel] = volumeTexture?.spatialSelections ?? [];
    if (!xSel) return;

    const nextProbe = {
      layerId: layer.id,
      localPos,
      voxelIndex: [
        resolveVoxelIndex(localPos[0] + 0.5, xSel),
        resolveVoxelIndex(0.5 - localPos[1], ySel),
        resolveVoxelIndex(localPos[2] + 0.5, zSel),
      ] as [number, number, number],
    };

    const cur = state.probedCoordinate;
    if (cur?.layerId === nextProbe.layerId && cur.voxelIndex.every((v, i) => v === nextProbe.voxelIndex[i])) return;

    state.setProbedCoordinate(nextProbe);
  };

  if (!volumeTexture) return null;

  return (
    <group
      matrix={affineMatrix}
      matrixAutoUpdate={false}
      onPointerMove={(e) => {
        if (interactionMode !== 'AUTO_PROBE' || e.buttons !== 0) return;
        const localPos = probeCoordinateFromRay(e.ray);
        updateProbe(localPos);
        if (localPos) e.stopPropagation();
      }}
      onPointerOut={() => interactionMode === 'AUTO_PROBE' && updateProbe(null)}
      onPointerDown={(e) => {
        if (!['PROBE', 'AUTO_PROBE'].includes(interactionMode)) return;
        e.stopPropagation();
        skipSelectionClickRef.current = true;
        const localPos = probeCoordinateFromRay(e.ray);
        updateProbe(localPos);
        if (e.shiftKey && localPos) {
          const probe = viewerStoreApi.getState().probedCoordinate;
          if (probe?.layerId === layer.id) viewerStoreApi.getState().addSavedProbe(probe);
        }
      }}
      onClick={(e) => {
        if (skipSelectionClickRef.current) {
          skipSelectionClickRef.current = false;
          return;
        }
        if (['PROBE', 'AUTO_PROBE'].includes(interactionMode) || e.altKey) return;
        e.stopPropagation();
        setSelectedLayerId(isSelected ? null : layer.id);
      }}
    >
      <InvertedHullOutline enabled={isSelected && isDebug}>
        <VolumeTextureMesh
          volumeMeshRef={volumeMeshRef}
          layerId={layer.id}
          colorMapTexture={colorMapTexture}
          {...volumeTexture}
        />
      </InvertedHullOutline>
    </group>
  );
};
