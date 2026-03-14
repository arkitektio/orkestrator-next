import { Smart } from "@/providers/smart/builder";
import {
  ApolloClient,
  NormalizedCache,
  TypedDocumentNode,
} from "@apollo/client";
import { Action, ResolveActionServices } from "../LocalActionProvider";

export const identifierFromSmartOrString = (identifier: Smart | string) => {
  if (typeof identifier === "string") {
    return identifier;
  }
  return identifier.identifier;
};

type DeleteActionServiceKey<TAppOrServices> = Extract<
  keyof ResolveActionServices<TAppOrServices>,
  string
>;

export type DeleteActionParams<
  TAppOrServices = never,
  TServiceKey extends DeleteActionServiceKey<TAppOrServices> = DeleteActionServiceKey<TAppOrServices>,
> = {
  identifier: Smart | string;
  title: string;
  mutation: TypedDocumentNode<any, { id: string }>;
  typename: string | string[];
  service: TServiceKey;
  description?: string;
};

export const buildDeleteAction = <
  TAppOrServices = never,
  TServiceKey extends DeleteActionServiceKey<TAppOrServices> = DeleteActionServiceKey<TAppOrServices>,
>(
  params: DeleteActionParams<TAppOrServices, TServiceKey>,
): Action<TAppOrServices> => ({
  title: params.title,
  description: params.description || "Delete the structure",
  conditions: [
    {
      type: "identifier",
      identifier: identifierFromSmartOrString(params.identifier),
    },
    {
      type: "nopartner",
    },
  ],
  execute: async ({ services, onProgress, abortSignal, state }) => {
    const service = services[params.service]
      .client as ApolloClient<NormalizedCache>;
    if (!service) {
      throw new Error("Service not found");
    }

    for (const i in state.left) {
      await service.mutate({
        mutation: params.mutation,
        variables: {
          id: state.left[i].object,
        },
      });

      // Evict the item from the cache
      if (Array.isArray(params.typename)) {
        for (const typename of params.typename) {
          service.cache.evict({
            id: service.cache.identify({
              __typename: typename,
              id: state.left[i].object,
            }),
          });
        }
      } else {


        service.cache.evict({
          id: service.cache.identify({
            __typename: params.typename,
            id: state.left[i].object,
          }),
        });
      }
    }

    service.cache.gc();
    onProgress(100);
    return {
      left: [],
      isCommand: false,
    };
  },
  collections: ["io"],
});
