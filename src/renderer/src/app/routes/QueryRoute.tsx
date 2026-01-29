import { useDebug } from "@/providers/debug/DebugContext";
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
import { DebugPage } from "../components/fallbacks/DebugPage";
import { ErrorPage } from "../components/fallbacks/ErrorPage";

export type DetailRoute = {
  fallback: React.ReactNode;
};

export type DetailRouteProps<T, V extends OperationVariables> = {
  data: QueryResult<T, V>;
};

export type HookFunction<T, Y extends OperationVariables> = (
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

export const asDynamicQueryRoute = <
  T extends any,
  V extends OperationVariables,
>(
  hook: HookFunction<T, V>,
  Component: React.FC<{
    data: T;
    refetch: (
      variables?: Partial<V> | undefined,
    ) => Promise<ApolloQueryResult<T>>;
    subscribeToMore: <
      TSubscriptionData = T,
      TSubscriptionVariables extends OperationVariables = V,
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
    queryOptions?: QueryHookOptions<T, V>;
  } = { fallback: <></> },
) => {
  return () => {
    const { debug } = useDebug();
    const params = useParams<V>();
    if (!params) {
      if (options.fallback) {
        return options.fallback;
      } else {
        return <> This route is illconfigured</>;
      }
    }

    const { data, error, refetch, subscribeToMore } = hook({
      variables: params as V,
      ...options.queryOptions,
    });

    if (error) {
      return <ErrorPage error={error} />;
    }

    if (data) {
      if (debug) {
        return <DebugPage data={data} />;
      }

      return (
        <Component
          data={data}
          refetch={refetch}
          subscribeToMore={subscribeToMore}
        />
      );
    }

    return <> Loadding ...</>;
  };
};
