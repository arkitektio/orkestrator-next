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

export type TransformationEdgeData = {
  transformation: TransformationFragment;
  /** Where this edge sits in the fan of maps sharing its pair of spaces. */
  parallelIndex: number;
  parallelCount: number;
  [key: string]: unknown;
};

/**
 * A transformation is an EDGE, not a node. The graph's whole point is which
 * spaces reach which, and drawing every map as its own box doubles the node
 * count and buries that: system → [box] → system reads as a pipeline of things
 * rather than as a neighbourhood of spaces. So the map rides the line it
 * describes — kind, parameters and validity in a label on the edge itself.
 */
export type TransformationEdge = Edge<
  TransformationEdgeData,
  "transformation"
>;

export type GraphNode = CoordinateSystemNode;

export type GraphEdge = TransformationEdge;

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
    // Was DISPLACEMENTS + COORDINATES, now one edge: what the numbers mean is
    // the field's business, so name the field rather than guess the flavour.
    case "FieldTransformation":
      return transformation.field?.name
        ? `field — ${transformation.field.name}`
        : "field";
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
