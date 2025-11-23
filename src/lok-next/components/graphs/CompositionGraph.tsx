import { DetailClientFragment } from "@/lok-next/api/graphql";
import React from "react";
import { ReactFlow, ReactFlowInstance } from "@xyflow/react";
import InstanceMappingEdge from "./edges/InstanceMappingEdge";
import ClientNode from "./nodes/ClientNode";
import ServiceInstanceNode from "./nodes/ServiceInstanceNode";

export default ({ client }: { client: DetailClientFragment }) => {
  const reactFlowWrapper = React.useRef(null);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance | null>(null);

  const nodes = [
    {
      id: "start",
      position: { x: 300, y: 300 },
      data: client,
      type: "client",
    },

    ...client.mappings.map((mapping, index) => ({
      id: mapping.instance.id,
      position: {
        x:
          300 +
          Math.cos(((2 * Math.PI) / client.mappings.length) * index) * 200,
        y:
          300 +
          Math.sin(((2 * Math.PI) / client.mappings.length) * index) * 200,
      },
      data: mapping.instance,
      type: "serviceinstance",
    })),
  ];

  const edges = client.mappings.map((mapping) => ({
    id: mapping.id,
    source: "start",
    target: mapping.instance.id,
    label: mapping.key,
    data: mapping,
    type: "instancemapping",
  }));

  React.useEffect(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
    }
  }, [reactFlowInstance]);

  return (
    <div ref={reactFlowWrapper} style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{
          serviceinstance: ServiceInstanceNode,
          client: ClientNode,
        }}
        edgeTypes={{
          instancemapping: InstanceMappingEdge,
        }}
        onInit={setReactFlowInstance}
        fitView
      />
    </div>
  );
};
