import { DeleteBlockDocument, DeleteNeuronModelDocument } from '@/elektro/api/graphql'
import { Action } from '../localactions/LocalActionProvider'
import { buildDeleteAction } from '../localactions/builders/deleteAction'

export const ELEKTRO_ACTIONS: Record<string, Action> = {
  deleteElektroBlock: buildDeleteAction({
    title: 'Delete Block',
    identifier: '@elektro/block',
    description: 'Delete the Block',
    service: 'elektro',
    typename: 'Block',
    mutation: DeleteBlockDocument
  }),
  deleteElektroNeuronModel: buildDeleteAction({
    title: 'Delete Neuron Model',
    identifier: '@elektro/neuronmodel',
    description: 'Delete the Neuron Model',
    service: 'elektro',
    typename: 'NeuronModel',
    mutation: DeleteNeuronModelDocument
  })
}
