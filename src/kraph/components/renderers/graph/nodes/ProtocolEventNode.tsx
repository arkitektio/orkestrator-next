import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphProtocolEvent } from "@/linkers";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { ProtocolEventNode } from "../types";

export default memo(({ data, id, selected }: NodeProps<ProtocolEventNode>) => {
  const resolve = useResolve();

  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <Handles self={id} />
      <div className="absolute top-1 left-1 right-1 bottom-1 z-10">
        <Card
          className="h-full w-full rounded-lg z-10  relative overflow-hidden group ring-4 ring-red ring-red-200"
          style={{ zIndex: 10 }}
        >
          {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
          {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}

          {data.category.store?.presignedUrl && (
            <Image
              src={resolve(data.category.store.presignedUrl)}
              style={{ filter: "brightness(0.7)" }}
              className="object-cover h-full w-full rounded rounded-lg"
            />
          )}
          <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center flex-col bg-black/50 p-3 flex-row">
            <div className="w-full overflow-hidden">
              <KraphProtocolEvent.DetailLink
                object={data.id}
                className="font-bold align-middle text-center block text-1 transition-[font-size]"
              >
                {data.category.label}
              </KraphProtocolEvent.DetailLink>
              {data.variables.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.variables.map((variable) => (
                    <div
                      key={variable.role + variable.value}
                      className="px-3 py-1 bg-gray-800 rounded-full text-xs"
                    >
                      <span className="font-semibold text-xs">
                        {variable.role}:
                      </span>{" "}
                      {variable.value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
});
