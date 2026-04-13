import { useRef } from "react";
import { SpaceGroup } from "../types";
import { PlacementObject } from "./PlacementObject";
import { useSpaceViewStore } from "../store";
import { Box3, Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BrandColors } from "./brandColors";

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
  const groupRef = useRef<Group>(null!);

  return (
    <group position={offset}>
      <group ref={groupRef}>
        {group.placements.map((p) => (
          <PlacementObject key={p.id} placement={p} brandColors={brandColors} />
        ))}
      </group>
      {debugWireframe && <WireframeBounds groupRef={groupRef} />}
    </group>
  );
};
