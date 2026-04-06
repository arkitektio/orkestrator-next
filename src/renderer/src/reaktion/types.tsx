import {
  ArgNodeFragment,
  BaseGraphEdgeFragment,
  BaseGraphNodeFragment,
  StreamItemFragment as FlussStreamItemFragment,
  GlobalArg,
  GlobalArgFragment,
  GlobalArgInput,
  GraphEdgeFragment,
  GraphEdgeInput,
  GraphFragment,
  GraphNodeFragment,
  GraphNodeInput,
  PortKind as FlussPortKind,
  LoggingEdgeFragment,
  ReactiveNodeFragment,
  RekuestFilterActionNodeFragment,
  RekuestMapActionNodeFragment,
  ReturnNodeFragment,
  VanillaEdgeFragment,
  AgentSubFlowNodeFragment,
  FlussArgPortFragment,
  FlussReturnPortFragment,
  FlussArgChildPortFragment,
  FlussReturnChildPortFragment,
} from "@/reaktion/api/graphql";
import {
  Connection,
  Edge,
  EdgeProps,
  Node,
  NodeProps,
  OnConnectStartParams,
} from "@xyflow/react";

export type DataEnhancer<T, L = {}> = T & { extras?: L };

export type ArgNodeData = DataEnhancer<ArgNodeFragment>;
export type ReturnNodeData = DataEnhancer<ReturnNodeFragment>;
export type RekuestMapNodeData = DataEnhancer<RekuestMapActionNodeFragment>;
export type RekuestFilterNodeData = DataEnhancer<RekuestFilterActionNodeFragment>;
export type ReactiveNodeData = DataEnhancer<ReactiveNodeFragment>;
export type AgentSubFlowNodeData = DataEnhancer<AgentSubFlowNodeFragment>;


export type GeneralPort = FlussArgPortFragment | FlussReturnPortFragment | FlussArgChildPortFragment | FlussReturnChildPortFragment
export type ArgPort = FlussArgPortFragment;
export type ReturnPort = FlussReturnPortFragment;
export const PortKind = FlussPortKind









export type NodeData =
  | ArgNodeData
  | ReturnNodeData
  | RekuestMapNodeData
  | RekuestFilterNodeData
  | ReactiveNodeData
  | AgentSubFlowNodeData;

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

type TypedNodeProps<T extends BaseGraphNodeFragment> = NodeProps<FlowNode<T>>;

export type ArgNodeProps = TypedNodeProps<ArgNodeFragment>;
export type ReturnNodeProps = TypedNodeProps<ReturnNodeFragment>;
export type IONodeProps = ArgNodeProps | ReturnNodeProps;

export type RekuestMapNodeProps = TypedNodeProps<RekuestMapActionNodeFragment>;
export type RekuestFilterNodeProps = TypedNodeProps<RekuestFilterActionNodeFragment>;
export type ReactiveNodeProps = TypedNodeProps<ReactiveNodeFragment>;
export type AgentSubFlownNodeProps = TypedNodeProps<AgentSubFlowNodeFragment>;

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
  sourcePort: FlussPortFragment[];
  targetPort: FlussPortFragment[];
  sourceTypes: string[];
  targetTypes: string[];
  nodes: FlowNode[];
  edges: FlowEdge[];
  args: (FlussPortFragment | null)[];
  returns: (FlussPortFragment | null)[];
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

export type ActionFragment = GraphNodeFragment;
export type EdgeFragement = GraphEdgeFragment;
export type GlobalFragment = GlobalArgFragment;
export type StreamItemFragment = FlussStreamItemFragment;

export type RelativePosition =
  | "bottomright"
  | "bottomleft"
  | "topright"
  | "topleft";

export type DropContextualParams = {
  handleType: "source" | "target";
  causingNode: FlowNode;
  causingStream: number;
  relativePosition: RelativePosition;
  position: { x: number; y: number };
  event: MouseEvent | TouchEvent;
  connectionParams: OnConnectStartParams;
};

export type SubflowDropContextualParams = DropContextualParams & {
  subflowNodeId: string;
  subflowNode: Node<AgentSubFlowNodeData, "AgentSubFlowNode">;
};

export type ClickContextualParams = {
  position: { x: number; y: number };
  event: MouseEvent | TouchEvent;
};

export type EdgeContextualParams = {
  edgeId: string;
  position: { x: number; y: number };
  event: MouseEvent | TouchEvent;
  leftNode: FlowNode;
  leftStream: number;
  rightNode: FlowNode;
  rightStream: number;
};

export type ConnectContextualParams = {
  connection: Connection;
  leftNode: FlowNode;
  leftStream: number;
  rightNode: FlowNode;
  rightStream: number;
  position: { x: number; y: number };
};

export type NodeContextualAction =
  | { type: "implementations"; appIdentifier: string; }

export type NodeContextualParams = {
  nodeId: string;
  subFlowNode: Node<AgentSubFlowNodeData, "AgentSubFlowNode">;
  position: { x: number; y: number };
};

export type ReactiveNodeSuggestions = {
  node: FlowNode;
  title: string;
  description: string;
};

export type ContextualParams =
  | ({ kind: "drop"; id: string } & DropContextualParams)
  | ({ kind: "subflowdrop"; id: string } & SubflowDropContextualParams)
  | ({ kind: "click"; id: string } & ClickContextualParams)
  | ({ kind: "edge"; id: string } & EdgeContextualParams)
  | ({ kind: "connect"; id: string } & ConnectContextualParams)
  | ({ kind: "node"; id: string } & NodeContextualParams);



export type AnyNode = Node<ArgNodeData, "ArgNode"> | Node<ReturnNodeData, "ReturnNode"> | Node<RekuestMapNodeData, "RekuestMapNode"> | Node<RekuestFilterNodeData, "RekuestFilterNode"> | Node<ReactiveNodeData, "ReactiveNode"> | Node<AgentSubFlowNodeData, "AgentSubFlowNode">;
