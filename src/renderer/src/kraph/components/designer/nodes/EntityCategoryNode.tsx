import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphEntityCategory } from "@/linkers";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { GenericNode } from "../types";
import { PathMarker } from "../components/PathMarker";
import { NodeQueryControls } from "../components/NodeQueryControls";

export default memo(({ data, id, selected }: NodeProps<GenericNode>) => {
  const resolve = useResolve();

  return (
    <>
      <NodeResizer
        color="var(--primary)"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <Handles self={id} />
      <Card
        className={`h-full w-full rounded-xl border-emerald-500 bg-card overflow-hidden shadow-sm transition-all ${selected ? "ring-1 ring-primary shadow-lg" : ""}`}
        style={{ zIndex: 10 }}
      >
      <KraphEntityCategory.Smart
        object={data.id}
        containerClassName="h-full w-full "
        className="h-full w-full  overflow-hidden"
      >
        {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
        {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}

        {data.store?.presignedUrl && (
          <Image
            src={resolve(data?.store.presignedUrl)}
            className="object-cover h-full w-full"
          />
        )}
        <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center flex-col gap-2 ">
          <KraphEntityCategory.DetailLink object={data.id}>
            {data.label}
          </KraphEntityCategory.DetailLink>

          <div className="flex flex-row gap-2">
            {data.tags.map((tag) => (
              <Badge key={tag.value} variant="outline" className="text-xs">
                {tag.value}
              </Badge>
            ))}
          </div>
        </div>
        <PathMarker nodeId={id} />
        <NodeQueryControls nodeId={id} nodeType="Entity" />
      </KraphEntityCategory.Smart>
      </Card>
    </>
  );
});
