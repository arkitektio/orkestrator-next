import { Card } from "@/components/ui/card";
import { LokServiceInstance } from "@/linkers";
import { ListServiceInstanceFragment } from "@/lok-next/api/graphql";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

export default memo(
  ({ data, isConnectable }: NodeProps<ListServiceInstanceFragment>) => {
    return (
      <>
        <Handle
          type="target"
          position={Position.Top}
          style={{
            left: "50%",
            top: "50%",
            zIndex: 0,
            color: "transparent",
            background: "transparent",
            stroke: "transparent",

            border: "0px solid transparent",
          }}
          onConnect={(params) => console.log("handle onConnect", params)}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            left: "50%",
            top: "50%",
            zIndex: 0,
            color: "transparent",
            background: "transparent",
            stroke: "transparent",

            border: "0px solid transparent",
          }}
          className="invisible"
          isConnectable={isConnectable}
        />
        <Card
          style={{ padding: 10, width: 100, height: 100 }}
          className="flex flex-col justify-center items-center p-3"
        >
          <LokServiceInstance.DetailLink object={data.id} className={"text-xl"}>
            {data.identifier}
          </LokServiceInstance.DetailLink>
        </Card>
      </>
    );
  },
);
