import React, { useContext } from "react";
import { FlowFragment } from "../api/graphql";

export type ShowRiverContextType = {
  flow?: FlowFragment | null;
};

export const ShowRiverContext = React.createContext<ShowRiverContextType>({});

export const useShowRiver = () => useContext(ShowRiverContext);
