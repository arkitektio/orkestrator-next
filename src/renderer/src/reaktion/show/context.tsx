import { FlowFragment } from "@/reaktion/api/graphql";
import { DetailImplementationFragment } from "@/rekuest/api/graphql";
import React, { useContext } from "react";

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
