import { FlowFragment } from "@/reaktion/api/graphql";
import React, { useContext } from "react";
import { ValidationResult } from "../validation/types";
import { DetailImplementationFragment } from "@/rekuest/api/graphql";

export type ShowRiverContextType = {
  flow?: FlowFragment | null;
  template?: DetailImplementationFragment | null;
  showEdgeLabels: boolean;
  showNodeErrors: boolean;
};

export const ShowRiverContext = React.createContext<ShowRiverContextType>({
  template: null,
  showEdgeLabels: false,
  showNodeErrors: true,
});

export const useShowRiver = () => useContext(ShowRiverContext);
