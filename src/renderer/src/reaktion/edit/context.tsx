import { FlowFragment, GlobalArgFragment } from "@/reaktion/api/graphql";
import React, { useContext, useRef } from "react";
import {
  ClickContextualParams,
  ConnectContextualParams,
  DropContextualParams,
  EdgeContextualParams,
  FlowNode,
  NodeData,
} from "../types";
import { ValidationResult } from "../validation/types";
import { createEditFlowStore, EditFlowState } from "./store";
import { useStore as useZustandStore } from "zustand";

export type ShowRiverContextType = {
  flow?: FlowFragment | null;
  showEdgeLabels: boolean;
  showNodeErrors: boolean;
  addContextualNode: (node: FlowNode, params: DropContextualParams) => void;
  addClickNode: (node: FlowNode, params: ClickContextualParams) => void;
  addConnectContextualNode: (node: FlowNode, params: ConnectContextualParams) => void;
  addEdgeContextualNode: (node: FlowNode, params: EdgeContextualParams) => void;
};

export const EditRiverContext = React.createContext<ShowRiverContextType | null>(null);

export const EditFlowStoreContext = React.createContext<ReturnType<typeof createEditFlowStore> | null>(null);

export const useEditRiver = () => {
  const context = useContext(EditRiverContext);
  if (!context) throw new Error("useEditRiver must be used within EditRiverContext");

  const storeContext = useContext(EditFlowStoreContext);
  if (!storeContext) throw new Error("useEditFlowStore must be used within EditFlowStoreContext");

  const storeState = useZustandStore(storeContext);

  return {
    ...context,
    ...storeState,
    state: storeState,
  };
};

export const useEditNodeErrors = (id: string) => {
  const storeContext = useContext(EditFlowStoreContext);
  if (!storeContext) throw new Error("useEditNodeErrors must be used within EditFlowStoreContext");

  const remainingErrors = useZustandStore(storeContext, (state) => state.remainingErrors);
  return remainingErrors.filter((e) => e.id == id && e.type == "node");
};

