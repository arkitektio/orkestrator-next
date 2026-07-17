import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { createDefaultWorker } from "@/lib/zarr/runner";
import { workerPool } from "../../../workers/pool";
import { createRepackDispatcher } from "../core/octree/repackDispatcher";
import type { SceneRenderer } from "../render/gpu/sceneRenderer";
import { useSceneStoreApi } from "../store/sceneStore";
import { useViewerStoreApi } from "../store/viewerStore";
import { BrickResidencyManager } from "./brickResidency";

/**
 * Owns the brick residency manager's lifecycle. Lives INSIDE the R3F canvas
 * because the manager needs the renderer for its 3D-texture uploads and the
 * demand-frameloop `invalidate`. The per-frame `useFrame` drain applies
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
    // Pre-warm the zarr decode pool: module workers (zstd/blosc bundles) cost
    // tens of ms each to spawn+eval, and lazily they serialize in front of
    // the FIRST chunk fetches of a cold scene. Warm them now so spawn
    // overlaps metadata fetch/plan. Capped: machines with many cores still
    // lazy-spawn the rest under real load. The module-level pool outlives
    // scene mounts, so this is effectively once per app session.
    workerPool.prewarm(createDefaultWorker, 8);

    // Repack workers live exactly as long as the manager they serve.
    const repack = createRepackDispatcher();
    const manager = new BrickResidencyManager({
      // R3F types `gl` as WebGLRenderer; the Canvas factory actually creates a
      // WebGPURenderer (Scene.tsx) — the manager reaches the device only
      // through sceneRenderer.ts.
      renderer: gl as unknown as SceneRenderer,
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
