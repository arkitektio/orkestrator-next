import { useArkitekt } from "@/arkitekt/provider";
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

type MutationFuncType = typeof useApolloMutation;
type QueryFuncType = typeof useApolloQuery;
type LazyQueryFuncType = typeof useApolloLazyQuery;
type SubscriptionFuncType = typeof useApolloSubscription;

export type {
  LazyQueryHookOptions,
  MutationHookOptions,
  QueryHookOptions,
  SubscriptionHookOptions,
};

export const useMutation: MutationFuncType = (doc, options) => {
  const { clients } = useArkitekt();

  if (!clients["fluss"]) {
    throw new Error("Lok client not available");
  }

  return useApolloMutation(doc, { ...options, client: clients["fluss"] });
};

export const useQuery: QueryFuncType = (doc, options) => {
  const { clients } = useArkitekt();

  if (!clients["fluss"]) {
    throw new Error("Lok client not available");
  }

  return useApolloQuery(doc, { ...options, client: clients["fluss"] });
};

export const useSubscription: SubscriptionFuncType = (doc, options) => {
  const { clients } = useArkitekt();

  if (!clients["fluss"]) {
    throw new Error("Lok client not available");
  }

  return useApolloSubscription(doc, { ...options, client: clients["fluss"] });
};

export const useLazyQuery: LazyQueryFuncType = (doc, options) => {
  const { clients } = useArkitekt();

  if (!clients["fluss"]) {
    throw new Error("Lok client not available");
  }

  return useApolloLazyQuery(doc, { ...options, client: clients["fluss"] });
};
