import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import React from "react";
import { AgentSubFlownNodeProps } from "../../../types";

export const AgentSubFlowShowNodeWidget: React.FC<AgentSubFlownNodeProps> = ({
  data,
  id,
  selected,
}) => {
  return (
    <NodeShowLayout
      id={id}
      selected={selected}
      minWidth={280}
      minHeight={180}
      maxWidth={1200}
      maxHeight={900}
      showResizeControl={false}
      className="overflow-hidden border-primary/70 bg-chart-2/10 shadow-primary/40"
    >
      <Card className="h-full min-h-[180px] w-full border-0 bg-transparent shadow-none">
        <CardHeader className="px-4">
          <CardTitle className="text-sm font-medium">
            <span className="rounded bg-chart-1/10 px-1 py-0.5 text-xs text-primary">
              {data.appFilter || "any"}
              {data.versionFilter ? `:v${data.versionFilter}` : ""}
            </span>
          </CardTitle>
          <CardDescription className="text-xs">{data.description}</CardDescription>
        </CardHeader>
      </Card>
    </NodeShowLayout>
  );
};
