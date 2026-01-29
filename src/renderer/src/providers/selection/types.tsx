import { Structure } from "../../types";

export type Selectable = {
  structure: Structure;
  item: HTMLElement;
};

export type SelectionContextType = {
  selection: Structure[];
  isMultiSelecting: boolean;
  focus?: Structure;
  bselection: Structure[];
  removeSelection: () => void;
  setBSelection: (selection: Structure[]) => void;
  setSelection: (selection: Structure[]) => void;
  unselect: (identifier: Structure[]) => void;
  setIsMultiSelecting: (state: boolean) => void;
  registerSelectables: (selectable: Selectable[]) => void;
  toggleSelection: (structure: Structure) => void;
  toggleBSelection: (structure: Structure) => void;
  unregisterSelectables: (selectables: Selectable[]) => void;
};
