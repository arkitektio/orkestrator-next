import { Edge, Node } from "@xyflow/react";

export type KnowledgeNode<T extends { [key: string]: any }> = Node<T>;
export type KnowledgeEdge = Edge<{
  id: string;
  source: string;
  target: string;
}>;
