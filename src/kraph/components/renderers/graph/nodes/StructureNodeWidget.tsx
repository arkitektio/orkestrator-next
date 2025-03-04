import React, { memo, useState } from "react";
import { StructureNodeWidgetProps } from "@/kraph/components/renderers/graph/types";
import { Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { DelegatingStructureWidget } from "@/components/widgets/returns/DelegatingStructureWidget";
import { PortKind, PortScope } from "@/rekuest/api/graphql";
import { KraphNode } from "@/linkers";
import exp from "constants";

export default memo(({ data, isConnectable }: StructureNodeWidgetProps) => {
  const [expand, setExpand] = useState(false);

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
        onClick={() => setExpand(!expand)}
      >
        <KraphNode.DetailLink object={data.id}>
          {expand && (
            <DelegatingStructureWidget
              port={{
                key: "__void__",
                identifier: data.identifier,
                nullable: false,
                scope: PortScope.Global,
                __typename: "Port",
                kind: PortKind.Structure,
              }}
              value={data.object}
            />
          )}
          {data.label}
        </KraphNode.DetailLink>
      </Card>
    </>
  );
});
