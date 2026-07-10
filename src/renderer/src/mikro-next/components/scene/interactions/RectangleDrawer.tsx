import { useModeStore } from "../store/modeStore";
import { Line } from "../primitives/Line";
import { useMemo, useState } from "react";
import * as THREE from "three";
import { useRoiSelectionStore } from "../store/roiSelectionStore";

function normalizeBounds(start: THREE.Vector3, end: THREE.Vector3) {
  return {
    minX: Math.min(start.x, end.x),
    maxX: Math.max(start.x, end.x),
    minY: Math.min(start.y, end.y),
    maxY: Math.max(start.y, end.y),
  };
}

function isContained(
  selectionBounds: ReturnType<typeof normalizeBounds>,
  roiBounds: { minX: number; maxX: number; minY: number; maxY: number },
) {
  return (
    roiBounds.minX >= selectionBounds.minX &&
    roiBounds.maxX <= selectionBounds.maxX &&
    roiBounds.minY >= selectionBounds.minY &&
    roiBounds.maxY <= selectionBounds.maxY
  );
}

export const RectangleDrawer = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const displayMode = useModeStore((s) => s.displayMode);
  const visibleRoiMap = useRoiSelectionStore((s) => s.visibleRois);
  const replaceSelectedRois = useRoiSelectionStore((s) => s.replaceSelectedRois);
  const mergeSelectedRois = useRoiSelectionStore((s) => s.mergeSelectedRois);
  const clearSelectedRois = useRoiSelectionStore((s) => s.clearSelectedRois);
  const [startPos, setStartPos] = useState<THREE.Vector3 | null>(null);
  const [currentPos, setCurrentPos] = useState<THREE.Vector3 | null>(null);

  const visibleRois = useMemo(() => Object.values(visibleRoiMap), [visibleRoiMap]);

  const previewPoints = useMemo(() => {
    if (!startPos || !currentPos) return null;

    return [
      [startPos.x, startPos.y, 0.1],
      [currentPos.x, startPos.y, 0.1],
      [currentPos.x, currentPos.y, 0.1],
      [startPos.x, currentPos.y, 0.1],
      [startPos.x, startPos.y, 0.1],
    ] as [number, number, number][];
  }, [currentPos, startPos]);

  if (displayMode !== "2D" || interactionMode !== "SELECT") return null;

  return (
    <group>
      <mesh
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (!startPos) {
            clearSelectedRois();
          }
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          setStartPos(e.point.clone());
          setCurrentPos(e.point.clone());
        }}
        onPointerMove={(e) => {
          if (startPos) {
            e.stopPropagation();
            setCurrentPos(e.point.clone());
          }
        }}
        onPointerUp={(e) => {
          if (startPos) {
            e.stopPropagation();
            const endPos = currentPos ?? e.point;
            const selectionBounds = normalizeBounds(startPos, endPos);
            const containedRois = visibleRois
              .filter((roi) => isContained(selectionBounds, roi.bounds))
              .map(({ bounds: _bounds, ...roi }) => roi);

            if (e.shiftKey) {
              mergeSelectedRois(containedRois);
            } else {
              replaceSelectedRois(containedRois);
            }
          }
          setStartPos(null);
          setCurrentPos(null);
        }}
      >
        <planeGeometry args={[80000, 80000]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      {previewPoints && (
        <Line
          points={previewPoints}
          color="#fafafa"
          lineWidth={2}
        />
      )}
    </group>
  );
};
