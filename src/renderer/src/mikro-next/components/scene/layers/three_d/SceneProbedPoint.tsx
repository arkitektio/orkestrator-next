import { useMemo } from 'react';

import { resolveProbeMarkerGeometry } from '../../core/probeWorld';
import { useSceneStore } from '../../store/sceneStore';
import { useViewerStore, type ProbedCoordinate } from '../../store/viewerStore';

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

      const markerState = resolveProbeMarkerGeometry(layer, probe, getArrayForStoreId, worldUnitsPerPixel);
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

