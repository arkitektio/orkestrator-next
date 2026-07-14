import {
  CoordinateSystemFragment,
  LeafTransformationFragment,
  TransformationFragment,
} from "@/mikro-next/api/graphql";
import { Edge, Node } from "@xyflow/react";

/**
 * Composites expand only to a fixed depth, so their children come back as
 * LEAF fragments — same kinds, minus the nested `transformations`. Both are
 * describable, so the describer takes either.
 */
export type AnyTransformation =
  | TransformationFragment
  | LeafTransformationFragment;

export type CoordinateSystemNodeData = {
  system: CoordinateSystemFragment;
  /** The system the walk started from — drawn as the anchor of the component. */
  isRoot: boolean;
};

export type CoordinateSystemNode = Node<
  CoordinateSystemNodeData,
  "coordinateSystem"
>;

export type TransformationNodeData = {
  transformation: TransformationFragment;
};

/**
 * A transformation is a NODE, not an edge label. The graph's whole point is
 * what happens *between* the spaces, and a label floating on a bezier reads as
 * decoration; a node reads as a step. So every edge becomes
 * system → [transformation] → system, and the plain lines carry no meaning
 * beyond direction.
 */
export type TransformationNode = Node<
  TransformationNodeData,
  "transformation"
>;

export type GraphNode = CoordinateSystemNode | TransformationNode;

/** Plain smoothstep connectors — they carry direction and nothing else. */
export type GraphEdge = Edge;

/**
 * A one-line summary of what an edge actually does. The graph query returns
 * every edge in its true stored direction and composes nothing, so this reads
 * the concrete per-kind payload rather than any resolved matrix.
 */
export const describeTransformation = (
  transformation: AnyTransformation,
): string => {
  const childCount = (composite: AnyTransformation) =>
    "transformations" in composite ? composite.transformations.length : 0;

  const fmt = (n: number) =>
    Number.isInteger(n) ? `${n}` : n.toPrecision(3).replace(/0+$/, "");

  switch (transformation.__typename) {
    case "ScaleTransformation":
      return `scale ${transformation.scale.map(fmt).join(" · ")}`;
    case "TranslationTransformation":
      return `translate ${transformation.translation.map(fmt).join(" · ")}`;
    case "AffineTransformation":
      return `affine ${transformation.outputAxes.length}×${transformation.inputAxes.length}`;
    case "RotationTransformation":
      return `rotation ${transformation.outputAxes.length}×${transformation.inputAxes.length}`;
    case "IdentityTransformation":
      return "identity";
    case "MapAxisTransformation":
      return `map ${transformation.inputAxes.join(",")} → ${transformation.outputAxes.join(",")}`;
    case "DisplacementsTransformation":
      return "displacement field";
    case "CoordinatesTransformation":
      return "coordinate field";
    // Not a map at all: a declared non-correspondence. The reason is the whole
    // content of the edge, so it is what gets shown.
    case "UnmappableTransformation":
      return transformation.reason
        ? `unmappable — ${transformation.reason}`
        : "unmappable";
    case "SequenceTransformation":
      return `sequence of ${childCount(transformation)}`;
    case "ByDimensionTransformation":
      return `by dimension (${childCount(transformation)})`;
    case "BijectionTransformation":
      return `bijection (${childCount(transformation)})`;
  }
};
