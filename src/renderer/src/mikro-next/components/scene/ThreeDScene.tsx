import { SceneVolume } from "./layers/three_d/SceneVolume";
import { RectangleDrawer } from "./interactions/RectangleDrawer";
import { RoiDrawer } from "./interactions/RoiDrawer";

export const ThreeDScene = () => {
  return (
    <>
      <SceneVolume />
      <RectangleDrawer />
      <RoiDrawer />
    </>
  );
};
