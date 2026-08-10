import { cn } from "@/lib/utils";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { RESIDENT_ICON, RESIDENT_KIND_LABEL, ResidentLink } from "./ResidentLink";
import { residentName } from "./residents";
import { ResidentNode as TNode } from "./types";

/**
 * A resident as its own node.
 *
 * `residents` is the whole vocabulary a coordinate system has left now that
 * `kind` is gone, so who lives in a space is structure, not a caption: the
 * dataset hangs off the grid it lives in, and a space with nothing hanging off
 * it IS the reference frame. Emerald throughout, so the data reads as a
 * different class of thing from the spaces it sits in at a glance.
 */
export const RESIDENT_COLOR = "bg-emerald-500";

export const ResidentNode = ({ data }: NodeProps<TNode>) => {
  const { resident } = data;
  const Icon = RESIDENT_ICON[resident.__typename];

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-emerald-500"
      />
      <div
        title={RESIDENT_KIND_LABEL[resident.__typename]}
        className={cn(
          "flex items-center gap-1.5 rounded-full border border-emerald-500/50",
          "bg-emerald-500/10 px-2 py-1 shadow-sm",
        )}
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <ResidentLink
          resident={resident}
          className="truncate text-xs font-medium leading-tight"
        />
      </div>
    </>
  );
};

/** What the node will measure, for the layout. */
export const residentNodeWidth = (
  resident: TNode["data"]["resident"],
): number => Math.min(220, Math.max(90, residentName(resident).length * 6 + 46));

export default ResidentNode;
