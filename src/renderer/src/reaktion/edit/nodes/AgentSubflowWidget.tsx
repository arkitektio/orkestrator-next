import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FlowNode } from '@/reaktion/types'

import { AgentSubFlowNodeFragment } from '@/reaktion/api/graphql'
import { AgentSubFlownNodeProps, AgentSubFlowNodeData } from '../../types'
import { NodeResizeControl } from '@xyflow/react'
import { useEditFlowStore, useSubflowChildCount } from '../context'
import { NodeShowLayout } from '@/reaktion/base/NodeShow'
import { Button } from '@/components/ui/button'
import { useAgentsQuery } from '@/rekuest/api/graphql'

type AgentSubflowNode = FlowNode<AgentSubFlowNodeFragment> & {
  data: AgentSubFlowNodeData & {
    agent?: {
      id: string
    }
  }
}

export const AgentSubflowWidget = ({
  data,
  id,
  selected
}: AgentSubFlownNodeProps & AgentSubflowNode) => {




  const setAutoResolvable = useEditFlowStore((state) => state.setAutoResolvable)


  const { data: agentData, error: agentError } = useAgentsQuery({
    variables: {
      filters: {
         appIdentifier: data.appFilter,
         versionNumber: data.versionFilter,
      }
    }
  })




  const subflowChildCount = useSubflowChildCount(id)

  return (
    <>
      <NodeResizeControl
        position="bottom-right"
        minWidth={280}
        minHeight={180}
        maxWidth={1200}
        maxHeight={900}
        className="nodrag nopan nowheel z-40"
      >
        <div
          className={[
            'flex h-6 w-6 items-center justify-center rounded-md border border-amber-300/80 bg-background/95 text-amber-600 shadow-md backdrop-blur-sm',
            'nodrag nopan nowheel',
            selected ? 'opacity-100' : 'pointer-events-none opacity-0'
          ].join(' ')}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.3536 11.3536C11.5488 11.1583 11.5488 10.8417 11.3536 10.6465L4.70711 4L9 4C9.27614 4 9.5 3.77614 9.5 3.5C9.5 3.22386 9.27614 3 9 3L3.5 3C3.36739 3 3.24021 3.05268 3.14645 3.14645C3.05268 3.24022 3 3.36739 3 3.5L3 9.00001C3 9.27615 3.22386 9.50001 3.5 9.50001C3.77614 9.50001 4 9.27615 4 9.00001V4.70711L10.6464 11.3536C10.8417 11.5488 11.1583 11.5488 11.3536 11.3536Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
      </NodeResizeControl>
      <NodeShowLayout
        id={id}
        selected={selected}
        minWidth={280}
        minHeight={180}
        maxWidth={1200}
        maxHeight={900}
        showResizeControl={false}
        className="overflow-hidden border-primary/70 bg-chart-2/10 shadow-primary/40 "
      >
        <div className="relative h-full min-h-[180px] w-full">
          <Card className="h-full min-h-[180px] w-full border-0 bg-transparent shadow-none w-full">
            <CardHeader className="custom-drag-handle cursor-grab px-4 active:cursor-grabbing w-full">
              <CardTitle className="text-sm font-medium flex flex-row  gap-2 justify-between flex-row  w-full">
                <span className="rounded bg-chart-1/10 px-1 py-0.5 text-xs text-primary ">
                  {data.appFilter || 'any'}{data.versionFilter ? `:v${data.versionFilter}` : ''}
                </span>
                <span className="text-primary  flex-grow"></span>
                 <Button variant="outline" size="sm"  onClick={() => setAutoResolvable(!data.autoResolvable, id)}>
              {data.autoResolvable
                ? 'Auto-Resolvable'
                : 'Manual Resolution'}

            </Button>
            <div className="flex items-center justify-center px-2 rounded-lg border border-dashed border-amber-300/80 bg-background/70 text-center text-sm text-muted-foreground ">
                </div>

              </CardTitle>
              <CardDescription className="text-xs">{data.description}</CardDescription>
            </CardHeader>


              <div className="px-4 pb-4">

              </div>

              {agentError && (
                <div className="px-4 pb-4">
                  <div className="flex min-h-[92px] items-center justify-center rounded-lg border border-dashed border-amber-300/80 bg-background/70 text-center text-sm text-muted-foreground dark:border-amber-700/70 dark:bg-background/20">
                    Error fetching agents.
                  </div>
                </div>
              )}

            {subflowChildCount === 0 && (
              <div className="px-4 pb-4">
                <div className="flex min-h-[92px] items-center justify-center rounded-lg border border-dashed border-amber-300/80 bg-background/70 text-center text-sm text-muted-foreground dark:border-amber-700/70 dark:bg-background/20">
                  Click the node to add an implementation.
                </div>
              </div>
            )}
          </Card>
        </div>
      </NodeShowLayout>
    </>
  )
}
