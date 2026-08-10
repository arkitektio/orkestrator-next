import { cn } from "@/lib/utils";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from "@xyflow/react";
import {
  ArrowLeftRight,
  Equal,
  Grid3x3,
  ListOrdered,
  Move,
  Rows3,
  Scaling,
  Shuffle,
  Unlink,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { PlacementValidity } from "../../api/graphql";
import { parallelOffset } from "./edgeLayout";
import {
  AnyTransformation,
  describeTransformation,
  TransformationEdge as TEdge,
} from "./types";

/**
 * A transformation drawn as what it is: an EDGE between two spaces.
 *
 * The line carries the map — direction, what kind of map it is, and how much of
 * it is actually known — and the label sits on the line rather than beside it,
 * so reading the graph is reading a chain of spaces rather than a chain of
 * boxes.
 */

type Kind = AnyTransformation["__typename"];

const ICONS: Record<Kind, LucideIcon> = {
  ScaleTransformation: Scaling,
  TranslationTransformation: Move,
  AffineTransformation: Grid3x3,
  RotationTransformation: Grid3x3,
  IdentityTransformation: Equal,
  MapAxisTransformation: Shuffle,
  FieldTransformation: Waves,
  UnmappableTransformation: Unlink,
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

/**
 * The schema asks for exactly one thing to be loud: an assumed placement must
 * be visible. So an UNKNOWN edge is drawn as a broken line — you can see it is
 * not solid ground from across the graph, without reading the label.
 */
const isAssumed = (transformation: AnyTransformation) =>
  transformation.validity === PlacementValidity.Unknown;

/** Everything the label cannot fit, for the hover. */
const detail = (transformation: AnyTransformation): string => {
  const children =
    "transformations" in transformation ? transformation.transformations : [];
  return [
    transformation.name || transformation.kind,
    describeTransformation(transformation),
    `${transformation.inputAxes.join(",") || "—"} → ${transformation.outputAxes.join(",") || "—"}`,
    `validity: ${transformation.validity}`,
    ...children.map((child) => `· ${describeTransformation(child)}`),
  ].join("\n");
};

export const TransformationEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}: EdgeProps<TEdge>) => {
  const transformation = data?.transformation;

  // Maps sharing a pair of spaces fan out around the centre line instead of
  // routing along the same path and hiding each other's labels.
  const offset = parallelOffset(
    data?.parallelIndex ?? 0,
    data?.parallelCount ?? 1,
  );

  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
    centerY: (sourceY + targetY) / 2 + offset,
  });

  if (!transformation) return <BaseEdge path={path} markerEnd={markerEnd} />;

  const Icon = ICONS[transformation.__typename];
  const composite = COMPOSITE.includes(transformation.__typename);
  // Not an operation at all but a declared non-correspondence: no placement
  // search will walk it in either direction. It must not read as a step the
  // geometry can travel through, so it drops the primary tint entirely.
  const unmappable = transformation.__typename === "UnmappableTransformation";
  const assumed = isAssumed(transformation);

  return (
    <>
      <BaseEdge
        path={path}
        // Not `hsl(var(--…))`: this app's design tokens are Tailwind v4 oklch()
        // values, so wrapping one in hsl() yields an invalid colour — the stroke
        // is ignored and the arrow marker renders nothing at all. `currentColor`
        // resolves against the wrapper's text colour instead.
        style={{
          stroke: "currentColor",
          strokeWidth: 1.5,
          strokeDasharray: unmappable || assumed ? "5 4" : undefined,
          opacity: unmappable ? 0.6 : 1,
        }}
        markerEnd={unmappable ? undefined : markerEnd}
      />
      <EdgeLabelRenderer>
        <div
          title={detail(transformation)}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          // `nodrag nopan` keeps a click on the label from panning the canvas,
          // and `pointer-events-auto` re-enables hits that the label layer
          // disables wholesale.
          className={cn(
            "pointer-events-auto nodrag nopan absolute flex max-w-[190px] flex-col gap-0.5 rounded-md border px-1.5 py-1 shadow-sm backdrop-blur",
            unmappable
              ? "border-dashed border-muted-foreground/40 bg-muted/70 text-muted-foreground"
              : composite
                ? "border-dashed border-primary/50 bg-primary/10 text-foreground"
                : "border-primary/60 bg-background/90 text-foreground",
            assumed && !unmappable && "border-destructive/60",
          )}
        >
          <div className="flex items-center gap-1">
            <Icon
              className={cn(
                "h-3 w-3 shrink-0",
                unmappable ? "text-muted-foreground" : "text-primary",
              )}
            />
            <span className="truncate font-mono text-[10px] leading-tight">
              {describeTransformation(transformation)}
            </span>
          </div>
          {assumed && !unmappable && (
            // "This map was assumed, never measured -- badge it."
            <span className="text-[9px] uppercase leading-none tracking-wider text-destructive">
              assumed
            </span>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default TransformationEdge;
