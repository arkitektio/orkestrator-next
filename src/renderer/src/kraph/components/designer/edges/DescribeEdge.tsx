import {
  BaseEdge,
  useInternalNode,
  type EdgeProps
} from "@xyflow/react";
import { DescribeEdge } from "../types";
import { getEdgeParams } from "../utils";

export type GetSpecialPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

export const getSpecialPath = (
  { sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
  offset: number,
) => {
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  return `M ${sourceX} ${sourceY} Q ${centerX + offset} ${
    centerY + offset
  } ${targetX} ${targetY}`;
};

export default ({
  id: _id,
  data,
  source,
  target,
  sourceX: _sourceX,
  sourceY: _sourceY,
  targetX: _targetX,
  targetY: _targetY,
  sourcePosition: _sourcePosition,
  targetPosition: _targetPosition,
  markerEnd,
}: EdgeProps<DescribeEdge>) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  let path = "";
  const offset = 0;

  path = getSpecialPath(
    { sourceX: sx, sourceY: sy, targetX: tx, targetY: ty },
    offset,
  );

  return (
    <>
      <BaseEdge
        path={path}
        markerEnd={markerEnd}
        label={data?.label}
        color="#ff00ff"
      />
    </>
  );
};
