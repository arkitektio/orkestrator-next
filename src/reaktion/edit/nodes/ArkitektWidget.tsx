import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { Constants } from "@/reaktion/base/Constants";
import { InStream } from "@/reaktion/base/Instream";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import { OutStream } from "@/reaktion/base/Outstream";
import { NodeKind, PortFragment } from "@/rekuest/api/graphql";
import { NodeDescription } from "@jhnnsrs/rekuest-next";
import React, { useEffect } from "react";
import { ArkitektNodeProps } from "../../types";
import { useEditRiver } from "../context";
import { Constream } from "@/reaktion/base/Constream";
import { useUpdateNodeInternals } from "reactflow";

export const ArkitektTrackNodeWidget: React.FC<ArkitektNodeProps> = ({
  data: { ins, outs, constants, ...data },
  id,
  selected,
}) => {
  const { updateData } = useEditRiver();

  const [open, setOpen] = React.useState<boolean | undefined>(undefined);

  const onClickIn = (stream_index: number, onposition: number) => {
    let item = ins?.[stream_index]?.[onposition] as PortFragment;

    updateData(
      {
        ins:
          ins.map((s, index) =>
            index == stream_index
              ? s?.filter((i, index) => index != onposition) || []
              : s,
          ) || [],
        constants: [...constants, item],
      },
      id,
    );
  };

  const onClickOut = (stream_index: number, onposition: number) => {
    updateData(
      {
        outs:
          outs?.map((s, index) =>
            index == stream_index
              ? s?.filter((i, index) => index != onposition) || []
              : s,
          ) || [],
      },
      id,
    );
  };

  const onClickCon = (onposition: number, to: number) => {
    let item = constants[onposition] as PortFragment;
    updateData(
      {
        constants: constants.filter((i, index) => index != onposition) || [],
        ins: [[...(ins?.at(to) || []), item]],
      },
      id,
    );
  };

  return (
    <NodeShowLayout
      id={id}
      color={data.nodeKind == NodeKind.Generator ? "pink" : "red"}
      selected={selected}
    >
      {ins.map((s, index) => (
        <InStream
          stream={s}
          id={index}
          onClick={onClickIn}
          length={ins.length}
          open={open}
        />
      ))}
      <CardHeader
        className="p-4"
        onDoubleClick={() =>
          open == undefined ? setOpen(true) : setOpen(undefined)
        }
      >
        <CardTitle>{data?.title}</CardTitle>
        <CardDescription>
          <NodeDescription
            description={data.description}
            variables={data.constantsMap}
          />
        </CardDescription>
      </CardHeader>
      {outs.map((s, index) => (
        <OutStream
          stream={s}
          id={index}
          onClick={onClickOut}
          length={ins.length}
          open={open}
        />
      ))}

      <Constream
        constants={constants}
        onClick={(e) => onClickCon(e, 0)}
        constantsMap={data.constantsMap}
        open={open}
      />
    </NodeShowLayout>
  );
};
