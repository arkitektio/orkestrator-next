import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { cn } from "@/lib/utils";
import {
  Handle,
  NodeProps,
  NodeResizer,
  Position,
  useConnection
} from "@xyflow/react";
import { memo } from "react";
import { StructureNode } from "../types";
import { SelfMeasurementButton } from "../components/SelfMeasurementButton";
import { MeasurementContainer } from "../components/MeasurementContainer";
import { Handles } from "../components/Handles";
import { KraphStructureCategory } from "@/linkers";

export default memo(({ data, id, selected }: NodeProps<StructureNode>) => {
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
          <div className="absolute top-4 left-4 right-4 bottom-4 z-10" >
         <Card className="h-full w-full z-10 p-3" style={{zIndex: 10}}>
        {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
        {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}
        
          {data.store?.presignedUrl && (
            <Image
              src={resolve(data.store?.presignedUrl)}
              className="m-3 h-10  w-10"
            />
          )}
          <KraphStructureCategory.DetailLink object={data.id}>
            {data.identifier}
          </KraphStructureCategory.DetailLink>
          <MeasurementContainer self={id}/>
        <SelfMeasurementButton self={id}/>
    </Card>
    </div>
    </>
  );
});
