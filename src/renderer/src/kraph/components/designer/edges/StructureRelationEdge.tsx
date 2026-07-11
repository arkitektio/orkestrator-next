import { Card } from "@/components/ui/card";
import { KraphStructureRelationCategory } from "@/linkers";
import {
  BaseEdge,
  EdgeLabelRenderer,
  useInternalNode,
  type EdgeProps,
} from "@xyflow/react";
import { MeasurementEdge } from "../types";
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

export const TEdge = ({
  id: _id,
  data,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition: _sourcePosition,
  targetPosition: _targetPosition,
  markerEnd,
}: EdgeProps<MeasurementEdge>) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  let path = "";
  const offset = 0;
  let centerX = (sourceX + targetX) / 2;
  let centerY = (sourceY + targetY) / 2;

  if (source == target) {
    const radiusX = 100;
    const radiusY = 100;
    path = `M ${sourceX - 10} ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${
      targetX + 5
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
      />
      <EdgeLabelRenderer>
        <Card
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${centerX}px,${centerY}px) `,
          }}
          className="p-3 text-xs group z-10 nodrag nopan transition-opacity"
        >
          <KraphStructureRelationCategory.Smart
            object={{ id: data?.id || "0" }}
            className="w-20"
          >
            {data?.id && (
              <KraphStructureRelationCategory.DetailLink object={{ id: data.id }}>
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
