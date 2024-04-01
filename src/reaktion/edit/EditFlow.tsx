import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
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
import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { cn } from "@/lib/utils";
import {
  FlowFragment,
  GlobalArgFragment,
  GraphInput,
  GraphNodeKind,
  ReactiveImplementation,
  ReactiveTemplateDocument,
  ReactiveTemplateQuery
} from "@/reaktion/api/graphql";
import { ConstantNodeDocument, ConstantNodeQuery } from "@/rekuest/api/graphql";
import { useRekuest } from "@jhnnsrs/rekuest-next";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  EyeOpenIcon,
  LetterCaseToggleIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
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
  Controls,
  EdgeChange,
  NodeChange,
  OnConnectEnd,
  OnConnectStartParams,
  ReactFlowInstance,
  applyEdgeChanges,
  applyNodeChanges
} from "reactflow";
import useUndoable, { MutationBehavior } from "use-undoable";
import { Constants } from "../base/Constants";
import { Graph } from "../base/Graph";
import { arkitektNodeToFlowNode, predicateNodeToFlowNode } from "../plugins/rekuest";
import {
  EdgeTypes,
  FlowEdge,
  FlowNode,
  NodeData,
  NodeTypes
} from "../types";
import {
  edges_to_flowedges,
  flowEdgeToInput,
  flowNodeToInput,
  globalToInput,
  handleToStream,
  nodeIdBuilder,
  nodes_to_flownodes,
  reactiveTemplateToFlowNode
} from "../utils";
import { createVanillaTransformEdge, integrate } from "../validation/integrate";
import {
  ValidationResult
} from "../validation/types";
import { validateState } from "../validation/validate";
import { RemainingErrorRender, SolvedErrorRender } from "./ErrorRender";
import { EditRiverContext } from "./context";
import { LabeledShowEdge } from "./edges/LabeledShowEdge";
import { ArkitektFilterNodeWidget } from "./nodes/ArkitektFilterWidget";
import { ArkitektTrackNodeWidget } from "./nodes/ArkitektWidget";
import { ReactiveTrackNodeWidget } from "./nodes/ReactiveWidget";
import { ArgTrackNodeWidget } from "./nodes/generic/ArgShowNodeWidget";
import { ReturnTrackNodeWidget } from "./nodes/generic/ReturnShowNodeWidget";

