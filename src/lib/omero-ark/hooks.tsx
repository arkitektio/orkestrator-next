import { useOmeroArk } from "@/lib/arkitekt/Arkitekt";
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
  const fluss = useOmeroArk();

  return useApolloMutation(doc, {
    ...options,
    client: fluss,
    onError: onApolloError("fluss"),
  });
};

export const useQuery: QueryFuncType = (doc, options) => {
  const fluss = useOmeroArk();

  return useApolloQuery(doc, { ...options, client: fluss });
};

export const useSubscription: SubscriptionFuncType = (doc, options) => {
  const fluss = useOmeroArk();

  return useApolloSubscription(doc, { ...options, client: fluss });
};

export const useLazyQuery: LazyQueryFuncType = (doc, options) => {
  const fluss = useOmeroArk();

  return useApolloLazyQuery(doc, { ...options, client: fluss });
};
