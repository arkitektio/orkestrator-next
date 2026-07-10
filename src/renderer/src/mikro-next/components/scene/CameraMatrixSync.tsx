import { useFrame } from "@react-three/fiber";
import { useViewStore } from "./store/viewStore";
import * as THREE from "three";
import { useRef, useEffect } from "react";

interface CameraMatrixSyncProps {
  /** Max cadence (ms) at which camera data is pushed DURING continuous motion. */
  throttleMs?: number;
  /** Trailing delay (ms) for the final push once the camera settles. */
  settleMs?: number;
  threshold?: number;
}

export const CameraMatrixSync = ({
  throttleMs = 60,
  settleMs = 150,
  threshold = 0.00001
}: CameraMatrixSyncProps) => {
  const updateCameraData = useViewStore((s) => s.updateCameraData);

  const matrixRef = useRef(new THREE.Matrix4());
  const previousFrameMatrix = useRef(new THREE.Matrix4());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEmitRef = useRef(0);
  // Last-seen projection inputs (NaN-initialized so the first frame always
  // updates). Order matches writes in the frame callback below.
  const projSigRef = useRef<Float64Array>(new Float64Array(14).fill(Number.NaN));
  const projSigScratch = useRef<Float64Array>(new Float64Array(14));

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useFrame(({ camera, size, clock }) => {
    // 1. CRITICAL: keep the projection matrix in sync with Zoom/FOV changes —
    // but only RECOMPUTE it when a projection input actually changed. During
    // multi-second streaming bursts the demand loop renders at full cadence
    // with a stationary camera; an unconditional updateProjectionMatrix()
    // every frame is pure waste. The signature must cover EVERY input
    // updateProjectionMatrix reads (zoom changes were silently missed once
    // before) — perspective: fov/aspect/near/far/zoom/film*; ortho:
    // left/right/top/bottom/near/far/zoom — plus canvas size and view-offset
    // enablement.
    const cam = camera as THREE.PerspectiveCamera & THREE.OrthographicCamera;
    const sig = projSigScratch.current;
    sig[0] = cam.zoom ?? 0;
    sig[1] = cam.near ?? 0;
    sig[2] = cam.far ?? 0;
    sig[3] = cam.fov ?? 0;
    sig[4] = cam.aspect ?? 0;
    sig[5] = cam.left ?? 0;
    sig[6] = cam.right ?? 0;
    sig[7] = cam.top ?? 0;
    sig[8] = cam.bottom ?? 0;
    sig[9] = cam.filmGauge ?? 0;
    sig[10] = cam.filmOffset ?? 0;
    sig[11] = cam.view && cam.view.enabled ? 1 : 0;
    sig[12] = size.width;
    sig[13] = size.height;
    const prevSig = projSigRef.current;
    let projectionDirty = false;
    for (let i = 0; i < sig.length; i++) {
      if (sig[i] !== prevSig[i]) {
        projectionDirty = true;
        break;
      }
    }
    if (projectionDirty) {
      camera.updateProjectionMatrix();
      prevSig.set(sig);
    }

    // 2. Calculate the combined View-Projection Matrix
    matrixRef.current.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );

    // 3. Movement/Zoom check
    let hasChanged = false;
    const cur = matrixRef.current.elements;
    const prev = previousFrameMatrix.current.elements;

    for (let i = 0; i < 16; i++) {
      if (Math.abs(cur[i] - prev[i]) > threshold) {
        hasChanged = true;
        break;
      }
    }

    // 4. If nothing changed, we exit early to save CPU
    if (!hasChanged) return;

    // 5. Update previous state for next frame check
    previousFrameMatrix.current.copy(matrixRef.current);

    // Capture the state at this exact moment
    const snapshot = matrixRef.current.clone();
    const currentSize = { width: size.width, height: size.height };
    const worldPos = camera.getWorldPosition(new THREE.Vector3());
    const perspective = (camera as THREE.PerspectiveCamera).isPerspectiveCamera === true;
    const pose = {
      position: [worldPos.x, worldPos.y, worldPos.z] as [number, number, number],
      isPerspective: perspective,
      fovY: perspective
        ? THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov)
        : 0,
    };
    const nowMs = clock.getElapsedTime() * 1000;

    // 6a. Trailing settle: guarantees a final, crisp update once the camera
    // comes to rest (the last motion frame may fall inside the throttle gap).
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateCameraData(snapshot, currentSize, pose, false); // settled
    }, settleMs);

    // 6b. Leading throttle: push DURING continuous motion at a bounded cadence
    // so panning retriggers the (linked) visibility + chunk-planning pipeline
    // live, instead of only after the camera stops.
    if (nowMs - lastEmitRef.current >= throttleMs) {
      lastEmitRef.current = nowMs;
      updateCameraData(snapshot, currentSize, pose, true); // in motion
    }
  });

  return null;
};
