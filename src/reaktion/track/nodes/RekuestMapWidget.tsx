import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { ReturnsContainer } from "@/components/widgets/returns/ReturnsContainer";
import {
  NodeDescription,
  useNodeDescription,
} from "@/lib/rekuest/NodeDescription";
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
      contextMenu={
        <>
          <ContextMenuItem>Fart</ContextMenuItem>
        </>
      }
    >
      {ins.map((s, index) => (
        <InStream stream={s} id={index} length={ins.length} />
      ))}
      <CardHeader className="p-4">
        <CardTitle onDoubleClick={() => setExpanded(!expanded)}>
          <div className="flex justify-between">
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
              <div className="text-center font-light p-5 ">
                Node is complete
              </div>
            )}
            {latestEvent && latestEvent.kind === RunEventKind.Error && (
              <div className="text-center font-light p-5 text-red-300">
                {latestEvent.value}
              </div>
            )}
            {!latestEvent && (
              <div className="text-center font-light p-5">No event yet...</div>
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
