import { CullingDebugRing } from "./layers/debug/CullingDebugRing";
import { SceneDataRois } from "./layers/SceneDataRois";
import { ScenePlane } from "./layers/two_d/ScenePlane";
import { RectangleDrawer } from "./interactions/RectangleDrawer";
import { RoiDrawer } from "./interactions/RoiDrawer";

export const TwoDScene = () => {
  return (
    <>
      <CullingDebugRing />
      <ScenePlane />
      <SceneDataRois />
      <RectangleDrawer />
      <RoiDrawer />
    </>
  );
};
