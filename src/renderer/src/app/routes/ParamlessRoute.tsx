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
import { LoadingPage } from "../components/fallbacks/LoadingPage";

export type ParamlessVariables = OperationVariables;

export type ParamlessRoute = {
  fallback: React.ReactNode;
};

export type DetailRouteProps<T> = {
  data: QueryResult<T, ParamlessVariables>;
};

export type HookFunction<T, Y extends ParamlessVariables> = (
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

export const asParamlessRoute = <T extends unknown>(
  hook: HookFunction<T, ParamlessVariables>,
  Component: React.FC<{
    data: T;
    refetch: (
      variables?: Partial<ParamlessVariables> | undefined,
    ) => Promise<ApolloQueryResult<T>>;
    subscribeToMore: <
      TSubscriptionData = T,
      TSubscriptionVariables extends OperationVariables = ParamlessVariables,
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
    queryOptions?: QueryHookOptions<T, ParamlessVariables>;
  } = { fallback: <></> },
) => {
  return ({ direct }: { direct?: any | undefined }) => {
    const { debug } = useDebug();

    const passyProps =
      direct ||
      hook({
        ...options.queryOptions,
      });

    if (passyProps.error) {
      if (debug) {
        return <DebugPage data={passyProps.error} />;
      }

      return <ErrorPage error={passyProps.error} />;
    }

    if (passyProps.loading) return <LoadingPage />;

    if (passyProps && passyProps.data) {
      if (debug) {
        return <DebugPage data={passyProps.data} />;
      }

      return <Component {...passyProps} />;
    }
  };
};