const nodeTypes: NodeTypes = {
  ArkitektGraphNode: ArkitektTrackNodeWidget,
  ArkitektFilterGraphNode: ArkitektFilterNodeWidget,
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
  console.log("THE FLOW", flow)

  const { client: arkitektapi } = useRekuest();
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);
  const [showNodeErrors, setShowNodeErrors] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const connectingStart = useRef<OnConnectStartParams | undefined>(undefined);

  const [state, setState, { redo, undo, canRedo, canUndo }] =
    useUndoable<ValidationResult>({
      nodes: nodes_to_flownodes(flow.graph?.nodes),
      edges: edges_to_flowedges(flow.graph?.edges),
      globals: flow.graph.globals || [],
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
      if (ignoreAction) {
        setState(
          (e) => ({
            ...e,
            nodes: v,
          }),
          mutation,
          ignoreAction,
        );
      }

      setState(
        (e) =>
          validateState({
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

      if (ignoreAction) {
        setState(
          (e) => ({
            ...e,
            edges: v,
          }),
          mutation,
          ignoreAction,
        );
      }

      setState(
        (e) =>
          validateState({
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

  const updateNodeData = (data: Partial<NodeData>, id: string) => {
    setState((state) =>
      validateState({
        ...state,
        nodes: state.nodes.map((n) => {
          if (n.id === id) {
            n.data = { ...n.data, ...data };
            console.log("found node", n);
            return n;
          }
          return n;
        }),
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
        ...state,
        nodes: state.nodes.map((n) => {
          if (n.id === nodeId) {
            n.data = new_data;
            console.log("found node", n);
            return n;
          }
          return n;
        }),
      });
    });
  };

  const moveVoidtoOutstream = (
    nodeId: string,
    voidindex: number,
    outstream: number,
  ) => {
    setState((state) => {
      const node = state.nodes.find((n) => n.id == nodeId);
      if (!node) {
        console.log("Could not find node", nodeId);
        return state;
      }

      const thevoid = node.data.voids.at(voidindex);
      if (!thevoid) {
        console.log("Could not find void", voidindex);
        return state;
      }

      let new_outstream = node.data.outs.map((s, index) => {
        if (index == outstream) {
          return [...s, thevoid];
        }
        return s;
      });

      console.log("new_instream", new_outstream);

      let new_voids = node.data.voids.filter((i, index) => index != voidindex);

      console.log("ne_voids", new_voids);

      let new_data = {
        ...node.data,
        outs: new_outstream, //TODO: This is not correct
        voids: new_voids,
      };

      return validateState({
        ...state,
        nodes: state.nodes.map((n) => {
          if (n.id === nodeId) {
            n.data = new_data;
            console.log("found node", n);
            return n;
          }
          return n;
        }),
      });
    });
  };

  const moveOutStreamToVoid = (
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

      const streamitem = node.data.outs.at(streamIndex)?.at(streamItem);
      if (!streamitem) {
        console.log("Could not find streamitem", streamitem);
        return state;
      }

      let new_outstream = node.data.outs.map((s, index) => {
        if (index == streamIndex) {
          return s.filter((i, index) => index != streamItem);
        }
        return s;
      });

      let new_data = {
        ...node.data,
        outs: new_outstream, //TODO: This is not correct
        voids: [...node.data.voids, streamitem],
      };

      return validateState({
        ...state,
        nodes: state.nodes.map((n) => {
          if (n.id === nodeId) {
            n.data = new_data;
            console.log("found node", n);
            return n;
          }
          return n;
        }),
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
        ...state,
        nodes: state.nodes.map((n) => {
          if (n.id === nodeId) {
            n.data = new_data;
            console.log("found node", n);
            return n;
          }
          return n;
        }),
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
        ...state,
        nodes: state.nodes.map((n) => {
          if (n.id === nodeId) {
            n.data = new_data;
            console.log("found node", n);
            return n;
          }
          return n;
        }),
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
        ...state,
        nodes: nodes,
        globals: state.globals.filter((g) => g.key != globalkey),
      });
    });
  };

  const setGlobals = (globals: GlobalArgFragment[]) => {
    console.log("setGlobals", globals);
    setState((state) =>
      validateState({
        ...state,
        globals: globals,
      }),
    );
  };

  const globals = useMemo(() => state.globals, [state]);

  const save = () => {
    const validated = state;

    if (validated.valid) {
      const graph: GraphInput = {
        nodes: validated.nodes.map((n) => flowNodeToInput(n)),
        edges: validated.edges.map((e) => flowEdgeToInput(e)),
        globals: validated.globals.map((g) => globalToInput(g)),
      };
      console.log("Saving", graph);
      onSave && onSave(graph);
    } else {
      console.log("not valid");
    }
  };

  const addNode = (node: FlowNode) => {
    setState((e) => validateState({ ...e, nodes: [...e.nodes, node] }));
  };

  const removeEdge = (id: string) => {
    setState((e) =>
      validateState({ ...e, edges: e.edges.filter((el) => el.id !== id) }),
    );
  };

  const validate = () => {
    const validated = validateState(state);
    setState(validated);
  };

  const onConnect = (connection: Connection) => {
    console.log("onConnect", connection);

    const nodes = (reactFlowInstance?.getNodes() as FlowNode[]) || [];
    const edges = (reactFlowInstance?.getEdges() as FlowEdge[]) || [];

    const stagingState = integrate(
      { nodes: nodes, edges: edges, globals: globals },
      connection,
    );

    const validated = validateState(stagingState);

    setState(validated);
  };

  const onConnectStart = useCallback(
    (event: any, params: OnConnectStartParams) => {
      connectingStart.current = params;
    },
    [],
  );

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const target = event.target as HTMLElement;
      console.log("onConnectEnd", event, target);
      const targetEdgeId = target.dataset?.edgeid;

      let connectionParams = connectingStart.current;

      if (reactFlowInstance && connectionParams && targetEdgeId) {
        // we need to remove the wrapper bounds, in order to get the correct position
        if (!connectionParams.nodeId || !connectionParams.handleId) {
          console.log("no nodeId found and handleid found");
          return;
        }

        let node = reactFlowInstance.getNode(connectionParams.nodeId);
        let edge = reactFlowInstance.getEdge(targetEdgeId);

        if (!node || !edge) {
          console.log("no node or edge found");
          return;
        }

        if (connectionParams.handleType == "source") {
          // We are dealing with a scenario were a stream should be zipped
          let stagingSourceId = node.id;
          let stagingSourceHandle = connectionParams.handleId;
          let stagingSourceStreamID = handleToStream(connectionParams.handleId);

          let oldEdgeId = edge?.id;
          let oldEdgeSourceId = edge?.source;
          let oldEdgeSourceHandle = edge?.sourceHandle;
          let oldEdgeTargetId = edge?.target;
          let oldEdgeTargetHandle = edge?.targetHandle;
          let oldEdgeSourceStreamID = handleToStream(oldEdgeSourceHandle);

          let oldNode = reactFlowInstance.getNode(oldEdgeSourceId);
          if (!oldNode) {
            console.log("no old node found");
            return;
          }

          let newState = { ...state };
          newState.edges = newState.edges.filter((e) => e.id != oldEdgeId); // Remove the old edge

          // Create a Zip Node

          let stagingOutstream = node.data.outs.at(stagingSourceStreamID);
          let oldOutstream = oldNode.data.outs.at(oldEdgeSourceStreamID);

          let order =
            node.position.x < oldNode.position.x
              ? [stagingOutstream, oldOutstream]
              : [oldOutstream, stagingOutstream];

          let zipNodeInstream = order;

          const reactFlowBounds =
            reactFlowWrapper?.current?.getBoundingClientRect();

          let position = reactFlowInstance.project({
            x: event.clientX - (reactFlowBounds.left || 0),
            y: event.clientY - (reactFlowBounds.top || 0),
          });

          let zipNode: FlowNode = {
            id: nodeIdBuilder(),
            type: "ReactiveNode",
            position: position,
            data: {
              globalsMap: {},
              title: "Zips together two streams into one stream.",
              description: "Zips together two streams into one stream.",
              kind: GraphNodeKind.Reactive,
              ins: zipNodeInstream,
              constantsMap: {},
              outs: [stagingOutstream.concat(oldOutstream)],
              constants: [],
              implementation: ReactiveImplementation.Zip,
            },
          };

          newState.nodes = newState.nodes.concat(zipNode);

          // Adding the new edges
          newState.edges = newState.edges.concat(
            createVanillaTransformEdge(
              nodeIdBuilder(),
              stagingSourceId,
              stagingSourceStreamID,
              zipNode.id,
              node.position.x < oldNode.position.x ? 0 : 1,
            ),
            createVanillaTransformEdge(
              nodeIdBuilder(),
              oldEdgeSourceId,
              oldEdgeSourceStreamID,
              zipNode.id,
              position.x < oldNode.position.x ? 1 : 0,
            ),
          );

          // This is the edge that connects the zip node to the old edge target, it will need to undergo validation
          let integratedState = integrate(newState, {
            source: zipNode.id,
            sourceHandle: "return_0",
            target: oldEdgeTargetId,
            targetHandle: oldEdgeTargetHandle,
          });

          setState((e) => integratedState);
        }
      }
    },
    [reactFlowInstance, state, setState],
  );

  const [{ isOver, canDrop, type, position }, dropref] = useDrop(() => {
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
                      if (
                        event.data.node.protocols.find(
                          (p) => p.name == "predicate",
                        )
                      ) {
                        const flowNode = predicateNodeToFlowNode(
                          event.data?.node,
                          position,
                        );
                        addNode(flowNode);
                      } else {
                        const flowNode = arkitektNodeToFlowNode(
                          event.data?.node,
                          position,
                        );
                        addNode(flowNode);
                      }
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
        position: monitor.getClientOffset(),
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
        moveVoidtoOutstream,
        moveOutStreamToVoid,
        removeEdge: removeEdge,
        showNodeErrors: showNodeErrors,
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
          {state.remainingErrors.length == 0 && (
            <div className="absolute bottom-0 right-0  mr-3 mb-5 z-50">
              <Button onClick={() => save()}> Save </Button>
            </div>
          )}

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
                  <Constants
                    ports={globals.map((x) => ({ ...x.port, key: x.key }))}
                    overwrites={{}}
                    onToArg={(e) => removeGlobal(e.key)}
                    onSubmit={() => alert("setting values here has no impact")}
                  />
                </CardContent>
              </Card>
            </div>
          )}
          {state.remainingErrors.length != 0 &&
          <div className="absolute top-0 right-0  mr-3 mt-5 z-50">
            <Card className="bg-sidebar py-2">
              <CardContent>
                {state.remainingErrors.length > 0 && (
                  <>
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
          }
          {isOver && (
            <div className="absolute w-full h-full bg-white opacity-10 z-10">
              {" "}
            </div>
          )}
          <Graph
            nodes={state.nodes}
            edges={state.edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
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
                  <ScrollArea className="h-full">
                    <pre>{JSON.stringify(state, null, 2)}</pre>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </Controls>
          </Graph>
        </div>
      </div>
    </EditRiverContext.Provider>
  );
};
