import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useViewerStore } from "../store/viewerStore";

/**
 * R3F component that syncs the Canvas camera, controls, size,
 * and invalidate function into the viewer store so that store
 * actions (fitToLayer, etc.) can operate on the camera directly.
 */
export const CanvasSync = () => {
  const registerCanvas = useViewerStore((s) => s.registerCanvas);
  const get = useThree((s) => s.get);

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

  return null;
};
