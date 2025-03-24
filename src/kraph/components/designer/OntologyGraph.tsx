import { OntologyFragment } from "@/kraph/api/graphql";
import {
  Connection,
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useState } from "react";
import { ClickContextual } from "./contextuals/ClickContextuals";
import { ConnectContextual } from "./contextuals/ConnectContextual";
import MeasurementEdge from "./edges/MeasurementEdge";
import "./index.css";
import GenericCategoryNode from "./nodes/GenericCategoryNode";
import StagingGenericNode from "./nodes/StagingGenericNode";
import StagingStructureNode from "./nodes/StagingStructureNode";
import StructureCategoryNode from "./nodes/StructureCategoryNode";
import {
  ClickContextualParams,
  ConnectContextualParams,
  MyEdge,
  MyNode,
  StagingEdgeParams,
  StagingNodeParams,
} from "./types";
import RelationEdge from "./edges/RelationEdge";
import StagingRelationEdge from "./edges/StagingRelationEdge";
import StagingMeasurementEdge from "./edges/StagingMeasurementEdge";

const ontologyToNodes = (ontology: OntologyFragment): MyNode[] => {
  const structureNodes = ontology.structureCategories.map((cat, index) => ({
    id: cat.id,
    position: {
      x:
        300 +
        Math.cos(
          ((2 * Math.PI) / ontology.structureCategories.length) * index,
        ) *
          200,
      y:
        300 +
        Math.sin(
          ((2 * Math.PI) / ontology.structureCategories.length) * index,
        ) *
          200,
    },
    data: cat,
    type: "structurecategory" as const,
  }));

  const genericNodes = ontology.genericCategories.map((entity, index) => ({
    id: entity.id,
    position: {
      x:
        300 +
        Math.cos(((2 * Math.PI) / ontology.genericCategories.length) * index) *
          200,
      y:
        300 +
        Math.sin(((2 * Math.PI) / ontology.genericCategories.length) * index) *
          200,
    },
    data: entity,
    type: "genericcategory" as const,
  }));

  return [...structureNodes, ...genericNodes];
};

const ontologyToEdges = (ontology: OntologyFragment) => {
  const edges = ontology.measurementCategories.flatMap((cat) => ({
    id: cat.id,
    source: cat.left?.id || "start",
    target: cat.right?.id || "end",
    data: cat,
    type: "measurement" as const,
  }));

  return edges;
};

const nodeTypes = {
  structurecategory: StructureCategoryNode,
  genericcategory: GenericCategoryNode,
  stagingstructure: StagingStructureNode,
  staginggeneric: StagingGenericNode,
};

const edgeTypes = {
  measurement: MeasurementEdge,
  stagingrelation: StagingRelationEdge,
  stagingmeasurement: StagingMeasurementEdge,
  relation: RelationEdge,
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

export default ({ ontology }: { ontology: OntologyFragment }) => {
  const reactFlowWrapper = React.useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<MyNode>(
    ontologyToNodes(ontology),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<MyEdge>(
    ontologyToEdges(ontology),
  );

  const [showClickContextual, setShowClickContextual] = useState<
    undefined | ClickContextualParams | ConnectContextualParams
  >();

  React.useEffect(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
    }
  }, [reactFlowInstance]);

  const save = () => {
    console.log("Save");
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
      ...prevNodes,
      {
        data: params.data,
        position,
        id: "staging-" + Date.now(),
        type: params.type as MyNode["type"],
      } as MyNode,
    ]);
    setShowClickContextual(undefined);
  };

  const addStagingEdge = (params: StagingEdgeParams) => {
    if (!reactFlowInstance) {
      return;
    }

    setEdges((prevEdges) => [
      ...prevEdges,
      {
        data: params.data,
        source: params.source,
        target: params.target,
        id: "staging-" + Date.now(),
        type: params.type as MyEdge["type"],
      } as MyEdge,
    ]);
    setShowClickContextual(undefined);
  };

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: "100%", height: "100%" }}
      className="relative"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={onPaneClick}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={setReactFlowInstance}
        fitView
      />
      {showClickContextual && showClickContextual.type == "click" && (
        <ClickContextual
          params={showClickContextual}
          ontology={ontology}
          addStagingNode={addStagingNode}
          onCancel={() => setShowClickContextual(undefined)}
        />
      )}
      {showClickContextual && showClickContextual.type == "connect" && (
        <ConnectContextual
          params={showClickContextual}
          ontology={ontology}
          addStagingEdge={addStagingEdge}
          onCancel={() => setShowClickContextual(undefined)}
        />
      )}
    </div>
  );
};
