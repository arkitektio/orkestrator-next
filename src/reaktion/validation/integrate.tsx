import {
  GraphEdgeKind,
  GraphNodeFragment,
  GraphNodeKind,
  PortFragment,
  PortKind,
  ReactiveImplementation,
} from "@/reaktion/api/graphql";
import { Connection, XYPosition } from "reactflow";
import { FlowEdge, FlowNode, FlowNodeData } from "../types";
import {
  handleToStream,
  listPortToSingle,
  nodeIdBuilder,
  singleToList,
  streamToReadable,
} from "../utils";
import {
  ChangeEvent,
  ChangeOutcome,
  FlowState,
  PortType,
  SolvedError,
  Transform,
  ValidationResult,
} from "./types";
import {
  isChunkTransformable,
  isFloatTransformable,
  isIntTransformable,
  isNullTransformable,
  isSameStream,
  islistTransformable,
  reduceStream,
  withNewStream,
} from "./utils";
import { PortScope } from "@/rekuest/api/graphql";

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

const logChallenge = (data: FlowNodeData, event: ChangeEvent) => {
  if (event.type == "target")
    console.log(
      data.title,
      "is challenged as a Target: Having input",
      streamToReadable(data.ins.at(event.index)),
      "and challenged by",
      streamToReadable(event.stream),
    );
  if (event.type == "source")
    console.log(
      data.title,
      "is challenged as a Source: Having output",
      streamToReadable(data.outs.at(event.index)),
      "and challenged by",
      streamToReadable(event.stream),
    );
};

export const onlyValid = (
  data: FlowNodeData,
  event: ChangeEvent,
): ChangeOutcome => {
  logChallenge(data, event);
  console.log(islistTransformable(event.stream, data.ins.at(event.index)));
  if (event.type == "target") {
    if (isSameStream(event.stream, data.ins.at(event.index))) return {}; // No change needed
    if (islistTransformable(event.stream, data.ins.at(event.index)))
      return { needsTransform: "to_list" }; // No change needed// No change needed
    if (isChunkTransformable(event.stream, data.ins.at(event.index)))
      return { needsTransform: "from_list" }; // No change needed// No change needed
    if (isNullTransformable(event.stream, data.ins.at(event.index)))
      return { needsTransform: "ensure" };
    if (isFloatTransformable(event.stream, data.ins.at(event.index)))
      return { needsTransform: "round_float" };
    if (isIntTransformable(event.stream, data.ins.at(event.index)))
      return { needsTransform: "to_float" };

    throw new Error("Ports do not match");
  } else {
    if (isSameStream(data.outs.at(event.index), event.stream)) return {};
    throw new Error("Ports do not match");
  }
};

export const streamContainsNonLocal = (stream: PortFragment[]): boolean => {
  for (let port of stream) {
    if (port.scope == PortScope.Local) return true;
  }
  return false;
};

