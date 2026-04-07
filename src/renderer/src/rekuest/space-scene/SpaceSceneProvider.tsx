import React, { useRef } from "react";
import { SpaceSceneContext } from "./context";
import { createSpaceSceneStore, SpaceSceneStore } from "./store";
import { SpaceFragment } from "../api/graphql";

export const SpaceSceneProvider: React.FC<{
  space: SpaceFragment;
  children: React.ReactNode;
}> = ({ space, children }) => {
  const storeRef = useRef<SpaceSceneStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createSpaceSceneStore(space.id, space.memberships);
  }

  return (
    <SpaceSceneContext.Provider value={storeRef.current}>
      {children}
    </SpaceSceneContext.Provider>
  );
};
