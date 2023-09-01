import React, { useRef, useState } from "react";
import { ReactFlowInstance, useEdgesState, useNodesState } from "reactflow";
import { Graph } from "../base/Graph";
import {
  ArkitektNodeData,
  EdgeTypes,
  FlowEdge,
  FlowNode,
  NodeTypes,
} from "../types";
import {
  arkitektNodeToFlowNode,
  edges_to_flowedges,
  nodes_to_flownodes,
} from "../utils";
import { EditRiverContext } from "./context";
import { LabeledShowEdge } from "./edges/LabeledShowEdge";
import { ArkitektTrackNodeWidget } from "./nodes/ArkitektWidget";
import { ReactiveTrackNodeWidget } from "./nodes/ReactiveTrackNodeWidget";
import { ArgTrackNodeWidget } from "./nodes/generic/ArgShowNodeWidget";
import { ReturnTrackNodeWidget } from "./nodes/generic/ReturnShowNodeWidget";
import {
  ConstantNodeDocument,
  ConstantNodeQuery,
  FlowFragment,
} from "@/rekuest/api/graphql";
import { useDrop } from "react-dnd";
import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { useRekuest } from "@jhnnsrs/rekuest-next";

const nodeTypes: NodeTypes = {
  ArkitektGraphNode: ArkitektTrackNodeWidget,
  ReactiveNode: ReactiveTrackNodeWidget,
  ArgNode: ArgTrackNodeWidget,
  ReturnNode: ReturnTrackNodeWidget,
};

const edgeTypes: EdgeTypes = {
  VanillaEdge: LabeledShowEdge,
  LoggingEdge: LabeledShowEdge,
};

export type Props = {
  flow: FlowFragment;
};

export const EditFlow: React.FC<Props> = ({ flow }) => {
  console.log(flow.graph?.nodes);
  const { client: arkitektapi } = useRekuest();
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    nodes_to_flownodes(flow.graph?.nodes)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    edges_to_flowedges(flow.graph?.edges)
  );

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const updateNodeData = (data: Partial<ArkitektNodeData>, id: string) => {
    console.log("updateNodeData", data, id);
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          n.data = { ...n.data, ...data };
          console.log("found node", n);
          return n;
        }
        return n;
      })
    );
  };

  const addNode = (node: FlowNode) => {
    setNodes((nds) => [...nds, node]);
  };

  const [{ isOver, canDrop, type }, dropref] = useDrop(() => {
    return {
      accept: [SMART_MODEL_DROP_TYPE],

      drop: (items: { id: string; identifier: string }[], monitor) => {
        if (!monitor.didDrop()) {
          console.log("Ommitting Parent Drop");
        }

        console.log("hallo");

        const reactFlowBounds =
          reactFlowWrapper?.current?.getBoundingClientRect();

        let x = monitor && monitor.getClientOffset()?.x;
        let y = monitor && monitor.getClientOffset()?.y;

        const flowInstance = reactFlowInstance;

        items.map((i, index) => {
          const id = i.id;

          const type = i.identifier;

          console.log(id, flowInstance, reactFlowBounds, x, y);

          if (id && reactFlowInstance && reactFlowBounds && x && y && type) {
            const position = reactFlowInstance.project({
              x: x - reactFlowBounds.left,
              y: y - reactFlowBounds.top + index * 100,
            });

            if (type == "@rekuest-next/node") {
              arkitektapi &&
                arkitektapi
                  .query<ConstantNodeQuery>({
                    query: ConstantNodeDocument,
                    variables: { id: id },
                  })
                  .then(async (event) => {
                    console.log(event);
                    if (event.data?.node) {
                      const flowNode = arkitektNodeToFlowNode(
                        event.data?.node,
                        position
                      );
                      addNode(flowNode);
                    }
                  });
            }
          }
        });

        return {};
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        type: monitor.getItemType(),
        canDrop: !!monitor.canDrop(),
      }),
    };
  }, [reactFlowInstance, reactFlowWrapper]);

  return (
    <EditRiverContext.Provider
      value={{
        flow,
        updateData: updateNodeData,
      }}
    >
      <div
        ref={reactFlowWrapper}
        className="flex flex-grow h-full w-full"
        data-disableselect
      >
        <div ref={dropref} className="flex flex-grow h-full w-full">
          {isOver && "is over"}
          <Graph
            nodes={nodes as FlowNode[]}
            edges={edges as FlowEdge[]}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            elementsSelectable={true}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onInit={(e) => setReactFlowInstance(e)}
            fitView
            attributionPosition="bottom-right"
          />
        </div>
      </div>
    </EditRiverContext.Provider>
  );
};
