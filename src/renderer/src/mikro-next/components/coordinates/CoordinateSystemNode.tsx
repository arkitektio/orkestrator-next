import { cn } from "@/lib/utils";
import { MikroCoordinateSystem } from "@/linkers";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { isReferenceFrame, residentLabel } from "./residents";
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

export type Occupancy = keyof typeof OCCUPANCY_DOT;

export const CoordinateSystemNode = ({ data }: NodeProps<TNode>) => {
  const { system, isRoot } = data;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-muted-foreground"
      />
      <div
        className={cn(
          "flex w-[220px] overflow-hidden rounded-lg border bg-card shadow-sm",
          isRoot && "ring-2 ring-offset-1 ring-primary ring-offset-background",
        )}
      >
        {/* Occupancy reads as a colour spine rather than a badge competing
            with the name for the eye. */}
        <div
          className={cn(
            "w-1 shrink-0",
            OCCUPANCY_DOT[isReferenceFrame(system) ? "frame" : "inhabited"],
          )}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1 px-2 py-1.5">
          <MikroCoordinateSystem.DetailLink
            object={system}
            className="truncate text-sm font-semibold leading-tight"
          >
            {system.name}
          </MikroCoordinateSystem.DetailLink>
          <div className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
            {residentLabel(system)}
          </div>
          <div className="flex flex-wrap gap-1">
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
