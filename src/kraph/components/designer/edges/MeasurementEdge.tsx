import { Card } from "@/components/ui/card";
import { ListMeasurementCategoryFragment } from "@/kraph/api/graphql";
import { ListServiceInstanceMappingFragment } from "@/lok-next/api/graphql";
import { MergeIcon } from "lucide-react";
import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  getBezierPath,
  useStore,
} from "reactflow";

const connectionNodeIdSelector = (state: any) => state.connectionNodeId;

export default (props: EdgeProps<ListMeasurementCategoryFragment>) => {
  const color = "rgb(30 58 138)";

  const {
    id,
    sourcePosition,
    targetPosition,
    targetHandleId,
    sourceX,
    sourceY,
    targetX,
    targetY,
    target,
    source,
    style,
    markerStart,
    markerEnd,
    data,
  } = props;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const connectionNodeId = useStore(connectionNodeIdSelector);

  const isConnecting = !!connectionNodeId;

  return (
    <>
      <BaseEdge
        id={id}
        style={{
          ...style,
          strokeWidth: 1,
        }}
        path={edgePath}
        markerEnd={markerEnd}
        interactionWidth={20}
      />
      <EdgeLabelRenderer>
        <Card
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
          className="p-1 text-xs group"
        >
          {data?.ageName}
        </Card>
      </EdgeLabelRenderer>
    </>
  );
};
