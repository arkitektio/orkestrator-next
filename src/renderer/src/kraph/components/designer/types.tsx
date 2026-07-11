import { Connection, Edge, Node } from "@xyflow/react";
import React from "react";

import {
  CreateEntityDefinitionInput,
  CreateMeasurementDefinitionInput,
  CreateRelationDefinitionInput,
  CreateStructureDefinitionInput,
  EventRoleFragment,
  ListEntityCategoryFragment,
  ListMeasurementCategoryFragment,
  ListMetricCategoryFragment,
  ListNaturalEventCategoryFragment,
  ListProtocolEventCategoryFragment,
  ListRelationCategoryFragment,
  ListStructureCategoryFragment,
  ListStructureRelationCategoryFragment
} from "@/kraph/api/graphql";

export type GenericNode = Node<ListEntityCategoryFragment, "entitycategory">;
// ReagentCategory was removed from the backend schema; reagent entities are
// now modeled as EntityCategory (see EntityCategory.instanceKind).
export type ReagentNode = Node<ListEntityCategoryFragment, "reagentcategory">;
export type MetricNode = Node<ListMetricCategoryFragment, "metriccategory">;
export type ProtocolEventNode = Node<
  ListProtocolEventCategoryFragment,
  "protocoleventcategory"
>;
export type NaturalEventNode = Node<
  ListNaturalEventCategoryFragment,
  "naturaleventcategory"
>;

export type StructureNode = Node<
  ListStructureCategoryFragment,
  "structurecategory"
>;
export type StagingStructureNode = Node<
  CreateStructureDefinitionInput,
  "stagingstructure"
>;
export type StagingGenericNode = Node<
  CreateEntityDefinitionInput,
  "staginggeneric"
>;

export type MeasurementEdge = Edge<
  ListMeasurementCategoryFragment,
  "measurement"
>;

export type DescribeEdge = Edge<ListMetricCategoryFragment, "describe">;

export type StagingMeasurementEdge = Edge<
  CreateMeasurementDefinitionInput,
  "stagingmeasurement"
>;
export type RelationEdge = Edge<ListRelationCategoryFragment, "relation">;
export type StructureRelationEdge = Edge<
  ListStructureRelationCategoryFragment,
  "structure_relation"
>;
export type EntityRoleEdge = Edge<EventRoleFragment, "reagentrole">;
export type ReagentRoleEdge = Edge<EventRoleFragment, "entityrole">;

export type StagingRelationEdge = Edge<
  CreateRelationDefinitionInput,
  "stagingrelation"
>;

export type MyEdge =
  | MeasurementEdge
  | RelationEdge
  | StructureRelationEdge
  | StagingRelationEdge
  | EntityRoleEdge
  | DescribeEdge
  | ReagentRoleEdge
  | StagingMeasurementEdge;

export type EdgeData = MyEdge["data"];

export type MyNode =
  | GenericNode
  | StructureNode
  | StagingStructureNode
  | StagingGenericNode
  | MetricNode
  | ProtocolEventNode
  | NaturalEventNode;

export type NodeData = MyNode["data"];

export type ClickContextualParams = {
  type: "click";
  position: { x: number; y: number };
  event: React.MouseEvent;
};

export type ConnectContextualParams = {
  type: "connect";
  connection: Connection;
  leftNode: MyNode;
  rightNode: MyNode;
  position: { x: number; y: number };
};

export type StagingNodeParams = {
  event: React.MouseEvent;
  data: NodeData;
  ageName: string;
  type: MyNode["type"];
};

export type StagingEdgeParams = {
  data: EdgeData;
  ageName: string;
  type: MyEdge["type"];
  source: string;
  target: string;
};
