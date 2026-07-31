import { useEffect, useRef, useSyncExternalStore } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { TimestampQuery, type WebGPURenderer } from "three/webgpu";
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
  const gpuMsRef = useRef<number | null>(null);

  useEffect(() => {
    // A recording needs a frame every tick to sample; take over the render loop.
    setFrameloop("always");
    return () => {
      setFrameloop("demand");
      lastRef.current = null;
      gpuMsRef.current = null;
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
        // WebGPU timestamp-query pass time (Scene.tsx enables trackTimestamp).
        // The resolve below is async, so this is the PREVIOUS frame's GPU
        // time — a one-frame skew that doesn't matter for session aggregates.
        // Stays null on adapters without timestamp-query.
        gpuMs: gpuMsRef.current,
        cameraMoving: viewApi.getState().cameraMoving,
      });
    }

    // Kick this frame's readback. The backend self-clears trackTimestamp when
    // the adapter lacks the feature — guard so we never trip three's warnOnce.
    const backend = (gl as unknown as { backend?: { trackTimestamp?: boolean } }).backend;
    if (backend?.trackTimestamp === true) {
      void (gl as unknown as WebGPURenderer)
        .resolveTimestampsAsync(TimestampQuery.RENDER)
        .then((ms) => {
          gpuMsRef.current = typeof ms === "number" ? ms : null;
        })
        .catch(() => {
          gpuMsRef.current = null;
        });
    }
  }, 1);

  return null;
};

export const PerfFrameProbe = () => {
  const recording = usePerfRecording();
  return recording ? <RecordingProbe /> : null;
};
