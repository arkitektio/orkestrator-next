import { useLok } from "@/arkitekt/Arkitekt";
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
import { toast } from "sonner";

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
  const lok = useLok();

  return useApolloMutation(doc, {
    ...options,
    client: lok,
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });
};

export const useQuery: QueryFuncType = (doc, options) => {
  const lok = useLok();

  console.log("lok", lok);

  return useApolloQuery(doc, { ...options, client: lok });
};

export const useSubscription: SubscriptionFuncType = (doc, options) => {
  const lok = useLok();

  return useApolloSubscription(doc, { ...options, client: lok });
};

export const useLazyQuery: LazyQueryFuncType = (doc, options) => {
  const lok = useLok();

  return useApolloLazyQuery(doc, { ...options, client: lok });
};
