import React, { useContext } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { createEditFlowStore, EditFlowState } from "./store";

export type EditFlowStoreApi = ReturnType<typeof createEditFlowStore>;

export const EditFlowStoreContext =
  React.createContext<EditFlowStoreApi | null>(null);

export const useEditFlowStoreApi = () => {
  const store = useContext(EditFlowStoreContext);

  if (!store) {
    throw new Error("useEditFlowStoreApi must be used within EditFlowStoreContext");
  }

  return store;
};

export const useEditFlowStore = <T,>(selector: (state: EditFlowState) => T) => {
  const store = useEditFlowStoreApi();
  return useStore(store, selector);
};

export const useEditRiver = () => {
  const store = useEditFlowStoreApi();

  const state = useStore(store, useShallow((currentState) => currentState));
  const temporal = useStore(
    store.temporal,
    useShallow((temporalState) => ({
      undo: temporalState.undo,
      redo: temporalState.redo,
      canUndo: temporalState.pastStates.length > 0,
      canRedo: temporalState.futureStates.length > 0,
    })),
  );

  return {
    ...state,
    ...temporal,
    state,
  };
};

export const useEditNodeErrors = (id: string) => {
  const remainingErrors = useEditFlowStore((state) => state.remainingErrors);
  return remainingErrors.filter((error) => error.id === id && error.type === "node");
};

export const useSubflowChildCount = (id: string) => {
  return useEditFlowStore(
    (state) => state.nodes.filter((node) => node.parentId === id).length,
  );
};

