import {
  PathActivityFragment,
  PathDescriptionFragment,
  PathEntityFragment,
  PathInputParticipationFragment,
  PathMeasurementFragment,
  PathMetricFragment,
  PathNaturalEventFragment,
  PathOutputParticipationFragment,
  PathProtocolEventFragment,
  PathRelationFragment,
  PathStructureFragment,
  StructureRelationFragment
} from "@/kraph/api/graphql";
import { Edge, Node } from "@xyflow/react";

export type EntityNode = Node<PathEntityFragment, "Entity">;
export type ThisNode = Node<{}, "__THIS__">;
export type StructureNode = Node<PathStructureFragment, "Structure">;
export type MetricNode = Node<PathMetricFragment, "Metric">;
export type NaturalEventNode = Node<PathNaturalEventFragment, "NaturalEvent">;
export type ProtocolEventNode = Node<
  PathProtocolEventFragment,
  "ProtocolEvent"
>;
export type ActivityNode = Node<PathActivityFragment, "Activity">;

export type DescriptionEdge = Edge<PathDescriptionFragment, "Description">;
export type MeasurementEdge = Edge<PathMeasurementFragment, "Measurement">;
export type RelationEdge = Edge<PathRelationFragment, "Relation">;
export type StructureRelationEdge = Edge<StructureRelationFragment, "StructureRelation">;
export type InputParticipationEdge = Edge<PathInputParticipationFragment, "Participant">;
export type OutputParticipationEdge = Edge<PathOutputParticipationFragment, "Participant">;
export type PathNode =
  | EntityNode
  | ThisNode
  | StructureNode
  | NaturalEventNode
  | MetricNode
  | ProtocolEventNode
  | ActivityNode;

export type PathEdgeData = PathEdge["data"];
export type PathNodeData = PathNode["data"];

// An assertion is no longer an edge — it is the act behind a claim, returned by
// the mutation that records it and carried on `XAssertion.assertion`. Likewise
// the shadow-link nodes are gone: a claim's per-graph rendering now comes back
// as `NodeDrawing` / `EdgeDrawing`.
export type PathEdge =
  | MeasurementEdge
  | RelationEdge
  | StructureRelationEdge
  | InputParticipationEdge
  | OutputParticipationEdge
  | DescriptionEdge;
