import { Action } from "@/actions/action-registry";
import { buildDeleteAction } from "@/actions/builders/deleteAction";
import {
  DeleteEntityCategoryDocument,
  DeleteGraphDocument,
  DeleteNaturalEventCategoryDocument,
  DeleteProtocolEventCategoryDocument,
} from "@/kraph/api/graphql";

export const KRAPH_ACTIONS: Action[] = [
  buildDeleteAction({
    title: "Delete Graph",
    identifier: "@kraph/graph",
    description: "Delete the Graph",
    service: "kraph",
    typename: "Graph",
    mutation: DeleteGraphDocument,
  }),
  buildDeleteAction({
    title: "Delete Protocol Event Category",
    identifier: "@kraph/protocoleventcategory",
    description: "Delete the Protocol Event Category",
    service: "kraph",
    typename: "ProtocolEventCategory",
    mutation: DeleteProtocolEventCategoryDocument,
  }),
  buildDeleteAction({
    title: "Delete Naturl Event Category",
    identifier: "@kraph/naturaleventcategory",
    description: "Delete the Protocol Event",
    service: "kraph",
    typename: "NaturalEventCategory",
    mutation: DeleteNaturalEventCategoryDocument,
  }),
  buildDeleteAction({
    title: "Delete Entity Category",
    identifier: "@kraph/entitycategory",
    description: "Delete the Entity Category",
    service: "kraph",
    typename: "EntityCategory",
    mutation: DeleteEntityCategoryDocument,
  }),
  {
    name: "CreateProtocolEventCategory",
    title: "Create Protocol Event Category",
    description: "Create a new Protocol Event Category",
    conditions: [
      {
        type: "identifier", identifier: "@kraph/graph"
      },
    ],
    execute: async ({ services, onProgress, abortSignal, state, dialog }) => {
      dialog.openSheet("createprotocoleventcategory", {
        graph: state.left[0].object,
      }, { className: "w-[600px] max-w-none" });
    },
    collections: ["io"],
  }
];

export const relateAction = {
  name: "Relate",
  title: "relate things",
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
};
