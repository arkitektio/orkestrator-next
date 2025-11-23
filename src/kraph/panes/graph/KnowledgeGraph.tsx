import { AnimatePresence } from "framer-motion";
import React from "react";
import ReactFlow, {
  Background,
  EdgeTypes,
  NodeTypes,
  ReactFlowProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { KnowledgeEdge, KnowledgeNode } from "./types";

type Props = {
  edgeTypes: EdgeTypes;
  nodeTypes: NodeTypes;
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  children?: React.ReactNode;
} & ReactFlowProps;

const onInit = (reactFlowInstance: any) =>
  console.log("graph loaded:", reactFlowInstance);

export const KnowledgeGraph: React.FC<Props> = ({
  edgeTypes,
  nodeTypes,
  nodes,
  edges,
  children,
  ...props
}) => {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onInit={onInit}
      fitView
      attributionPosition="top-right"
      {...props}
    >
      <AnimatePresence>
        <Background />
        {children}
      </AnimatePresence>
    </ReactFlow>
  );
};
