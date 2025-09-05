import {
  Box,
  boxesIntersect,
  useSelectionContainer,
} from "@air/react-drag-to-select";
import React, { useCallback, useEffect, useState } from "react";
import { Structure } from "../../types";
import { SelectionContext, useSelection } from "./SelectionContext";
import { Selectable } from "./types";
import { ObjectButton, SmartContext } from "@/rekuest/buttons/ObjectButton";
import { motion } from "framer-motion";
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

  const toggleSelection = useCallback(
    (structure: Structure) => {
      setSelection((old) => {
        const exists = old.find(
          (item) =>
            item.identifier === structure.identifier &&
            item.object === structure.object,
        );
        if (exists) {
          const filtered = old.filter(
            (item) =>
              item.identifier !== structure.identifier ||
              item.object !== structure.object,
          );
          return filtered;
        }
        return [...old, structure];
      });
    },
    [setSelection],
  );

  const toggleBSelection = useCallback(
    (structure: Structure) => {
      setBSelection((old) => {
        const exists = old.find(
          (item) =>
            item.identifier === structure.identifier &&
            item.object === structure.object,
        );
        if (exists) {
          const filtered = old.filter(
            (item) =>
              item.identifier !== structure.identifier ||
              item.object !== structure.object,
          );
          return filtered;
        }
        return [...old, structure];
      });
    },
    [setBSelection],
  );

  const removeSelection = useCallback(() => {
    setSelection([]);
    setBSelection([]);
  }, []);

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
        opacity: 0,
      },
    },
  });

  return (
    <SelectionContext.Provider
      value={{
        selection: selection,
        bselection: bselection,
        setSelection: setSelection,
        setBSelection: setBSelection,
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
        toggleSelection,
        toggleBSelection,
        unselect,
        removeSelection,
        isMultiSelecting,
      }}
    >
      <DragSelection />
      {children}
      <SelectionBox />
    </SelectionContext.Provider>
  );
};

export const SelectionBox = (props: {}) => {
  const { selection, setSelection, bselection, setBSelection } = useSelection();
  useEffect(() => {
    // Only attach handlers while there is an active selection

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Walk up the DOM to find an element that explicitly declares
      // a data-selectable attribute. If found and it's a non-selectable
      // value ("false" or "0"), clear the selection.
      let el: HTMLElement | null = target;
      let val: boolean | null = false;
      while (el && el !== document.body) {
        if (
          el.hasAttribute("data-object") ||
          el.hasAttribute("data-nonbreaker")
        ) {
          val = true;
          break;
        }
        el = el.parentElement;
      }

      if (!val) {
        e.stopPropagation();
        setSelection([]);
        setBSelection([]);
      }

      // If no ancestor declares data-selectable, do nothing.
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setSelection([]);
        setBSelection([]);
      }
    };

    document.body.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selection, setSelection, setBSelection, bselection]);

  if (selection.length === 0) return <></>;

  // count unique identifiers
  const uniqueIdentifiers = Array.from(
    new Set(selection.map((s) => s.identifier)),
  );

  const buniqueIdentifiers = Array.from(
    new Set(bselection.map((s) => s.identifier)),
  );

  const btotal = bselection.length;

  const total = selection.length;
  const types = uniqueIdentifiers.length;

  return (
    <motion.div
      className="fixed bottom-3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      role="status"
      aria-live="polite"
      data-nonbreaker
    >

      <div
        className={
          "shadow-3xl shadow-black/10 flex items-center gap-3 bg-background border border-border rounded-full px-4 py-2 shadow-2xl will-change-transform transition-transform transition-opacity duration-200 ease-out transform "
        }
      >
        <div className="flex items-baseline gap-2">
          <div className="font-semibold text-primary">{total}</div>

          <div className="ml-2 text-sm text-muted-foreground">
            {uniqueIdentifiers.map((c) => c).join(", ")}
          </div>
          <div className="text-sm text-muted-foreground">selected</div>
        </div>

        {btotal && btotal > 0 && (
          <>
            <div className="flex items-baseline gap-2">
              <div className="font-semibold text-red-500"> + {btotal}</div>

              <div className="ml-2 text-sm text-muted-foreground">
                {buniqueIdentifiers.map((c) => c).join(", ")}
              </div>
              <div className="text-sm text-muted-foreground">selected</div>
            </div>
          </>
        )}

        <div className="w-px h-6 bg-border opacity-30" />

        {types == 1 && (
          <ObjectButton objects={selection} partners={bselection} />
        )}


        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelection([]);
            setBSelection([]);
          }}
          aria-label="Clear selection"
          className="ml-3 mr-2 p-1 rounded-full hover:bg-gray-200/10 focus:outline-none"
        >
          <span className="text-xl leading-none">×</span>
        </button>
      </div>
    </motion.div>
  );
};
