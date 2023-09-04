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

  const { showEdgeLabels } = useEditRiver();

  const node = useNodes().find((n) => n.id == data?.target) as
    | FlowNode
    | undefined;

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: 1,
        }}
        className={`react-flow__edge-path transition-colors duration-300 bg-gradient-to-r from-${color}-500 to-${color}-300 dark:from-${color}-200 dark:to-${color}-500`}
        d={edgePath}
      />
      <text>
        <textPath
          href={`#${id}`}
          style={{ fontSize: "13px", fill: "white" }}
          startOffset="50%"
          textAnchor="middle"
          className="group"
        ></textPath>
      </text>
      {showEdgeLabels && (
        <EdgeLabelRenderer>
          <Card
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="p-2 text-white max-w-[200px] overflow-hidden ellipsis truncate text-xs"
          >
            {streamToReactNode(
              node?.data?.ins.at(handleToStream(targetHandleId)),
            )}
          </Card>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
