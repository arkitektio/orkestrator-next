import React, { useContext } from "react";
import { ArkitektNodeData } from "../types";
import { FlowFragment } from "@/rekuest/api/graphql";

export type ShowRiverContextType = {
  flow?: FlowFragment | null;
  updateData: (data: Partial<ArkitektNodeData>, id: string) => void;
  showEdgeLabels: boolean;
};

export const EditRiverContext = React.createContext<ShowRiverContextType>({
  updateData: () => {},
  showEdgeLabels: false,
});

export const useEditRiver = () => useContext(EditRiverContext);
