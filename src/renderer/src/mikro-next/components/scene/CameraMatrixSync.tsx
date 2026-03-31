import { useFrame } from "@react-three/fiber";
import { useViewStore } from "./store/viewStore";
import * as THREE from "three";
import { useRef, useEffect } from "react";

interface CameraMatrixSyncProps {
  debounceMs?: number;
  threshold?: number;
}

export const CameraMatrixSync = ({
  debounceMs = 150,
  threshold = 0.00001
}: CameraMatrixSyncProps) => {
  const updateCameraData = useViewStore((s) => s.updateCameraData);

  const matrixRef = useRef(new THREE.Matrix4());
  const previousFrameMatrix = useRef(new THREE.Matrix4());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useFrame(({ camera, size }) => {
    // 1. CRITICAL: Force update the projection matrix.
    // This ensures Zoom and FOV changes are reflected in the matrix elements.
    camera.updateProjectionMatrix();

    // 2. Calculate the combined View-Projection Matrix
    matrixRef.current.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );

    // 3. Movement/Zoom check
    let hasChanged = false;
    const cur = matrixRef.current.elements;
    const prev = previousFrameMatrix.current.elements;

    for (let i = 0; i < 16; i++) {
      if (Math.abs(cur[i] - prev[i]) > threshold) {
        hasChanged = true;
        break;
      }
    }

    // 4. If nothing changed, we exit early to save CPU
    if (!hasChanged) return;

    // 5. Update previous state for next frame check
    previousFrameMatrix.current.copy(matrixRef.current);

    // 6. Debounce logic
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Capture the state at this exact moment
    const snapshot = matrixRef.current.clone();
    const currentSize = { width: size.width, height: size.height };

    timeoutRef.current = setTimeout(() => {
      updateCameraData(snapshot, currentSize);
      console.log("Camera stopped. Syncing matrix to store.");
    }, debounceMs);
  });

  return null;
};
