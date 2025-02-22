import { GraphViewFragment, PathFragment } from "@/kraph/api/graphql.js";
import ELK from "elkjs/lib/elk.bundled.js";
import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import ReactFlow, {
  Background,
  ReactFlowInstance,
  ReactFlowProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { ClickContextual } from "./components/ClickContextual.js";
import EntityNodeWidget from "./nodes/EntityNodeWidget.js";
import StructureNodeWidget from "./nodes/StructureNodeWidget.js";
import { KnowledgeNode } from "./types.js";
import { entityNodesToNodes, entityRelationToEdges } from "./utils.js";

type Props = {
  path: PathFragment;
  root?: string;
} & ReactFlowProps;

const nodeTypes = {
  Entity: EntityNodeWidget,
  Structure: StructureNodeWidget,
};

export type BaseContextual = {
  x: number;
  y: number;
};

export type ClickContextual = {
  type: "click";
} & BaseContextual;

export type DropContextual = {
  type: "drop";
  from: KnowledgeNode;
} & BaseContextual;

export type Contextual = ClickContextual | DropContextual;

const elk = new ELK();

export const PathGraph: React.FC<Props> = ({ path, ...props }) => {
  const reactFlowWrapper = React.useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance | null>(null);

  const [currentPath, setCurrentPath] = React.useState({
    nodes: entityNodesToNodes(path.nodes),
    edges: entityRelationToEdges(path.edges),
    layout: "vanilla",
  });

  const [contextual, setContextual] = React.useState<Contextual | null>(null);

  useEffect(() => {
    const graph = {
      id: "root",
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "DOWN",
        "elk.layered.spacing.nodeNode": "50",
        "elk.layered.spacing.edgeNode": "50",
        "elk.padding": "50",
      },
      children: currentPath.nodes.map((node) => ({
        id: props.root && props.root == node.id ? "root" : node.id,
        x: node.position.x,
        y: node.position.y,
        width: 200,
        height: 200,
      })),
      edges: currentPath.edges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };

    elk.layout(graph).then(({ children }) => {
      // By mutating the children in-place we saves ourselves from creating a
      // needless copy of the nodes array.
      if (!children) {
        return;
      }

      const newNodes = children.map((node) => {
        const child = currentPath.nodes.find((n) => n.id === node.id);
        return { ...child, position: { x: node.x, y: node.y } };
      });

      setCurrentPath({
        nodes: newNodes,
        edges: currentPath.edges,
        layout: "elk",
      });
      reactFlowInstance?.fitView();
    });
  }, [reactFlowInstance]);

  return (
    <div ref={reactFlowWrapper} className="relative h-full">
      <ReactFlow
        nodes={currentPath.nodes}
        edges={currentPath.edges}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        snapToGrid={true}
        onPaneClick={(event) => {
          if (contextual) {
            setContextual(null);
          } else {
            const reactFlowBounds =
              reactFlowWrapper?.current?.getBoundingClientRect();
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
