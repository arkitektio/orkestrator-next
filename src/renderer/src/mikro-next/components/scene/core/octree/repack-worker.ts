import { repackBrick, type BrickArray, type RepackBrickInput } from "./brickRepack";

/**
 * Worker entry for brick repack: runs the pure `repackBrick` (strided copy +
 * edge replication + min/max scan over a whole stored brick) OFF the UI
 * thread. The input chunks arrive as SAB-backed typed arrays (zero-copy —
 * they stay in the main-side chunk cache) or, for the rare non-SAB chunk
 * (fill-value chunks), as structured-clone copies. The output brick is
 * allocated here and returned as a transferable ArrayBuffer.
 *
 * Protocol: `{ id, kind, elementCount, input }` → `{ id, buffer, min, max,
 * uniformValue }` (buffer transferred) or `{ id, error }`. See
 * `repackDispatcher.ts` for the main-thread side.
 */

export type RepackWorkerRequest = {
  id: number;
  kind: "r8" | "r32f";
  elementCount: number;
  input: Omit<RepackBrickInput, "output">;
};

export type RepackWorkerResponse =
  | { id: number; buffer: ArrayBuffer; min: number; max: number; uniformValue: number | null }
  | { id: number; error: string };

const ctx = self as unknown as Worker;

ctx.onmessage = (event: MessageEvent<RepackWorkerRequest>) => {
  const { id, kind, elementCount, input } = event.data;
  try {
    const output: BrickArray =
      kind === "r8" ? new Uint8Array(elementCount) : new Float32Array(elementCount);
    const result = repackBrick({ ...input, output });
    const response: RepackWorkerResponse = {
      id,
      buffer: output.buffer as ArrayBuffer,
      min: result.min,
      max: result.max,
      uniformValue: result.uniformValue,
    };
    ctx.postMessage(response, [output.buffer as ArrayBuffer]);
  } catch (error) {
    const response: RepackWorkerResponse = {
      id,
      error: error instanceof Error ? error.message : String(error),
    };
    ctx.postMessage(response);
  }
};
