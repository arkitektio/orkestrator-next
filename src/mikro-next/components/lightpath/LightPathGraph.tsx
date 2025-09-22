import { Button } from "@/components/ui/button";

import { LightpathGraphFragment } from "@/mikro-next/api/graphql";
import {
  MarkerType,
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ELK from "elkjs/lib/elk.bundled.js";
import React from "react";
import LightEdge from "./edges/LightEdge";
import "./index.css";
import BeamSplitterElementNode from "./nodes/BeamSplitterElementNode";
import CCDElementNode from "./nodes/CCDElementNode";
import DetectorElementNode from "./nodes/DetectorElementNode";
import FilterElementNode from "./nodes/FilterElementNode";
import LaserElementNode from "./nodes/LaserElementNode";
import MirrorElementNode from "./nodes/MirrorElementNode";
import ObjectiveElementNode from "./nodes/ObjectiveElementNode";
import OtherElementNode from "./nodes/OtherElementNode";
import OtherSourceElementNode from "./nodes/OtherSourceElementNode";
import SampleElementNode from "./nodes/SampleElementNode";
import SourceElementNode from "./nodes/SourceElementNode";
import { MyEdge, MyNode } from "./types";
import { Pin } from "lucide-react";
import PinHoleElementNode from "./nodes/PinHoleElementNode";

const graphToNodes = (graph: LightpathGraphFragment): MyNode[] => {
  return graph.elements.map((cat, index) => ({
    id: cat.id,
    position: {
      x: cat.pose?.position?.x || 300,
      y: cat.pose?.position?.y || 300,
    },
    height: 100,
    width: 100,
    data: cat,
    type: cat.__typename,
  }));
};

const graphToEdges = (graph: LightpathGraphFragment): MyEdge[] => {
  return graph.edges.map((edge) => ({
    id: edge.id,
    source: edge.sourceElementId,
    target: edge.targetElementId,
    sourceHandle: edge.sourcePortId || undefined,
    targetHandle: edge.targetPortId || undefined,
    data: edge,
    type: "LightEdge" as const,
    markerEnd: {
      type: MarkerType.Arrow,
    },
  }));
};

const nodeTypes = {
  SampleElement: SampleElementNode,
  MirrorElement: MirrorElementNode,
  BeamSplitterElement: BeamSplitterElementNode,
  DetectorElement: DetectorElementNode,
  OtherElement: OtherElementNode,
  PinholeElement: PinHoleElementNode,
  OtherSourceElement: OtherSourceElementNode,
  CCDElement: CCDElementNode,
  LaserElement: LaserElementNode,
  FilterElement: FilterElementNode,
  ObjectiveElement: ObjectiveElementNode,
  SourceElement: SourceElementNode, // Reuse the sample element for the source
};

const edgeTypes = {
  LightEdge: LightEdge,
};

function calculateMidpoint(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

const layeredLayout = {
  "elk.algorithm": "layered",
  "elk.layered.nodePlacement.strategy": "SIMPLE",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.layered.crossingMinimization.minimize": "LAYER_SWEEP",
  "elk.layered.spacing.nodeNode": "100",
  "elk.spacing.nodeNode": "100",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.direction": "RIGHT",
};

const forceLayout = {
  "elk.algorithm": "force",
  "elk.force.ungroupedNodeRepulsion": "1000",
  "elk.force.groupRepulsion": "1000",
  "elk.force.nodeNodeRepulsion": "1000",
  "elk.layered.spacing.nodeNode": "100",
  "elk.spacing.nodeNode": "100",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.direction": "RIGHT",
};

const discoLayout = {
  "elk.algorithm": "disco",
  "elk.drawing.strategy": "POLYLINE",
  "elk.spacing.nodeNode": "100",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.layered.spacing.nodeNode": "100",
  "elk.direction": "RIGHT",
  "elk.layered.nodePlacement.strategy": "SIMPLE",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
};

const treeLayout = {
  "elk.algorithm": "mrtree",
  "elk.layered.nodePlacement.strategy": "SIMPLE",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.layered.crossingMinimization.minimize": "LAYER_SWEEP",
  "elk.layered.spacing.nodeNode": "100",
  "elk.spacing.nodeNode": "100",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.direction": "RIGHT",
  "elk.layered.nodePlacement.bk.fixedAlignment": "LEFT",
};

const stressLayout = {
  "elk.algorithm": "stress",
  "org.eclipse.elk.stress.desiredEdgeLength": "200",
  "org.eclipse.elk.stress.dimension": "XY",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.layered.crossingMinimization.minimize": "LAYER_SWEEP",
  "elk.layered.spacing.nodeNode": "200",
  "elk.spacing.nodeNode": "200",
  "elk.layered.spacing.nodeNodeBetweenLayers": "200",
  "elk.direction": "RIGHT",
  "elk.layered.nodePlacement.bk.fixedAlignment": "LEFT",
};

const hashGraph = (graph: LightpathGraphFragment) => {
  return JSON.stringify(graph);
};

export const LightPathGraph = ({
  graph,
  showButtons,
}: {
  graph: LightpathGraphFragment;
  showButtons?: boolean;
}) => {
  const reactFlowWrapper = React.useRef<HTMLDivElement | null>(null);

  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance<MyNode, MyEdge> | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<MyNode>(
    graphToNodes(graph),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<MyEdge>(
    graphToEdges(graph),
  );

  React.useEffect(() => {
    if (reactFlowInstance) {
      setNodes(graphToNodes(graph));
      setEdges(graphToEdges(graph));
      layout(stressLayout);

      reactFlowInstance.fitView({ padding: 0.2 });
    }
  }, [reactFlowInstance, hashGraph(graph)]);

  React.useEffect(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
    }
  }, [reactFlowInstance, nodes]);

  const layout = (layout: { [key: string]: string }) => {
    const elk = new ELK();
    const the_nodes = nodes;

    const graph = {
      id: "root",
      layoutOptions: layout,
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
        return { ...child, position: { x: node.x || 1, y: node.y || 1 } };
      });

      setNodes(newNodes);
    });
  };

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: "100%", height: "100%" }}
      className="relative"
    >
      <ReactFlow<MyNode, MyEdge>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={(r) => setReactFlowInstance(r)}
        fitView
        proOptions={{ hideAttribution: true }}
      />

      {showButtons && (
        <div className="absolute top-0 left-0 p-3 gap-2 flex flex-row">
          <Button onClick={() => layout(stressLayout)} variant={"outline"}>
            Stress
          </Button>
          <Button onClick={() => layout(forceLayout)} variant={"outline"}>
            Force
          </Button>
          <Button onClick={() => layout(discoLayout)} variant={"outline"}>
            Disco
          </Button>
          <Button onClick={() => layout(treeLayout)} variant={"outline"}>
            Tree
          </Button>
          <Button onClick={() => layout(layeredLayout)} variant={"outline"}>
            Layered
          </Button>
        </div>
      )}
    </div>
  );
};

export default LightPathGraph; // --- IGNORE ---
