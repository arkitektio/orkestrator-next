import { Card } from "@/components/ui/card";
import { ListMeasurementCategoryFragment } from "@/kraph/api/graphql";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useStore,
  Edge,
  useInternalNode,
  getStraightPath,
} from "@xyflow/react";
import { MeasurementEdge } from "../types";
import { getEdgeParams } from "../utils";

const connectionNodeIdSelector = (state: any) => state.connectionNodeId;

export default ({
  id,
  source,
  target,
  markerEnd,
  style,
}: EdgeProps<MeasurementEdge>) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
    />
  );
};
