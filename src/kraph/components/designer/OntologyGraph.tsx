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

const ontologyToNodes = (graph: GraphFragment): MyNode[] => {
  const structureNodes = graph.structureCategories.map((cat, index) => ({
    id: cat.id,
    position: {
      x: cat.positionX || 300,
      y: cat.positionY || 300,
    },
    height: cat.height || 100,
    width: cat.width || 100,
    data: cat,
    type: "structurecategory" as const,
  }));

  const genericNodes = graph.entityCategories.map((entity, index) => ({
    id: entity.id,
    position: {
      x: entity.positionX || 300,
      y: entity.positionY || 300,
    },
    height: entity.height || 100,
    width: entity.width || 100,
    data: entity,
    type: "genericcategory" as const,
  }));

  const reagentNodes = graph.reagentCategories.map((entity, index) => ({
    id: entity.id,
    position: {
      x: entity.positionX || 300,
      y: entity.positionY || 300,
    },
    height: entity.height || 100,
    width: entity.width || 100,
    data: entity,
    type: "reagentcategory" as const,
  }));

  const protocolEventCategory = graph.protocolEventCategories.map(
    (entity, index) => ({
      id: entity.id,
      position: {
        x: entity.positionX || 300,
        y: entity.positionY || 300,
      },
      height: entity.height || 100,
      width: entity.width || 100,
      data: entity,
      type: "protocoleventcategory" as const,
    }),
  );

  const naturalEventCategory = graph.naturalEventCategories.map(
    (entity, index) => ({
      id: entity.id,
      position: {
        x: entity.positionX || 300,
        y: entity.positionY || 300,
      },
      height: entity.height || 100,
      width: entity.width || 100,
      data: entity,
      type: "naturaleventcategory" as const,
    }),
  );

  const metricNode = graph.metricCategories.map((entity, index) => ({
    id: entity.id,
    position: {
      x: entity.positionX || 300,
      y: entity.positionY || 300,
    },
    height: entity.height || 100,
    width: entity.width || 100,
    data: entity,
    type: "metriccategory" as const,
  }));

  return [
    ...structureNodes,
    ...genericNodes,
    ...protocolEventCategory,
    ...naturalEventCategory,
    ...reagentNodes,
    ...metricNode,
  ];
};

const withCategoryFilter = (category: CategoryDefintion) => {
  return (cat: BaseListCategoryFragment) => {
    if (category.tagFilters && category.tagFilters.length > 0) {
      return category.tagFilters.some((tag) =>
        cat.tags.find((t) => t.value == tag),
      );
    }
    if (category.categoryFilters && category.categoryFilters.length > 0) {
      return category.categoryFilters.some((id) => id == cat.id);
    }
    return true;
  };
};

const withStructureCategoryFilter = (category: StructureCategoryDefinition) => {
  return (cat: ListStructureCategoryFragment) => {
    if (category.tagFilters && category.tagFilters.length > 0) {
      return category.tagFilters.some((tag) =>
        cat.tags.find((t) => t.value == tag),
      );
    }
    if (category.categoryFilters && category.categoryFilters.length > 0) {
      return category.categoryFilters.some((id) => id == cat.id);
    }
    if (category.identifierFilters && category.identifierFilters.length > 0) {
      return category.identifierFilters.some(
        (identifier) => identifier == cat.identifier,
      );
    }

    return true;
  };
};

