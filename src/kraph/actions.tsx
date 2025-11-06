import { buildDeleteAction } from "@/lib/localactions/builders/deleteAction";
import { Action } from "@/lib/localactions/LocalActionProvider";
import {
  DeleteEdgeDocument,
  DeleteEntityCategoryDocument,
  DeleteGraphDocument,
  DeleteGraphQueryDocument,
  DeleteMeasurementCategoryDocument,
  DeleteNaturalEventCategoryDocument,
  DeleteNodeDocument,
  DeleteProtocolEventCategoryDocument,
  DetachDeleteNodeDocument,
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
  "delete-kraph-measurementcategory": buildDeleteAction({
    title: "Delete Measurement Category",
    identifier: "@kraph/measurementcategory",
    description: "Delete the Measurment Category",
    service: "kraph",
    typename: "MeasurementCategory",
    mutation: DeleteMeasurementCategoryDocument,
  }),
  "delete-edge": buildDeleteAction({
    title: "Delete Edge",
    identifier: "@kraph/edge",
    description: "Delete the Edge",
    service: "kraph",
    typename: "Edge",
    mutation: DeleteEdgeDocument,
  }),
  "delete-entity": buildDeleteAction({
    title: "Delete Entity",
    identifier: "@kraph/entity",
    description: "Delete the Entity",
    service: "kraph",
    typename: ["Entity", "Node"],
    mutation: DeleteNodeDocument,
  }),
  "detach-delete-entity": buildDeleteAction({
    title: "Detach and Delete Entity",
    identifier: "@kraph/entity",
    description: "will also delete all connected edges",
    service: "kraph",
    typename: ["Entity", "Node"],
    mutation: DetachDeleteNodeDocument,
  }),
  "delete-measurement": buildDeleteAction({
    title: "Delete Measurment",
    identifier: "@kraph/measurement",
    description: "Delete the Measurment",
    service: "kraph",
    typename: "Measurement",
    mutation: DeleteEdgeDocument,
  }),
  "delete-node": buildDeleteAction({
    title: "Delete Node",
    identifier: "@kraph/node",
    description: "Delete the Node",
    service: "kraph",
    typename: "Node",
    mutation: DeleteNodeDocument,
  }),
  "delete-graph-query": buildDeleteAction({
    title: "Delete Graph Query",
    identifier: "@kraph/graphquery",
    description: "Delete the Graph Query",
    service: "kraph",
    typename: "GraphQuery",
    mutation: DeleteGraphQueryDocument,
  }),

  // Custom Actions

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
  "create-new-measurment-category": {
    title: "Create New Measurement Category",
    description:
      "Create a new measurement category between structure and entity",
    conditions: [
      {
        type: "identifier",
        identifier: "@kraph/structurecategory",
      },
      {
        type: "pidentifier",
        identifier: "@kraph/entitycategory",
      },
    ],
    execute: async ({ services, onProgress, abortSignal, state, dialog }) => {
      dialog.openDialog("createnewmeasurement", {
        left: state.left,
        right: state.right || [],
      });
    },
    collections: ["io"],
  },
  "create-protocol-event": {
    title: "Create Protocol Event Category",
    description: "Delete the structure",
    conditions: [
      {
        type: "mixture",
        identifiers: ["@kraph/reagentcategory", "@kraph/entitycategory"],
      },
      {
        type: "pmixture",
        identifiers: ["@kraph/reagentcategory", "@kraph/entitycategory"],
      },
    ],
    execute: async ({ services, onProgress, abortSignal, state, dialog }) => {
      dialog.openSheet(
        "createpprotocoleventfrominsandouts",
        {
          ins: state.left,
          outs: state.right || [],
        },
        { className: "w-[800px] max-w-none" },
      );
    },
    collections: ["io"],
  },
} as const satisfies Record<string, Action>;
