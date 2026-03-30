import { VolumeLayer } from "./VolumeLayer";
import { useMemo } from "react";
import { SceneFragment } from "@/mikro-next/api/graphql";
import { useModeStore } from "../store/modeStore";

const MAX_DISPLAYABLE = 10;


export const SceneVolume = (props: {scene: SceneFragment}) => {
  // 1. Get the descriptors directly from your backend state hook
  const mode = useModeStore((s) => s.displayMode);


  const renderedAbleFrames = useMemo(() => {
    return props.scene.layers?.map(x=>x).slice(0, MAX_DISPLAYABLE);
  }, [props.scene.layers]);

  if (mode == "2D") return null;




  // 2. Map over them. React handles all mounting, fetching, and unmounting automatically.
  return (
    <group>
      {renderedAbleFrames?.map((frame) => (
        <VolumeLayer key={frame.id} layer={frame} />
      ))}
    </group>
  );
};
