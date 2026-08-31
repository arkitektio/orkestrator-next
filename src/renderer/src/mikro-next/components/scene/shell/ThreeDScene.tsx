import { useState } from "react";
import { SceneVolume } from "./SceneVolume";
import { BrushStrokeSession } from "../features/annotations/enhancers/paths/brushSkeleton/BrushStrokeSession";
import { MeshDesignSession } from "../features/meshDesign/ui/MeshDesignSession";
import { DoubleClickRecenter } from "../features/probe/DoubleClickRecenter";
import { ProbeAxisGuides } from "../features/probe/ProbeAxisGuides";
import { RoiDrawer } from "../features/annotations/RoiDrawer";
import { VolumeCompositor } from "../features/volume/VolumeCompositor";
import { isVolumeTargetEnabled } from "../platform/gpu/volumeTargetFlags";

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
      {/* NAVIGATE double-click → recenter on the clicked content (3D-only by
          construction: this component tree only mounts in 3D). */}
      <DoubleClickRecenter />
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
      {/* The mesh designer's session meshes — mutable overlays, DESIGN only. */}
      <MeshDesignSession />
    </>
  );
};
