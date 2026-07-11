import {
  AgentDocument,
  AgentQuery,
  AgentQueryVariables,
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
  ImplementationDocument,
  ImplementationQuery,
  ImplementationQueryVariables,
  KickDocument,
  KickMutation,
  KickMutationVariables,
  PinAgentDocument,
  PinAgentMutation,
  PinAgentMutationVariables,
  UnblockDocument,
  UnblockMutation,
  UnblockMutationVariables
} from '@/rekuest/api/graphql'
import type { Arkitekt } from '@/app/Arkitekt'
import { buildDeleteAction } from '../localactions/builders/deleteAction'
import { Action } from '../localactions/LocalActionProvider'
import { Ban, Bookmark, LogOut, Pencil, Pin, RotateCcw, ShieldCheck, Trash2 } from 'lucide-react'

type RekuestAction = Action<typeof Arkitekt>

export const REKUEST_ACTIONS: Record<string, RekuestAction> = {
  'rekuest-update-agent': {
    title: 'Rename / Update Agent',
    description: 'Open the update dialog for this agent',
    icon: Pencil,
    conditions: [
      {
        type: 'identifier',
        identifier: '@rekuest/agent'
      },
      {
        type: 'nopartner'
      }
    ],
    execute: async ({ services, state, dialog }) => {
      if (!services.rekuest) {
        throw new Error('Rekuest service not available')
      }

      const selectedAgent = state.left.find(
        (item) => item.identifier === '@rekuest/agent',
      )

      if (!selectedAgent?.object?.id) {
        throw new Error('No agent selected for Rename / Update Agent action')
      }

      const { data } = await services.rekuest.client.query<
        AgentQuery,
        AgentQueryVariables
      >({
        query: AgentDocument,
        variables: {
          id: selectedAgent.object.id,
        },
        fetchPolicy: 'network-only',
      })

      if (!data?.agent) {
        throw new Error('Unable to load agent for update dialog')
      }

      dialog.openDialog('updateagent', { agent: data.agent })
    },
    collections: ['io'],
  },
  'rekuest-delete-blok': {
    title: 'Delete Blok',
    description: 'Delete the blok and return to the blok list',
    icon: Trash2,
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
      if (!services.rekuest) {
        throw new Error('Rekuest service not available')
      }

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
    icon: Trash2,
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
      if (!services.rekuest) {
        throw new Error('Rekuest service not available')
      }

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
    icon: Trash2,
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
      if (!services.rekuest) {
        throw new Error('Rekuest service not available')
      }

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

  'rekuest-pin-agent': {
    title: 'Pin Agent',
    icon: Pin,
    conditions: [
      {
        type: 'identifier',
        identifier: '@rekuest/agent'
      }
    ],
    description: 'Pin or unpin this agent',
    execute: async ({ services, state }) => {
      if (!services.rekuest) {
        throw new Error('Rekuest service not available')
      }

      for (const structure of state.left) {
        if (structure.identifier !== '@rekuest/agent') {
          continue
        }

        await services.rekuest.client.mutate<PinAgentMutation, PinAgentMutationVariables>({
          mutation: PinAgentDocument,
          variables: {
            input: {
              id: structure.object.id,
              pin: !structure.object.pinned,
            },
          },
        })
      }
    },
  },

  'rekuest-bounce-agent': {
    title: 'Bounce Agent',
    icon: RotateCcw,
    conditions: [
      {
        type: 'identifier',
        identifier: '@rekuest/agent'
      }
    ],
    description: 'Restart the agent process',
    execute: async ({ services, state }) => {
      if (!services.rekuest) {
        throw new Error('Rekuest service not available')
      }
      const client = services.rekuest.client

      state.left.forEach(async (structure) => {
        if (structure.identifier !== '@rekuest/agent') {
          return
        }
        await client.mutate<BounceMutation, BounceMutationVariables>({
          mutation: BounceDocument,
          variables: {
            input: { agent: structure.object.id }
          }
        })
      })
    }
  },
  'rekuest-kick-agent': {
    title: 'Kick Agent',
    icon: LogOut,
    conditions: [
      {
        type: 'identifier',
        identifier: '@rekuest/agent'
      }
    ],
    description: 'Restart the agent process',
    execute: async ({ services, state }) => {
      if (!services.rekuest) {
        throw new Error('Rekuest service not available')
      }
      const client = services.rekuest.client

      state.left.forEach(async (structure) => {
        if (structure.identifier !== '@rekuest/agent') {
          return
        }
        await client.mutate<KickMutation, KickMutationVariables>({
          mutation: KickDocument,
          variables: {
            input: { agent: structure.object.id }
          }
        })
      })
    }
  },
  'rekuest-block-agent': {
    title: 'Block Agent',
    icon: Ban,
    conditions: [
      {
        type: 'identifier',
        identifier: '@rekuest/agent'
      }
    ],
    description: 'Restart the agent process',
    execute: async ({ services, state }) => {
      if (!services.rekuest) {
        throw new Error('Rekuest service not available')
      }
      const client = services.rekuest.client

      state.left.forEach(async (structure) => {
        if (structure.identifier !== '@rekuest/agent') {
          return
        }
        await client.mutate<BlockMutation, BlockMutationVariables>({
          mutation: BlockDocument,
          variables: {
            input: { agent: structure.object.id }
          }
        })
      })
    }
  },
  'rekuest-unblock-agent': {
    title: 'Unblock Agent',
    icon: ShieldCheck,
    conditions: [
      {
        type: 'identifier',
        identifier: '@rekuest/agent'
      }
    ],
    description: 'Restart the agent process',
    execute: async ({ services, state }) => {
      if (!services.rekuest) {
        throw new Error('Rekuest service not available')
      }
      const client = services.rekuest.client

      state.left.forEach(async (structure) => {
        if (structure.identifier !== '@rekuest/agent') {
          return
        }
        await client.mutate<UnblockMutation, UnblockMutationVariables>({
          mutation: UnblockDocument,
          variables: {
            input: { agent: structure.object.id }
          }
        })
      })
    }
  },
  'rekuest-create-shortcut-from-implementation': {
    title: 'Create Shortcut',
    description: 'Create a shortcut for this action',
    icon: Bookmark,
    conditions: [
      {
        type: 'identifier',
        identifier: '@rekuest/implementation',
      },
      {
        type: 'nopartner',
      },
    ],
    execute: async ({ services, state, dialog }) => {
      if (!services.rekuest) {
        throw new Error('Rekuest service not available')
      }

      const structure = state.left.find(
        (item) => item.identifier === '@rekuest/implementation',
      )

      if (!structure?.object?.id) {
        throw new Error('No implementation selected')
      }

      const { data } = await services.rekuest.client.query<
        ImplementationQuery,
        ImplementationQueryVariables
      >({
        query: ImplementationDocument,
        variables: { id: structure.object.id },
        fetchPolicy: 'cache-first',
      })

      if (!data?.implementation?.action?.id) {
        throw new Error('Could not load action for this implementation')
      }

      dialog.openDialog('createshortcut', { id: data.implementation.action.id })
    },
    collections: ['io'],
  },
} as const
