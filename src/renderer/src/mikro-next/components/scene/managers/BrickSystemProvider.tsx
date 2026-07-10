import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { createRepackDispatcher } from "../core/octree/repackDispatcher";
import { useSceneStoreApi } from "../store/sceneStore";
import { useViewerStoreApi } from "../store/viewerStore";
import { BrickResidencyManager } from "./brickResidency";

/**
 * Owns the brick residency manager's lifecycle. Lives INSIDE the R3F canvas
 * because the manager needs the WebGLRenderer for texSubImage3D uploads and
 * the demand-frameloop `invalidate`. The per-frame `useFrame` drain applies
 * the byte-budgeted upload batch; the manager itself re-invalidates while
 * work remains, so `frameloop="demand"` keeps ticking until the queue is dry.
 */
export function BrickSystemProvider() {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const viewerStore = useViewerStoreApi();
  const sceneStore = useSceneStoreApi();
  const managerRef = useRef<BrickResidencyManager | null>(null);

  useEffect(() => {
    // Repack workers live exactly as long as the manager they serve.
    const repack = createRepackDispatcher();
    const manager = new BrickResidencyManager({
      renderer: gl,
      viewerStore,
      sceneStore,
      invalidate,
      repack,
    });
    managerRef.current = manager;
    const stop = manager.start();
    viewerStore.getState().registerBrickSystem(manager);
    return () => {
      stop();
      viewerStore.getState().registerBrickSystem(null);
      manager.dispose();
      repack.dispose();
      managerRef.current = null;
    };
  }, [gl, invalidate, viewerStore, sceneStore]);

  useFrame(() => {
    managerRef.current?.drainUploads();
  });

  return null;
}
