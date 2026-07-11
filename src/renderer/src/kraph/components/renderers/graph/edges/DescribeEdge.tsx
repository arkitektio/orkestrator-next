import {
  BaseEdge,
  useInternalNode,
  type EdgeProps,
} from "@xyflow/react";
import { DescriptionEdge } from "../types";
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

  return `M ${sourceX} ${sourceY} Q ${centerX + offset} ${centerY + offset
    } ${targetX} ${targetY}`;
};

const TEdge = ({
  id: _id,
  data: _data,
  source,
  target,
  sourceX: _sourceX,
  sourceY: _sourceY,
  targetX: _targetX,
  targetY: _targetY,
  sourcePosition: _sourcePosition,
  targetPosition: _targetPosition,
  markerEnd,
}: EdgeProps<DescriptionEdge>) => {
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
      <BaseEdge path={path} markerEnd={markerEnd} color="#ff00ff" />
    </>
  );
};
export default TEdge;
