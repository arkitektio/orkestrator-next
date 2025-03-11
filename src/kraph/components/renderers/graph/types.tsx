import { EntityFragment, StructureFragment } from "@/kraph/api/graphql";
import { Edge, Node, NodeProps } from "reactflow";

export type KnowledgeNode = Node<{ id: string; label: string }>;

export type KnowledgeEdge = Edge<{
  id: string;
  source: string;
  target: string;
}>;

export type MeasurementNodeData = {
  id: string;
  label: string;
};

export type StructureNodeWidgetProps = NodeProps<StructureFragment>;
export type EntityNodeWidgetProps = NodeProps<EntityFragment>;
