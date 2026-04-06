import { useEffect, useMemo, useRef } from "react";
import { useModeStore } from "../store/modeStore";
import { useSceneStore } from "../store/sceneStore";
import { PlaneLayer } from "./PlaneLayer";
import { useViewerStore } from "../store/viewerStore";
import * as THREE from "three";
const MAX_DISPLAYABLE = 10;


export const ScenePlane = (props) => {
  // 1. Get the descriptors directly from your backend state hook
  const mode = useModeStore((s) => s.displayMode);
  const layers = useSceneStore((s) => s.layers);

  const renderedAbleFrames = useMemo(() => {
    console.log("renderedAbleFrames recalculated:", layers?.length);
    return layers?.map(x=>x).slice(0, MAX_DISPLAYABLE);
  }, [layers?.length]);

  if (mode == "3D") return null;


  // 2. Map over them. React handles all mounting, fetching, and unmounting automatically.
  return (
    <group>
      {renderedAbleFrames?.map((frame) => (
        <PlaneLayer key={frame.id} layerId={frame.id}/>
      ))}
    </group>
  );
};
