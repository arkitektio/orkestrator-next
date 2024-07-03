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
  BaseGraphNodeFragment,
  FlowFragment,
  GraphInput,
} from "@/reaktion/api/graphql";
import { PortScope } from "@/rekuest/api/graphql";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  EyeOpenIcon,
  LetterCaseToggleIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import { AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";
import { Controls, OnConnectStartParams, ReactFlowInstance } from "reactflow";
import useUndoable from "use-undoable";
import { Graph } from "../base/Graph";
import { EdgeTypes, FlowNode, NodeTypes } from "../types";
import { edges_to_flowedges, nodes_to_flownodes } from "../utils";
import { ValidationResult } from "../validation/types";
import { ShowRiverContext } from "./context";
import { LabeledShowEdge } from "./edges/LabeledShowEdge";
import { ReactiveTrackNodeWidget } from "./nodes/ReactiveWidget";
import { RekuestFilterWidget } from "./nodes/RekuestFilterWidget";
import { RekuestMapWidget } from "./nodes/RekuestMapWidget";
import { ArgTrackNodeWidget } from "./nodes/generic/ArgShowNodeWidget";
import { ReturnTrackNodeWidget } from "./nodes/generic/ReturnShowNodeWidget";

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
  flow: FlowFragment;
  onSave?: (graph: GraphInput) => void;
};

export const ShowFlow: React.FC<Props> = ({ flow, onSave }) => {
  console.log("THE FLOW", flow);

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);
  const [showNodeErrors, setShowNodeErrors] = useState(true);

  const [state, setState, { redo, undo, canRedo, canUndo }] =
    useUndoable<ValidationResult>({
      nodes: nodes_to_flownodes(flow.graph?.nodes),
      edges: edges_to_flowedges(flow.graph?.edges),
      globals: flow.graph.globals || [],
      remainingErrors: [],
      solvedErrors: [],
      valid: true,
    });

  return (
    <ShowRiverContext.Provider
      value={{
        flow,
        showNodeErrors: showNodeErrors,
        state: state,
        showEdgeLabels: showEdgeLabels,
      }}
    >
      <div ref={reactFlowWrapper} className="h-full w-full" data-disableselect>
        <div className="flex flex-grow h-full w-full relative">
          <AnimatePresence>
            {state.globals.length > 0 && (
              <div className="absolute  top-0 left-0  ml-3 mt-5 z-50">
                <Card className="max-w-md">
                  <CardHeader>
                    <CardDescription>Globals </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs text-muted-foreground ">
                      {" "}
                      These are global variables that will be constants to the
                      whole workflow and are mapping to the following ports:{" "}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            )}
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
                onClick={() => undo()}
                disabled={!canUndo}
                className={cn(
                  " hover:bg-primary",
                  "text-muted disabled:text-gray-400",
                )}
              >
                <DoubleArrowLeftIcon />{" "}
              </button>
              <button
                onClick={() => redo()}
                disabled={!canRedo}
                className={cn(
                  " hover:bg-primary",
                  "text-muted disabled:text-gray-400",
                )}
              >
                <DoubleArrowRightIcon />{" "}
              </button>
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
    </ShowRiverContext.Provider>
  );
};
