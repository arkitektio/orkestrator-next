import { useRef, useState } from "react";
import * as THREE from "three";
import { EventKeyProps, createEventKeyChecker } from "./eventKeyUtils";

export type PointDrawerProps = {
  onPointDrawn?: (point: THREE.Vector3) => void;
} & EventKeyProps;

export function PointDrawer(props: PointDrawerProps) {
  const { event_key = "shift" } = props;
  const planeRef = useRef<THREE.Mesh>(null);
  const [previewPoint, setPreviewPoint] = useState<THREE.Vector3 | null>(null);

  const checkEventKey = createEventKeyChecker(event_key);

  const handlePointerDown = (e) => {
    if (!checkEventKey(e)) return; // Check for required event key

    e.stopPropagation();
    const point = e.point.clone();
    props.onPointDrawn?.(point);

    // Show brief preview
    setPreviewPoint(point);
    setTimeout(() => setPreviewPoint(null), 1000);
  };

  const handlePointerMove = (e) => {
    if (!checkEventKey(e)) return;
    e.stopPropagation();
    setPreviewPoint(e.point.clone());
  };

  const handlePointerLeave = () => {
    if (!previewPoint) return;
    setPreviewPoint(null);
  };

  return (
    <>
      {/* Invisible plane for interaction */}
      <mesh
        ref={planeRef}
        position={[0, 0, 1]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
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

      {/* Preview point */}
      {previewPoint && (
        <mesh position={[previewPoint.x, previewPoint.y, 0.1]}>
          <circleGeometry args={[5, 8]} />
          <meshBasicMaterial color="orange" />
        </mesh>
      )}
    </>
  );
}
