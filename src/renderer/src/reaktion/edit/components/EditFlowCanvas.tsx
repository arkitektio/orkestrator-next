import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { FlowFragment } from '@/reaktion/api/graphql'
import { Graph } from '@/reaktion/base/Graph'
import { Controls } from '@/reaktion/components/controls/Controls'
import { ClickContextual } from '@/reaktion/edit/components/ClickContextual'
import { ConnectContextual } from '@/reaktion/edit/components/ConnectContextual'
import { DropContextual } from '@/reaktion/edit/components/DropContextual'
import { EdgeContextual } from '@/reaktion/edit/components/EdgeContextual'
import { SubflowDropContextual } from '@/reaktion/edit/components/SubflowDropContextual'
import { NodeContextual } from '@/reaktion/edit/components/NodeContextual'
import { BoundNodesBox } from '@/reaktion/edit/components/boxes/BoundNodesBox'
import { ErrorBox } from '@/reaktion/edit/components/boxes/ErrorBox'
import { SolvedErrorBox } from '@/reaktion/edit/components/boxes/SolvedErrorBox'
import { DeployInterfaceButton } from '@/reaktion/edit/components/buttons/DeployButton'
import { RunButton } from '@/reaktion/edit/components/buttons/RunButton'
import { EditFlowDropArea } from '@/reaktion/edit/components/EditFlowDropArea'
import { EdgeTypes, FlowNode, NodeTypes, ContextualParams } from '@/reaktion/types'
import { ValidationError, ValidationResult } from '@/reaktion/validation/types'
import { EyeOpenIcon, LetterCaseToggleIcon, QuestionMarkIcon } from '@radix-ui/react-icons'
import { Edge, NodeChange, EdgeChange, OnConnectEnd, OnConnectStartParams, ReactFlowInstance } from '@xyflow/react'
import { AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronsLeft } from 'lucide-react'
import React, { RefObject, useCallback } from 'react'
import { ErrorOverlay } from '../overlays/Error'

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
  currentState,
  globals,
  remainingErrors,
  solvedErrors,
  showNodeErrors,
  boundNodes,
  contextuals,
  nodes,
  edges,
  reactFlowInstance,
  addNode,
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
  undo,
  redo,
  canUndo,
  canRedo,
  showEdgeLabels,
  setShowEdgeLabels,
  setShowNodeErrors
}) => {
  const renderContextual = useCallback((contextual: ContextualParams) => {
    switch (contextual.kind) {
      case 'drop':
        return <DropContextual key={contextual.id} params={contextual} />
      case 'subflowdrop':
        return <SubflowDropContextual key={contextual.id} params={contextual} />
      case 'click':
        return <ClickContextual key={contextual.id} params={contextual} />
      case 'edge':
        return <EdgeContextual key={contextual.id} params={contextual} />
      case 'connect':
        return <ConnectContextual key={contextual.id} params={contextual} />
      case 'node':
        return <NodeContextual key={contextual.id} params={contextual} />
    }
    return null
  }, [])

  return (
    <div ref={reactFlowWrapperRef} className="flex flex-grow h-full w-full" data-disableselect>
      <EditFlowDropArea reactFlowInstance={reactFlowInstance} addNode={addNode}>
        {(isOver) => (
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

              {globals.length > 0 && (
                <div className="absolute top-0 left-0 ml-3 mt-5 z-50">
                  <Card className="max-w-md">
                    <CardHeader>
                      <CardDescription>Globals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-xs text-muted-foreground">
                        These are global variables that will be constants to the whole workflow.
                      </CardDescription>
                      {globals.map((globalArg) => (
                        <div key={globalArg.key}>{globalArg.key}</div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="absolute top-0 right-0 mr-3 mt-5 z-50 max-w-xs gap-1 flex flex-col">
                {remainingErrors.length !== 0 && showNodeErrors && (
                  <ErrorBox errors={remainingErrors} />
                )}
                {solvedErrors.length !== 0 && showNodeErrors && (
                  <SolvedErrorBox errors={solvedErrors} />
                )}
                {boundNodes.length > 0 && <BoundNodesBox nodes={boundNodes} />}
              </div>

              {isOver && <div className="absolute w-full h-full bg-white opacity-10 z-10" />}

              {contextuals.map(renderContextual)}
            </AnimatePresence>

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
              <Controls className="flex flex-row bg-card gap-2 rounded rounded-md overflow-hidden px-2">
                <Button variant="outline" size="icon" onClick={() => undo()} disabled={!canUndo}>
                  <ChevronsLeft />
                </Button>
                <Button variant="outline" size="icon" onClick={() => redo()} disabled={!canRedo}>
                  <ChevronRight />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowEdgeLabels(!showEdgeLabels)}
                >
                  <LetterCaseToggleIcon />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowNodeErrors(!showNodeErrors)}
                >
                  <QuestionMarkIcon />
                </Button>
                <Sheet>
                  <SheetTrigger>
                    <Button variant="outline" size="icon">
                      <EyeOpenIcon />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Debug Screen</SheetTitle>
                      <SheetDescription />
                    </SheetHeader>
                    <ScrollArea className="h-full dark:text-white">
                      <pre>{JSON.stringify(currentState, null, 2)}</pre>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              </Controls>
            </Graph>
          </>
        )}
      </EditFlowDropArea>
    </div>
  )
}
