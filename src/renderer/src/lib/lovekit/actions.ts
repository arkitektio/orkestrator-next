import { Action } from '@/lib/localactions/LocalActionProvider'
import { buildDeleteAction } from '@/lib/localactions/builders/deleteAction'
import { DeleteRoomDocument } from '@/alpaka/api/graphql'

export const LOVEKIT_ACTIONS: Action[] = [
  buildDeleteAction({
    title: 'Delete Room',
    identifier: '@alpaka/room',
    description: 'Delete the Graph',
    service: 'alpaka',
    typename: 'Room',
    mutation: DeleteRoomDocument
  })
]