const ontologyToEdges = (graph: GraphFragment) => {
  const edges: MyEdge[] = [];

  console.log("Relations", graph.relationCategories);

  graph.relationCategories.forEach((cat) => {
    const source_nodes = graph.entityCategories.filter(
      withCategoryFilter(cat.sourceDefinition),
    );
    const target_nodes = graph.entityCategories.filter(
      withCategoryFilter(cat.targetDefinition),
    );

    for (let i = 0; i < source_nodes.length; i++) {
      for (let j = 0; j < target_nodes.length; j++) {
        edges.push({
          id: `${cat.id}-${i}-${j}`,
          source: source_nodes[i].id,
          target: target_nodes[j].id,
          data: cat,
          type: "relation" as const,
          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
    }
  });

  graph.structureRelationCategories.forEach((cat) => {
    const source_nodes = graph.structureCategories.filter(
      withStructureCategoryFilter(cat.sourceDefinition),
    );

    const target_nodes = graph.structureCategories.filter(
      withStructureCategoryFilter(cat.targetDefinition),
    );

    for (let i = 0; i < source_nodes.length; i++) {
      for (let j = 0; j < target_nodes.length; j++) {
        edges.push({
          id: `${cat.id}-${i}-${j}`,
          source: source_nodes[i].id,
          target: target_nodes[j].id,
          data: cat,
          type: "structure_relation" as const,
          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
    }
  });

  graph.measurementCategories.forEach((cat) => {
    const source_nodes = graph.structureCategories.filter(
      withStructureCategoryFilter(cat.sourceDefinition),
    );
    const target_nodes = graph.entityCategories.filter(
      withCategoryFilter(cat.targetDefinition),
    );

    for (let i = 0; i < source_nodes.length; i++) {
      for (let j = 0; j < target_nodes.length; j++) {
        edges.push({
          id: `${cat.id}-${i}-${j}`,
          source: source_nodes[i].id,
          target: target_nodes[j].id,
          data: cat,
          type: "measurement" as const,
          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
    }
  });

  graph.metricCategories.forEach((cat) => {
    const source_nodes = graph.structureCategories.filter(
      (n) => n.id == cat.structureCategory.id,
    );

    for (let i = 0; i < source_nodes.length; i++) {
      for (let j = 0; j < source_nodes.length; j++) {
        edges.push({
          id: `${cat.id}-${i}-${j}`,
          target: source_nodes[i].id,
          source: cat.id,
          data: cat,
          type: "describe" as const,
          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
    }
  });

  graph.protocolEventCategories.forEach((cat) => {
    cat.sourceEntityRoles.filter(notEmpty).forEach((role) => {
      const source_nodes = graph.entityCategories.filter(
        withCategoryFilter(role.categoryDefinition),
      );

      for (let i = 0; i < source_nodes.length; i++) {
        edges.push({
          id: `${cat.id}-${i}-${role.role}`,
          source: source_nodes[i].id,
          target: cat.id,
          data: role,
          type: "entityrole" as const,

          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
    });

    cat.targetEntityRoles.forEach((role) => {
      const targetNodes = graph.entityCategories.filter(
        withCategoryFilter(role.categoryDefinition),
      );

      for (let i = 0; i < targetNodes.length; i++) {
        edges.push({
          id: `${cat.id}-${i}-${role.role}`,
          source: cat.id,
          target: targetNodes[i].id,
          data: role,
          type: "entityrole" as const,
          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
    });

    cat.sourceReagentRoles.filter(notEmpty).forEach((role) => {
      const source_nodes = graph.reagentCategories.filter(
        withCategoryFilter(role.categoryDefinition),
      );

      for (let i = 0; i < source_nodes.length; i++) {
        edges.push({
          id: `${cat.id}-${i}-${role.role}`,
          source: source_nodes[i].id,
          target: cat.id,
          data: role,
          type: "reagentrole" as const,
          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
    });

    cat.targetReagentRoles.forEach((role) => {
      const targetNodes = graph.reagentCategories.filter(
        withCategoryFilter(role.categoryDefinition),
      );

      for (let i = 0; i < targetNodes.length; i++) {
        edges.push({
          id: `${cat.id}-${i}-${role.role}`,
          source: cat.id,
          target: targetNodes[i].id,
          data: role,
          type: "reagentrole" as const,
        });
      }
    });
  });

  graph.naturalEventCategories.forEach((cat) => {
    cat.sourceEntityRoles.filter(notEmpty).forEach((role) => {
      const source_nodes = graph.entityCategories.filter(
        withCategoryFilter(role.categoryDefinition),
      );

      for (let i = 0; i < source_nodes.length; i++) {
        edges.push({
          id: `${cat.id}-${i}-${role.role}`,
          source: source_nodes[i].id,
          target: cat.id,
          data: role,
          type: "entityrole" as const,
        });
      }
    });

    cat.targetEntityRoles.forEach((role) => {
      const targetNodes = graph.entityCategories.filter(
        withCategoryFilter(role.categoryDefinition),
      );

      for (let i = 0; i < targetNodes.length; i++) {
        edges.push({
          id: `${cat.id}-${i}-${role.role}`,
          source: cat.id,
          target: targetNodes[i].id,
          data: role,
          type: "entityrole" as const,
        });
      }
    });
  });

  console.log("edges", edges);

  return [...edges];
};

const nodeTypes = {
  structurecategory: StructureCategoryNode,
  genericcategory: GenericCategoryNode,
  naturaleventcategory: NaturalEventNode,
  protocoleventcategory: ProtocolEventNode,
  reagentcategory: ReagentCategoryNode,
  metriccategory: MetricCategoryNode,
};

const edgeTypes = {
  measurement: MeasurementEdge,
  structure_relation: StructureRelationEdge,
  relation: RelationEdge,
  entityrole: EntityRoleEdge,
  describe: DescribeEdge,
  reagentrole: ReagentRoleEdge,
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

const nodeToNodeInput = (node: MyNode): GraphNodeInput | null => {
  // We only update the positions of the node the rest is not needed
  return {
    id: node.id,
    positionX: node.position.x,
    positionY: node.position.y,
    height: node.height,
    width: node.width,
  };
};

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

const radialLayout = {
  "elk.algorithm": "radial",
  "elk.radial.radius": "200",
  "elk.radial.compactionStrategy": "NONE",
  "elk.radial.wedgeToLength": "32",
  "elk.spacing.nodeNode": "50",
  "elk.direction": "RIGHT",
};

const hashGraph = (graph: GraphFragment) => {
  return JSON.stringify(graph);
};

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
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
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
