import {
  CoordinateSystemKind,
  GetCoordinateGraphQuery,
} from "@/mikro-next/api/graphql";
import {
  Background,
  Controls,
  MarkerType,
  Panel,
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ELK from "elkjs/lib/elk.bundled.js";
import React from "react";
import CoordinateSystemNode, { KIND_DOT } from "./CoordinateSystemNode";
import TransformationNode from "./TransformationNode";
import { GraphEdge, GraphNode } from "./types";

export type CoordinateGraph = GetCoordinateGraphQuery["coordinateGraph"];

const SYSTEM_WIDTH = 220;
const SYSTEM_HEIGHT = 76;
const TRANSFORM_WIDTH = 190;
const TRANSFORM_HEIGHT = 68;

const nodeTypes = {
  coordinateSystem: CoordinateSystemNode,
  transformation: TransformationNode,
};

// Left-to-right layers. Because every transformation is its own node, the
// layering alternates space / operation / space on its own — the layout does
// the storytelling.
const layeredLayout = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
  "elk.layered.spacing.nodeNodeBetweenLayers": "70",
  "elk.spacing.nodeNode": "36",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
};

// `currentColor`, not `hsl(var(--muted-foreground))`: this app's design tokens
// are Tailwind v4 oklch() values, so wrapping one in hsl() yields an invalid
// color — the stroke is ignored and the arrow marker (an SVG <marker> with an
// invalid fill) renders nothing at all.
const edgeStyle = {
  stroke: "currentColor",
  strokeWidth: 1.5,
};

const marker = {
  type: MarkerType.ArrowClosed,
  width: 16,
  height: 16,
  color: "currentColor",
};

/**
 * The graph is bipartite: coordinate systems and the transformations between
 * them are both nodes, and the lines only say "then". An edge whose input or
 * output falls outside the returned component (the walk is depth-bounded) is
 * dropped rather than drawn dangling.
 */
const buildGraph = (
  graph: CoordinateGraph,
): { nodes: GraphNode[]; edges: GraphEdge[]; dropped: number } => {
  const known = new Set(graph.systems.map((system) => system.id));
  let dropped = 0;

  const nodes: GraphNode[] = graph.systems.map((system) => ({
    id: system.id,
    type: "coordinateSystem" as const,
    position: { x: 0, y: 0 },
    data: { system, isRoot: system.id === graph.root.id },
  }));

  const edges: GraphEdge[] = [];

  for (const transformation of graph.transformations) {
    const input = transformation.input;
    const output = transformation.output;
    // Not silent: a transformation with an endpoint missing from the walk
    // cannot be drawn, and a graph that quietly renders fewer edges than the
    // server returned is worse than one that says so.
    if (
      !input ||
      !output ||
      !known.has(input.id) ||
      !known.has(output.id)
    ) {
      dropped++;
      continue;
    }

    const id = `t-${transformation.id}`;
    nodes.push({
      id,
      type: "transformation" as const,
      position: { x: 0, y: 0 },
      data: { transformation },
    });

    edges.push({
      id: `${input.id}->${id}`,
      source: input.id,
      target: id,
      type: "smoothstep" as const,
      style: edgeStyle,
    });
    edges.push({
      id: `${id}->${output.id}`,
      source: id,
      target: output.id,
      type: "smoothstep" as const,
      style: edgeStyle,
      markerEnd: marker,
    });
  }

  return { nodes, edges, dropped };
};

// ELK places boxes, so it needs the height the node will actually render at —
// both kinds grow with their content (a composite lists its children, a system
// wraps its axis chips), and a stale constant here shows up as overlap.
const sizeOf = (node: GraphNode) => {
  if (node.type === "transformation") {
    const transformation = node.data.transformation;
    const children =
      "transformations" in transformation
        ? transformation.transformations.length
        : 0;
    return {
      width: TRANSFORM_WIDTH,
      height: TRANSFORM_HEIGHT + children * 14,
    };
  }

  const axisRows = Math.ceil(node.data.system.axes.length / 4);
  return {
    width: SYSTEM_WIDTH,
    height: SYSTEM_HEIGHT + Math.max(0, axisRows - 1) * 16,
  };
};

const Legend = ({
  systems,
  transformations,
  dropped,
}: {
  systems: number;
  transformations: number;
  dropped: number;
}) => (
  <div className="flex max-w-[420px] flex-wrap items-center gap-x-3 gap-y-1 rounded-md border bg-background/80 px-2 py-1 text-[10px] text-foreground backdrop-blur">
    {Object.values(CoordinateSystemKind).map((kind) => (
      <span key={kind} className="flex items-center gap-1">
        <span className={`h-2 w-2 rounded-full ${KIND_DOT[kind]}`} />
        {kind}
      </span>
    ))}
    <span className="flex items-center gap-1">
      <span className="h-2 w-3 rounded-sm border-2 border-primary/70 bg-primary/10" />
      transformation
    </span>
    <span className="w-full border-t pt-1 font-mono text-muted-foreground">
      {systems} systems · {transformations} transformations
      {dropped > 0 && (
        <span className="text-amber-500">
          {" "}
          · {dropped} not drawn (endpoint outside the walk)
        </span>
      )}
    </span>
  </div>
);

export const CoordinateGraphFlow = ({ graph }: { graph: CoordinateGraph }) => {
  const [instance, setInstance] =
    React.useState<ReactFlowInstance<GraphNode, GraphEdge> | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<GraphNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<GraphEdge>([]);
  const [dropped, setDropped] = React.useState(0);

  React.useEffect(() => {
    const { nodes: rawNodes, edges: rawEdges, dropped } = buildGraph(graph);
    let cancelled = false;

    // Nodes and edges go in BEFORE the layout resolves, and the layout only
    // moves them afterwards. Gating them on ELK means one rejected promise
    // renders a graph with no connections — which reads as "this data has no
    // edges" rather than "the layout failed".
    setNodes(rawNodes);
    setEdges(rawEdges);
    setDropped(dropped);

    new ELK()
      .layout({
        id: "root",
        layoutOptions: layeredLayout,
        children: rawNodes.map((node) => ({ id: node.id, ...sizeOf(node) })),
        edges: rawEdges.map((edge) => ({
          id: edge.id,
          sources: [edge.source],
          targets: [edge.target],
        })),
      })
      .then(({ children }) => {
        if (cancelled) return;
        setNodes(
          rawNodes.map((node) => {
            const placed = children?.find((child) => child.id === node.id);
            return {
              ...node,
              position: { x: placed?.x ?? 0, y: placed?.y ?? 0 },
            };
          }),
        );
        instance?.fitView({ padding: 0.2 });
      })
      .catch((error) => {
        console.error("[CoordinateGraph] ELK layout failed", error);
      });

    return () => {
      cancelled = true;
    };
  }, [graph, instance]);

  return (
    // `text-muted-foreground` on the wrapper is load-bearing: the edges stroke
    // with `currentColor`, so this is what colours them.
    <div
      style={{ width: "100%", height: "100%" }}
      className="relative text-muted-foreground"
    >
      <ReactFlow<GraphNode, GraphEdge>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={(reactFlow) => setInstance(reactFlow)}
        defaultEdgeOptions={{ type: "smoothstep" }}
        nodesConnectable={false}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} size={1} />
        <Controls showInteractive={false} />
        <Panel position="top-left">
          <Legend
            systems={graph.systems.length}
            transformations={graph.transformations.length}
            dropped={dropped}
          />
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default CoordinateGraphFlow;
