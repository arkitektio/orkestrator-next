import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FlowFragment } from '@/reaktion/api/graphql'
import { Graph } from '@/reaktion/base/Graph'
import { DeployInterfaceButton } from '@/reaktion/edit/components/buttons/DeployButton'
import { RunButton } from '@/reaktion/edit/components/buttons/RunButton'
import { ContextualParams, EdgeTypes, FlowNode, NodeTypes } from '@/reaktion/types'
import { ValidationError, ValidationResult } from '@/reaktion/validation/types'
import { Edge, EdgeChange, NodeChange, OnConnectEnd, OnConnectStartParams, ReactFlowInstance } from '@xyflow/react'
import { AnimatePresence } from 'framer-motion'
import React, { RefObject } from 'react'
import { DefaultControls } from '../overlays/DefaultControls'
import { ErrorOverlay } from '../overlays/Error'
import { DelegatingContextual } from './DelegatingContextual'
import { useEditRiver } from '../context'

type Props = {
  reactFlowWrapperRef: RefObject<HTMLDivElement | null>
  flow: FlowFragment
  save: () => void
  isEqual: boolean
  currentState: ValidationResult
  globals: ValidationResult['globals']
  remainingErrors: ValidationError[]
  solvedErrors: ValidationResult['solvedErrors']
  showNodeErrors: boolean
  boundNodes: FlowNode[]
  contextuals: ContextualParams[]
  nodes: FlowNode[]
  edges: Edge[]
  reactFlowInstance: ReactFlowInstance | null
  addNode: (node: FlowNode) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnectStart: (_event: MouseEvent | TouchEvent, params: OnConnectStartParams) => void
  onConnectEnd: OnConnectEnd
  onConnect: (connection: Parameters<NonNullable<React.ComponentProps<typeof Graph>['onConnect']>>[0]) => void
  onPaneClick: (event: React.MouseEvent) => void
  onNodeClick: React.ComponentProps<typeof Graph>['onNodeClick']
  onEdgeClick: React.ComponentProps<typeof Graph>['onEdgeClick']
  nodeTypes: NodeTypes
  edgeTypes: EdgeTypes
  setReactFlowInstance: (instance: ReactFlowInstance | null) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  showEdgeLabels: boolean
  setShowEdgeLabels: (value: boolean) => void
  setShowNodeErrors: (value: boolean) => void
}

















export const EditFlowCanvas: React.FC<Props> = ({
  reactFlowWrapperRef,
  flow,
  save,
  isEqual,
  remainingErrors,
  contextuals,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnectStart,
  onConnectEnd,
  onConnect,
  onPaneClick,
  onNodeClick,
  onEdgeClick,
  nodeTypes,
  edgeTypes,
  setReactFlowInstance,
  showEdgeLabels,
  setShowEdgeLabels,
  setShowNodeErrors
}) => {



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
                  {flow.id && isEqual && <DeployInterfaceButton flow={flow} />}
                  {flow.id && isEqual && <RunButton flow={flow} />}
                </Card>
              )}
            </AnimatePresence>
            {contextuals.map((contextual, index) => <DelegatingContextual key={index} contextual={contextual} />)}

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
            >

            </Graph>

            <DefaultControls />
          </>
    </div>
  )
}
