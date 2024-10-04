import { useRekuest } from "@/arkitekt/Arkitekt";
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
  const rekuest = useRekuest();

  return useApolloMutation(doc, {
    ...options,
    client: rekuest,
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });
};

export const useQuery: QueryFuncType = (doc, options) => {
  const rekuest = useRekuest();

  return useApolloQuery(doc, { ...options, client: rekuest });
};

export const useSubscription: SubscriptionFuncType = (doc, options) => {
  const rekuest = useRekuest();

  return useApolloSubscription(doc, { ...options, client: rekuest });
};

export const useLazyQuery: LazyQueryFuncType = (doc, options) => {
  const rekuest = useRekuest();

  return useApolloLazyQuery(doc, { ...options, client: rekuest });
};
