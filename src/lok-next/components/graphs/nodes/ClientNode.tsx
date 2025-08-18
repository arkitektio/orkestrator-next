import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokClient, LokUser } from "@/linkers";
import { DetailClientFragment } from "@/lok-next/api/graphql";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

export default memo(
  ({ data, isConnectable }: NodeProps<DetailClientFragment>) => {
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
        <LokClient.DetailLink object={data.id}>
          <Card
            style={{ padding: 10, width: 100, height: 100, zIndex: 100 }}
            className="flex flex-col justify-center items-center bg-black p-3"
          >
            {data.release.app.logo && (
              <Image
                src={resolve(data.release.app.logo.presignedUrl)}
                className="m-3  h-20 w-20"
              />
            )}
            <LokUser.DetailLink
              object={data.user?.id}
              className={"text-xs absolute bottom-2"}
            >
              {data.user?.username}
            </LokUser.DetailLink>
          </Card>
        </LokClient.DetailLink>
      </>
    );
  },
);
