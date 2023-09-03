import {
  ArkitektGraphNodeFragment,
  BindsFragment,
  BindsInput,
  ChildPortFragment,
  GlobalArgInput,
  GraphNodeKind,
  GraphNodeNodeFragment,
  MapStrategy,
  NodeKind,
  PortFragment,
  PortKind,
  PortScope,
  ReactiveNodeFragment,
  ReactiveTemplateFragment,
  StreamItemInput
} from "@/rekuest/api/graphql";
import { convertPortToInput } from "@/rekuest/utils";
import { portToDefaults } from "@jhnnsrs/rekuest-next";
import { v4 as uuidv4 } from "uuid";
import {
  EdgeFragement,
  EdgeInput,
  FlowEdge,
  FlowNode,
  GlobalFragment,
  GlobalInput,
  NodeFragment,
  NodeInput,
  StreamItemFragment
} from "./types";

export const globalArgKey = (id: string, key: string) => {
  return `${id}.${key}`;
};

export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  if (value === null || value === undefined) return false;
  return true;
}

export function keyInObject(
  key: string,
  obj: any,
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
            position: { x: position.x, y: position.y },
            data: { __typename, ...rest },
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
    data: { outs, constants, ins, __typename, binds, ...rest },
  } = node;
  if (!__typename) throw new Error("No type");
  const node_: NodeInput = {
    ins: ins.map((s) => s.map(convertPortToInput)),
    outs: outs.map((s) => s.map(convertPortToInput)),
    constants: constants.map(convertPortToInput),

    id,
    position: { x: position.x, y: position.y },
    parentNode: parentNode,
    binds: binds && bindsToInput(binds),
    ...rest,
  };
  return node_;
};

export const globalToInput = (node: GlobalFragment): GlobalArgInput => {
  const { __typename, port, ...rest } = node;
  return { ...rest, port: convertPortToInput(port) };
};

export const streamItemToInput = (
  node: StreamItemFragment,
): StreamItemInput => {
  const { __typename, ...rest } = node;
  return { ...rest };
};

export const bindsToInput = (
  node: BindsFragment,
): BindsInput => {
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
  globals: GlobalFragment[],
): GlobalInput[] => {
  return globals.map(globalToInput);
};

export const arkitektNodeToFlowNode = (
  node: GraphNodeNodeFragment,
  position: { x: number; y: number },
): FlowNode<ArkitektGraphNodeFragment> => {
  let nodeId = "ark-" + uuidv4();

  console.log(nodeId)
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
        (x) => x?.nullable || x?.default != undefined,
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

export const reactiveTemplateToFlowNode = (
  node: ReactiveTemplateFragment,
  position: { x: number; y: number },
): FlowNode<ReactiveNodeFragment> => {
  let nodeId = "reactive-" + uuidv4();

  let node_: FlowNode<ReactiveNodeFragment> = {
    id: nodeId,
    type: "ReactiveNode",
    dragHandle: ".custom-drag-handle",
    data: {
      __typename: "ReactiveNode",
      ins: node.ins,
      implementation: node.implementation,
      outs: node.outs,
      kind: GraphNodeKind.Reactive,
      constants: node.constants,
      constantsMap: portToDefaults(node.constants, {}),
      globalsMap: {},
      title: node?.title || "no-name",
      description: node.description || "",
    },
    position: position,
  };

  return node_;
};

export const listPortToSingle = (
  port: PortFragment,
  key: string,
): PortFragment => {
  if (port.kind != PortKind.List) throw new Error("Port is not a list");
  if (!port.child) throw new Error("Port has no child");

  const { __typename, child, variants, ...rest } = port.child;
  return {
    ...rest,
    key: key,
    __typename: "Port",
    child: child as ChildPortFragment | undefined,
    variants: variants as ChildPortFragment[] | undefined,
  };
};

export const singleToList = (
  port: PortFragment,
): PortFragment => {
  const { __typename, key, ...rest } = port;
  return {
    nullable: false,
    kind: PortKind.List,
    scope: PortScope.Global,
    key: key,
    __typename: "Port",
    child: rest as ChildPortFragment | undefined,
  };
};

export const nodeIdBuilder = () => {
  return uuidv4();
};

export const handleToStream = (handle: string | undefined | null) => {
  if (handle == undefined) return -1;
  const parts = handle.split("_");
  return parseInt(parts[parts.length - 1]);
};


export const portToReadble = (port: PortFragment | ChildPortFragment | undefined | null, withLocalDisclaimer: boolean): string => {

  if (!port) return "undefined";

  let answer = withLocalDisclaimer ? (port.scope == PortScope.Local ? "local " : "") : "";
  if (port.nullable) answer += "?";
  if (port.kind == PortKind.List) {
    answer += "[" + portToReadble(port.child as ChildPortFragment, withLocalDisclaimer) + "]";
  }

  if (port.kind == PortKind.Dict) {
    answer +=  "{" + portToReadble(port.child as ChildPortFragment, withLocalDisclaimer) + "}";
  }

  if (port.kind == PortKind.Int) {
    answer +=  "int";
  }

  if (port.kind == PortKind.Float) {
    answer +=  "float";
  }

  if (port.kind == PortKind.String) {
    answer +=  "string";
  }

  if (port.kind == PortKind.Bool) {
    answer +=  "bool";
  }

  if (port.kind == PortKind.Union) {
    if (!port.variants) throw new Error("Union has no variants");
    answer +=  port.variants.map(p => portToReadble(p as ChildPortFragment, withLocalDisclaimer)).join(" | ");
  }

  if (port.kind == PortKind.Structure)  {
    answer +=  port.identifier;
  }

  return answer;
}

export const streamToReadable =  (stream: PortFragment[] | undefined, withLocalDisclaimer?: boolean): string => {
  if (!stream) return "undefinedStream";
  return stream.map(p => portToReadble(p, withLocalDisclaimer == true)).join(" | ");
}



export const streamToReactNode = (stream: PortFragment[] | undefined, withLocalDisclaimer?: boolean): JSX.Element => {
  if (!stream) return <div className="text-red-400">undefinedStream</div>;
  return <div className="flex flex-row flex-wrap ">{stream.map(p => <div className="flex-1">{portToReadble(p, withLocalDisclaimer == true)}</div>)}</div>;
}