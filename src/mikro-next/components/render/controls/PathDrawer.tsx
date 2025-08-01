import { Line } from "@react-three/drei";
import { useRef, useState, useCallback } from "react";
import * as THREE from "three";

export type PathDrawerProps = {
  onPathDrawn?: (points: THREE.Vector3[]) => void;
};

export function PathDrawer(props: PathDrawerProps) {
  const planeRef = useRef<THREE.Mesh>(null);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [drawing, setDrawing] = useState(false);

  const handlePointerDown = (e) => {
    if (!e.shiftKey) return; // Require Shift to start drawing

    e.stopPropagation();
    setDrawing(true);
    const newPoint = e.point.clone();
    setPoints([newPoint]);
  };

  const handlePointerMove = useCallback(
    (e) => {
      if (!drawing || !e.shiftKey) return;
      e.stopPropagation();

      const newPoint = e.point.clone();
      setPoints((prev) => {
        // Only add point if it's far enough from the last point
        const lastPoint = prev[prev.length - 1];
        if (lastPoint && newPoint.distanceTo(lastPoint) < 5) {
          return prev;
        }
        return [...prev, newPoint];
      });
    },
    [drawing],
  );

  const handlePointerUp = () => {
    if (!drawing) return;

    setDrawing(false);
    if (points.length > 1) {
      props.onPathDrawn?.(points);
    }
    setPoints([]);
  };

  const handlePointerLeave = () => {
    if (drawing) {
      handlePointerUp();
    }
  };

  return (
    <>
      {/* Invisible plane for interaction */}
      <mesh
        ref={planeRef}
        position={[0, 0, 1]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[10000, 10000]} />
        <meshStandardMaterial
          color="lightgray"
          opacity={0.001}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* Draw the path as it's being created */}
      {points.length > 1 && (
        <Line
          points={points}
          color={drawing ? "orange" : "green"}
          lineWidth={2}
        />
      )}

      {/* Show current point while drawing */}
      {drawing && points.length > 0 && (
        <mesh
          position={[
            points[points.length - 1].x,
            points[points.length - 1].y,
            0.1,
          ]}
        >
          <circleGeometry args={[2, 8]} />
          <meshBasicMaterial color="orange" />
        </mesh>
      )}
    </>
  );
}
