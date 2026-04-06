import { useModeStore } from "../store/modeStore";
import { useViewerStore } from "../store/viewerStore";

import {
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";

export const CameraController = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const displayMode = useModeStore((s) => s.displayMode);
  const frustumNear = useViewerStore((s) => s.frustumNear);
  const frustumFar = useViewerStore((s) => s.frustumFar);

  return (
    <>
      {/* Camera Rig */}
      {displayMode === "3D" ? (
        <PerspectiveCamera
          makeDefault
          position={[0, -200, 200]}
          fov={45}
          up={[0, 0, 1]}
          near={frustumNear}
          far={frustumFar}
        />
      ) : (
        <OrthographicCamera
          makeDefault
          zoom={5}
          position={[0, 0, 50000]}
          up={[0, 1, 0]}
          near={frustumNear}
          far={frustumFar}
        />
      )}

      {/* Orbit Controls
                Disable panning/rotating when scanning so the screen doesn't drag while drawing.
            */}
      {displayMode === "3D" ? (
        <OrbitControls
          makeDefault
          enableRotate={displayMode === "3D"}
          enablePan={interactionMode === "PAN"}
          enableZoom={true}
        />
      ) : (
        <OrbitControls
          makeDefault
          enableRotate={false}
          enablePan={interactionMode === "PAN"}
          enableZoom={true}
          screenSpacePanning={true}
        />
      )}
    </>
  );
};
