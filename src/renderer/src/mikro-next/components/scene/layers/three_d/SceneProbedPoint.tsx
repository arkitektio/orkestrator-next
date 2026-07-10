import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';

import {
  computeWorldUnitsPerPixel,
  probeMarkerRadius,
  resolveProbeMarkerGeometry,
} from '../../core/probeWorld';
import { useSceneStore } from '../../store/sceneStore';
import { useViewerStore, type ProbedCoordinate } from '../../store/viewerStore';

/** Screen-pixel radius + physical clamps for the 3D probe marker. */
const MARKER_PX = 6;
const MARKER_MIN_FRACTION = 0.004;
const MARKER_MAX_FRACTION = 0.03;

export const SceneProbedPoint = () => {
  const probedCoordinate = useViewerStore((s) => s.probedCoordinate);
  const savedProbes = useViewerStore((s) => s.savedProbes);
  const getArrayForStoreId = useViewerStore((s) => s.getArrayForStoreId);
  const layers = useSceneStore((s) => s.layers);

  // Camera-independent marker geometry: recomputed only on probe/layer events.
  // The camera-dependent radius (constant screen size) is applied imperatively
  // in useFrame below — NOT via a worldUnitsPerPixel store subscription, which
  // re-rendered this component (and re-ran this memo) every frame during any
  // camera motion (P17).
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

      const markerState = resolveProbeMarkerGeometry(layer, probe, getArrayForStoreId);
      if (!markerState) {
        return [];
      }

      return [{
        ...markerState,
        key: `${kind}:${probe.layerId}:${probe.voxelIndex.join(':')}`,
        kind,
      }];
    });
  }, [getArrayForStoreId, layers, probedCoordinate, savedProbes]);

  const scaledGroups = useRef(new Map<string, { group: THREE.Group; minAxis: number }>());

  // Constant-screen-size compensation, straight from the camera each rendered
  // frame (demand frameloop: frames only happen while something changes).
  useFrame(({ camera, size }) => {
    if (scaledGroups.current.size === 0) return;
    const wupp = computeWorldUnitsPerPixel(camera, size.height);
    for (const { group, minAxis } of scaledGroups.current.values()) {
      group.scale.setScalar(
        probeMarkerRadius(minAxis, wupp, MARKER_PX, MARKER_MIN_FRACTION, MARKER_MAX_FRACTION),
      );
    }
  });

  if (markerStates.length === 0) {
    return null;
  }

  return (
    <>
      {markerStates.map((markerState) => (
        <group key={markerState.key} matrix={markerState.affineMatrix} matrixAutoUpdate={false}>
          <group
            position={markerState.markerPosition}
            renderOrder={4}
            // Start invisible; the first useFrame sets the real radius before draw.
            scale={0}
            ref={(group) => {
              if (group) {
                scaledGroups.current.set(markerState.key, { group, minAxis: markerState.minAxis });
              } else {
                scaledGroups.current.delete(markerState.key);
              }
            }}
          >
            <mesh>
              <sphereGeometry args={[1, 24, 16]} />
              <meshBasicMaterial
                color={markerState.kind === 'active' ? '#f97316' : '#14b8a6'}
                depthWrite={false}
              />
            </mesh>
            <mesh scale={1.65}>
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
