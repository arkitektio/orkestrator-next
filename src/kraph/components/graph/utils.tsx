import { EntityGraph } from "@/kraph/api/graphql";
import { KnowledgeEdge, KnowledgeNode } from "../../panes/graph/types";

export const entityNodesToNodes = (
  nodes: EntityGraph["nodes"],
): KnowledgeNode[] => {
  return nodes.map((node) => {
    return {
      type: node.label ? "measurementNode" : "default", 
      position: { x: 0, y: 0 },
      id: node.id,
      label: node.__typename,
      data: { label: node.label, id: node.id },
    } as KnowledgeNode;
  });
};

export const entityRelationToEdges = (
  relations: EntityGraph["edges"],
): KnowledgeEdge[] => {
  return relations.map((relation) => {
    return {
      id: relation.id,
      source: relation.leftId,
      target: relation.rightId,
    } as KnowledgeEdge;
  });
};