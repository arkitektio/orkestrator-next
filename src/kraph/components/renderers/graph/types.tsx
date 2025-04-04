import {
  EntityFragment,
  PathDescriptionFragment,
  PathEntityFragment,
  PathMeasurementFragment,
  PathMetricFragment,
  PathNaturalEventFragment,
  PathParticipantFragment,
  PathProtocolEventFragment,
  PathReagentFragment,
  PathRelationFragment,
  PathStructureFragment,
  StructureFragment,
} from "@/kraph/api/graphql";
import React from "react";
import { Node, Edge, Connection } from "@xyflow/react";

export type EntityNode = Node<PathEntityFragment, "Entity">;
export type ThisNode = Node<{}, "__THIS__">;
export type ReagentNode = Node<PathReagentFragment, "Reagent">;
export type StructureNode = Node<PathStructureFragment, "Structure">;
export type MetricNode = Node<PathMetricFragment, "Metric">;
export type NaturalEventNode = Node<PathNaturalEventFragment, "NaturalEvent">;
export type ProtocolEventNode = Node<
  PathProtocolEventFragment,
  "ProtocolEvent"
>;

export type MeasurementEdge = Edge<PathMeasurementFragment, "Measurement">;
export type RelationEdge = Edge<PathRelationFragment, "Relation">;
export type DescribeEdge = Edge<PathDescriptionFragment, "Description">;
export type ParticipantEdge = Edge<PathParticipantFragment, "Participant">;

export type PathNode =
  | EntityNode
  | ReagentNode
  | StructureNode
  | NaturalEventNode
  | MetricNode
  | ProtocolEventNode;

export type PathEdgeData = PathEdge["data"];
export type PathNodeData = PathNode["data"];

export type PathEdge =
  | MeasurmentEdge
  | RelationEdge
  | ParticipantEdge
  | DescribeEdge;
