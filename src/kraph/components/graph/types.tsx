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


export type MeasurementNodeWidgetProps = NodeProps<MeasurementNodeData>;