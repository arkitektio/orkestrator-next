import { Smart } from "@/providers/smart/builder";
import {
  ApolloClient,
  NormalizedCache,
  TypedDocumentNode,
} from "@apollo/client";
import { Action } from "../action-registry";

export const identifierFromSmartOrString = (identifier: Smart | string) => {
  if (typeof identifier === "string") {
    return identifier;
  }
  return identifier.identifier;
};

export type DeleteActionParams = {
  identifier: Smart | string;
  title: string;
  mutation: TypedDocumentNode<any, { input: {id: string, pin?: boolean | undefined} }>;
  service: string;
  description?: string;
};

export const buildDeleteAction = (params: DeleteActionParams): Action => ({
  name: params.title,
  title: params.title,
  description: params.description || "Delete the structure",
  conditions: [
    {
      type: "identifier",
      identifier: identifierFromSmartOrString(params.identifier),
    },
  ],
  execute: async ({ services, onProgress, abortSignal, state }) => {
    let service = services[params.service]
      .client as ApolloClient<NormalizedCache>;
    console.log("Deleting file");
    if (!service) {
      throw new Error("Service not found");
    }

    for (let i in state.left) {
      await service.mutate({
        mutation: params.mutation,
        variables: {
          input: {
            state.left[i].object,
            pin: false,
          },
        },
      });
    }

    onProgress(100);
    console.log("File deleted");
    return {
      left: [],
      isCommand: false,
    };
  },
  collections: ["io"],
});
