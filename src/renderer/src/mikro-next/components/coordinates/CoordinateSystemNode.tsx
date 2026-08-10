import { cn } from "@/lib/utils";
import { MikroCoordinateSystem } from "@/linkers";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { Boxes, Globe } from "lucide-react";
import { SYSTEM_WIDTH } from "./nodeSize";
import { isReferenceFrame } from "./residents";
import { CoordinateSystemNode as TNode } from "./types";

// Inhabited vs. uninhabited is the whole vocabulary the graph has left, and
// colour is the fastest way to read a component: which nodes hold data, and
// which is the pure frame the rest are registered into.
export const OCCUPANCY_DOT = {
  frame: "bg-violet-500",
  inhabited: "bg-blue-500",
} as const;

export const OCCUPANCY_LABEL = {
  frame: "reference frame",
  inhabited: "inhabited",
} as const;

/** The same two colours as the spine, for the header icon. */
const OCCUPANCY_TEXT = {
  frame: "text-violet-500",
  inhabited: "text-blue-500",
} as const;

const OCCUPANCY_ICON = {
  frame: Globe,
  inhabited: Boxes,
} as const;

const OCCUPANCY_TITLE = {
  frame:
    "Nothing lives in this space. Sources register into it and scenes adopt it as their world; it outlives every scene over it.",
  inhabited: "The data living in this space.",
} as const;

export type Occupancy = keyof typeof OCCUPANCY_DOT;

export const CoordinateSystemNode = ({ data }: NodeProps<TNode>) => {
  const { system, isRoot } = data;

  const occupancy: Occupancy = isReferenceFrame(system) ? "frame" : "inhabited";
  const OccupancyIcon = OCCUPANCY_ICON[occupancy];

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-muted-foreground"
      />
      <div
        style={{ width: SYSTEM_WIDTH }}
        className={cn(
          "flex overflow-hidden rounded-lg border bg-card shadow-sm",
          isRoot && "ring-2 ring-offset-1 ring-primary ring-offset-background",
        )}
      >
        {/* Occupancy reads as a colour spine rather than a badge competing
            with the name for the eye. */}
        <div className={cn("w-1 shrink-0", OCCUPANCY_DOT[occupancy])} />
        <div className="flex min-w-0 flex-1 flex-col gap-1 px-2 py-1.5">
          <div className="flex min-w-0 items-center gap-1">
            <MikroCoordinateSystem.DetailLink
              object={system}
              className="min-w-0 flex-1 truncate text-sm font-semibold leading-tight"
            >
              {system.name}
            </MikroCoordinateSystem.DetailLink>
            <OccupancyIcon
              aria-label={OCCUPANCY_LABEL[occupancy]}
              className={cn("h-3.5 w-3.5 shrink-0", OCCUPANCY_TEXT[occupancy])}
            >
              <title>{OCCUPANCY_TITLE[occupancy]}</title>
            </OccupancyIcon>
          </div>

          {/* Who lives here hangs off this node as its own resident nodes.
              A frame has none, and an empty space would read as a missing
              answer rather than as the answer — so it says so. Dashed, because
              that is already this graph's vocabulary for "not a concrete
              thing". */}
          {occupancy === "frame" && (
            <span
              title={OCCUPANCY_TITLE.frame}
              className="truncate rounded border border-dashed border-violet-500/50 px-1 py-0.5 text-[10px] leading-tight text-muted-foreground"
            >
              reference frame — nothing lives here
            </span>
          )}

          <div className="flex flex-wrap gap-1 border-t pt-1">
            {[...system.axes]
              .sort((a, b) => a.order - b.order)
              .map((axis) => (
                <span
                  key={axis.id}
                  title={`${axis.type}${axis.unit ? ` in ${axis.unit}` : ""}`}
                  className="rounded bg-muted px-1 font-mono text-[10px] leading-relaxed"
                >
                  {axis.name}
                  {axis.unit ? (
                    <span className="text-muted-foreground"> {axis.unit}</span>
                  ) : null}
                </span>
              ))}
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-muted-foreground"
      />
    </>
  );
};

export default CoordinateSystemNode;
