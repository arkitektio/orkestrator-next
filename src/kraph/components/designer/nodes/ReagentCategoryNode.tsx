import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphReagentCategory } from "@/linkers";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { ReagentNode } from "../types";

export default memo(({ data, id, selected }: NodeProps<ReagentNode>) => {
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
      <KraphReagentCategory.Smart
        object={data.id}
        containerClassName="h-full w-full rounded-full  group ring-4 ring-red ring-red-200 overflow-hidden bg-black"
        className="h-full w-full "
      >
        {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
        {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}

        {data.store?.presignedUrl && (
          <Image
            src={resolve(data?.store.presignedUrl)}
            style={{ filter: "brightness(0.7)" }}
            className="object-cover h-full w-full rounded rounded-lg"
          />
        )}
        <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center flex-col gap-2 bg-black/50 truncate ">
          <KraphReagentCategory.DetailLink object={data.id}>
            {data.label}
          </KraphReagentCategory.DetailLink>

          <div className="flex flex-row gap-2">
            {data.tags.map((tag) => (
              <Badge key={tag.value} variant="outline" className="text-xs">
                {tag.value}
              </Badge>
            ))}
          </div>
        </div>
      </KraphReagentCategory.Smart>
    </>
  );
});
