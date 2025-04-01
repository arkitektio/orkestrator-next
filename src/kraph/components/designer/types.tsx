import React from "react";
import { Node, Edge, Connection } from "@xyflow/react";

import {
  EntityCategoryInput,
  EntityRoleDefinition,
  EntityRoleDefinitionFragment,
  ListEntityCategoryFragment,
  ListMeasurementCategoryFragment,
  ListMetricCategoryFragment,
  ListNaturalEventCategoryFragment,
  ListProtocolEventCategoryFragment,
  ListReagentCategoryFragment,
  ListRelationCategoryFragment,
  ListStructureCategoryFragment,
  MeasurementCategoryInput,
  ReagentRoleDefinition,
  ReagentRoleDefinitionFragment,
  RelationCategoryInput,
  StructureCategoryInput,
} from "@/kraph/api/graphql";

export type GenericNode = Node<ListEntityCategoryFragment, "genericcategory">;
export type ReagentNode = Node<ListReagentCategoryFragment, "reagentcategory">;
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
  StructureCategoryInput,
  "stagingstructure"
>;
export type StagingGenericNode = Node<EntityCategoryInput, "staginggeneric">;

export type MeasurementEdge = Edge<
  ListMeasurementCategoryFragment,
  "measurement"
>;

export type DescribeEdge = Edge<ListMetricCategoryFragment, "describe">;

export type StagingMeasurementEdge = Edge<
  MeasurementCategoryInput,
  "stagingmeasurement"
>;
export type RelationEdge = Edge<ListRelationCategoryFragment, "relation">;
export type EntityRoleEdge = Edge<ReagentRoleDefinitionFragment, "reagentrole">;
export type ReagentRoleEdge = Edge<EntityRoleDefinitionFragment, "entityrole">;

export type StagingRelationEdge = Edge<
  RelationCategoryInput,
  "stagingrelation"
>;

export type MyEdge =
  | MeasurementEdge
  | RelationEdge
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
