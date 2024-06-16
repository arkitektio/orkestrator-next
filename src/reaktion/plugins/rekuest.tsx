import {
  GraphNodeKind,
  MapStrategy,
  NodeKind,
  RekuestFilterNodeFragment,
  RekuestMapNodeFragment,
} from "@/reaktion/api/graphql";
import {
  ConstantNodeQuery,
  GraphNodeNodeFragment,
} from "@/rekuest/api/graphql";
import { portToDefaults } from "@jhnnsrs/rekuest-next";
import { v4 as uuidv4 } from "uuid";
import { FlowNode } from "../types";

export const rekuestNodeToMapNode = (
  node: GraphNodeNodeFragment,
  position: { x: number; y: number },
): FlowNode<RekuestMapNodeFragment> => {
  let nodeId = "ark-" + uuidv4();

  console.log(nodeId);
  let node_: FlowNode<RekuestMapNodeFragment> = {
    id: nodeId,
    type: "RekuestMapNode",
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
      binds: { templates: [] },
      constantsMap: portToDefaults(node.args, {}),
      nodeKind: node.kind || NodeKind.Generator,
    },
    position: position,
  };

  return node_;
};

export const rekuestNodeToMatchingNode = (
  node: ConstantNodeQuery["node"],
  position: { x: number; y: number },
) => {
  if (node.protocols.find((p) => p.name == "predicate")) {
    return rekuestNodeToFilterNode(node, position);
  } else {
    return rekuestNodeToMapNode(node, position);
  }
};

export const rekuestNodeToFilterNode = (
  node: GraphNodeNodeFragment,
  position: { x: number; y: number },
): FlowNode<RekuestFilterNodeFragment> => {
  let nodeId = "arkfilter-" + uuidv4();

  console.log(nodeId);
  let node_: FlowNode<RekuestFilterNodeFragment> = {
    id: nodeId,
    type: "RekuestFilterNode",
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
      nodeKind: node.kind || NodeKind.Function,
    },
    position: position,
  };

  return node_;
};
