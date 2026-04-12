import { useMemo, useRef } from "react";
import { SpaceGroup } from "../types";
import { PlacementObject } from "./PlacementObject";
import { useSpaceViewStore } from "../store";
import { Box3, Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BrandColors } from "./brandColors";

const RADIAL_RADIUS = 2.5;

const WireframeBounds = ({ groupRef }: { groupRef: React.RefObject<Group> }) => {
  const boxRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (!groupRef.current || !boxRef.current) return;
    const box = new Box3().setFromObject(groupRef.current);
    if (box.isEmpty()) return;
    const center = new Vector3();
    const size = new Vector3();
    box.getCenter(center);
    box.getSize(size);
    boxRef.current.position.copy(center);
    boxRef.current.scale.set(
      Math.max(size.x, 0.1),
      Math.max(size.y, 0.1),
      Math.max(size.z, 0.1),
    );
  });

  return (
    <mesh ref={boxRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial wireframe color="#6366f1" transparent opacity={0.4} />
    </mesh>
  );
};

export const SpaceGroupObject = ({
  group,
  offset,
  brandColors,
}: {
  group: SpaceGroup;
  offset: [number, number, number];
  brandColors: BrandColors;
}) => {
  const debugWireframe = useSpaceViewStore((s) => s.debugWireframe);
  const layoutMode = useSpaceViewStore((s) => s.layoutMode);
  const rootAgentId = useSpaceViewStore((s) => s.rootAgentId);
  const groupRef = useRef<Group>(null!);

  // Compute radial positions: root at center, others equally spaced around it
  const radialPositions = useMemo(() => {
    if (layoutMode !== "radial") return null;
    const map = new Map<string, [number, number, number]>();
    const rootPlacement = group.placements.find(
      (p) => p.isRoot || p.agentId === rootAgentId,
    );
    const others = group.placements.filter(
      (p) => !p.isRoot && p.agentId !== rootAgentId,
    );

    if (rootPlacement) {
      map.set(rootPlacement.id, [0, 0, 0]);
    }

    others.forEach((p, i) => {
      const angle = (i / Math.max(others.length, 1)) * Math.PI * 2;
      const x = Math.cos(angle) * RADIAL_RADIUS;
      const z = Math.sin(angle) * RADIAL_RADIUS;
      map.set(p.id, [x, 0, z]);
    });

    return map;
  }, [layoutMode, group.placements, rootAgentId]);

  return (
    <group position={offset}>
      <group ref={groupRef}>
        {group.placements.map((p) => (
          <PlacementObject
            key={p.id}
            placement={p}
            brandColors={brandColors}
            overridePosition={radialPositions?.get(p.id) ?? null}
          />
        ))}
      </group>
      {debugWireframe && <WireframeBounds groupRef={groupRef} />}
    </group>
  );
};
