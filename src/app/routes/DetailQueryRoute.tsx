import { useDebug } from "@/providers/debug/DebugContext";
import {
  ApolloQueryResult,
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  useQuery,
} from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { DebugPage } from "../components/fallbacks/DebugPage";
import { ErrorPage } from "../components/fallbacks/ErrorPage";

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

export const asDetailQueryRoute = <T extends any, Y extends DetailVariables>(
  hook: HookFunction<T, Y>,
  Component: React.FC<{
    data: T;
    refetch: (
      variables?: Partial<Y> | undefined,
    ) => Promise<ApolloQueryResult<T>>;
  }>,
  fallback?: React.ReactNode | undefined,
) => {
  return () => {
    const { debug } = useDebug();
    const { id } = useParams<{ id: string }>();
    if (!id) {
      if (fallback) {
        return fallback;
      } else {
        return <> This route is illconfigured</>;
      }
    }

    const { data, error, refetch } = hook({ variables: { id: id } });

    if (error) {
      return <ErrorPage error={error} />;
    }

    if (data) {
      if (debug) {
        return <DebugPage data={data} />;
      }

      return <Component data={data} refetch={refetch} />;
    }

    return <> Loadding ...</>;
  };
};
