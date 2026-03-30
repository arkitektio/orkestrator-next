import { useEffect } from "react";
import { useModeStore } from "../store/modeStore";

/**
 * Listens for key holds to temporarily override the mode.
 * e.g., Holding 'D' switches to SCAN mode. Releasing it reverts back.
 */
export const KeyboardModeController = () => {
  const setInteractionMode = useModeStore((s) => s.setInteractionMode);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // Ignore auto-repeat when key is held
      const key = e.key.toLowerCase();

      if (key === "d") setInteractionMode("SCAN");
      if (key === "e") setInteractionMode("EDIT");
      if (key === "m") setInteractionMode("MOVE");
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "d" || key === "e" || key === "m") {
        setInteractionMode("PAN"); // Revert to base mode
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [setInteractionMode]);

  return null; // This is a headless component, it renders nothing
};
