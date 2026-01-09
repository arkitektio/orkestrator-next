import {
  ActionKind,
  GraphNodeKind,
  MapStrategy,
  RekuesFilterActionNodeFragment,
  RekuestMapActionNodeFragment,
} from "@/reaktion/api/graphql";
import {
  ConstantActionQuery,
  GraphNodeActionFragment
} from "@/rekuest/api/graphql";
import { portToDefaults } from "@/rekuest/widgets/utils";
import { v4 as uuidv4 } from "uuid";
import { FlowNode } from "../types";

export const rekuestNodeToMapNode = (
  node: GraphNodeNodeFragment,
  position: { x: number; y: number },
): FlowNode<RekuestMapActionNodeFragment> => {
  let nodeId = "ark-" + uuidv4();

  console.log(nodeId);
  let node_: FlowNode<RekuestMapActionNodeFragment> = {
    id: nodeId,
    type: "RekuestMapActionNode",
    dragHandle: ".custom-drag-handle",
    data: {
      ins: [
        node.args.filter((x) => !x?.nullable && x?.default == undefined), // by default, all nullable and default values are optional so not part of stream
      ],
      outs: [node?.returns],
      voids: [],
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
      kind: GraphNodeKind.Rekuest,
      globalsMap: {},
      binds: { implementations: [] },
      constantsMap: portToDefaults(node.args, {}),
      actionKind: node.kind || ActionKind.Generator,
    },
    position: position,
  };

  return node_;
};

export const rekuestActionToMatchingNode = (
  node: ConstantActionQuery["action"],
  position: { x: number; y: number },
) => {
  if (node.protocols.find((p) => p.name == "predicate")) {
    return rekuestNodeToFilterNode(node, position);
  } else {
    return rekuestNodeToMapNode(node, position);
  }
};

export const rekuestNodeToFilterNode = (
  node: GraphNodeActionFragment,
  position: { x: number; y: number },
): FlowNode<RekuesFilterActionNodeFragment> => {
  let nodeId = "arkfilter-" + uuidv4();

  console.log(nodeId);
  let node_: FlowNode<RekuesFilterActionNodeFragment> = {
    id: nodeId,
    type: "RekuestFilterActionNode",
    dragHandle: ".custom-drag-handle",
    data: {
      ins: [
        node.args.filter((x) => !x?.nullable && x?.default == undefined), // by default, all nullable and default values are optional so not part of stream
      ],
      outs: [
        node.args.filter((x) => !x?.nullable && x?.default == undefined),
        node.args.filter((x) => !x?.nullable && x?.default == undefined),
      ], // by default, all nullable and default values are optional so not part of stream],
      constants: node.args.filter(
        (x) => x?.nullable || x?.default != undefined,
      ),
      voids: [],
      title: node?.name || "no-name",
      description: node.description || "",
      mapStrategy: MapStrategy.Map,
      allowLocalExecution: true,
      nextTimeout: 100000,
      retries: 3,
      retryDelay: 2000,
      hash: node.hash,
      kind: GraphNodeKind.RekuestFilter,
      globalsMap: {},
      binds: { templates: [] },
      constantsMap: portToDefaults(node.args, {}),
      nodeKind: node.kind || ActionKind.Function,
    },
    position: position,
  };

  return node_;
};
