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
