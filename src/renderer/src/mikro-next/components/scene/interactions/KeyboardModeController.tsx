import { useEffect, useMemo, useRef } from "react";
import { InteractionMode, useModeStore, useModeStoreApi } from "../store/modeStore";
import { isTypingTarget } from "./keyboardTarget";
import { beginPathFromProbe } from "./pathFromProbe";
import { useRoiDrawingStoreApi } from "../store/roiDrawingStore";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore, useViewerStoreApi } from "../store/viewerStore";
import {
  buildAffineMatrix,
  getLayerZSize,
  voxelToPhysicalZ,
} from "../core/worldTransform";

/** Hold-to-activate bindings. Release restores whatever was active before. */
const HOLD_MODES: Record<string, InteractionMode> = {
  a: "ANNOTATE",
  p: "PROBE",
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

  const zNavigation = useMemo(() => {
    if (displayMode !== "2D") return null;

    let minZ = Infinity;
    let maxZ = -Infinity;
    let maxVoxel = 1;
    let hasZ = false;

    for (const layer of layers) {
      const zSize = getLayerZSize(layer);
      if (zSize === null || zSize <= 1) continue;

      hasZ = true;
      maxVoxel = Math.max(maxVoxel, zSize - 1);

      const affine = buildAffineMatrix(layer);
      const zStart = voxelToPhysicalZ(affine, 0);
      const zEnd = voxelToPhysicalZ(affine, zSize - 1);

      minZ = Math.min(minZ, zStart, zEnd);
      maxZ = Math.max(maxZ, zStart, zEnd);
    }

    if (!hasZ) return null;

    const range = maxZ - minZ;
    const step = range > 0 ? range / maxVoxel : 1;

    return {
      min: minZ,
      max: maxZ,
      step: step > 0 ? step : 1,
    };
  }, [displayMode, layers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // Ignore auto-repeat when key is held
      // Without these, Cmd+A flips the scene into a tool mode and so does typing
      // "a" in any panel input.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target as { tagName?: string; isContentEditable?: boolean } | null)) {
        return;
      }

      const key = e.key.toLowerCase();

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
      if (heldKeyRef.current !== e.key.toLowerCase()) return;
      releaseHold();
    };

    // Alt-tabbing mid-hold never fires keyup, which used to strand the scene in
    // the held mode.
    const handleBlur = () => releaseHold();

    const handleWheel = (e: WheelEvent) => {
      if (!e.shiftKey || !zNavigation) return;

      const target = e.target;
      if (!(target instanceof Element) || !target.closest("canvas")) return;

      e.preventDefault();

      const { currentZ } = viewerStoreApi.getState();
      const delta = e.deltaY > 0 ? zNavigation.step : -zNavigation.step;
      const nextZ = Math.min(
        zNavigation.max,
        Math.max(zNavigation.min, currentZ + delta),
      );

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
