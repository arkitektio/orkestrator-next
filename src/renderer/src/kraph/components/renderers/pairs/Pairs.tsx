"use client";

import { ViewOptions } from "../DelegatingNodeViewRenderer";

// NOTE: The backend's `renderGraphPairs` query now returns the same
// `GraphPathRender` shape as `renderGraphPath` (a node/edge graph) instead of
// the old `{ pairs: [{ source, target }] }` shape. The types this component
// used to depend on (`GraphQueryFilters`, `GraphQueryPagination`,
// `PairsFragment`, `useRenderGraphQueryQuery`) no longer exist in the
// generated API, and no GraphQL operation document requesting
// `renderGraphPairs` exists in this codebase yet, so there is no hook to
// fetch it. The former "pairs of entities" table view is left as an
// unavailable placeholder until a `renderGraphPairs` query operation is
// added and this can be rebuilt against the new node/edge shape.
export const RenderGraphQueryPairs = (_props: {
  graphQueryId: string;
  options?: ViewOptions;
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center text-center text-muted-foreground p-4">
      Pairs view is not available.
    </div>
  );
};
