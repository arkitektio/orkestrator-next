import { GraphInput, useRunForAssignationQuery } from "@/reaktion/api/graphql";
import { AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";
import { Graph } from "../base/Graph";
import { EdgeTypes, FlowNode, NodeTypes } from "../types";
import { edges_to_flowedges, nodes_to_flownodes } from "../utils";
import { RangeTracker } from "./components/tracker/RangeTracker";
import { TrackRiverContext } from "./context";
import { LabeledShowEdge } from "./edges/LabeledShowEdge";
import { ReactiveTrackNodeWidget } from "./nodes/ReactiveWidget";
import { RekuestFilterWidget } from "./nodes/RekuestFilterWidget";
import { RekuestMapWidget } from "./nodes/RekuestMapWidget";
import { ArgTrackNodeWidget } from "./nodes/generic/ArgShowNodeWidget";
import { ReturnTrackNodeWidget } from "./nodes/generic/ReturnShowNodeWidget";
import { RunState } from "./types";

const nodeTypes: NodeTypes = {
  RekuestFilterNode: RekuestFilterWidget,
  RekuestMapNode: RekuestMapWidget,
  ReactiveNode: ReactiveTrackNodeWidget,
  ArgNode: ArgTrackNodeWidget,
  ReturnNode: ReturnTrackNodeWidget,
};

const edgeTypes: EdgeTypes = {
  VanillaEdge: LabeledShowEdge,
  LoggingEdge: LabeledShowEdge,
};

export type Props = {
  assignation: { id: string };
  onSave?: (graph: GraphInput) => void;
};

export const TrackFlow: React.FC<Props> = ({ assignation, onSave }) => {
  console.log("THE FLOW", assignation);

  const { data, error } = useRunForAssignationQuery({
    variables: {
      id: assignation.id,
    },
  });

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);
  const [showNodeErrors, setShowNodeErrors] = useState(true);

  const [runState, setRunState] = useState<RunState>({ t: 0 });
  const [live, setLive] = useState<boolean>(true);

  const state = {
    nodes: nodes_to_flownodes(data?.runForAssignation?.flow.graph?.nodes || []),
    edges: edges_to_flowedges(data?.runForAssignation?.flow.graph?.edges || []),
    globals: data?.runForAssignation?.flow.graph.globals || [],
    remainingErrors: [],
    solvedErrors: [],
    valid: true,
  };

  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);

  return (
    <TrackRiverContext.Provider
      value={{
        flow: data?.runForAssignation?.flow,
        runState: runState,
        selectedNode,
        setRunState: setRunState,
        run: data?.runForAssignation,
        live,
        setLive,
      }}
    >
      <div
        ref={reactFlowWrapper}
        className="h-full w-full flex flex-col"
        data-disableselect
      >
        <div className="flex flex-grow h-full w-full">
          <Graph
            nodes={state.nodes}
            edges={state.edges}
            elementsSelectable={true}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            attributionPosition="bottom-right"
          ></Graph>
        </div>
        <AnimatePresence>
          <div className=" w-full flex-initial ">
            {data?.runForAssignation && (
              <RangeTracker run={data?.runForAssignation} />
            )}
          </div>
        </AnimatePresence>
      </div>
    </TrackRiverContext.Provider>
  );
};
