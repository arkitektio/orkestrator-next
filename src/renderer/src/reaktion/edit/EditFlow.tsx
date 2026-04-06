import { toast } from '@/components/ui/use-toast'
import {
  FlowFragment,
  GraphInput
} from '@/reaktion/api/graphql'
import { EditFlowCanvas } from '@/reaktion/edit/components/EditFlowCanvas'
import { EditFlowStoreContext } from '@/reaktion/edit/context'
import { LabeledShowEdge } from '@/reaktion/edit/edges/LabeledShowEdge'
import { RedoUndoHandler } from '@/reaktion/edit/keyboardhandlers/RedoUndo'
import { AgentSubflowWidget } from '@/reaktion/edit/nodes/AgentSubflowWidget'
import { ReactiveTrackNodeWidget } from '@/reaktion/edit/nodes/ReactiveWidget'
import { RekuestFilterActionWidget } from '@/reaktion/edit/nodes/RekuestFilterActionWidget'
import { RekuestMapActionWidget } from '@/reaktion/edit/nodes/RekuestMapActionWidget'
import { ArgTrackNodeWidget } from '@/reaktion/edit/nodes/generic/ArgShowNodeWidget'
import { ReturnTrackNodeWidget } from '@/reaktion/edit/nodes/generic/ReturnShowNodeWidget'
import { createEditFlowStore, createInitialState } from '@/reaktion/edit/store'
import { EdgeTypes, NodeTypes } from '@/reaktion/types'
import {
  flowEdgeToInput,
  flowNodeToInput,
  globalToInput
} from '@/reaktion/utils'
import { EdgeProps, NodeProps } from '@xyflow/react'
import React, { useCallback, useEffect, useRef } from 'react'

const nodeTypes: NodeTypes = {
  RekuestFilterActionNode: RekuestFilterActionWidget as React.FC<NodeProps>,
  RekuestMapActionNode: RekuestMapActionWidget as React.FC<NodeProps>,
  ReactiveNode: ReactiveTrackNodeWidget as React.FC<NodeProps>,
  ArgNode: ArgTrackNodeWidget as React.FC<NodeProps>,
  ReturnNode: ReturnTrackNodeWidget as React.FC<NodeProps>,
  AgentSubFlowNode: AgentSubflowWidget as React.FC<NodeProps>
}

const edgeTypes: EdgeTypes = {
  VanillaEdge: LabeledShowEdge as React.FC<EdgeProps>,
  LoggingEdge: LabeledShowEdge as React.FC<EdgeProps>
}

export type Props = {
  flow: FlowFragment
  onSave?: (graph: GraphInput) => void
}

export const EditFlow: React.FC<Props> = ({ flow, onSave }) => {
  const reactFlowWrapperRef = useRef<HTMLDivElement | null>(null)
  const [store] = React.useState(() => createEditFlowStore(createInitialState(flow)))

  useEffect(() => {
    store.getState().setRelativeWrapperRef(reactFlowWrapperRef)
  }, [store])

  const save = useCallback(() => {
    const state = store.getState()

    if (state.remainingErrors.length === 0) {
      const graph: GraphInput = {
        nodes: state.nodes.map((node) => flowNodeToInput(node)),
        edges: state.edges.map((edge) => flowEdgeToInput(edge)),
        globals: state.globals.map((globalArg) => globalToInput(globalArg))
      }

      onSave?.(graph)
      return
    }

    toast({
      title: 'Workflow has errors',
      description: 'Resolve the remaining validation errors before saving.'
    })
  }, [onSave, store])

  return (
    <EditFlowStoreContext.Provider value={store}>
      <RedoUndoHandler />
      <EditFlowCanvas
        reactFlowWrapperRef={reactFlowWrapperRef}
        flow={flow}
        save={save}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      />
    </EditFlowStoreContext.Provider>
  )
}
