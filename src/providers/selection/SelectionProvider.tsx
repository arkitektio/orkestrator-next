import {
  Box,
  boxesIntersect,
  useSelectionContainer,
} from "@air/react-drag-to-select";
import React, { useEffect, useState } from "react";
import { Structure } from "../../types";
import { Selectable } from "./types";
import { SelectionContext } from "./SelectionContext";
export type ArkitektProps = { children: React.ReactNode };

export const SelectionProvider: React.FC<ArkitektProps> = ({ children }) => {
  const [selection, setSelection] = useState<Structure[]>([]);
  const [bselection, setBSelection] = useState<Structure[]>([]);
  const [selectables, setSelectables] = useState<Selectable[]>([]);
  const [focus, setFocus] = useState<Structure | undefined>();
  const [focusIndex, setFocusIndex] = useState<number>();
  const [isMultiSelecting, setIsMultiSelecting] = useState<boolean>(false);

  const unselect = (unselected: Structure[]) => {
    setSelection((selection) =>
      selection.filter(
        (item) =>
          !unselected.some(
            (uns) => item.identifier == uns.identifier && uns.id == item.id,
          ),
      ),
    );
  };

  useEffect(() => {
    if (focusIndex !== undefined) {
      const focus = selectables[focusIndex];
      if (focus) {
        setFocus(focus.structure);
      }
    } else {
      setFocus(undefined);
    }
  }, [focusIndex]);

  useEffect(() => {
    const listener = {
      handleEvent: (e: KeyboardEvent) => {
        if ((e.key === "ArrowDown" || e.key == "ArrowRight") && e.ctrlKey) {
          setFocusIndex((i) =>
            i === undefined || i >= (selectables.length || 0) - 1 ? 0 : i + 1,
          );
        }
        if ((e.key === "ArrowUp" || e.key == "ArrowLeft ") && e.ctrlKey) {
          setFocusIndex((i) => (i === undefined || i <= 0 ? 0 : i - 1));
        }
        if (e.key === "Tab") {
          setFocusIndex(undefined);
        }
      },
    };

    const onOutListener = {
      handleEvent: (e: MouseEvent) => {
        setFocusIndex(undefined);
      },
    };

    document.addEventListener("keydown", listener);
    document.addEventListener("click", onOutListener);

    return () => {
      document.removeEventListener("keydown", listener);
      document.removeEventListener("click", onOutListener);
    };
  }, [selectables]);

  useEffect(() => {
    if (isMultiSelecting) {
      const handler = (e: any) => {
        e.stopPropagation();
        if (isMultiSelecting) {
          console.log(e);
          console.log("Called");
          setIsMultiSelecting(false);
          setSelection([]);
          setBSelection([]);
        }
      };

      document.body.addEventListener("mousedown", handler);

      return () => {
        document.body.removeEventListener("mousedown", handler);
      };
    }
  }, [isMultiSelecting, setIsMultiSelecting]);

  const handleSelectionChange = (box: Box) => {
    const scrollAwareBox = {
      ...box,
      top: box.top + window.scrollY,
      left: box.left + window.scrollX,
    };

    if (box.width > 56 && box.height > 65) {
      const indexesToSelect: number[] = [];
      console.log(selectables);
      selectables.forEach((item, index) => {
        let lala = item.item.getBoundingClientRect();
        if (lala && boxesIntersect(scrollAwareBox, lala)) {
          indexesToSelect.push(index);
        }
      });

      setSelection((selection) =>
        selectables
          .map((item) => item.structure)
          .filter((_, index) => indexesToSelect.includes(index)),
      );
      setIsMultiSelecting(true);
    }
  };

  

  const { DragSelection } = useSelectionContainer({
    onSelectionChange: handleSelectionChange,
    shouldStartSelecting: (target) => {
      /**
       * In this example, we're preventing users from selecting in elements
       * that have a data-disableselect attribute on them or one of their parents
       */

      if (target instanceof HTMLElement) {
        let el = target;
        return el.dataset.enableselect == "true";
      }

      /**
       * If the target doesn't exist, return false
       * This would most likely not happen. It's really a TS safety check
       */
      return false;
    },
    selectionProps: {
      style: {
        border: "2px hsl(var(--primary))",
        borderRadius: 4,
        backgroundColor: "hsl(var(--primary))",
        opacity: 0.,
      },
    },
  });

  return (
    <SelectionContext.Provider
      value={{
        selection: selection,
        setSelection: setSelection,
        setIsMultiSelecting,
        focus: focus,
        registerSelectables: (newselectables) => {
          setSelectables((selectables) => selectables.concat(newselectables));
        },
        unregisterSelectables(unselectables) {
          setSelectables((selectables) =>
            selectables.filter(
              (s) =>
                !unselectables.some(
                  (s2) =>
                    s2.structure.identifier == s.structure.identifier &&
                    s2.structure.id == s.structure.id,
                ),
            ),
          );
        },

        unselect,
        isMultiSelecting,
      }}
    >
      <DragSelection />
      {children}
    </SelectionContext.Provider>
  );
};
