import {
  BlockDocument,
  BlockMutation,
  BlockMutationVariables,
  BounceDocument,
  BounceMutation,
  BounceMutationVariables,
  DeleteAgentDocument,
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
