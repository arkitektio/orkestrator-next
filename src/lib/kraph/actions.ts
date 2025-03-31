import { Action } from "@/actions/action-registry";
import { buildDeleteAction } from "@/actions/builders/deleteAction";
import { DeleteGraphDocument } from "@/kraph/api/graphql";
import { ApolloClient, NormalizedCache } from "@apollo/client";

export const KRAPH_ACTIONS: Action[] = [
  buildDeleteAction({
    title: "Delete Graph",
    identifier: "@kraph/graph",
    description: "Delete the Graph",
    service: "kraph",
    typename: "Graph",
    mutation: DeleteGraphDocument,
  }),
  {
    name: "Relate",
    title: "Relate Images",
    description: "Relate the structure",
    conditions: [
      {
        type: "haspartner",
      },
    ],
    execute: async ({ services, onProgress, abortSignal, state }) => {
      let service = services["kraph"].client as ApolloClient<NormalizedCache>;
      console.log("Deleting file");
      if (!service) {
        throw new Error("Service not found");
      }

      for (let i in state.left) {
        for (let j in state.right) {
          console.log("Relating", state.left[i].object, state.right[j].object);
        }
      }

      onProgress(100);
      return {
        left: [],
        isCommand: false,
      };
    },
    collections: ["io"],
  },
];
