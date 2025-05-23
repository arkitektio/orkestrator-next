import { PathFragment } from "@/kraph/api/graphql.js";
import ELK from "elkjs/lib/elk.bundled.js";
import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import {
  Background,
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ClickContextual } from "./components/ClickContextual";
import { PathEdge, PathNode } from "./types";
import { entityNodesToNodes, entityRelationToEdges } from "./utils";
import EntityNode from "./nodes/EntityNode";
import NaturalEventNode from "./nodes/NaturalEventNode";
import ProtocolEventNode from "./nodes/ProtocolEventNode";
import StructureNode from "./nodes/StructureNode";
import ReagentNode from "./nodes/ReagentNode";
import MetricNode from "./nodes/MetricNode";
import MeasurementEdge from "./edges/MeasurementEdge";
import EntityRoleEdge from "./edges/EntityRoleEdge";
import RelationEdge from "./edges/RelationEdge";
import { Description } from "@radix-ui/react-dialog";
import DescribeEdge from "./edges/DescribeEdge";
import ThisNode from "./nodes/ThisNode";

export type Props = {
  path: PathFragment;
  root?: string;
};

const pathNodeTypes = {
  Entity: EntityNode,
  NaturalEvent: NaturalEventNode,
  ProtocolEvent: ProtocolEventNode,
  Structure: StructureNode,
  Reagent: ReagentNode,
  Metric: MetricNode,
  __THIS__: ThisNode,
};

const pathEdgeTypes = {
  Measurement: MeasurementEdge,
  Participant: EntityRoleEdge,
  Relation: RelationEdge,
  Description: DescribeEdge,
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
  from: PathNode;
} & BaseContextual;

export type Contextual = ClickContextual | DropContextual;

const elk = new ELK();

const stressLayout = {
  "elk.algorithm": "stress",
  "org.eclipse.elk.stress.desiredEdgeLength": "200",
  "org.eclipse.elk.stress.dimension" : "XY",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.layered.crossingMinimization.minimize": "LAYER_SWEEP",
  "elk.layered.spacing.nodeNode": "200",
  "elk.spacing.nodeNode": "200",
  "elk.layered.spacing.nodeNodeBetweenLayrs": "200",
  "elk.direction": "RIGHT",
  "elk.layered.nodePlacement.bk.fixedAlignment": "LEFT",
}

export const PathGraph: React.FC<Props> = ({ path, root }) => {
  const reactFlowWrapper = React.useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance<PathNode, PathEdge> | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<PathNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<PathEdge>(
    entityRelationToEdges(path.edges),
  );

  useEffect(() => {
    const the_nodes = entityNodesToNodes(path.nodes, root);

    const graph = {
      id: "root",
      layoutOptions: stressLayout,
      children: the_nodes.map((node) => ({
        id: node.id,
        x: node.position.x,
        y: node.position.y,
        width: node.width,
        height: node.height,
      })),
      edges: edges.map((edge) => ({
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
        const child = the_nodes.find((n) => n.id === node.id);
        return { ...child, position: { x: node.x, y: node.y } };
      });

      setNodes(newNodes);
    });
  }, [reactFlowInstance]);

  useEffect(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView();
    }
  }, [nodes, edges, reactFlowInstance]);

  if (!nodes) {
    return <div className="h-full w-full">Loading...</div>;
  }

  return (
    <div ref={reactFlowWrapper} className="relative h-full">
      <ReactFlow<PathNode, PathEdge>
        nodes={nodes}
        edges={edges}
        nodeTypes={pathNodeTypes}
        edgeTypes={pathEdgeTypes}
        onInit={(r) => setReactFlowInstance(r)}
        snapToGrid={true}
        autoFocus
        fitView
        attributionPosition="top-right"
        className="relative"
      ></ReactFlow>
    </div>
  );
};
