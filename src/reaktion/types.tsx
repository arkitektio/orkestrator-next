import {
  ArgNodeFragment,
  ArkitektGraphNodeFragment,
  BaseGraphEdgeFragment,
  BaseGraphNodeFragment,
  GlobalArg,
  GlobalArgFragment,
  GlobalArgInput,
  GraphEdgeFragment,
  GraphEdgeInput,
  GraphFragment,
  GraphNodeFragment,
  GraphNodeInput,
  LoggingEdgeFragment,
  PortFragment,
  ReactiveNodeFragment,
  ReturnNodeFragment,
  VanillaEdgeFragment,
} from "@/reaktion/api/graphql";
import { Connection, Edge, EdgeProps, Node, NodeProps } from "reactflow";

export type DataEnhancer<T, L = {}> = T & { extras?: L };

export type ArgNodeData = DataEnhancer<ArgNodeFragment>;
export type ReturnNodeData = DataEnhancer<ReturnNodeFragment>;
export type ArkitektNodeData = DataEnhancer<ArkitektGraphNodeFragment>;
export type ReactiveNodeData = DataEnhancer<ReactiveNodeFragment>;

export type NodeData =
  | ArgNodeData
  | ReturnNodeData
  | ArkitektNodeData
  | ReactiveNodeData;

export type ArgNodeProps = NodeProps<ArgNodeData>;
export type ReturnNodeProps = NodeProps<ReturnNodeData>;
export type IONodeProps = ArgNodeProps | ReturnNodeProps;

export type ArkitektNodeProps = NodeProps<ArkitektNodeData>;
export type ReactiveNodeProps = NodeProps<ReactiveNodeData>;

export type Elements = Element[];

export type FlowGraph = GraphFragment;
export type FlowEdges = FlowGraph["edges"];

export type NodeTypeUnion = Exclude<
  BaseGraphNodeFragment["__typename"],
  null | undefined
>;

export type EdgeTypeUnion = Exclude<
  BaseGraphEdgeFragment["__typename"],
  null | undefined
>;

export type EnhancedEdge<T = {}> = Edge<T & BaseGraphEdgeFragment> & {
  type: EdgeTypeUnion;
};

export type FlowNodeInherent = "id" | "position" | "__typename";
export type FlowEdgeInherent =
  | "id"
  | "source"
  | "target"
  | "__typename"
  | "sourceHandle"
  | "targetHandle";

export type FlowNodeData<T = GraphNodeFragment> = Omit<
  T & BaseGraphNodeFragment,
  FlowNodeInherent
>;

export type FlowEdgeData<T = GraphEdgeFragment> = Omit<
  T & BaseGraphEdgeFragment,
  FlowEdgeInherent
>;
export type FlowNode<T extends BaseGraphNodeFragment = BaseGraphNodeFragment> =
  Node<FlowNodeData<T>, NodeTypeUnion>;
export type FlowEdge<T = GraphEdgeFragment> = Edge<FlowEdgeData<T>>;

export type VanillaEdgeProps = EdgeProps<VanillaEdgeFragment>;
export type LoggingEdgeProps = EdgeProps<LoggingEdgeFragment>;

export type ConnectionError = {
  message: string;
};

export type NewState = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  globals: GlobalArg[];
};

export type ConnectionUpdate = {
  state: NewState;
  errors?: ConnectionError[];
};

export type Connector<
  X extends BaseGraphNodeFragment = BaseGraphNodeFragment,
  Y extends BaseGraphNodeFragment = BaseGraphNodeFragment,
> = (options: {
  params: Connection;
  sourceNode: FlowNode<X>;
  targetNode: FlowNode<Y>;
  sourcePort: PortFragment[];
  targetPort: PortFragment[];
  sourceTypes: string[];
  targetTypes: string[];
  nodes: FlowNode[];
  edges: FlowEdge[];
  args: (PortFragment | null)[];
  returns: (PortFragment | null)[];
}) => ConnectionUpdate;

export enum RiverMode {
  EDIT = "EDIT",
  VIEW = "VIEW",
  ASSIGNATION = "ASSIGNATION",
  PROVISION = "PROVISION",
}

export type ConnectionMap = {
  [k in NodeTypeUnion]: {
    [t in NodeTypeUnion]: Connector;
  };
};

export type NodeTypes = {
  [l in NodeTypeUnion]: React.FC<NodeProps>;
};
export type EdgeTypes = { [l in EdgeTypeUnion]: React.FC<EdgeProps> };

export type NodeInput = GraphNodeInput;
export type EdgeInput = GraphEdgeInput;
export type GlobalInput = GlobalArgInput;

export type NodeFragment = GraphNodeFragment;
export type EdgeFragement = GraphEdgeFragment;
export type GlobalFragment = GlobalArgFragment;
export type StreamItemFragment = StreamItemFragment;
