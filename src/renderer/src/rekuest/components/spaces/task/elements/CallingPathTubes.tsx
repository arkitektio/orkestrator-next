import { useMemo, useRef } from "react";
import { useSpaceViewStore } from "../store";
import { SpaceGroup, SpaceGroupPlacement } from "../types";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { BrandColors } from "./brandColors";

// ── helpers ─────────────────────────────────────────────────────────

function extractPositionFromMatrix(matrix: number[][]): THREE.Vector3 {
  const flat = matrix.flat() as number[];
  if (flat.length < 16) return new THREE.Vector3();
  const m = new THREE.Matrix4().fromArray(flat).transpose();
  return new THREE.Vector3().setFromMatrixPosition(m);
}

// ── animated tube ────────────────────────────────────────────────────

const TUBE_RADIUS = 0.025;
const SPHERE_RADIUS = 0.055;

const AnimatedMaterial = ({ color }: { color: string }) => {
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);
  const threeColor = useMemo(() => new THREE.Color(color), [color]);
  useFrame(({ clock }) => {
    if (matRef.current) {
      const t = (Math.sin(clock.elapsedTime * 2.5) + 1) * 0.5;
      matRef.current.emissiveIntensity = 0.4 + t * 0.6;
    }
  });
  return (
    <meshStandardMaterial
      ref={matRef}
      color={threeColor}
      emissive={threeColor}
      emissiveIntensity={0.6}
      transparent
      opacity={0.75}
      roughness={0.3}
      metalness={0.5}
    />
  );
};

const DirectTube = ({
  from,
  to,
  color,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  color: string;
}) => {
  const geometry = useMemo(() => {
    const curve = new THREE.LineCurve3(from, to);
    return new THREE.TubeGeometry(curve, 1, TUBE_RADIUS, 8, false);
  }, [from, to]);

  return (
    <mesh geometry={geometry}>
      <AnimatedMaterial color={color} />
    </mesh>
  );
};

const JunctionSphere = ({ position, color }: { position: THREE.Vector3; color: string }) => (
  <mesh position={position}>
    <sphereGeometry args={[SPHERE_RADIUS, 12, 12]} />
    <AnimatedMaterial color={color} />
  </mesh>
);

// ── main component ───────────────────────────────────────────────────

export const CallingPathTubes = ({ group, brandColors }: { group: SpaceGroup; brandColors: BrandColors }) => {
  const rootAgentId = useSpaceViewStore((s) => s.rootAgentId);
  const selectedTimepoint = useSpaceViewStore((s) => s.selectedTimepoint);
  const activeAgentIds = useSpaceViewStore((s) => s.activeAgentIds);
  const computedTransforms = useSpaceViewStore((s) => s.computedTransforms);

  const connections = useMemo(() => {
    const rootPlacement = group.placements.find(
      (p): p is SpaceGroupPlacement =>
        p.isRoot === true || p.agentId === rootAgentId,
    );

    const activePlacements = group.placements.filter(
      (p) => p.agentId !== rootAgentId && !p.isRoot && activeAgentIds.has(p.agentId),
    );

    if (!rootPlacement || activePlacements.length === 0) return [];

    const rootMatrix = computedTransforms.get(rootPlacement.id);
    if (!rootMatrix) return [];
    const rootPos = extractPositionFromMatrix(rootMatrix);

    return activePlacements
      .map((p) => {
        const mat = computedTransforms.get(p.id);
        if (!mat) return null;
        return { id: p.id, from: rootPos, to: extractPositionFromMatrix(mat) };
      })
      .filter((c): c is { id: string; from: THREE.Vector3; to: THREE.Vector3 } => c !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group.placements, rootAgentId, activeAgentIds, selectedTimepoint, computedTransforms]);

  if (connections.length === 0) return null;

  return (
    <group>
      {connections.map(({ id, from, to }) => (
        <group key={id}>
          <DirectTube from={from} to={to} color={brandColors.chart2} />
          <JunctionSphere position={from} color={brandColors.chart1} />
          <JunctionSphere position={to} color={brandColors.chart2} />
        </group>
      ))}
    </group>
  );
};