export const argIsValid = (
  data: FlowNodeData,
  event: ChangeEvent,
): ChangeOutcome => {
  if (event.type == "source") {
    console.log("Arg is challenged as a Source");
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
    if (streamContainsNonLocal(event.stream)) {
      return { denied: "Return cannot have non-local ports" };
    }

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
  console.log("Propagating change", data, event);
  if (!data.kind) {
    return { denied: "Kind not found" };
  }

  try {
    if (data.kind == GraphNodeKind.Reactive) {
      if (data.implementation == ReactiveImplementation.Zip)
        return changeZip(data, event);
    }
    if (data.kind == GraphNodeKind.Args) return argIsValid(data, event);
    if (data.kind == GraphNodeKind.Returns) return returnIsValid(data, event);
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
  stream: PortFragment[];
  type: PortType;
  index: number;
  allowTransforms: boolean;
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
        globalsMap: {},
        title: "To List",
        description: "Transforms a stream into a list",
        kind: GraphNodeKind.Reactive,
        ins: [instream],
        constantsMap: {},
        outs: [instream.map((p, index) => singleToList(p))],
        constants: [],
        implementation: ReactiveImplementation.ToList,
      },
    };
  }

  if (transform == "round_float") {
    return {
      id: nodeIdBuilder(),
      type: "ReactiveNode",
      position: position,
      data: {
        globalsMap: {},
        title: "Round",
        description: "Round a flout to the nearest int",
        kind: GraphNodeKind.Reactive,
        ins: [instream],
        constantsMap: {},
        outs: [instream.map((p, index) => ({ ...p, kind: PortKind.Int }))],
        constants: [],
        implementation: ReactiveImplementation.ToList,
      },
    };
  }

  if (transform == "to_float") {
    return {
      id: nodeIdBuilder(),
      type: "ReactiveNode",
      position: position,
      data: {
        globalsMap: {},
        title: "Convert to Float",
        description: "Round a int to a float",
        kind: GraphNodeKind.Reactive,
        ins: [instream],
        constantsMap: {},
        outs: [instream.map((p, index) => ({ ...p, kind: PortKind.Float }))],
        constants: [],
        implementation: ReactiveImplementation.ToList,
      },
    };
  }

  if (transform == "from_list") {
    return {
      id: nodeIdBuilder(),
      type: "ReactiveNode",
      position: position,
      data: {
        globalsMap: {},
        title: "Chunk",
        description: "Transforms a stream into an item of chunks",
        kind: GraphNodeKind.Reactive,
        ins: [instream],
        constantsMap: {},
        outs: [
          instream.map((p, index) => listPortToSingle(p, "Chunked" + p.key)),
        ],
        constants: [],
        implementation: ReactiveImplementation.ToList,
      },
    };
  }

  if (transform == "ensure") {
    return {
      id: nodeIdBuilder(),
      type: "ReactiveNode",
      position: position,
      data: {
        globalsMap: {},
        title: "Ensure",
        description:
          "Ensures that the stream has no null items (will raise an error if it is)",
        kind: GraphNodeKind.Reactive,
        ins: [instream],
        constantsMap: {},
        outs: [instream.map((p) => ({ ...p, nullable: false }))],
        constants: [],
        implementation: ReactiveImplementation.Ensure,
      },
    };
  }

  throw new Error("Unknown transform");
};

export const createVanillaTransformEdge = (
  id: string,
  source: string,
  sourceStream: number,
  target: string,
  targetStream: number,
): FlowEdge => {
  return {
    id: id,
    source: source,
    sourceHandle: "return_" + sourceStream,
    target: target,
    targetHandle: "arg_" + targetStream,
    type: "VanillaEdge",
    data: {
      __typename: "VanillaEdge",
      id: id,
      kind: GraphEdgeKind.Vanilla,
      stream: [],
      source: source,
      sourceHandle: "return_" + sourceStream,
      target: target,
      targetHandle: "arg_" + targetStream,
    },
  };
};

export const removeEdgeAndSolve = (
  state: ValidationResult,
  edgeID: string,
  message: string,
) => {
  let edge = state.edges.find((e) => e.id == edgeID);
  if (!edge) throw new Error("Edge not found. Should never throw");
  state.edges = state.edges.filter((e) => e.id != edgeID);
  state.solvedErrors = [
    ...state.solvedErrors,
    {
      type: "edge",
      id: edgeID,
      comparing: {
        sourceStreamIndex: handleToStream(edge.sourceHandle),
        sourceItemIndex: 0,
        targetStreamIndex: handleToStream(edge.targetHandle),
        targetItemIndex: 0,
      },
      message: message,
      level: "critical",
      solvedBy: "Removing the Edge",
    },
  ];
};

export const addEdgeAndSolve = (
  state: ValidationResult,
  edge: FlowEdge,
  message: string,
) => {
  state.edges = [...state.edges, edge];
  state.solvedErrors = [
    ...state.solvedErrors,
    {
      type: "edge",
      id: edge.id,
      message: message,
      level: "critical",
      solvedBy: "Adding an Edge",
    },
  ];
};

export const addNodeAndSolve = (
  state: ValidationResult,
  node: FlowNode,
  message: string,
) => {
  state.nodes = [...state.nodes, node];
  state.solvedErrors = [
    ...state.solvedErrors,
    {
      type: "node",
      id: node.id,
      message: message,
      level: "critical",
      solvedBy: "Added a Node",
    },
  ];
};

export const findSourceForEdgeID = (
  state: ValidationResult,
  edgeID: string,
): FlowNode => {
  let edge = state.edges.find((e) => e.id == edgeID);
  if (!edge) throw new Error("Edge not found. Should never throw");
  let node = state.nodes.find((n) => n.id == edge.source);
  if (!node) throw new Error("Node not found. Should never throw");
  return node;
};

