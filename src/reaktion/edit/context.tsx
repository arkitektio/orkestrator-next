import React, { useContext } from "react";
import { ArkitektNodeData } from "../types";
import {
  FlowFragment,
  GlobalArg,
  GlobalArgFragment,
} from "@/rekuest/api/graphql";
import { ValidationResult } from "../validation/types";

export type ShowRiverContextType = {
  flow?: FlowFragment | null;
  updateData: (data: Partial<ArkitektNodeData>, id: string) => void;
  setGlobals: (data: GlobalArgFragment[]) => void;
  removeGlobal: (key: string) => void;
  moveConstantToGlobals: (
    nodeId: string,
    conindex: number,
    globalkey?: string | undefined,
  ) => void;
  moveStreamToConstants: (
    nodeId: string,
    streamIndex: number,
    itemIndex: number,
  ) => void;
  moveConstantToStream: (
    nodeId: string,
    conindex: number,
    streamIndex: number,
  ) => void;
  state: ValidationResult;
  showEdgeLabels: boolean;
};

export const EditRiverContext = React.createContext<ShowRiverContextType>({
  updateData: () => {},
  setGlobals: () => {},
  state: {
    valid: true,
    remainingErrors: [],
    solvedErrors: [],
    nodes: [],
    edges: [],
    globals: [],
  },
  showEdgeLabels: false,
  removeGlobal: () => {},
  moveConstantToGlobals: () => {},
  moveStreamToConstants: () => {},
  moveConstantToStream: () => {},
});

export const useEditRiver = () => useContext(EditRiverContext);
