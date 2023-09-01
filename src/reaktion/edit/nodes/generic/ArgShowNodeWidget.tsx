import React, { memo, useState } from "react";
import { Handle, Position } from "reactflow";
import { ArgNodeProps } from "../../../types";
import { NodeShowLayout } from "../../layout/NodeShow";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
