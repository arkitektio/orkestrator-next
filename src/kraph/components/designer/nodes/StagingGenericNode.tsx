import { Card } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import {
  GenericCategoryInput,
  StructureCategoryInput,
} from "@/kraph/api/graphql";
import { memo } from "react";
import { Handle, NodeProps, Position, useConnection } from "@xyflow/react";
import { StagingGenericNode } from "../types";
import { cn } from "@/lib/utils";

export default memo(({ data, id }: NodeProps<GenericCategoryInput>) => {
  const resolve = useResolve();

  const connection = useConnection();

  const isTarget = connection.inProgress && connection.fromNode.id !== id;

  return (
    <Card className="customNode">
      <div className="customNodeBody">
        {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
        {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}

        <div
          className={cn(
            "h-full w-full justify-center items-center p-3",
            isTarget && "animate-pulse",
          )}
        >
          {data.label}
        </div>

        {!connection.inProgress && (
          <Handle
            className="customHandle"
            position={Position.Right}
            type="source"
          />
        )}
        {/* We want to disable the target handle, if the connection was started from this node */}
        {(!connection.inProgress || isTarget) && (
          <Handle
            className="customHandle"
            position={Position.Left}
            type="target"
            isConnectableStart={false}
          />
        )}
      </div>
    </Card>
  );
});
