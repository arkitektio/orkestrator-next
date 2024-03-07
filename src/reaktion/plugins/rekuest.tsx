import {
    ArkitektFilterGraphNodeFragment,
    ArkitektGraphNodeFragment,
    GraphNodeFragment,
    GraphNodeKind,
    MapStrategy,
    NodeKind,
} from "@/reaktion/api/graphql";
import { FlowNode } from "../types";
import { portToDefaults } from "@jhnnsrs/rekuest-next";
import { GraphNodeNodeFragment } from "@/rekuest/api/graphql";
import { v4 as uuidv4 } from "uuid";

export const arkitektNodeToFlowNode = (
    node: GraphNodeNodeFragment,
    position: { x: number; y: number },
  ): FlowNode<ArkitektGraphNodeFragment> => {
    let nodeId = "ark-" + uuidv4();
  
    console.log(nodeId);
    let node_: FlowNode<ArkitektGraphNodeFragment> = {
      id: nodeId,
      type: "ArkitektGraphNode",
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
  
  export const predicateNodeToFlowNode = (
    node: GraphNodeNodeFragment,
    position: { x: number; y: number },
  ): FlowNode<ArkitektFilterGraphNodeFragment> => {
    let nodeId = "arkfilter-" + uuidv4();
  
    console.log(nodeId);
    let node_: FlowNode<ArkitektFilterGraphNodeFragment> = {
      id: nodeId,
      type: "ArkitektFilterGraphNode",
      dragHandle: ".custom-drag-handle",
      data: {
        ins: [
          node.args.filter((x) => !x?.nullable && x?.default == undefined), // by default, all nullable and default values are optional so not part of stream
        ],
        outs: [
          node.args.filter((x) => !x?.nullable && x?.default == undefined),
          [],
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
        kind: GraphNodeKind.Arkitekt,
        globalsMap: {},
        binds: { templates: [] },
        constantsMap: portToDefaults(node.args, {}),
        nodeKind: node.kind || NodeKind.Function,
      },
      position: position,
    };
  
    return node_;
  };