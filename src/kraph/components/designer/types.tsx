import React from "react";
import { Node, Edge, Connection } from "@xyflow/react";

import {
  GenericCategoryInput,
  ListGenericCategoryFragment,
  ListMeasurementCategoryFragment,
  ListRelationCategoryFragment,
  ListStructureCategoryFragment,
  MeasurementCategoryInput,
  RelationCategoryInput,
  StructureCategoryInput,
} from "@/kraph/api/graphql";

export type GenericNode = Node<ListGenericCategoryFragment, "genericcategory">;
export type StructureNode = Node<
  ListStructureCategoryFragment,
  "structurecategory"
>;
export type StagingStructureNode = Node<
  StructureCategoryInput,
  "stagingstructure"
>;
export type StagingGenericNode = Node<GenericCategoryInput, "staginggeneric">;

export type MeasurementEdge = Edge<
  ListMeasurementCategoryFragment,
  "measurement"
>;
export type RelationEdge = Edge<ListRelationCategoryFragment, "relation">;

export type StagingRelationEdge = Edge<
  RelationCategoryInput,
  "stagingrelation"
>;
export type StagingMeasurementEdge = Edge<
  MeasurementCategoryInput,
  "stagingmeasurement"
>;

export type MyEdge =
  | MeasurementEdge
  | RelationEdge
  | StagingRelationEdge
  | StagingMeasurementEdge;

export type EdgeData = MyEdge["data"];

export type MyNode =
  | GenericNode
  | StructureNode
  | StagingStructureNode
  | StagingGenericNode;

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
