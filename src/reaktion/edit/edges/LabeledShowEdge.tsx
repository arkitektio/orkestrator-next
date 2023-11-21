import React, { useEffect } from "react";
import { EdgeLabelRenderer, getSmoothStepPath, useNodes } from "reactflow";
import { FlowNode, VanillaEdgeProps } from "../../types";
import { Card } from "@/components/ui/card";
import {
  handleToStream,
  streamToReactNode,
  streamToReadable,
} from "@/reaktion/utils";
import { useEditRiver } from "../context";

export const LabeledShowEdge: React.FC<VanillaEdgeProps> = (props) => {
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

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const { showEdgeLabels, removeEdge } = useEditRiver();

  const node = useNodes().find((n) => n.id == target) as FlowNode | undefined;

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: 1,
        }}
        className={`react-flow__edge-path stream-edge transition-colors duration-300 bg-gradient-to-r from-${color}-500 to-${color}-300 dark:from-${color}-200 dark:to-${color}-500 group`}
        d={edgePath}
      />
      <EdgeLabelRenderer>
        <Card
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          data-edgeid={id}
          className="stream-edge p-2 dark:text-white max-w-[200px] overflow-hidden ellipsis truncate text-xs flex flex-row gap-2 items-center justify-center group border border-gray-400"
        >
          {showEdgeLabels && (
            <>
              {streamToReactNode(
                node?.data?.ins.at(handleToStream(targetHandleId)),
              )}
            </>
          )}
          <button
            onClick={() => removeEdge(id)}
            className="group-hover:text-red-300 font-bold stream-edge"
            data-edgeid={id}
          >
            X
          </button>
        </Card>
      </EdgeLabelRenderer>
    </>
  );
};
