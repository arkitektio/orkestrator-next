import { Card } from "@/components/ui/card";
import { ListGenericCategoryFragment } from "@/kraph/api/graphql";
import { KraphGenericCategory, LokLayer, LokServiceInstance } from "@/linkers";
import { ListServiceInstanceFragment } from "@/lok-next/api/graphql";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";

export default memo(
  ({ data, isConnectable }: NodeProps<ListGenericCategoryFragment>) => {
    const resolve = useResolve();

    return (
      <>
        <Handle
          type="target"
          position={Position.Top}
          className="customHandle"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="customHandle"
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
          <KraphGenericCategory.DetailLink
            object={data.id}
            className={"text-xs absolute bottom-2"}
          >
            {data.label}
            <div className="text-xs text-foreground-muted">{data.ageName}</div>
          </KraphGenericCategory.DetailLink>
        </Card>
      </>
    );
  },
);
