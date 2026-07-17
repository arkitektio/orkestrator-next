import { EXCLUDE_FROM_CAPTURE } from "../core/captureVisibility";
import { useModeStore } from "../store/modeStore";
import { Line } from "../primitives/Line";

/**
 * The origin crosshair: X in red, Y in green, marking where the stage is.
 *
 * Excluded from captures — it orients you while you work, but in a saved PNG or
 * an exported animation it reads as data that isn't there.
 */
export const SceneAxis = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);

  if (interactionMode === "META") return null;


  const stageRangeX = 400;
  const stageRangeY = 400;


  return (
    <group userData={{ [EXCLUDE_FROM_CAPTURE]: true }}>
      <Line
        points={[
          [-stageRangeX / 2, 0, 0.1],
          [stageRangeX / 2, 0, 0.1],
        ]}
        color="#ef4444"
        lineWidth={1}
      />
      <Line
        points={[
          [0, -stageRangeY / 2, 0.1],
          [0, stageRangeY / 2, 0.1],
        ]}
        color="#22c55e"
        lineWidth={1}
      />
    </group>
  );
};
