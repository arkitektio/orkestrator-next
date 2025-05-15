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
import { FlowFragment, GraphInput } from "@/reaktion/api/graphql";
import { DetailImplementationFragment } from "@/rekuest/api/graphql";
import {
  EyeOpenIcon,
  LetterCaseToggleIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import { AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";
import { Controls, useNodesState } from "reactflow";
import { Graph } from "../base/Graph";
import { EdgeTypes, NodeTypes } from "../types";
import { edges_to_flowedges, nodes_to_flownodes } from "../utils";
import { ShowRiverContext } from "./context";
import { LabeledShowEdge } from "./edges/LabeledShowEdge";
import { ReactiveTrackNodeWidget } from "./nodes/ReactiveWidget";
import { RekuestFilterWidget } from "./nodes/RekuestFilterWidget";
import { RekuestMapWidget } from "./nodes/RekuestMapWidget";
import { ArgTrackNodeWidget } from "./nodes/generic/ArgShowNodeWidget";
import { ReturnTrackNodeWidget } from "./nodes/generic/ReturnShowNodeWidget";
import { ImplementationActionButton } from "@/rekuest/buttons/ImplementationActionButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RekuestAssignation } from "@/linkers";

const nodeTypes: NodeTypes = {
  RekuestFilterActionNode: RekuestFilterWidget,
  RekuestMapActionNode: RekuestMapWidget,
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
  template?: DetailImplementationFragment;
  onSave?: (graph: GraphInput) => void;
};

export const ShowFlow: React.FC<Props> = ({ flow, template }) => {
  console.log("THE FLOW", flow);

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);
  const [showNodeErrors, setShowNodeErrors] = useState(true);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    nodes_to_flownodes(flow.graph?.nodes || []) || [],
  );
  const edges = edges_to_flowedges(flow.graph?.edges || []);
  const globals = flow.graph.globals || [];

  const navigate = useNavigate();

  return (
    <ShowRiverContext.Provider
      value={{
        flow,
        template: template,
        showNodeErrors: showNodeErrors,
        showEdgeLabels: showEdgeLabels,
      }}
    >
      <div ref={reactFlowWrapper} className="h-full w-full" data-disableselect>
        <div className="flex flex-grow h-full w-full relative">
          <AnimatePresence>
            {globals.length > 0 && (
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
          <AnimatePresence>
            {template && (
              <div className="absolute  bottom-0 right-0  ml-3 mt-5 z-50">
                <ImplementationActionButton
                  id={template.id}
                  onAssign={(e) =>
                    navigate(RekuestAssignation.linkBuilder(e.id))
                  }
                >
                  <Button> Run </Button>
                </ImplementationActionButton>
              </div>
            )}
          </AnimatePresence>
          <Graph
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            elementsSelectable={true}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            nodesConnectable={false}
            nodesDraggable={false}
            nodesFocusable={false}
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
                    <pre>{JSON.stringify(nodes, null, 2)}</pre>
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
