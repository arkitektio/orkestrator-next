import { useFrame } from "@react-three/fiber";
import { useViewStore } from "./store/viewStore";
import * as THREE from "three";
import { useRef, useEffect } from "react";

export const CameraMatrixSync = ({ debounceMs = 150 }: { debounceMs?: number }) => {
  const updateCameraData = useViewStore((s) => s.updateCameraData);

  const matrixRef = useRef(new THREE.Matrix4());
  const previousFrameMatrix = useRef(new THREE.Matrix4());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up the timeout if the component ever unmounts to prevent memory leaks
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useFrame(({ camera, size }) => {
    // 1. Calculate the current view-projection matrix
    matrixRef.current.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );

    // 2. Check for movement SINCE THE LAST FRAME
    let isMoving = false;
    for (let i = 0; i < 16; i++) {
      // 0.0001 ignores invisible damping jitters, but reliably catches real movement
      if (Math.abs(matrixRef.current.elements[i] - previousFrameMatrix.current.elements[i]) > 0.0001) {
        isMoving = true;
        break;
      }
    }

    // 3. Always update the previous frame matrix for the next loop
    previousFrameMatrix.current.copy(matrixRef.current);

    // 4. The Debounce Logic
    if (isMoving) {
      // As long as the camera is moving, we keep cancelling the timer
      clearTimeout(timeoutRef.current);

      // Set a new timer. Once the camera stops (isMoving is false),
      // this timer will finally be allowed to finish and push to Zustand.
      timeoutRef.current = setTimeout(() => {
        updateCameraData(matrixRef.current.clone(), {
          width: size.width,
          height: size.height,
        });
      }, debounceMs);
    }
  });

  return null;
};
