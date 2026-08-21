import React from "react";
import { Outlet, useParams } from "react-router-dom";

/**
 * Which graph the pages below this route are reading through.
 *
 * Kraph splits its reads by grain. A *claim* — an `Instance`, a `Link`, a
 * `Structure` — belongs to the organization and is addressed by a bare uuid. A
 * *drawing* of that claim exists only inside one graph, and the fields that make
 * a detail page worth showing (`category`, `properties`, `richProperties`,
 * `label`) are all on the drawing. So `entity(id:, graph:)` takes two arguments
 * and refuses a node the named view does not admit.
 *
 * The graph used to travel inside the id: a `GraphID` scalar packed
 * `graph:localId` into one opaque string, which is why every kraph route needed
 * only `:id` and none of them knew which grain they were at. That scalar is
 * gone. The graph is a viewing context now, so it lives where viewing contexts
 * belong — in the route — and the id stays a bare uuid that a drag-and-drop
 * payload can honestly carry.
 */
export type GraphScope = {
  graphId: string;
};

const GraphScopeContext = React.createContext<GraphScope | null>(null);

export const GraphScopeProvider: React.FC<{
  graphId: string;
  children: React.ReactNode;
}> = ({ graphId, children }) => {
  const value = React.useMemo(() => ({ graphId }), [graphId]);
  return (
    <GraphScopeContext.Provider value={value}>
      {children}
    </GraphScopeContext.Provider>
  );
};

/** The graph in scope, or null outside one. */
export const useGraphScope = (): GraphScope | null =>
  React.useContext(GraphScopeContext);

/**
 * The graph in scope, or a throw.
 *
 * For view-grain reads, which have no meaningful answer without a graph. A
 * component that can also render at claim grain should use `useGraphScope` and
 * branch instead.
 */
export const useRequiredGraphScope = (): GraphScope => {
  const scope = useGraphScope();
  if (!scope) {
    throw new Error(
      "This component reads a graph's drawing of a claim, so it must render " +
        "under a `graphs/:graph` route. Read the claim itself instead if there " +
        "is no graph in hand — `instance(id:)` answers for any node.",
    );
  }
  return scope;
};

/**
 * The layout route for `kraph/graphs/:graph/*`.
 *
 * Deliberately thin: it is not `GraphPage`, which is one of its children. All it
 * does is turn the URL segment into context so the pages below never have to
 * thread a graph id through props.
 */
export const GraphScopeLayout: React.FC = () => {
  const { graph } = useParams<{ graph: string }>();

  if (!graph) {
    return <>This route is illconfigured: no graph in the path.</>;
  }

  return (
    <GraphScopeProvider graphId={graph}>
      <Outlet />
    </GraphScopeProvider>
  );
};
