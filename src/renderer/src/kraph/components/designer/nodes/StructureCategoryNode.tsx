import { Badge } from "@/components/ui/badge";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphStructureCategory } from "@/linkers";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { NodeQueryControls } from "../components/NodeQueryControls";
import { StructureNode } from "../types";

export const StructureCategoryNode = memo(({ data, id, selected }: NodeProps<StructureNode>) => {
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
      <KraphStructureCategory.Smart
        object={data}
        containerClassName="h-full w-full rounded-md  group ring-4 ring-yellow-200  bg-black"
        className="h-full w-full  overflow-hidden"
      >
        {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
        {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}

        {data.image?.presignedUrl && (
          <Image
            src={resolve(data?.image.presignedUrl)}
            style={{ filter: "brightness(0.7)" }}
            className="object-cover h-full w-full rounded rounded-lg"
          />
        )}
        <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center flex-col bg-black/50  ">
          <KraphStructureCategory.DetailLink
            object={data}
            className={"font-bold"}
          >
            {data.identifier}
          </KraphStructureCategory.DetailLink>

          <div className="flex flex-row gap-2">
            {data.tags.map((tag) => (
              <Badge key={tag.name} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
        <NodeQueryControls nodeId={id} nodeType="Structure" />
      </KraphStructureCategory.Smart>
    </>
  );
});

export default StructureCategoryNode;
