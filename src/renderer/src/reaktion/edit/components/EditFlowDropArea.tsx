import { FlussReactiveTemplate, RekuestAction } from '@/linkers'
import { useSmartDrop } from '@/providers/smart/hooks'
import { FlowNode } from '@/reaktion/types'
import { reactiveTemplateToFlowNode } from '@/reaktion/utils'
import { ConstantActionDocument, ConstantActionQuery } from '@/rekuest/api/graphql'
import { ReactiveTemplateDocument, ReactiveTemplateQuery } from '@/reaktion/api/graphql'
import { rekuestActionToMatchingNode } from '@/reaktion/plugins/rekuest'
import React from 'react'
import { useRekuest } from '@/app/Arkitekt'
import { ReactFlowInstance } from '@xyflow/react'

type Props = {
  reactFlowInstance: ReactFlowInstance | null
  addNode: (node: FlowNode) => void
  children: (isOver: boolean) => React.ReactNode
}

export const EditFlowDropArea: React.FC<Props> = ({ reactFlowInstance, addNode, children }) => {
  const arkitektApi = useRekuest()

  const [{ isOver }, dropRef] = useSmartDrop(
    (items, monitor) => {
      if (monitor.didDrop()) {
        return {}
      }

      const point = monitor.getClientOffset()
      if (!reactFlowInstance || !point || !arkitektApi) {
        return {}
      }

      items.forEach((item, index) => {
        const id = item.object
        const type = item.identifier

        if (!id || !type) {
          return
        }

        const position = reactFlowInstance.screenToFlowPosition({
          x: point.x,
          y: point.y + index * 100
        })

        if (type === RekuestAction.identifier) {
          arkitektApi
            .query({
              query: ConstantActionDocument,
              variables: { id }
            })
            .then((event: { data?: ConstantActionQuery }) => {
              if (event.data?.action) {
                addNode(rekuestActionToMatchingNode(event.data.action, position))
              }
            })
        }

        if (type === FlussReactiveTemplate.identifier) {
          arkitektApi
            .query({
              query: ReactiveTemplateDocument,
              variables: { id }
            })
            .then((event: { data?: ReactiveTemplateQuery }) => {
              if (event.data?.reactiveTemplate) {
                addNode(reactiveTemplateToFlowNode(event.data.reactiveTemplate, position))
              }
            })
        }
      })

      return {}
    },
    [addNode, arkitektApi, reactFlowInstance]
  )

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      className="flex flex-grow h-full w-full relative"
    >
      {children(isOver)}
    </div>
  )
}
