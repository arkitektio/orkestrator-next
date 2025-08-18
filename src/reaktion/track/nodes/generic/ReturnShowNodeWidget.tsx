import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RunEventKind } from "@/reaktion/api/graphql";
import { InStream } from "@/reaktion/base/Instream";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import { portToLabel } from "@/rekuest/widgets/utils";
import React, { useState } from "react";
import { ReturnNodeProps } from "../../../types";
import { useLatestNodeEvent } from "../../hooks/useLatestNodeEvent";

export const ReturnTrackNodeWidget: React.FC<ReturnNodeProps> = ({
  data: { ins },
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
        <CardHeader className="p-4 group">
          <CardTitle onDoubleClick={() => setIsSmall(!isSmall)}>
            Outputs{" "}
          </CardTitle>
          <CardDescription>
            {ins
              .at(0)
              ?.map((o) => portToLabel(o))
              .join(" | ")}
          </CardDescription>
        </CardHeader>

        {ins.map((s, index) => (
          <InStream stream={s} id={index} length={ins.length} />
        ))}
      </NodeShowLayout>
    </>
  );
};
