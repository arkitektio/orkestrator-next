import React, { useCallback, useContext, useMemo } from "react";
import { Structure } from "../../types";
import { SelectionContextType } from "./types";

export const SelectionContext = React.createContext<SelectionContextType>({
  selection: [],
  bselection: [],
  setSelection: () => {},
  unselect: () => {},
  isMultiSelecting: false,
  setIsMultiSelecting: () => {},
  registerSelectables: () => {},
  unregisterSelectables: () => {},
  toggleSelection: () => {},
  toggleBSelection: () => {},
  removeSelection: () => {},
});

export const useSelection = () => useContext(SelectionContext);

export const useMySelect = (options: { self: Structure }) => {
  const { self } = options;

  const {
    selection,
    toggleSelection,
    toggleBSelection,
    bselection,
    removeSelection,
  } = useSelection();

  const isSelected = useMemo(() => {
    const me = selection.findIndex(
      (item) =>
        item.identifier === self.identifier && item.object === self.object,
    );
    return me != -1 ? me + 1 : undefined;
  }, [selection, self]);

  const isBSelected = useMemo(() => {
    const me = bselection.findIndex(
      (item) =>
        item.identifier === self.identifier && item.object === self.object,
    );
    return me != -1 ? me + 1 : undefined;
  }, [bselection, self]);

  const toggle = useCallback(() => {
    toggleSelection(self);
  }, [self, toggleSelection]);

  const toggleB = useCallback(() => {
    toggleBSelection(self);
  }, [self, toggleBSelection]);

  return { isSelected, toggle, isBSelected, toggleB, selection };
};

export const useMySelection = (
  iam: Structure,
  options: {
    onClick?: (event: any) => {};
    unselectOutside?: boolean;
  } = {
    unselectOutside: false,
  },
) => {
  const {
    isMultiSelecting,
    setIsMultiSelecting,
    focus,
    selection,
    setSelection,
  } = useSelection();

  const variables = useMemo(() => {
    const me = selection.find(
      (item) =>
        item.identifier === iam.identifier && item.object === iam.object,
    );

    if (!me) return { me: undefined, hasfocus: false, isSelected: false };
    const myindex = selection.indexOf(me);

    return {
      me: me,
      isSelected: true,

      hasfocus:
        focus?.identifier === iam.identifier && focus?.object === iam.object,
      myindex: myindex,
    };
  }, [selection, focus]);

  const onMouseDown = useCallback(
    (event: any) => {
      if (event.detail === 1) {
        if (event.nativeEvent.shiftKey || event.nativeEvent.shiftKey) {
          if (!isMultiSelecting) {
            // We are not multi selecting, so we should select this item
            setIsMultiSelecting(true);
            setSelection([iam]);
            return;
          }
          if (iam) {
            const array = selection.filter(
              (item) =>
                item.object !== iam.object ||
                item.identifier !== iam.identifier,
            );
            if (array.length === 0) {
              setIsMultiSelecting(false);
              setSelection([]);
            }
            // other elements exist, so we should unselect this item
            setSelection(array);
            return;
          } else {
            setSelection([...selection, iam]);
            return;
          }
        }
      }
      if (!isMultiSelecting) {
        options.onClick && options.onClick(event);
      }
      if (isMultiSelecting) {
        return;
      }
    },
    [isMultiSelecting, iam, selection, options.onClick],
  );

  const bind = {
    onMouseDown,
  };

  return {
    bind,
    ...variables,
    selection,
  };
};
