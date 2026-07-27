import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useModeStore } from "../store/modeStore";
import { useRoiDrawingStore, type AnnotateTool } from "../store/roiDrawingStore";
import { isAnnotateToolAvailable } from "../core/modeCompat";
import {
  Square,
  Circle,
  Crosshair,
  Minus,
  MousePointer2,
  Pentagon,
  Pencil,
} from "lucide-react";

/**
 * Select sits first because it is the non-destructive tool — and because it is
 * where the old SELECT interaction mode went. It is hidden in 3D, where the
 * marquee has nothing to draw against.
 */
const TOOLS: {
  tool: AnnotateTool;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { tool: "SELECT", label: "Select", icon: MousePointer2 },
  { tool: "RECTANGLE", label: "Rect", icon: Square },
  { tool: "ELLIPSIS", label: "Ellipse", icon: Circle },
  { tool: "POINT", label: "Point", icon: Crosshair },
  { tool: "LINE", label: "Line", icon: Minus },
  { tool: "POLYGON", label: "Polygon", icon: Pentagon },
  { tool: "PATH", label: "Path", icon: Pencil },
];

export const RoiToolbar = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const displayMode = useModeStore((s) => s.displayMode);
  const activeTool = useRoiDrawingStore((s) => s.activeTool);
  const setActiveTool = useRoiDrawingStore((s) => s.setActiveTool);

  if (interactionMode !== "ANNOTATE") return null;

  const tools = TOOLS.filter(({ tool }) =>
    isAnnotateToolAvailable(tool, { displayMode }),
  );

  return (
    <div className="absolute bottom-12 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-1">
      {/* Shapes land in the scene's own coordinate system, so there is nothing
          to arm and no per-layer constraint to describe. */}
      <span className="text-[10px] text-white/50">
        {activeTool === "SELECT"
          ? "Drag to select annotations"
          : "Drawing annotations on the scene"}
      </span>
      <ButtonGroup>
        {tools.map(({ tool, label, icon: Icon }) => (
          <Button
            key={tool}
            variant={activeTool === tool ? "default" : "outline"}
            size="xs"
            onClick={() => setActiveTool(tool)}
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
