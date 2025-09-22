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
import {
  ActionDescription,
  useActionDescription,
} from "@/lib/rekuest/ActionDescription";
import { cn } from "@/lib/utils";
import { InStream } from "@/reaktion/base/Instream";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import { OutStream } from "@/reaktion/base/Outstream";
import { RekuestMapNodeProps } from "@/reaktion/types";
import { GearIcon } from "@radix-ui/react-icons";
import React from "react";
import { useShowRiver } from "../context";
import { useDependency } from "../hooks/useDependency";

export const RekuestMapWidget: React.FC<RekuestMapNodeProps> = ({
  data: { ins, outs, constants, ...data },
  id,
  selected,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const { template } = useShowRiver();

  const description = useActionDescription({
    description: data.description,
    variables: data.constantsMap,
  });

  const dependency = useDependency(id);

  return (
    <NodeShowLayout
      id={id}
      className={cn(
        !dependency?.resolvable
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
          <ActionDescription description={description} />
        </CardDescription>
        {expanded && <div className="x">{JSON.stringify(dependency)}</div>}
      </CardHeader>
      {outs.map((s, index) => (
        <OutStream stream={s} id={index} length={outs.length} />
      ))}
    </NodeShowLayout>
  );
};
