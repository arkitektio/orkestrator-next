import { atlasBytesPerVoxel, R16F_DATA_SCALE, type AtlasKind } from "./atlasFormat";
import { encodeHalfArray } from "./halfFloat";
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
 * No cancellation: jobs are a few ms; out-of-plan results are landed into
 * free slots (or counted as `planDrops`) by `drainUploads`.
 */

export type RepackJob = {
  kind: AtlasKind;
  /** storedX·storedY·storedZ·channelCount — the output brick's length. */
  elementCount: number;
  input: Omit<RepackBrickInput, "output">;
};

export type RepackOutcome = RepackResult & { data: BrickArray };

export interface RepackDispatcher {
  repack(job: RepackJob): Promise<RepackOutcome>;
  /**
   * Hand a finished output brick back for reuse. Call ONLY when the buffer is
   * provably dead (uploaded + mirrored, or dropped without upload) — a
   * released buffer is transferred to a worker and detached, so a live
   * reference elsewhere would read a zero-length array. Best-effort: unmatched
   * or overflowing buffers just fall to GC, exactly as before.
   */
  release(data: BrickArray): void;
  /**
   * Spawn the worker pool now rather than on the first brick.
   *
   * Workers are otherwise lazy, so the FIRST brick of a cold scene pays
   * `new Worker` + module evaluation on top of its own decode — right at the
   * moment the user is waiting for the first voxels. Optional: the sync
   * dispatcher has no workers to warm.
   */
  prewarm?(): void;
  dispose(): void;
}

/** Same math, same thread — for tests and as a fallback. */
export function createSyncRepackDispatcher(): RepackDispatcher {
  return {
    repack: (job) => {
      if (job.kind === "r16f") {
        // Raw repack into a float scratch (min/max and the uniform test must
        // see RAW values), then half-float-encode into the output — the same
        // two-step the worker path runs (repack-worker.ts, keep in lockstep).
        const scratch = new Float32Array(job.elementCount);
        const result = repackBrick({ ...job.input, output: scratch });
        const output = new Uint16Array(job.elementCount);
        encodeHalfArray(scratch, output, 1 / R16F_DATA_SCALE);
        return Promise.resolve({ ...result, data: output });
      }
      const output: BrickArray =
        job.kind === "r8"
          ? new Uint8Array(job.elementCount)
          : new Float32Array(job.elementCount);
      const result = repackBrick({ ...job.input, output });
      return Promise.resolve({ ...result, data: output });
    },
    release: () => {}, // same-thread outputs just fall to GC
    dispose: () => {},
  };
}

/** Free-list bound: at 12 in-flight bricks (~1.1 MB each for a 66³ r32f
 * brick) this caps retained memory at ~26 MB across every active size class
 * while still covering the steady-state streaming pipeline. */
export const MAX_FREE_BUFFERS = 24;

/**
 * Size-classed ArrayBuffer free list for repack outputs. The worker path used
 * to allocate a fresh ~1.1 MB output per brick, transfer it out and drop it
 * after the atlas upload — sustained multi-MB/frame garbage while streaming.
 * Buffers are keyed by exact byteLength (pool specs differ per pool) and
 * handed back to the worker via the request's `recycled` transfer.
 * Pure and exported for unit tests.
 */
export function createBufferFreeList(maxBuffers: number = MAX_FREE_BUFFERS) {
  const bySize = new Map<number, ArrayBuffer[]>();
  let count = 0;
  return {
    size: () => count,
    put(buffer: ArrayBuffer): void {
      if (buffer.byteLength === 0 || count >= maxBuffers) return; // detached or full
      const bucket = bySize.get(buffer.byteLength);
      if (bucket) bucket.push(buffer);
      else bySize.set(buffer.byteLength, [buffer]);
      count += 1;
    },
    take(byteLength: number): ArrayBuffer | undefined {
      const bucket = bySize.get(byteLength);
      const buffer = bucket?.pop();
      if (buffer !== undefined) count -= 1;
      return buffer;
    },
    clear(): void {
      bySize.clear();
      count = 0;
    },
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
  kind: AtlasKind;
};

function createWorkerRepackDispatcher(): RepackDispatcher {
  // Lazy: no worker exists until the first brick repacks.
  const workers: Worker[] = [];
  const pending = new Map<number, Pending>();
  const freeList = createBufferFreeList();
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
        : entry.kind === "r16f"
          ? new Uint16Array(response.buffer)
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
    prewarm: () => {
      if (disposed) return;
      // Idempotent by construction: acquireWorker only creates while the pool
      // is under REPACK_WORKER_COUNT, and round-robins once it is full.
      try {
        while (workers.length < REPACK_WORKER_COUNT) acquireWorker();
      } catch {
        // Worker construction unavailable — repack falls back to the sync path
        // per job, exactly as it does today.
      }
    },
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
        const recycled = freeList.take(job.elementCount * atlasBytesPerVoxel(job.kind));
        const request: RepackWorkerRequest = {
          id,
          kind: job.kind,
          elementCount: job.elementCount,
          input: job.input,
          recycled,
        };
        // Only `recycled` transfers; SAB-backed chunks stay shared and the
        // rare non-SAB chunk structured-clones, exactly as before.
        worker.postMessage(request, recycled ? [recycled] : []);
      });
    },
    release: (data) => {
      if (disposed) return;
      freeList.put(data.buffer as ArrayBuffer);
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
      freeList.clear();
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
