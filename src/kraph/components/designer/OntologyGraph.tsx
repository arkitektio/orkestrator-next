import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Node,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "reactflow";
import StructureCategoryNode from "./nodes/StructureCategoryNode";
import GenericCategoryNode from "./nodes/GenericCategoryNode";
import MeasurementEdge from "./edges/MeasurementEdge";
import {
  ListGenericCategoryFragment,
  ListStructureCategoryFragment,
  ListStructureCategoryFragmentDoc,
  OntologyFragment,
} from "@/kraph/api/graphql";
import { ClickContextualParams, NodeData, StagingNodeParams } from "./types";
import { ClickContextual } from "./contextuals/ClickContextuals";
import StagingStructureNode from "./nodes/StagingStructureNode";
import StagingGenericNode from "./nodes/StagingGenericNode";
import "./index.css";

const ontologyToNodes = (ontology: OntologyFragment) => {
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
    type: "structurecategory",
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
    type: "genericcategory",
  }));

  return [...structureNodes, ...genericNodes];
};

const ontologyToEdges = (ontology: OntologyFragment) => {
  const edges = ontology.measurementCategories.flatMap((cat) => ({
    id: cat.id,
    source: cat.left?.id || "start",
    target: cat.right?.id || "end",
    data: cat,
    type: "measurementcategory",
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
  measurementcategory: MeasurementEdge,
};

export default ({ ontology }: { ontology: OntologyFragment }) => {
  const reactFlowWrapper = React.useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(
    ontologyToNodes(ontology),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    ontologyToEdges(ontology),
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const [showClickContextual, setShowClickContextual] = useState<
    undefined | ClickContextualParams
  >();

  React.useEffect(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
    }
  }, [reactFlowInstance]);

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
        event: event,
        position: position,
      });

      console.log("showClickContextual", showClickContextual);
    }
  };

  const addStagingNode = (params: StagingNodeParams) => {
    if (!reactFlowWrapper.current) {
      return;
    }
    if (!reactFlowInstance) {
      return;
    }
    const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();

    let position = reactFlowInstance.project({
      x: params.event.clientX - (reactFlowBounds?.left || 0),
      y: params.event.clientY - (reactFlowBounds?.top || 0),
    });

    setNodes((prevNodes) => [
      ...prevNodes,
      {
        data: params.data,
        position,
        id: "staging-" + Date.now(),
        type: params.type,
      },
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
      {showClickContextual && (
        <ClickContextual
          params={showClickContextual}
          ontology={ontology}
          addStagingNode={addStagingNode}
        />
      )}
    </div>
  );
};
