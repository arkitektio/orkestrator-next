import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { buildAffineMatrix } from '../../core/worldTransform';
import { hasValidSpatialAxes, resolveAxisIndices } from '../../core/dims';
import {
  AxisSelection,
  buildSliceMap,
  resolveSpatialSelection,
  resolveVoxelIndex,
} from '../../core/selection';

import { ChunkPlane } from './ChunkPlane';
import { useModeStore } from '../../store/modeStore';
import { useViewerStore, useViewerStoreApi } from '../../store/viewerStore';
import { useSceneStore } from '../../store/sceneStore';

type ProbeGeometryContext = {
  xSelection: AxisSelection;
  ySelection: AxisSelection;
  zSelection: AxisSelection;
  volumePosition: [number, number, number];
  volumeSize: [number, number, number];
};

/**
 * Executor for the store-held chunk plan: which chunks exist (and in which
 * role — loading target vs interim cover) is decided by the chunk-plan
 * tracker (`managers/chunkPlanTracker.ts` → `core/chunkPlanning.ts`), NOT
 * here. This component renders the planned chunks, registers itself as a
 * trackable for visibility, and handles probing.
 */
export const PlaneLayer = ({ layerId }: { layerId: string }) => {
  const groupRef = useRef<THREE.Group>(null!);

  // Store Hooks
  const register = useViewerStore((s) => s.register);
  const unregister = useViewerStore((s) => s.unregister);
  const getArrayForStoreId = useViewerStore((s) => s.getArrayForStoreId);
  const currentZ = useViewerStore((s) => s.currentZ);
  const plan = useViewerStore((s) => s.chunkPlans[layerId]);
  const viewerStoreApi = useViewerStoreApi();

  const layer = useSceneStore((s) => s.layers.find((l) => l.id === layerId));
  const interactionMode = useModeStore((s) => s.interactionMode);

  // Scene Registration
  useEffect(() => {
    const refProxy = { kind: "layer" as const, id: layerId, ref: groupRef };
    register(refProxy);
    return () => unregister(refProxy);
  }, [layerId, register, unregister]);

  const affineMatrix = useMemo(() => {
    if (!layer) return new THREE.Matrix4().identity();
    return buildAffineMatrix(layer);
  }, [layer]);

  const resolveProbeGeometryContext = useCallback((): ProbeGeometryContext | null => {
    if (!layer) return null;

    const targetLod = plan?.targetLod ?? Math.max(0, layer.lens.dataset.dataArrays.length - 1);
    const dataArray = layer.lens.dataset.dataArrays[targetLod];
    if (!dataArray) return null;

    let arr: ReturnType<typeof getArrayForStoreId>;
    try {
      arr = getArrayForStoreId(dataArray.store.id);
    } catch {
      return null;
    }
    const scaleFactors = dataArray.scaleFactors ?? undefined;

    const dims = layer.lens.dataset.dims;
    const { xPos, yPos, zPos } = resolveAxisIndices(dims, layer);
    if (!hasValidSpatialAxes({ xPos, yPos, zPos })) return null;

    const sliceMap = buildSliceMap(layer.lens.slices);

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
  }, [plan?.targetLod, currentZ, layer, getArrayForStoreId]);

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

  if (layer?.visible === false) return null;
  if (!plan || plan.chunks.length === 0) return null;

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
      {plan.chunks.map((chunk) => (
        <ChunkPlane key={chunk.chunkKey} chunk={chunk} />
      ))}
    </group>
  );
};
