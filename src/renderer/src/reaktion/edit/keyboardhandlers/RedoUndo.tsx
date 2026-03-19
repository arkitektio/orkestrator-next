import { useEffect } from "react";



export const RedoUndoHandler = () => {
  const { undo, redo, canUndo, canRedo } = useEditRiver();


  useEffect(() => {
      const keyUpListener = (event: KeyboardEvent) => {
        console.log("keyUpListener", event);
        if (event.key == "z" && event.ctrlKey) {
          undo();
        }
        if (event.key == "y" && event.ctrlKey) {
          redo();
        }
      };

      document.addEventListener("keyup", keyUpListener);

      return () => {
        document.removeEventListener("keyup", keyUpListener);
      };
    }, [undo, redo]);

  return <></>;
}
