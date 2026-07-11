import {
  BaseEdge,
  useInternalNode,
  type EdgeProps
} from "@xyflow/react";
import { LightEdge } from "../types";
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

  return `M ${sourceX} ${sourceY} Q ${centerX} ${
    centerY + offset
  } ${targetX} ${targetY}`;
};

export default ({
  id: _id,
  data,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
}: EdgeProps<LightEdge>) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  let path = "";
  const offset = 0;

  if (source == target) {
    const radiusX = 100;
    const radiusY = 100;
    path = `M ${sourceX - 10} ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${
      targetX + 5
    } ${targetY}`;
  } else {
    path = getSpecialPath(
      { sourceX: sx, sourceY: sy, targetX: tx, targetY: ty },
      offset,
    );
  }

  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} label={data?.medium} />
    </>
  );
};
