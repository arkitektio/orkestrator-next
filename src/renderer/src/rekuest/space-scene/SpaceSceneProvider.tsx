import React, { useState } from "react";
import { SpaceFragment } from "../api/graphql";
import { SpaceSceneContext } from "./context";
import { createSpaceSceneStore, SpaceSceneStore } from "./store";

export const SpaceSceneProvider: React.FC<{
  space: SpaceFragment;
  children: React.ReactNode;
}> = ({ space, children }) => {
  const [store] = useState<SpaceSceneStore>(() => createSpaceSceneStore(space.id, space.placements));


  return (
    <SpaceSceneContext.Provider value={store}>
      {children}
    </SpaceSceneContext.Provider>
  );
};
