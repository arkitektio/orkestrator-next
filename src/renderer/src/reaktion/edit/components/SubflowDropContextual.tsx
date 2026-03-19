import { useRekuest } from '@/app/Arkitekt'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { rekuestActionToMatchingNode } from '@/reaktion/plugins/rekuest'
import { SubflowDropContextualParams } from '../../types'
import { useEditRiver } from '../context'
import { ContextualContainer } from './ContextualContainer'
import {
  ConstantActionDocument,
  ConstantActionQuery,
  DetailImplementationFragment,
  useImplementationsQuery
} from '@/rekuest/api/graphql'

const ImplementationSearch = ({
  agentId,
  onSelect
}: {
  agentId: string
  onSelect: (impl: DetailImplementationFragment) => void
}) => {
  const { data } = useImplementationsQuery({
    variables: {
      filters: {
        agent: {
          ids: [agentId]
        }
      }
    }
  })

  return (
    <Command className="w-[320px]">
      <CommandInput placeholder="Search implementations..." />
      <CommandList>
        <CommandEmpty>No implementations found.</CommandEmpty>
        <CommandGroup heading="Implementations">
          {data?.implementations.map((impl) => (
            <CommandItem key={impl.id} onSelect={() => onSelect(impl)}>
              {impl.action.name} ({impl.interface})
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export const SubflowDropContextual = (props: {
  params: SubflowDropContextualParams
}) => {
  const client = useRekuest()
  const { addContextualNode } = useEditRiver()

  const agentId = (props.params.subflowNode.data as { agent?: { id?: string } }).agent?.id
  const subflowTitle = props.params.subflowNode.data.title

  if (!agentId) {
    return null
  }

  const handleImplementationSelect = (impl: DetailImplementationFragment) => {
    client &&
      client
        .query({
          query: ConstantActionDocument,
          variables: { id: impl.action.id }
        })
        .then((event: { data?: ConstantActionQuery }) => {
          if (event.data?.action) {
            const flownode = rekuestActionToMatchingNode(event.data.action, {
              x: 0,
              y: 0
            })

            flownode.data.binds = {
              ...flownode.data.binds,
              templates: [impl.id]
            }

            addContextualNode(flownode, props.params)
          }
        })
  }

  return (
    <ContextualContainer
      active={true}
      style={{
        left: props.params.position.x,
        top: props.params.position.y,
        minWidth: 320
      }}
    >
      <div className="mb-2 text-xs text-muted-foreground">
        Add implementation to {subflowTitle}
      </div>
      <ImplementationSearch agentId={agentId} onSelect={handleImplementationSelect} />
    </ContextualContainer>
  )
}
