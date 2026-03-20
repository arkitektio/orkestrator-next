import { toast } from '@/components/ui/use-toast'
import {
  BaseGraphNodeFragment,
  FlowFragment,
  GraphInput,
  GraphNodeKind,
  ReactiveImplementation
} from '@/reaktion/api/graphql'
import { EditFlowCanvas } from '@/reaktion/edit/components/EditFlowCanvas'
import { EditFlowStoreContext, useEditFlowStoreApi } from '@/reaktion/edit/context'
import { LabeledShowEdge } from '@/reaktion/edit/edges/LabeledShowEdge'
import { RedoUndoHandler } from '@/reaktion/edit/keyboardhandlers/RedoUndo'
import { AgentSubflowWidget } from '@/reaktion/edit/nodes/AgentSubflowWidget'
import { ReactiveTrackNodeWidget } from '@/reaktion/edit/nodes/ReactiveWidget'
import { RekuestFilterActionWidget } from '@/reaktion/edit/nodes/RekuestFilterActionWidget'
import { RekuestMapActionWidget } from '@/reaktion/edit/nodes/RekuestMapActionWidget'
import { ArgTrackNodeWidget } from '@/reaktion/edit/nodes/generic/ArgShowNodeWidget'
import { ReturnTrackNodeWidget } from '@/reaktion/edit/nodes/generic/ReturnShowNodeWidget'
import { createEditFlowStore } from '@/reaktion/edit/store'
import { AgentSubFlowNodeData, AnyNode, ContextualParams, EdgeTypes, FlowNode, NodeTypes, RelativePosition } from '@/reaktion/types'
import {
  edges_to_flowedges,
  flowEdgeToInput,
  flowNodeToInput,
  globalToInput,
  handleToStream,
  nodeIdBuilder,
  nodes_to_flownodes
} from '@/reaktion/utils'
import {
  createVanillaTransformEdge,
  integrate,
  istriviallyIntegratable
} from '@/reaktion/validation/integrate'
import { ValidationResult } from '@/reaktion/validation/types'
import { validateState } from '@/reaktion/validation/validate'
import { PortKind } from '@/rekuest/api/graphql'
import { Connection, Edge, EdgeProps, Node, NodeProps, OnConnectEnd, OnConnectStartParams } from '@xyflow/react'
import React, { useCallback, useMemo, useRef } from 'react'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

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

const calculateMidpoint = (p1: { x: number; y: number }, p2: { x: number; y: number }) => ({
  x: (p1.x + p2.x) / 2,
  y: (p1.y + p2.y) / 2
})

const getClientPoint = (event: MouseEvent | TouchEvent) => {
  if ('touches' in event && event.touches.length > 0) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    }
  }

  if ('changedTouches' in event && event.changedTouches.length > 0) {
    return {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY
    }
  }

  if ('clientX' in event) {
    return {
      x: event.clientX,
      y: event.clientY
    }
  }

  return null
}

const hasBoundPort = (node: FlowNode<BaseGraphNodeFragment>): boolean => {
  return !!(
    node.data.ins?.find(
      (stream) =>
        stream && stream.length && stream.find((item) => item.kind === PortKind.MemoryStructure)
    ) ||
    node.data.outs?.find(
      (stream) =>
        stream && stream.length && stream.find((item) => item.kind === PortKind.MemoryStructure)
    ) ||
    node.data.voids?.find((item) => item.kind === PortKind.MemoryStructure) ||
    node.data.constants?.find((item) => item.kind === PortKind.MemoryStructure)
  )
}

const checkFlowIsEqual = (a: ValidationResult, b: ValidationResult) => {
  if (a.nodes.length !== b.nodes.length) return false
  if (a.edges.length !== b.edges.length) return false
  if (a.globals.length !== b.globals.length) return false
  if (a.valid !== b.valid) return false
  if (a.remainingErrors.length !== b.remainingErrors.length) return false
  if (a.solvedErrors.length !== b.solvedErrors.length) return false
  return true
}

