import { buildDeleteAction } from "@/lib/localactions/builders/deleteAction";
import type { Arkitekt } from "@/app/Arkitekt";
import {
  CreateSceneFromCoordinateSystemDocument,
  CreateSceneFromCoordinateSystemMutation,
  CreateSceneFromCoordinateSystemMutationVariables,
  CreateSceneFromDatasetDocument,
  CreateSceneFromDatasetMutation,
  CreateSceneFromDatasetMutationVariables,
  DeleteDatasetDocument,
  DeleteFileDocument,
  DeleteImageDocument,
  DeleteRoiDocument,
  DeleteSceneDocument,
  GetCoordinateSystemDocument,
  GetDatasetDocument,
  GetScenesDocument,
  GetDatasetQuery,
  GetDatasetQueryVariables,
  PutDatasetsInDatasetDocument,
  PutDatasetsInDatasetMutation,
  PutDatasetsInDatasetMutationVariables,
  PutFilesInDatasetMutation,
  PutFilesInDatasetMutationVariables,
  PutImagesInDatasetDocument,
  PutFilesInDatasetDocument,
  PutImagesInDatasetMutation,
  PutImagesInDatasetMutationVariables,
} from "@/mikro-next/api/graphql";
import { linkBuilder } from "@/providers/smart/builder";
import {
  Clapperboard,
  File,
  FolderInput,
  Images,
  Layers,
  Pencil,
  Ruler,
  Waypoints,
} from "lucide-react";
import { Action } from "../localactions/LocalActionProvider";
import { getRefetchableQueriesForEntities } from "../localactions/helpers/refetch";

type MikroAction = Action<typeof Arkitekt>;

