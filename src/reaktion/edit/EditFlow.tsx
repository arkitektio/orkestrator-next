import React from "react";
import { EdgeTypes, useEdgesState, useNodesState } from "reactflow";
import { FlowFragment } from "../api/graphql";
import { Graph } from "../base/Graph";
import { EditRiverContext } from "./context";
import { ArkitektTrackNodeWidget } from "./nodes/ArkitektTrackNodeWidget";
import { ReactiveTrackNodeWidget } from "./nodes/ReactiveTrackNodeWidget";
import { ArgTrackNodeWidget } from "./nodes/generic/ArgShowNodeWidget";
import { ReturnTrackNodeWidget } from "./nodes/generic/ReturnShowNodeWidget";
import { LabeledShowEdge } from "./edges/LabeledShowEdge";
import { edges_to_flowedges, nodes_to_flownodes } from "../utils";
import { ArkitektNodeData, NodeTypes } from "../types";
import { ConstantShowkNodeWidget } from "./nodes/generic/ConstantsShowNodeWidget";

const nodeTypes: NodeTypes = {
  ArkitektNode: ArkitektTrackNodeWidget,
  ReactiveNode: ReactiveTrackNodeWidget,
  KwargNode: ConstantShowkNodeWidget,
  ArgNode: ArgTrackNodeWidget,
  ReturnNode: ReturnTrackNodeWidget,
};

const edgeTypes: EdgeTypes = {
  LabeledEdge: LabeledShowEdge,
};

export type Props = {
  flow: FlowFragment;
};

export const EditFlow: React.FC<Props> = ({ flow }) => {
  console.log(flow.graph?.nodes);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    nodes_to_flownodes(flow.graph?.nodes)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    edges_to_flowedges(flow.graph?.edges)
  );

  const updateNodeData = (data: Partial<ArkitektNodeData>, id: string) => {
    console.log("updateNodeData", data, id);
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          n.data = { ...n.data, ...data };
          console.log("found node", n);
          return n;
        }
        return n;
      })
    );
  };

  return (
    <EditRiverContext.Provider
      value={{
        flow,
        updateData: updateNodeData,
      }}
    >
      <Graph
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        elementsSelectable={true}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-right"
      />
    </EditRiverContext.Provider>
  );
};
