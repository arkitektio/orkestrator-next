import { PathFragment } from "@/kraph/api/graphql.js";
import {
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ELK from "elkjs/lib/elk.bundled.js";
import React, { useEffect } from "react";
import DescribeEdge from "./edges/DescribeEdge";
import EntityRoleEdge from "./edges/EntityRoleEdge";
import MeasurementEdge from "./edges/MeasurementEdge";
import RelationEdge from "./edges/RelationEdge";
import EntityNode from "./nodes/EntityNode";
import MetricNode from "./nodes/MetricNode";
import NaturalEventNode from "./nodes/NaturalEventNode";
import ProtocolEventNode from "./nodes/ProtocolEventNode";
import ReagentNode from "./nodes/ReagentNode";
import StructureNode from "./nodes/StructureNode";
import ThisNode from "./nodes/ThisNode";
import { PathEdge, PathNode } from "./types";
import { entityNodesToNodes, entityRelationToEdges } from "./utils";
import { ViewOptions } from "../DelegatingNodeViewRenderer";
import { hash } from "crypto";
import { Button } from "@/components/ui/button";
import {
  PathViewerStateProvider,
  usePathViewerState,
} from "./PathViewerStateProvider";

export type Props = {
  path: PathFragment;
  root?: string;
  options?: ViewOptions;
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
  StructureRelation: RelationEdge,
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
  "org.eclipse.elk.stress.dimension": "XY",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.layered.crossingMinimization.minimize": "LAYER_SWEEP",
  "elk.layered.spacing.nodeNode": "200",
  "elk.spacing.nodeNode": "200",
  "elk.layered.spacing.nodeNodeBetweenLayrs": "200",
  "elk.direction": "RIGHT",
  "elk.layered.nodePlacement.bk.fixedAlignment": "LEFT",
};

const hashPash = (path: PathFragment): string => {
  return JSON.stringify(path);
};

export const PathGraphInner: React.FC<Props> = ({ path, root, options }) => {
  const reactFlowWrapper = React.useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance<PathNode, PathEdge> | null>(null);

  const { viewerState, setViewerState } = usePathViewerState();

  const [nodes, setNodes, onNodesChange] = useNodesState<PathNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<PathEdge>([]);

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
      setEdges(entityRelationToEdges(path.edges));
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
      <Button
        onClick={() =>
          setViewerState((s) => ({ ...s, showWidgets: !s.showWidgets }))
        }
      >
        {viewerState.showWidgets ? "Hide" : "Show"} Widgets
      </Button>
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

export const PathGraph = (props: Props) => {
  return (
    <PathViewerStateProvider>
      <PathGraphInner {...props} key={hashPash(props.path)} />
    </PathViewerStateProvider>
  );
};
