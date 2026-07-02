import {
  AddModelsToWorkspaceDocument,
  AddModelsToWorkspaceMutation,
  AddModelsToWorkspaceMutationVariables,
  CreateModelWorkspaceDocument,
  CreateModelWorkspaceMutation,
  CreateModelWorkspaceMutationVariables,
  DeleteBlockDocument,
  DeleteModelWorkspaceDocument,
  DeleteNeuronModelDocument,
} from '@/elektro/api/graphql'
import { useActiveWorkspaceStore } from '@/elektro/lib/activeWorkspaceStore'
import { ElektroModelWorkspace } from '@/linkers'
import { ApolloClient, NormalizedCache } from '@apollo/client'
import { Download, LayoutDashboard } from 'lucide-react'
import { Action } from '../localactions/LocalActionProvider'
import { buildDeleteAction } from '../localactions/builders/deleteAction'

/**
 * Spin up a fresh workspace seeded with the selected neuron model, make it the
 * active workspace (so subsequently-saved models join it), and open it. No
 * dialog — the workspace is auto-named after the model.
 */
const createWorkspaceFromModel: Action = {
  title: 'Create Workspace from Model',
  description: 'Start a model workspace seeded with this neuron model',
  icon: LayoutDashboard,
  collections: ['io'],
  conditions: [
    { type: 'identifier', identifier: '@elektro/neuronmodel' },
    { type: 'nopartner' },
  ],
  execute: async ({ state, services, navigate }) => {
    const model = state.left[0]?.object
    if (!model) {
      throw new Error('No neuron model provided for Create Workspace action')
    }

    const client = services.elektro.client as ApolloClient<NormalizedCache>
    if (!client) {
      throw new Error('Elektro service not available')
    }

    const name =
      typeof model.name === 'string' && model.name
        ? `${model.name} Workspace`
        : 'New Workspace'

    const created = await client.mutate<
      CreateModelWorkspaceMutation,
      CreateModelWorkspaceMutationVariables
    >({
      mutation: CreateModelWorkspaceDocument,
      variables: { input: { name } },
    })

    const workspaceId = created.data?.createModelWorkspace?.id
    if (!workspaceId) {
      throw new Error('Failed to create workspace')
    }

    await client.mutate<
      AddModelsToWorkspaceMutation,
      AddModelsToWorkspaceMutationVariables
    >({
      mutation: AddModelsToWorkspaceDocument,
      variables: { input: { workspace: workspaceId, models: [model.id] } },
    })

    const store = useActiveWorkspaceStore.getState()
    store.setActiveWorkspace(workspaceId)
    store.setActiveModel(model.id)

    navigate(ElektroModelWorkspace.linkBuilder(workspaceId))
  },
}

/**
 * Open the exporter dialog for a neuron model: pick a rekuest exporter action
 * (neuronmodel in, file out), run it, and let the task-hook runner auto-download
 * the resulting file when the (potentially long-running) task finishes.
 */
const exportNeuronModel: Action = {
  title: 'Export Model',
  description: 'Run an exporter on this neuron model and download the result',
  icon: Download,
  collections: ['io'],
  conditions: [
    { type: 'identifier', identifier: '@elektro/neuronmodel' },
    { type: 'nopartner' },
  ],
  execute: async ({ state, dialog }) => {
    const model = state.left[0]?.object
    if (!model) {
      throw new Error('No neuron model provided for Export action')
    }
    dialog.openDialog('exportelektromodel', {
      modelId: model.id,
      modelName: typeof model.name === 'string' ? model.name : undefined,
    })
  },
}

export const ELEKTRO_ACTIONS: Record<string, Action> = {
  createElektroWorkspaceFromModel: createWorkspaceFromModel,
  exportElektroNeuronModel: exportNeuronModel,
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
  }),
  deleteElektroModelWorkspace: buildDeleteAction({
    title: 'Delete Model Workspace',
    identifier: '@elektro/modelworkspace',
    description: 'Delete the Model Workspace',
    service: 'elektro',
    typename: 'ModelWorkspace',
    mutation: DeleteModelWorkspaceDocument
  })
}
