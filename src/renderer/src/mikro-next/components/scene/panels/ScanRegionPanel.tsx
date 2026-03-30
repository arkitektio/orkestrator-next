import {
  useScansStore,
  type ScanPattern,
} from "@/store/scansStore";
import { useViewStore } from "@/store/viewStore";
import { useMemo } from "react";
import * as THREE from "three";

// Shadcn UI Imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ScanRegionArgsSchema,
  ScanRegionDefinition,
  useScanRegion,
} from "@/apps/default/hooks/actions";
import { ActionButton } from "@/components/ActionButton";
import { getOptionsFromZod } from "@/hooks/zodToChoices";

 const scanPatternOptions = getOptionsFromZod(
  ScanRegionArgsSchema.shape.scan_order,
);


export const ScanRegionPanel = () => {
  // 1. Get Domain Data

  const selectedRegionId = useScansStore((s) => s.selectedRegionId);
  const regions = useScansStore((s) => s.regions);
  const updateRegion = useScansStore((s) => s.updateRegion);
  const deleteRegion = useScansStore((s) => s.deleteRegion);
  const setSelectedRegionId = useScansStore((s) => s.setSelectedRegionId);

  // 2. Get Camera Data
  const viewProjectionMatrix = useViewStore((s) => s.viewProjectionMatrix);
  const viewportSize = useViewStore((s) => s.viewportSize);

  const { call: regionScan } = useScanRegion();

  // 3. Calculate 2D Screen Position
  const screenPos = useMemo(() => {
    if (!selectedRegionId || !viewProjectionMatrix) return null;

    const region = regions.find((r) => r.id === selectedRegionId);
    if (!region) return null;

    // Calculate the anchor point in 3D world space (bottom center of the rect)
    const bottomY = Math.min(region.start.y, region.end.y);
    const centerX = (region.start.x + region.end.x) / 2;
    const worldVector = new THREE.Vector3(centerX, bottomY, 0.2);

    // Apply the camera's matrix to get Normalized Device Coordinates (NDC) [-1 to 1]
    worldVector.applyMatrix4(viewProjectionMatrix);

    // If Z is outside [-1, 1], the point is behind the camera or clipped
    if (worldVector.z < -1 || worldVector.z > 1) return null;

    // Map NDC to actual screen pixels
    return {
      x: (worldVector.x * 0.5 + 0.5) * viewportSize.width,
      y: (worldVector.y * -0.5 + 0.5) * viewportSize.height,
      region, // pass the region down so we don't have to look it up again
    };
  }, [selectedRegionId, regions, viewProjectionMatrix, viewportSize]);

  if (!screenPos) return null;

  return (
    <div
      className="absolute -translate-x-1/2 scale-90  z-20 pointer-events-auto"
      style={{ left: screenPos.x, top: screenPos.y }}
    >
      <div className="mt-3 px-5 py-2 flex min-w-xs flex-row gap-2 shadow-2xl backdrop-blur-md rounded rounded-full bg-background/90 border border-gray-700 ">
        <button
          onClick={() => setSelectedRegionId(null)}
          className="text-muted-foreground hover:text-white text-xs transition-colors"
        >
          ✕
        </button>

        <ActionButton
          size="xs"
          action={ScanRegionDefinition}
          args={{
            start_x: screenPos.region.start.x,
            start_y: screenPos.region.start.y,
            end_x: screenPos.region.end.x,
            end_y: screenPos.region.end.y,
            scan_order: screenPos.region.pattern,
            overlap: screenPos.region.overlap,
          }}
        >
          Scan
        </ActionButton>

        <div className="flex flex-col gap-1.5">
          <Select
            value={screenPos.region.pattern}
            onValueChange={(val) =>
              updateRegion(screenPos.region.id, { pattern: val as ScanPattern })
            }
          >
            <SelectTrigger className="h-5 text-xs text-white">
              <SelectValue placeholder="Select pattern" />
            </SelectTrigger>
            <SelectContent className="text-white text-xs">
              {scanPatternOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-xs text-white"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-row my-auto gap-2">
          <Label className="text-[9px] text-slate-400 uppercase tracking-wider">
            Overlap
          </Label>
          <Input
            type="number"
            min="0"
            max="99"
            className="h-7 text-xs bg-slate-800 border-slate-700 text-white"
            value={screenPos.region.overlap}
            onChange={(e) =>
              updateRegion(screenPos.region.id, {
                overlap: Number(e.target.value),
              })
            }
          />
        </div>
        <button
          onClick={() => deleteRegion(screenPos.region.id)}
          className="text-muted-foreground hover:text-white text-xs transition-colors"
        >
          Del
        </button>
      </div>
    </div>
  );
};
