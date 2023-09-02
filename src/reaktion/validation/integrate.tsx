import {
  GlobalArg,
  GraphEdgeKind,
  GraphNodeFragment,
  GraphNodeKind,
  PortFragment,
  ReactiveImplementation,
} from "@/rekuest/api/graphql";
import { Connection, XYPosition } from "reactflow";
import { FlowEdge, FlowNode, FlowNodeData, NodeData } from "../types";
import { handleToStream, listPortToSingle, nodeIdBuilder } from "../utils";
import { isSameStream, reduceStream, withNewStream } from "./utils";
import {
  ChangeOutcome,
  PortType,
  ChangeEvent,
  FlowState,
  SolvedError,
  ValidationResult,
  ValidationError,
  Transform,
} from "./types";

export const changeZip = (
  data: FlowNodeData,
  event: ChangeEvent,
): ChangeOutcome => {
  if (event.type == "target") {
    if (isSameStream(data.ins.at(event.index), event.stream)) return {}; // No change needed
    // Otherwise we need to change the source port
    let newIns = withNewStream(data.ins, event.index, event.stream);
    let reducedStream = reduceStream(newIns);
    let newOuts = [reducedStream];
    let newData = { ...data, ins: newIns, outs: newOuts };
    return {
      data: newData,
      changes: [{ type: "source", index: 0, stream: reducedStream }],
    };
  } else {
    if (isSameStream(data.outs.at(event.index), event.stream)) return {}; // No change needed
    // Otherwise we need to change the target ports
    if (event.stream.length != 2)
      throw new Error("Zip node must have two source ports");
    let newOutstream = withNewStream(data.outs, event.index, event.stream);
    if (newOutstream.length != 2) return {}; // No change needed
    let newInstream = [newOutstream[0], newOutstream[1]];
    let newData = { ...data, ins: newInstream, outs: newOutstream };
    return {
      data: newData,
      changes: [
        { type: "target", index: 0, stream: newInstream[0] },
        { type: "target", index: 1, stream: newInstream[1] },
      ],
    };
  }
};

export const onlyValid = (
  data: FlowNodeData,
  event: ChangeEvent,
): ChangeOutcome => {
  if (event.type == "target") {
    if (isSameStream(data.ins.at(event.index), event.stream)) return {}; // No change needed
    throw new Error("Ports do not match");
  } else {
    if (isSameStream(data.outs.at(event.index), event.stream)) return {}; // No change needed
    throw new Error("Ports do not match");
  }
};

export const argIsValid = (
  data: FlowNodeData,
  event: ChangeEvent,
): ChangeOutcome => {
  if (event.type == "source") {
    return {
      data: {
        ...data,
        outs: withNewStream(data.outs, event.index, event.stream),
      },
    }; // No change needed
  } else {
    throw new Error(
      "Args does not have target ports. This should never happen",
    );
  }
};

export const returnIsValid = (
  data: FlowNodeData,
  event: ChangeEvent,
): ChangeOutcome => {
  if (event.type == "target") {
    return {
      data: {
        ...data,
        ins: withNewStream(data.ins, event.index, event.stream),
      },
    }; // No change needed
  } else {
    throw new Error(
      "Return does not have sorce ports. This should never happen",
    );
  }
};

export const propagateChange = (
  data: FlowNodeData<GraphNodeFragment>,
  event: ChangeEvent,
): ChangeOutcome => {
  try {
    if (data.__typename == "ReactiveNode") {
      if (data.implementation == ReactiveImplementation.Zip)
        return changeZip(data, event);
    }
    if (data.__typename == "ArgNode") return argIsValid(data, event);
    if (data.__typename == "ReturnNode") return returnIsValid(data, event);
    return onlyValid(data, event);
  } catch (e) {
    if ((e as Error).message) {
      return { denied: (e as Error).message };
    } else {
      return { denied: "Unknown error" };
    }
  }
};

export type TransitionChange = ChangeEvent & { nodeId: string };

export type Transition = {
  type: "source" | "target";
  index: number;
  stream: PortFragment[];
  nodeId: string;
};

export const totalOutcomes = 0;

