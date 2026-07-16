import { createContext, useContext, useMemo } from "react";

export type RefetchContextType = {
  refetch?: () => Promise<unknown>;
};

export const RefetchContext = createContext<RefetchContextType>({});

/**
 * Publishes a query's refetch so layouts further down the tree (which never
 * receive it as a prop) can offer a refresh affordance.
 */
export const RefetchProvider = ({
  refetch,
  children,
}: {
  refetch?: () => Promise<unknown>;
  children: React.ReactNode;
}) => {
  const value = useMemo(() => ({ refetch }), [refetch]);

  return (
    <RefetchContext.Provider value={value}>{children}</RefetchContext.Provider>
  );
};

/** Undefined outside a provider — not every page publishes a refetch. */
export const useRefetch = () => useContext(RefetchContext).refetch;
