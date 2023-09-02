import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { ReturnNodeProps } from "../../../types";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import { InStream } from "@/reaktion/base/Instream";

export const ReturnTrackNodeWidget: React.FC<ReturnNodeProps> = ({
  data: { ins },
  id,
  selected,
}) => {
  const [show, setShow] = useState(false);
  const [isSmall, setIsSmall] = useState(true);

  return (
    <>
      <NodeShowLayout color="red" id={id} selected={selected}>
        <CardHeader className="p-4 group">
          <CardTitle onDoubleClick={() => setIsSmall(!isSmall)}>
            Outputs{" "}
          </CardTitle>
          <CardDescription>
            {ins
              .at(0)
              ?.map((o) => o?.identifier)
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
