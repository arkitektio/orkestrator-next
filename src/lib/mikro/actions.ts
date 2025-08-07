import { Action } from "@/actions/action-registry";
import { buildDeleteAction } from "@/actions/builders/deleteAction";
import {
  DeleteFileDocument,
  DeleteImageDocument,
  PutDatasetsInDatasetDocument,
  PutDatasetsInDatasetMutation,
  PutDatasetsInDatasetMutationVariables,
  DeleteDatasetDocument,
  DeleteRoiDocument,
} from "@/mikro-next/api/graphql";

export const MIKRO_ACTIONS: Action[] = [
  buildDeleteAction({
    title: "Delete Image",
    identifier: "@mikro/image",
    description: "Delete the image",
    service: "mikro",
    typename: "Image",
    mutation: DeleteImageDocument,
  }),
  buildDeleteAction({
    title: "Delete File",
    identifier: "@mikro/file",
    description: "Delete the file",
    service: "mikro",
    typename: "File",
    mutation: DeleteFileDocument,
  }),
  buildDeleteAction({
    title: "Delete Roi",
    identifier: "@mikro/roi",
    description: "Delete the roi",
    service: "mikro",
    typename: "ROI",
    mutation: DeleteRoiDocument,
  }),
  {
    name: "move_to_dataset",
    description: "Move images to a dataset",
    title: "Move to Dataset",
    conditions: [
      { type: "identifier", identifier: "@mikro/dataset" },
      { type: "partner", partner: "@mikro/dataset" },
    ],
    collections: ["dataet"],
    execute: async ({ state, services }) => {
      if (!state.right || state.right.length === 0) {
        throw new Error("No partner provided for Move to Dataset action");
      }
      const datasets = state.left.filter(
        (item) => item.identifier === "@mikro/dataset",
      );
      if (datasets.length === 0) {
        throw new Error("No datasets selected for Move to Dataset action");
      }

      const client = services.mikro.client;

      const inside = state.left.at(0);
      if (!inside) {
        throw new Error("No inside item found for Move to Dataset action");
      }
      if (inside.identifier !== "@mikro/dataset") {
        throw new Error(
          "Inside item must be a dataset for Move to Dataset action",
        );
      }

      await client.mutate<
        PutDatasetsInDatasetMutation,
        PutDatasetsInDatasetMutationVariables
      >({
        mutation: PutDatasetsInDatasetDocument,
        variables: {
          selfs: datasets.map((i) => i.object),
          other: inside.object, // Assuming 'inside' is the dataset where images will be moved
        },
      });
    },
  },
  buildDeleteAction({
    title: "Delete Dataset",
    identifier: "@mikro/dataset",
    description: "Delete the dataset",
    service: "mikro",
    typename: "Dataset",
    mutation: DeleteDatasetDocument,
  }),
];
