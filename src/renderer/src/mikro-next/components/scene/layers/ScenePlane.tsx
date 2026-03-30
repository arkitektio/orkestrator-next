import { VolumeLayer } from "./VolumeLayer";
import { useMemo } from "react";
import { SceneFragment } from "@/mikro-next/api/graphql";

const MAX_DISPLAYABLE = 10;


export const ScenePlane = (props: {scene: SceneFragment}) => {
  // 1. Get the descriptors directly from your backend state hook


  const renderedAbleFrames = useMemo(() => {
    return props.scene.layers?.map(x=>x).slice(0, MAX_DISPLAYABLE);
  }, [props.scene.layers]);




  // 2. Map over them. React handles all mounting, fetching, and unmounting automatically.
  return (
    <group>
      {renderedAbleFrames?.map((frame) => (
        <VolumeLayer key={frame.id} layer={frame} />
      ))}
    </group>
  );
};
