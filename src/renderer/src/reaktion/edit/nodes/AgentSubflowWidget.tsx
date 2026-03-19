import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Handle, Position, NodeProps } from '@xyflow/react';
import React from "react";
import { AgentSubFlowNode, AgentSubFlowNodeFragment } from "@/reaktion/api/graphql";
import { AgentSubFlowNodeData } from "../../types";
import { useImplementationsQuery, DetailImplementationFragment, ConstantActionQuery, ConstantActionDocument, AgentFragment } from "@/rekuest/api/graphql";
import { useEditRiver } from "../context";
import { rekuestActionToMatchingNode } from "@/reaktion/plugins/rekuest";
import { useRekuest } from "@/app/Arkitekt";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";

const ImplementationSearch = ({ agentId, onSelect }: { agentId: string, onSelect: (impl: DetailImplementationFragment) => void }) => {
  const { data } = useImplementationsQuery({
    variables: {
      filters: {
        agent: agentId,
      },
    },
  });

  return (
    <Command>
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

type AgentData = AgentSubFlowNodeData & {
  agent?: AgentFragment
};

export const AgentSubflowWidget = ({ data, id }: NodeProps<AgentData>) => {
  const { addNode } = useEditRiver();
  const client = useRekuest();
  const [open , setOpen] = React.useState(false);

  const onSelect = (impl: DetailImplementationFragment) => {
    client &&
      client
        .query<ConstantActionQuery>({
          query: ConstantActionDocument,
          variables: { id: impl.action.id },
        })
        .then(async (event) => {
          if (event.data?.action) {
            const flownode = rekuestActionToMatchingNode(event.data?.action, {
              x: 20, // Relative position inside group
              y: 50, // Relative position inside group
            });

            flownode.parentId = id;
            flownode.extent = "parent";
            flownode.data.binds = {
                ...flownode.data.binds,
                templates: [impl.id],
            }

            addNode(flownode);
          }
        });
  };

  return (
    <NodeShowLayout id={id} selected={false}>
    <Popover open={open} onOpenChange={setOpen}>
      <ContextMenu>
        <ContextMenuTrigger>
          <PopoverTrigger asChild>
            <Card className="w-[300px] min-h-[150px] border-dashed border-2 bg-slate-50 dark:bg-slate-900/50" onClick={() => {console.log("Changing open"); setOpen(!open)}}>
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium flex flex-row items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-1 py-0.5 text-xs">AGENT</span>
                    {data.title}
                </CardTitle>
                <CardDescription className="text-xs truncate">
                    {data.description}
                </CardDescription>
              </CardHeader>
                <Handle type="target" position={Position.Left} className="w-3 h-3 bg-primary" />
                <Handle type="source" position={Position.Right} className="w-3 h-3 bg-primary" />
            </Card>
          </PopoverTrigger>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {/* Optional: Add context menu items here */}
        </ContextMenuContent>
      </ContextMenu>
      <PopoverContent className="w-[300px] h-[200px] p-0">
          {data.agent && <ImplementationSearch agentId={data.agent.id} onSelect={onSelect} />}
          {!data.agent && <div className="p-4 text-sm text-muted-foreground">Agent information not available. Valid for new nodes only.</div>}
      </PopoverContent>
    </Popover>
    </NodeShowLayout>
  );
}
