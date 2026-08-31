import { useEffect, useMemo, useRef } from "react";
import { InteractionMode, useModeStore, useModeStoreApi, type DesignToolId } from "../../platform/stores/modeStore";
import { designToolByKey } from "../../features/meshDesign/tools/registry";
import { isTypingTarget } from "../../platform/input/keyboardTarget";
import { beginPathFromProbe } from "../../features/annotations/pathFromProbe";
import { useRoiDrawingStoreApi } from "../../features/annotations/roiDrawingStore";
import { useSceneStore } from "../../platform/stores/sceneStore";
import { useViewerStore, useViewerStoreApi } from "../../platform/stores/viewerStore";
import { stepSceneZ } from "../../platform/camera/sceneNavigation";
import { sceneZExtent } from "../../platform/coords/worldTransform";

/** Hold-to-activate bindings. Release restores whatever was active before. */
const HOLD_MODES: Record<string, InteractionMode> = {
  a: "ANNOTATE",
  p: "PROBE",
  m: "DESIGN",
};

/**
 * Listens for key holds to temporarily override the mode.
 * e.g., holding 'P' switches to PROBE. Releasing it reverts back.
 */
export const KeyboardModeController = () => {
  const displayMode = useModeStore((s) => s.displayMode);
  const setInteractionMode = useModeStore((s) => s.setInteractionMode);
  const modeApi = useModeStoreApi();
  const heldKeyRef = useRef<string | null>(null);
  const restoreModeRef = useRef<InteractionMode | null>(null);
  const layers = useSceneStore((s) => s.layers);
  const viewerStoreApi = useViewerStoreApi();
  const roiDrawingApi = useRoiDrawingStoreApi();
  const setCurrentZ = useViewerStore((s) => s.setCurrentZ);

  // `sceneZExtent` has no display-mode gate of its own — `currentZ` is only the
  // flat view's slice plane, so the gate belongs here.
  const zNavigation = useMemo(
    () => (displayMode === "2D" ? sceneZExtent(layers) : null),
    [displayMode, layers],
  );

  useEffect(() => {
    // DESIGN's tool keys, hold-to-act, straight from the registry — the key
    // also picks the tool, so the toolbar never needs a click. (A stays the
    // hold-ANNOTATE key; the registry's test guards against collisions.)
    const setDesignTool = (next: DesignToolId | null) => {
      const mode = modeApi.getState();
      if (mode.designTool !== next) mode.setDesignTool(next);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // Ignore auto-repeat when key is held
      // Without these, Cmd+A flips the scene into a tool mode and so does typing
      // "a" in any panel input.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target as { tagName?: string; isContentEditable?: boolean } | null)) {
        return;
      }

      const key = e.key.toLowerCase();

      const designKey = designToolByKey(key);
      if (designKey && modeApi.getState().interactionMode === "DESIGN") {
        if (designKey.roiTool && roiDrawingApi.getState().activeTool !== designKey.roiTool) {
          roiDrawingApi.getState().setActiveTool(designKey.roiTool);
        }
        setDesignTool(designKey.id);
        return;
      }

      // "Draw path from probe" — same action as the probe panel button.
      if (key === "d") {
        const probe = viewerStoreApi.getState().probedCoordinate;
        if (probe?.worldPos) {
          e.preventDefault();
          beginPathFromProbe(probe.worldPos, roiDrawingApi.getState(), setInteractionMode);
          // The common flow is hold-P → click probe → press D: releasing P
          // must not restore-revert the ANNOTATE switch we just made.
          heldKeyRef.current = null;
          restoreModeRef.current = null;
        }
        return;
      }

      const next = HOLD_MODES[key];
      if (!next || heldKeyRef.current) return;

      // Restore what the user actually had, not a hard-coded base — they may
      // have picked a mode in the toolbar before reaching for the key.
      heldKeyRef.current = key;
      restoreModeRef.current = modeApi.getState().interactionMode;
      setInteractionMode(next);
    };

    const releaseHold = () => {
      const held = heldKeyRef.current;
      if (!held) return;
      heldKeyRef.current = null;
      // A toolbar click during the hold wins over the restore.
      if (modeApi.getState().interactionMode === HOLD_MODES[held]) {
        setInteractionMode(restoreModeRef.current ?? "NAVIGATE");
      }
      restoreModeRef.current = null;
    };

    // Keyed off the armed hold rather than the event target, because focus can
    // move mid-hold.
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (designToolByKey(key) && modeApi.getState().designTool === designToolByKey(key)?.id) {
        setDesignTool(null);
      }
      if (heldKeyRef.current !== key) return;
      releaseHold();
    };

    // Alt-tabbing mid-hold never fires keyup, which used to strand the scene in
    // the held mode.
    const handleBlur = () => {
      releaseHold();
      setDesignTool(null);
    };

    const handleWheel = (e: WheelEvent) => {
      if (!e.shiftKey || !zNavigation) return;

      const target = e.target;
      if (!(target instanceof Element) || !target.closest("canvas")) return;

      e.preventDefault();

      // Same stepping as Shift+←/→ (`KeyboardSceneNavigation`), so the two ways
      // of walking the stack cannot disagree about where a slice is.
      const { currentZ } = viewerStoreApi.getState();
      const nextZ = stepSceneZ(zNavigation, currentZ, e.deltaY > 0 ? 1 : -1);

      if (nextZ !== currentZ) {
        setCurrentZ(nextZ);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [setCurrentZ, setInteractionMode, modeApi, viewerStoreApi, roiDrawingApi, zNavigation]);

  return null; // This is a headless component, it renders nothing
};
