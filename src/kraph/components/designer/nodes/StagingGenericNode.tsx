import { Card } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import {
  GenericCategoryInput,
  StructureCategoryInput,
} from "@/kraph/api/graphql";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

export default memo(
  ({ data, isConnectable }: NodeProps<GenericCategoryInput>) => {
    const resolve = useResolve();

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
          className="customHandle"
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
          className="customHandle"
          isConnectable={isConnectable}
        />
        <Card
          style={{ padding: 10, width: 100, height: 100, zIndex: 100 }}
          className="flex flex-col justify-center items-center bg-black p-3 animate-pulse"
        >
          {data.label}
        </Card>
      </>
    );
  },
);
