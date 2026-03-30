import { useExpanseState } from "@/apps/default/hooks/states/ExpanseState";
import { FrameVolume } from "./FrameVolume";
import { useMemo } from "react";


const MAX_DISPLAYABLE = 10;


export const FramesPlane = () => {
  // 1. Get the descriptors directly from your backend state hook
  const { data: frames } = useExpanseState({selector: (state) => state.current_frames});


  const renderedAbleFrames = useMemo(() => {
    return frames?.map(x=>x).slice(0, MAX_DISPLAYABLE);
  }, [frames]);




  // 2. Map over them. React handles all mounting, fetching, and unmounting automatically.
  return (
    <group>
      {renderedAbleFrames?.map((frame) => (
        <FrameVolume key={frame.id} frame={frame} />
      ))}
    </group>
  );
};
