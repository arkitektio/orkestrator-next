import WorkerPool from "@/lib/zarr/pool/workerpool";


// Create a unified pool, sizing it to hardware concurrency (fallback to 4 if unavailable)
export const workerPool = new WorkerPool(navigator.hardwareConcurrency || 4);
