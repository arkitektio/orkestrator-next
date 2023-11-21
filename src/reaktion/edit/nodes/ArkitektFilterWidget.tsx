import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContextMenuItem } from "@/components/ui/context-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Args } from "@/reaktion/base/Args";
import { Constants } from "@/reaktion/base/Constants";
import { InStream } from "@/reaktion/base/Instream";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import { OutStream } from "@/reaktion/base/Outstream";
import { PortFragment } from "@/rekuest/api/graphql";
import { NodeDescription } from "@jhnnsrs/rekuest-next";
import { GearIcon } from "@radix-ui/react-icons";
import React from "react";
import { ArkitektNodeProps } from "../../types";
import { useEditNodeErrors, useEditRiver } from "../context";

export const ArkitektFilterNodeWidget: React.FC<ArkitektNodeProps> = ({
  data: { ins, outs, constants, ...data },
  id,
  selected,
}) => {
  const { moveConstantToGlobals, moveConstantToStream, moveStreamToConstants, moveOutStreamToVoid, moveVoidtoOutstream} =
    useEditRiver();

  const [expanded, setExpanded] = React.useState(false);

  const onClickIn = (stream_index: number, onposition: number) => {
    moveStreamToConstants(id, stream_index, onposition);
    moveOutStreamToVoid(id, onposition, 0);
  };

  const onToArg = (port: PortFragment) => {
    const index = constants.findIndex((i) => i.key == port.key);
    if (index == -1) {
      return;
    }
    moveConstantToStream(id, index, 0);
    moveVoidtoOutstream(id, index, 0);
  };

  const onToGlobal = (port: PortFragment, key?: string | undefined) => {
    const index = constants.findIndex((i) => i.key == port.key);
    if (index == -1) {
      return;
    }
    moveConstantToGlobals(id, index, key);
  };

  const errors = useEditNodeErrors(id);

  return (
    <NodeShowLayout
      id={id}

      className={cn(
        errors.length > 0
          ? "border-destructive/40 shadow-destructive/30 dark:border-destructive dark:shadow-destructive/20 shadow-xl"
          : "border-gray-800/40 shadow-accent/30 dark:border-accent dark:shadow-accent/20 shadow-xl",
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
        <CardTitle onDoubleClick={() => setExpanded(!expanded)}>
          <div className="flex justify-between">
            <div className="text-xl font-bold"><b>If</b> {data?.title}</div>
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
        {expanded && <div>
          <div className="text-xs text-muted-foreground inline ">Args</div>
          <Args stream={ins.at(0) || []} id={0} onClick={onClickIn} />

          <div className="text-xs text-muted-foreground inline ">Constants</div>
          <Constants
            ports={constants.filter((x) => !(x.key in data.globalsMap))}
            overwrites={data.constantsMap}
            onToArg={onToArg}
            onToGlobal={onToGlobal}
          />
        </div>}
      </CardHeader>
      {outs.map((s, index) => (
        <OutStream stream={s} id={index} length={outs.length} />
      ))}
    </NodeShowLayout>
  );
};
