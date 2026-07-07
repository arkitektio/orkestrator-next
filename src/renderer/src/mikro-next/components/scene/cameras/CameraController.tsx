import * as THREE from "three";
import { useModeStore } from "../store/modeStore";
import { useViewerStore } from "../store/viewerStore";

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
            zoomToCursor={cameraControllerMode === "CURSOR_ORBIT"}
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
    </>
  );
};
