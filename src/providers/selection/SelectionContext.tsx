import React, { useCallback, useContext, useMemo } from "react";
import { Structure } from "../../types";
import { SelectionContextType } from "./types";

export const SelectionContext = React.createContext<SelectionContextType>({
  selection: [],
  setSelection: () => {},
  unselect: () => {},
  isMultiSelecting: false,
  setIsMultiSelecting: () => {},
  registerSelectables: () => {},
  unregisterSelectables: () => {},
});

export const useSelection = () => useContext(SelectionContext);

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
          event.stopPropagation();
          event.preventDefault();
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
  };
};
