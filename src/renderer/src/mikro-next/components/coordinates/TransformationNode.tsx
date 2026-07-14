import { Handle, NodeProps, Position } from "@xyflow/react";
import {
  ArrowLeftRight,
  Equal,
  Grid3x3,
  ListOrdered,
  Move,
  Rows3,
  Scaling,
  Shuffle,
  Waves,
  type LucideIcon,
} from "lucide-react";
import {
  describeTransformation,
  TransformationNode as TNode,
  TransformationNodeData,
} from "./types";

type Kind = TransformationNodeData["transformation"]["__typename"];

const ICONS: Record<Kind, LucideIcon> = {
  ScaleTransformation: Scaling,
  TranslationTransformation: Move,
  AffineTransformation: Grid3x3,
  RotationTransformation: Grid3x3,
  IdentityTransformation: Equal,
  MapAxisTransformation: Shuffle,
  DisplacementsTransformation: Waves,
  SequenceTransformation: ListOrdered,
  ByDimensionTransformation: Rows3,
  BijectionTransformation: ArrowLeftRight,
};

// A composite edge is a container of other edges, not an operation in its own
// right — worth telling apart at a glance from the primitives that actually
// move pixels.
const COMPOSITE: Kind[] = [
  "SequenceTransformation",
  "ByDimensionTransformation",
  "BijectionTransformation",
];

export const TransformationNode = ({ data }: NodeProps<TNode>) => {
  const { transformation } = data;
  const Icon = ICONS[transformation.__typename];
  const composite = COMPOSITE.includes(transformation.__typename);

  // A composite's children hang off it rather than appearing in the graph's
  // edge list, so "sequence of 2" is only useful if it says which 2.
  const children =
    "transformations" in transformation ? transformation.transformations : [];

  return (
    <>
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <div
        className={[
          "flex w-[190px] flex-col gap-1 rounded-md border-2 px-2 py-1.5 shadow-md",
          composite
            ? "border-dashed border-primary/50 bg-primary/5"
            : "border-primary/70 bg-primary/10",
        ].join(" ")}
      >
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate text-xs font-semibold">
            {transformation.name || transformation.kind}
          </span>
        </div>
        <div className="font-mono text-[11px] leading-tight">
          {describeTransformation(transformation)}
        </div>
        {children.length > 0 && (
          <div className="flex flex-col gap-0.5 border-l-2 border-primary/30 pl-1.5">
            {children.map((child) => (
              <div
                key={child.id}
                className="truncate font-mono text-[10px] text-muted-foreground"
              >
                {describeTransformation(child)}
              </div>
            ))}
          </div>
        )}
        {/* The edge's self-described parameter order: scale/translation/affine
            columns follow inputAxes, so this is how you read the numbers. */}
        <div className="truncate font-mono text-[10px] text-muted-foreground">
          {transformation.inputAxes.join(",") || "—"} →{" "}
          {transformation.outputAxes.join(",") || "—"}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </>
  );
};

export default TransformationNode;
