import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  DetailRunFragment,
  GraphInput,
  useRunForAssignationQuery,
} from "@/reaktion/api/graphql";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  EyeOpenIcon,
  LetterCaseToggleIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import { AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";
import { Controls } from "reactflow";
import useUndoable from "use-undoable";
import { Graph } from "../base/Graph";
import { EdgeTypes, FlowNode, NodeTypes } from "../types";
import { edges_to_flowedges, nodes_to_flownodes } from "../utils";
import { ValidationResult } from "../validation/types";
import { TrackRiverContext } from "./context";
import { LabeledShowEdge } from "./edges/LabeledShowEdge";
import { ReactiveTrackNodeWidget } from "./nodes/ReactiveWidget";
import { RekuestFilterWidget } from "./nodes/RekuestFilterWidget";
import { RekuestMapWidget } from "./nodes/RekuestMapWidget";
import { ArgTrackNodeWidget } from "./nodes/generic/ArgShowNodeWidget";
import { ReturnTrackNodeWidget } from "./nodes/generic/ReturnShowNodeWidget";
import { RunState } from "./types";
import { DetailAssignationFragment } from "@/rekuest/api/graphql";
import { withFluss } from "@jhnnsrs/fluss-next";
import { RangeTracker } from "./components/tracker/RangeTracker";

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
  assignation: DetailAssignationFragment;
  onSave?: (graph: GraphInput) => void;
};

export const TrackFlow: React.FC<Props> = ({ assignation, onSave }) => {
  console.log("THE FLOW", assignation);

  const { data, error } = withFluss(useRunForAssignationQuery)({
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
      <div ref={reactFlowWrapper} className="h-full w-full" data-disableselect>
        <div className="flex flex-grow h-full w-full relative">
          <AnimatePresence>
            <div className="absolute  top-0 left-0  w-full ml-3 mt-5 z-50">
              {data?.runForAssignation && (
                <RangeTracker run={data?.runForAssignation} />
              )}
            </div>
          </AnimatePresence>
          <Graph
            nodes={state.nodes}
            edges={state.edges}
            elementsSelectable={true}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls className="flex flex-row bg-white gap-2 rounded rounded-md overflow-hidden px-2">
              <button
                onClick={() => setShowEdgeLabels(!showEdgeLabels)}
                className={cn(
                  " hover:bg-primary",
                  showEdgeLabels ? "text-muted" : "text-gray-400",
                )}
              >
                <LetterCaseToggleIcon />{" "}
              </button>
              <button
                onClick={() => setShowNodeErrors(!showNodeErrors)}
                className={cn(
                  " hover:bg-primary",
                  showNodeErrors ? "text-muted" : "text-gray-400",
                )}
              >
                <QuestionMarkIcon />{" "}
              </button>
              <Sheet>
                <SheetTrigger
                  className={cn(
                    " hover:bg-primary",
                    "text-muted disabled:text-gray-200",
                  )}
                >
                  <EyeOpenIcon />{" "}
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Debug Screen</SheetTitle>
                    <SheetDescription></SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="h-full dark:text-white">
                    <pre>{JSON.stringify(state, null, 2)}</pre>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </Controls>
          </Graph>
        </div>
      </div>
    </TrackRiverContext.Provider>
  );
};
