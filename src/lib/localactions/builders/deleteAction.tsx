import { Smart } from "@/providers/smart/builder";
import {
  ApolloClient,
  NormalizedCache,
  TypedDocumentNode,
} from "@apollo/client";
import { Action } from "../LocalActionProvider";

export const identifierFromSmartOrString = (identifier: Smart | string) => {
  if (typeof identifier === "string") {
    return identifier;
  }
  return identifier.identifier;
};

export type DeleteActionParams = {
  identifier: Smart | string;
  title: string;
  mutation: TypedDocumentNode<any, { id: string }>;
  typename: string;
  service: string;
  description?: string;
};

export const buildDeleteAction = (params: DeleteActionParams): Action => ({
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
      service.cache.evict({
        id: service.cache.identify({
          __typename: params.typename,
          id: state.left[i].object,
        }),
      });
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
