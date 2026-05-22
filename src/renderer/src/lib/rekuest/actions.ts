import {
  BlockDocument,
  BlockMutation,
  BlockMutationVariables,
  BounceDocument,
  BounceMutation,
  BounceMutationVariables,
  DeleteBlokDocument,
  DeleteBlokMutation,
  DeleteBlokMutationVariables,
  DeleteDashboardDocument,
  DeleteDashboardMutation,
  DeleteDashboardMutationVariables,
  DeleteAgentDocument,
  DeleteMaterializedBlokDocument,
  DeleteMaterializedBlokMutation,
  DeleteMaterializedBlokMutationVariables,
  DeletePlacementDocument,
  DeleteShortcutDocument,
  DeleteSpaceDocument,
  KickDocument,
  KickMutation,
  KickMutationVariables,
  UnblockDocument,
  UnblockMutation,
  UnblockMutationVariables
} from '@/rekuest/api/graphql'
import { buildDeleteAction } from '../localactions/builders/deleteAction'
import { Action } from '../localactions/LocalActionProvider'

export const REKUEST_ACTIONS: Record<string, Action> = {
  'rekuest-delete-blok': {
    title: 'Delete Blok',
    description: 'Delete the blok and return to the blok list',
    conditions: [
      {
        type: 'identifier',
        identifier: '@rekuest/blok'
      },
      {
        type: 'nopartner'
      }
    ],
    execute: async ({ services, state, navigate }) => {
      for (const structure of state.left) {
        if (structure.identifier !== '@rekuest/blok') {
          continue
        }

        await services.rekuest.client.mutate<DeleteBlokMutation, DeleteBlokMutationVariables>({
          mutation: DeleteBlokDocument,
          variables: {
            input: {
              id: structure.object.id,
            },
          },
        })

        services.rekuest.client.cache.evict({
          id: services.rekuest.client.cache.identify({
            __typename: 'Blok',
            id: structure.object.id,
          }),
        })
      }

      services.rekuest.client.cache.gc()
      navigate('/rekuest/bloks')
    },
    collections: ['io'],
  },
  'rekuest-delete-materialized-blok': {
    title: 'Delete Materialized Blok',
    description: 'Delete the materialized blok and return to the list',
    conditions: [
      {
        type: 'identifier',
        identifier: '@rekuest/materialized_blok'
      },
      {
        type: 'nopartner'
      }
    ],
    execute: async ({ services, state, navigate }) => {
      for (const structure of state.left) {
        if (structure.identifier !== '@rekuest/materialized_blok') {
          continue
        }

        await services.rekuest.client.mutate<DeleteMaterializedBlokMutation, DeleteMaterializedBlokMutationVariables>({
          mutation: DeleteMaterializedBlokDocument,
          variables: {
            input: {
              id: structure.object.id,
            },
          },
        })

        services.rekuest.client.cache.evict({
          id: services.rekuest.client.cache.identify({
            __typename: 'MaterializedBlok',
            id: structure.object.id,
          }),
        })
      }

      services.rekuest.client.cache.gc()
      navigate('/rekuest/materialized_bloks')
    },
    collections: ['io'],
  },
  'rekuest-delete-dashboard': {
    title: 'Delete Dashboard',
    description: 'Delete the dashboard and return to the dashboard list',
    conditions: [
      {
        type: 'identifier',
        identifier: '@rekuest/dashboard'
      },
      {
        type: 'nopartner'
      }
    ],
    execute: async ({ services, state, navigate }) => {
      for (const structure of state.left) {
        if (structure.identifier !== '@rekuest/dashboard') {
          continue
        }

        await services.rekuest.client.mutate<DeleteDashboardMutation, DeleteDashboardMutationVariables>({
          mutation: DeleteDashboardDocument,
          variables: {
            input: {
              id: structure.object.id,
            },
          },
        })

        services.rekuest.client.cache.evict({
          id: services.rekuest.client.cache.identify({
            __typename: 'Dashboard',
            id: structure.object.id,
          }),
        })
      }

      services.rekuest.client.cache.gc()
      navigate('/rekuest/dashboards')
    },
    collections: ['io'],
  },
  'rekuest-delete-agent': buildDeleteAction({
    title: 'Delete Agent',
    identifier: '@rekuest/agent',
    description: 'Delete the agent',
    service: 'rekuest',
    typename: 'Agent',
    mutation: DeleteAgentDocument
  }),
  'rekuest-delete-shortcut': buildDeleteAction({
    title: 'Delete Shortcut',
    identifier: '@rekuest/shortcut',
    description: 'Delete the shortcut',
    service: 'rekuest',
    typename: 'Shortcut',
    mutation: DeleteShortcutDocument
  }),
   'rekuest-delete-space': buildDeleteAction({
    title: 'Delete Space',
    identifier: '@rekuest/space',
    description: 'Delete the space',
    service: 'rekuest',
    typename: 'Space',
    mutation: DeleteSpaceDocument
  }),
  'rekuest-delete-placement': buildDeleteAction({
    title: 'Delete Placement',
    identifier: '@rekuest/placement',
    description: 'Delete the placement',
    service: 'rekuest',
    typename: 'Placement',
    mutation: DeletePlacementDocument // You would need to implement this mutation in your GraphQL API
  }),

  'rekuest-bounce-agent': {
    title: 'Bounce Agent',
    conditions: [
      {
        type: 'identifier',
        identifier: '@rekuest/agent'
      }
    ],
    description: 'Restart the agent process',
    execute: async ({ services, state }) => {
      // Implementation for bouncing an agent goes here

      state.left.forEach(async (structure) => {
        if (structure.identifier !== '@rekuest/agent') {
          return
        }
        await services.rekuest.client.mutate<BounceMutation, BounceMutationVariables>({
          mutation: BounceDocument,
          variables: {
            input: { agent: structure.object }
          }
        })
        // variables: { ... } // Add necessary variables here
      })
    }
  },
  'rekuest-kick-agent': {
    title: 'Kick Agent',
    conditions: [
      {
        type: 'identifier',
        identifier: '@rekuest/agent'
      }
    ],
    description: 'Restart the agent process',
    execute: async ({ services, state }) => {
      // Implementation for bouncing an agent goes here

      state.left.forEach(async (structure) => {
        if (structure.identifier !== '@rekuest/agent') {
          return
        }
        await services.rekuest.client.mutate<KickMutation, KickMutationVariables>({
          mutation: KickDocument,
          variables: {
            input: { agent: structure.object }
          }
        })
        // variables: { ... } // Add necessary variables here
      })
    }
  },
  'rekuest-block-agent': {
    title: 'Block Agent',
    conditions: [
      {
        type: 'identifier',
        identifier: '@rekuest/agent'
      }
    ],
    description: 'Restart the agent process',
    execute: async ({ services, state }) => {
      // Implementation for bouncing an agent goes here

      state.left.forEach(async (structure) => {
        if (structure.identifier !== '@rekuest/agent') {
          return
        }
        await services.rekuest.client.mutate<BlockMutation, BlockMutationVariables>({
          mutation: BlockDocument,
          variables: {
            input: { agent: structure.object }
          }
        })
        // variables: { ... } // Add necessary variables here
      })
    }
  },
  'rekuest-unblock-agent': {
    title: 'Unblock Agent',
    conditions: [
      {
        type: 'identifier',
        identifier: '@rekuest/agent'
      }
    ],
    description: 'Restart the agent process',
    execute: async ({ services, state }) => {
      // Implementation for bouncing an agent goes here

      state.left.forEach(async (structure) => {
        if (structure.identifier !== '@rekuest/agent') {
          return
        }
        await services.rekuest.client.mutate<UnblockMutation, UnblockMutationVariables>({
          mutation: UnblockDocument,
          variables: {
            input: { agent: structure.object }
          }
        })
        // variables: { ... } // Add necessary variables here
      })
    }
  }
} as const
