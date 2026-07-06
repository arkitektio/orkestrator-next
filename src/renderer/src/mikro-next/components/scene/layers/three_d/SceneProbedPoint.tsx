import { useMemo } from 'react';
import * as THREE from 'three';

import { buildAffineMatrix } from '../../panels/layer/affine-utils';
import { useSceneStore, type LayerState } from '../../store/sceneStore';
import { useViewerStore, type ProbedCoordinate } from '../../store/viewerStore';

type AxisSelection = {
  start: number;
  step: number;
  length: number;
};

export const SceneProbedPoint = () => {
  const probedCoordinate = useViewerStore((s) => s.probedCoordinate);
  const savedProbes = useViewerStore((s) => s.savedProbes);
  const getArrayForStoreId = useViewerStore((s) => s.getArrayForStoreId);
  const worldUnitsPerPixel = useViewerStore((s) => s.worldUnitsPerPixel);
  const layers = useSceneStore((s) => s.layers);

  const markerStates = useMemo(() => {
    const probes: Array<{ probe: ProbedCoordinate; kind: 'active' | 'saved' }> = [];

    if (probedCoordinate) {
      probes.push({ probe: probedCoordinate, kind: 'active' });
    }

    savedProbes.forEach((probe) => {
      probes.push({ probe, kind: 'saved' });
    });

    return probes.flatMap(({ probe, kind }) => {
      const layer = layers.find((candidate) => candidate.id === probe.layerId);
      if (!layer || layer.visible === false) {
        return [];
      }

      const markerState = resolveMarkerState(layer, probe, getArrayForStoreId, worldUnitsPerPixel);
      if (!markerState) {
        return [];
      }

      return [{
        ...markerState,
        key: `${kind}:${probe.layerId}:${probe.voxelIndex.join(':')}`,
        kind,
      }];
    });
  }, [getArrayForStoreId, layers, probedCoordinate, savedProbes, worldUnitsPerPixel]);

  if (markerStates.length === 0) {
    return null;
  }

  return (
    <>
      {markerStates.map((markerState) => (
        <group key={markerState.key} matrix={markerState.affineMatrix} matrixAutoUpdate={false}>
          <group position={markerState.markerPosition} renderOrder={4}>
            <mesh scale={markerState.markerRadius}>
              <sphereGeometry args={[1, 24, 16]} />
              <meshBasicMaterial
                color={markerState.kind === 'active' ? '#f97316' : '#14b8a6'}
                depthWrite={false}
              />
            </mesh>
            <mesh scale={markerState.markerRadius * 1.65}>
              <sphereGeometry args={[1, 24, 16]} />
              <meshBasicMaterial
                color={markerState.kind === 'active' ? '#fb923c' : '#2dd4bf'}
                transparent
                opacity={0.2}
                depthWrite={false}
              />
            </mesh>
          </group>
        </group>
      ))}
    </>
  );
};

function resolveMarkerState(
  layer: LayerState,
  probe: ProbedCoordinate,
  getArrayForStoreId: (storeId: string) => { shape: readonly number[] },
  worldUnitsPerPixel: number,
) {
  const resolvedVolumeLod = getResolvedVolumeLod(layer);
  const dataArray = layer.lens.dataset.dataArrays[resolvedVolumeLod];
  if (!dataArray) {
    return null;
  }

  try {
    const arr = getArrayForStoreId(dataArray.store.id);
    const dims = layer.lens.dataset.dims;
    const sliceMap = layer.lens.slices.reduce<Record<string, LayerState['lens']['slices'][number]>>((acc, slice) => {
      acc[slice.dim] = slice;
      return acc;
    }, {});

    const xPos = dims.indexOf(layer.xDim ?? "");
    const yPos = dims.indexOf(layer.yDim ?? "");
    const zPos = layer.zDim ? dims.indexOf(layer.zDim) : -1;

    if (xPos === -1 || yPos === -1 || zPos === -1) {
      return null;
    }

    const xSelection = resolveSpatialSelection(sliceMap[layer.xDim ?? ""], arr.shape[xPos]);
    const ySelection = resolveSpatialSelection(sliceMap[layer.yDim ?? ""], arr.shape[yPos]);
    const zSelection = resolveSpatialSelection(sliceMap[layer.zDim as string], arr.shape[zPos]);
    const scaleX = dataArray.scaleFactors?.[xPos] ?? 1;
    const scaleY = dataArray.scaleFactors?.[yPos] ?? 1;
    const scaleZ = dataArray.scaleFactors?.[zPos] ?? 1;

    const totalX = arr.shape[xPos] * scaleX;
    const totalY = arr.shape[yPos] * scaleY;
    const totalZ = arr.shape[zPos] * scaleZ;

    const width = xSelection.length * xSelection.step * scaleX;
    const height = ySelection.length * ySelection.step * scaleY;
    const depth = zSelection.length * zSelection.step * scaleZ;

    const volumePosition: [number, number, number] = [
      xSelection.start * scaleX + width / 2 - totalX / 2,
      -(ySelection.start * scaleY + height / 2 - totalY / 2),
      zSelection.start * scaleZ + depth / 2 - totalZ / 2,
    ];
    const volumeSize: [number, number, number] = [width, height, depth];
    const markerPosition: [number, number, number] = [
      volumePosition[0] + probe.localPos[0] * volumeSize[0],
      volumePosition[1] + probe.localPos[1] * volumeSize[1],
      volumePosition[2] + probe.localPos[2] * volumeSize[2],
    ];
    const nonZeroAxes = volumeSize.map((axis) => Math.abs(axis)).filter((axis) => axis > 0);
    const minAxis = nonZeroAxes.length > 0 ? Math.min(...nonZeroAxes) : 1;

    return {
      affineMatrix: buildAffineMatrix(layer),
      markerPosition,
      markerRadius: THREE.MathUtils.clamp(worldUnitsPerPixel * 6, minAxis * 0.004, minAxis * 0.03),
    };
  } catch {
    return null;
  }
}

function getResolvedVolumeLod(layer: LayerState): number {
  const highestAvailableLod = Math.max(0, layer.lens.dataset.dataArrays.length - 1);
  if (typeof layer.fixedLOD === 'number' && layer.fixedLOD >= 0 && layer.fixedLOD <= highestAvailableLod) {
    return layer.fixedLOD;
  }
  if (
    typeof layer.defaultVolumeLOD === 'number' &&
    layer.defaultVolumeLOD >= 0 &&
    layer.defaultVolumeLOD <= highestAvailableLod
  ) {
    return layer.defaultVolumeLOD;
  }
  return highestAvailableLod;
}

function resolveSpatialSelection(
  slice: LayerState['lens']['slices'][number] | undefined,
  axisLength: number,
): AxisSelection {
  const step = Math.max(1, slice?.step ?? 1);
  const start = Math.max(0, Math.min(axisLength, slice?.start ?? 0));
  const stop = Math.max(start, Math.min(axisLength, slice?.stop ?? axisLength));
  const length = stop <= start ? 0 : Math.max(1, Math.ceil((stop - start) / step));

  return { start, step, length };
}
