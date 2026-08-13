import { buildDeleteAction } from "@/lib/localactions/builders/deleteAction";
import { Action } from "@/lib/localactions/LocalActionProvider";
import type { ApolloClient, NormalizedCache } from "@apollo/client";
import {
  DeleteEntityCategoryDocument,
  ArchiveEntityDocument,
  DeleteGraphDocument,
  DeleteMeasurementCategoryDocument,
  DeleteNaturalEventCategoryDocument,
  DeleteProtocolEventCategoryDocument,
  LinkStructureToEntityDocument,
} from "./api/graphql";
import { Archive, Link2, PlusCircle, Ruler, Workflow } from "lucide-react";

export const NewEntityAction: Action = {
  title: "Create New Entity",
  description: "Create a new entity in the current graph",
  icon: PlusCircle,
  conditions: [
    {
      type: "identifier",
      identifier: "@kraph/entitycategory",
    },
    {
      type: "nopartner",
    },
  ],
  execute: async ({ state, dialog }) => {
    if (!state.left || state.left.length === 0) {
      throw new Error("No graph provided for Create New Entity action");
    }
    const graph = state.left[0].object;
    if (!graph) {
      throw new Error("No graph object found for Create New Entity action");
    }

    dialog.openDialog("createentity", {
      category: graph.id,
    });
  },
};

export const LinkStructureToEntityAction: Action = {
  title: "Link Structure to Entity",
  description: "Record that this structure informs the partner entity",
  icon: Link2,
  conditions: [
    {
      type: "identifier",
      identifier: "@kraph/structure",
    },
    {
      type: "pidentifier",
      identifier: "@kraph/entity",
    },
  ],
  execute: async ({ state, services }) => {
    const entity = state.right?.[0]?.object;
    if (!entity || typeof entity.id !== "string") {
      throw new Error("No entity selected to link this structure to");
    }

    const client = (services.kraph as unknown as { client: ApolloClient<NormalizedCache> })
      .client;
    if (!client) {
      throw new Error("Kraph service is not available");
    }

    // Structures are organization-scoped, so they are addressed by their
    // foreign identifier/object pair rather than by a kraph id.
    const structures = state.left.filter(
      (structure) => structure.identifier === "@kraph/structure",
    );

    for (const structure of structures) {
      await client.mutate({
        mutation: LinkStructureToEntityDocument,
        variables: {
          input: {
            structureIdentifier: String(structure.object.identifier ?? structure.identifier),
            structureObject: String(structure.object.object ?? structure.object.id),
            entityId: entity.id,
          },
        },
      });
    }
  },
  collections: ["io"],
};

export const KRAPH_ACTIONS = {
  "create-new-entity": NewEntityAction,
  "link-structure-to-entity": LinkStructureToEntityAction,
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

  // Entities are an append-only log: `deleteEntity` no longer exists, so the
  // action archives instead. Archiving still evicts the entity from the cache
  // so it drops out of active lists.
  "archive-entity": buildDeleteAction({
    title: "Archive Entity",
    identifier: "@kraph/entity",
    description: "Archive the Entity.",
    service: "kraph",
    typename: ["Entity", "Node"],
    mutation: ArchiveEntityDocument,
    icon: Archive,
    verb: { present: "Archive", past: "Archived", reversible: true },
  }),

  // Custom Actions

  "create-protocol-event-category": {
    title: "Create Protocol Event Category",
    description: "Create a new Protocol Event Category",
    icon: Workflow,
    conditions: [
      {
        type: "identifier",
        identifier: "@kraph/graph",
      },
    ],
    execute: async ({ state, dialog }) => {
      dialog.openSheet(
        "createprotocoleventcategory",
        {
          graph: state.left[0].object.id,
        },
        { className: "w-[600px] max-w-none" },
      );
    },
    collections: ["io"],
  },
  "create-new-measurment-category": {
    title: "Create New Measurement Category",
    description:
      "Create a new measurement category between structure and entity",
    icon: Ruler,
    conditions: [
      {
        type: "identifier",
        identifier: "@kraph/structurekind",
      },
      {
        type: "pidentifier",
        identifier: "@kraph/entitycategory",
      },
    ],
    execute: async ({ state, dialog }) => {
      const graphField = state.left[0]?.object?.graph;
      const graph =
        graphField &&
        typeof graphField === "object" &&
        !Array.isArray(graphField) &&
        "id" in graphField &&
        typeof graphField.id === "string"
          ? graphField.id
          : undefined;
      if (!graph) {
        throw new Error("Structure category does not have a graph. Use the context menu to select a graph.");
      }
      dialog.openDialog("createnewmeasurement", {
        left: state.left,
        right: state.right || [],
        graph,
      });
    },
    collections: ["io"],
  },
} as const satisfies Record<string, Action>;
