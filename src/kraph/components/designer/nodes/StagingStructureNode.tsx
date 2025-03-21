import { Card } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphStructureCategory, LokClient, LokUser } from "@/linkers";
import { DetailClientFragment } from "@/lok-next/api/graphql";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { Image } from "@/components/ui/image";
import {
  ListStructureCategoryFragment,
  StructureCategoryInput,
} from "@/kraph/api/graphql";

export default memo(
  ({ data, isConnectable }: NodeProps<StructureCategoryInput>) => {
    const resolve = useResolve();

    return (
      <>
        <Handle
          type="target"
          position={Position.Top}
          className="customHandle"
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="customHandle"
          isConnectable={isConnectable}
        />
        <Card
          style={{ padding: 10, width: 100, height: 100, zIndex: 100 }}
          className="flex flex-col justify-center items-center bg-black p-3 animate-pulse"
        >
          {data.identifier}
        </Card>
      </>
    );
  },
);
