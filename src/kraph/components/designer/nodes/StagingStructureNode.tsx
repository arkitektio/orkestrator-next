import { Card } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { cn } from "@udecode/cn";
import {
  Handle,
  NodeProps,
  NodeResizer,
  Position,
  useConnection
} from "@xyflow/react";
import { memo } from "react";
import { StagingStructureNode } from "../types";
import { Button } from "@/components/ui/button";
import { SelfMeasurementButton } from "../components/SelfMeasurementButton";
import { MeasurementContainer } from "../components/MeasurementContainer";
import { Handles } from "../components/Handles";

export default memo(({ data, id, selected}: NodeProps<StagingStructureNode>) => {
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
          <Card className="h-full w-full z-10" style={{zIndex: 10}}>
        {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
        {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}

        
          {data.identifier}

        
        <MeasurementContainer self={id}/>
        <SelfMeasurementButton self={id}/>

    </Card>
    </div>
    
    </>
  );
});
