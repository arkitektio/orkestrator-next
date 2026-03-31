import { useModeStore } from "../store/modeStore";

import {
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";

export const CameraController = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const displayMode = useModeStore((s) => s.displayMode);

  return (
    <>
      {/* Camera Rig */}
      {displayMode === "3D" ? (
        <PerspectiveCamera
          makeDefault
          position={[0, -200, 200]}
          fov={45}
          up={[0, 0, 1]}
          // Extend the clipping planes to prevent geometry from being cut off
          near={0.1}
          far={10000}
        />
      ) : (
        <OrthographicCamera
          makeDefault
          zoom={5}
          position={[0, 0, 500]}
          up={[0, 1, 0]}
          // Extend the clipping planes for the orthographic view as well
          near={0.1}
          far={10000}
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
