import { Connection, Edge, Node } from "@xyflow/react";
import React from "react";

import {
  CreateEntityCategoryInput,
  CreateMeasurementCategoryInput,
  CreateRelationCategoryInput,
  EventRoleFragment,
  ListEntityCategoryFragment,
  ListNaturalEventCategoryFragment,
  ListProtocolEventCategoryFragment,
  ListRelationCategoryFragment,
} from "@/kraph/api/graphql";

export type GenericNode = Node<ListEntityCategoryFragment, "entitycategory">;
// ReagentCategory was removed from the backend schema; reagent entities are
// now modeled as EntityCategory (see EntityCategory.instanceKind).
export type ReagentNode = Node<ListEntityCategoryFragment, "reagentcategory">;
export type ProtocolEventNode = Node<
  ListProtocolEventCategoryFragment,
  "protocoleventcategory"
>;
export type NaturalEventNode = Node<
  ListNaturalEventCategoryFragment,
  "naturaleventcategory"
>;

export type StagingGenericNode = Node<
  CreateEntityCategoryInput,
  "staginggeneric"
>;

export type StagingMeasurementEdge = Edge<
  CreateMeasurementCategoryInput,
  "stagingmeasurement"
>;
export type RelationEdge = Edge<ListRelationCategoryFragment, "relation">;
export type EntityRoleEdge = Edge<EventRoleFragment, "reagentrole">;
export type ReagentRoleEdge = Edge<EventRoleFragment, "entityrole">;

export type StagingRelationEdge = Edge<
  CreateRelationCategoryInput,
  "stagingrelation"
>;

export type MyEdge =
  | RelationEdge
  | StagingRelationEdge
  | EntityRoleEdge
  | ReagentRoleEdge
  | StagingMeasurementEdge;

export type EdgeData = MyEdge["data"];

export type MyNode =
  | GenericNode
  | StagingGenericNode
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
