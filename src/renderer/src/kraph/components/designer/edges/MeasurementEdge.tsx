import { Card } from "@/components/ui/card";
import {
  BaseEdge,
  EdgeLabelRenderer,
  useInternalNode,
  useStore,
  type EdgeProps,
  type ReactFlowState,
} from "@xyflow/react";
import { MeasurementEdge } from "../types";
import { getEdgeParams } from "../utils";
import { KraphMeasurementCategory } from "@/linkers";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsEdgePossible } from "../OntologyGraphProvider";

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
      />
      <EdgeLabelRenderer>
        <Card
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${centerX + offset}px,${centerY + offset}px)`,
          }}
          className="p-3 text-xs group nodrag nopan transition-opacity"
        >
          <KraphMeasurementCategory.Smart
            object={data?.id || "0"}
            className="w-16 overflow-hidden items-center justify-center flex"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                {data?.id && (
                  <KraphMeasurementCategory.DetailLink object={data?.id}>
                    {data?.label}
                  </KraphMeasurementCategory.DetailLink>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <span className="max-w-xs break-words">
                  {data?.description}
                </span>
              </TooltipContent>
            </Tooltip>
          </KraphMeasurementCategory.Smart>
        </Card>
      </EdgeLabelRenderer>
    </>
  );
};
