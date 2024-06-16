import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import { OutStream } from "@/reaktion/base/Outstream";
import { portToLabel } from "@jhnnsrs/rekuest-next";
import React, { useState } from "react";
import { ArgNodeProps } from "../../../types";
import { useEditNodeErrors } from "../../context";

export const ArgTrackNodeWidget: React.FC<ArgNodeProps> = ({
  data: { outs, ins },
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
            : "border-blue-400/40 shadow-blue-400/10 dark:border-blue-300 dark:shadow-blue/20 shadow-xl",
        )}
        id={id}
        selected={selected}
      >
        <CardHeader className="p-4">
          <CardTitle onDoubleClick={() => setIsSmall(!isSmall)}>
            Inputs{" "}
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
