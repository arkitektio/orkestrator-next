import { useEffect } from "react";
import { useEditRiver } from "../context";

export const RedoUndoHandler = () => {
  const { undo, redo, canUndo, canRedo } = useEditRiver();

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      const isPrimaryModifier = event.ctrlKey || event.metaKey;

      if (!isPrimaryModifier) {
        return;
      }

      if (event.key === "z" && canUndo) {
        undo();
      }

      if ((event.key === "y" || (event.shiftKey && event.key === "Z")) && canRedo) {
        redo();
      }
    };

    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [canRedo, canUndo, redo, undo]);

  return null;
};
