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
import { Handle, Position, NodeProps } from '@xyflow/react';
import React from "react";
import { AgentSubFlowNode } from "@/reaktion/api/graphql";

export const AgentSubflowWidget = ({ data, id }: NodeProps<AgentSubFlowNode>) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className="w-[300px] border-dashed border-2 bg-slate-50 dark:bg-slate-900/50">
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
      </ContextMenuTrigger>
      <ContextMenuContent>

      </ContextMenuContent>
    </ContextMenu>
  );
};
