import { Line } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

export type PolygonDrawerProps = {
  onPolygonDrawn?: (points: THREE.Vector3[]) => void;
};

export function PolygonDrawer(props: PolygonDrawerProps) {
  const planeRef = useRef<THREE.Mesh>(null);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [currentPoint, setCurrentPoint] = useState<THREE.Vector3 | null>(null);

  const handlePointerDown = (e) => {
    if (!e.shiftKey) return; // Require Shift to draw

    e.stopPropagation();
    const newPoint = e.point.clone();

    // Double-click or click near first point to close polygon
    if (points.length > 2) {
      const firstPoint = points[0];
      const distance = newPoint.distanceTo(firstPoint);
      if (distance < 20) {
        // Close polygon if clicking near first point
        props.onPolygonDrawn?.(points);
        setPoints([]);
        setCurrentPoint(null);
        return;
      }
    }

    // Add point to polygon
    setPoints((prev) => [...prev, newPoint]);
  };

  const handlePointerMove = (e) => {
    if (!e.shiftKey) return;
    e.stopPropagation();
    setCurrentPoint(e.point.clone());
  };

  const handleDoubleClick = (e) => {
    if (!e.shiftKey || points.length < 3) return;
    e.stopPropagation();

    // Complete the polygon
    props.onPolygonDrawn?.(points);
    setPoints([]);
    setCurrentPoint(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      // Cancel current polygon
      setPoints([]);
      setCurrentPoint(null);
    } else if (e.key === "Enter" && points.length >= 3) {
      // Complete polygon
      props.onPolygonDrawn?.(points);
      setPoints([]);
      setCurrentPoint(null);
    }
  };

  // Generate preview lines
  const linePoints = (() => {
    if (points.length === 0) return [];

    let allPoints = [...points];

    if (currentPoint && points.length > 0) {
      allPoints.push(currentPoint);
    }

    // Close the polygon preview if we have enough points and are near the start
    if (points.length > 2 && currentPoint) {
      const firstPoint = points[0];
      const distance = currentPoint.distanceTo(firstPoint);
      if (distance < 20) {
        allPoints[allPoints.length - 1] = firstPoint;
      }
    }

    return allPoints;
  })();

  return (
    <>
      {/* Invisible plane for interaction */}
      <mesh
        ref={planeRef}
        position={[0, 0, 1]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <planeGeometry args={[10000, 10000]} />
        <meshStandardMaterial
          color="lightgray"
          opacity={0.001}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* Draw existing points */}
      {points.map((point, index) => (
        <mesh key={index} position={[point.x, point.y, 0.1]}>
          <circleGeometry args={[3, 8]} />
          <meshBasicMaterial color="orange" />
        </mesh>
      ))}

      {/* Draw lines between points */}
      {linePoints.length > 1 && (
        <Line points={linePoints} color="orange" lineWidth={2} />
      )}

      {/* Show close indicator when near first point */}
      {points.length > 2 &&
        currentPoint &&
        points[0] &&
        currentPoint.distanceTo(points[0]) < 20 && (
          <mesh position={[points[0].x, points[0].y, 0.1]}>
            <circleGeometry args={[8, 8]} />
            <meshBasicMaterial color="red" transparent opacity={0.5} />
          </mesh>
        )}
    </>
  );
}
