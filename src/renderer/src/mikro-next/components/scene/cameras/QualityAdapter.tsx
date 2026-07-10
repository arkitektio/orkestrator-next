import { useEffect, useRef, useSyncExternalStore } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { qualityGovernor, resolveDpr } from "../core/qualityGovernor";
import { getGpuKey, type SceneRenderer } from "../render/gpu/sceneRenderer";
import { useViewStore } from "../store/viewStore";

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
 *   tier's cheaper DPR, settle snaps back to the crisp one.
 *
 * Must be inside the Canvas. The 3D step-scale half of the profile is applied
 * by `BrickVolumeLayer` (same governor subscription).
 */
export const QualityAdapter = () => {
  const gl = useThree((s) => s.gl);
  const setDpr = useThree((s) => s.setDpr);
  const initialDpr = useThree((s) => s.viewport.initialDpr);
  const invalidate = useThree((s) => s.invalidate);
  const cameraMoving = useViewStore((s) => s.cameraMoving);
  // Rare notifications: tier / override / streaming flips.
  useSyncExternalStore(qualityGovernor.subscribe, () => qualityGovernor.getVersion());

  const lastFrameAtRef = useRef<number | null>(null);
  const appliedDprRef = useRef<number | null>(null);

  // Persistence: the learned tier is a property of the GPU (and backend —
  // WebGPU vs WebGL fallback have different perf), keyed so a driver/backend
  // change re-learns.
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
    if (last !== null) qualityGovernor.recordFrame(now - last);

    // Apply the profile DPR every frame (cheap compare; setDpr only on change).
    // Doing it here rather than only in an effect catches mid-gesture demotes.
    const active = cameraMoving || qualityGovernor.isStreaming();
    const dpr = resolveDpr(qualityGovernor.getProfile(), initialDpr, active);
    if (dpr !== appliedDprRef.current) {
      appliedDprRef.current = dpr;
      setDpr(dpr);
    }
  });

  // Settle / streaming-end: the demand frameloop may produce no further frame
  // on its own, so restore the crisp DPR eagerly and request one.
  useEffect(() => {
    const applySettled = () => {
      const active = cameraMoving || qualityGovernor.isStreaming();
      const dpr = resolveDpr(qualityGovernor.getProfile(), initialDpr, active);
      if (dpr !== appliedDprRef.current) {
        appliedDprRef.current = dpr;
        setDpr(dpr);
        invalidate();
      }
    };
    applySettled();
    return qualityGovernor.subscribe(applySettled);
  }, [cameraMoving, initialDpr, setDpr, invalidate]);

  return null;
};
