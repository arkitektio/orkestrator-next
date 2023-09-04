import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SMART_MODEL_DROP_TYPE } from "@/constants";
import {
  ConstantNodeDocument,
  ConstantNodeQuery,
  FlowFragment,
  GlobalArg,
  GraphEdgeKind,
  GraphInput,
  GraphNodeFragment,
  GraphNodeKind,
  PortFragment,
  ReactiveImplementation,
  ReactiveTemplateDocument,
  ReactiveTemplateQuery,
} from "@/rekuest/api/graphql";
import { useRekuest } from "@jhnnsrs/rekuest-next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import {
  Connection,
  ReactFlowInstance,
  XYPosition,
  useEdgesState,
  applyEdgeChanges,
  applyNodeChanges,
  useNodesState,
  EdgeChange,
  NodeChange,
  Controls,
} from "reactflow";
import { Graph } from "../base/Graph";
import {
  ArkitektNodeData,
  EdgeTypes,
  FlowEdge,
  FlowNode,
  FlowNodeData,
  NodeData,
  NodeTypes,
} from "../types";
import {
  arkitektNodeToFlowNode,
  edges_to_flowedges,
  flowEdgeToInput,
  flowNodeToInput,
  listPortToSingle,
  nodeIdBuilder,
  nodes_to_flownodes,
  reactiveTemplateToFlowNode,
} from "../utils";
import { EditRiverContext } from "./context";
import { LabeledShowEdge } from "./edges/LabeledShowEdge";
import { ArkitektTrackNodeWidget } from "./nodes/ArkitektWidget";
import { ReactiveTrackNodeWidget } from "./nodes/ReactiveWidget";
import { ArgTrackNodeWidget } from "./nodes/generic/ArgShowNodeWidget";
import { ReturnTrackNodeWidget } from "./nodes/generic/ReturnShowNodeWidget";
import {
  FlowState,
  SolvedError,
  ValidationError,
  ValidationResult,
} from "../validation/types";
import { validateState } from "../validation/validate";
import { integrate } from "../validation/integrate";
import useUndoable, { MutationBehavior } from "use-undoable";
import { RemainingErrorRender, SolvedErrorRender } from "./ErrorRender";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  LetterCaseToggleIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { isValid, set } from "date-fns";

