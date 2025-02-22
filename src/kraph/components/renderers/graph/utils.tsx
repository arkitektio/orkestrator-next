import { PathFragment } from "@/kraph/api/graphql";
import { KnowledgeEdge, KnowledgeNode } from "../../../panes/graph/types";

export const entityNodesToNodes = (
  nodes: PathFragment["nodes"],
): KnowledgeNode<any>[] => {
  return Array.from(
    nodes
      .reduce((map, node) => {
        if (!map.has(node.id)) {
          map.set(node.id, {
            type: node.__typename,
            position: { x: 0, y: 0 },
            id: node.id,
            data: node,
          });
        }
        return map;
      }, new Map<string, KnowledgeNode<any>>())
      .values(),
  );
};

export const entityRelationToEdges = (
  relations: PathFragment["edges"],
): KnowledgeEdge[] => {
  return relations.map((relation) => {
    return {
      id: relation.id,
      source: relation.leftId,
      target: relation.rightId,
      data: relation,
    } as KnowledgeEdge;
  });
};
