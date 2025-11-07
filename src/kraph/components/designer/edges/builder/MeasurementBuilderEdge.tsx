import { Card } from "@/components/ui/card";
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
import { KraphMeasurementCategory } from "@/linkers";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsEdgePossible, useEdgePaths } from "../../OntologyGraphProvider";

// Helper to convert RGB array to CSS rgb() string
const rgbToCSS = (rgb: number[]): string => {
  const r = Math.round(rgb[0] * 255);
  const g = Math.round(rgb[1] * 255);
  const b = Math.round(rgb[2] * 255);
  return `rgb(${r}, ${g}, ${b})`;
};

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
}: EdgeProps<MeasurementEdge>) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  const isPossible = useIsEdgePossible(id);
  const edgePaths = useEdgePaths(id);
  const pathColorRaw = edgePaths.length > 0 && edgePaths[0].color ? edgePaths[0].color : undefined;
  const pathColor = pathColorRaw ? rgbToCSS(pathColorRaw) : undefined;

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

  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  let path = "";
  // Calculate offset based on whether there are multiple edges and the current edge's index
  const isMultipleEdges = theEdges.length > 1;
  const offset = isMultipleEdges
    ? (myIndex - (theEdges.length - 1) / 2) * 60
    : 0;

  path = getSpecialPath(
    { sourceX: sx, sourceY: sy, targetX: tx, targetY: ty },
    offset,
  );

  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

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
            transform: `translate(-50%, -50%) translate(${centerX + offset}px,${centerY + offset}px)`,
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
          className="p-3 text-xs group nodrag nopan transition-all duration-300"
        >
          <div
            className="w-16 overflow-hidden items-center justify-center flex"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                {data?.id && (
                  <div
                    className={`font-bold ${isPossible ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  >
                    {data?.label}
                  </div>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <span className="max-w-xs break-words">
                  {data?.description}
                </span>
              </TooltipContent>
            </Tooltip>
          </div>
        </Card>
      </EdgeLabelRenderer>
    </>
  );
};
