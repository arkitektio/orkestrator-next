import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Matrix4 } from "three";
import { useSpaceScene } from "./context";

export const CameraMatrixSync = ({
  debounceMs = 80,
}: {
  debounceMs?: number;
}) => {
  const updateCameraData = useSpaceScene((s) => s.updateCameraData);
  const matrixRef = useRef(new Matrix4());
  const previousRef = useRef(new Matrix4());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  useFrame(({ camera, size }) => {
    camera.updateProjectionMatrix();
    matrixRef.current.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse,
    );

    const current = matrixRef.current.elements;
    const previous = previousRef.current.elements;
    let changed = false;

    for (let index = 0; index < 16; index += 1) {
      if (Math.abs(current[index] - previous[index]) > 0.00001) {
        changed = true;
        break;
      }
    }

    if (!changed) {
      return;
    }

    previousRef.current.copy(matrixRef.current);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const snapshot = matrixRef.current.clone();
    const nextSize = { width: size.width, height: size.height };
    timerRef.current = setTimeout(() => {
      updateCameraData(snapshot, nextSize);
    }, debounceMs);
  });

  return null;
};
