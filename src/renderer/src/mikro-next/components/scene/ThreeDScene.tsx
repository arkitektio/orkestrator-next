import { useState } from "react";
import { SceneVolume } from "./layers/three_d/SceneVolume";
import { BrushStrokeSession } from "./enhancers/paths/brushSkeleton/BrushStrokeSession";
import { ProbeAxisGuides } from "./interactions/ProbeAxisGuides";
import { RoiDrawer } from "./interactions/RoiDrawer";
import { VolumeCompositor } from "./managers/VolumeCompositor";
import { isVolumeTargetEnabled } from "./render/volumeTargetFlags";

export const ThreeDScene = () => {
  // Read once per mount (like smoothZoom): mounting/unmounting the
  // compositor mid-session would flip the render-loop ownership under R3F's
  // feet, so a flip re-enters through a scene remount. (The image materials'
  // blending is IDENTICAL in both paths — plain AdditiveBlending; the old
  // "flag switches the blend mode" rationale was a reverted design.)
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
