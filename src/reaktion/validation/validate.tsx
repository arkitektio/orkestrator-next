import { GraphNodeKind } from "@/reaktion/api/graphql";
import { buildZodSchema } from "@/rekuest/widgets/utils";
import { ZodError } from "zod";
import { FlowEdge, FlowNode } from "../types";
import { SolvedError, ValidationError, ValidationResult } from "./types";

const validateNoEdgeWithItself = (
  previous: ValidationResult,
): Partial<ValidationResult> => {
  let validatedEdges: FlowEdge[] = [];
  let solvedErrors: SolvedError[] = [];

  for (let edge of previous.edges) {
    if (edge.source == edge.target) {
      solvedErrors.push({
        type: "edge",
        id: edge.id,
        message: "Edge with itself",
        level: "warning",
        solvedBy: "Removing the Edge",
      });
    } else {
      validatedEdges.push(edge);
    }
  }

  return {
    ...previous,
    edges: validatedEdges,
    solvedErrors: solvedErrors,
  };
};

const handleToStream = (sourceHandle: string | null | undefined): number => {
  if (!sourceHandle) return -1;
  const parts = sourceHandle.split("_");
  return parseInt(parts[parts.length - 1]);
};

const validateMatchingPorts = (
  previous: ValidationResult,
): Partial<ValidationResult> => {
  let validatedEdges: FlowEdge[] = [];
  let solvedErrors: SolvedError[] = previous.solvedErrors;
  let remain: ValidationError[] = [];

  for (let edge of previous.edges) {
    const sourceNode = previous.nodes.find((n) => n.id == edge.source);
    const targetNode = previous.nodes.find((n) => n.id == edge.target);

    const sourceStreamIndex = handleToStream(edge.sourceHandle);
    const targetStreamIndex = handleToStream(edge.targetHandle);

    const sourceStream = sourceNode?.data.outs.at(sourceStreamIndex);
    const targetStream = targetNode?.data.ins.at(targetStreamIndex);

    if (sourceStream == undefined || targetStream == undefined) {
      solvedErrors.push({
        type: "edge",
        id: edge.id,
        level: "critical",
        message: "Edge with non existing handles. This is bad",
        solvedBy: "Removing the edge",
      });
      continue;
    }

    if (sourceStream.length != targetStream.length) {
      solvedErrors.push({
        type: "edge",
        id: edge.id,
        level: "warning",
        message: "Connecting edge does not have correct number of ports",
        solvedBy: "Removing the edge",
      });
      continue;
    }

    let streamsMatch = true;

    for (
      let sourceItemIndex = 0;
      sourceItemIndex < sourceStream.length;
      sourceItemIndex++
    ) {
      if (
        sourceStream[sourceItemIndex].kind != targetStream[sourceItemIndex].kind
      ) {
        solvedErrors.push({
          type: "edge",
          id: edge.id,
          comparing: {
            sourceItemIndex,
            sourceStreamIndex,
            targetItemIndex: sourceItemIndex,
            targetStreamIndex,
          },
          level: "warning",
          message: "Port Kind mismatch",
          solvedBy: "Removing the edge",
        });
        streamsMatch = false;
      }
      if (
        sourceStream[sourceItemIndex].identifier !=
        targetStream[sourceItemIndex].identifier
      ) {
        solvedErrors.push({
          type: "edge",
          id: edge.id,
          comparing: {
            sourceItemIndex,
            sourceStreamIndex,
            targetItemIndex: sourceItemIndex,
            targetStreamIndex,
          },
          level: "warning",
          message: "Port Identifier mismatch",
          solvedBy: "Removing the edge",
        });
        streamsMatch = false;
      }
    }

    if (!streamsMatch) continue;
    validatedEdges.push(edge);
  }

  return {
    ...previous,
    edges: validatedEdges,
    solvedErrors: solvedErrors,
    remainingErrors: remain,
  };
};

const validateNoUnconnectedNodes = (
  previous: ValidationResult,
): Partial<ValidationResult> => {
  let remain: ValidationError[] = previous.remainingErrors;

  for (let node of previous.nodes) {
    const targetEdge = previous.edges.find((n) => n.target == node.id);
    const sourceEdge = previous.edges.find((n) => n.source == node.id);

    if (targetEdge == undefined && sourceEdge == undefined) {
      console.log("Node with no ins and outs", node);
      remain.push({
        type: "node",
        id: node.id,
        level: "critical",
        message: "Node with no ins and outs. This is bad",
      });
      continue;
    }
  }

  return {
    ...previous,
    remainingErrors: remain,
  };
};

