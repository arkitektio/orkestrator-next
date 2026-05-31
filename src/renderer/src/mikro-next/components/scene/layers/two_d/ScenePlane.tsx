import { useMemo } from "react";
import { useSceneStore } from "../../store/sceneStore";
import { PlaneLayer } from "./PlaneLayer";
const MAX_DISPLAYABLE = 10;


export const ScenePlane = () => {
  const layers = useSceneStore((s) => s.layers);

  const renderedAbleFrames = useMemo(() => {
    return layers.slice(0, MAX_DISPLAYABLE);
  }, [layers]);

  // 2. Map over them. React handles all mounting, fetching, and unmounting automatically.
  return (
    <group>
      {renderedAbleFrames?.map((frame) => (
        <PlaneLayer key={frame.id} layerId={frame.id}/>
      ))}
    </group>
  );
};
