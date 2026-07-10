import { Handle, NodeProps, Position } from "@xyflow/react";
import { memo } from "react";
import { IMPORTANCE_MUTED } from "../../../lib/importance";
import { useImportance } from "../importanceContext";
import { SectionNode as SectionNodeType } from "../types";

/**
 * Read-only React Flow node for a single morphology `Section`. A left color bar
 * mirrors the section's compartment tint (or the dominance heatmap while the
 * importance control is active); handles at top (from parent) and bottom (to
 * children) carry the tree edges.
 */
const SectionNode = memo(({ data, selected }: NodeProps<SectionNodeType>) => {
  const importance = useImportance();
  const barColor = importance.active
    ? importance.colorFor(data.id) ?? IMPORTANCE_MUTED
    : data.color;
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
        className="!bg-muted-foreground"
      />
      <div
        className={`flex h-full w-full items-stretch overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm transition-all ${
          selected ? "ring-2 ring-primary shadow-lg" : ""
        }`}
      >
        <div
          className="w-2 shrink-0 transition-colors"
          style={{ backgroundColor: barColor }}
        />
        <div className="flex min-w-0 flex-col justify-center px-3 py-2">
          <div className="truncate text-sm font-semibold">{data.id}</div>
          <div className="truncate text-xs text-muted-foreground">
            {data.category ?? "uncategorized"}
          </div>
          <div className="mt-0.5 truncate font-mono text-[0.625rem] text-muted-foreground">
            ⌀ {data.diam} · nseg {data.nseg}
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        className="!bg-muted-foreground"
      />
    </>
  );
});

export default SectionNode;