function validateGraphIsConnected(previous: ValidationResult) {
  let remain: ValidationError[] = previous.remainingErrors;
  const nodes = previous.nodes;
  const edges = previous.edges;

  const adjacencyList: { [key: string]: string[] } = {};

  // Initialize adjacency list with empty arrays for each node
  nodes.forEach((node) => {
    adjacencyList[node.id] = [];
  });

  // Populate adjacency list with edges
  edges.forEach((edge) => {
    adjacencyList[edge.source].push(edge.target);
    // If it's an undirected graph, add the edge in the reverse direction as well
    adjacencyList[edge.target].push(edge.source);
  });

  // Depth-First Search to check for connectivity
  function dfs(visited: Set<string>, nodeId: string): void {
    visited.add(nodeId);
    adjacencyList[nodeId].forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        dfs(visited, neighbor);
      }
    });
  }

  const visited = new Set<string>();
  dfs(visited, nodes[0].id); // Start DFS from the first node

  // If the number of visited nodes is the same as the number of nodes, the graph is connected
  if (visited.size !== nodes.length) {
    remain.push({
      type: "graph",
      id: "",
      level: "critical",
      message:
        "Subgraphs exist. Please create at least one connection between all nodes",
    });
  }

  return {
    ...previous,
    remainingErrors: remain,
  };
}

function atLeastOneNode(previous: ValidationResult) {
  let remain: ValidationError[] = previous.remainingErrors;
  const nodes = previous.nodes;
  // If the number of visited nodes is the same as the number of nodes, the graph is connected
  if (!nodes.find((n) => n.data.kind == GraphNodeKind.Args)) {
    remain.push({
      type: "graph",
      id: "",
      level: "critical",
      message: "You need an Args node",
    });
  }

  if (!nodes.find((n) => n.data.kind == GraphNodeKind.Returns)) {
    remain.push({
      type: "graph",
      id: "",
      level: "critical",
      message: "You need an Return node",
    });
  }

  if (
    nodes.filter(
      (n) =>
        n.data.kind != GraphNodeKind.Returns &&
        n.data.kind != GraphNodeKind.Args,
    ).length == 0
  ) {
    remain.push({
      type: "graph",
      id: "",
      level: "critical",
      message: "Very funny. You need at least one node",
    });
  }

  return {
    ...previous,
    remainingErrors: remain,
  };
}

const validators = [
  validateNoEdgeWithItself,
  validateMatchingPorts,
  validateNoUnconnectedNodes,
  validateGraphIsConnected,
  atLeastOneNode,
];

export const validateNodeConstants = (
  state: ValidationResult,
  node: FlowNode,
): ValidationResult => {
  console.log("Validating node constants");
  const schema = buildZodSchema(
    node.data.constants.filter((k) => !(k.key in node.data.globalsMap)),
  ); // Only validate non global constants
  try {
    schema.parse(node.data.constantsMap);
    return state;
  } catch (e) {
    console.log("Validation error", e, node.data.constantsMap);
    let validationError = e as ZodError;

    let newRemainingErrors: ValidationError[] = [];

    validationError.issues.forEach((element) => {
      const path = element.path;

      newRemainingErrors.push({
        type: "node",
        id: node.id,
        path: path.at(0) || "",
        level: "critical",
        message: element.message,
      });
    });

    return {
      ...state,
      valid: false,
      remainingErrors: [...state.remainingErrors, ...newRemainingErrors],
    };
  }
};

export type ValidationOptions = {
  validateNodeDefaults: boolean;
  validateNoUnconnectedNodes: boolean;
};

export const validateState = (
  initial: ValidationResult,
  options?: ValidationOptions,
): ValidationResult => {
  if (options == undefined)
    options = { validateNodeDefaults: true, validateNoUnconnectedNodes: true };

  console.log("Validation initial", initial);
  for (let validator of validators) {
    let validated = validator(initial);
    initial = { ...initial, ...validated };
  }

  if (options.validateNodeDefaults && false) {
    for (let node of initial.nodes) {
      let validated = validateNodeConstants(initial, node);
      initial = { ...initial, ...validated };
    }
  }

  console.log("Validation result", initial);

  return initial;
};
