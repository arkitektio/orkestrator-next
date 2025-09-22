import React, { useContext } from "react";
import { DetailRunFragment, FlowFragment } from "../api/graphql";
import { FlowNode } from "../types";
import { RunState } from "./types";

export type TrackRiverContextType = {
  flow?: FlowFragment | null;
  run?: DetailRunFragment | null;
  live?: boolean;
  runState?: RunState | null;
  selectedNode?: FlowNode | null;
  setRunState: React.Dispatch<React.SetStateAction<RunState>>;
  setLive: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TrackRiverContext = React.createContext<TrackRiverContextType>({
  setRunState: () => {
    console.error("WE ARE LACKING AN ENGINE");
  },
  setLive: () => {
    console.error("WE ARE LACKING AN ENGINE");
  },
});

export const useTrackRiver = () => useContext(TrackRiverContext);
