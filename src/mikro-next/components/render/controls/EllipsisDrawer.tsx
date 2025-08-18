import { Line } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

export type EllipsisDrawerProps = {
  onEllipsisDrawn?: (
    center: THREE.Vector3,
    radiusX: number,
    radiusY: number,
  ) => void;
};

export function EllipsisDrawer(props: EllipsisDrawerProps) {
  const planeRef = useRef<THREE.Mesh>(null);

  const [center, setCenter] = useState<THREE.Vector3 | null>(null);
  const [current, setCurrent] = useState<THREE.Vector3 | null>(null);
  const [drawing, setDrawing] = useState(false);

  const handlePointerDown = (e) => {
    if (!e.shiftKey) return; // Require Shift to start

    e.stopPropagation();
    // Start from center
    setCenter(e.point.clone());
    setCurrent(e.point.clone());
    setDrawing(true);
  };

  const handlePointerMove = (e) => {
    if (!drawing || !center || !e.shiftKey) return; // Still require Shift while dragging
    e.stopPropagation();
    setCurrent(e.point.clone());
  };

  const handlePointerUp = () => {
    setDrawing(false);
    if (center && current) {
      // Calculate radii from center to current point
      const radiusX = Math.abs(current.x - center.x);
      const radiusY = Math.abs(current.y - center.y);
      props.onEllipsisDrawn?.(center.clone(), radiusX, radiusY);
      // Clear the states after drawing is complete
      setCenter(null);
      setCurrent(null);
    }
  };

  // Generate ellipse points for preview
  const points = (() => {
    if (!center || !current) return [];
    const radiusX = Math.abs(current.x - center.x);
    const radiusY = Math.abs(current.y - center.y);
    const segments = 32;
    const points: THREE.Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = center.x + Math.cos(angle) * radiusX;
      const y = center.y + Math.sin(angle) * radiusY;
      points.push(new THREE.Vector3(x, y, 0));
    }

    return points;
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

      {/* The drawn ellipse line */}
      {points.length > 0 && (
        <Line points={points} color="orange" lineWidth={1} />
      )}
    </>
  );
}
