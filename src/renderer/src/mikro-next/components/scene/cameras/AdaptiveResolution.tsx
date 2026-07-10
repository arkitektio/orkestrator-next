import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useViewStore, useViewStoreApi } from "../store/viewStore";

/**
 * Adaptive render-resolution regress for GPU-bound machines (P19).
 *
 * Integrated GPUs (e.g. Apple M2 at Retina DPR 2) can be GPU-bound just
 * compositing the brick layers (~19 ms/frame measured in 2D), capping
 * interaction at ~40 fps. While the camera is MOVING and the rolling frame
 * time shows the machine can't hold rate, the device pixel ratio is halved;
 * the settle emission restores full resolution (the demand frameloop then
 * renders one crisp frame). Machines that hold frame rate never regress — a
 * dedicated GPU sees no change.
 *
 * Hysteresis: once a gesture regresses it stays regressed until settle (no
 * mid-drag oscillation). Frame times are tracked in a ref (no store writes —
 * P17); deltas over 250 ms are ignored (demand-frameloop idle gaps, not real
 * frame times).
 */

/** Rolling-average frame time above which motion frames regress (≈ <45 fps). */
const SLOW_FRAME_MS = 22;
/** EMA window, in frames. */
const SAMPLE_WINDOW = 30;
/** Deltas above this are idle gaps between demand frames, not frame cost. */
const MAX_CONTINUOUS_DELTA_MS = 250;

export const AdaptiveResolution = () => {
  const setDpr = useThree((s) => s.setDpr);
  const initialDpr = useThree((s) => s.viewport.initialDpr);
  const invalidate = useThree((s) => s.invalidate);
  const cameraMoving = useViewStore((s) => s.cameraMoving);
  const viewApi = useViewStoreApi();

  const avgFrameMsRef = useRef(0);
  const lastFrameAtRef = useRef<number | null>(null);
  const regressedRef = useRef(false);

  useFrame(() => {
    const now = performance.now();
    const last = lastFrameAtRef.current;
    lastFrameAtRef.current = now;
    if (last !== null) {
      const delta = now - last;
      if (delta < MAX_CONTINUOUS_DELTA_MS) {
        avgFrameMsRef.current =
          avgFrameMsRef.current === 0
            ? delta
            : avgFrameMsRef.current + (delta - avgFrameMsRef.current) / SAMPLE_WINDOW;
      }
    }

    // Escalate MID-gesture: the average only becomes meaningful once frames
    // are flowing, which is during the very interaction that needs relief.
    if (
      !regressedRef.current &&
      avgFrameMsRef.current > SLOW_FRAME_MS &&
      viewApi.getState().cameraMoving &&
      initialDpr > 1
    ) {
      regressedRef.current = true;
      setDpr(Math.max(1, initialDpr / 2));
    }
  });

  // Restore full resolution on settle (and never regress outside motion).
  useEffect(() => {
    if (!cameraMoving && regressedRef.current) {
      regressedRef.current = false;
      setDpr(initialDpr);
      invalidate();
    }
  }, [cameraMoving, setDpr, initialDpr, invalidate]);

  return null;
};
