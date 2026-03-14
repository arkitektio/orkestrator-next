import { buildDeleteAction } from "@/lib/localactions/builders/deleteAction";
import type { Arkitekt } from "@/app/Arkitekt";
import {
  DeleteDatasetDocument,
  DeleteFileDocument,
  DeleteImageDocument,
  DeleteRoiDocument,
  PutDatasetsInDatasetDocument,
  PutDatasetsInDatasetMutation,
  PutDatasetsInDatasetMutationVariables,
  PutFilesInDatasetMutation,
  PutFilesInDatasetMutationVariables,
  PutImagesInDatasetDocument,
  PutFilesInDatasetDocument,
  GetDatasetsDocument,
  PutImagesInDatasetMutation,
  PutImagesInDatasetMutationVariables,
} from "@/mikro-next/api/graphql";
import { Action } from "../localactions/LocalActionProvider";
import { getRefetchableQueriesForEntities } from "../localactions/helpers/refetch";

type MikroAction = Action<typeof Arkitekt>;

export const MIKRO_ACTIONS: Record<string, MikroAction> = {
  'delete-mikro-image': buildDeleteAction<typeof Arkitekt>({
    title: 'Delete Image',
    identifier: '@mikro/image',
    description: 'Delete the image',
    service: 'mikro',
    typename: 'Image',
    mutation: DeleteImageDocument
  }),
  'delete-mikro-file': buildDeleteAction<typeof Arkitekt>({
    title: 'Delete File',
    identifier: '@mikro/file',
    description: 'Delete the file',
    service: 'mikro',
    typename: 'File',
    mutation: DeleteFileDocument
  }),
  'delete-mikro-roi': buildDeleteAction<typeof Arkitekt>({
    title: 'Delete Roi',
    identifier: '@mikro/roi',
    description: 'Delete the roi',
    service: 'mikro',
    typename: 'ROI',
    mutation: DeleteRoiDocument
  }),
  move_to_dataset: {
    description: 'Move dataset to a dataset',
    title: 'Move to Dataset',
    conditions: [
      { type: 'identifier', identifier: '@mikro/dataset' },
      { type: 'partner', partner: '@mikro/dataset' }
    ],
    collections: ['dataet'],
    execute: async ({ state, services }) => {
      if (!state.right || state.right.length === 0) {
        throw new Error('No partner provided for Move to Dataset action')
      }
      const datasets = state.left.filter((item) => item.identifier === '@mikro/dataset')
      if (datasets.length === 0) {
        throw new Error('No datasets selected for Move to Dataset action')
      }

      const mikro = services.mikro
      if (!mikro) {
        throw new Error('Mikro service is not available')
      }

      const client = mikro.client

      const inside = state.left.at(0)
      if (!inside) {
        throw new Error('No inside item found for Move to Dataset action')
      }
      if (inside.identifier !== '@mikro/dataset') {
        throw new Error('Inside item must be a dataset for Move to Dataset action')
      }


      await client.mutate<PutDatasetsInDatasetMutation, PutDatasetsInDatasetMutationVariables>({
        mutation: PutDatasetsInDatasetDocument,
        variables: {
          selfs: datasets.map((i) => i.object),
          other: inside.object // Assuming 'inside' is the dataset where images will be moved
        },
        refetchQueries: [GetDatasetsDocument]
      })
    }
  },
  move_images_to_dataset: {
    description: 'Move images to a dataset',
    title: 'Move Images to Dataset',
    conditions: [
      { type: 'identifier', identifier: '@mikro/dataset' },
      { type: 'partner', partner: '@mikro/image' }
    ],
    collections: ['dataset'],
    execute: async ({ state, services }) => {
      if (!state.right || state.right.length === 0) {
        throw new Error('No partner provided for Move to Dataset action')
      }
      const images = state.right.filter((item) => item.identifier === '@mikro/image')
      if (images.length === 0) {
        throw new Error('No images selected for Move to Dataset action')
      }

      const mikro = services.mikro
      if (!mikro) {
        throw new Error('Mikro service is not available')
      }

      const client = mikro.client

      const inside = state.left.at(0)
      if (!inside) {
        throw new Error('No inside item found for Move to Dataset action')
      }
      if (inside.identifier !== '@mikro/dataset') {
        throw new Error('Inside item must be a dataset for Move to Dataset action')
      }

      await client.mutate<PutImagesInDatasetMutation, PutImagesInDatasetMutationVariables>({
        mutation: PutImagesInDatasetDocument,
        variables: {
          selfs: images.map((i) => i.object),
          other: inside.object // Assuming 'inside' is the dataset where images will be moved
        },
        refetchQueries: [GetDatasetsDocument]
      })



    }
  },
  move_files_to_dataset: {
    description: 'Move files to a dataset',
    title: 'Move Files to Dataset',
    conditions: [
      { type: 'identifier', identifier: '@mikro/dataset' },
      { type: 'partner', partner: '@mikro/file' }
    ],
    collections: ['dataset'],
    execute: async ({ state, services,  }) => {
      if (!state.right || state.right.length === 0) {
        throw new Error('No partner provided for Move to Dataset action')
      }
      const files = state.right.filter((item) => item.identifier === '@mikro/file')
      if (files.length === 0) {
        throw new Error('No files selected for Move to Dataset action')
      }

      const mikro = services.mikro
      if (!mikro) {
        throw new Error('Mikro service is not available')
      }

      const client = mikro.client

      const inside = state.left.at(0)
      if (!inside) {
        throw new Error('No inside item found for Move to Dataset action')
      }
      if (inside.identifier !== '@mikro/dataset') {
        throw new Error('Inside item must be a dataset for Move to Dataset action')
      }





      await client.mutate<PutFilesInDatasetMutation, PutFilesInDatasetMutationVariables>({
        mutation:   PutFilesInDatasetDocument,
        variables: {
          selfs: files.map((i) => i.object),
          other: inside.object // Assuming 'inside' is the dataset where files will be moved
        },
        refetchQueries: getRefetchableQueriesForEntities(client, files.map((f) => ({ typename: "File", id: f.object })))
      })




    }
  },
  'delete-mikro-dataset': buildDeleteAction<typeof Arkitekt>({
    title: 'Delete Dataset',
    identifier: '@mikro/dataset',
    description: 'Delete the dataset',
    service: 'mikro',
    typename: 'Dataset',
    mutation: DeleteDatasetDocument
  })
} as const
