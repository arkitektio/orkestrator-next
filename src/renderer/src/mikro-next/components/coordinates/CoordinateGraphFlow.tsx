import { GetCoordinateGraphQuery, PlacementValidity } from "@/mikro-next/api/graphql";
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
import CoordinateSystemNode, {
  OCCUPANCY_DOT,
  OCCUPANCY_LABEL,
  Occupancy,
} from "./CoordinateSystemNode";
import { RESIDENT_NODE_HEIGHT, systemNodeSize } from "./nodeSize";
import ResidentNode, {
  RESIDENT_COLOR,
  residentNodeWidth,
} from "./ResidentNode";
import { describeTransformation, GraphEdge, GraphNode } from "./types";

export type CoordinateGraph = GetCoordinateGraphQuery["coordinateGraph"];

const nodeTypes = {
  coordinateSystem: CoordinateSystemNode,
  resident: ResidentNode,
};

// DisCo packs the graph's connected components; each component is drawn by
// `layered`, which is what produces the left-to-right chain of spaces. The walk
// this view renders is usually one component, so DisCo mostly has nothing to
// pack — it earns its place when a depth-bounded walk leaves an island, which
// layered would otherwise strand in a corner.
const layout = {
  "elk.algorithm": "disco",
  "elk.disco.componentCompaction.strategy": "POLYOMINO",
  "elk.disco.componentCompaction.componentLayoutAlgorithm": "layered",
  "elk.direction": "RIGHT",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  // Room in the gap for the edge label React Flow draws on the line.
  "elk.layered.spacing.nodeNodeBetweenLayers": "130",
  "elk.spacing.nodeNode": "32",
};

// `currentColor`, not `hsl(var(--muted-foreground))`: this app's design tokens
// are Tailwind v4 oklch() values, so wrapping one in hsl() yields an invalid
// color — the stroke is ignored and the arrow marker (an SVG <marker> with an
// invalid fill) renders nothing at all.
const marker = {
  type: MarkerType.ArrowClosed,
  width: 16,
  height: 16,
  color: "currentColor",
};

const transformationStyle = { stroke: "currentColor", strokeWidth: 1.5 };

// An assumed map must be visible without reading the label — the schema is
// emphatic about it — and an unmappable one is not a step the geometry can
// travel through at all.
const assumedStyle = { ...transformationStyle, strokeDasharray: "5 4" };

// Residency is not a map. It is drawn as the faintest possible tie so the eye
// reads the transformation chain first and "who lives here" second.
const residencyStyle = {
  stroke: "currentColor",
  strokeWidth: 1,
  strokeDasharray: "2 3",
  opacity: 0.5,
};

const residentNodeId = (systemId: string, resident: { __typename: string; id: string }) =>
  `r-${systemId}-${resident.__typename}-${resident.id}`;

/**
 * Coordinate systems and their residents are the nodes; the transformations
 * between systems are the edges, labelled with what the map actually does and
 * drawn in their true stored direction (input → output). An edge whose input or
 * output falls outside the returned component (the walk is depth-bounded) is
 * dropped rather than drawn dangling.
 */
const buildGraph = (
  graph: CoordinateGraph,
): { nodes: GraphNode[]; edges: GraphEdge[]; dropped: number } => {
  const known = new Set(graph.systems.map((system) => system.id));
  let dropped = 0;

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  for (const system of graph.systems) {
    nodes.push({
      id: system.id,
      type: "coordinateSystem" as const,
      position: { x: 0, y: 0 },
      data: { system, isRoot: system.id === graph.root.id },
    });

    // Who lives in this space, as its own node hanging off it. A resident can
    // only live in one system, so the id is per (system, resident) and never
    // collides.
    for (const resident of system.residents) {
      const id = residentNodeId(system.id, resident);
      nodes.push({
        id,
        type: "resident" as const,
        position: { x: 0, y: 0 },
        data: { resident, systemId: system.id },
      });
      edges.push({
        id: `lives-in-${id}`,
        source: system.id,
        target: id,
        type: "smoothstep" as const,
        style: residencyStyle,
      });
    }
  }

  for (const transformation of graph.transformations) {
    const input = transformation.input;
    const output = transformation.output;
    // Not silent: a transformation with an endpoint missing from the walk
    // cannot be drawn, and a graph that quietly renders fewer edges than the
    // server returned is worse than one that says so.
    if (!input || !output || !known.has(input.id) || !known.has(output.id)) {
      dropped++;
      continue;
    }

    const unmappable = transformation.__typename === "UnmappableTransformation";
    const assumed = transformation.validity === PlacementValidity.Unknown;

    edges.push({
      id: transformation.id,
      source: input.id,
      target: output.id,
      type: "smoothstep" as const,
      // React Flow draws the label on the line itself, which is all a
      // transformation needs to say from across the graph. The rest — axes,
      // validity, a composite's children — is the edge table's job.
      label: describeTransformation(transformation),
      labelBgPadding: [4, 2] as [number, number],
      labelBgBorderRadius: 4,
      labelBgStyle: { fill: "var(--background)", fillOpacity: 0.85 },
      labelStyle: { fontSize: 10 },
      style: unmappable || assumed ? assumedStyle : transformationStyle,
      markerEnd: unmappable ? undefined : marker,
    });
  }

  return { nodes, edges, dropped };
};

const sizeOf = (node: GraphNode) =>
  node.type === "resident"
    ? {
        width: residentNodeWidth(node.data.resident),
        height: RESIDENT_NODE_HEIGHT,
      }
    : systemNodeSize(node.data.system);

const Legend = ({
  systems,
  residents,
  transformations,
  dropped,
}: {
  systems: number;
  residents: number;
  transformations: number;
  dropped: number;
}) => (
  <div className="flex max-w-[440px] flex-wrap items-center gap-x-3 gap-y-1 rounded-md border bg-background/80 px-2 py-1 text-[10px] text-foreground backdrop-blur">
    {(Object.keys(OCCUPANCY_DOT) as Occupancy[]).map((occupancy) => (
      <span key={occupancy} className="flex items-center gap-1">
        <span className={`h-2 w-2 rounded-full ${OCCUPANCY_DOT[occupancy]}`} />
        {OCCUPANCY_LABEL[occupancy]}
      </span>
    ))}
    <span className="flex items-center gap-1">
      <span className={`h-2 w-2 rounded-full ${RESIDENT_COLOR}`} />
      resident
    </span>
    <span className="flex items-center gap-1">
      <span className="h-0 w-4 border-t-2 border-dashed border-muted-foreground/60" />
      assumed or unmappable
    </span>
    <span className="w-full border-t pt-1 font-mono text-muted-foreground">
      {systems} systems · {residents} residents · {transformations}{" "}
      transformations
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
        layoutOptions: layout,
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

  const residents = React.useMemo(
    () =>
      graph.systems.reduce((sum, system) => sum + system.residents.length, 0),
    [graph],
  );

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
            residents={residents}
            transformations={graph.transformations.length}
            dropped={dropped}
          />
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default CoordinateGraphFlow;