const createInitialState = (flow: FlowFragment): ValidationResult =>
  validateState({
    nodes: nodes_to_flownodes(flow.graph?.nodes),
    edges: edges_to_flowedges(flow.graph?.edges),
    globals: flow.graph.globals || [],
    remainingErrors: [],
    solvedErrors: [],
    valid: true
  })

export const EditFlow: React.FC<Props> = ({ flow, onSave }) => {
  const reactFlowWrapperRef = useRef<HTMLDivElement | null>(null)
  const [store] = React.useState(() => createEditFlowStore(createInitialState(flow)))


  if (!store) {
    return <div>Loading...</div>
  }

  return (
    <EditFlowStoreContext.Provider value={store}>
      <RedoUndoHandler />
      <EditFlowInner flow={flow} onSave={onSave} reactFlowWrapperRef={reactFlowWrapperRef} />
    </EditFlowStoreContext.Provider>
  )



}

const EditFlowInner = ({
  flow,
  onSave,
  reactFlowWrapperRef
}: {
  flow: FlowFragment
  onSave?: (graph: GraphInput) => void
  reactFlowWrapperRef: React.RefObject<HTMLDivElement | null>
}) => {
  const store = useEditFlowStoreApi()
  const connectAppendRef = useRef(false)

  const {
    nodes,
    edges,
    globals,
    remainingErrors,
    solvedErrors,
    showEdgeLabels,
    showNodeErrors,
    contextuals,
    reactFlowInstance,
    onNodesChange,
    onEdgesChange,
    addNode,
    setShowEdgeLabels,
    setShowNodeErrors,
    setReactFlowInstance
  } = useStore(
    store,
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      globals: state.globals,
      remainingErrors: state.remainingErrors,
      solvedErrors: state.solvedErrors,
      showEdgeLabels: state.showEdgeLabels,
      showNodeErrors: state.showNodeErrors,
      contextuals: state.contextuals,
      reactFlowInstance: state.reactFlowInstance,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      addNode: state.addNode,
      setShowEdgeLabels: state.setShowEdgeLabels,
      setShowNodeErrors: state.setShowNodeErrors,
      setReactFlowInstance: state.setReactFlowInstance
    }))
  )

  const currentState = useMemo<ValidationResult>(
    () => ({
      nodes,
      edges,
      globals,
      remainingErrors,
      solvedErrors,
      valid: remainingErrors.length === 0
    }),
    [edges, globals, nodes, remainingErrors, solvedErrors]
  )

  const initialState = useMemo(() => createInitialState(flow), [flow])

  const isEqual = useMemo(
    () => checkFlowIsEqual(currentState, initialState),
    [currentState, initialState]
  )

  const boundNodes = useMemo(
    () => nodes.filter((node) => hasBoundPort(node as FlowNode<BaseGraphNodeFragment>)),
    [nodes]
  )



  const addVisibleContextual = useCallback(
    (contextual: ContextualParams, append = false) => {
      const state = store.getState()

      if (!append) {
        state.clearPanels()
      }

      state.addContextual(contextual)
    },
    [store]
  )

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      const nativeEvent = event.nativeEvent
      const state = store.getState()
      const append = nativeEvent.ctrlKey
      const hasSameEventContextual = state.contextuals.some(
        (contextual) => 'event' in contextual && contextual.event.timeStamp === nativeEvent.timeStamp
      )

      if (hasSameEventContextual) {
        return
      }

      if (!append && state.contextuals.some((contextual) => contextual.kind === 'click')) {
        state.clearPanels()
        return
      }

      const reactFlowBounds = reactFlowWrapperRef.current?.getBoundingClientRect()
      if (!state.reactFlowInstance || !reactFlowBounds) {
        return
      }

      addVisibleContextual(
        {
          kind: 'click',
          id: crypto.randomUUID(),
          event: nativeEvent,
          position: {
            x: nativeEvent.clientX - reactFlowBounds.left,
            y: nativeEvent.clientY - reactFlowBounds.top
          }
        },
        append
      )
    },
    [addVisibleContextual, reactFlowWrapperRef, store]
  )

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: AnyNode) => {
      const nativeEvent = event.nativeEvent
      const state = store.getState()
      const append = nativeEvent.ctrlKey

      const reactFlowBounds = reactFlowWrapperRef.current?.getBoundingClientRect()
      if (!state.reactFlowInstance || !reactFlowBounds) {
        return
      }

      if (node.type === 'AgentSubFlowNode') {
        if (
          !append &&
          state.contextuals.some(
            (contextual) => contextual.kind === 'node' && contextual.nodeId === node.id
          )
        ) {
          state.clearPanels()
          return
        }

        const appId = node.data.app;

        if (appId) {
          addVisibleContextual({
            kind: 'node',
            id: crypto.randomUUID(),
            nodeId: node.id,
            action: { type: 'implementations', appIdentifier: appId },
            position: {
              x: nativeEvent.clientX - reactFlowBounds.left,
              y: nativeEvent.clientY - reactFlowBounds.top
            }
          }, append)
        }
      }
    },
    [addVisibleContextual, reactFlowWrapperRef, store]
  )

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      const nativeEvent = event.nativeEvent
      const state = store.getState()
      const append = nativeEvent.ctrlKey
      const hasSameEventContextual = state.contextuals.some(
        (contextual) => 'event' in contextual && contextual.event.timeStamp === nativeEvent.timeStamp
      )

      if (hasSameEventContextual) {
        return
      }

      if (
        !append &&
        state.contextuals.some(
          (contextual) => contextual.kind === 'edge' && contextual.edgeId === edge.id
        )
      ) {
        state.clearPanels()
        return
      }

      const reactFlowBounds = reactFlowWrapperRef.current?.getBoundingClientRect()
      if (!state.reactFlowInstance || !reactFlowBounds) {
        return
      }

      const leftNode = state.reactFlowInstance.getNode(edge.source) as FlowNode | undefined
      const rightNode = state.reactFlowInstance.getNode(edge.target) as FlowNode | undefined

      if (!leftNode || !rightNode) {
        return
      }

      addVisibleContextual({
        kind: 'edge',
        id: crypto.randomUUID(),
        edgeId: edge.id,
        event: nativeEvent,
        position: {
          x: nativeEvent.clientX - reactFlowBounds.left,
          y: nativeEvent.clientY - reactFlowBounds.top
        },
        leftNode,
        leftStream: handleToStream(edge.sourceHandle),
        rightNode,
        rightStream: handleToStream(edge.targetHandle)
      }, append)
    },
    [addVisibleContextual, reactFlowWrapperRef, store]
  )

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

  const onConnect = useCallback(
    (connection: Connection) => {
      const state = store.getState()
      state.setConnectingStart(undefined)
      const append = connectAppendRef.current
      connectAppendRef.current = false

      if (
        istriviallyIntegratable(
          { nodes: state.nodes, edges: state.edges, globals: state.globals },
          connection
        )
      ) {
        const integratedState = integrate(
          { nodes: state.nodes, edges: state.edges, globals: state.globals },
          connection
        )

        state.replaceValidationResult(validateState(integratedState))
        return
      }

      if (!state.reactFlowInstance) {
        return
      }

      const leftNode = state.nodes.find((node) => node.id === connection.source)
      const rightNode = state.nodes.find((node) => node.id === connection.target)

      if (!leftNode || !rightNode) {
        return
      }

      const reactFlowBounds = reactFlowWrapperRef.current?.getBoundingClientRect()
      if (!reactFlowBounds) {
        return
      }

      const screenPosition = state.reactFlowInstance.flowToScreenPosition(
        calculateMidpoint(leftNode.position, rightNode.position)
      )

      addVisibleContextual(
        {
          kind: 'connect',
          id: crypto.randomUUID(),
          leftNode,
          rightNode,
          leftStream: handleToStream(connection.sourceHandle),
          rightStream: handleToStream(connection.targetHandle),
          connection,
          position: {
            x: screenPosition.x - reactFlowBounds.left,
            y: screenPosition.y - reactFlowBounds.top
          }
        },
        append
      )
    },
    [addVisibleContextual, reactFlowWrapperRef, store]
  )

  const onConnectStart = useCallback(
    (event: MouseEvent | TouchEvent, params: OnConnectStartParams) => {
      store.getState().setConnectingStart(params)
    },
    [store]
  )

  const onConnectEnd = useCallback<OnConnectEnd>(
    (event) => {
      const state = store.getState()
      const target = event.target as HTMLElement
      const targetEdgeId = target.dataset?.edgeid
      const targetIsPane = target.classList.contains('react-flow__pane')
      const reactFlowBounds = reactFlowWrapperRef.current?.getBoundingClientRect()
      const point = getClientPoint(event)

      const targetSubflowNode =
        state.reactFlowInstance && point
          ? state.nodes
              .filter((node) => node.type === 'AgentSubFlowNode')
              .find((node) => {
                const flowPoint = state.reactFlowInstance?.screenToFlowPosition(point)
                const width = node.measured?.width ?? node.width ?? 0
                const height = node.measured?.height ?? node.height ?? 0

                if (!flowPoint || width <= 0 || height <= 0) {
                  return false
                }

                return (
                  flowPoint.x >= node.position.x &&
                  flowPoint.x <= node.position.x + width &&
                  flowPoint.y >= node.position.y &&
                  flowPoint.y <= node.position.y + height
                )
              })
          : undefined

      if (
        (targetIsPane || targetSubflowNode) &&
        state.reactFlowInstance &&
        state.connectingStart &&
        reactFlowBounds
      ) {
        const connectionParams = state.connectingStart

        if (connectionParams.nodeId && connectionParams.handleId) {
          const node = state.reactFlowInstance.getNode(connectionParams.nodeId) as
            | FlowNode
            | undefined

          if (!node || !point) {
            return
          }

          const position = {
            x: point.x - reactFlowBounds.left,
            y: point.y - reactFlowBounds.top
          }

          const nodePosition = state.reactFlowInstance.flowToScreenPosition(node.position)

          let relativePosition: RelativePosition | null = null

          if (nodePosition.x < position.x) {
            relativePosition = nodePosition.y < position.y ? 'bottomright' : 'topright'
          } else {
            relativePosition = nodePosition.y < position.y ? 'bottomleft' : 'topleft'
          }

          console.log('Determined relative position as', relativePosition, { nodePosition, position })

          if (connectionParams.handleType && relativePosition) {
            console.log('Adding contextual with params')
            addVisibleContextual(
              targetSubflowNode
                ? {
                    kind: 'subflowdrop',
                    id: crypto.randomUUID(),
                    handleType: connectionParams.handleType,
                    causingNode: node,
                    causingStream: handleToStream(connectionParams.handleId),
                    connectionParams,
                    position,
                    relativePosition,
                    event,
                    subflowNodeId: targetSubflowNode.id,
                    subflowNode: targetSubflowNode as Node<AgentSubFlowNodeData, "AgentSubFlowNode">
                  }
                : {
                    kind: 'drop',
                    id: crypto.randomUUID(),
                    handleType: connectionParams.handleType,
                    causingNode: node,
                    causingStream: handleToStream(connectionParams.handleId),
                    connectionParams,
                    position,
                    relativePosition,
                    event
                  },
            )
          }
        }
        return
      }

      if (state.reactFlowInstance && state.connectingStart && targetEdgeId) {
        const connectionParams = state.connectingStart

        if (!connectionParams.nodeId || !connectionParams.handleId) {
          return
        }

        const node = state.reactFlowInstance.getNode(connectionParams.nodeId) as
          | FlowNode
          | undefined
        const edge = state.reactFlowInstance.getEdge(targetEdgeId)
        const point = getClientPoint(event)

        if (!node || !edge || !point) {
          return
        }

        if (connectionParams.handleType === 'source') {
          const stagingSourceId = node.id
          const stagingSourceStreamId = handleToStream(connectionParams.handleId)
          const oldEdgeSourceId = edge.source
          const oldEdgeSourceHandle = edge.sourceHandle
          const oldEdgeTargetId = edge.target
          const oldEdgeTargetHandle = edge.targetHandle
          const oldEdgeSourceStreamId = handleToStream(oldEdgeSourceHandle)
          const oldNode = state.reactFlowInstance.getNode(oldEdgeSourceId) as FlowNode | undefined

          if (!oldNode) {
            return
          }

          const stagingOutstream = node.data.outs.at(stagingSourceStreamId)
          const oldOutstream = oldNode.data.outs.at(oldEdgeSourceStreamId)

          if (!stagingOutstream || !oldOutstream) {
            return
          }

          const zipNodeInstream =
            node.position.x < oldNode.position.x
              ? [stagingOutstream, oldOutstream]
              : [oldOutstream, stagingOutstream]

          const position = state.reactFlowInstance.screenToFlowPosition(point)

          const zipNode = {
            id: nodeIdBuilder(),
            type: 'ReactiveNode',
            position,
            data: {
              globalsMap: {},
              title: 'Zip',
              description: 'Zips together two streams into one stream.',
              kind: GraphNodeKind.Reactive,
              ins: zipNodeInstream,
              constantsMap: {},
              outs: [[...stagingOutstream, ...oldOutstream]],
              constants: [],
              voids: [],
              implementation: ReactiveImplementation.Zip
            }
          } as FlowNode

          const stagedState = {
            ...state,
            nodes: state.nodes.concat(zipNode),
            edges: state.edges
              .filter((candidate) => candidate.id !== edge.id)
              .concat(
                createVanillaTransformEdge(
                  nodeIdBuilder(),
                  stagingSourceId,
                  stagingSourceStreamId,
                  zipNode.id,
                  node.position.x < oldNode.position.x ? 0 : 1
                ),
                createVanillaTransformEdge(
                  nodeIdBuilder(),
                  oldEdgeSourceId,
                  oldEdgeSourceStreamId,
                  zipNode.id,
                  position.x < oldNode.position.x ? 1 : 0
                )
              )
          }

          const integratedState = integrate(stagedState, {
            source: zipNode.id,
            sourceHandle: 'return_0',
            target: oldEdgeTargetId,
            targetHandle: oldEdgeTargetHandle ?? null
          })

          state.replaceValidationResult(validateState(integratedState))
        }
      }

      connectAppendRef.current = false
    },
    [addVisibleContextual, isCtrlPressed, reactFlowWrapperRef, store]
  )
  return (
    <EditFlowCanvas
      reactFlowWrapperRef={reactFlowWrapperRef}
      flow={flow}
      save={save}
      isEqual={isEqual}
      currentState={currentState}
      globals={globals}
      remainingErrors={remainingErrors}
      solvedErrors={solvedErrors}
      showNodeErrors={showNodeErrors}
      boundNodes={boundNodes}
      contextuals={contextuals}
      nodes={nodes}
      edges={edges}
      reactFlowInstance={reactFlowInstance}
      addNode={addNode}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      setReactFlowInstance={setReactFlowInstance}
      showEdgeLabels={showEdgeLabels}
      setShowEdgeLabels={setShowEdgeLabels}
      setShowNodeErrors={setShowNodeErrors}
    />
  )
}