export type TransitionOptions = {
  maxCount: number;
  runningCount: number;
  nodeID: string;
  edgeID: string;
  state: FlowState;
  stream: PortFragment[];
  type: PortType;
  index: number;
  valid: true;
  solvedErrors: SolvedError[];
  remainingErrors: ValidationError[];
};

export const getTransform = (
  transform: Transform,
  instream: PortFragment[],
  position: XYPosition,
): FlowNode => {
  if (transform == "to_list") {
    return {
      id: nodeIdBuilder(),
      type: "ReactiveNode",
      position: position,
      data: {
        __typename: "ReactiveNode",
        globalsMap: {},
        title: "To List",
        description: "Transforms a stream into a list",
        kind: GraphNodeKind.Reactive,
        ins: [instream],
        constantsMap: {},
        outs: [instream.map((p, index) => listPortToSingle(p, p.key))],
        constants: [],
        implementation: ReactiveImplementation.ToList,
      },
    };
  }

  if (transform == "just_go") {
    return {
      id: nodeIdBuilder(),
      type: "ReactiveNode",
      position: position,
      data: {
        __typename: "ReactiveNode",
        globalsMap: {},
        title: "To List",
        description: "Transforms a stream into a list",
        kind: GraphNodeKind.Reactive,
        ins: [instream],
        constantsMap: {},
        outs: [instream],
        constants: [],
        implementation: ReactiveImplementation.Multiply,
      },
    };
  }

  throw new Error("Unknown transform");
};

export const transitionOrCut = (options: TransitionOptions): void => {
  let changeCount = options.runningCount;
  let node = options.state.nodes.find((n) => n.id == options.nodeID);
  if (!node) throw new Error("Node not found. Should never throw");

  let outcome = propagateChange(node.data, {
    type: options.type,
    stream: options.stream,
    index: options.index,
  });

  if (outcome.data) {
    // The node needs to change because of the transition
    options.state.nodes = options.state.nodes.map((n) => {
      if (n.id == options.nodeID) {
        if (outcome.data == undefined)
          throw new Error("Data is undefined. Should never throw");
        return { ...n, data: outcome.data };
      }
      return n;
    });
  }

  if (outcome.needsTransforms) {
    // We need to add transforms to the stream

    for (let transform of outcome.needsTransforms) {
      let transformNode = getTransform(
        transform,
        options.stream,
        node.position,
      );
      options.state.nodes = [...options.state.nodes, transformNode];
    }
  }

  if (outcome.denied) {
    // We need to cut the edge
    options.state.edges = options.state.edges.filter(
      (e) => e.id != options.edgeID,
    );
    options.solvedErrors = [
      ...options.solvedErrors,
      {
        type: "edge",
        id: options.edgeID,
        message: outcome.denied,
        level: "critical",
        solvedBy: "Removing the Edge",
      },
    ];
  }

  if (outcome.changes) {
    // We need to propagate the changes of this change

    let removedEdges: FlowEdge[] = [];
    let solvedErrors: SolvedError[] = [];

    for (let change of outcome.changes) {
      // find all edges that have this node as source or target
      if (change.type == "source") {
        let affectedEdges = [
          ...options.state.edges.filter((e) => e.source == options.nodeID),
        ]; // We need to copy the array because we are changing it
        for (let edge of affectedEdges) {
          if (changeCount < options.maxCount) {
            transitionOrCut({
              ...options,
              stream: change.stream,
              type: "target", // TODO: Check if this is correct
              index: change.index,
              nodeID: edge.target,
              runningCount: changeCount + 1,
              edgeID: edge.id,
            });
          } else {
            solvedErrors.push({
              type: "edge",
              id: edge.id,
              message: "We reached maximum amount of transition",
              level: "critical",
              solvedBy: "Removing the Edge",
            });
            removedEdges.push(edge);
          }
        }
      }

      if (change.type == "target") {
        let affectedEdges = [
          ...options.state.edges.filter((e) => e.target == options.nodeID),
        ]; // We need to copy the array because we are changing it
        for (let edge of affectedEdges) {
          if (changeCount < options.maxCount) {
            transitionOrCut({
              ...options,
              stream: change.stream,
              type: "source", // TODO: Check if this is correct
              index: change.index,
              nodeID: edge.source,
              runningCount: changeCount + 1,
              edgeID: edge.id,
            });
          } else {
            solvedErrors.push({
              type: "edge",
              id: edge.id,
              message: "We reached maximum amount of transition",
              level: "critical",
              solvedBy: "Removing the Edge",
            });
            removedEdges.push(edge);
          }
        }
      }
    }

    // Remove all edges that are not transition because of the maxCount
    options.state.edges = options.state.edges.filter(
      (e) => !removedEdges.includes(e),
    );
    options.solvedErrors = [...options.solvedErrors, ...solvedErrors];
  }
};