export const findSourceStreamForEdgeID = (
  state: ValidationResult,
  edgeID: string,
): number => {
  let edge = state.edges.find((e) => e.id == edgeID);
  if (!edge) throw new Error("Edge not found. Should never throw");
  return handleToStream(edge.sourceHandle);
};

export const findTargetStreamForEdgeID = (
  state: ValidationResult,
  edgeID: string,
): number => {
  let edge = state.edges.find((e) => e.id == edgeID);
  if (!edge) throw new Error("Edge not found. Should never throw");
  return handleToStream(edge.targetHandle);
};

export const findTargetForEdgeID = (
  state: ValidationResult,
  edgeID: string,
): FlowNode => {
  let edge = state.edges.find((e) => e.id == edgeID);
  if (!edge) throw new Error("Edge not found. Should never throw");
  let node = state.nodes.find((n) => n.id == edge.target);
  if (!node) throw new Error("Node not found. Should never throw");
  return node;
};

export const findNodeForID = (
  state: ValidationResult,
  nodeID: string,
): FlowNode => {
  let node = state.nodes.find((n) => n.id == nodeID);
  if (!node) throw new Error("Node not found. Should never throw");
  return node;
};

export const addTransform = (
  state: ValidationResult,
  options: TransitionOptions,
  transform: Transform,
): void => {
  // We remove the original edge
  // We need to add transform to the right direction

  let targetNode = findTargetForEdgeID(state, options.edgeID);
  let sourceNode = findSourceForEdgeID(state, options.edgeID);

  let sourceStream = findSourceStreamForEdgeID(state, options.edgeID);
  let targetStream = findTargetStreamForEdgeID(state, options.edgeID);

  let targetNodePosition = targetNode.position; // node is target
  let sourceNodePostion = sourceNode.position; // node is source

  let inbetweenPosition: XYPosition = {
    x: (targetNodePosition.x + sourceNodePostion.x) / 2,
    y: (targetNodePosition.y + sourceNodePostion.y) / 2,
  };

  let transformNode = getTransform(
    transform,
    options.stream,
    inbetweenPosition,
  );

  const toTransformEdge = createVanillaTransformEdge(
    options.edgeID, //reusing the old id
    sourceNode.id,
    sourceStream,
    transformNode.id,
    0, //transform ports are always 0
  );

  const toTargetEdge = createVanillaTransformEdge(
    options.edgeID + "-transform", //adding suffix old id
    transformNode.id,
    0,
    targetNode.id,
    targetStream, //transform ports are always 0
  );

  removeEdgeAndSolve(state, options.edgeID, "Removed because of transform");
  addNodeAndSolve(state, transformNode, "Added because of transform");
  addEdgeAndSolve(state, toTransformEdge, "Added because of transform");
  addEdgeAndSolve(state, toTargetEdge, "Added because of transform");
};

