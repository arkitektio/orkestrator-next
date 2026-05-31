import { VolumeLayer } from "./VolumeLayer";
import { SceneProbedPoint } from "./SceneProbedPoint";
import { useMemo } from "react";
import { useSceneStore } from "../../store/sceneStore";

const MAX_DISPLAYABLE = 10;


export const SceneVolume = () => {
  const layers = useSceneStore((s) => s.layers);


  const renderedAbleFrames = useMemo(() => {
    return layers
      .filter((layer) => layer.visible !== false)
      .slice(0, MAX_DISPLAYABLE);
  }, [layers]);

  // 2. Map over them. React handles all mounting, fetching, and unmounting automatically.
  return (
    <group>
      {renderedAbleFrames?.map((frame) => (
        <VolumeLayer
          key={`${frame.id}:${frame.fixedLOD == null ? 'auto' : frame.fixedLOD}`}
          layer={frame}
        />
      ))}
      <SceneProbedPoint />
    </group>
  );
};