// Can throw errors
export const integrate = (
  state: FlowState,
  connection: Connection,
): ValidationResult => {
  const sourceNode = state.nodes.find((n) => n.id == connection.source);
  const targetNode = state.nodes.find((n) => n.id == connection.target);

  let sourceNodeID = connection.source;
  let targetNodeID = connection.target;
  let sourceHandle = connection.sourceHandle;
  let targetHandle = connection.targetHandle;

  if (!sourceNodeID || !targetNodeID)
    throw new Error("SourceID or TargetID not found");
  if (!sourceNode || !targetNode)
    throw new Error("Source or Target node not found");
  if (!sourceHandle || !targetHandle)
    throw new Error("Source or Target handle not found");

  const sourceStreamIndex = handleToStream(connection.sourceHandle);
  const targetStreamIndex = handleToStream(connection.targetHandle);

  const sourceStream = sourceNode.data.outs.at(sourceStreamIndex);
  const targetStream = targetNode.data.ins.at(targetStreamIndex);

  if (sourceStream == undefined || targetStream == undefined)
    throw new Error("Source or Target stream not found");
  if (sourceStream == undefined || targetStream == undefined)
    throw new Error("Source or Target stream not found");

  const newID = nodeIdBuilder();

  const edge: FlowEdge = {
    id: newID,
    source: sourceNodeID,
    sourceHandle: sourceHandle,
    target: targetNodeID,
    targetHandle: targetHandle,
    type: "VanillaEdge",
    data: {
      __typename: "VanillaEdge",
      id: newID,
      kind: GraphEdgeKind.Vanilla,
      stream: [],
      source: sourceNodeID,
      sourceHandle: sourceHandle,
      target: targetNodeID,
      targetHandle: targetHandle,
    },
  };

  let validatableChangeRightState = { ...state, edges: [...state.edges, edge] };

  let transitionRightOptions: TransitionOptions = {
    maxCount: 10,
    runningCount: 0,
    nodeID: targetNodeID,
    state: validatableChangeRightState,
    stream: sourceStream,
    type: "target",
    index: targetStreamIndex,
    edgeID: newID,
    solvedErrors: [],
    valid: true,
    remainingErrors: [],
  };

  transitionOrCut(transitionRightOptions);

  let validatableChangeLeftState = { ...state, edges: [...state.edges, edge] };

  let transitionLeftOptions: TransitionOptions = {
    maxCount: 10,
    runningCount: 0,
    nodeID: sourceNodeID,
    state: validatableChangeLeftState,
    stream: targetStream,
    type: "source",
    index: sourceStreamIndex,
    solvedErrors: [],
    edgeID: newID,
    valid: true,
    remainingErrors: [],
  };

  transitionOrCut(transitionLeftOptions);
  console.log(transitionLeftOptions, transitionRightOptions);

  const edgeIsInLeft = transitionLeftOptions.state.edges.find(
    (e) => e.id == newID,
  );
  const edgeIsInRight = transitionRightOptions.state.edges.find(
    (e) => e.id == newID,
  );

  if (edgeIsInLeft && edgeIsInRight) {
    // Find out which one is better
    return transitionLeftOptions;
  } else {
    if (edgeIsInLeft) {
      return transitionLeftOptions;
    } else if (edgeIsInRight) {
      return transitionRightOptions;
    } else {
      // Find out which one is better
      return transitionRightOptions;
    }
  }
};
