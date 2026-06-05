import { CullingDebugRing } from "./layers/debug/CullingDebugRing";
import { SceneDataRois } from "./layers/SceneDataRois";
import { ScenePlane } from "./layers/two_d/ScenePlane";
import { SceneProbedPoint2D } from "./layers/two_d/SceneProbedPoint2D";
import { RectangleDrawer } from "./interactions/RectangleDrawer";
import { RoiDrawer } from "./interactions/RoiDrawer";

export const TwoDScene = () => {
  return (
    <>
      <CullingDebugRing />
      <ScenePlane />
      <SceneProbedPoint2D />
      <SceneDataRois />
      <RectangleDrawer />
      <RoiDrawer />
    </>
  );
};
