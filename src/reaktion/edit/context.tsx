import React, { useContext } from "react";
import { ArkitektNodeData, NodeData } from "../types";
import {
  FlowFragment,
  GlobalArg,
  GlobalArgFragment,
} from "@/rekuest/api/graphql";
import { ValidationResult } from "../validation/types";

export type ShowRiverContextType = {
  flow?: FlowFragment | null;
  updateData: (data: Partial<NodeData>, id: string) => void;
  setGlobals: (data: GlobalArgFragment[]) => void;
  removeGlobal: (key: string) => void;
  removeEdge: (id: string) => void;
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
  moveOutStreamToVoid: (
    nodeId: string,
    conindex: number,
    streamIndex: number,
  ) => void;
  moveVoidtoOutstream: (
    nodeId: string,
    conindex: number,
    streamIndex: number,
  ) => void;
  state: ValidationResult;
  showEdgeLabels: boolean;
  showNodeErrors: boolean;
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
  removeEdge: () => {},
  moveConstantToGlobals: () => {},
  moveStreamToConstants: () => {},
  moveConstantToStream: () => {},
  moveOutStreamToVoid: () => {},
  moveVoidtoOutstream: () => {},
  showNodeErrors: true,
});

export const useEditRiver = () => useContext(EditRiverContext);

export const useEditNodeErrors = (id: string) => {
  const { state } = useEditRiver();
  return state.remainingErrors.filter((e) => e.id == id && e.type == "node");
};
