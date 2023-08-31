import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { KwargNodeProps, ReturnNodeProps } from "../../../types";
import { NodeShowLayout } from "../../layout/NodeShow";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export const ConstantShowkNodeWidget: React.FC<KwargNodeProps> = ({
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
            Globals{" "}
          </CardTitle>
          <CardDescription>
            {instream[0]?.map((o) => o?.identifier).join(" | ")}
          </CardDescription>
        </CardHeader>
      </NodeShowLayout>
    </>
  );
};
