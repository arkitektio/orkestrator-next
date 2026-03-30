import { useMoveStage, useMoveToStagePosition } from "@/apps/default/hooks/actions";
import { useStageState } from "@/apps/default/hooks/states/StageState";
import { Html } from "@react-three/drei/web/Html";
import type { Vector3 } from "@react-three/fiber";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { usePanelOpen } from "./PanelProvider";
import { Line } from "@react-three/drei";

/**
 * Crosshair (Fadenkreuz) Component
 * Renders at the clicked world coordinates.
 */
const SelectionCrosshair = ({ position }: { position: Vector3 }) => {
  const size = 10; // The length of the crosshair arms in µm

  return (
    <group position={position}>
      {/* Horizontal Line */}
      <Line
        points={[
          [-size, 0, 0.1],
          [size, 0, 0.1],
        ]}
        color="#10b981" // Emerald
        lineWidth={1.5}
      />
      {/* Vertical Line */}
      <Line
        points={[
          [0, -size, 0.1],
          [0, size, 0.1],
        ]}
        color="#10b981"
        lineWidth={1.5}
      />
      {/* Outer Glow / Halo */}
      <mesh position={[0, 0, 0.05]}>
        <ringGeometry args={[size * 0.8, size, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

/**
 * ClickWidget: Context menu for world-space interaction.
 */
const ClickWidget = ({
  position,
  onClose,
}: {
  position: Vector3;
  onClose: () => void;
}) => {
  const { data: stageState } = useStageState({ subscribe: true });
  const { assign: moveToPosition } = useMoveStage();

  return (
    <Html position={position} center distanceFactor={1}>
      <Card className="min-w-[150px] p-3 bg-gray-800/90 border-gray-700">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Targeting
          </span>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
        {position && (
          <div className="mt-2 text-xs font-mono bg-gray-700/50 p-2 rounded">
            X: {position.x.toFixed(2)}
            <br />
            Y: {position.y.toFixed(2)}
            <br />
            Z: {position.z.toFixed(2)}
          </div>
        )}
        <Button
          onClick={() => {
            moveToPosition({
              x: (stageState?.x || 0) - position.x,
              y: (stageState?.y || 0) - position.y,
              z: 0,
              is_absolute: true,
              step_size: 10,
            });
            onClose();
          }}
          className="w-full mt-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white py-1 px-2 rounded"
        >
          Move Here
        </Button>
      </Card>
    </Html>
  );
};

export const StageBox = () => {
  const { data: stageState } = useStageState({ subscribe: true });
  const [clickPoint, setClickPoint] = useState<Vector3 | null>(null);

  const { open: openPanel } = usePanelOpen();

  if (!stageState) return null;

  const stageRangeX = Math.max(
    200,
    (stageState?.max_x ?? 100) - (stageState?.min_x ?? -100),
  );
  const stageRangeY = Math.max(
    200,
    (stageState?.max_y ?? 100) - (stageState?.min_y ?? -100),
  );

  // Grid settings:
  // We use the larger dimension to ensure the square grid covers the whole stage.
  const gridSize = Math.max(stageRangeX, stageRangeY);
  const divisions = 20; // Adjust for density (e.g., if stage is 200um, this is 10um per line)

  // Position is [x, y, z]. We use Z=-0.5 so it sits slightly below our video and grid.
  return (
    <>
      {clickPoint && (
        <ClickWidget
          position={clickPoint}
          onClose={() => setClickPoint(null)}
        />
      )}
      {clickPoint && <SelectionCrosshair position={clickPoint} />}
      <group position={[stageState.x, stageState.y, -0.5]}>
        <mesh
          position={[0, 0, -1]}
          onClick={(e) => {
            if (!e.metaKey) return; // Allow zoom/pan with modifier keys
            e.stopPropagation();
            setClickPoint(e.point);
          }}
        >
          <planeGeometry args={[stageRangeX, stageRangeY]} />
          <meshStandardMaterial color="#916e6e57" />
        </mesh>
        {/* 2. The Functional Grid Overlay */}
        <gridHelper
          args={[gridSize, divisions, "#475569", "#1e293b"]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0, -0.95]} // Slightly above the black plane
        />
        <mesh position={[0, 0, -0.9]}>
          <planeGeometry args={[stageRangeX, stageRangeY]} />
          <meshBasicMaterial color="#334155" wireframe wireframeLinewidth={5} />
        </mesh>
      </group>
    </>
  );
};
