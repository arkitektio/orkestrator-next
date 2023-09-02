import React, { memo, useState } from "react";
import { Handle, Position } from "reactflow";
import { ArgNodeProps } from "../../../types";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import { InStream } from "@/reaktion/base/Instream";
import { OutStream } from "@/reaktion/base/Outstream";

export const ArgTrackNodeWidget: React.FC<ArgNodeProps> = ({
  data: { outs, ins },
  id,
  selected,
}) => {
  const [show, setShow] = useState(false);
  const [isSmall, setIsSmall] = useState(true);

  return (
    <>
      <NodeShowLayout color="blue" id={id} selected={selected}>
        <CardHeader className="p-4">
          <CardTitle onDoubleClick={() => setIsSmall(!isSmall)}>
            Inputs{" "}
          </CardTitle>
          <CardDescription>
            {outs
              .at(0)
              ?.map((o) => o?.identifier)
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
