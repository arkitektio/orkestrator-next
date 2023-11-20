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
  const { moveConstantToGlobals, moveConstantToStream, moveStreamToConstants } =
    useEditRiver();

  const onClickIn = (stream_index: number, onposition: number) => {
    moveStreamToConstants(id, stream_index, onposition);
  };

  const onToArg = (port: PortFragment) => {
    const index = constants.findIndex((i) => i.key == port.key);
    if (index == -1) {
      return;
    }
    moveConstantToStream(id, index, 0);
  };

  const onToGlobal = (port: PortFragment, key?: string | undefined) => {
    const index = constants.findIndex((i) => i.key == port.key);
    if (index == -1) {
      return;
    }
    moveConstantToGlobals(id, index, key);
  };

  return (
    <NodeShowLayout
      id={id}
      color={cn(
        data.nodeKind == NodeKind.Generator
          ? "border-accent shadow-accent/10 dark:border-accent dark:shadow-accent/20 shadow-xl"
          : "border-accent shadow-accent/10 dark:border-accent dark:shadow-accent/20 shadow-xl",
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
          ports={constants.filter((x) => !(x.key in data.globalsMap))}
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
