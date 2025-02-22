import React, { memo } from "react";
import { EntityNodeWidgetProps } from "@/kraph/components/renderers/graph/types";
import { Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { KraphNode } from "@/linkers";

export default memo(({ data, isConnectable }: EntityNodeWidgetProps) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ left: "50%", top: "50%" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ left: "50%", top: "50%" }}
        isConnectable={isConnectable}
      />
      <Card
        style={{ padding: 10, width: 200, height: 200 }}
        className="flex flex-col justify-center items-center"
      >
        <KraphNode.DetailLink object={data.id}>
          {data.label}
        </KraphNode.DetailLink>
      </Card>
    </>
  );
});
