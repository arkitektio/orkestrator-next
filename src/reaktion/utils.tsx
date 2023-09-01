import { convertPortToInput } from "@/rekuest/utils";
import {
  EdgeFragement,
  EdgeInput,
  FlowEdge,
  FlowNode,
  GlobalFragment,
  GlobalInput,
  NodeFragment,
  NodeInput,
  NodeTypeUnion,
  StreamItemFragment,
} from "./types";
import {
  ArkitektGraphNodeFragment,
  GlobalArgFragment,
  GlobalArgInput,
  GraphNodeKind,
  GraphNodeNodeFragment,
  StreamItemInput,
  NodeKind,
  MapStrategy,
} from "@/rekuest/api/graphql";
import { v4 as uuidv4 } from "uuid";
import { portToDefaults } from "@jhnnsrs/rekuest-next";

export const globalArgKey = (id: string, key: string) => {
  return `${id}.${key}`;
};

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  if (value === null || value === undefined) return false;
  return true;
}

export function keyInObject(
  key: string,
  obj: any
): obj is {
  [key: string]: any;
} {
  return obj && key in obj;
}

export const nodes_to_flownodes = (nodes: NodeFragment[]): FlowNode[] => {
  const nodes_ =
    nodes
      ?.map((node) => {
        if (node) {
          const { id, position, __typename, ...rest } = node;
          const node_: FlowNode = {
            type: __typename,
            id: id,
            position: position,
            data: node,
            dragHandle: ".custom-drag-handle",
            parentNode: rest.parentNode ? rest.parentNode : undefined,
          };
          return node_;
        }
        return undefined;
      })
      .filter(notEmpty) || [];

  return nodes_;
};

export const edges_to_flowedges = (edges: EdgeFragement[]): FlowEdge[] => {
  const flowedges =
    edges
      ?.map((edge) => {
        if (edge) {
          const { id, source, sourceHandle, target, targetHandle } = edge;
          const flowedge: FlowEdge = {
            id,
            type: edge.__typename,
            source,
            sourceHandle,
            target,
            targetHandle,
            data: edge,
          };
          return flowedge;
        }
        return undefined;
      })
      .filter(notEmpty) || [];

  return flowedges;
};

export const flowNodeToInput = (node: FlowNode): NodeInput => {
  const {
    id,
    position,
    parentNode,
    data: { outs, constants, ins, __typename, ...rest },
  } = node;
  if (!__typename) throw new Error("No type");
  const node_: NodeInput = {
    ins: ins.map((s) => s.map(convertPortToInput)),
    outs: outs.map((s) => s.map(convertPortToInput)),
    constants: constants.map(convertPortToInput),
    id,
    position: { x: position.x, y: position.y },
    parentNode: parentNode,
    ...rest,
  };
  return node_;
};

export const globalToInput = (node: GlobalFragment): GlobalArgInput => {
  const { __typename, port, ...rest } = node;
  return { ...rest, port: convertPortToInput(port) };
};

export const streamItemToInput = (
  node: StreamItemFragment
): StreamItemInput => {
  const { __typename, ...rest } = node;
  return { ...rest };
};

export const flowEdgeToInput = (edge: FlowEdge): EdgeInput => {
  const { id, source, sourceHandle, target, targetHandle, data } = edge;
  const { __typename, stream, ...cleaned } = data || {};
  if (!sourceHandle || !targetHandle) throw new Error("No handle specified");
  const edge_: EdgeInput = {
    id: id,
    source: source,
    sourceHandle: sourceHandle,
    target: target,
    targetHandle: targetHandle,
    ...cleaned,
    stream: stream?.map(streamItemToInput) || [],
  };
  return edge_;
};

export const flownodes_to_inputnodes = (nodes: FlowNode[]): NodeInput[] => {
  return nodes.map(flowNodeToInput);
};

export const flowedges_to_inputedges = (flowedges: FlowEdge[]): EdgeInput[] => {
  return flowedges.map(flowEdgeToInput);
};

export const globals_to_inputglobals = (
  globals: GlobalFragment[]
): GlobalInput[] => {
  return globals.map(globalToInput);
};

export const arkitektNodeToFlowNode = (
  node: GraphNodeNodeFragment,
  position: { x: number; y: number }
): FlowNode<ArkitektGraphNodeFragment> => {
  let nodeId = "ark-" + uuidv4();

  let node_: FlowNode<ArkitektGraphNodeFragment> = {
    id: nodeId,
    type: "ArkitektGraphNode",
    dragHandle: ".custom-drag-handle",
    data: {
      __typename: "ArkitektGraphNode",
      ins: [
        node.args.filter((x) => !x?.nullable && x?.default == undefined), // by default, all nullable and default values are optional so not part of stream
      ],
      outs: [node?.returns],
      constants: node.args.filter(
        (x) => x?.nullable || x?.default != undefined
      ),

      title: node?.name || "no-name",
      description: node.description || "",
      mapStrategy: MapStrategy.Map,
      allowLocalExecution: true,
      nextTimeout: 100000,
      retries: 3,
      retryDelay: 2000,
      hash: node.hash,
      kind: GraphNodeKind.Arkitekt,
      globalsMap: {},
      binds: { templates: [] },
      constantsMap: portToDefaults(node.args, {}),
      nodeKind: node.kind || NodeKind.Generator,
    },
    position: position,
  };

  return node_;
};
