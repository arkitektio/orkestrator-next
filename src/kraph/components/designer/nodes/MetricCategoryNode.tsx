import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphMetricCategory, KraphProtocolEventCategory } from "@/linkers";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { MetricNode, StructureNode } from "../types";

export default memo(({ data, id, selected }: NodeProps<MetricNode>) => {
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
          className="h-full w-full rounded-lg z-10  relative overflow-hidden group ring-4 ring-yellow-200"
          style={{ zIndex: 10 }}
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
          <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center flex-col bg-black/50  ">
            <KraphMetricCategory.DetailLink
              object={data.id}
              className={"font-bold"}
            >
              {data.label}
            </KraphMetricCategory.DetailLink>

            <div className="flex flex-row gap-2">
              {data.tags.map((tag) => (
                <Badge key={tag.value} variant="outline" className="text-xs">
                  {tag.value}
                </Badge>
              ))}
            </div>
            <div className="flex flex-row gap-2">{data.metricKind}</div>
          </div>
        </Card>
      </div>
    </>
  );
});
