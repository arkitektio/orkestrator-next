import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { nodeBaseBox } from "../core/octree/nodeAddress";
import { buildVolumeVoxelToWorld } from "../core/octree/voxelFrame";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";

/**
 * Debug wireframes of the resident bricks, colored by pyramid level (finest
 * = green → coarser = red; uniform "empty" bricks dimmed). One merged
 * LineSegments per (layer, level) rebuilt on residency changes — debug-only,
 * gated on the viewer's debug flag + the octree renderer flag.
 */

const LEVEL_COLORS = ["#22c55e", "#eab308", "#f97316", "#ef4444", "#a855f7", "#64748b"];

const BOX_EDGES: [number, number][] = [
  [0, 1], [1, 3], [3, 2], [2, 0], // bottom
  [4, 5], [5, 7], [7, 6], [6, 4], // top
  [0, 4], [1, 5], [2, 6], [3, 7], // pillars
];

export function BrickResidencyOverlay() {
  const debug = useViewerStore((s) => s.debug);
  const enabled = useViewerStore((s) => s.useOctreeRenderer);
  const residencyVersion = useViewerStore((s) => s.residencyVersion);
  const brickSystem = useViewerStore((s) => s.brickSystem);
  const layers = useSceneStore((s) => s.layers);

  const groups = useMemo(() => {
    if (!debug || !enabled || !brickSystem) return [];
    const residency = brickSystem.snapshotResidency();

    return layers.flatMap((layer) => {
      const pool = brickSystem.getLayerPool(layer.id);
      const bricks = residency[layer.id];
      if (!pool || !bricks || bricks.length === 0) return [];

      const byLevel = new Map<number, { positions: number[]; empty: boolean }[]>();
      for (const brick of bricks) {
        const box = nodeBaseBox(pool.geometry, pool.spec, brick.level, brick.coords);
        const corners: [number, number, number][] = [];
        for (let z = 0; z <= 1; z++)
          for (let y = 0; y <= 1; y++)
            for (let x = 0; x <= 1; x++)
              corners.push([
                x ? box.max[0] : box.min[0],
                y ? box.max[1] : box.min[1],
                z ? box.max[2] : box.min[2],
              ]);
        const positions: number[] = [];
        for (const [a, b] of BOX_EDGES) positions.push(...corners[a], ...corners[b]);
        const bucket = byLevel.get(brick.level) ?? [];
        bucket.push({ positions, empty: brick.empty });
        byLevel.set(brick.level, bucket);
      }

      const matrix = buildVolumeVoxelToWorld(layer);
      const segments = [...byLevel.entries()].flatMap(([level, entries]) =>
        [false, true].flatMap((empty) => {
          const subset = entries.filter((e) => e.empty === empty);
          if (subset.length === 0) return [];
          const array = new Float32Array(subset.flatMap((e) => e.positions));
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute("position", new THREE.BufferAttribute(array, 3));
          return [{ level, empty, geometry }];
        }),
      );
      return [{ layerId: layer.id, matrix, segments }];
    });
    // residencyVersion is the rebuild trigger even though it's not read here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debug, enabled, brickSystem, layers, residencyVersion]);

  // Wireframe geometries are rebuilt per residency change — dispose the
  // superseded generation or every streaming batch leaks GPU buffers.
  useEffect(() => {
    return () => {
      for (const group of groups) {
        for (const segment of group.segments) segment.geometry.dispose();
      }
    };
  }, [groups]);

  if (groups.length === 0) return null;

  return (
    <>
      {groups.map(({ layerId, matrix, segments }) => (
        <group key={layerId} matrix={matrix} matrixAutoUpdate={false}>
          {segments.map(({ level, empty, geometry }) => (
            <lineSegments key={`${level}-${empty}`} geometry={geometry}>
              <lineBasicMaterial
                color={LEVEL_COLORS[Math.min(level, LEVEL_COLORS.length - 1)]}
                transparent
                opacity={empty ? 0.15 : 0.6}
                depthWrite={false}
              />
            </lineSegments>
          ))}
        </group>
      ))}
    </>
  );
}
