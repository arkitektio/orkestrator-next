import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useModeStore } from "../store/modeStore";
import { useRoiDrawingStore, type AnnotateTool } from "../store/roiDrawingStore";
import { isAnnotateToolAvailable } from "../core/modeCompat";
import {
  Square,
  Circle,
  CircleDot,
  Box,
  Crosshair,
  Minus,
  MousePointer2,
  Pentagon,
  Pencil,
  Waypoints,
} from "lucide-react";
import { TraceWeightsPanel } from "./TraceWeightsPanel";

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
  { tool: "POLYGON", label: "Polygon", icon: Pentagon },
  // Volumetric (3D-only): a probe click anchors the center, a second click
  // sets the radius.
  { tool: "SPHERE", label: "Sphere", icon: CircleDot },
  { tool: "CUBE", label: "Cube", icon: Box },
  { tool: "POINT", label: "Point", icon: Crosshair },
  { tool: "LINE", label: "Line", icon: Minus },
  { tool: "PATH", label: "Path", icon: Pencil },
  // The only tool that decides its own vertices: clicks are waypoints, and the
  // route between them is searched for through the data (`core/trace/`).
  { tool: "TRACE", label: "Trace", icon: Waypoints },
];

export const RoiToolbar = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const displayMode = useModeStore((s) => s.displayMode);
  const activeTool = useRoiDrawingStore((s) => s.activeTool);
  const setActiveTool = useRoiDrawingStore((s) => s.setActiveTool);
  const traceMessage = useRoiDrawingStore((s) => s.traceMessage);

  if (interactionMode !== "ANNOTATE") return null;

  const tools = TOOLS.filter(({ tool }) =>
    isAnnotateToolAvailable(tool, { displayMode }),
  );

  return (
    <div className="absolute bottom-12 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-1">
      {/* Shapes land in the scene's own coordinate system, so there is nothing
          to arm and no per-layer constraint to describe. */}
      {activeTool === "TRACE" && <TraceWeightsPanel />}
      {/* The 3D line is not decoration: the gesture genuinely differs — each
          click places the point the volume probed, so a click off the data
          places nothing. A failed trace hop speaks here too: a refused click
          has to say why, or the tool reads as broken. */}
      <span className="text-[10px] text-white/50">
        {traceMessage && activeTool === "TRACE" ? (
          <span className="text-amber-300/90">{traceMessage}</span>
        ) : activeTool === "TRACE" ? (
          "Click waypoints — the path between them follows the data. Double-click to finish"
        ) : activeTool === "SELECT" ? (
          "Drag to select annotations"
        ) : displayMode === "3D" ? (
          "Click the volume to place each point — probed onto the data"
        ) : (
          "Drawing annotations on the scene"
        )}
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
