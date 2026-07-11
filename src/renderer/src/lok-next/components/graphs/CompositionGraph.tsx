import { DetailClientFragment } from "@/lok-next/api/graphql";
import { ReactFlow, ReactFlowInstance } from "@xyflow/react";
import React from "react";
import InstanceMappingEdge from "./edges/InstanceMappingEdge";
import ClientNode from "./nodes/ClientNode";
import ServiceInstanceNode from "./nodes/ServiceInstanceNode";

export default ({ client }: { client: DetailClientFragment }) => {
  const reactFlowWrapper = React.useRef(null);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance | null>(null);

  // NOTE: `mappings` is no longer part of the DetailClient fragment (schema
  // drift — the field still exists on `Client` but is not currently
  // requested). Render just the client node until the query is updated to
  // fetch mappings again.
  const nodes = [
    {
      id: "start",
      position: { x: 300, y: 300 },
      data: client,
      type: "client",
    },
  ];

  const edges: never[] = [];

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
