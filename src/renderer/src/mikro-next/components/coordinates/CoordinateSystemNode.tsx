import { cn } from "@/lib/utils";
import { MikroCoordinateSystem } from "@/linkers";
import { CoordinateSystemKind } from "@/mikro-next/api/graphql";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { CoordinateSystemNode as TNode } from "./types";

// The five kinds are the whole vocabulary of the graph, and colour is the
// fastest way to read a component: which node is the pixel grid, which are the
// calibrated physical spaces hanging off it, which is the scene's world.
export const KIND_DOT: Record<CoordinateSystemKind, string> = {
  [CoordinateSystemKind.Intrinsic]: "bg-blue-500",
  [CoordinateSystemKind.Physical]: "bg-emerald-500",
  [CoordinateSystemKind.Array]: "bg-slate-400",
  [CoordinateSystemKind.World]: "bg-violet-500",
  [CoordinateSystemKind.Atlas]: "bg-amber-500",
  // A feature table's row space enumerates objects rather than measuring
  // positions, and a mesh collection's vertex space is owned by the collection
  // — neither is a pixel or physical grid, so neither borrows their colours.
  [CoordinateSystemKind.Feature]: "bg-rose-500",
  [CoordinateSystemKind.Mesh]: "bg-cyan-500",
};

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
        {/* Kind reads as a colour spine rather than a badge competing with the
            name for the eye. */}
        <div className={cn("w-1 shrink-0", KIND_DOT[system.kind])} />
        <div className="flex min-w-0 flex-1 flex-col gap-1 px-2 py-1.5">
          <MikroCoordinateSystem.DetailLink
            object={system}
            className="truncate text-sm font-semibold leading-tight"
          >
            {system.name}
          </MikroCoordinateSystem.DetailLink>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {system.kind}
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
