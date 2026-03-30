import { useModeStore } from "../store/modeStore";
import { Line } from "@react-three/drei";

export const SceneAxis = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);

  if (interactionMode === "META") return null;


  const stageRangeX = 400;
  const stageRangeY = 400;


  return (
    <group>
      <Line
        points={[
          [-stageRangeX / 2, 0, 0.1],
          [stageRangeX / 2, 0, 0.1],
        ]}
        color="#ef4444"
        lineWidth={1}
      />
      <Line
        points={[
          [0, -stageRangeY / 2, 0.1],
          [0, stageRangeY / 2, 0.1],
        ]}
        color="#22c55e"
        lineWidth={1}
      />
    </group>
  );
};