const nodeTypes: NodeTypes = {
  ArkitektGraphNode: ArkitektTrackNodeWidget,
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

export const EditFlow: React.FC<Props> = ({ flow, onSave }) => {
  const { client: arkitektapi } = useRekuest();
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const [state, setState, { redo, undo, canRedo, canUndo }] =
    useUndoable<ValidationResult>({
      nodes: nodes_to_flownodes(flow.graph?.nodes),
      edges: edges_to_flowedges(flow.graph?.edges),
      globals: [],
      remainingErrors: [],
      solvedErrors: [],
      valid: true,
    });

  const triggerNodepdate = useCallback(
    (
      v: FlowNode[],
      mutation?: MutationBehavior | undefined,
      ignoreAction?: boolean | undefined,
    ) => {
      // To prevent a mismatch of state updates,
      // we'll use the value passed into this
      // function instead of the state directly.
      setState(
        (e) => ({
          ...e,
          nodes: v,
        }),
        mutation,
        ignoreAction,
      );
    },
    [setState],
  );

  const triggerEdgeUpdate = useCallback(
    (
      v: FlowEdge[],
      mutation?: MutationBehavior | undefined,
      ignoreAction?: boolean | undefined,
    ) => {
      // To prevent a mismatch of state updates,
      // we'll use the value passed into this
      // function instead of the state directly.
      setState(
        (e) => ({
          ...e,
          edges: v,
        }),
        mutation,
        ignoreAction,
      );
    },
    [setState],
  );

  // We declare these callbacks as React Flow suggests,
  // but we don't set the state directly. Instead, we pass
  // it to the triggerUpdate function so that it alone can
  // handle the state updates.

  useEffect(() => {
    const keyUpListener = (event: KeyboardEvent) => {
      console.log("keyUpListener", event);
      if (event.key == "z" && event.ctrlKey) {
        undo();
      }
      if (event.key == "y" && event.ctrlKey) {
        redo();
      }
    };

    document.addEventListener("keyup", keyUpListener);

    return () => {
      document.removeEventListener("keyup", keyUpListener);
    };
  }, [undo, redo]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (
        changes.length == 1 &&
        (changes[0].type == "position" || changes[0].type == "dimensions")
      ) {
        triggerNodepdate(
          applyNodeChanges(changes, state.nodes) as FlowNode[],
          undefined,
          true,
        );
      }
      triggerNodepdate(
        applyNodeChanges(changes, state.nodes) as FlowNode[],
        undefined,
        false,
      );
    },
    [triggerNodepdate, state.nodes],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      triggerEdgeUpdate(applyEdgeChanges(changes, state.edges) as FlowEdge[]);
    },
    [triggerEdgeUpdate, state.edges],
  );

  const updateNodeData = (data: Partial<ArkitektNodeData>, id: string) => {
    setState((state) =>
      validateState({
        nodes: state.nodes.map((n) => {
          if (n.id === id) {
            n.data = { ...n.data, ...data };
            console.log("found node", n);
            return n;
          }
          return n;
        }),
        edges: state.edges,
        globals: [],
      }),
    );
  };

  const save = () => {
    const nodes = (reactFlowInstance?.getNodes() as FlowNode[]) || [];
    const edges = (reactFlowInstance?.getEdges() as FlowEdge[]) || [];

    const validated = validateState({
      nodes: nodes,
      edges: edges,
      globals: [],
    });

    if (validated.valid) {
      const graph: GraphInput = {
        nodes: validated.nodes.map((n) => flowNodeToInput(n)),
        edges: validated.edges.map((e) => flowEdgeToInput(e)),
        globals: [],
      };
      console.log("Saving", graph);
      onSave && onSave(graph);
    } else {
      console.log("not valid");
    }
  };

  const addNode = (node: FlowNode) => {
    setState((e) => ({ ...e, nodes: [...e.nodes, node] }));
  };

  const validate = (newState?: Partial<FlowState> | undefined) => {
    const nodes = (reactFlowInstance?.getNodes() as FlowNode[]) || [];
    const edges = (reactFlowInstance?.getEdges() as FlowEdge[]) || [];

    if (!newState) {
      newState = { nodes: nodes, edges: edges, globals: [] };
    } else {
      newState = {
        nodes: newState.nodes || nodes,
        edges: newState.edges || edges,
        globals: newState.globals || [],
      };
    }

    console.log(newState);
    const validated = validateState(newState as FlowState);

    console.log(validated);

    setState(validated);
  };

  const onConnect = (connection: Connection) => {
    console.log("onConnect", connection);

    const nodes = (reactFlowInstance?.getNodes() as FlowNode[]) || [];
    const edges = (reactFlowInstance?.getEdges() as FlowEdge[]) || [];

    const stagingState = integrate(
      { nodes: nodes, edges: edges, globals: [] },
      connection,
    );

    const validatedState = validateState(stagingState as FlowState);
    setState(validatedState);
  };

  const [{ isOver, canDrop, type }, dropref] = useDrop(() => {
    return {
      accept: [SMART_MODEL_DROP_TYPE],

      drop: (items: { id: string; identifier: string }[], monitor) => {
        if (!monitor.didDrop()) {
          console.log("Ommitting Parent Drop");
        }

        console.log("hallo");

        const reactFlowBounds =
          reactFlowWrapper?.current?.getBoundingClientRect();

        let x = monitor && monitor.getClientOffset()?.x;
        let y = monitor && monitor.getClientOffset()?.y;

        const flowInstance = reactFlowInstance;

        items.map((i, index) => {
          const id = i.id;

          const type = i.identifier;

          console.log(id, flowInstance, reactFlowBounds, x, y);

          if (id && reactFlowInstance && reactFlowBounds && x && y && type) {
            const position = reactFlowInstance.project({
              x: x - reactFlowBounds.left,
              y: y - reactFlowBounds.top + index * 100,
            });

            if (type == "@rekuest-next/node") {
              arkitektapi &&
                arkitektapi
                  .query<ConstantNodeQuery>({
                    query: ConstantNodeDocument,
                    variables: { id: id },
                  })
                  .then(async (event) => {
                    console.log(event);
                    if (event.data?.node) {
                      const flowNode = arkitektNodeToFlowNode(
                        event.data?.node,
                        position,
                      );
                      addNode(flowNode);
                    }
                  });
            }

            if (type == "@rekuest-next/reactive-template") {
              arkitektapi &&
                arkitektapi
                  .query<ReactiveTemplateQuery>({
                    query: ReactiveTemplateDocument,
                    variables: { id: id },
                  })
                  .then(async (event) => {
                    console.log(event);
                    if (event.data?.reactiveTemplate) {
                      const flowNode = reactiveTemplateToFlowNode(
                        event.data?.reactiveTemplate,
                        position,
                      );
                      addNode(flowNode);
                    }
                  });
            }
          }
        });

        return {};
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        type: monitor.getItemType(),
        canDrop: !!monitor.canDrop(),
      }),
    };
  }, [reactFlowInstance, reactFlowWrapper, addNode]);

  return (
    <EditRiverContext.Provider
      value={{
        flow,
        updateData: updateNodeData,
        showEdgeLabels: showEdgeLabels,
      }}
    >
      <div
        ref={reactFlowWrapper}
        className="flex flex-grow h-full w-full"
        data-disableselect
      >
        <div ref={dropref} className="flex flex-grow h-full w-full relative">
          <div className="absolute top-0 right-0  mr-3 mt-5 z-50">
            <Card>
              <CardHeader>
                <CardTitle>Errors </CardTitle>
                <CardDescription>
                  We found these errors in your graph{" "}
                </CardDescription>
                <Button onClick={() => validate()}> Validate all </Button>
                {state.valid && <Button onClick={() => save()}> Save </Button>}
              </CardHeader>
              <CardContent>
                {state.remainingErrors.length > 0 && (
                  <>
                    <CardDescription> Remaining Errors </CardDescription>
                    {state.remainingErrors.map((e) => (
                      <RemainingErrorRender
                        error={e}
                        onClick={(e) =>
                          onNodesChange([
                            { type: "select", id: e.id, selected: true },
                          ])
                        }
                      />
                    ))}
                  </>
                )}
                {state.solvedErrors.length > 0 && (
                  <>
                    <CardDescription> Solved Errors </CardDescription>
                    {state.solvedErrors.map((e) => (
                      <SolvedErrorRender error={e} />
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          {isOver && (
            <div className="absolute top-[50%] left-[50%]">Drop me {":D"} </div>
          )}
          <Graph
            nodes={state.nodes}
            edges={state.edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            elementsSelectable={true}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onInit={(e) => setReactFlowInstance(e)}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls className="flex flex-row bg-white gap-2 rounded rounded-md overflow-hidden px-2">
              <button
                onClick={() => undo()}
                disabled={!canUndo}
                className={cn(
                  " hover:bg-primary",
                  "text-muted disabled:text-gray-200",
                )}
              >
                <DoubleArrowLeftIcon />{" "}
              </button>
              <button
                onClick={() => redo()}
                disabled={!canRedo}
                className={cn(
                  " hover:bg-primary",
                  "text-muted disabled:text-gray-200",
                )}
              >
                <DoubleArrowRightIcon />{" "}
              </button>
              <button
                onClick={() => setShowEdgeLabels(!showEdgeLabels)}
                className={cn(
                  " hover:bg-primary",
                  showEdgeLabels ? "text-muted" : "text-black",
                )}
              >
                <LetterCaseToggleIcon />{" "}
              </button>
            </Controls>
          </Graph>
        </div>
      </div>
    </EditRiverContext.Provider>
  );
};