export const MIKRO_ACTIONS: Record<string, MikroAction> = {
  'create-scene-from-adataset': {
    title: 'Create Scene',
    description:
      'Bootstrap a renderable scene for this array dataset: a world mirroring its calibration, a full lens, and a default image layer',
    icon: Clapperboard,
    pinned: true,
    conditions: [
      { type: 'identifier', identifier: '@mikro/adataset' },
      { type: 'nopartner' },
    ],
    collections: ['adataset'],
    execute: async ({ state, services, navigate }) => {
      const selected = state.left.find(
        (item) => item.identifier === '@mikro/adataset',
      );

      if (!selected?.object?.id) {
        throw new Error('No array dataset selected for Create Scene action');
      }

      const mikro = services.mikro;
      if (!mikro) {
        throw new Error('Mikro service is not available');
      }

      const { data } = await mikro.client.mutate<
        CreateSceneFromDatasetMutation,
        CreateSceneFromDatasetMutationVariables
      >({
        mutation: CreateSceneFromDatasetDocument,
        // `kind` is deliberately unset: the server infers the layer recipe from
        // the dataset's axes. Only LABEL would need an explicit override.
        variables: { dataset: selected.object.id },
        refetchQueries: [GetScenesDocument],
      });

      const scene = data?.createSceneFromDataset;
      if (!scene) {
        throw new Error('Scene creation returned no scene');
      }

      navigate(linkBuilder('mikro/scenes')(scene.id));
    },
  },
  'create-scene-from-coordinatesystem': {
    title: 'Create Scene',
    description:
      'Mirror this coordinate system into a new scene, materializing the sources registered into it as layers',
    icon: Clapperboard,
    pinned: true,
    conditions: [
      { type: 'identifier', identifier: '@mikro/coordinatesystem' },
      { type: 'nopartner' },
    ],
    collections: ['coordinatesystem'],
    execute: async ({ state, services, navigate }) => {
      const selected = state.left.find(
        (item) => item.identifier === '@mikro/coordinatesystem',
      );

      if (!selected?.object?.id) {
        throw new Error('No coordinate system selected for Create Scene action');
      }

      const mikro = services.mikro;
      if (!mikro) {
        throw new Error('Mikro service is not available');
      }

      const { data } = await mikro.client.mutate<
        CreateSceneFromCoordinateSystemMutation,
        CreateSceneFromCoordinateSystemMutationVariables
      >({
        mutation: CreateSceneFromCoordinateSystemDocument,
        // `policy` is left to the server default (nchildren cap, meshes on,
        // tables untransformed).
        variables: { input: { coordinateSystem: selected.object.id } },
        // Refresh the global scene list and the source system's page, whose
        // Scenes section lists exactly this inverse relation.
        refetchQueries: [GetScenesDocument, GetCoordinateSystemDocument],
      });

      const scene = data?.createSceneFromCoordinateSystem;
      if (!scene) {
        throw new Error('Scene creation returned no scene');
      }

      navigate(linkBuilder('mikro/scenes')(scene.id));
    },
  },
  // The three registration entry points. All open the same dialog; they differ
  // only in which of its two slots the entry point can already fill.
  //
  // A partner action's `state.left` is the drop target and `state.right` the
  // dragged payload, so these three read: "drop a dataset ON a system",
  // "register FROM a system's page", "register a dataset INTO something".
  'register-into-coordinatesystem': {
    title: 'Register…',
    description:
      'Author an edge placing a dataset, table or another space into this coordinate system',
    icon: Waypoints,
    pinned: true,
    conditions: [
      { type: 'identifier', identifier: '@mikro/coordinatesystem' },
      { type: 'nopartner' },
    ],
    collections: ['coordinatesystem'],
    execute: async ({ state, dialog }) => {
      const selected = state.left.find(
        (item) => item.identifier === '@mikro/coordinatesystem',
      );
      if (!selected?.object?.id) {
        throw new Error('No coordinate system selected for Register action');
      }
      dialog.openDialog(
        'register',
        { target: selected.object.id },
        // The axis-mapping table needs the width addlayer already claims.
        { className: 'max-w-3xl' },
      );
    },
  },
  'register-adataset-into-coordinatesystem': {
    title: 'Register Dataset Here',
    description: 'Place this dataset into the coordinate system it was dropped on',
    icon: Waypoints,
    conditions: [
      { type: 'identifier', identifier: '@mikro/coordinatesystem' },
      { type: 'partner', partner: '@mikro/adataset' },
    ],
    collections: ['coordinatesystem'],
    execute: async ({ state, dialog }) => {
      const target = state.left.find(
        (item) => item.identifier === '@mikro/coordinatesystem',
      );
      const dataset = state.right?.find(
        (item) => item.identifier === '@mikro/adataset',
      );
      if (!target?.object?.id || !dataset?.object?.id) {
        throw new Error('Register needs both a coordinate system and a dataset');
      }
      dialog.openDialog(
        'register',
        {
          target: target.object.id,
          source: { kind: 'adataset', id: dataset.object.id },
        },
        { className: 'max-w-3xl' },
      );
    },
  },
  'register-tabledataset-into-coordinatesystem': {
    title: 'Register Table Here',
    description: 'Place this table into the coordinate system it was dropped on',
    icon: Waypoints,
    conditions: [
      { type: 'identifier', identifier: '@mikro/coordinatesystem' },
      { type: 'partner', partner: '@mikro/tabledataset' },
    ],
    collections: ['coordinatesystem'],
    execute: async ({ state, dialog }) => {
      const target = state.left.find(
        (item) => item.identifier === '@mikro/coordinatesystem',
      );
      const table = state.right?.find(
        (item) => item.identifier === '@mikro/tabledataset',
      );
      if (!target?.object?.id || !table?.object?.id) {
        throw new Error('Register needs both a coordinate system and a table');
      }
      dialog.openDialog(
        'register',
        {
          target: target.object.id,
          source: { kind: 'tabledataset', id: table.object.id },
        },
        { className: 'max-w-3xl' },
      );
    },
  },
  'calibrate-adataset': {
    title: 'Calibrate…',
    description:
      "Create a physical space for this dataset's pixels: a pixel size, a unit per axis",
    icon: Ruler,
    conditions: [
      { type: 'identifier', identifier: '@mikro/adataset' },
      { type: 'nopartner' },
    ],
    collections: ['adataset'],
    execute: async ({ state, dialog }) => {
      const selected = state.left.find(
        (item) => item.identifier === '@mikro/adataset',
      );
      if (!selected?.object?.id) {
        throw new Error('No dataset selected for Calibrate action');
      }
      dialog.openDialog(
        'calibrate',
        { dataset: selected.object.id },
        { className: 'max-w-2xl' },
      );
    },
  },
  'register-adataset-into': {
    title: 'Register Into…',
    description:
      "Place this dataset into a coordinate system: a scene's world, an atlas hub, or any other space",
    icon: Waypoints,
    conditions: [
      { type: 'identifier', identifier: '@mikro/adataset' },
      { type: 'nopartner' },
    ],
    collections: ['adataset'],
    execute: async ({ state, dialog }) => {
      const selected = state.left.find(
        (item) => item.identifier === '@mikro/adataset',
      );
      if (!selected?.object?.id) {
        throw new Error('No dataset selected for Register Into action');
      }
      dialog.openDialog(
        'register',
        { source: { kind: 'adataset', id: selected.object.id } },
        { className: 'max-w-3xl' },
      );
    },
  },
  'add-layer-to-scene': {
    title: 'Add Layer',
    description:
      'Add a dataset or table composable in this scene\'s coordinate system as a new layer',
    icon: Layers,
    conditions: [
      { type: 'identifier', identifier: '@mikro/scene' },
      { type: 'nopartner' },
    ],
    collections: ['scene'],
    execute: async ({ state, dialog }) => {
      const selected = state.left.find(
        (item) => item.identifier === '@mikro/scene',
      );

      if (!selected?.object?.id) {
        throw new Error('No scene selected for Add Layer action');
      }

      dialog.openDialog(
        'addlayer',
        { scene: selected.object.id },
        { className: 'max-w-3xl' },
      );
    },
  },
  'update-mikro-dataset': {
    title: 'Rename / Update Dataset',
    description: 'Open the update dialog for this dataset',
    icon: Pencil,
    conditions: [
      { type: 'identifier', identifier: '@mikro/dataset' },
      { type: 'nopartner' },
    ],
    collections: ['dataset'],
    execute: async ({ state, services, dialog }) => {
      const selectedDataset = state.left.find(
        (item) => item.identifier === '@mikro/dataset',
      );

      if (!selectedDataset?.object?.id) {
        throw new Error('No dataset selected for Rename / Update Dataset action');
      }

      const mikro = services.mikro;
      if (!mikro) {
        throw new Error('Mikro service is not available');
      }

      const { data } = await mikro.client.query<
        GetDatasetQuery,
        GetDatasetQueryVariables
      >({
        query: GetDatasetDocument,
        variables: {
          id: selectedDataset.object.id,
        },
        fetchPolicy: 'network-only',
      });

      if (!data?.dataset) {
        throw new Error('Unable to load dataset for update dialog');
      }

      dialog.openDialog('updatedataset', { dataset: data.dataset });
    },
  },
  'delete-mikro-image': buildDeleteAction<typeof Arkitekt>({
    title: 'Delete Image',
    identifier: '@mikro/image',
    description: 'Delete the image',
    pinned: true,
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
    icon: FolderInput,
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
          selfs: datasets.map((i) => i.object.id),
          other: inside.object.id // Assuming 'inside' is the dataset where images will be moved
        },
        refetchQueries: getRefetchableQueriesForEntities(client, datasets.map((d) => ({ typename: "Dataset", id: d.object.id })))
      })
    }
  },
  move_images_to_dataset: {
    description: 'Move images to a dataset',
    title: 'Move Images to Dataset',
    icon: Images,
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
          selfs: images.map((i) => i.object.id),
          other: inside.object.id // Assuming 'inside' is the dataset where images will be moved
        },
        refetchQueries: getRefetchableQueriesForEntities(client, images.map((f) => ({ typename: "Image", id: f.object.id })))
     })



    }
  },
  move_files_to_dataset: {
    description: 'Move files to a dataset',
    title: 'Move Files to Dataset',
    icon: File,
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
          selfs: files.map((i) => i.object.id),
          other: inside.object.id // Assuming 'inside' is the dataset where files will be moved
        },
        refetchQueries: getRefetchableQueriesForEntities(client, files.map((f) => ({ typename: "File", id: f.object.id })))
      })




    }
  },
  'delete-mikro-scene': buildDeleteAction<typeof Arkitekt>({
    title: 'Delete Scene',
    identifier: '@mikro/scene',
    description: 'Delete the scene',
    service: 'mikro',
    typename: 'Scene',
    mutation: DeleteSceneDocument
  }),
  'delete-mikro-dataset': buildDeleteAction<typeof Arkitekt>({
    title: 'Delete Dataset',
    identifier: '@mikro/dataset',
    description: 'Delete the dataset',
    service: 'mikro',
    typename: 'Dataset',
    mutation: DeleteDatasetDocument
  })
} as const
