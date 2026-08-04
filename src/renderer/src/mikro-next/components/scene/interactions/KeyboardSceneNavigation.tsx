import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import {
  ORBIT_STEP_RAD,
  ZOOM_STEP,
  navigationActionForKey,
  panDistance,
  stepSceneZ,
} from "../core/sceneNavigation";
import { sceneZExtent } from "../core/worldTransform";
import { useModeStoreApi } from "../store/modeStore";
import { useSceneStoreApi } from "../store/sceneStore";
import { useViewerStoreApi } from "../store/viewerStore";
import { isSceneNavigationTarget } from "./keyboardTarget";

/**
 * The camera surface this needs. OrbitControls is all of it and more; narrowing
 * structurally is what every other camera-toucher in the tree does, and it keeps
 * this honest about the four things it actually touches.
 */
type NavControls = {
  target: THREE.Vector3;
  update: () => void;
  minZoom?: number;
  maxZoom?: number;
  getAzimuthalAngle?: () => number;
  setAzimuthalAngle?: (value: number) => void;
  dispatchEvent?: (event: { type: string }) => void;
};

const scratchRight = new THREE.Vector3();
const scratchUp = new THREE.Vector3();
const scratchDelta = new THREE.Vector3();

/**
 * Arrow keys drive the scene: bare arrows pan, Shift+←/→ walks the Z stack,
 * Shift+↑/↓ zooms. The map itself lives in `core/sceneNavigation.ts`; this
 * applies it to the live rig.
 *
 * Mounted INSIDE the Canvas (after `<CameraController/>`, which installs the
 * controls) because it needs the real OrbitControls instance — `RoiDrawer` sets
 * the same precedent of a window listener on an in-canvas component, and the
 * zustand scopes reach in here just as they do for `AnimationPlayer`.
 */
export const KeyboardSceneNavigation = () => {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const viewerApi = useViewerStoreApi();
  const sceneApi = useSceneStoreApi();
  const modeApi = useModeStoreApi();

  useEffect(() => {
    const ctrl =
      controls && "target" in controls ? (controls as unknown as NavControls) : null;
    if (!ctrl) return;

    /**
     * Tell `InitialCameraFit` the user has taken the wheel. It arms its latch
     * off the controls' "start" event, which only a pointer gesture fires — so
     * without this, the next canvas resize would re-fit and throw away
     * everything that was navigated to by keyboard.
     */
    const claimCamera = () => ctrl.dispatchEvent?.({ type: "start" });

    const pan = (dx: number, dy: number) => {
      const distance = panDistance(
        camera as { isOrthographicCamera?: boolean; zoom?: number; fov?: number },
        camera.position.distanceTo(ctrl.target),
        size.height,
      );

      // The camera's own screen basis, so "right" means right on screen in
      // either display mode and at any orientation.
      scratchRight.setFromMatrixColumn(camera.matrix, 0);
      scratchUp.setFromMatrixColumn(camera.matrix, 1);
      scratchDelta
        .copy(scratchRight)
        .multiplyScalar(dx * distance)
        .addScaledVector(scratchUp, dy * distance);

      // Both ends move together, so the target-relative offset `update()`
      // rebuilds the position from is unchanged and the pan survives it.
      camera.position.add(scratchDelta);
      ctrl.target.add(scratchDelta);
      ctrl.update();
    };

    const zoom = (direction: 1 | -1) => {
      const factor = direction === 1 ? ZOOM_STEP : 1 / ZOOM_STEP;
      const ortho = camera as THREE.OrthographicCamera;

      if (ortho.isOrthographicCamera) {
        // Safe against `update()`: it only rewrites `zoom` when its internal
        // dolly scale is not 1, which a direct write never sets. It does not
        // clamp in that case either, hence the explicit bounds.
        ortho.zoom = Math.min(
          ctrl.maxZoom ?? Infinity,
          Math.max(ctrl.minZoom ?? 0, ortho.zoom * factor),
        );
        ortho.updateProjectionMatrix();
      } else {
        // Dolly along the view ray. `update()` clamps the resulting radius to
        // the controls' min/max distance for us.
        scratchDelta.copy(camera.position).sub(ctrl.target).multiplyScalar(1 / factor);
        camera.position.copy(ctrl.target).add(scratchDelta);
      }
      ctrl.update();
    };

    const orbit = (direction: 1 | -1) => {
      const { getAzimuthalAngle, setAzimuthalAngle } = ctrl;
      if (!getAzimuthalAngle || !setAzimuthalAngle) return;
      // Subtracted, so → turns the camera to the right: OrbitControls decreases
      // theta for a rightward drag, and the key should feel like the gesture.
      // The setter calls `update()` itself.
      setAzimuthalAngle(getAzimuthalAngle() - direction * ORBIT_STEP_RAD);
    };

    const stepZ = (direction: 1 | -1) => {
      const extent = sceneZExtent(sceneApi.getState().layers);
      if (!extent) return; // A scene of single planes has nothing to walk.

      const { currentZ, setCurrentZ } = viewerApi.getState();
      const next = stepSceneZ(extent, currentZ, direction);
      if (next !== currentZ) setCurrentZ(next);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl/Alt+arrow are browser and OS navigation. Shift is ours.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!isSceneNavigationTarget(e.target as { tagName?: string } | null)) return;

      // The mode decides what Shift+←/→ means, so it is part of the map rather
      // than a branch out here.
      const action = navigationActionForKey(
        e.code,
        e.shiftKey,
        modeApi.getState().displayMode,
      );
      if (!action) return;

      // Arrows scroll the page by default, and `e.repeat` is deliberately NOT
      // filtered — holding a key should keep moving.
      e.preventDefault();

      // Stepping the stack moves the data, not the camera: no fit latch to
      // claim and no frame to force — the store write re-renders the layers.
      if (action.kind === "z") {
        stepZ(action.direction);
        return;
      }

      if (action.kind === "pan") pan(action.dx, action.dy);
      else if (action.kind === "orbit") orbit(action.direction);
      else zoom(action.direction);

      claimCamera();
      invalidate(); // frameloop="demand": nothing redraws unless asked.
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [camera, controls, size.height, invalidate, viewerApi, sceneApi, modeApi]);

  return null; // Headless: a binding, not a control.
};
