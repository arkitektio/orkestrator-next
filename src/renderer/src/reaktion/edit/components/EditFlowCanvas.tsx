import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FlowFragment } from '@/reaktion/api/graphql'
import { Graph } from '@/reaktion/base/Graph'
import { DeployInterfaceButton } from '@/reaktion/edit/components/buttons/DeployButton'
import { RunButton } from '@/reaktion/edit/components/buttons/RunButton'
import { useEditFlowStoreApi } from '@/reaktion/edit/context'
import { checkFlowIsEqual, createInitialState } from '@/reaktion/edit/store'
import { EdgeTypes, NodeTypes } from '@/reaktion/types'
import { ValidationResult } from '@/reaktion/validation/types'
import { AnimatePresence } from 'framer-motion'
import React, { RefObject, useMemo } from 'react'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { DefaultControls } from '../overlays/DefaultControls'
import { ErrorOverlay } from '../overlays/Error'
import { DelegatingContextual } from './DelegatingContextual'

type Props = {
  reactFlowWrapperRef: RefObject<HTMLDivElement | null>
  flow: FlowFragment
  save: () => void
  nodeTypes: NodeTypes
  edgeTypes: EdgeTypes
}

export const EditFlowCanvas: React.FC<Props> = ({
  reactFlowWrapperRef,
  flow,
  save,
  nodeTypes,
  edgeTypes
}) => {
  const store = useEditFlowStoreApi()
  const {
    nodes,
    edges,
    remainingErrors,
    contextuals,
    onNodesChange,
    onEdgesChange,
    onConnectStart,
    onConnectEnd,
    onConnect,
    onPaneClick,
    onNodeClick,
    onEdgeClick,
    setReactFlowInstance
  } = useStore(
    store,
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      remainingErrors: state.remainingErrors,
      contextuals: state.contextuals,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnectStart: state.onConnectStart,
      onConnectEnd: state.onConnectEnd,
      onConnect: state.onConnect,
      onPaneClick: state.onPaneClick,
      onNodeClick: state.onNodeClick,
      onEdgeClick: state.onEdgeClick,
      setReactFlowInstance: state.setReactFlowInstance
    }))
  )


  return (
    <div ref={reactFlowWrapperRef} className="flex flex-grow h-full w-full relative" data-disableselect>
      <>
        <ErrorOverlay />
        <AnimatePresence>
          {remainingErrors.length === 0 && (
            <Card className="absolute bottom-0 right-0 mr-3 mb-5 z-50 flex flex-row gap-2 items-center px-4 py-2 border">
              <Button onClick={save} size="lg">
                Save
              </Button>
              <DeployInterfaceButton flow={flow} />
            </Card>
          )}
        </AnimatePresence>
        {contextuals.map((contextual) => (
          <DelegatingContextual key={contextual.id} contextual={contextual} />
        ))}

        <Graph
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onConnect={onConnect}
          onPaneClick={onPaneClick}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          elementsSelectable={true}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onInit={setReactFlowInstance}
          fitView
          attributionPosition="bottom-right"
          proOptions={{ hideAttribution: true }}
        />

        <DefaultControls />
      </>
    </div>
  )
}
