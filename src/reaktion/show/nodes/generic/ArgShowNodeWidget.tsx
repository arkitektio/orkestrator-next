import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { ArgNodeProps } from "../../../types";

export const ArgTrackNodeWidget: React.FC<ArgNodeProps> = ({
  data: { ins, outs },
  id,
  selected,
}) => {
  const [isSmall, setIsSmall] = useState(true);

  return (
    <>
      <NodeShowLayout color="blue" id={id} selected={selected}>
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
          type="source"
          position={Position.Right}
          id={"return_" + index}
          style={{ background: "#555" }}
        />
      ))}
    </>
  );
};
