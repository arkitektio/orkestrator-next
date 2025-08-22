import { buildDeleteAction } from "@/lib/localactions/builders/deleteAction";
import { Action } from "@/lib/localactions/LocalActionProvider";
import {
  DeleteEntityCategoryDocument,
  DeleteGraphDocument,
  DeleteNaturalEventCategoryDocument,
  DeleteProtocolEventCategoryDocument,
} from "./api/graphql";

export const NewEntityAction: Action = {
  title: "Create New Entity",
  description: "Create a new entity in the current graph",
  conditions: [
    {
      type: "identifier",
      identifier: "@kraph/entitycategory",
    },
    {
      type: "nopartner",
    },
  ],
  execute: async ({ state, navigate, dialog }) => {
    if (!state.left || state.left.length === 0) {
      throw new Error("No graph provided for Create New Entity action");
    }
    const graph = state.left[0].object;
    if (!graph) {
      throw new Error("No graph object found for Create New Entity action");
    }

    dialog.openDialog("createentity", {
      category: graph,
    });
  },
};

export const KRAPH_ACTIONS = {
  "create-new-entity": NewEntityAction,
  "delete-kraph-graph": buildDeleteAction({
    title: "Delete Graph",
    identifier: "@kraph/graph",
    description: "Delete the Graph",
    service: "kraph",
    typename: "Graph",
    mutation: DeleteGraphDocument,
  }),
  "delete-kraph-protocoleventcategory": buildDeleteAction({
    title: "Delete Protocol Event Category",
    identifier: "@kraph/protocoleventcategory",
    description: "Delete the Protocol Event Category",
    service: "kraph",
    typename: "ProtocolEventCategory",
    mutation: DeleteProtocolEventCategoryDocument,
  }),
  "delete-kraph-naturaleventcategory": buildDeleteAction({
    title: "Delete Naturl Event Category",
    identifier: "@kraph/naturaleventcategory",
    description: "Delete the Protocol Event",
    service: "kraph",
    typename: "NaturalEventCategory",
    mutation: DeleteNaturalEventCategoryDocument,
  }),
  "delete-kraph-entitycategory": buildDeleteAction({
    title: "Delete Entity Category",
    identifier: "@kraph/entitycategory",
    description: "Delete the Entity Category",
    service: "kraph",
    typename: "EntityCategory",
    mutation: DeleteEntityCategoryDocument,
  }),
  "create-protocol-event-category": {
    title: "Create Protocol Event Category",
    description: "Create a new Protocol Event Category",
    conditions: [
      {
        type: "identifier",
        identifier: "@kraph/graph",
      },
    ],
    execute: async ({ services, onProgress, abortSignal, state, dialog }) => {
      dialog.openSheet(
        "createprotocoleventcategory",
        {
          graph: state.left[0].object,
        },
        { className: "w-[600px] max-w-none" },
      );
    },
    collections: ["io"],
  },
  "relate-structures": {
    title: "Relate Structures",
    description: "Delete the structure",
    conditions: [
      {
        type: "haspartner",
      },
    ],
    execute: async ({ services, onProgress, abortSignal, state, dialog }) => {
      dialog.openDialog("relatestructure", {
        left: state.left,
        right: state.right,
      });
    },
    collections: ["io"],
  },
} as const satisfies Record<string, Action>;
