import { Button } from "@/components/ui/button";
import { OntologyEdgeInput, OntologyEdgeKind, OntologyFragment, OntologyNodeInput, OntologyNodeKind, useUpdateOntologyMutation } from "@/kraph/api/graphql";
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
import RelationEdge from "./edges/RelationEdge";
import StagingMeasurementEdge from "./edges/StagingMeasurementEdge";
import StagingRelationEdge from "./edges/StagingRelationEdge";
import "./index.css";
import GenericCategoryNode from "./nodes/GenericCategoryNode";
import StagingGenericNode from "./nodes/StagingGenericNode";
import StagingStructureNode from "./nodes/StagingStructureNode";
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

const ontologyToNodes = (ontology: OntologyFragment): MyNode[] => {
  const structureNodes = ontology.structureCategories.map((cat, index) => ({
    id: cat.ageName,
    position: {
      x:
        cat.positionX ||
        300 ,
      y:
        cat.positionY ||
        300,
    },
    height: cat.height || 100,
    width: cat.width || 100,
    data: cat,
    type: "structurecategory" as const,
  }));

  const genericNodes = ontology.genericCategories.map((entity, index) => ({
    id: entity.ageName,
    position: {
      x:
        entity.positionX ||
        300 ,
      y:
      entity.positionY ||
        300,
    },
    height: entity.height || 100,
    width: entity.width || 100,
    data: entity,
    type: "genericcategory" as const,
  }));

  return [...structureNodes, ...genericNodes];
};

const ontologyToEdges = (ontology: OntologyFragment) => {
  const edges = ontology.measurementCategories.map((cat) => ({
    id: cat.ageName,
    source: cat.left.ageName || "start",
    target: cat.right.ageName || "end",
    data: cat,
    type: "measurement" as const,
    
  }));

  const relationEdges = ontology.relationCategories.map((cat) => ({
    id: cat.ageName,
    source: cat.left.ageName || "start",
    target: cat.right.ageName || "end",
    data: cat,
    type: "relation" as const,
  }));

  return [...edges, ...relationEdges];
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


const nodeToNodeInput = (node: MyNode): OntologyNodeInput => {
  if (node.type == "structurecategory") {
    if (!node.data.identifier) {
      throw new Error("Identifier is required");
    }
    return {
      kind: OntologyNodeKind.Structure,
      ageName: node.id,
      description: node.data.description,
      identifier: node.data.identifier,
      label: node.data.label,
      name: node.data.label,
      positionX: node.position.x,
      positionY: node.position.y,
      height: node.height,
      width: node.width,
    }
  }

  if (node.type == "genericcategory") {
    return {
      kind: OntologyNodeKind.Entity,
      ageName: node.id,
      description: node.data.description,
      label: node.data.label,
      name: node.data.label,
      positionX: node.position.x,
      positionY: node.position.y,
      height: node.height,
      width: node.width,
    }
  }

  if (node.type == "stagingstructure") {
    if (!node.data.identifier) {
      throw new Error("Identifier is required");
    }
    return {
      kind: OntologyNodeKind.Structure,
      ageName: node.id,
      description: node.data.description,
      identifier: node.data.identifier,
      label: node.data.identifier,
      name: node.data.identifier,
      positionX: node.position.x,
      positionY: node.position.y,
      height: node.height,
      width: node.width,
    }
  }

  if (node.type == "staginggeneric") {
    return {
      kind: OntologyNodeKind.Entity,
      ageName: node.id,
      description: node.data.description,
      label: node.data.label,
      name: node.data.label,
      positionX: node.position.x,
      positionY: node.position.y,
      height: node.height,
      width: node.width,
    }
  }

  else {
    throw new Error("Unknown Node Type");
  }
}

export const edgeToEdgeInput = (edge: MyEdge): OntologyEdgeInput => {

  if (edge.type == "measurement") {
    return {
      kind: OntologyEdgeKind.Measurement,
      ageName: edge.id,
      description: edge.data?.description,
      measurementKind: edge.data?.metricKind,
      source: edge.source,
      target: edge.target,
      name: edge.id,
    }
  }

  if (edge.type == "relation") {
    return {
      kind: OntologyEdgeKind.Relation,
      ageName: edge.id,
      description: edge.data?.description,
      source: edge.source,
      target: edge.target,
      name: edge.id,
    }
  }

  if (edge.type == "stagingmeasurement") {
    return {
      kind: OntologyEdgeKind.Measurement,
      ageName: edge.id,
      description: edge.data?.description,
      measurementKind: edge.data?.kind,
      source: edge.source,
      target: edge.target,
      name: edge.id,
    }
  }

  if (edge.type == "stagingrelation") {
    return {
      kind: OntologyEdgeKind.Relation,
      ageName: edge.id,
      description: edge.data?.description,
      source: edge.source,
      target: edge.target,
      name: edge.id,
    }
  }

  else {
    throw new Error("Unknown Edge Type");
  }
}


export default ({ ontology }: { ontology: OntologyFragment }) => {

  const [update] = useUpdateOntologyMutation();



  const reactFlowWrapper = React.useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance<MyNode, MyEdge> | null>(null);

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

    const nodes = reactFlowInstance?.getNodes() as MyNode[];
    const edges = reactFlowInstance?.getEdges() as MyEdge[];


    const nodeInputs = nodes.map(nodeToNodeInput)
    const edgeInputs = edges.map(edgeToEdgeInput)

    update({
      variables: {
        input: {
          id: ontology.id,
          nodes: nodeInputs,
          edges: edgeInputs,
        }
      }
    })



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
      ...prevNodes.filter(id => id.id !== params.ageName),
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
      ...prevEdges.filter(id => id.id !== params.ageName),
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
    <OntologyGraphProvider ontology={ontology} addStagingEdge={addStagingEdge} addStagingNode={addStagingNode}>
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
      <div className="absolute top-0 right-0 p-2">
        <Button onClick={save}>Save</Button>
      </div>
    </div>
    </OntologyGraphProvider>
  );
};
