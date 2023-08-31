import React, { useContext } from "react";
import { FlowFragment } from "../api/graphql";
import { ArkitektNodeData } from "../types";

export type ShowRiverContextType = {
  flow?: FlowFragment | null;
  updateData: (data: Partial<ArkitektNodeData>, id: string) => void;
};

export const EditRiverContext = React.createContext<ShowRiverContextType>({
  updateData: () => {},
});

export const useEditRiver = () => useContext(EditRiverContext);
