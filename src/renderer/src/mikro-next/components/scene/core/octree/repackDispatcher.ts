import { repackBrick, type BrickArray, type RepackBrickInput, type RepackResult } from "./brickRepack";
import type { RepackWorkerRequest, RepackWorkerResponse } from "./repack-worker";

/**
 * Dispatcher for brick repack: routes `repackBrick` jobs to a small Web Worker
 * pool so the dominant per-brick CPU cost (strided copy + edge replication +
 * min/max over a whole stored brick) stays off the UI thread during
 * panning-triggered streaming.
 *
 * Two implementations behind one interface:
 * - worker-backed (production) — chunks travel zero-copy when SAB-backed, the
 *   output brick returns as a transferable;
 * - synchronous — used when `Worker` is unavailable (vitest/jsdom) and as a
 *   construction-failure safety net; behaviorally identical because both call
 *   the same pure, golden-buffer-tested `repackBrick`.
 *
 * No cancellation: jobs are a few ms; stale results are dropped by the
 * existing `protectedKeys`/`staleDrops` gate in `drainUploads`.
 */

export type RepackJob = {
  kind: "r8" | "r32f";
  /** storedX·storedY·storedZ·channelCount — the output brick's length. */
  elementCount: number;
  input: Omit<RepackBrickInput, "output">;
};

export type RepackOutcome = RepackResult & { data: BrickArray };

export interface RepackDispatcher {
  repack(job: RepackJob): Promise<RepackOutcome>;
  dispose(): void;
}

/** Same math, same thread — for tests and as a fallback. */
export function createSyncRepackDispatcher(): RepackDispatcher {
  return {
    repack: (job) => {
      const output: BrickArray =
        job.kind === "r8"
          ? new Uint8Array(job.elementCount)
          : new Float32Array(job.elementCount);
      const result = repackBrick({ ...job.input, output });
      return Promise.resolve({ ...result, data: output });
    },
    dispose: () => {},
  };
}

/** Repack workers per dispatcher — repack is memory-bandwidth-bound, so a
 * small pool suffices; but the fetch pipeline (12 in-flight bricks) queues
 * here, and an undersized pool inflates per-brick WALL time (measured 80 ms
 * wall vs ~13 ms exec on an M2 with 2 workers). Scale mildly with cores. */
const REPACK_WORKER_COUNT = Math.min(
  4,
  Math.max(
    2,
    Math.floor(
      ((typeof navigator !== "undefined" ? navigator.hardwareConcurrency : undefined) ?? 4) / 2,
    ) - 1,
  ),
);

type Pending = {
  resolve: (outcome: RepackOutcome) => void;
  reject: (error: Error) => void;
  kind: "r8" | "r32f";
};

function createWorkerRepackDispatcher(): RepackDispatcher {
  // Lazy: no worker exists until the first brick repacks.
  const workers: Worker[] = [];
  const pending = new Map<number, Pending>();
  let nextId = 1;
  let nextWorker = 0;
  let disposed = false;

  const handleMessage = (event: MessageEvent<RepackWorkerResponse>) => {
    const response = event.data;
    const entry = pending.get(response.id);
    if (!entry) return;
    pending.delete(response.id);
    if ("error" in response) {
      entry.reject(new Error(response.error));
      return;
    }
    const data: BrickArray =
      entry.kind === "r8"
        ? new Uint8Array(response.buffer)
        : new Float32Array(response.buffer);
    entry.resolve({
      min: response.min,
      max: response.max,
      uniformValue: response.uniformValue,
      data,
    });
  };

  const acquireWorker = (): Worker => {
    if (workers.length < REPACK_WORKER_COUNT) {
      // Single-expression `new Worker(new URL(...))` so the bundler detects
      // and bundles the worker entry (same pattern as the zarr codec worker).
      const worker = new Worker(new URL("./repack-worker.js", import.meta.url), {
        type: "module",
      });
      worker.onmessage = handleMessage;
      worker.onerror = (event) => {
        // A worker-level error fails every job in flight on this dispatcher —
        // simplest correct behavior; callers count it as a fetch error and the
        // brick is re-planned like any other failed fetch.
        const error = new Error(`repack worker error: ${event.message}`);
        for (const [id, entry] of [...pending]) {
          pending.delete(id);
          entry.reject(error);
        }
      };
      workers.push(worker);
      return worker;
    }
    const worker = workers[nextWorker];
    nextWorker = (nextWorker + 1) % workers.length;
    return worker;
  };

  return {
    repack: (job) => {
      if (disposed) return Promise.reject(new Error("repack dispatcher disposed"));
      let worker: Worker;
      try {
        worker = acquireWorker();
      } catch {
        // Worker construction failed (constructor is lazy, so this is where a
        // missing/blocked Worker surfaces) — run the same pure repack inline.
        return createSyncRepackDispatcher().repack(job);
      }
      const id = nextId++;
      return new Promise<RepackOutcome>((resolve, reject) => {
        pending.set(id, { resolve, reject, kind: job.kind });
        const request: RepackWorkerRequest = {
          id,
          kind: job.kind,
          elementCount: job.elementCount,
          input: job.input,
        };
        worker.postMessage(request);
      });
    },
    dispose: () => {
      disposed = true;
      const error = new Error("repack dispatcher disposed");
      for (const [id, entry] of [...pending]) {
        pending.delete(id);
        entry.reject(error);
      }
      for (const worker of workers) worker.terminate();
      workers.length = 0;
    },
  };
}

/** Worker-backed when possible, synchronous otherwise. */
export function createRepackDispatcher(): RepackDispatcher {
  if (typeof Worker === "undefined") return createSyncRepackDispatcher();
  try {
    return createWorkerRepackDispatcher();
  } catch {
    return createSyncRepackDispatcher();
  }
}
