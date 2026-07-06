import { createContext, useContext } from "react";

/**
 * Drives the tree's dominance "importance" heatmap without rebuilding the
 * (memoized) React Flow nodes. `SectionNode` reads this to override its color
 * bar while `active`; toggling the context re-renders the memoized nodes.
 */
export type ImportanceContextValue = {
  active: boolean;
  colorFor: (sectionId: string) => string | undefined;
};

export const ImportanceContext = createContext<ImportanceContextValue>({
  active: false,
  colorFor: () => undefined,
});

export const useImportance = () => useContext(ImportanceContext);
