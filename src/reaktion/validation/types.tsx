import { GlobalArg, PortFragment } from "@/rekuest/api/graphql";
import { FlowEdge, FlowNode, FlowNodeData, NodeData } from "../types";

export type Compare = {
  sourceStreamIndex: number;
  sourceItemIndex: number;
  targetStreamIndex: number;
  targetItemIndex: number;
};

export type ValidationError = {
  type: "node" | "edge";
  level: "critical" | "warning";
  comparing?: Compare;
  id: string;
  message: string;
};

export type SolvedError = ValidationError & {
  solvedBy: string;
};

export type ValidationResult = {
  state: FlowState;
  valid: boolean;
  solvedErrors: SolvedError[];
  remainingErrors: ValidationError[];
};

export type FlowState = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  globals: GlobalArg[];
};

export type PortType = "source" | "target";

export type Transform = "to_list";

export type ChangeEvent = {
  stream: PortFragment[];
  type: PortType;
  index: number;
};

// Source means that this nodes source port has changed
// Target means that this nodes target port has changed
export type CausedChange = ChangeEvent[];

// Source means that a we are changing a source port

export type ChangeOutcome = {
  data?: FlowNodeData;
  changes?: ChangeEvent[];
  needsTransforms?: Transform[];
  denied?: string;
};

export type ChangeNodeFunction = (
  data: NodeData,
  event: ChangeEvent,
) => ChangeOutcome;
