import { Edge, Node } from "reactflow";

export type KnowledgeNode<T extends { [key: string]: any }> = Node<T>;
export type KnowledgeEdge = Edge<{
  id: string;
  source: string;
  target: string;
}>;
