import { AnimatePresence } from "framer-motion";
import React from "react";
import ReactFlow, {
  Background,
  EdgeTypes,
  NodeTypes,
  ReactFlowProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { KnowledgeEdge, KnowledgeNode } from "./types.js";
import { EntityGraph, GetEntityGraphQuery } from "@/kraph/api/graphql.js";
import { entityNodesToNodes, entityRelationToEdges } from "./utils.js";
import { node } from "slate";
import MeasurementNodeWidget from "./nodes/MeasurementNodeWidget.js";
import { Button } from "@/components/ui/button.js";
import { ClickContextual } from "./components/ClickContextual.js";

type Props = {
  graph: EntityGraph;
  children?: React.ReactNode;
} & ReactFlowProps;



const nodeTypes = {
  measurementNode: MeasurementNodeWidget,
}


export type BaseContextual = {
  x: number;
  y: number;
}

export type ClickContextual = {
  type: "click";
} & BaseContextual;

export type DropContextual = {
  type: "drop";
  from: KnowledgeNode;
} & BaseContextual;

export type Contextual = ClickContextual | DropContextual;

export const KnowledgeGraph: React.FC<Props> = ({
  graph: { nodes, edges },
  children,
  ...props
}) => {

  const reactFlowWrapper = React.useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<any>(null);


  const [ contextual, setContextual] = React.useState<Contextual | null>(null);




  return (
    <div ref={reactFlowWrapper} className="relative h-full">
    <ReactFlow
      nodes={entityNodesToNodes(nodes)}
      edges={entityRelationToEdges(edges)}
      nodeTypes={nodeTypes}
      onInit={setReactFlowInstance}
      snapToGrid={true}
      onPaneClick={(event) => {
        if (contextual) {
          setContextual(null);
        }
        else {
        const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();
        console.log("reactFlowBounds", reactFlowBounds);
        if (reactFlowInstance && reactFlowBounds) {
          let position = {
            x: event.clientX - (reactFlowBounds?.left || 0),
            y: event.clientY - (reactFlowBounds?.top || 0),
          };

          setContextual({ type: "click", ...position });
        }
      }
        
      }}
      fitView
      attributionPosition="top-right"
      {...props}
      className="relative"
    >
      <AnimatePresence>
        <Background />
        {children}
        
      </AnimatePresence>
    </ReactFlow>
    {contextual && (
          <div
        
            className="absolute bg-slate-900 shadow-lg rounded-lg border-1 border-slate-800 p-4 border max-w-xl"
            style={{ top: contextual.y, left: contextual.x }}
          >
              
            <ClickContextual />
          </div>
        )}
    </div>
  );
};
