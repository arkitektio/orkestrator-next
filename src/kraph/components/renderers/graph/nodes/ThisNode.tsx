import { Card } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { ThisNode } from "../types";

export default memo(({ data, id, selected }: NodeProps<ThisNode>) => {
  const resolve = useResolve();

  return (
    <>
      <Handles self={id} />
      <Card
        className="h-full w-full rounded-full z-10  relative overflow-hidden group"
        style={{ zIndex: 10 }}
      >
        {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
        {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}
        This
      </Card>
    </>
  );
});
