import { ScenePlane } from "./layers/two_d/ScenePlane";
import { SceneProbedPoint2D } from "./layers/two_d/SceneProbedPoint2D";
import { RectangleDrawer } from "./interactions/RectangleDrawer";
import { RoiDrawer } from "./interactions/RoiDrawer";

export const TwoDScene = () => {
  return (
    <>
      <ScenePlane />
      <SceneProbedPoint2D />
      <RectangleDrawer />
      <RoiDrawer />
    </>
  );
};
