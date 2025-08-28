import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphStructure } from "@/linkers";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";

import { StructureNode } from "../types";
import { usePathViewerState } from "../PathViewerStateProvider";
import { DisplayWidget } from "@/command/Menu";

export default memo(({ data, id, selected }: NodeProps<StructureNode>) => {
  const resolve = useResolve();

  const { viewerState } = usePathViewerState();

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
          className="h-full w-full rounded-lg z-10  relative overflow-hidden group ring-4 ring-yellow-200"
          style={{ zIndex: 10 }}
        >
          {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
          {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}

          {viewerState.showWidgets ? (
            <DisplayWidget
              identifier={data.category.identifier}
              object={data.object}
            />
          ) : (
            <>
              {data.category.store?.presignedUrl && (
                <Image
                  src={resolve(data?.category.store.presignedUrl)}
                  style={{ filter: "brightness(0.7)" }}
                  className="object-cover h-full w-full rounded rounded-lg"
                />
              )}
              <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center flex-col bg-black/50  ">
                <KraphStructure.DetailLink
                  object={data.id}
                  className={"font-bold"}
                >
                  {data.category.identifier}
                </KraphStructure.DetailLink>
                {data.id}
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
});
