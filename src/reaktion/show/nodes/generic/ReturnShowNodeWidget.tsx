import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import { ReturnNodeProps } from "@/reaktion/types";
import React, { useState } from "react";
import { Handle, Position } from "reactflow";

export const ReturnTrackNodeWidget: React.FC<ReturnNodeProps> = ({
  data: { ins, outs },
  id,
  selected,
}) => {
  const [show, setShow] = useState(false);
  const [isSmall, setIsSmall] = useState(true);

  return (
    <>
      <NodeShowLayout color="red" id={id} selected={selected}>
        <CardHeader className="p-4">
          <CardTitle onDoubleClick={() => setIsSmall(!isSmall)}>
            Inputs{" "}
          </CardTitle>
          <CardDescription>
            {ins[0]?.map((o) => o?.identifier).join(" | ")}
          </CardDescription>
        </CardHeader>
      </NodeShowLayout>
      {outs.map((s, index) => (
        <Handle
          type="target"
          position={Position.Left}
          id={"arg_" + index}
          style={{ background: "#555" }}
        />
      ))}
    </>
  );
};
