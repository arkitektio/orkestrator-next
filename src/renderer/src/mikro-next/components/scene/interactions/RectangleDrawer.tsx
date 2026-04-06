import { useModeStore } from "../store/modeStore";
import { Line } from "@react-three/drei";
import { useMemo, useState } from "react";
import * as THREE from "three";

// --- Path Generation Component ---
export const RectangleDrawer = () => {
  // Mode store state
  const interactionMode = useModeStore((s) => s.interactionMode);

  // Scans store global state
  const regions = useScansStore((s) => s.regions);
  const selectedRegionId = useScansStore((s) => s.selectedRegionId);
  const addRegion = useScansStore((s) => s.addRegion);
  const setSelectedRegionId = useScansStore((s) => s.setSelectedRegionId);

  // Local transient state for the drawing interaction only
  const [startPos, setStartPos] = useState<THREE.Vector3 | null>(null);
  const [currentPos, setCurrentPos] = useState<THREE.Vector3 | null>(null);

  if (interactionMode !== "SCAN") return null;

  return (
    <group>
      <mesh
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedRegionId(null);
        }}
        onPointerDown={(e) => {
          if (!e.ctrlKey && !e.metaKey) return;
          e.stopPropagation();
          setStartPos(e.point);
          setSelectedRegionId(null);
        }}
        onPointerMove={(e) => {
          if (startPos) {
            e.stopPropagation();
            setCurrentPos(e.point);
          }
        }}
        onPointerUp={(e) => {
          if (startPos && currentPos) {
            e.stopPropagation();
            const newId = Math.random().toString(36).substring(2, 9);

            addRegion({
              id: newId,
              start: startPos,
              end: currentPos,
              pattern: "SNAKE_ROW",
              overlap: 10,
            });

            setSelectedRegionId(newId);
          }
          setStartPos(null);
          setCurrentPos(null);
        }}
      >
        <planeGeometry args={[80000, 80000]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {regions.map((region) => {
        const isSelected = selectedRegionId === region.id;

        const width = Math.abs(region.end.x - region.start.x);
        const height = Math.abs(region.end.y - region.start.y);
        const centerX = (region.start.x + region.end.x) / 2;
        const centerY = (region.start.y + region.end.y) / 2;

        return (
          <group key={region.id}>
            <mesh
              position={[centerX, centerY, 0.05]}
              onClick={(e) => {
                if (e.ctrlKey || e.metaKey) return;
                e.stopPropagation();
                setSelectedRegionId(region.id);
              }}
            >
              <planeGeometry args={[width, height]} />
              <meshBasicMaterial
                color={isSelected ? "#fafafa" : "#a1a1aa"}
                transparent
                opacity={isSelected ? 0.1 : 0.05}
                side={THREE.DoubleSide}
              />
            </mesh>

            <Line
              points={[
                [region.start.x, region.start.y, 0.1],
                [region.end.x, region.start.y, 0.1],
                [region.end.x, region.end.y, 0.1],
                [region.start.x, region.end.y, 0.1],
                [region.start.x, region.start.y, 0.1],
              ]}
              color={isSelected ? "#fafafa" : "#52525b"}
              lineWidth={isSelected ? 3 : 2}
            />

            {isSelected && <ScanPathPreview region={region} />}
          </group>
        );
      })}

      {startPos && currentPos && (
        <Line
          points={[
            [startPos.x, startPos.y, 0.1],
            [currentPos.x, startPos.y, 0.1],
            [currentPos.x, currentPos.y, 0.1],
            [startPos.x, currentPos.y, 0.1],
            [startPos.x, startPos.y, 0.1],
          ]}
          color="#fafafa"
          lineWidth={2}
        />
      )}
    </group>
  );
};
