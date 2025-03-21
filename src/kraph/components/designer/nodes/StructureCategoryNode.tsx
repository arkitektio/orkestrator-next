import { Card } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphStructureCategory, LokClient, LokUser } from "@/linkers";
import { DetailClientFragment } from "@/lok-next/api/graphql";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { Image } from "@/components/ui/image";
import { ListStructureCategoryFragment } from "@/kraph/api/graphql";

export default memo(
  ({ data, isConnectable }: NodeProps<ListStructureCategoryFragment>) => {
    const resolve = useResolve();

    return (
      <div className=" ">
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
          className="flex flex-col justify-center items-center bg-black p-3"
        >
          {data.store?.presignedUrl && (
            <Image
              src={resolve(data.store?.presignedUrl)}
              className="m-3  h-20 w-20"
            />
          )}
          <KraphStructureCategory.DetailLink
            object={data.id}
            className={"text-xs absolute bottom-2"}
          >
            {data.identifier}
            <div className="text-xs text-foreground-muted">{data.ageName}</div>
          </KraphStructureCategory.DetailLink>
        </Card>
      </div>
    );
  },
);
