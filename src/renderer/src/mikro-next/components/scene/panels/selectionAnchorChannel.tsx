import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Point3 } from "../core/selectionAnchor";

/**
 * The hand-off between an anchored HUD panel (DOM, outside the canvas) and the
 * frame callback that positions it (inside the canvas): the panel publishes
 * WHERE IN THE WORLD it belongs and how big it is, the projector reads that
 * every rendered frame and writes the node's transform.
 *
 * Not a zustand store and not React state on purpose — this is a per-frame
 * channel, and both ends want to bypass React entirely:
 *
 * - The projector must NOT re-render anything at camera cadence (P17): it
 *   mutates `element.style.transform` directly, the same trick
 *   `DrawSizeReadout` uses to follow the cursor.
 * - The panel writes rarely (a selection change), so a subscription exists
 *   only to WAKE the render loop — `frameloop="demand"` means an anchor that
 *   changed without the camera moving would otherwise never be projected.
 *
 * Scoped to a viewport rather than module-global so two mounted scenes each
 * position their own panel.
 */

export type SelectionAnchorState = {
  /**
   * The world point the panel is pinned to, or null for "no anchor" — the
   * projector then parks it in the corner, which is what a selection whose
   * geometry has not resolved yet (a mesh pick before its catalog answers)
   * falls back to.
   */
  world: Point3 | null;
  /** The panel node, registered by the panel itself while it is mounted. */
  element: HTMLElement | null;
  /** The panel's rendered size in CSS px — the projector needs it to keep the
   * box inside the canvas, and must never read it back from layout per frame. */
  size: { width: number; height: number };
};

export type SelectionAnchorChannel = {
  read: () => SelectionAnchorState;
  set: (patch: Partial<SelectionAnchorState>) => void;
  subscribe: (listener: () => void) => () => void;
};

const createSelectionAnchorChannel = (): SelectionAnchorChannel => {
  const state: SelectionAnchorState = {
    world: null,
    element: null,
    size: { width: 0, height: 0 },
  };
  const listeners = new Set<() => void>();

  return {
    read: () => state,
    set: (patch) => {
      Object.assign(state, patch);
      for (const listener of listeners) listener();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

const SelectionAnchorContext = createContext<SelectionAnchorChannel | null>(null);
SelectionAnchorContext.displayName = "SelectionAnchorContext";

/** Wraps a viewport's canvas AND its chrome — the two ends of the channel. */
export const SelectionAnchorProvider = ({ children }: { children: ReactNode }) => {
  const channel = useMemo(() => createSelectionAnchorChannel(), []);
  return (
    <SelectionAnchorContext.Provider value={channel}>
      {children}
    </SelectionAnchorContext.Provider>
  );
};

/** Throws outside the provider: a panel that silently stops tracking its
 * object is a bug that must not be able to ship quietly. */
export const useSelectionAnchorChannel = (): SelectionAnchorChannel => {
  const channel = useContext(SelectionAnchorContext);
  if (!channel) {
    throw new Error("Missing <SelectionAnchorProvider> above this component");
  }
  return channel;
};
