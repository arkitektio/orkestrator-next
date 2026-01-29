import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContextMenuItem } from "@/components/ui/context-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useActionDescription } from "@/lib/rekuest/ActionDescription";
import { cn } from "@/lib/utils";
import { InStream } from "@/reaktion/base/Instream";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import { OutStream } from "@/reaktion/base/Outstream";
import { GearIcon } from "@radix-ui/react-icons";
import React from "react";
import { RekuestFilterNodeProps } from "../../types";
import { useLatestNodeEvent } from "../hooks/useLatestNodeEvent";

export const RekuestFilterWidget: React.FC<RekuestFilterNodeProps> = ({
  data: { ins, outs, constants, ...data },
  id,
  selected,
}) => {
  const latestEvent = useLatestNodeEvent(id);
  const [expanded, setExpanded] = React.useState(false);

  const description = useActionDescription({
    description: data.description,
    variables: data.constantsMap,
  });

  return (
    <NodeShowLayout
      id={id}
      className={cn(
        "border-gray-800/40 shadow-accent/30 dark:border-accent dark:shadow-accent/20 shadow-xl",
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
          <Card className="absolute top-0 left-[50%] translate-x-[-50%] px-3 translate-y-[-50%] text-sm ">
            Conditional
          </Card>
          <div className="flex justify-between">
            <div className="text-xl font-bold">{data?.title}</div>
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
        <CardDescription>{description}</CardDescription>
        {expanded && (
          <div>
            <div className="text-xs text-muted-foreground inline ">Args</div>
          </div>
        )}
      </CardHeader>
      {outs.map((s, index) => (
        <OutStream stream={s} id={index} length={outs.length} />
      ))}
    </NodeShowLayout>
  );
};
