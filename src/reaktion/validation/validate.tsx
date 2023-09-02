import { FlowEdge } from "../types";
import {
  FlowState,
  SolvedError,
  ValidationError,
  ValidationResult,
} from "./types";

const validateNoEdgeWithItself = (
  previous: ValidationResult,
): Partial<ValidationResult> => {
  let validatedEdges: FlowEdge[] = [];
  let solvedErrors: SolvedError[] = [];

  for (let edge of previous.state.edges) {
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
    state: { ...previous.state, edges: validatedEdges },
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
  let solvedErrors: SolvedError[] = [];
  let remain: ValidationError[] = [];

  for (let edge of previous.state.edges) {
    const sourceNode = previous.state.nodes.find((n) => n.id == edge.source);
    const targetNode = previous.state.nodes.find((n) => n.id == edge.target);

    const sourceStreamIndex = handleToStream(edge.sourceHandle);
    const targetStreamIndex = handleToStream(edge.targetHandle);

    const sourceStream = sourceNode?.data.outs.at(sourceStreamIndex);
    const targetStream = targetNode?.data.ins.at(targetStreamIndex);

    if (sourceStream == undefined || targetStream == undefined) {
      remain.push({
        type: "edge",
        id: edge.id,
        level: "critical",
        message: "Edge with non existing handles. This is bad",
      });
      continue;
    }

    if (sourceStream.length != targetStream.length) {
      remain.push({
        type: "edge",
        id: edge.id,
        level: "warning",
        message: "Connecting edge does not have correct number of ports",
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
        remain.push({
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
        });
        streamsMatch = false;
      }
      if (
        sourceStream[sourceItemIndex].identifier !=
        targetStream[sourceItemIndex].identifier
      ) {
        remain.push({
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
        });
        streamsMatch = false;
      }
    }

    if (!streamsMatch) continue;
    validatedEdges.push(edge);
  }

  return {
    state: { ...previous.state, edges: validatedEdges },
    solvedErrors: solvedErrors,
    remainingErrors: remain,
  };
};

const validators = [validateNoEdgeWithItself, validateMatchingPorts];

export const validateState = (state: FlowState): ValidationResult => {
  let initial: ValidationResult = {
    state: state,
    valid: true,
    solvedErrors: [],
    remainingErrors: [],
  };

  for (let validator of validators) {
    let validated = validator(initial);
    initial = { ...initial, ...validated };
  }

  return initial;
};
