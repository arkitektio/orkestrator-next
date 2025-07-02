import { useService } from "@/arkitekt/hooks";
import { Button } from "@/components/ui/button";
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
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useSmartDrop } from "@/providers/smart/hooks";
import {
  BaseGraphNodeFragment,
  FlowFragment,
  GlobalArgFragment,
  GraphInput,
  GraphNodeKind,
  ReactiveImplementation,
  ReactiveTemplateDocument,
  ReactiveTemplateQuery,
} from "@/reaktion/api/graphql";
import { ClickContextual } from "@/reaktion/edit/components/ClickContextual";
import { ConnectContextual } from "@/reaktion/edit/components/ConnectContextual";
import { DropContextual } from "@/reaktion/edit/components/DropContextual";
import { BoundNodesBox } from "@/reaktion/edit/components/boxes/BoundNodesBox";
import { ErrorBox } from "@/reaktion/edit/components/boxes/ErrorBox";
import {
  ConstantActionDocument,
  ConstantActionQuery,
  PortKind,
  useImplementationsQuery,
} from "@/rekuest/api/graphql";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  EyeOpenIcon,
  LetterCaseToggleIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import { AnimatePresence } from "framer-motion";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Connection,
  Controls,
  EdgeChange,
  NodeChange,
  OnConnectEnd,
  OnConnectStartParams,
  ReactFlowInstance,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import useUndoable, { MutationBehavior } from "use-undoable";
import { Constants } from "../base/Constants";
import { Graph } from "../base/Graph";
import { rekuestActionToMatchingNode } from "../plugins/rekuest";
import {
  ClickContextualParams,
  ConnectContextualParams,
  DropContextualParams,
  EdgeContextualParams,
  EdgeTypes,
  FlowEdge,
  FlowNode,
  NodeData,
  NodeTypes,
  RelativePosition,
} from "../types";
import {
  edges_to_flowedges,
  flowEdgeToInput,
  flowNodeToInput,
  globalToInput,
  handleToStream,
  nodeIdBuilder,
  nodes_to_flownodes,
  reactiveTemplateToFlowNode,
} from "../utils";
import {
  createVanillaTransformEdge,
  integrate,
  istriviallyIntegratable,
} from "../validation/integrate";
import { ValidationResult } from "../validation/types";
import { validateState } from "../validation/validate";
import { EdgeContextual } from "./components/EdgeContextual";
import { DeployInterfaceButton } from "./components/buttons/DeployButton";
import { EditRiverContext } from "./context";
import { LabeledShowEdge } from "./edges/LabeledShowEdge";
import { ReactiveTrackNodeWidget } from "./nodes/ReactiveWidget";
import { RekuestFilterActionWidget } from "./nodes/RekuestFilterActionWidget";
import { RekuestMapActionWidget } from "./nodes/RekuestMapActionWidget";
import { ArgTrackNodeWidget } from "./nodes/generic/ArgShowNodeWidget";
import { ReturnTrackNodeWidget } from "./nodes/generic/ReturnShowNodeWidget";
import { useRekuest } from "@/lib/arkitekt/Arkitekt";
import { RunButton } from "./components/buttons/RunButton";
import {
  FlussReactiveTemplate,
  RekuestAction,
  RekuestImplementation,
} from "@/linkers";

