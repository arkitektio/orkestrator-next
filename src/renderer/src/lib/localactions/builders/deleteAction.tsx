import { Smart } from "@/providers/smart/builder";
import {
  ApolloClient,
  NormalizedCache,
  TypedDocumentNode,
} from "@apollo/client";
import { Trash2 } from "lucide-react";
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
  mutation: TypedDocumentNode<unknown, { id: string }>;
  typename: string | string[];
  service: TServiceKey;
  description?: string;
  icon?: Action<TAppOrServices>["icon"];
  pinned?: Action<TAppOrServices>["pinned"];
};

export const buildDeleteAction = <
  TAppOrServices = never,
  TServiceKey extends DeleteActionServiceKey<TAppOrServices> = DeleteActionServiceKey<TAppOrServices>,
>(
  params: DeleteActionParams<TAppOrServices, TServiceKey>,
): Action<TAppOrServices> => ({
  title: params.title,
  description: params.description || "Delete the structure",
  icon: params.icon ?? Trash2,
  pinned: params.pinned,
  conditions: [
    {
      type: "identifier",
      identifier: identifierFromSmartOrString(params.identifier),
    },
    {
      type: "nopartner",
    },
  ],
  execute: async ({ services, onProgress, abortSignal: _abortSignal, state, modifiers, confirm }) => {
    const service = services[params.service]
      .client as ApolloClient<NormalizedCache>;
    if (!service) {
      throw new Error("Service not found");
    }

    if (!modifiers.ctrlKey) {
      const itemCount = state.left.length;
      const confirmed = await confirm({
        title:
          itemCount > 1
            ? `Delete ${itemCount} items?`
            : params.title,
        description:
          itemCount > 1
            ? `You are about to delete ${itemCount} selected items. This action cannot be undone. To skip this dialog, hold Ctrl when doing it.`
            : `${params.description || "Delete the selected item"} This action cannot be undone. To skip this dialog, hold Ctrl when doing it.`,
        confirmLabel: "Delete",
        cancelLabel: "Keep",
        destructive: true,
      });

      if (!confirmed) {
        return;
      }
    }

    for (const i in state.left) {
      await service.mutate({
        mutation: params.mutation,
        variables: {
          id: state.left[i].object.id,
        },
      });

      // Evict the item from the cache
      if (Array.isArray(params.typename)) {
        for (const typename of params.typename) {
          service.cache.evict({
            id: service.cache.identify({
              __typename: typename,
              id: state.left[i].object.id,
            }),
          });
        }
      } else {


        service.cache.evict({
          id: service.cache.identify({
            __typename: params.typename,
            id: state.left[i].object.id,
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
