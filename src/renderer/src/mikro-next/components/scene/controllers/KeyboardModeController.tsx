import { useEffect, useMemo } from "react";
import { useModeStore } from "../store/modeStore";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore, useViewerStoreApi } from "../store/viewerStore";
import {
  buildAffineMatrix,
  getLayerZSize,
  voxelToPhysicalZ,
} from "../panels/layer/affine-utils";

/**
 * Listens for key holds to temporarily override the mode.
 * e.g., Holding 'D' switches to SCAN mode. Releasing it reverts back.
 */
export const KeyboardModeController = () => {
  const displayMode = useModeStore((s) => s.displayMode);
  const setInteractionMode = useModeStore((s) => s.setInteractionMode);
  const layers = useSceneStore((s) => s.layers);
  const viewerStoreApi = useViewerStoreApi();
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
      const key = e.key.toLowerCase();

      if (key === "d") setInteractionMode("SCAN");
      if (key === "e") setInteractionMode("EDIT");
      if (key === "m") setInteractionMode("MOVE");
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "d" || key === "e" || key === "m") {
        setInteractionMode("PAN"); // Revert to base mode
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!e.shiftKey || !zNavigation) return;

      const target = e.target;
      if (!(target instanceof Element) || !target.closest("canvas")) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

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
    window.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel, true);
    };
  }, [setCurrentZ, setInteractionMode, viewerStoreApi, zNavigation]);

  return null; // This is a headless component, it renders nothing
};
