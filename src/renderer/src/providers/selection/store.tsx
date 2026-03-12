import { Box, boxesIntersect } from "@air/react-drag-to-select";
import { createStore, StoreApi } from "zustand/vanilla";

import { Structure } from "../../types";

export interface Selectable {
  structure: Structure;
  item: HTMLElement;
}

const isSameStructure = (left: Structure, right: Structure) =>
  left.identifier === right.identifier && left.object === right.object;

export interface SelectionState {
  selection: Structure[];
  bselection: Structure[];
  selectables: Selectable[];
  focusIndex: number | undefined;
  isMultiSelecting: boolean;
  setSelection: (selection: Structure[]) => void;
  setBSelection: (bselection: Structure[]) => void;
  setFocusIndex: (
    updater: number | undefined | ((prev?: number) => number | undefined),
  ) => void;
  setIsMultiSelecting: (isMultiSelecting: boolean) => void;
  registerSelectables: (newItems: Selectable[]) => void;
  unregisterSelectables: (items: Selectable[]) => void;
  unselect: (structures: Structure[]) => void;
  toggleSelection: (structure: Structure) => void;
  toggleBSelection: (structure: Structure) => void;
  clear: () => void;
  handleSelectionChange: (box: Box) => void;
}

export type SelectionStore = StoreApi<SelectionState>;

export const createSelectionStore = (): SelectionStore => {
  return createStore<SelectionState>((set, get) => ({
    selection: [],
    bselection: [],
    selectables: [],
    focusIndex: undefined,
    isMultiSelecting: false,

    setSelection: (selection) => set({ selection }),
    setBSelection: (bselection) => set({ bselection }),
    setFocusIndex: (updater) =>
      set((state) => ({
        focusIndex:
          typeof updater === "function" ? updater(state.focusIndex) : updater,
      })),
    setIsMultiSelecting: (isMultiSelecting) => set({ isMultiSelecting }),

    registerSelectables: (newItems) =>
      set((state) => ({
        selectables: [...state.selectables, ...newItems].filter(
          (item, index, array) =>
            array.findIndex(
              (candidate) =>
                candidate.item === item.item &&
                isSameStructure(candidate.structure, item.structure),
            ) === index,
        ),
      })),

    unregisterSelectables: (toRemove) =>
      set((state) => ({
        selectables: state.selectables.filter(
          (item) =>
            !toRemove.some(
              (candidate) =>
                candidate.item === item.item ||
                isSameStructure(candidate.structure, item.structure),
            ),
        ),
      })),

    unselect: (structures) =>
      set((state) => ({
        selection: state.selection.filter(
          (item) => !structures.some((candidate) => isSameStructure(candidate, item)),
        ),
      })),

    toggleSelection: (structure) =>
      set((state) => {
        const exists = state.selection.some((item) =>
          isSameStructure(item, structure),
        );

        if (exists) {
          return {
            selection: state.selection.filter(
              (item) => !isSameStructure(item, structure),
            ),
          };
        }

        return {
          selection: [...state.selection, structure],
          bselection: state.bselection.filter(
            (item) => !isSameStructure(item, structure),
          ),
        };
      }),

    toggleBSelection: (structure) =>
      set((state) => {
        const exists = state.bselection.some((item) =>
          isSameStructure(item, structure),
        );

        if (exists) {
          return {
            bselection: state.bselection.filter(
              (item) => !isSameStructure(item, structure),
            ),
          };
        }

        return {
          bselection: [...state.bselection, structure],
          selection: state.selection.filter(
            (item) => !isSameStructure(item, structure),
          ),
        };
      }),

    clear: () =>
      set({
        selection: [],
        bselection: [],
        focusIndex: undefined,
        isMultiSelecting: false,
      }),

    handleSelectionChange: (box) => {
      const { selectables, bselection } = get();
      if (box.width <= 5 && box.height <= 5) {
        return;
      }

      const scrollAwareBox = {
        ...box,
        top: box.top + window.scrollY,
        left: box.left + window.scrollX,
      };

      const selection = selectables
        .filter((item) =>
          boxesIntersect(scrollAwareBox, item.item.getBoundingClientRect()),
        )
        .map((item) => item.structure);

      set({
        selection,
        isMultiSelecting: true,
        bselection: bselection.filter(
          (item) => !selection.some((candidate) => isSameStructure(candidate, item)),
        ),
      });
    },
  }));
};

export const selectFocus = (state: SelectionState): Structure | undefined => {
  if (state.focusIndex === undefined) {
    return undefined;
  }

  return state.selectables[state.focusIndex]?.structure;
};

