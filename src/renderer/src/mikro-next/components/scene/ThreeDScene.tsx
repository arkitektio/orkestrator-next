import { useState } from "react";
import { SceneVolume } from "./layers/three_d/SceneVolume";
import { BrushStrokeSession } from "./interactions/BrushStrokeSession";
import { ProbeAxisGuides } from "./interactions/ProbeAxisGuides";
import { RoiDrawer } from "./interactions/RoiDrawer";
import { VolumeCompositor } from "./managers/VolumeCompositor";
import { isVolumeTargetEnabled } from "./render/volumeTargetFlags";

export const ThreeDScene = () => {
  // Read once per mount (like smoothZoom): the flag also switches the image
  // materials' blend mode, so a flip must re-enter through a scene remount.
  const [volumeTarget] = useState(isVolumeTargetEnabled);
  return (
    <>
      {volumeTarget && <VolumeCompositor />}
      <SceneVolume />
      {/* Axis guides through the probed point — probing and 3D annotating are
          both probe-driven, so the guides serve as the anchor preview too. */}
      <ProbeAxisGuides />
      {/* No RectangleDrawer: the marquee is 2D-only, and the toolbar hides its
          tool in 3D — mounting it here only ever rendered null. */}
      <RoiDrawer />
      {/* The skeleton brush's session: stroke/centerline previews, controls
          suspension, extraction trigger. The capture itself lives in
          BrickVolumeLayer's pointer handlers. */}
      <BrushStrokeSession />
    </>
  );
};
