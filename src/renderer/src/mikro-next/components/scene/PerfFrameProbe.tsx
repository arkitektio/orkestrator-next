import { useEffect, useRef, useSyncExternalStore } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { perfMonitor } from "./managers/perfMonitor";
import { useViewStoreApi } from "./store/viewStore";

/**
 * React binding for the opt-in perf monitor. `PerfFrameProbe` is always mounted
 * but does nothing until a recording is armed (DebugPanel "Start report"). Only
 * then does it mount `RecordingProbe`, which forces continuous rendering and
 * measures each frame's CPU and GPU time. When recording stops it unmounts and
 * the scene returns to its demand frameloop — zero overhead outside a session.
 */

/** React subscription to the monitor's recording flag. */
export function usePerfRecording(): boolean {
  return useSyncExternalStore(
    (cb) => perfMonitor.subscribe(cb),
    () => perfMonitor.isRecording(),
  );
}

const RecordingProbe = () => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const setFrameloop = useThree((s) => s.setFrameloop);
  const viewApi = useViewStoreApi();
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    // A recording needs a frame every tick to sample; take over the render loop.
    setFrameloop("always");
    return () => {
      setFrameloop("demand");
      lastRef.current = null;
    };
  }, [setFrameloop]);

  // Priority 1: this callback owns the render. Runs after the priority-0
  // useFrames (camera sync, upload drain).
  useFrame(() => {
    const t = performance.now();
    const cpuMs = lastRef.current == null ? 0 : t - lastRef.current;
    lastRef.current = t;

    gl.render(scene, camera);

    // Skip the first frame (no previous timestamp to diff against).
    if (cpuMs > 0) {
      perfMonitor.recordFrame({
        frameCpuMs: cpuMs,
        // Always null: GPU timing came from EXT_disjoint_timer_query_webgl2,
        // which needed the WebGL2 backend the scene no longer runs on. The
        // WebGPU replacement is timestamp-queries — a follow-up. CPU timing,
        // which is what the CPU-vs-GPU question usually turns on, is unaffected.
        gpuMs: null,
        cameraMoving: viewApi.getState().cameraMoving,
      });
    }
  }, 1);

  return null;
};

export const PerfFrameProbe = () => {
  const recording = usePerfRecording();
  return recording ? <RecordingProbe /> : null;
};
