import { ScenePlane } from "./ScenePlane";
import { SceneProbedPoint2D } from "./SceneProbedPoint2D";
import { RectangleDrawer } from "../features/annotations/RectangleDrawer";
import { RoiDrawer } from "../features/annotations/RoiDrawer";

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
