import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphEntityCategory, KraphGenericCategory } from "@/linkers";
import { NodeProps, NodeResizer, useConnection } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { MeasurementContainer } from "../components/MeasurementContainer";
import { SelfMeasurementButton } from "../components/SelfMeasurementButton";
import { GenericNode, ReagentNode } from "../types";
import { Badge } from "@/components/ui/badge";
export default memo(({ data, id, selected }: NodeProps<ReagentNode>) => {
  const resolve = useResolve();

  const connection = useConnection();

  const isTarget = connection.inProgress && connection.fromNode.id !== id;

  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <Handles self={id} />
      <div className="absolute top-4 left-4 right-4 bottom-4 z-10">
        <Card
          className="h-full w-full z-10 p-3 relative"
          style={{ zIndex: 10 }}
        >
          {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
          {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}

          {data.store?.presignedUrl && (
            <Image
              src={resolve(data?.store.presignedUrl)}
              style={{ filter: "brightness(0.7)" }}
              className="object-cover h-20 w-full rounded rounded-lg"
            />
          )}
          <KraphEntityCategory.DetailLink object={data.id}>
            {data.label}
          </KraphEntityCategory.DetailLink>
          {data.tags.map((tag) => (
            <Badge key={tag.id}>{tag.value}</Badge>
          ))}
          <MeasurementContainer self={id} />
          <SelfMeasurementButton self={id} />
        </Card>
      </div>
    </>
  );
});
