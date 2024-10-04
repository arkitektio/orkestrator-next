import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReturnsContainer } from "@/components/widgets/returns/ReturnsContainer";
import { useNodeDescription } from "@/lib/rekuest/NodeDescription";
import { cn } from "@/lib/utils";
import { RunEventKind } from "@/reaktion/api/graphql";
import { InStream } from "@/reaktion/base/Instream";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import { OutStream } from "@/reaktion/base/Outstream";
import { RekuestMapNodeProps } from "@/reaktion/types";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import React from "react";
import { useLatestNodeEvent } from "../hooks/useLatestNodeEvent";

export const RekuestMapWidget: React.FC<RekuestMapNodeProps> = ({
  data: { ins, outs, constants, ...data },
  id,
  selected,
}) => {
  const latestEvent = useLatestNodeEvent(id);
  const [expanded, setExpanded] = React.useState(false);

  const description = useNodeDescription({
    description: data.description,
    variables: data.constantsMap,
  });

  const { registry } = useWidgetRegistry();

  return (
    <NodeShowLayout
      id={id}
      className={cn(
        "border-blue-400/40 shadow-blue-400/10 dark:border-blue-300 dark:shadow-blue/20 shadow-xl",
        latestEvent?.kind === RunEventKind.Error &&
          "border-red-400 dark:border-red-300  dark:shadow-red/20 shadow-red-400/10",
        latestEvent?.kind === RunEventKind.Complete &&
          "border-green-400 dark:border-green-300  dark:shadow-green/20 shadow-green-400/10",
      )}
      selected={selected}
    >
      {ins.map((s, index) => (
        <InStream stream={s} id={index} length={ins.length} />
      ))}
      <CardHeader className="p-3 justify-between flex">
        <CardTitle onDoubleClick={() => setExpanded(!expanded)}>
          <div className="text-left font-semibold text-xs p-1">
            {data.title}
          </div>
          <div className="text-center justify-between">
            {latestEvent && ins && latestEvent.kind === RunEventKind.Next && (
              <ReturnsContainer
                ports={outs.at(0) || []}
                values={
                  outs.at(0)?.reduce(
                    (acc, curr, index) => {
                      acc[curr.key] = latestEvent.value[index];
                      return acc;
                    },
                    {} as { [key: string]: any },
                  ) || {}
                }
                registry={registry}
              />
            )}
            {latestEvent && latestEvent.kind === RunEventKind.Complete && (
              <div className="text-center font-light p-2 ">
                {latestEvent?.kind === RunEventKind.Complete && "✅"}
              </div>
            )}
            {latestEvent && latestEvent.kind === RunEventKind.Error && (
              <div className="text-center font-light p-2 text-red-300">
                {latestEvent?.kind === RunEventKind.Error && "❌"}
              </div>
            )}
            {!latestEvent && (
              <div className="text-center font-light p-2">...</div>
            )}
          </div>
        </CardTitle>
        <CardDescription></CardDescription>
        {expanded && <div>Not implemented yet</div>}
      </CardHeader>
      {outs.map((s, index) => (
        <OutStream stream={s} id={index} length={outs.length} />
      ))}
    </NodeShowLayout>
  );
};
