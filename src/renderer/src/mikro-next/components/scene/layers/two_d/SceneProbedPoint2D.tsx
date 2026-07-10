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

/** Screen-pixel radius + physical clamps for the 2D probe marker. */
const MARKER_PX = 8;
const MARKER_MIN_FRACTION = 0.006;
const MARKER_MAX_FRACTION = 0.04;

export const SceneProbedPoint2D = () => {
  const probedCoordinate = useViewerStore((s) => s.probedCoordinate);
  const savedProbes = useViewerStore((s) => s.savedProbes);
  const getArrayForStoreId = useViewerStore((s) => s.getArrayForStoreId);
  const layers = useSceneStore((s) => s.layers);

  // Camera-independent geometry only (shared with the 3D marker and the
  // probe-orbit pivot via core/probeWorld). The camera-dependent radius is
  // applied in useFrame — no per-frame store subscription (P17).
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

  const scaledGroups = useRef(
    new Map<string, { group: THREE.Group; minAxis: number; baseZ: number }>(),
  );

  useFrame(({ camera, size }) => {
    if (scaledGroups.current.size === 0) return;
    const wupp = computeWorldUnitsPerPixel(camera, size.height);
    for (const { group, minAxis, baseZ } of scaledGroups.current.values()) {
      const radius = probeMarkerRadius(
        minAxis,
        wupp,
        MARKER_PX,
        MARKER_MIN_FRACTION,
        MARKER_MAX_FRACTION,
      );
      group.scale.setScalar(radius);
      // Lift slightly above the image plane, proportional to the marker size.
      group.position.z = baseZ + radius * 0.2;
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
            renderOrder={5}
            // Start invisible; the first useFrame sets the real radius before draw.
            scale={0}
            ref={(group) => {
              if (group) {
                scaledGroups.current.set(markerState.key, {
                  group,
                  minAxis: markerState.minAxis,
                  baseZ: markerState.markerPosition[2],
                });
              } else {
                scaledGroups.current.delete(markerState.key);
              }
            }}
          >
            <mesh>
              <ringGeometry args={[0.72, 1, 36]} />
              <meshBasicMaterial
                color={markerState.kind === 'active' ? '#f97316' : '#14b8a6'}
                transparent
                opacity={0.95}
                depthWrite={false}
              />
            </mesh>
            <mesh>
              <boxGeometry args={[2.1, 0.18, 0.04]} />
              <meshBasicMaterial
                color={markerState.kind === 'active' ? '#fb923c' : '#2dd4bf'}
                depthWrite={false}
              />
            </mesh>
            <mesh>
              <boxGeometry args={[0.18, 2.1, 0.04]} />
              <meshBasicMaterial
                color={markerState.kind === 'active' ? '#fb923c' : '#2dd4bf'}
                depthWrite={false}
              />
            </mesh>
          </group>
        </group>
      ))}
    </>
  );
};
