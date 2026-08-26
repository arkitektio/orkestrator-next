import { useDebug } from "@/providers/debug/DebugContext";
import { RefetchProvider } from "@/providers/refetch/RefetchContext";
import {
  ApolloQueryResult,
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  SubscribeToMoreOptions,
  useQuery,
} from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { useGraphScope } from "@/kraph/providers/GraphScopeProvider";
import { DebugPage } from "../components/fallbacks/DebugPage";
import { ErrorPage } from "../components/fallbacks/ErrorPage";
import { LoadingPage } from "../components/fallbacks/LoadingPage";

export type DetailVariables = {
  id: string;
} & OperationVariables;

export type DetailRoute = {
  fallback: React.ReactNode;
};

export type DetailRouteProps<T> = {
  data: QueryResult<T, DetailVariables>;
};

export type HookFunction<T, Y extends DetailVariables> = (
  options: QueryHookOptions<T, Y>,
) => QueryResult<T, Y>;

export const DetailRoute: React.FC<{}> = () => {
  return (
    <div>
      <h1>DetailRoute</h1>
    </div>
  );
};

export const PassedDownComponent = <T extends DocumentNode>(props: {
  component: React.FC<{ data: T }>;
  document: T;
  modifier: (query: any) => any;
  variables: { id: string };
}) => {
  const { data, errors } = props.modifier(useQuery(props.document))({
    variables: props.variables,
  });

  return errors ? <>{errors}</> : props.component({ data: data });
};

export const asDetailQueryRoute = <T extends any>(
  hook: HookFunction<T, DetailVariables>,
  Component: React.FC<{
    id: string;
    data: T;
    refetch: (
      variables?: Partial<DetailVariables> | undefined,
    ) => Promise<ApolloQueryResult<T>>;
    subscribeToMore: <
      TSubscriptionData = T,
      TSubscriptionVariables extends OperationVariables = DetailVariables,
    >(
      options: SubscribeToMoreOptions<
        T,
        TSubscriptionVariables,
        TSubscriptionData
      >,
    ) => () => void;
  }>,
  options: {
    fallback?: React.ReactNode;
    queryOptions?: QueryHookOptions<T, DetailVariables>;
  } = { fallback: <></> },
) => {
  return ({ direct }: { direct?: any | undefined }) => {
    const { debug } = useDebug();
    const { id } = useParams<{ id: string }>();
    if (!id && direct == undefined) {
      if (options.fallback) {
        return options.fallback;
      } else {
        return <> This route is illconfigured</>;
      }
    }

    const passyProps =
      direct ||
      hook({
        variables: { id: id ?? "" },
        ...options.queryOptions,
      });

    if (passyProps.error) {
      if (debug) {
        return <DebugPage data={passyProps.error} />;
      }

      return <ErrorPage error={passyProps.error} />;
    }

    // Guard on data as well: were a route to set notifyOnNetworkStatusChange,
    // a refetch would otherwise tear the whole page down to the loading state.
    if (passyProps.loading && !passyProps.data) return <LoadingPage />;

    if (passyProps && passyProps.data) {
      if (debug) {
        return <DebugPage data={passyProps.data} />;
      }

      return (
        <RefetchProvider refetch={passyProps.refetch}>
          <Component {...passyProps} id={id ?? ""} />
        </RefetchProvider>
      );
    }

    return null;
  };
};

/**
 * `asDetailQueryRoute` for the graph a route is scoped to.
 *
 * The layout route is `graphs/:graph`, so a page rendered *as its index* has no
 * `:id` segment of its own — the graph's id is the scope, not a path param.
 * `asDetailQueryRoute` reads `useParams().id`, finds nothing, and returns its
 * fallback without ever firing the query, which is a blank page.
 *
 * A sibling rather than a widening, for the same reason as
 * `asGraphDetailQueryRoute`: the single-variable shape is load-bearing for the
 * ~40 pages that address a claim by a path id.
 */
export const asGraphScopeQueryRoute = <T extends any>(
  hook: HookFunction<T, DetailVariables>,
  Component: React.FC<{
    id: string;
    data: T;
    refetch: (
      variables?: Partial<DetailVariables> | undefined,
    ) => Promise<ApolloQueryResult<T>>;
  }>,
  options: {
    fallback?: React.ReactNode;
    queryOptions?: QueryHookOptions<T, DetailVariables>;
  } = { fallback: <></> },
) => {
  return () => {
    const { debug } = useDebug();
    const scope = useGraphScope();
    const graphId = scope?.graphId;

    const query = hook({
      variables: { id: graphId ?? "" },
      skip: !graphId,
      ...options.queryOptions,
    });

    if (!graphId) {
      return options.fallback ?? <> This route is illconfigured</>;
    }

    if (query.error) {
      if (debug) return <DebugPage data={query.error} />;
      return <ErrorPage error={query.error} />;
    }

    const data = query.data;
    if (!data) return <LoadingPage />;

    if (debug) return <DebugPage data={data} />;

    return (
      <RefetchProvider refetch={query.refetch}>
        <Component {...query} data={data} id={graphId} />
      </RefetchProvider>
    );
  };
};

export type GraphDetailVariables = {
  id: string;
  graph: string;
} & OperationVariables;

/**
 * `asDetailQueryRoute` for a read that is scoped to one graph.
 *
 * Kraph's view-grain reads take `(id, graph)`: a claim is organization-grain and
 * a *drawing* of it exists only inside a graph, so `entity(id:, graph:)` refuses
 * a node the named view does not admit. The id comes from the path as usual; the
 * graph comes from `GraphScopeProvider`, which the `graphs/:graph` layout route
 * installs.
 *
 * A sibling rather than a widening of `asDetailQueryRoute` on purpose — around
 * forty non-kraph pages depend on that one's single-variable shape.
 */
export const asGraphDetailQueryRoute = <T extends any>(
  hook: HookFunction<T, GraphDetailVariables>,
  Component: React.FC<{
    id: string;
    graph: string;
    data: T;
    refetch: (
      variables?: Partial<GraphDetailVariables> | undefined,
    ) => Promise<ApolloQueryResult<T>>;
  }>,
  options: {
    fallback?: React.ReactNode;
    queryOptions?: QueryHookOptions<T, GraphDetailVariables>;
  } = { fallback: <></> },
) => {
  return ({ direct }: { direct?: any | undefined }) => {
    const { debug } = useDebug();
    const { id } = useParams<{ id: string }>();
    const scope = useGraphScope();

    if ((!id || !scope) && direct == undefined) {
      return options.fallback ?? <> This route is illconfigured</>;
    }

    const passyProps =
      direct ||
      hook({
        variables: { id: id ?? "", graph: scope?.graphId ?? "" },
        ...options.queryOptions,
      });

    if (passyProps.error) {
      if (debug) return <DebugPage data={passyProps.error} />;
      return <ErrorPage error={passyProps.error} />;
    }

    if (passyProps.loading && !passyProps.data) return <LoadingPage />;

    if (passyProps && passyProps.data) {
      if (debug) return <DebugPage data={passyProps.data} />;

      return (
        <RefetchProvider refetch={passyProps.refetch}>
          <Component
            {...passyProps}
            id={id ?? ""}
            graph={scope?.graphId ?? ""}
          />
        </RefetchProvider>
      );
    }

    return null;
  };
};
