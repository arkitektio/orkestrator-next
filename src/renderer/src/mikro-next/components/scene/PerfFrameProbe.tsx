import { useEffect, useRef, useSyncExternalStore } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { perfMonitor } from "./managers/perfMonitor";
import { getFallbackGL, type SceneRenderer } from "./render/gpu/sceneRenderer";
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

/**
 * GPU frame timer via `EXT_disjoint_timer_query_webgl2` (best-effort — returns
 * null when the extension is unavailable, e.g. some ANGLE configurations). Only
 * one `TIME_ELAPSED` query can be active at a time, and results lag a few frames,
 * so completed timings are attributed to the current frame sample (fine for the
 * min/avg/max "is it CPU or GPU" question this tool answers).
 */
class GpuFrameTimer {
  private readonly ext: {
    TIME_ELAPSED_EXT: number;
    GPU_DISJOINT_EXT: number;
  } | null;
  private readonly pending: WebGLQuery[] = [];
  private static readonly MAX_IN_FLIGHT = 4;

  constructor(private readonly gl: WebGL2RenderingContext) {
    this.ext = gl.getExtension("EXT_disjoint_timer_query_webgl2") as never;
  }

  available(): boolean {
    return !!this.ext;
  }

  /** Bracket `render` with a timer query; return a completed gpuMs or null. */
  measure(render: () => void): number | null {
    if (!this.ext) {
      render();
      return null;
    }
    const gl = this.gl;
    let query: WebGLQuery | null = null;
    if (this.pending.length < GpuFrameTimer.MAX_IN_FLIGHT) {
      query = gl.createQuery();
      if (query) gl.beginQuery(this.ext.TIME_ELAPSED_EXT, query);
    }
    render();
    if (query) {
      gl.endQuery(this.ext.TIME_ELAPSED_EXT);
      this.pending.push(query);
    }
    return this.poll();
  }

  private poll(): number | null {
    if (!this.ext) return null;
    const gl = this.gl;
    // A disjoint event invalidates all in-flight timings for this window.
    if (gl.getParameter(this.ext.GPU_DISJOINT_EXT)) {
      for (const q of this.pending) gl.deleteQuery(q);
      this.pending.length = 0;
      return null;
    }
    const q = this.pending[0];
    if (!q) return null;
    if (!gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE)) return null;
    const ns = gl.getQueryParameter(q, gl.QUERY_RESULT) as number;
    gl.deleteQuery(q);
    this.pending.shift();
    return ns / 1e6;
  }

  dispose(): void {
    for (const q of this.pending) this.gl.deleteQuery(q);
    this.pending.length = 0;
  }
}

const RecordingProbe = () => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const setFrameloop = useThree((s) => s.setFrameloop);
  const viewApi = useViewStoreApi();
  const timerRef = useRef<GpuFrameTimer | null>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    // GPU timing: EXT_disjoint_timer_query needs the WebGL fallback backend's
    // context. Under the native WebGPU backend gpuMs stays null for now
    // (timestamp-query integration is a follow-up); CPU timing is unaffected.
    const ctx = getFallbackGL(gl as unknown as SceneRenderer);
    timerRef.current =
      ctx instanceof WebGL2RenderingContext ? new GpuFrameTimer(ctx) : null;
    // A recording needs a frame every tick to sample; take over the render loop.
    setFrameloop("always");
    return () => {
      setFrameloop("demand");
      timerRef.current?.dispose();
      timerRef.current = null;
      lastRef.current = null;
    };
  }, [gl, setFrameloop]);

  // Priority 1: this callback owns the render, so the timer query can bracket the
  // scene's GL work. Runs after the priority-0 useFrames (camera sync, upload drain).
  useFrame(() => {
    const t = performance.now();
    const cpuMs = lastRef.current == null ? 0 : t - lastRef.current;
    lastRef.current = t;

    const timer = timerRef.current;
    const gpuMs = timer
      ? timer.measure(() => gl.render(scene, camera))
      : (gl.render(scene, camera), null);

    // Skip the first frame (no previous timestamp to diff against).
    if (cpuMs > 0) {
      perfMonitor.recordFrame({
        frameCpuMs: cpuMs,
        gpuMs,
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
