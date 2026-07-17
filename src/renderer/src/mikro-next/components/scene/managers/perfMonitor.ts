/**
 * Opt-in CPU/GPU performance monitor for the scene renderer.
 *
 * This is DISABLED by default and does nothing until the user explicitly starts
 * a recording (the DebugPanel "Start report" button). Every instrumentation hook
 * first-lines `if (!this.recording) return`, so outside a session the cost is one
 * boolean check — the render hot path is untouched.
 *
 * While recording it captures, per frame, the main-thread (CPU) frame time and
 * the GPU frame time (fed in by `PerfFrameProbe`), plus session counters:
 * per-component React render counts, replans, visibility recomputes, and brick
 * uploads. `buildSessionReport()` aggregates the recorded window into a JSON blob
 * that the DebugPanel folds into "Copy debug report" — a targeted bug report for
 * exactly the seconds the user was panning.
 *
 * The CPU/GPU split is the key signal: a long `frameCpuMs` with a small `gpuMs`
 * is a main-thread stall (e.g. a React re-render storm), not a GPU bottleneck.
 * `gpuMs` is currently always null — see `PerfFrameProbe`.
 *
 * Kept free of the renderer and React so it is unit-testable; the rAF timing
 * loop lives in `PerfFrameProbe`.
 */

const now = (): number =>
  typeof performance !== "undefined" ? performance.now() : 0;

/** Frames beyond this auto-stop the session so a forgotten recording can't grow
 * unbounded (~66 s at 60 fps). The captured window is preserved. */
const MAX_FRAMES = 4000;

/** Frame CPU time (ms) above which a frame is counted as "jank". */
const JANK_MS = 50;

export type FrameSample = {
  /** ms since the session started. */
  tMs: number;
  /** rAF-to-rAF main-thread wall time — includes the React commit phase. */
  frameCpuMs: number;
  /** GPU time for the frame, or null when timer queries are unavailable. */
  gpuMs: number | null;
  cameraMoving: boolean;
  bricksUploaded: number;
  bytesUploaded: number;
};

export type PerfSessionReport = {
  durationMs: number;
  frameCount: number;
  truncated: boolean;
  fps: number;
  cpuMs: { min: number; avg: number; max: number; p95: number };
  gpuMs: { min: number; avg: number; max: number; samples: number } | null;
  jankFrames: number;
  movingFrames: number;
  /** React render counts over the session, per component name, highest first. */
  renderCounts: Record<string, number>;
  replans: number;
  visibilityRecomputes: number;
  bricksUploaded: number;
  bytesUploaded: number;
};

class PerfMonitor {
  private recording = false;
  private startedAt = 0;
  private truncated = false;
  private frames: FrameSample[] = [];
  private renderCounts = new Map<string, number>();
  private replans = 0;
  private visibilityRecomputes = 0;
  private pendingBricks = 0;
  private pendingBytes = 0;
  private readonly listeners = new Set<() => void>();

  isRecording(): boolean {
    return this.recording;
  }

  /** Notified whenever recording starts or stops (for React `useSyncExternalStore`). */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }

  /** Arm a fresh recording, discarding any previous session's buffers. */
  startRecording(): void {
    this.recording = true;
    this.startedAt = now();
    this.truncated = false;
    this.frames = [];
    this.renderCounts = new Map();
    this.replans = 0;
    this.visibilityRecomputes = 0;
    this.pendingBricks = 0;
    this.pendingBytes = 0;
    this.emit();
  }

  /** Disarm; the captured buffers are retained for `buildSessionReport()`. */
  stopRecording(): void {
    if (!this.recording) return;
    this.recording = false;
    this.emit();
  }

  countRender(name: string): void {
    if (!this.recording) return;
    this.renderCounts.set(name, (this.renderCounts.get(name) ?? 0) + 1);
  }

  markReplan(): void {
    if (!this.recording) return;
    this.replans += 1;
  }

  markVisibilityRecompute(): void {
    if (!this.recording) return;
    this.visibilityRecomputes += 1;
  }

  /** Accumulated into the next recorded frame. */
  markUpload(bricks: number, bytes: number): void {
    if (!this.recording) return;
    this.pendingBricks += bricks;
    this.pendingBytes += bytes;
  }

  /** Called once per animation frame by `PerfFrameProbe` while recording. */
  recordFrame(sample: {
    frameCpuMs: number;
    gpuMs: number | null;
    cameraMoving: boolean;
  }): void {
    if (!this.recording) return;
    this.frames.push({
      tMs: now() - this.startedAt,
      frameCpuMs: sample.frameCpuMs,
      gpuMs: sample.gpuMs,
      cameraMoving: sample.cameraMoving,
      bricksUploaded: this.pendingBricks,
      bytesUploaded: this.pendingBytes,
    });
    this.pendingBricks = 0;
    this.pendingBytes = 0;

    if (this.frames.length >= MAX_FRAMES) {
      this.truncated = true;
      // eslint-disable-next-line no-console
      console.warn(
        `[perfMonitor] recording auto-stopped at ${MAX_FRAMES} frames (cap reached)`,
      );
      this.stopRecording();
    }
  }

  /** Aggregate the recorded window; null when nothing was captured. */
  buildSessionReport(): PerfSessionReport | null {
    const frames = this.frames;
    if (frames.length === 0) return null;

    const durationMs =
      frames[frames.length - 1].tMs - frames[0].tMs || frames[0].frameCpuMs;

    const cpu = frames.map((f) => f.frameCpuMs).sort((a, b) => a - b);
    const cpuSum = cpu.reduce((a, b) => a + b, 0);
    const p95 = cpu[Math.min(cpu.length - 1, Math.floor(cpu.length * 0.95))];

    const gpuVals = frames
      .map((f) => f.gpuMs)
      .filter((v): v is number => v != null);
    const gpu =
      gpuVals.length > 0
        ? {
            min: Math.min(...gpuVals),
            avg: gpuVals.reduce((a, b) => a + b, 0) / gpuVals.length,
            max: Math.max(...gpuVals),
            samples: gpuVals.length,
          }
        : null;

    const renderCounts: Record<string, number> = {};
    for (const [name, count] of [...this.renderCounts.entries()].sort(
      (a, b) => b[1] - a[1],
    )) {
      renderCounts[name] = count;
    }

    return {
      durationMs,
      frameCount: frames.length,
      truncated: this.truncated,
      fps: durationMs > 0 ? (frames.length / durationMs) * 1000 : 0,
      cpuMs: {
        min: cpu[0],
        avg: cpuSum / cpu.length,
        max: cpu[cpu.length - 1],
        p95,
      },
      gpuMs: gpu,
      jankFrames: frames.filter((f) => f.frameCpuMs > JANK_MS).length,
      movingFrames: frames.filter((f) => f.cameraMoving).length,
      renderCounts,
      replans: this.replans,
      visibilityRecomputes: this.visibilityRecomputes,
      bricksUploaded: frames.reduce((a, f) => a + f.bricksUploaded, 0),
      bytesUploaded: frames.reduce((a, f) => a + f.bytesUploaded, 0),
    };
  }
}

/** Process-wide singleton — one recording at a time. */
export const perfMonitor = new PerfMonitor();
