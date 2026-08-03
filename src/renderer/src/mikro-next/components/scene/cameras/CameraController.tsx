import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useModeStore, useModeStoreApi } from "../store/modeStore";
import { useViewerStore, useViewerStoreApi } from "../store/viewerStore";
import { useSceneStoreApi } from "../store/sceneStore";
import { useAnimationStore, useAnimationStoreApi } from "../store/animationStore";
import { computeProbeWorldPosition } from "../core/probeWorld";
import { repivotPreservingView, shouldRepivot } from "../core/orbitPivot";
import {
  contentDistanceAlongRay,
  orbitDepthAlongRay,
  resolvePanSpeed,
} from "../core/panScale";
import { useViewStoreApi } from "../store/viewStore";

import {
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";

/**
 * Button maps per (display mode × interaction mode).
 *
 * These must be module-level constants: R3F diffs object props by *reference*,
 * so an inline literal would re-apply on every commit. And every branch must
 * pass an explicit map — `mouseButtons={undefined}` is a latch, not a reset
 * (R3F's `applyProps` skips undefined values), so once a map is applied it
 * sticks for the life of the controls instance.
 *
 * In NAVIGATE, left-drag pans (OrbitControls' own default maps LEFT to rotate).
 * In the tool modes the left button belongs to the tool, so the controls must
 * not claim it — the maps simply omit LEFT, which three-stdlib's button switch
 * treats as no action at all (`STATE.NONE`). Right/middle-drag and the wheel
 * still navigate, which is what keeps a 2D probe session from being stuck in
 * place. Omitting LEFT is also the only assignment where shift-click (save
 * probe) and shift-drag (merge selection) can't be hijacked: three-stdlib swaps
 * PAN↔ROTATE when shift is held.
 */
const NAVIGATE_BUTTONS_3D = {
  LEFT: THREE.MOUSE.PAN,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.ROTATE,
} as const;

const NAVIGATE_BUTTONS_2D = {
  LEFT: THREE.MOUSE.PAN,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN,
} as const;

const TOOL_BUTTONS_3D = {
  MIDDLE: THREE.MOUSE.PAN,
  RIGHT: THREE.MOUSE.ROTATE,
} as const;

const TOOL_BUTTONS_2D = {
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN,
} as const;

/**
 * Keeps the OrbitControls pivot on the probed point while "Orbit around probe"
 * is on. The geometry and the when-do-we-move rule live in `core/orbitPivot.ts`;
 * this is the store glue. Mounted inside the Canvas (needs `useThree`) and only
 * in 3D.
 */
const ProbeOrbitPivot = () => {
  const controls = useThree((s) => s.controls);
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const pivotOnProbe = useModeStore((s) => s.pivotOnProbe);
  const probedCoordinate = useViewerStore((s) => s.probedCoordinate);
  const playingId = useAnimationStore((s) => s.playingId);
  const viewerApi = useViewerStoreApi();
  const sceneApi = useSceneStoreApi();
  const wasEnabledRef = useRef(false);

  useEffect(() => {
    // Turning the setting on pivots to whatever probe is current, even a
    // hover-origin one, so the switch has an immediate visible effect.
    const justEnabled = pivotOnProbe && !wasEnabledRef.current;
    wasEnabledRef.current = pivotOnProbe;

    if (
      !shouldRepivot({
        pivotOnProbe,
        probe: probedCoordinate,
        isAnimationPlaying: playingId !== null,
        justEnabled,
      })
    ) {
      return;
    }
    // `probedCoordinate` is non-null here — `shouldRepivot` returned true.
    const probe = probedCoordinate!;

    // Any controls without a `.target` are skipped.
    const ctrl =
      controls && "target" in controls
        ? (controls as unknown as { target: THREE.Vector3; update: () => void })
        : null;

    const { getArrayForStoreId } = viewerApi.getState();
    const layer = sceneApi.getState().layers.find((l) => l.id === probe.layerId);
    if (!layer) return;

    const world = computeProbeWorldPosition(layer, probe, getArrayForStoreId);
    if (!world) return;

    if (repivotPreservingView({ camera, controls: ctrl }, world)) invalidate();
    // `controls` is a dependency because a 2D↔3D switch remounts OrbitControls,
    // yielding a fresh object with the target back at the origin — the pivot has
    // to be re-applied then. Camera-setting changes no longer remount it.
  }, [
    pivotOnProbe,
    probedCoordinate,
    playingId,
    controls,
    camera,
    invalidate,
    viewerApi,
    sceneApi,
  ]);

  return null;
};

/**
 * Zoom-sensitive navigation (3D only — the orthographic pan already divides
 * by `camera.zoom`). OrbitControls scales pan AND dolly by the camera→target
 * distance, which both dolly and zoomToCursor collapse toward zero as you
 * zoom into a volume — pan and zoom freeze while the screen is still full of
 * voxels at real distances. Two mechanisms, both fed by the layer boxes along
 * the view ray (`core/panScale.ts`):
 *
 * - **Continuous** (every throttled camera emission, ≤16 Hz): keep
 *   `controls.panSpeed = contentDistance / targetDistance`, so a drag stays
 *   screen-space correct at the CONTENT even mid-gesture, whatever the orbit
 *   radius did.
 * - **On settle** (cameraMoving true→false edge): re-seat the orbit target
 *   ALONG THE VIEW RAY at the visible chord's midpoint
 *   (`orbitDepthAlongRay`). The camera does not move and keeps looking the
 *   same way — the view is pixel-identical — but the radius becomes the
 *   content depth, so three's OWN radius-proportional math makes dolly steps,
 *   pan scale and the rotate pivot zoom-sensitive natively. (Scaling
 *   `zoomSpeed` instead cannot work: dolly is multiplicative toward the
 *   target, so no speed factor lets a step escape a collapsed radius.)
 *
 * Skipped while "orbit around probe" or an animation owns the target/camera.
 * All outside React — no store writes, no re-renders. The box walk mirrors
 * `core/visibility.ts` (`Box3.setFromObject` per layer trackable), which
 * already runs per rAF; this runs strictly less often.
 */
const PanScaleSync = () => {
  const controls = useThree((s) => s.controls);
  const camera = useThree((s) => s.camera);
  const viewApi = useViewStoreApi();
  const viewerApi = useViewerStoreApi();
  const animationApi = useAnimationStoreApi();
  const modeApi = useModeStoreApi();

  useEffect(() => {
    const ctrl =
      controls && "target" in controls
        ? (controls as unknown as {
            target: THREE.Vector3;
            panSpeed: number;
            update: () => void;
          })
        : null;
    const perspective = camera as THREE.PerspectiveCamera;
    if (!ctrl || !perspective?.isPerspectiveCamera) return;

    const viewDirection = new THREE.Vector3();
    const scratchBox = new THREE.Box3();
    const boxes: THREE.Box3[] = []; // pooled — grown once, reused per gather

    // Layer boxes are WORLD-space and camera-independent, so they are
    // gathered on mount and on each settle (retarget) — not per camera
    // emission: the setFromObject subtree walks were running at ~17 Hz per
    // layer during a gesture for values that cannot change mid-gesture.
    const gatherBoxes = () => {
      const { trackables } = viewerApi.getState();
      let count = 0;
      for (const trackable of trackables) {
        if (trackable.kind !== "layer") continue;
        const object = trackable.ref.current;
        if (!object || object.visible === false) continue;
        scratchBox.setFromObject(object);
        if (scratchBox.isEmpty()) continue;
        (boxes[count] ??= new THREE.Box3()).copy(scratchBox);
        count += 1;
      }
      boxes.length = count;
    };

    const applyPanSpeed = () => {
      const targetDistance = perspective.position.distanceTo(ctrl.target);
      perspective.getWorldDirection(viewDirection);
      const contentDistance = contentDistanceAlongRay(
        perspective.position,
        viewDirection,
        boxes,
        targetDistance,
      );
      const next = resolvePanSpeed(contentDistance, targetDistance);
      // Write only on real change: panSpeed is read by the NEXT drag delta,
      // so a 1% dead band avoids churning the property mid-gesture for noise.
      if (Math.abs(next - ctrl.panSpeed) > 0.01 * Math.max(ctrl.panSpeed, 1e-6)) {
        ctrl.panSpeed = next;
      }
    };

    const retarget = () => {
      // The probe pivot owns the target and the animation player owns the
      // whole camera — never fight either.
      if (modeApi.getState().pivotOnProbe) return;
      if (animationApi.getState().playingId !== null) return;

      gatherBoxes();
      const targetDistance = perspective.position.distanceTo(ctrl.target);
      perspective.getWorldDirection(viewDirection);
      const depth = orbitDepthAlongRay(
        perspective.position,
        viewDirection,
        boxes,
        targetDistance,
      );
      // 5% dead band: a settle right after a settle-retarget must be a no-op.
      if (!(depth > 0) || Math.abs(depth - targetDistance) <= 0.05 * targetDistance) return;
      ctrl.target.copy(perspective.position).addScaledVector(viewDirection, depth);
      // Camera position and look direction are unchanged (the target moved
      // along the view ray), so update() emits no camera change — no
      // emission loop, no visual change, no invalidate needed.
      ctrl.update();
      applyPanSpeed(); // radius just became the content depth → ratio ≈ 1
    };

    gatherBoxes();
    applyPanSpeed();
    retarget();
    let lastMatrix = viewApi.getState().viewProjectionMatrix;
    let lastMoving = viewApi.getState().cameraMoving;
    const unsubscribe = viewApi.subscribe((state) => {
      if (state.viewProjectionMatrix !== lastMatrix) {
        lastMatrix = state.viewProjectionMatrix;
        applyPanSpeed();
      }
      if (state.cameraMoving !== lastMoving) {
        lastMoving = state.cameraMoving;
        if (!lastMoving) retarget();
      }
    });
    return () => {
      unsubscribe();
      // Leave stock behavior behind for the next controls consumer.
      ctrl.panSpeed = 1;
    };
  }, [controls, camera, viewApi, viewerApi, animationApi, modeApi]);

  return null;
};

export const CameraController = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const displayMode = useModeStore((s) => s.displayMode);
  const zoomToCursor = useModeStore((s) => s.zoomToCursor);
  const frustumNear = useViewerStore((s) => s.frustumNear);
  const frustumFar = useViewerStore((s) => s.frustumFar);

  // Pan and rotate stay *enabled* in every mode; the button map alone decides
  // what a drag does. Disabling them was only ever a blunt way of neutering the
  // left button, and it left tool modes with no way to move the view at all.
  const isNavigate = interactionMode === "NAVIGATE";

  return (
    <>
      {/* Camera Rig */}
      {displayMode === "3D" ? (
        <PerspectiveCamera
          key="perspective-camera"
          makeDefault
          position={[0, -200, 200]}
          fov={45}
          up={[0, 0, 1]}
          near={frustumNear}
          far={frustumFar}
        />
      ) : (
        <OrthographicCamera
          key="orthographic-camera"
          makeDefault
          zoom={5}
          position={[0, 0, 50000]}
          up={[0, 1, 0]}
          near={frustumNear}
          far={frustumFar}
        />
      )}

      {/* Orbit Controls. The key deliberately carries only the display mode:
            camera settings are live props now, so toggling one no longer
            remounts the controls (which used to reset the orbit target to the
            origin, breaking the probe pivot the moment you enabled it). */}
      {displayMode === "3D" ? (
        <OrbitControls
          key="orbit-controls-3d"
          makeDefault
          enableRotate={true}
          enablePan={true}
          enableZoom={true}
          zoomToCursor={zoomToCursor}
          mouseButtons={isNavigate ? NAVIGATE_BUTTONS_3D : TOOL_BUTTONS_3D}
        />
      ) : (
        <OrbitControls
          key="orbit-controls-2d"
          makeDefault
          enableRotate={false}
          enablePan={true}
          enableZoom={true}
          screenSpacePanning={true}
          mouseButtons={isNavigate ? NAVIGATE_BUTTONS_2D : TOOL_BUTTONS_2D}
        />
      )}

      {displayMode === "3D" && <ProbeOrbitPivot />}
      {displayMode === "3D" && <PanScaleSync />}
    </>
  );
};
