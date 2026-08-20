import type { InteractionMode } from "../../platform/stores/modeStore";
import type { RoiDrawingState } from "./roiDrawingStore";

/**
 * Arm a PATH draw anchored at the probe: seed the first vertex, pick the PATH
 * tool and enter ANNOTATE. Shared by the probe panel's "Draw path" button and
 * the `d` shortcut (`KeyboardModeController`), so both trigger sites stay in
 * lockstep. `RoiDrawer` consumes the seed once its reset has run.
 */
export const beginPathFromProbe = (
  worldPos: readonly [number, number, number],
  roiDrawing: Pick<RoiDrawingState, "setPendingPathSeed" | "setActiveTool">,
  setInteractionMode: (mode: InteractionMode) => void,
): void => {
  roiDrawing.setPendingPathSeed([worldPos[0], worldPos[1], worldPos[2]]);
  roiDrawing.setActiveTool("PATH");
  setInteractionMode("ANNOTATE");
};
