import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { ReturnNodeProps } from "../../../types";
import { NodeShowLayout } from "../../layout/NodeShow";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export const ReturnTrackNodeWidget: React.FC<ReturnNodeProps> = ({
  data: { outstream, instream },
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
            {instream[0]?.map((o) => o?.identifier).join(" | ")}
          </CardDescription>
        </CardHeader>
      </NodeShowLayout>
      {instream.map((s, index) => (
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
