import {
  DetailRunFragment,
  GraphInput,
  RunStatus,
  useRunForAssignationQuery,
} from "@/reaktion/api/graphql";
import { AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";
import { useNodesState } from "reactflow";
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
import {
  AssignationEventKind,
  DetailAssignationFragment,
} from "@/rekuest/api/graphql";
import { LiveTracker } from "./components/tracker/LiveTracker";
import { RelativeTracker } from "./components/tracker/RelativeTracker";

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
  run: DetailRunFragment;
  assignation?: DetailAssignationFragment;
  onSave?: (graph: GraphInput) => void;
};

export const TrackFlow: React.FC<Props> = ({ run, assignation, onSave }) => {
  console.log("THE FLOW", run);

  console.log;

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);
  const [showNodeErrors, setShowNodeErrors] = useState(true);

  const [runState, setRunState] = useState<RunState>({ t: 0 });
  const [live, setLive] = useState<boolean>(true);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    nodes_to_flownodes(run.flow.graph?.nodes || []) || [],
  );
  const edges = edges_to_flowedges(run.flow.graph?.edges || []);
  const globals = run.flow.graph.globals || [];

  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);

  return (
    <TrackRiverContext.Provider
      value={{
        flow: run.flow,
        runState: runState,
        selectedNode,
        setRunState: setRunState,
        run: run,
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
            nodes={nodes}
            edges={edges}
            elementsSelectable={true}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            edgeTypes={edgeTypes}
            fitView
            attributionPosition="bottom-right"
          ></Graph>
        </div>
        <AnimatePresence>
          <div className=" w-full flex-initial ">
            {run.status}
            {run?.status != RunStatus.Completed ? (
              <LiveTracker run={run} startT={run?.latestSnapshot?.t || 0} />
            ) : (
              <RangeTracker run={run} />
            )}
          </div>
        </AnimatePresence>
      </div>
    </TrackRiverContext.Provider>
  );
};
