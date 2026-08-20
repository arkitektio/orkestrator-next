import type { MeshoptDecoderLike } from "./fabriksDecode";
import {
  decodeRowGroupSpan,
  type FabriksDecodeRequest,
  type FabriksDecodedCell,
} from "./fabriksDecodeCore";
import type {
  FabriksDecodeWorkerRequest,
  FabriksDecodeWorkerResponse,
} from "./fabriksDecode-worker";

/**
 * Dispatcher for fabriks geometry decode: routes `decodeRowGroupSpan` jobs to
 * a small Web Worker pool so the dominant streaming CPU cost — hyparquet
 * parse, meshopt decode, per-vertex dequantize — stays off the UI thread
 * while row groups arrive (`CONCURRENT_FETCHES` of them interleaved).
 *
 * Two implementations behind one interface (the `repackDispatcher` pattern):
 * - worker-backed (production) — the span structured-clones IN (it is owned
 *   by the FabriksStore byte cache and must never be transferred/detached);
 *   the decoded typed arrays transfer OUT zero-copy;
 * - synchronous — used when `Worker` is unavailable (vitest/node) and as a
 *   construction-failure safety net; behaviorally identical because both call
 *   the same pure, fixture-tested `decodeRowGroupSpan`.
 *
 * This is fabriks's OWN pool, not the shared zarr `WorkerPool`: pool slots are
 * untyped and a recycled zarr codec worker cannot answer fabriks messages
 * (README, "Known gaps"). No cancellation — jobs are one row group; a stale
 * result is discarded by the manager's generation check, exactly like a stale
 * fetch.
 *
 * `loadDecoder` travels PER CALL, not per dispatcher: the worker path ignores
 * it (each worker initializes its own meshopt WASM), and the sync path uses
 * the caller's — so the module-level shared dispatcher never bakes in one
 * manager's decoder loader.
 */

export type FabriksDecodeDispatcher = {
  decode(
    request: FabriksDecodeRequest,
    loadDecoder: () => Promise<MeshoptDecoderLike | null>,
  ): Promise<FabriksDecodedCell[]>;
  dispose(): void;
};

/** Same decode, same thread — for tests and as a fallback. */
export function createSyncFabriksDecodeDispatcher(): FabriksDecodeDispatcher {
  return {
    decode: async (request, loadDecoder) => {
      const decoder = request.encoding.codec === "MESHOPT" ? await loadDecoder() : null;
      return decodeRowGroupSpan(request, decoder);
    },
    dispose: () => {},
  };
}

/** Decode workers per dispatcher. Two suffice: decode is CPU-bound and the
 * fetch pipeline (CONCURRENT_FETCHES = 4) hides latency ahead of it, so the
 * pool needs to keep up with arrival, not multiply it. */
const FABRIKS_DECODE_WORKER_COUNT = 2;

type Pending = {
  resolve: (cells: FabriksDecodedCell[]) => void;
  reject: (error: Error) => void;
};

function createWorkerFabriksDecodeDispatcher(): FabriksDecodeDispatcher {
  // Lazy: no worker exists until the first row group decodes.
  const workers: Worker[] = [];
  const pending = new Map<number, Pending>();
  let nextId = 1;
  let nextWorker = 0;
  let disposed = false;

  const handleMessage = (event: MessageEvent<FabriksDecodeWorkerResponse>) => {
    const response = event.data;
    const entry = pending.get(response.id);
    if (!entry) return;
    pending.delete(response.id);
    if ("error" in response) entry.reject(new Error(response.error));
    else entry.resolve(response.cells);
  };

  const acquireWorker = (): Worker => {
    if (workers.length < FABRIKS_DECODE_WORKER_COUNT) {
      // Single-expression `new Worker(new URL(...))` so the bundler detects
      // and bundles the worker entry (same pattern as the repack worker).
      const worker = new Worker(new URL("./fabriksDecode-worker.js", import.meta.url), {
        type: "module",
      });
      worker.onmessage = handleMessage;
      worker.onerror = (event) => {
        // A worker-level error fails every job in flight — simplest correct
        // behavior; the manager counts each as a fetch error and the drain's
        // retry round (or the next replan) re-requests the group.
        const error = new Error(`fabriks decode worker error: ${event.message}`);
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
    decode: (request, loadDecoder) => {
      if (disposed) return Promise.reject(new Error("fabriks decode dispatcher disposed"));
      let worker: Worker;
      try {
        worker = acquireWorker();
      } catch {
        // Worker construction failed (the constructor is lazy, so this is
        // where a missing/blocked Worker surfaces) — decode inline instead.
        return createSyncFabriksDecodeDispatcher().decode(request, loadDecoder);
      }
      const id = nextId++;
      return new Promise<FabriksDecodedCell[]>((resolve, reject) => {
        pending.set(id, { resolve, reject });
        const message: FabriksDecodeWorkerRequest = { id, request };
        // NO transfer list: `request.spanBytes` belongs to the FabriksStore
        // byte cache — transferring it would detach the cached bytes under
        // every other reader. The clone is the price of the shared cache.
        worker.postMessage(message);
      });
    },
    dispose: () => {
      disposed = true;
      const error = new Error("fabriks decode dispatcher disposed");
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
export function createFabriksDecodeDispatcher(): FabriksDecodeDispatcher {
  if (typeof Worker === "undefined") return createSyncFabriksDecodeDispatcher();
  try {
    return createWorkerFabriksDecodeDispatcher();
  } catch {
    return createSyncFabriksDecodeDispatcher();
  }
}

/** One pool for every mesh layer (the `workers/pool.ts` idiom): decode work
 * is fungible across collections, and per-manager pools would multiply WASM
 * instances and idle workers per layer. Never disposed — it lives as long as
 * the renderer. */
let shared: FabriksDecodeDispatcher | null = null;
export function sharedFabriksDecodeDispatcher(): FabriksDecodeDispatcher {
  if (!shared) shared = createFabriksDecodeDispatcher();
  return shared;
}
