import { Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";

import {
  BaseListCategoryFragment,
  CategoryDefintion,
  GraphFragment,
  GraphNodeInput,
  ListStructureCategoryFragment,
  StructureCategoryDefinition,
  useUpdateGraphMutation,
} from "@/kraph/api/graphql";
import {
  Panel,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";
import { useKraphUpload } from "@/datalayer/hooks/useKraphUpload";
import { notEmpty } from "@/lib/utils";
import {
  Connection,
  MarkerType,
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ELK from "elkjs/lib/elk.bundled.js";
import React, { useState } from "react";
import { ClickContextual } from "./contextuals/ClickContextuals";
import { ConnectContextual } from "./contextuals/ConnectContextual";
import DescribeEdge from "./edges/DescribeEdge";
import EntityRoleEdge from "./edges/EntityRoleEdge";
import MeasurementEdge from "./edges/MeasurementEdge";
import ReagentRoleEdge from "./edges/ReagentRoleEdge";
import RelationEdge from "./edges/RelationEdge";
import StructureRelationEdge from "./edges/StructureRelationEdge";
import "./index.css";
import GenericCategoryNode from "./nodes/EntityCategoryNode";
import MetricCategoryNode from "./nodes/MetricCategoryNode";
import NaturalEventNode from "./nodes/NaturalEventCategoryNode";
import ProtocolEventNode from "./nodes/ProtocolEventCategoryNode";
import ReagentCategoryNode from "./nodes/ReagentCategoryNode";
import StructureCategoryNode from "./nodes/StructureCategoryNode";
import { OntologyGraphProvider } from "./OntologyGraphProvider";
import {
  ClickContextualParams,
  ConnectContextualParams,
  MyEdge,
  MyNode,
  StagingEdgeParams,
  StagingNodeParams,
} from "./types";
import { KraphGraph } from "@/linkers";
import { toPng } from "html-to-image";
import { calculateMidpoint, discoLayout, EDGE_TYPES, forceLayout, hashGraph, layeredLayout, NODE_TYPES, ontologyToEdges, ontologyToNodes, radialLayout, stressLayout, treeLayout } from "./utils";

export const OntologyGraph = ({ graph }: { graph: GraphFragment }) => {
  const [update] = useUpdateGraphMutation();
  const uploadFile = useKraphUpload();

  const reactFlowWrapper = React.useRef<HTMLDivElement | null>(null);

  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance<MyNode, MyEdge> | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<MyNode>(
    ontologyToNodes(graph),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<MyEdge>(
    ontologyToEdges(graph),
  );

  const [showClickContextual, setShowClickContextual] = useState<
    undefined | ClickContextualParams | ConnectContextualParams
  >();

  React.useEffect(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
      setNodes(ontologyToNodes(graph));
      setEdges(ontologyToEdges(graph));
    }
  }, [reactFlowInstance, hashGraph(graph)]);

  const captureAndUploadScreenshot = async (): Promise<string | null> => {
    if (!reactFlowWrapper.current) return null;

    try {
      const imageWidth = 800;
      const imageHeight = 800;
      // Dynamically import html2canvas to avoid SSR issues
      const nodesBounds = getNodesBounds(nodes);
      const viewport = getViewportForBounds(
        nodesBounds,
        imageWidth,
        imageHeight,
        0.5,
        2,
        2,
      );

      const pngPromise = toPng(
        document.querySelector(".react-flow__viewport") as HTMLElement,
        {
          backgroundColor: "transparent",
          width: imageWidth,
          height: imageHeight,
          style: {
            width: imageWidth,
            height: imageHeight,
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          },
        },
      );

      const dataUrl = await pngPromise;

      // Convert data URL to Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Create a File object from the Blob
      const file = new File([blob], `graph-screenshot${graph.id}.png`, {
        type: "image/png",
      });

      // Upload the file using your existing upload function
      return await uploadFile(file);
    } catch (error) {
      console.error("Failed to capture screenshot:", error);
      return null;
    }
  };

  const save = async () => {
    const nodes = reactFlowInstance?.getNodes() as MyNode[];

    const nodeInputs = nodes
      .map(nodeToNodeInput)
      .filter((n) => n != null) as GraphNodeInput[];

    console.log("Saving graph and capturing screenshot...");

    // Capture and upload screenshot
    const imageId = await captureAndUploadScreenshot();

    if (imageId) {
      console.log("Screenshot captured and uploaded successfully");
    } else {
      console.log("Screenshot capture skipped or failed");
    }

    const updateInput = {
      id: graph.id,
      nodes: nodeInputs,
      ...(imageId && { image: imageId }),
    };

    update({
      variables: {
        input: updateInput,
      },
    });

    console.log("Graph saved successfully");
  };

  const onPaneClick = (event: React.MouseEvent) => {
    console.log("onPaneClick", event);
    if (!reactFlowWrapper.current) {
      return;
    }

    if (showClickContextual) {
      console.log("Click Hide Event");
      setShowClickContextual(undefined);
      return;
    }

    const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();
    console.log("reactFlowBounds", reactFlowBounds);
    if (reactFlowInstance && reactFlowBounds) {
      let position = {
        x: event.clientX - (reactFlowBounds?.left || 0),
        y: event.clientY - (reactFlowBounds?.top || 0),
      };

      console.log("onPaneClick", position);

      setShowClickContextual({
        type: "click",
        event: event,
        position: position,
      });

      console.log("showClickContextual", showClickContextual);
    }
  };

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
        return { ...child, position: { x: node.x, y: node.y } };
      });

      setNodes(newNodes);
    });
  };

  const nodelayout = (layout: { [key: string]: string }, root: string) => {
    const elk = new ELK();
    const the_nodes = nodes;

    // Filter out self-referencing edges and duplicate edges to prevent cycles
    const filteredEdges = edges.filter((edge, index, arr) => {
      // Remove self-referencing edges
      if (edge.source === edge.target) {
        return false;
      }

      // Remove duplicate edges (same source and target)
      const firstIndex = arr.findIndex(
        (e) => e.source === edge.source && e.target === edge.target,
      );
      return index === firstIndex;
    });

    const graph = {
      id: "root",
      layoutOptions: {
        ...layout,
        "elk.radial.rootNode": root, // Specify the root node for radial layout
      },
      children: the_nodes.map((node) => ({
        id: node.id,
        x: node.position.x,
        y: node.position.y,
        width: node.width,
        height: node.height,
      })),
      edges: filteredEdges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };

    elk
      .layout(graph)
      .then(({ children }) => {
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
      })
      .catch((error) => {
        console.error("ELK Layout failed:", error);
        console.error(
          "This might be due to circular dependencies or self-referencing nodes",
        );
        // Fallback: Just arrange nodes in a simple circle manually
        const centerX = 400;
        const centerY = 300;
        const radius = 200;
        const angleStep = (2 * Math.PI) / the_nodes.length;

        const fallbackNodes = the_nodes.map((node, index) => {
          const angle = index * angleStep;
          return {
            ...node,
            position: {
              x: centerX + radius * Math.cos(angle),
              y: centerY + radius * Math.sin(angle),
            },
          };
        });

        setNodes(fallbackNodes);
      });
  };

  const onConnect = (connection: Connection) => {
    console.log("onConnect", connection);
    if (!reactFlowInstance) {
      return;
    }

    // Once we have a connection we resset the

    const nodes = (reactFlowInstance?.getNodes() as MyNode[]) || [];

    let leftNode = nodes.find((n) => n.id == connection.source);
    let rightNode = nodes.find((n) => n.id == connection.target);

    if (!leftNode || !rightNode) {
      return;
    }

    console.log(leftNode.position);
    console.log(rightNode.position);
    console.log(leftNode.position);
    console.log(rightNode.position);

    // Calcluate to Screen Position
    let screenposition = reactFlowInstance.flowToScreenPosition(
      calculateMidpoint(leftNode.position, rightNode.position),
    );

    const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();

    let position = {
      x: screenposition.x - (reactFlowBounds?.left || 0),
      y: screenposition.y - (reactFlowBounds?.top || 0),
    };

    setShowClickContextual({
      type: "connect",
      leftNode: leftNode,
      rightNode: rightNode,
      connection: connection,
      position: position,
    });
  };

  const addStagingNode = (params: StagingNodeParams) => {
    if (!reactFlowInstance) {
      return;
    }

    let position = reactFlowInstance.screenToFlowPosition({
      x: params.event.clientX,
      y: params.event.clientY,
    });

    setNodes((prevNodes) => [
      ...prevNodes.filter((id) => id.id !== params.ageName),
      {
        data: params.data,
        position,
        id: params.ageName,
        type: params.type as MyNode["type"],
        height: 100,
        width: 200,
      } as MyNode,
    ]);
    setShowClickContextual(undefined);
  };

  const addStagingEdge = (params: StagingEdgeParams) => {
    if (!reactFlowInstance) {
      return;
    }

    setEdges((prevEdges) => [
      ...prevEdges.filter((id) => id.id !== params.ageName),
      {
        data: params.data,
        source: params.source,
        target: params.target,
        id: params.ageName,
        type: params.type as MyEdge["type"],
      } as MyEdge,
    ]);
    setShowClickContextual(undefined);
  };

  return (
    <OntologyGraphProvider
      graph={graph}
      addStagingEdge={addStagingEdge}
      addStagingNode={addStagingNode}
    >
      <div
        ref={reactFlowWrapper}
        style={{ width: "100%", height: "100%" }}
        className="relative"
      >
        <ReactFlow<MyNode, MyEdge>
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onPaneClick={onPaneClick}
          onConnect={onConnect}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          onInit={(r) => setReactFlowInstance(r)}
          fitView
          proOptions={{ hideAttribution: true }}
        />
        {showClickContextual && showClickContextual.type == "click" && (
          <ClickContextual
            params={showClickContextual}
            graph={graph}
            addStagingNode={addStagingNode}
            onCancel={() => setShowClickContextual(undefined)}
          />
        )}
        {showClickContextual && showClickContextual.type == "connect" && (
          <ConnectContextual
            params={showClickContextual}
            graph={graph}
            addStagingEdge={addStagingEdge}
            onCancel={() => setShowClickContextual(undefined)}
          />
        )}
        <div className="absolute top-0 right-0 p-2">
          <Button onClick={save} variant={"outline"}>
            Save
          </Button>
        </div>
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
          <Button
            onClick={() => {
              const rootNode = nodes.at(0)?.id;
              if (rootNode) {
                nodelayout(radialLayout, rootNode);
              }
            }}
            variant={"outline"}
          >
            Circle
          </Button>

          <KraphGraph.DetailLink
            object={graph.id}
            subroute={"reagentcategories"}
            className="text-sm"
          >
            Reagent Categories
          </KraphGraph.DetailLink>
        </div>
      </div>
    </OntologyGraphProvider>
  );
};

export default OntologyGraph; // --- IGNORE ---
