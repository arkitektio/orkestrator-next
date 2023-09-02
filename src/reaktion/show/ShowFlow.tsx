import { FlowFragment } from "@/rekuest/api/graphql";
import React from "react";
import { useEdgesState, useNodesState } from "reactflow";
import { Graph } from "../base/Graph";
import { EdgeTypes, FlowEdge, FlowNode, NodeTypes } from "../types";
import { edges_to_flowedges, nodes_to_flownodes } from "../utils";
import { ShowRiverContext } from "./context";
import { LabeledShowEdge } from "./edges/LabeledShowEdge";
import { ArkitektTrackNodeWidget } from "./nodes/ArktitektShowNodeWidget";
import { ReactiveTrackNodeWidget } from "./nodes/ReactiveShowNodeWidget";
import { ArgTrackNodeWidget } from "./nodes/generic/ArgShowNodeWidget";
import { ReturnTrackNodeWidget } from "./nodes/generic/ReturnShowNodeWidget";

const nodeTypes: NodeTypes = {
  ArkitektGraphNode: ArkitektTrackNodeWidget,
  ReactiveNode: ReactiveTrackNodeWidget,
  ArgNode: ArgTrackNodeWidget,
  ReturnNode: ReturnTrackNodeWidget,
};

const edgeTypes: EdgeTypes = {
  LoggingEdge: LabeledShowEdge,
  VanillaEdge: LabeledShowEdge,
};

export type Props = {
  flow: FlowFragment;
};

export const ShowRiver: React.FC<Props> = ({ flow }) => {
  console.log(flow.graph?.nodes);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    nodes_to_flownodes(flow.graph?.nodes),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    edges_to_flowedges(flow.graph?.edges),
  );

  return (
    <ShowRiverContext.Provider
      value={{
        flow,
      }}
    >
      <Graph
        nodes={nodes as FlowNode[]}
        edges={edges as FlowEdge[]}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        elementsSelectable={true}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-right"
      />
    </ShowRiverContext.Provider>
  );
};
