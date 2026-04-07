import React, { useContext } from "react";
import { useStore } from "zustand";
import { SpaceSceneState, SpaceSceneStore } from "./store";

export const SpaceSceneContext = React.createContext<SpaceSceneStore | null>(
  null,
);

export const useSpaceSceneStoreApi = (): SpaceSceneStore => {
  const store = useContext(SpaceSceneContext);
  if (!store) {
    throw new Error(
      "useSpaceSceneStore must be used within a SpaceSceneProvider",
    );
  }
  return store;
};

export const useSpaceScene = <T,>(
  selector: (state: SpaceSceneState) => T,
): T => {
  const store = useSpaceSceneStoreApi();
  return useStore(store, selector);
};
