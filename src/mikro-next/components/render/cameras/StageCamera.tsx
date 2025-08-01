import { OrthographicCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

export const StageCamera = ({}: { contextId: string }) => {
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const { size } = useThree();

  // Store the camera's offset from the image center to maintain panning
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initial setup only - run once to center the camera on the image
  useEffect(() => {
    if (!cameraRef.current) return;

    // Initially center the camera on the image
    cameraRef.current.position.set(0, 0, 5);
    offsetRef.current = { x: 0, y: 0 };
  }, [0, 0]);

  return (
    <OrthographicCamera
      ref={cameraRef}
      position={[0, 0, 5]}
      near={0.1}
      far={1000}
      makeDefault
    />
  );
};
