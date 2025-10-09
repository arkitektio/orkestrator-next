import {
  FlussBindsFragment as BindsFragment,
  BindsInput,
  FlussChildPortFragment as ChildPortFragment,
  FlowFragment,
  GlobalArgInput,
  GraphNodeFragment,
  GraphNodeKind,
  FlussPortFragment as PortFragment,
  PortKind,
  ReactiveImplementationFragment,
  ReactiveNodeFragment,
  StreamItemInput,
} from "@/reaktion/api/graphql";
import {
  ActionKind,
  DefinitionInput,
  DependencyInput,
} from "@/rekuest/api/graphql";
import { convertPortToInput } from "@/rekuest/utils";
import { portToDefaults } from "@/rekuest/widgets/utils";
import { v4 as uuidv4 } from "uuid";
import {
  ActionFragment,
  EdgeFragement,
  EdgeInput,
  FlowEdge,
  FlowNode,
  GlobalFragment,
  GlobalInput,
  NodeInput,
  StreamItemFragment,
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

export const nodes_to_flownodes = (nodes: ActionFragment[]): FlowNode[] => {
  console.log("nodes_to_flownodes", nodes);

  const nodes_ =
    nodes
      ?.map((node) => {
        if (node) {
          const { id, position, __typename, ...rest } = node;
          const node_: FlowNode = {
            type: __typename,
            id: id,
            position: { x: position.x, y: position.y },
            data: { ...rest },
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
          const {
            id,
            source,
            sourceHandle,
            target,
            targetHandle,
            __typename,
            ...rest
          } = edge;
          const flowedge: FlowEdge = {
            id,
            type: __typename,
            source,
            sourceHandle,
            target,
            targetHandle,
            data: rest,
          };
          return flowedge;
        }
        return undefined;
      })
      .filter(notEmpty) || [];

  return flowedges;
};

export const flowNodeToInput = (
  node: FlowNode<GraphNodeFragment & { binds?: BindsFragment }>,
): NodeInput => {
  const {
    id,
    type,
    position,
    parentNode,
    data: { outs, constants, ins, binds, voids, ...rest },
  } = node;
  try {
    const node_: NodeInput = {
      ins: ins.map((s) => s.map(convertPortToInput)),
      outs: outs.map((s) => s.map(convertPortToInput)),
      constants: constants.map(convertPortToInput),
      voids: voids.map(convertPortToInput),
      id,
      position: { x: position.x, y: position.y },
      parentNode: parentNode,
      binds: binds && bindsToInput(binds),
      ...rest,
    };

    return node_;
  } catch (e) {
    console.log("Error converting node to input", node);
    console.error(e);
    throw e;
  }
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

export const bindsToInput = (node: BindsFragment): BindsInput => {
  return { implementations: node.implementations.map(implementation => implementation) || [], clients: [] };
};

export const flowEdgeToInput = (edge: FlowEdge): EdgeInput => {
  const { id, source, sourceHandle, target, targetHandle, data } = edge;
  if (!data) throw new Error("No data set");
  const { stream, ...cleaned } = data;
  if (!sourceHandle || !targetHandle) throw new Error("No handle specified");
  const edge_: EdgeInput = {
    id: id,
    source: source,
    sourceHandle: sourceHandle,
    target: target,
    targetHandle: targetHandle,
    stream: stream?.map(streamItemToInput) || [],
    kind: data.kind,
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

export const reactiveTemplateToFlowNode = (
  node: ReactiveImplementationFragment,
  position: { x: number; y: number },
): FlowNode<ReactiveNodeFragment> => {
  let nodeId = "reactive-" + uuidv4();

  let node_: FlowNode<ReactiveNodeFragment> = {
    id: nodeId,
    type: "ReactiveNode",
    dragHandle: ".custom-drag-handle",
    data: {
      ins: node.ins,
      implementation: node.implementation,
      outs: node.outs,
      voids: [],
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
  let listChild = port.children?.at(0);
  if (!listChild) throw new Error("Port has no children");

  const { __typename, children, ...rest } = listChild;
  return {
    ...rest,
    key: key,
    __typename: "Port",
    children: children as ChildPortFragment[] | undefined,
  };
};

export const singleToList = (port: PortFragment): PortFragment => {

  return {
    nullable: false,
    kind: PortKind.List,
    key: port.key,
    __typename: "Port",
    children: [{ ...port, key: "0" }],
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

export const portToReadble = (
  port: PortFragment | ChildPortFragment | undefined | null,
  withLocalDisclaimer: boolean,
): string => {
  if (!port) return "undefined";

  let answer = "";
  if (port.nullable) answer += "?";
  if (port.kind == PortKind.List) {
    answer +=
      "[ " +
      portToReadble(
        port.children?.at(0) as ChildPortFragment,
        withLocalDisclaimer,
      ) +
      " ]";
  }

  if (port.kind == PortKind.Dict) {
    answer +=
      "{ " +
      portToReadble(
        port.children?.at(0) as ChildPortFragment,
        withLocalDisclaimer,
      ) +
      " }";
  }

  if (port.kind == PortKind.Int) {
    answer += "int";
  }

  if (port.kind == PortKind.Float) {
    answer += "float";
  }

  if (port.kind == PortKind.String) {
    answer += "string";
  }

  if (port.kind == PortKind.Bool) {
    answer += "bool";
  }

  if (port.kind == PortKind.Union) {
    if (!port.children) throw new Error("Union has no variants");
    answer += port.children
      .map((p) => portToReadble(p as ChildPortFragment, withLocalDisclaimer))
      .join(" | ");
  }

  if (port.kind == PortKind.Structure) {
    answer += port.identifier;
  }

  if (port.kind == PortKind.Enum) {
    answer += port.identifier;
  }

  if (port.kind == PortKind.MemoryStructure) {
    answer += port.identifier;
  }

  return answer;
};

export const streamToReadable = (
  stream: PortFragment[] | undefined,
  withLocalDisclaimer?: boolean,
): string => {
  if (!stream) return "undefinedStream";
  return stream
    .map((p) => portToReadble(p, withLocalDisclaimer == true))
    .join(" | ");
};

export const streamToReactNode = (
  stream: PortFragment[] | undefined,
  withLocalDisclaimer?: boolean,
): JSX.Element => {
  if (!stream)
    return <div className="text-red-400 stream-edge">undefinedStream</div>;
  return (
    <div className="flex flex-row flex-wrap stream-edge ">
      {stream.length == 0 ? (
        <div className="font-bold">Event</div>
      ) : (
        stream.map((p) => (
          <div className="flex-1">
            {portToReadble(p, withLocalDisclaimer == true)}
          </div>
        ))
      )}
    </div>
  );
};

export const flowToDefinition = (flow: FlowFragment): DefinitionInput => {
  let args =
    flow.graph?.nodes
      ?.find((arg) => arg.__typename == "ArgNode")
      ?.outs.at(0)
      ?.map((p) => convertPortToInput(p)) || [];

  let kwargs =
    flow.graph.globals?.map((arg) => convertPortToInput(arg.port)) || [];

  let returns =
    flow.graph?.nodes
      ?.find((arg) => arg.__typename == "ReturnNode")
      ?.ins.at(0)
      ?.map((p) => convertPortToInput(p)) || [];

  return {
    kind: ActionKind.Function,
    args: [...args, ...kwargs],
    returns: returns,
    name: flow.title,
    description: flow.description,
  };
};

export const flowToDependencies = (flow: FlowFragment): DependencyInput[] => {
  let hashes: DependencyInput[] =
    flow.graph?.nodes
      ?.filter(
        (node) =>
          node.__typename == "RekuestFilterNode" ||
          node.__typename == "RekuestMapNode",
      )
      .map((x) => ({ hash: x.hash, reference: x.id })) || [];

  console.log("hashes", hashes);

  return hashes;
};
