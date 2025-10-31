import { Card } from "@/components/ui/card";
import { KraphStructureRelationCategory } from "@/linkers";
import {
  BaseEdge,
  EdgeLabelRenderer,
  useInternalNode,
  useStore,
  type EdgeProps,
  type ReactFlowState,
} from "@xyflow/react";
import { MeasurementEdge } from "../../types";
import { getEdgeParams } from "../../utils";
import { useIsEdgePossible, useEdgePaths } from "../../OntologyGraphProvider";

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

export const TEdge = ({
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
}: EdgeProps<MeasurementEdge>) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  const isPossible = useIsEdgePossible(id);
  const edgePaths = useEdgePaths(id);
  const pathColor = edgePaths.length > 0 ? edgePaths[0].color : undefined;

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
        color="#ff00ff"
        style={{
          opacity: isPossible ? 1 : 0.15,
          stroke: pathColor || (isPossible ? 'rgb(59, 130, 246)' : 'rgb(100, 100, 100)'),
          strokeWidth: pathColor ? 4 : isPossible ? 3 : 1,
          filter: pathColor
            ? `drop-shadow(0 0 8px ${pathColor}) drop-shadow(0 0 16px ${pathColor})`
            : isPossible
              ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.6))'
              : 'none',
          transition: 'all 0.3s ease'
        }}
      />
      <EdgeLabelRenderer>
        <Card
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${centerX}px,${centerY}px) `,
            opacity: isPossible ? 1 : 0.2,
            pointerEvents: isPossible ? 'all' : 'none',
            boxShadow: pathColor
              ? `0 0 12px 2px ${pathColor}`
              : isPossible
                ? '0 0 8px 1px rgba(59, 130, 246, 0.4)'
                : '0 0 5px 1px rgba(100, 100, 100, 0.2)',
            borderColor: pathColor || (isPossible ? 'rgba(59, 130, 246, 0.5)' : 'rgba(100, 100, 100, 0.3)'),
            borderWidth: pathColor ? '2px' : '1px',
            filter: !isPossible && !pathColor ? 'grayscale(0.8)' : 'none'
          }}
          className="p-3 text-xs group z-10 nodrag nopan transition-all duration-300"
        >
          <KraphStructureRelationCategory.Smart
            object={data?.id || "0"}
            className="w-20"
          >
            {data?.id && (
              <KraphStructureRelationCategory.DetailLink
                object={data?.id}
                style={{ pointerEvents: isPossible ? "all" : "none" }}
                className={`font-bold ${isPossible ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                {data?.label}
              </KraphStructureRelationCategory.DetailLink>
            )}
          </KraphStructureRelationCategory.Smart>
        </Card>
      </EdgeLabelRenderer>
    </>
  );
};

export default TEdge;
