import { SceneVolume } from "./layers/three_d/SceneVolume";
import { RoiDrawer } from "./interactions/RoiDrawer";

export const ThreeDScene = () => {
  return (
    <>
      <SceneVolume />
      {/* No RectangleDrawer: the marquee is 2D-only, and the toolbar hides its
          tool in 3D — mounting it here only ever rendered null. */}
      <RoiDrawer />
    </>
  );
};
