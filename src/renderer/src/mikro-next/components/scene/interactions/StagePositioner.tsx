import { useMoveStage } from "@/apps/default/hooks/actions";
import { useStageState } from "@/apps/default/hooks/states/StageState";
import { Html, Line } from "@react-three/drei";
import type { Vector3 } from "@react-three/fiber";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useModeStore } from "@/store/modeStore";

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

/**
 * StagePositioner
 * An invisible plane that covers the scene to catch targeting clicks.
 * Decouples interaction from the visual stage mesh.
 */
export const StagePositioner = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const [clickPoint, setClickPoint] = useState<Vector3 | null>(null);
  const { data: stageState } = useStageState({ subscribe: true });
  const { call: moveToPosition } = useMoveStage();

  if (interactionMode !== "MOVE") return null;

  return (
    <group>
      {/* Invisible Catch-All Plane for Pointer Events */}
      <mesh
        position={[0, 0, -2]} // Placed safely below the stage and grid
        onClick={async (e) => {
          e.stopPropagation();
          setClickPoint(e.point);
          moveToPosition({
            x: (stageState?.x || 0) - e.point.x,
            y: (stageState?.y || 0) - e.point.y,
            z: 0,
            is_absolute: true,
            step_size: 10,
          });
        }}
      >
        {/* A massive plane to ensure you can click anywhere in the expanse */}
        <planeGeometry args={[10000, 10000]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Render the targeting UI if a point is selected */}
      {clickPoint && (
        <>
          <SelectionCrosshair position={clickPoint} />
        </>
      )}
    </group>
  );
};
