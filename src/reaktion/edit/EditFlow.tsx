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
  GlobalArgFragment,
  GraphEdgeKind,
  GraphInput,
  GraphNodeFragment,
  GraphNodeKind,
  PortFragment,
  ReactiveImplementation,
  ReactiveTemplateDocument,
  ReactiveTemplateQuery,
} from "@/rekuest/api/graphql";
import { portToDefaults, useRekuest } from "@jhnnsrs/rekuest-next";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { ArgsContainer, Constants } from "../base/Constants";
import { X } from "lucide-react";

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

  const moveConstantToStream = (
    nodeId: string,
    conindex: number,
    instream: number,
  ) => {
    setState((state) => {
      const node = state.nodes.find((n) => n.id == nodeId);
      if (!node) {
        console.log("Could not find node", nodeId);
        return state;
      }

      const constant = node.data.constants.at(conindex);
      if (!constant) {
        console.log("Could not find constant", conindex);
        return state;
      }

      let new_instream = node.data.ins.map((s, index) => {
        if (index == instream) {
          return [...s, constant];
        }
        return s;
      });

      console.log("new_instream", new_instream);

      let new_constants = node.data.constants.filter(
        (i, index) => index != conindex,
      );

      console.log("new_constants", new_constants);

      let new_data = {
        ...node.data,
        ins: new_instream, //TODO: This is not correct
        constants: new_constants,
        constantsMap: { ...node.data.constantsMap, [constant.key]: undefined },
        globalsMap: { ...node.data.globalsMap, [constant.key]: undefined },
      };

      return validateState({
        nodes: state.nodes.map((n) => {
          if (n.id === nodeId) {
            n.data = new_data;
            console.log("found node", n);
            return n;
          }
          return n;
        }),
        edges: state.edges,
        globals: state.globals,
      });
    });
  };

  const moveStreamToConstants = (
    nodeId: string,
    streamIndex: number,
    streamItem: number,
  ) => {
    setState((state) => {
      const node = state.nodes.find((n) => n.id == nodeId);
      if (!node) {
        console.log("Could not find node", nodeId);
        return state;
      }

      const streamitem = node.data.ins.at(streamIndex)?.at(streamItem);
      if (!streamitem) {
        console.log("Could not find streamitem", streamitem);
        return state;
      }

      let new_instream = node.data.ins.map((s, index) => {
        if (index == streamIndex) {
          return s.filter((i, index) => index != streamItem);
        }
        return s;
      });

      let new_data = {
        ...node.data,
        ins: new_instream, //TODO: This is not correct
        constants: [...node.data.constants, streamitem],
        constantsMap: {
          ...node.data.constantsMap,
          [streamitem.key]: streamitem.default,
        },
      };

      return validateState({
        nodes: state.nodes.map((n) => {
          if (n.id === nodeId) {
            n.data = new_data;
            console.log("found node", n);
            return n;
          }
          return n;
        }),
        edges: state.edges,
        globals: state.globals,
      });
    });
  };

  const moveConstantToGlobals = (
    nodeId: string,
    conindex: number,
    globalkey?: string | undefined,
  ) => {
    setState((state) => {
      const node = state.nodes.find((n) => n.id == nodeId);
      if (!node) {
        console.log("Could not find node", nodeId);
        return state;
      }

      const constant = node.data.constants.at(conindex);
      if (!constant) {
        console.log("Could not find constant", conindex);
        return state;
      }

      let new_globals = state.globals;
      if (!globalkey) {
        new_globals = [...state.globals, { key: constant.key, port: constant }];
        globalkey = constant.key;
      } else {
        new_globals = state.globals.map((g) => {
          if (g.key == globalkey) {
            return { ...g, port: constant };
          }
          return g;
        });
      }

      let new_data = {
        ...node.data,
        constants: node.data.constants, //We are not removing the constant but we are removing the constant from the constantsMap
        constantsMap: { ...node.data.constantsMap, [constant.key]: undefined },
        globalsMap: { ...node.data.globalsMap, [constant.key]: globalkey },
      };

      return validateState({
        nodes: state.nodes.map((n) => {
          if (n.id === nodeId) {
            n.data = new_data;
            console.log("found node", n);
            return n;
          }
          return n;
        }),
        edges: state.edges,
        globals: new_globals,
      });
    });
  };

  const removeGlobal = (globalkey: string) => {
    setState((state) => {
      const nodes = state.nodes.map((n) => {
        let new_data = {
          ...n.data,
          globalsMap: Object.fromEntries(
            Object.entries(n.data.globalsMap).filter(
              ([key, value]) => value != globalkey,
            ),
          ),
        };
        return { ...n, data: new_data };
      });

      return validateState({
        nodes: nodes,
        edges: state.edges,
        globals: state.globals.filter((g) => g.key != globalkey),
      });
    });
  };

  const movePortToConstants = (
    nodeId: string,
    port: PortFragment,
    instream: number,
  ) => {
    setState((state) => {
      const node = state.nodes.find((n) => n.id == nodeId);
      if (!node) {
        console.log("Could not find node", nodeId);
        return state;
      }

      let new_instream = node.data.ins.map((s, index) => {
        if (index == instream) {
          return [...s.filter((i) => i.key != port.key), port];
        }
        return s.filter((i) => i.key != port.key);
      });

      let new_data = {
        ...node.data,
        ins: new_instream, //TODO: This is not correct
        constants:
          node.data.constants.filter((i, index) => i.key != port.key) || [],
        globalsMap: { ...node.data.globalsMap, [port.key]: undefined },
      };

      return validateState({
        nodes: state.nodes.map((n) => {
          if (n.id === nodeId) {
            n.data = new_data;
            console.log("found node", n);
            return n;
          }
          return n;
        }),
        edges: state.edges,
        globals: [],
      });
    });
  };

  const setGlobals = (globals: GlobalArgFragment[]) => {
    console.log("setGlobals", globals);
    setState((state) =>
      validateState({
        nodes: state.nodes,
        edges: state.edges,
        globals: globals,
      }),
    );
  };

  const globals = useMemo(() => state.globals, [state]);

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

  const hasRemainingErrors = useMemo(
    () => state.remainingErrors.length > 0,
    [state],
  );
  const hasSolvedErrors = useMemo(() => state.solvedErrors.length > 0, [state]);

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
        setGlobals: setGlobals,
        moveConstantToGlobals,
        moveStreamToConstants,
        moveConstantToStream,
        removeGlobal,
        state: state,
        showEdgeLabels: showEdgeLabels,
      }}
    >
      <div
        ref={reactFlowWrapper}
        className="flex flex-grow h-full w-full"
        data-disableselect
      >
        <div ref={dropref} className="flex flex-grow h-full w-full relative">
          {state.valid && (
            <div className="absolute bottom-0 right-0  mr-3 mb-5 z-50">
              <Button onClick={() => save()}> Save </Button>
            </div>
          )}

          {globals.length > 0 && (
            <div className="absolute  top-0 left-0  ml-3 mt-5 z-50">
              <Card>
                <CardHeader>
                  <CardDescription>Globals </CardDescription>
                </CardHeader>
                <CardContent>
                  <Constants
                    ports={globals.map((x) => ({ ...x.port, key: x.key }))}
                    overwrites={{}}
                    onToArg={(e) => removeGlobal(e.key)}
                  />
                </CardContent>
              </Card>
            </div>
          )}
          {hasRemainingErrors ||
            (hasSolvedErrors && (
              <div className="absolute top-0 right-0  mr-3 mt-5 z-50">
                <Card>
                  <CardHeader>
                    <CardDescription>For your information </CardDescription>
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

                        <Button onClick={() => validate()}>
                          {" "}
                          Revalidate all{" "}
                        </Button>
                      </>
                    )}
                    {state.solvedErrors.length > 0 && (
                      <>
                        <CardDescription>
                          {" "}
                          We just solved these Errors{" "}
                        </CardDescription>
                        {state.solvedErrors.map((e) => (
                          <SolvedErrorRender error={e} />
                        ))}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
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
