import {
  BaseEdge,
  EdgeLabelRenderer,
  useInternalNode,
  useStore,
  type EdgeProps,
  type ReactFlowState,
} from "@xyflow/react";
import { RelationEdge } from "../../types";
import { getEdgeParams } from "../../utils";
import { PathEdgePresentation, useEdgeStrokeStyle } from "../../components/PathEdgePresentation";

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

  return `M ${sourceX} ${sourceY} Q ${centerX} ${centerY + offset
    } ${targetX} ${targetY}`;
};

export default ({
  id,
  data,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps<RelationEdge>) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  const strokeStyle = useEdgeStrokeStyle(id);

  const theEdges = useStore((s: ReactFlowState) => {
    const edgeExists = s.edges.filter(
      (e) =>
        (e.source === source && e.target === target) ||
        (e.target === source && e.source === target),
    );
    return edgeExists;
  });

  const myIndex = theEdges.findIndex((e) => e.id == id) || 0;

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  let path = "";
  const offset = 0;
  let centerX = (sourceX + targetX) / 2;
  let centerY = (sourceY + targetY) / 2;

  if (source == target) {
    const radiusX = 100;
    const radiusY = 100;
    path = `M ${sourceX - 10} ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${targetX + 5
      } ${targetY}`;

    centerX = sourceX - radiusX * 2;
    centerY = (sourceY + targetY) / 2;
  } else {
    path = getSpecialPath(
      { sourceX: sx, sourceY: sy, targetX: tx, targetY: ty },
      offset,
    );
  }

  return (
    <>
      <BaseEdge
        path={path}
        markerEnd={markerEnd}
        label={data?.label}
        style={strokeStyle}
      />
      <EdgeLabelRenderer>
        <PathEdgePresentation
          id={id}
          transform={`translate(-50%, -50%) translate(${centerX}px,${centerY + offset}px)`}
        >
          <div className="w-20">
            {data?.id && (
              <div className="font-bold">
                {data?.label}
              </div>
            )}
          </div>
        </PathEdgePresentation>
      </EdgeLabelRenderer>
    </>
  );
};
