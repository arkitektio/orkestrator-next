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
  const get = useThree((s) => s.get);
  const storeApi = useViewerStoreApi();

  useEffect(() => {
    // Re-register whenever the R3F root state changes
    const state = get();
    const controls = state.controls;
    const ctrl =
      controls && "target" in controls
        ? (controls as unknown as {
            target: THREE.Vector3;
            update: () => void;
          })
        : null;

    registerCanvas({
      camera: state.camera,
      controls: ctrl,
      size: state.size,
      invalidate: state.invalidate,
    });
  }, [registerCanvas, get]);

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
