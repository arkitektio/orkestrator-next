import { useFrame } from "@react-three/fiber";
import { useViewStore } from "./store/viewStore";
import * as THREE from "three";
import { useRef, useEffect } from "react";

interface CameraMatrixSyncProps {
  /** Max cadence (ms) at which camera data is pushed DURING continuous motion. */
  throttleMs?: number;
  /** Trailing delay (ms) for the final push once the camera settles. */
  settleMs?: number;
  threshold?: number;
}

export const CameraMatrixSync = ({
  throttleMs = 60,
  settleMs = 150,
  threshold = 0.00001
}: CameraMatrixSyncProps) => {
  const updateCameraData = useViewStore((s) => s.updateCameraData);

  const matrixRef = useRef(new THREE.Matrix4());
  const previousFrameMatrix = useRef(new THREE.Matrix4());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEmitRef = useRef(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useFrame(({ camera, size, clock }) => {
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

    // Capture the state at this exact moment
    const snapshot = matrixRef.current.clone();
    const currentSize = { width: size.width, height: size.height };
    const nowMs = clock.getElapsedTime() * 1000;

    // 6a. Trailing settle: guarantees a final, crisp update once the camera
    // comes to rest (the last motion frame may fall inside the throttle gap).
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateCameraData(snapshot, currentSize);
    }, settleMs);

    // 6b. Leading throttle: push DURING continuous motion at a bounded cadence
    // so panning retriggers the (linked) visibility + chunk-planning pipeline
    // live, instead of only after the camera stops.
    if (nowMs - lastEmitRef.current >= throttleMs) {
      lastEmitRef.current = nowMs;
      updateCameraData(snapshot, currentSize);
    }
  });

  return null;
};
