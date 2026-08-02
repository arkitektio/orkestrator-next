/**
 * Per-frame GPU upload budget for `drainUploads` (P19).
 *
 * Byte/brick caps alone were calibrated on dedicated GPUs where a
 * `texSubImage3D` costs ≪1 ms; on integrated GPUs (measured: Apple M2 via
 * ANGLE-Metal at ~17.5 ms per 256²-brick upload) a 12-brick batch stalls the
 * main thread for >200 ms per streaming frame. The WALL-CLOCK cap is therefore
 * the binding constraint on such machines (they self-limit to ~1 brick per
 * frame and stay smooth), while fast GPUs still fit their full byte/brick
 * batch inside it. Pure module so the predicate is unit-testable.
 */

export type DrainBudget = {
  maxBytes: number;
  maxBricks: number;
  maxMs: number;
};

export type DrainProgress = {
  bytes: number;
  bricks: number;
  elapsedMs: number;
};

export const FRAME_UPLOAD_BUDGET: DrainBudget = {
  maxBytes: 6 * 1024 * 1024,
  maxBricks: 12,
  // ≈ ¼ of a 60 Hz frame: leaves headroom for the render itself.
  maxMs: 4,
};

/**
 * Whether the drain loop may upload another brick. The FIRST brick of a drain
 * always proceeds — even when a single upload exceeds the time budget,
 * streaming must make progress every frame.
 */
export function shouldContinueDrain(
  progress: DrainProgress,
  budget: DrainBudget = FRAME_UPLOAD_BUDGET,
): boolean {
  if (progress.bricks === 0) return true;
  return (
    progress.bytes < budget.maxBytes &&
    progress.bricks < budget.maxBricks &&
    progress.elapsedMs < budget.maxMs
  );
}

/**
 * Strict leftover-budget predicate for STALE (out-of-plan) uploads: no
 * first-brick free pass — the free pass exists so visible data always makes
 * progress, and a stale brick must never be the one that causes the >maxMs
 * hitch it permits. Every budget dimension binds.
 */
export function shouldContinueStaleDrain(
  progress: DrainProgress,
  budget: DrainBudget = FRAME_UPLOAD_BUDGET,
): boolean {
  return (
    progress.bytes < budget.maxBytes &&
    progress.bricks < budget.maxBricks &&
    progress.elapsedMs < budget.maxMs
  );
}

/** Stale entries kept queued per pool awaiting leftover budget; beyond this
 * the oldest are dropped (their decoded chunks stay cached, so a flip-back
 * refetches cheaply — holding many ~MB repacked payloads is the real cost). */
export const MAX_STALE_QUEUE = 24;

export type QueueEntry = { key: string; uniformValue: number | null; level: number };

/**
 * Planned-first partition of an upload queue. Uniform (EMPTY) entries always
 * count as planned: they cost no slot and are valid fallback data regardless
 * of the current plan. FIFO order is preserved within each partition; stale
 * entries beyond `maxStale` (oldest first) are returned as `dropped`.
 *
 * `minUsefulLevel` drops out-of-plan entries the shader could never sample —
 * bricks FINER than every plan's target level, whose residency walk starts at
 * the desired level and moves coarser. Without it, the pool trim that reclaims
 * such slots would be undone on the very next drain: the freed headroom would
 * refill with the same unreachable bricks. Uniform entries are exempt (no slot
 * to compete for), as are protected ones (in some plan by definition).
 */
export function partitionUploadQueue<T extends QueueEntry>(
  queue: readonly T[],
  protectedKeys: { has(key: string): boolean },
  maxStale: number,
  minUsefulLevel = 0,
): { planned: T[]; stale: T[]; dropped: T[] } {
  const planned: T[] = [];
  const stale: T[] = [];
  const unreachable: T[] = [];
  for (const entry of queue) {
    if (entry.uniformValue !== null || protectedKeys.has(entry.key)) {
      planned.push(entry);
    } else if (entry.level < minUsefulLevel) {
      unreachable.push(entry);
    } else {
      stale.push(entry);
    }
  }
  const excess = Math.max(0, stale.length - Math.max(0, maxStale));
  return {
    planned,
    stale: stale.slice(excess),
    dropped: [...unreachable, ...stale.slice(0, excess)],
  };
}