export const transitionOrCut = (
  state: ValidationResult,
  options: TransitionOptions,
): void => {
  let changeCount = options.runningCount;
  let node = state.nodes.find((n) => n.id == options.nodeID);
  if (!node) throw new Error("Node not found. Should never throw");

  let outcome = propagateChange(node.data, {
    type: options.type,
    stream: options.stream,
    index: options.index,
  });

  if (outcome.needsTransform) {
    if (options.allowTransforms) {
      addTransform(state, options, outcome.needsTransform);
    } else {
      removeEdgeAndSolve(
        state,
        options.edgeID,
        "Removed because of unallowed transform.",
      );
      return;
    }
  }

  if (outcome.denied) {
    console.log("Denied", outcome.denied);
    removeEdgeAndSolve(state, options.edgeID, outcome.denied);
    return;
  }

  // Only change the node if the data has changed and the node is not denied
  if (outcome.data) {
    // The node needs to change because of the transition
    state.nodes = state.nodes.map((n) => {
      if (n.id == options.nodeID) {
        if (outcome.data == undefined)
          throw new Error("Data is undefined. Should never throw");
        return { ...n, data: outcome.data };
      }
      return n;
    });
  }

  if (outcome.changes) {
    // We need to propagate the changes of this change

    let removedEdges: FlowEdge[] = [];
    let solvedErrors: SolvedError[] = [];

    for (let change of outcome.changes) {
      // find all edges that have this node as source or target
      if (change.type == "source") {
        let affectedEdges = [
          ...state.edges.filter((e) => e.source == options.nodeID),
        ]; // We need to copy the array because we are changing it
        for (let edge of affectedEdges) {
          if (changeCount < options.maxCount) {
            transitionOrCut(state, {
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
          ...state.edges.filter((e) => e.target == options.nodeID),
        ]; // We need to copy the array because we are changing it
        for (let edge of affectedEdges) {
          if (changeCount < options.maxCount) {
            transitionOrCut(state, {
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
    state.edges = state.edges.filter((e) => !removedEdges.includes(e));
    state.solvedErrors = [...state.solvedErrors, ...solvedErrors];
  }
};

export const istriviallyIntegratable = (
  state: FlowState,
  connection: Connection,
): boolean => {
  const sourceNode = state.nodes.find((n) => n.id == connection.source);
  const targetNode = state.nodes.find((n) => n.id == connection.target);

  const sourceStreamIndex = handleToStream(connection.sourceHandle);
  const targetStreamIndex = handleToStream(connection.targetHandle);

  const sourceStream = sourceNode?.data.outs.at(sourceStreamIndex);
  const targetStream = targetNode?.data.ins.at(targetStreamIndex);

  if (targetNode?.type == "ReactiveNode") {
    return state.edges.find((e) => e.source == targetNode.id) == undefined; // We can always connect to a reactive node if it has not outgoing edges
  }

  if (sourceStream == undefined || targetStream == undefined) return false;

  // Args and Returns are always trivially integratable if they have no connections
  if (sourceNode?.type == "ArgNode")
    return state.edges.find((e) => e.source == sourceNode.id) == undefined;
  if (targetNode?.type == "ReturnNode")
    return state.edges.find((e) => e.target == targetNode.id) == undefined;

  return isSameStream(sourceStream, targetStream);
};

// Can throw errors
/**
 * Validates and integrates a connection into the flow state.
 *
 * @param state - The current flow state.
 * @param connection - The connection to integrate.
 * @returns The updated flow state after integration.
 * @throws Error if source ID or target ID is not found, or if source or target node is not found, or if source or target handle is not found, or if source or target stream is not found.
 */
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

  const initialState: ValidationResult = {
    ...state,
    edges: [...state.edges, edge],
    solvedErrors: [],
    remainingErrors: [],
    valid: true,
  };

  let validatableChangeRightState = { ...initialState };

  let transitionRightOptions: TransitionOptions = {
    maxCount: 10,
    runningCount: 0,
    nodeID: targetNodeID,
    stream: sourceStream,
    type: "target",
    index: targetStreamIndex,
    edgeID: newID,
    allowTransforms: true,
  };

  // This will recursively transition nodes leaving the initial node
  // and add all the edges that are needed to the state to account
  // for the new connection
  transitionOrCut(validatableChangeRightState, transitionRightOptions);

  let validatableChangeLeftState = { ...initialState };

  let transitionLeftOptions: TransitionOptions = {
    maxCount: 10,
    runningCount: 0,
    nodeID: sourceNodeID,
    stream: targetStream,
    type: "source",
    index: sourceStreamIndex,
    edgeID: newID,
    allowTransforms: true,
  };

  transitionOrCut(validatableChangeLeftState, transitionLeftOptions);
  console.log(transitionLeftOptions, transitionRightOptions);

  // Lets find out which one is better
  const edgeIsInLeft = validatableChangeLeftState.edges.find(
    (e) => e.id == newID,
  );

  const edgeIsInRight = validatableChangeRightState.edges.find(
    (e) => e.id == newID,
  );

  console.log(validatableChangeRightState, validatableChangeLeftState);

  if (edgeIsInLeft && edgeIsInRight) {
    // Find out which one is better
    return validatableChangeRightState;
  } else {
    if (edgeIsInLeft) {
      return validatableChangeLeftState;
    } else if (edgeIsInRight) {
      return validatableChangeRightState;
    } else {
      //TODO: Find out which one is better right is better for now
      return validatableChangeRightState;
    }
  }
};
