import { useEffect, useRef, useSyncExternalStore } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { qualityGovernor, resolveDpr } from "../core/qualityGovernor";
import { getGpuKey, type SceneRenderer } from "../render/gpu/sceneRenderer";
import { useViewStore, useViewStoreApi } from "../store/viewStore";

/**
 * React binding for the quality governor (P19): feeds frame times in, applies
 * the tier's DPR out.
 *
 * - `useFrame` records rAF deltas into the governor (refs only — no store
 *   writes, P17). The governor demotes/promotes the machine's tier from
 *   sustained streaks with hysteresis; the learned tier persists per GPU.
 * - "Active" = camera moving OR bricks streaming — the streaming half is what
 *   the old motion-only regress missed: after a gesture, every residency bump
 *   rendered a full-quality frame for seconds. Active frames render at the
 *   tier's cheaper DPR, settle restores the crisp one.
 * - The active→settled DPR restore is HYSTERETIC (`SETTLE_RESTORE_MS`): every
 *   `setDpr` change reallocates the render targets, and `cameraMoving`'s
 *   trailing debounce plus streaming on/off chatter used to bounce the DPR
 *   1.0↔1.5 several times per gesture — each bounce a multi-hundred-ms
 *   realloc spike. Dropping to the active DPR stays immediate (demotes must
 *   land mid-gesture); only the restore waits for sustained quiet.
 *
 * Must be inside the Canvas. The 3D step-scale half of the profile is applied
 * by `BrickVolumeLayer` (same governor subscription).
 */

/** How long activity must stay quiet before the crisp settled DPR returns. */
const SETTLE_RESTORE_MS = 500;

export const QualityAdapter = () => {
  const gl = useThree((s) => s.gl);
  const setDpr = useThree((s) => s.setDpr);
  const initialDpr = useThree((s) => s.viewport.initialDpr);
  const invalidate = useThree((s) => s.invalidate);
  const cameraMoving = useViewStore((s) => s.cameraMoving);
  const viewApi = useViewStoreApi();
  // Rare notifications: tier / override / streaming flips.
  useSyncExternalStore(qualityGovernor.subscribe, () => qualityGovernor.getVersion());

  const lastFrameAtRef = useRef<number | null>(null);
  const appliedDprRef = useRef<number | null>(null);
  /** Wall-clock stamp of when activity last went quiet (null while active). */
  const settledAtRef = useRef<number | null>(null);
  const restoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persistence: the learned tier is a property of the GPU, keyed so a
  // driver/GPU change re-learns.
  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    qualityGovernor.configurePersistence(
      localStorage,
      getGpuKey(gl as unknown as SceneRenderer),
    );
  }, [gl]);

  useFrame(() => {
    const now = performance.now();
    const last = lastFrameAtRef.current;
    lastFrameAtRef.current = now;
    // `active` lets the governor tell a ≥250ms frame during a gesture (real
    // jank, counted with weighted votes) from an idle demand-frameloop gap
    // (discarded). cameraMoving's trailing debounce means a long frame ending
    // just after a gesture still reads as active.
    const active = cameraMoving || qualityGovernor.isStreaming();
    if (last !== null) qualityGovernor.recordFrame(now - last, now, active);

    // Apply the profile DPR every frame (cheap compare; setDpr only on change).
    // Doing it here rather than only in an effect catches mid-gesture demotes.
    if (active) {
      settledAtRef.current = null;
      const dpr = resolveDpr(qualityGovernor.getProfile(), initialDpr, true);
      if (dpr !== appliedDprRef.current) {
        appliedDprRef.current = dpr;
        setDpr(dpr);
      }
      return;
    }
    // Quiet: restore the settled DPR only after SETTLE_RESTORE_MS of
    // continuous quiet (covers the continuous-rendering case; the effect's
    // timer covers the demand-idle case where no frames flow).
    if (settledAtRef.current === null) settledAtRef.current = now;
    if (now - settledAtRef.current >= SETTLE_RESTORE_MS) {
      const dpr = resolveDpr(qualityGovernor.getProfile(), initialDpr, false);
      if (dpr !== appliedDprRef.current) {
        appliedDprRef.current = dpr;
        setDpr(dpr);
      }
    }
  });

  // Settle / streaming-end: the demand frameloop may produce no further frame
  // on its own, so the restore needs a timer — scheduled on every quiet edge,
  // re-checking freshly when it fires so a resumed gesture cancels it.
  useEffect(() => {
    const clearTimer = () => {
      if (restoreTimerRef.current !== null) {
        clearTimeout(restoreTimerRef.current);
        restoreTimerRef.current = null;
      }
    };
    const scheduleRestore = () => {
      clearTimer();
      if (viewApi.getState().cameraMoving || qualityGovernor.isStreaming()) return;
      restoreTimerRef.current = setTimeout(() => {
        restoreTimerRef.current = null;
        if (viewApi.getState().cameraMoving || qualityGovernor.isStreaming()) return;
        const dpr = resolveDpr(qualityGovernor.getProfile(), initialDpr, false);
        if (dpr !== appliedDprRef.current) {
          appliedDprRef.current = dpr;
          setDpr(dpr);
          invalidate();
        }
      }, SETTLE_RESTORE_MS);
    };
    scheduleRestore();
    const unsubscribe = qualityGovernor.subscribe(scheduleRestore);
    return () => {
      unsubscribe();
      clearTimer();
    };
  }, [cameraMoving, initialDpr, setDpr, invalidate, viewApi]);

  return null;
};
