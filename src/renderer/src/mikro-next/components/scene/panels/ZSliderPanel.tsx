import { useEffect, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { useModeStore } from "../store/modeStore";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";
import {
  buildAffineMatrix,
  getLayerZSize,
  voxelToPhysicalZ,
  physicalToVoxelZ,
} from "./layer/affine-utils";

export const ZSliderPanel = () => {
  const displayMode = useModeStore((s) => s.displayMode);
  const layers = useSceneStore((s) => s.layers);
  const currentZ = useViewerStore((s) => s.currentZ);
  const setCurrentZ = useViewerStore((s) => s.setCurrentZ);

  // Compute the physical Z range across all layers that have a Z dimension
  const zRange = useMemo(() => {
    let minZ = Infinity;
    let maxZ = -Infinity;
    let hasZ = false;

    for (const layer of layers) {
      const zSize = getLayerZSize(layer);
      if (zSize === null || zSize <= 1) continue;
      hasZ = true;
      const affine = buildAffineMatrix(layer);
      const z0 = voxelToPhysicalZ(affine, 0);
      const zEnd = voxelToPhysicalZ(affine, zSize - 1);
      minZ = Math.min(minZ, Math.min(z0, zEnd));
      maxZ = Math.max(maxZ, Math.max(z0, zEnd));
    }

    if (!hasZ) return null;
    return { min: minZ, max: maxZ };
  }, [layers]);

  // Snap currentZ into range on first render or when range changes
  useEffect(() => {
    if (!zRange) return;
    if (currentZ < zRange.min || currentZ > zRange.max) {
      setCurrentZ(zRange.min);
    }
  }, [zRange, currentZ, setCurrentZ]);

  // Compute per-layer voxel Z for display
  const layerSlices = useMemo(() => {
    if (!zRange) return [];
    return layers
      .filter(
        (l) => getLayerZSize(l) !== null && (getLayerZSize(l) ?? 0) > 1,
      )
      .map((l) => {
        const affine = buildAffineMatrix(l);
        const maxVoxel = (getLayerZSize(l) ?? 1) - 1;
        const voxelZ = physicalToVoxelZ(affine, currentZ, maxVoxel);
        return { id: l.id, voxelZ, maxVoxel };
      });
  }, [layers, zRange, currentZ]);

  if (displayMode !== "2D" || !zRange) return null;

  const { min, max } = zRange;
  const range = max - min;
  const step = range > 0 ? range / Math.max(...layerSlices.map((s) => s.maxVoxel), 1) : 1;

  return (
    <div className="absolute left-2 top-1/2 -translate-y-1/2 z-30 flex items-center">
      <div className="flex flex-col items-center gap-1 bg-background/80 backdrop-blur-sm rounded-md px-1.5 py-2 shadow-md">
        <span className="text-[10px] font-medium text-muted-foreground select-none">
          Z
        </span>
        <div className="h-48">
          <Slider
            orientation="vertical"
            min={min}
            max={max}
            step={step}
            value={[currentZ]}
            onValueChange={([v]) => setCurrentZ(v)}
          />
        </div>
        <span className="text-[10px] tabular-nums text-muted-foreground select-none">
          {currentZ.toFixed(1)}
        </span>
        {layerSlices.length > 0 && (
          <div className="flex flex-col items-center gap-0.5 mt-0.5 border-t border-border pt-1">
            {layerSlices.map((ls) => (
              <span
                key={ls.id}
                className="text-[9px] tabular-nums text-muted-foreground"
              >
                {ls.voxelZ}/{ls.maxVoxel}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
