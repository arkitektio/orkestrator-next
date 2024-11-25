import { Edge, Node } from "reactflow";

export type KnowledgeNode = Node<{ id: string; label: string }>;
export type KnowledgeEdge = Edge<{
  id: string;
  source: string;
  target: string;
}>;
