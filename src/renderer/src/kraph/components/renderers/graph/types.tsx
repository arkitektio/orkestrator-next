import {
  PathActivityFragment,
  PathAssertionFragment,
  PathDescriptionFragment,
  PathEntityFragment,
  PathInputParticipationFragment,
  PathMeasurementFragment,
  PathMeasurementRelationShadowLinkFragment,
  PathMetricFragment,
  PathNaturalEventFragment,
  PathOutputParticipationFragment,
  PathProtocolEventFragment,
  PathRelationFragment,
  PathRelationShadowLinkFragment,
  PathStructureFragment,
  PathStructureRelationShadowLinkFragment,
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
export type RelationShadowLinkNode = Node<PathRelationShadowLinkFragment, "RelationShadowLink">;
export type StructureRelationShadowLinkNode = Node<PathStructureRelationShadowLinkFragment, "StructureRelationShadowLink">;
export type MeasurementShadowLinkNode = Node<PathMeasurementRelationShadowLinkFragment, "MeasurementShadowLink">;


export type DescriptionEdge = Edge<PathDescriptionFragment, "Description">;
export type AssertionEdge = Edge<PathAssertionFragment, "Assertion">;
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
  | ActivityNode
  | RelationShadowLinkNode
  | StructureRelationShadowLinkNode
  | MeasurementShadowLinkNode;

export type PathEdgeData = PathEdge["data"];
export type PathNodeData = PathNode["data"];

export type PathEdge =
  | MeasurementEdge
  | RelationEdge
  | StructureRelationEdge
  | AssertionEdge
  | InputParticipationEdge
  | OutputParticipationEdge
  | DescriptionEdge;