const nodeTypes: NodeTypes = {
  RekuestFilterActionNode: RekuestFilterActionWidget,
  RekuestMapActionNode: RekuestMapActionWidget,
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

function calculateMidpoint(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

const hasBoundPort = (node: FlowNode<BaseGraphNodeFragment>): boolean => {
  return (
    node.data.ins?.find(
      (s) => s && s.length && s.find((i) => i.kind == PortKind.MemoryStructure),
    ) ||
    node.data.outs?.find(
      (s) => s && s.length && s.find((i) => i.kind == PortKind.MemoryStructure),
    ) ||
    node.data.voids?.find((i) => i.kind == PortKind.MemoryStructure) ||
    node.data.constants?.find((i) => i.kind == PortKind.MemoryStructure)
  );
};

const checkFlowIsEqual = (a: ValidationResult, b: ValidationResult) => {
  // Check multiple parts of the state
  if (a.nodes.length !== b.nodes.length) return false;
  if (a.edges.length !== b.edges.length) return false;
  if (a.globals.length !== b.globals.length) return false;
  if (a.valid !== b.valid) return false;
  if (a.remainingErrors.length !== b.remainingErrors.length) return false;
  if (a.solvedErrors.length !== b.solvedErrors.length) return false;
  return true;
};

export const EditFlow: React.FC<Props> = ({ flow, onSave }) => {
  console.log("THE FLOW", flow);

  const arkitektapi = useRekuest();
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);
  const [showNodeErrors, setShowNodeErrors] = useState(true);

  const [showContextual, setShowContextual] = useState<
    undefined | DropContextualParams
  >();
  const [showClickContextual, setShowClickContextual] = useState<
    undefined | ClickContextualParams
  >();
  const [showEdgeContextual, setShowEdgeContextual] = useState<
    undefined | EdgeContextualParams
  >();
  const [showConnectContextual, setShowConnectContextual] = useState<
    undefined | ConnectContextualParams
  >();

  const connectingNodeId = useRef(null);

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

  const isEqual = useMemo(() => {
    return checkFlowIsEqual(state, {
      nodes: nodes_to_flownodes(flow.graph?.nodes),
      edges: edges_to_flowedges(flow.graph?.edges),
      globals: flow.graph.globals || [],
      remainingErrors: [],
      solvedErrors: [],
      valid: true,
    });
  }, [state, flow.graph]);

  const boundNodes = useMemo(() => {
    return state.nodes.filter(hasBoundPort);
  }, [state.nodes]);

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
      } else {
        console.log("triggerNodepdate", v);

        setState(
          (e) =>
            validateState({
              ...e,
              nodes: v,
            }),
          mutation,
          ignoreAction,
        );
      }
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
      } else {
        setState(
          (e) =>
            validateState({
              ...e,
              edges: v,
            }),
          mutation,
          ignoreAction,
        );
      }
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
        console.log("Position Change", changes[0]);
        triggerNodepdate(
          applyNodeChanges(changes, state.nodes) as FlowNode[],
          undefined,
          true,
        );
      } else {
        triggerNodepdate(
          applyNodeChanges(changes, state.nodes) as FlowNode[],
          undefined,
          false,
        );
      }
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

  const onPaneClick = (event: React.MouseEvent) => {
    console.log("onPaneClick", event);
    // If we have a contextual menu open, we should close it
    if (showContextual) {
      if (Math.abs(showContextual.event.timeStamp - event.timeStamp) > 0.001) {
        setShowContextual(undefined);
        console.log("Click Hide Event");
        return;
      } else {
        console.log("Contextual Post Event");
        return;
      }
    }

    if (showConnectContextual) {
      setShowConnectContextual(undefined);
    }

    if (showEdgeContextual) {
      setShowEdgeContextual(undefined);
    }

    if (showClickContextual) {
      console.log("Click Hide Event");
      setShowClickContextual(undefined);
      return;
    }

    const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();
    console.log("reactFlowBounds", reactFlowBounds);
    if (reactFlowInstance && reactFlowBounds) {
      let position = {
        x: event.clientX - (reactFlowBounds?.left || 0),
        y: event.clientY - (reactFlowBounds?.top || 0),
      };

      console.log("onPaneClick", position);

      setShowClickContextual({
        event: event,
        position: position,
      });

      console.log("showClickContextual", showClickContextual);
    }
  };

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    console.log("onEdgeClick", event);
    // If we have a contextual menu open, we should close it
    if (showContextual) {
      if (Math.abs(showContextual.event.timeStamp - event.timeStamp) > 0.001) {
        setShowContextual(undefined);
        console.log("Click Hide Event");
        return;
      } else {
        console.log("Contextual Post Event");
        return;
      }
    }

    if (showConnectContextual) {
      setShowConnectContextual(undefined);
    }

    if (showClickContextual) {
      console.log("Click Hide Event");
      setShowClickContextual(undefined);
      return;
    }

    const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();
    console.log("reactFlowBounds", reactFlowBounds);
    if (reactFlowInstance && reactFlowBounds) {
      let position = {
        x: event.clientX - (reactFlowBounds?.left || 0),
        y: event.clientY - (reactFlowBounds?.top || 0),
      };

      console.log("onPaneClick", position);

      let leftNode = reactFlowInstance.getNode(edge.source);
      let rightNode = reactFlowInstance.getNode(edge.target);

      if (!leftNode || !rightNode) {
        console.log("no left or right node found");
        return;
      }

      setShowEdgeContextual({
        edgeId: edge.id,
        event: event,
        position: position,
        leftNode: leftNode,
        leftStream: handleToStream(edge.sourceHandle),
        rightNode: rightNode,
        rightStream: handleToStream(edge.targetHandle),
      });

      console.log("showClickContextual", showEdgeContextual);
    }
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

    console.log("Validated", validated);

    if (validated.remainingErrors.length == 0) {
      const graph: GraphInput = {
        nodes: validated.nodes.map((n) => flowNodeToInput(n)),
        edges: validated.edges.map((e) => flowEdgeToInput(e)),
        globals: validated.globals.map((g) => globalToInput(g)),
      };
      console.log("Saving", graph);
      onSave && onSave(graph);
    } else {
      toast("error", "There are still errors in the graph");
      console.log("not valid");
    }
  };

  const addNode = (node: FlowNode) => {
    setState((e) => validateState({ ...e, nodes: [...e.nodes, node] }));
  };

  const removeEdge = (id: string) => {
    if (showEdgeContextual) {
      if (showEdgeContextual.edgeId == id) {
        setShowEdgeContextual(undefined);
      }
    }

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

    // Once we have a connection we resset the

    connectingStart.current = undefined;

    const nodes = (reactFlowInstance?.getNodes() as FlowNode[]) || [];
    const edges = (reactFlowInstance?.getEdges() as FlowEdge[]) || [];

    if (
      istriviallyIntegratable(
        { nodes: nodes, edges: edges, globals: globals },
        connection,
      )
    ) {
      // Trivially integrate the edge
      const stagingState = integrate(
        { nodes: nodes, edges: edges, globals: globals },
        connection,
      );

      const validated = validateState(stagingState);

      // Check if validated Edge is valid

      setState(validated);
    } else {
      // We need to show the contextual menu
      let leftNode = nodes.find((n) => n.id == connection.source);
      let rightNode = nodes.find((n) => n.id == connection.target);

      if (!leftNode || !rightNode || !reactFlowInstance) {
        console.log("no left or right node found");
        return;
      }

      console.log(leftNode.positionAbsolute);
      console.log(rightNode.positionAbsolute);
      console.log(leftNode.position);
      console.log(rightNode.position);

      // Calcluate to Screen Position
      let screenposition = reactFlowInstance.flowToScreenPosition(
        calculateMidpoint(leftNode.position, rightNode.position),
      );

      const reactFlowBounds =
        reactFlowWrapper?.current?.getBoundingClientRect();

      let position = {
        x: screenposition.x - (reactFlowBounds?.left || 0),
        y: screenposition.y - (reactFlowBounds?.top || 0),
      };

      setShowConnectContextual({
        leftNode: leftNode,
        rightNode: rightNode,
        leftStream: handleToStream(connection.sourceHandle),
        rightStream: handleToStream(connection.targetHandle),
        connection: connection,
        position: position,
      });
    }
  };

  const onConnectStart = useCallback(
    (event: any, params: OnConnectStartParams) => {
      connectingStart.current = params;
    },
    [],
  );

  const addClickNode = (
    stagingNode: FlowNode,
    params: ClickContextualParams,
  ) => {
    if (!reactFlowInstance) {
      console.log("no reactFlowInstance found");
      return;
    }

    let newState = { ...state };

    let event = params.event;

    // Create a Zip Node

    const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();

    let position = reactFlowInstance.project({
      x: event.clientX - (reactFlowBounds?.left || 0),
      y: event.clientY - (reactFlowBounds?.top || 0),
    });

    newState.nodes = newState.nodes.concat({ ...stagingNode, position });

    setState((e) => newState);
    setShowClickContextual(undefined);
  };

  const addConnectContextualNode = (
    stagingNode: FlowNode,
    params: ConnectContextualParams,
  ) => {
    if (!reactFlowInstance) {
      console.log("no reactFlowInstance found");
      return;
    }

    let oldNodeSourceId = params.connection.source;
    let oldNodeSourceStreamID = handleToStream(params.connection.sourceHandle);

    let targetNodeSourceStreamID = handleToStream(
      params.connection.targetHandle,
    );
    let targetNodeSourceId = params.connection.target;

    let newState = { ...state };

    let leftNodeDims = { width: 200, height: 100 };
    let rightNodeDims = { width: 200, height: 100 };
    // Create a Zip Node

    const centerLeft = {
      x: params.leftNode.position.x + leftNodeDims.width / 2,
      y: params.leftNode.position.y + leftNodeDims.height / 2,
    };
    const centerRight = {
      x: params.rightNode.position.x + rightNodeDims.width / 2,
      y: params.rightNode.position.y + rightNodeDims.height / 2,
    };

    const position = calculateMidpoint(centerLeft, centerRight);

    newState.nodes = newState.nodes.concat({ ...stagingNode, position });

    if (!oldNodeSourceId) return console.log("no oldNodeSourceId found");
    if (!targetNodeSourceId) return console.log("no targertNodeID found");

    // Adding the new edges
    newState.edges = newState.edges.concat(
      createVanillaTransformEdge(
        nodeIdBuilder(),
        oldNodeSourceId,
        oldNodeSourceStreamID,
        stagingNode.id,
        0,
      ),
      createVanillaTransformEdge(
        nodeIdBuilder(),
        stagingNode.id,
        0,
        targetNodeSourceId,
        targetNodeSourceStreamID,
      ),
    );

    setState((e) => newState);
    setShowConnectContextual(undefined);
  };

  const addEdgeContextualNode = (
    stagingNode: FlowNode,
    params: EdgeContextualParams,
  ) => {
    if (!reactFlowInstance) {
      console.log("no reactFlowInstance found");
      return;
    }

    let newState = { ...state };

    let leftNodeDims = { width: 200, height: 100 };
    let rightNodeDims = { width: 200, height: 100 };
    // Create a Zip Node

    const centerLeft = {
      x: params.leftNode.position.x + leftNodeDims.width / 2,
      y: params.leftNode.position.y + leftNodeDims.height / 2,
    };
    const centerRight = {
      x: params.rightNode.position.x + rightNodeDims.width / 2,
      y: params.rightNode.position.y + rightNodeDims.height / 2,
    };

    const position = calculateMidpoint(centerLeft, centerRight);

    newState.nodes = newState.nodes.concat({ ...stagingNode, position });

    // Adding the new edges
    newState.edges = newState.edges.concat(
      createVanillaTransformEdge(
        nodeIdBuilder(),
        params.leftNode.id,
        params.leftStream,
        stagingNode.id,
        0,
      ),
      createVanillaTransformEdge(
        nodeIdBuilder(),
        stagingNode.id,
        0,
        params.rightNode.id,
        params.rightStream,
      ),
    );

    newState.edges = newState.edges.filter((e) => e.id != params.edgeId);

    setState((e) => newState);
    setShowEdgeContextual(undefined);
  };

  const addContextualNode = (
    stagingNode: FlowNode,
    params: DropContextualParams,
  ) => {
    if (!reactFlowInstance) {
      console.log("no reactFlowInstance found");
      return;
    }

    if (!params.connectionParams.nodeId || !params.connectionParams.handleId) {
      console.log("no nodeId found and handleid found");
      return;
    }

    let oldNode = reactFlowInstance.getNode(params.connectionParams.nodeId);

    if (!oldNode) {
      console.log("no node");
      return;
    }

    let connectionParams = params.connectionParams;
    let event = params.event;

    if (params.connectionParams.handleType == "source") {
      // We are dealing with a scenario were a new node should be added
      let oldNodeSourceId = oldNode.id;
      let oldNodeSourceStreamID = handleToStream(connectionParams.handleId);

      let newState = { ...state };

      // Create a Zip Node

      const reactFlowBounds =
        reactFlowWrapper?.current?.getBoundingClientRect();

      let position = reactFlowInstance.project({
        x: event.clientX - (reactFlowBounds?.left || 0),
        y: event.clientY - (reactFlowBounds?.top || 0),
      });

      newState.nodes = newState.nodes.concat({ ...stagingNode, position });

      // Adding the new edges
      newState.edges = newState.edges.concat(
        createVanillaTransformEdge(
          nodeIdBuilder(),
          oldNodeSourceId,
          oldNodeSourceStreamID,
          stagingNode.id,
          0,
        ),
      );

      // This is the edge that connects the zip node to the old edge target, it will need to undergo validation
      let integratedState = integrate(newState, {
        source: oldNodeSourceId,
        sourceHandle: connectionParams.handleId,
        target: stagingNode.id,
        targetHandle: "arg_0",
      });

      setState((e) => integratedState);
      setShowContextual(undefined);
    }
  };

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const target = event.target as HTMLElement;
      console.log("onConnectEnd", event, target);
      const targetEdgeId = target.dataset?.edgeid;

      let connectionParams = connectingStart.current;
      const targetIsPane = target.classList.contains("react-flow__pane");

      if (targetIsPane && reactFlowInstance && connectionParams) {
        const reactFlowBounds =
          reactFlowWrapper?.current?.getBoundingClientRect();

        if (connectionParams.nodeId && connectionParams.handleId) {
          let node = reactFlowInstance.getNode(connectionParams.nodeId);

          if (!node) {
            console.log("no node found");
            return;
          }

          let position = {
            x: event.clientX - (reactFlowBounds?.left || 0),
            y: event.clientY - (reactFlowBounds?.top || 0),
          };

          // Calculate relative positoin (upright downetight form event to node)

          let node_position = reactFlowInstance.flowToScreenPosition(
            node?.position,
          );

          let relativePosition: RelativePosition | null = null;

          if (node_position.x < position.x) {
            if (node_position.y < position.y) {
              relativePosition = "bottomright";
            }
            if (node_position.y > position.y) {
              relativePosition = "topright";
            }
          } else {
            if (node_position.y < position.y) {
              relativePosition = "bottomleft";
            }
            if (node_position.y > position.y) {
              relativePosition = "topleft";
            }
          }

          if (node && connectionParams.handleType) {
            setShowContextual({
              handleType: connectionParams.handleType,
              causingNode: node as FlowNode,
              causingStream: handleToStream(connectionParams.handleId),
              connectionParams: connectionParams,
              position: position,
              relativePosition: relativePosition,
              event: event,
            });
          } else {
            console.error("no node or handleType found");
          }
        }
      }

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

  const [{ isOver, canDrop }, dropref] = useSmartDrop(
    (items, monitor) => {
      console.log("Dropping On Edit?");

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
        const id = i.object;

        const type = i.identifier;

        console.log(id, flowInstance, reactFlowBounds, x, y);

        if (id && reactFlowInstance && reactFlowBounds && x && y && type) {
          const position = reactFlowInstance.project({
            x: x - reactFlowBounds.left,
            y: y - reactFlowBounds.top + index * 100,
          });

          if (type == RekuestAction.identifier) {
            arkitektapi &&
              arkitektapi
                .query<ConstantActionQuery>({
                  query: ConstantActionDocument,
                  variables: { id: id },
                })
                .then(async (event) => {
                  console.log(event);
                  if (event.data?.action) {
                    let flownode = rekuestActionToMatchingNode(
                      event.data?.action,
                      position,
                    );
                    addNode(flownode);
                  }
                });
          }

          if (type == FlussReactiveTemplate.identifier) {
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
    [reactFlowInstance, reactFlowWrapper, addNode],
  );

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
        addClickNode,
        removeEdge: removeEdge,
        showNodeErrors: showNodeErrors,
        addContextualNode: addContextualNode,
        addConnectContextualNode,
        addEdgeContextualNode,
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
          <AnimatePresence>
            {state.remainingErrors.length == 0 && (
              <div className="absolute bottom-0 right-0  mr-3 mb-5 z-50 flex flex-row gap-2">
                <Button onClick={() => save()}> Save </Button>
                {flow.id && isEqual && <DeployInterfaceButton flow={flow} />}
                {flow.id && isEqual && <RunButton flow={flow} />}
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
                    {globals.map((g) => (
                      <>{g.key}</>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="absolute top-0 right-0  mr-3 mt-5 z-50 max-w-xs gap-1 flex flex-col ">
              {state.remainingErrors.length != 0 && (
                <ErrorBox errors={state.remainingErrors} />
              )}
              {boundNodes.length > 0 && <BoundNodesBox nodes={boundNodes} />}
            </div>
            {isOver && (
              <div className="absolute w-full h-full bg-white opacity-10 z-10">
                {" "}
              </div>
            )}

            {showContextual && connectingStart && (
              <DropContextual params={showContextual} />
            )}
            {showClickContextual && (
              <ClickContextual params={showClickContextual} />
            )}
            {showConnectContextual && (
              <ConnectContextual params={showConnectContextual} />
            )}
            {showEdgeContextual && (
              <EdgeContextual params={showEdgeContextual} />
            )}
          </AnimatePresence>
          <Graph
            nodes={state.nodes}
            edges={state.edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onConnect={onConnect}
            onPaneClick={onPaneClick}
            onEdgeClick={onEdgeClick}
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
                  <ScrollArea className="h-full dark:text-white">
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
