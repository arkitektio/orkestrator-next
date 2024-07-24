import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import { OutStream } from "@/reaktion/base/Outstream";
import { portToLabel } from "@/rekuest/widgets/utils";
import React, { useState } from "react";
import { ArgNodeProps } from "../../../types";
import { useLatestNodeEvent } from "../../hooks/useLatestNodeEvent";
import { RunEventKind } from "@/reaktion/api/graphql";

export const ArgTrackNodeWidget: React.FC<ArgNodeProps> = ({
  data: { outs, ins },
  id,
  selected,
}) => {
  const latestEvent = useLatestNodeEvent(id);
  const [show, setShow] = useState(false);
  const [isSmall, setIsSmall] = useState(true);

  return (
    <>
      <NodeShowLayout
        className={cn(
          "border-blue-400/40 shadow-blue-400/10 dark:border-blue-300 dark:shadow-blue/20 shadow-xl",
          latestEvent?.kind === RunEventKind.Error &&
            "border-red-400 dark:border-red-300  dark:shadow-red/20 shadow-red-400/10",
          latestEvent?.kind === RunEventKind.Complete &&
            "border-green-400 dark:border-green-300  dark:shadow-green/20 shadow-green-400/10",
        )}
        id={id}
        selected={selected}
      >
        <CardHeader className="p-4">
          <CardTitle onDoubleClick={() => setIsSmall(!isSmall)}>
            Inputs {latestEvent?.kind === RunEventKind.Complete && "✅"}
          </CardTitle>
          <CardDescription>
            {outs
              .at(0)
              ?.map((o) => portToLabel(o))
              .join(" | ")}
          </CardDescription>
        </CardHeader>

        {outs.map((s, index) => (
          <OutStream stream={s} id={index} length={outs.length} />
        ))}
      </NodeShowLayout>
    </>
  );
};
