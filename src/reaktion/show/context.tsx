import { FlowFragment } from "@/reaktion/api/graphql";
import React, { useContext } from "react";
import { ValidationResult } from "../validation/types";

export type ShowRiverContextType = {
  flow?: FlowFragment | null;
  state: ValidationResult;
  showEdgeLabels: boolean;
  showNodeErrors: boolean;
};

export const ShowRiverContext = React.createContext<ShowRiverContextType>({
  state: {
    valid: true,
    remainingErrors: [],
    solvedErrors: [],
    nodes: [],
    edges: [],
    globals: [],
  },
  showEdgeLabels: false,
  showNodeErrors: true,
});

export const useShowRiver = () => useContext(ShowRiverContext);
