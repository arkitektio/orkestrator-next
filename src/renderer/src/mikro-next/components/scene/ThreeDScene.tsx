import { SceneVolume } from "./layers/three_d/SceneVolume";
import { ProbeAxisGuides } from "./interactions/ProbeAxisGuides";
import { RoiDrawer } from "./interactions/RoiDrawer";

export const ThreeDScene = () => {
  return (
    <>
      <SceneVolume />
      {/* Axis guides through the probed point — probing and 3D annotating are
          both probe-driven, so the guides serve as the anchor preview too. */}
      <ProbeAxisGuides />
      {/* No RectangleDrawer: the marquee is 2D-only, and the toolbar hides its
          tool in 3D — mounting it here only ever rendered null. */}
      <RoiDrawer />
    </>
  );
};
