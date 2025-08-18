import { useMikro } from "@/lib/arkitekt/Arkitekt";
import {
  LazyQueryHookOptions,
  MutationHookOptions,
  QueryHookOptions,
  SubscriptionHookOptions,
  useLazyQuery as useApolloLazyQuery,
  useMutation as useApolloMutation,
  useQuery as useApolloQuery,
  useSubscription as useApolloSubscription,
} from "@apollo/client";
import { onApolloError } from "../errorHandler";

type MutationFuncType = typeof useApolloMutation;
type QueryFuncType = typeof useApolloQuery;
type LazyQueryFuncType = typeof useApolloLazyQuery;
type SubscriptionFuncType = typeof useApolloSubscription;

export type {
  LazyQueryHookOptions,
  MutationHookOptions,
  QueryHookOptions,
  SubscriptionHookOptions
};

export const useMutation: MutationFuncType = (doc, options) => {
  const mikro = useMikro();

  return useApolloMutation(doc, {
    ...options,
    client: mikro,
    onError: onApolloError("mikro"),
  });
};

export const useQuery: QueryFuncType = (doc, options) => {
  const mikro = useMikro();

  return useApolloQuery(doc, { ...options, client: mikro });
};

export const useSubscription: SubscriptionFuncType = (doc, options) => {
  const mikro = useMikro();

  return useApolloSubscription(doc, { ...options, client: mikro });
};

export const useLazyQuery: LazyQueryFuncType = (doc, options) => {
  const mikro = useMikro();

  return useApolloLazyQuery(doc, { ...options, client: mikro });
};
