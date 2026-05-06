import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useViewerStore, useViewerStoreApi } from "../store/viewerStore";

/**
 * R3F component that syncs the Canvas camera, controls, size,
 * and invalidate function into the viewer store so that store
 * actions (fitToLayer, etc.) can operate on the camera directly.
 *
 * Also pushes `worldUnitsPerPixel` each frame so HTML panels
 * (e.g. ScaleBar) can read it without being inside the Canvas.
 */
export const CanvasSync = () => {
  const registerCanvas = useViewerStore((s) => s.registerCanvas);
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const storeApi = useViewerStoreApi();

  useEffect(() => {
    const ctrl =
      controls && "target" in controls
        ? (controls as unknown as {
            target: THREE.Vector3;
            update: () => void;
          })
        : null;

    registerCanvas({
      camera,
      controls: ctrl,
      size,
      invalidate,
    });
  }, [camera, controls, invalidate, registerCanvas, size]);

  // Push worldUnitsPerPixel into the store each frame
  useFrame(({ camera, size }) => {
    let wupp: number;
    if ((camera as THREE.OrthographicCamera).isOrthographicCamera) {
      wupp = 1 / (camera as THREE.OrthographicCamera).zoom;
    } else {
      const persp = camera as THREE.PerspectiveCamera;
      const distance = camera.position.length();
      const vFov = THREE.MathUtils.degToRad(persp.fov);
      wupp = (2 * Math.tan(vFov / 2) * distance) / size.height;
    }
    // Only update store when the value actually changed (avoid unnecessary rerenders)
    const prev = storeApi.getState().worldUnitsPerPixel;
    if (Math.abs(wupp - prev) > prev * 0.001) {
      storeApi.getState().setWorldUnitsPerPixel(wupp);
    }
  });

  return null;
};
