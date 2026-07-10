import * as THREE from "three";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useModeStore } from "../store/modeStore";
import { useViewerStore, useViewerStoreApi } from "../store/viewerStore";
import { useSceneStoreApi } from "../store/sceneStore";
import { computeProbeWorldPosition } from "../core/probeWorld";

import {
  ArcballControls,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";

// Left-drag pans (default OrbitControls maps LEFT to rotate). Rotate moves to
// the right button so 3D pan mode can still orbit; in 2D rotate is disabled.
const PAN_MOUSE_BUTTONS = {
  LEFT: THREE.MOUSE.PAN,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.ROTATE,
} as const;

/**
 * Keeps the OrbitControls pivot on the currently probed point while the
 * "Probe Orbit" camera mode is active. Uses a preserve-offset re-pivot: the
 * orbit target moves to the probe and the camera shifts by the same delta, so the
 * view doesn't jump — only the rotation center changes. Mounted inside the Canvas
 * (needs `useThree`) and only in 3D.
 */
const ProbeOrbitPivot = () => {
  const controls = useThree((s) => s.controls);
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const cameraControllerMode = useModeStore((s) => s.cameraControllerMode);
  const probedCoordinate = useViewerStore((s) => s.probedCoordinate);
  const viewerApi = useViewerStoreApi();
  const sceneApi = useSceneStoreApi();

  useEffect(() => {
    if (cameraControllerMode !== "PROBE_ORBIT" || !probedCoordinate) return;
    // ArcballControls (and any controls without a `.target`) are skipped.
    const ctrl =
      controls && "target" in controls
        ? (controls as unknown as { target: THREE.Vector3; update: () => void })
        : null;
    if (!ctrl) return;

    const { getArrayForStoreId } = viewerApi.getState();
    const layer = sceneApi
      .getState()
      .layers.find((l) => l.id === probedCoordinate.layerId);
    if (!layer) return;

    const world = computeProbeWorldPosition(layer, probedCoordinate, getArrayForStoreId);
    if (!world) return;

    const offset = camera.position.clone().sub(ctrl.target);
    ctrl.target.copy(world);
    camera.position.copy(world.clone().add(offset));
    ctrl.update();
    invalidate();
    // `controls` is a dependency because switching to PROBE_ORBIT remounts
    // OrbitControls (its key includes the mode), yielding a fresh controls object
    // with the target reset to the origin — we must re-apply the probe pivot then.
  }, [cameraControllerMode, probedCoordinate, controls, camera, invalidate, viewerApi, sceneApi]);

  return null;
};

export const CameraController = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const displayMode = useModeStore((s) => s.displayMode);
  const cameraControllerMode = useModeStore((s) => s.cameraControllerMode);
  const frustumNear = useViewerStore((s) => s.frustumNear);
  const frustumFar = useViewerStore((s) => s.frustumFar);

  const enablePan = interactionMode === "PAN";

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

      {/* Orbit Controls
            Disable panning/rotating while another interaction mode is active so the scene doesn't drag while selecting.
            */}
      {displayMode === "3D" ? (
        cameraControllerMode === "ARCBALL" ? (
          <ArcballControls
            key="arcball-controls-3d"
            makeDefault
          />
        ) : (
          <OrbitControls
            key={`orbit-controls-3d:${cameraControllerMode}`}
            makeDefault
            enableRotate={true}
            enablePan={enablePan}
            enableZoom={true}
            zoomToCursor={
              cameraControllerMode === "CURSOR_ORBIT" ||
              cameraControllerMode === "PROBE_ORBIT"
            }
            mouseButtons={enablePan ? PAN_MOUSE_BUTTONS : undefined}
          />
        )
      ) : (
        <OrbitControls
          key="orbit-controls-2d"
          makeDefault
          enableRotate={false}
          enablePan={interactionMode === "PAN"}
          enableZoom={true}
          screenSpacePanning={true}
          mouseButtons={PAN_MOUSE_BUTTONS}
        />
      )}

      {displayMode === "3D" && <ProbeOrbitPivot />}
    </>
  );
};
