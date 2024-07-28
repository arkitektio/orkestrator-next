import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContextMenuItem } from "@/components/ui/context-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NodeDescription,
  useNodeDescription,
} from "@/lib/rekuest/NodeDescription";
import { cn } from "@/lib/utils";
import { Args } from "@/reaktion/base/Args";
import { Constants } from "@/reaktion/base/Constants";
import { InStream } from "@/reaktion/base/Instream";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import { OutStream } from "@/reaktion/base/Outstream";
import { RekuestMapNodeProps } from "@/reaktion/types";
import { PortFragment } from "@/rekuest/api/graphql";
import { GearIcon } from "@radix-ui/react-icons";
import React from "react";
import { TbBurger } from "react-icons/tb";
import { useEditNodeErrors, useEditRiver } from "../context";

export const DeviceSelector = (props) => {};

export const RekuestMapWidget: React.FC<RekuestMapNodeProps> = ({
  data: { ins, outs, constants, ...data },
  id,
  selected,
}) => {
  const {
    moveConstantToGlobals,
    moveConstantToStream,
    moveStreamToConstants,
    updateData,
  } = useEditRiver();

  const [expanded, setExpanded] = React.useState(false);

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

  const errors = useEditNodeErrors(id);

  const description = useNodeDescription({
    description: data.description,
    variables: data.constantsMap,
  });

  return (
    <NodeShowLayout
      id={id}
      className={cn(
        errors.length > 0
          ? "border-destructive/40 shadow-destructive/30 dark:border-destructive dark:shadow-destructive/20 shadow-xl"
          : "border-blue-400/40 shadow-blue-400/10 dark:border-blue-300 dark:shadow-blue/20 shadow-xl",
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
            {data?.title}
            <div className="group-hover:opacity-100 opacity-0 transition-all duration-3000">
              <Popover>
                <PopoverTrigger className="mr-2">
                  <TbBurger />
                </PopoverTrigger>
                <PopoverContent>
                  <Card>The Card</Card>
                </PopoverContent>
              </Popover>

              <Sheet>
                <SheetTrigger>
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
          </div>
        </CardTitle>
        <CardDescription>
          <NodeDescription description={description} />
        </CardDescription>
        {expanded && (
          <div>
            {ins.at(0) && ins.at(0).length > 0 && (
              <>
                <div className="text-xs text-muted-foreground inline ">
                  Args
                </div>
                <Args
                  instream={ins.at(0) || []}
                  id={0}
                  onClick={onClickIn}
                  constream={[]}
                />
              </>
            )}

            <div className="text-xs text-muted-foreground inline ">
              Constants
            </div>
            <Constants
              ports={constants.filter((x) => !(x.key in data.globalsMap))}
              overwrites={data.constantsMap}
              onToArg={onToArg}
              onToGlobal={onToGlobal}
              onSubmit={(values) => updateData({ constantsMap: values }, id)}
              path={[]}
            />
          </div>
        )}
      </CardHeader>
      {outs.map((s, index) => (
        <OutStream stream={s} id={index} length={outs.length} />
      ))}
    </NodeShowLayout>
  );
};
