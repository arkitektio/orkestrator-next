import { Line } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

export type LineDrawerProps = {
  onLineDrawn?: (start: THREE.Vector3, end: THREE.Vector3) => void;
};

export function LineDrawer(props: LineDrawerProps) {
  const planeRef = useRef<THREE.Mesh>(null);

  const [start, setStart] = useState<THREE.Vector3 | null>(null);
  const [end, setEnd] = useState<THREE.Vector3 | null>(null);
  const [drawing, setDrawing] = useState(false);

  const handlePointerDown = (e) => {
    if (!e.shiftKey) return; // Require Shift to start

    e.stopPropagation();
    setStart(e.point.clone());
    setEnd(e.point.clone());
    setDrawing(true);
  };

  const handlePointerMove = (e) => {
    if (!drawing || !start || !e.shiftKey) return; // Still require Shift while dragging
    e.stopPropagation();
    setEnd(e.point.clone());
  };

  const handlePointerUp = () => {
    setDrawing(false);
    if (start && end) {
      props.onLineDrawn?.(start.clone(), end.clone());
      // Clear the states after drawing is complete
      setStart(null);
      setEnd(null);
    }
  };

  const points = (() => {
    if (!start || !end) return [];
    return [start, end];
  })();

  return (
    <>
      {/* Invisible plane for interaction */}
      <mesh
        ref={planeRef}
        position={[0, 0, 1]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[10000, 10000]} />
        <meshStandardMaterial
          color="lightgray"
          opacity={0.001}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* The drawn line */}
      {points.length > 0 && (
        <Line points={points} color="orange" lineWidth={2} />
      )}
    </>
  );
}
