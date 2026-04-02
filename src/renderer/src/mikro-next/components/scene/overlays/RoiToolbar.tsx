import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useModeStore } from "../store/modeStore";
import { useRoiDrawingStore, type DrawingTool } from "../store/roiDrawingStore";
import { useSelectionStore } from "../store/layerStore";
import {
  Square,
  Circle,
  Crosshair,
  Minus,
  Pentagon,
  Pencil,
} from "lucide-react";

const TOOLS: { tool: DrawingTool; label: string; icon: React.ElementType }[] = [
  { tool: "RECTANGLE", label: "Rect", icon: Square },
  { tool: "ELLIPSIS", label: "Ellipse", icon: Circle },
  { tool: "POINT", label: "Point", icon: Crosshair },
  { tool: "LINE", label: "Line", icon: Minus },
  { tool: "POLYGON", label: "Polygon", icon: Pentagon },
  { tool: "PATH", label: "Path", icon: Pencil },
];

export const RoiToolbar = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const activeTool = useRoiDrawingStore((s) => s.activeTool);
  const setActiveTool = useRoiDrawingStore((s) => s.setActiveTool);
  const selectedLayerId = useSelectionStore((s) => s.selectedLayerId);

  if (interactionMode !== "EDIT") return null;

  return (
    <div className="absolute bottom-12 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-1">
      {!selectedLayerId && (
        <span className="text-[10px] text-white/50">
          Select a layer to draw ROIs
        </span>
      )}
      <ButtonGroup>
        {TOOLS.map(({ tool, label, icon: Icon }) => (
          <Button
            key={tool}
            variant={activeTool === tool ? "default" : "outline"}
            size="xs"
            disabled={!selectedLayerId}
            onClick={() =>
              setActiveTool(activeTool === tool ? null : tool)
            }
            title={label}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="text-[10px]">{label}</span>
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};
