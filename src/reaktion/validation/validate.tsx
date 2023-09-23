import { yupSchemaBuilder } from "@jhnnsrs/rekuest-next";
import { FlowEdge, FlowNode } from "../types";
import {
  FlowState,
  SolvedError,
  ValidationError,
  ValidationResult,
} from "./types";
import { ValidationError as YupValidationError } from "yup";

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
  let solvedErrors: SolvedError[] = [];
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

const validators = [validateNoEdgeWithItself, validateMatchingPorts];

export const validateNodeConstants = (
  state: ValidationResult,
  node: FlowNode,
): ValidationResult => {
  console.log("Validating node constants");
  const schema = yupSchemaBuilder(
    node.data.constants.filter((k) => !(k.key in node.data.globalsMap)),
  ); // Only validate non global constants
  try {
    schema.validateSync(node.data.constantsMap, { abortEarly: false });
    return state;
  } catch (e) {
    console.log("Validation error", e);
    let validationError = e as YupValidationError;

    let newRemainingErrors: ValidationError[] = [];

    validationError.inner.forEach((element) => {
      const path = element.path;

      newRemainingErrors.push({
        type: "node",
        id: node.id,
        path: path,
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
};

export const validateState = (
  state: FlowState,
  options?: ValidationOptions,
): ValidationResult => {
  if (options == undefined) options = { validateNodeDefaults: true };

  let initial: ValidationResult = {
    ...state,
    valid: true,
    solvedErrors: [],
    remainingErrors: [],
  };

  console.log("Validation initial", initial);
  for (let validator of validators) {
    let validated = validator(initial);
    initial = { ...initial, ...validated };
  }

  if (options.validateNodeDefaults) {
    for (let node of initial.nodes) {
      let validated = validateNodeConstants(initial, node);
      initial = { ...initial, ...validated };
    }
  }

  console.log("Validation result", initial);

  return initial;
};
