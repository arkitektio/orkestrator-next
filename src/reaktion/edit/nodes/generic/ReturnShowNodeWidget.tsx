import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { ReturnNodeProps } from "../../../types";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import { InStream } from "@/reaktion/base/Instream";
import { portToLabel } from "@jhnnsrs/rekuest-next";
import { useEditNodeErrors } from "../../context";
import { cn } from "@/lib/utils";

export const ReturnTrackNodeWidget: React.FC<ReturnNodeProps> = ({
  data: { ins },
  id,
  selected,
}) => {
  const [show, setShow] = useState(false);
  const [isSmall, setIsSmall] = useState(true);

  const errors = useEditNodeErrors(id);
  return (
    <>
      <NodeShowLayout
        className={cn(
          errors.length > 0
            ? "border-destructive/40 shadow-destructive/30 dark:border-destructive dark:shadow-destructive/20 shadow-xl"
            : "border-red-400/40 shadow-red-400/20 dark:border-red-300 dark:shadow-red/20 shadow-xl",
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
