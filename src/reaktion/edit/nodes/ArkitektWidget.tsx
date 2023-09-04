import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Args } from "@/reaktion/base/Args";
import { Constants } from "@/reaktion/base/Constants";
import { Constream } from "@/reaktion/base/Constream";
import { InStream } from "@/reaktion/base/Instream";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import { OutStream } from "@/reaktion/base/Outstream";
import { NodeKind, PortFragment } from "@/rekuest/api/graphql";
import { NodeDescription } from "@jhnnsrs/rekuest-next";
import React from "react";
import { ArkitektNodeProps } from "../../types";
import { useEditRiver } from "../context";
import { Returns } from "@/reaktion/base/Returns";
import { ContextMenuItem } from "@/components/ui/context-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GearIcon } from "@radix-ui/react-icons";

export const ArkitektTrackNodeWidget: React.FC<ArkitektNodeProps> = ({
  data: { ins, outs, constants, ...data },
  id,
  selected,
}) => {
  const { updateData } = useEditRiver();

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

  const onToArg = (port: PortFragment) => {
    updateData(
      {
        constants: constants.filter((i, index) => i.key != port.key) || [],
        ins: [[...(ins?.at(0) || []), port]],
      },
      id,
    );
  };

  const onToGlobal = (port: PortFragment, key: string) => {
    updateData(
      {
        constants: constants.filter((i, index) => i.key != port.key) || [],
        ins: [[...(ins?.at(to) || []), port]],
      },
      id,
    );
  };

  return (
    <NodeShowLayout
      id={id}
      color={cn(
        data.nodeKind == NodeKind.Generator
          ? "border-pink-500 shadow-pink-500/50 dark:border-pink-200 dark:shadow-pink-200/10 shadow-xxl"
          : "border-pink-500 shadow-pink-500/50 dark:border-pink-200 dark:shadow-pink-200/10 shadow-xxl",
      )}
      selected={selected}
      contextMenu={
        <>
          <ContextMenuItem>Fart</ContextMenuItem>
        </>
      }
    >
      {ins.map((s, index) => (
        <InStream stream={s} id={index} length={ins.length} />
      ))}
      <CardHeader className="p-4">
        <CardTitle>
          <div className="flex justify-between">
            {data?.title}
            <Sheet>
              <SheetTrigger className="group-hover:opacity-100 opacity-0 transition-all duration-3000">
                <GearIcon />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>These are advanced settings</SheetTitle>
                  <SheetDescription>
                    You can change the settings here but be aware that they
                    might smeellll
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </CardTitle>
        <CardDescription>
          <NodeDescription
            description={data.description}
            variables={data.constantsMap}
          />
        </CardDescription>

        <div className="text-xs text-muted-foreground inline ">Args</div>
        <Args stream={ins.at(0) || []} id={0} onClick={onClickIn} />

        <div className="text-xs text-muted-foreground inline ">Constants</div>
        <Constants
          ports={constants}
          overwrites={data.constantsMap}
          onToArg={onToArg}
          onToGlobal={onToGlobal}
        />
      </CardHeader>
      {outs.map((s, index) => (
        <OutStream stream={s} id={index} length={outs.length} />
      ))}
    </NodeShowLayout>
  );
};
