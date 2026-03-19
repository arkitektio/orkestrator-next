import { NodeContextualParams } from "../../types";
import { useEditRiver } from "../context";
import { ContextualContainer } from "./ContextualContainer";
import { DetailImplementationFragment, useImplementationsQuery, ConstantActionDocument, ConstantActionQuery } from "@/rekuest/api/graphql";
import { rekuestActionToMatchingNode } from "@/reaktion/plugins/rekuest";
import { useRekuest } from "@/app/Arkitekt";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const ImplementationSearch = ({ agentId, onSelect }: { agentId: string, onSelect: (impl: DetailImplementationFragment) => void }) => {
  const { data } = useImplementationsQuery({
    variables: {
      filters: {
        agent: {
          ids: [agentId],
        },
      },
    },
  });

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
  );
};

export const NodeContextual = (props: { params: NodeContextualParams }) => {
  const { clearPanels, addNode, nodes } = useEditRiver();
  const client = useRekuest();

  const handleImplementationSelect = (impl: DetailImplementationFragment) => {
    client &&
      client
        .query({
          query: ConstantActionDocument,
          variables: { id: impl.action.id },
        })
        .then((event: { data?: ConstantActionQuery }) => {
          if (event.data?.action) {
            const flownode = rekuestActionToMatchingNode(event.data?.action, {
              x: 20,
              y: 50,
            });

            flownode.parentId = props.params.nodeId;
            flownode.extent = "parent";
            flownode.data.binds = {
              ...flownode.data.binds,
              templates: [impl.id],
            };

            addNode(flownode);
            clearPanels();
          }
        });
  };

  return (
    <ContextualContainer
      active={true}
      style={{
        left: props.params.position.x,
        top: props.params.position.y,
        minWidth: 320,
      }}
    >
      {props.params.action.type === "implementations" && (
        <ImplementationSearch 
          agentId={props.params.action.agentId} 
          onSelect={handleImplementationSelect} 
        />
      )}
    </ContextualContainer>
  );
};
