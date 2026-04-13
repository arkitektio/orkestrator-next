
// ── Camera Matrix Sync (runs inside Canvas) ──────────────────────────

import { useEffect, useRef } from "react";
import { useSpaceViewStore } from "../store";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";



export const CameraMatrixSync = ({ debounceMs = 80 }: { debounceMs?: number }) => {
  const updateCameraData = useSpaceViewStore((s) => s.updateCameraData);
  const matRef = useRef(new THREE.Matrix4());
  const prevRef = useRef(new THREE.Matrix4());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  useFrame(({ camera, size }) => {
    camera.updateProjectionMatrix();
    matRef.current.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

    let changed = false;
    const cur = matRef.current.elements;
    const prev = prevRef.current.elements;
    for (let i = 0; i < 16; i++) {
      if (Math.abs(cur[i] - prev[i]) > 0.00001) { changed = true; break; }
    }
    if (!changed) return;
    prevRef.current.copy(matRef.current);

    if (timerRef.current) clearTimeout(timerRef.current);
    const snapshot = matRef.current.clone();
    const currentSize = { width: size.width, height: size.height };
    timerRef.current = setTimeout(() => {
      updateCameraData(snapshot, currentSize);
    }, debounceMs);
  });

  return null;
};
