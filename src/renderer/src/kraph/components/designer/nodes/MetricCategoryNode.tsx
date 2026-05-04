import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphMetricCategory } from "@/linkers";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { NodeQueryControls } from "../components/NodeQueryControls";
import { PathMarker } from "../components/PathMarker";
import { MetricNode } from "../types";

export const MetricCategoryNode = memo(({ data, id, selected }: NodeProps<MetricNode>) => {
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

          {data.image?.presignedUrl && (
            <Image
              src={resolve(data?.image.presignedUrl)}
              style={{ filter: "brightness(0.7)" }}
              className="object-cover h-full w-full rounded rounded-lg"
            />
          )}
          <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center flex-col bg-black/50  ">
            <KraphMetricCategory.DetailLink
              object={data}
              className={"font-bold"}
            >
              {data.label}
            </KraphMetricCategory.DetailLink>

            <div className="flex flex-row gap-2">
              {data.tags.map((tag) => (
                <Badge key={tag.name} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
            <div className="flex flex-row gap-2">{data.valueKind}</div>
          </div>
          <NodeQueryControls nodeId={id} nodeType="Metric" />
        </Card>
        <PathMarker nodeId={id} />
      </div>
    </>
  );
});

export default MetricCategoryNode;
