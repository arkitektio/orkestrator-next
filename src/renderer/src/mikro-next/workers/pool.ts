import WorkerPool from "@/lib/zarr/pool/workerpool";
import { ZARR_WORKER_POOL_SIZE } from "./config";


export const workerPool = new WorkerPool(ZARR_WORKER_POOL_SIZE);
