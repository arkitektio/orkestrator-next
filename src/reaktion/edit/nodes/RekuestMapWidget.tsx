import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { RekuestMapNodeFragment } from "@/reaktion/api/graphql";
import { Args } from "@/reaktion/base/Args";
import { Constants } from "@/reaktion/base/Constants";
import { InStream } from "@/reaktion/base/Instream";
import { NodeShowLayout } from "@/reaktion/base/NodeShow";
import { OutStream } from "@/reaktion/base/Outstream";
import { RekuestMapNodeProps } from "@/reaktion/types";
import {
  PortFragment,
  useTemplateQuery,
  useTemplatesQuery,
} from "@/rekuest/api/graphql";
import { GearIcon } from "@radix-ui/react-icons";
import React, { useCallback } from "react";
import { TbBurger } from "react-icons/tb";
import { useEditNodeErrors, useEditRiver } from "../context";

export const DeviceSelector = (props) => {};

const TemplateSelector = (props: {
  data: RekuestMapNodeFragment;
  bind: (x: string) => void;
}) => {
  const { data } = useTemplatesQuery({
    variables: {
      filters: {
        nodeHash: props.data.hash,
      },
    },
  });

  const templates = data?.templates || [];

  return (
    <div>
      {templates.map((template) => (
        <Button
          onClick={() => props.bind(template.id)}
          data-active={props.data.binds.templates.includes(template.id) && true}
          className=" hover:bg-green-300 data-[active=true]:bg-green-300"
        >
          {template.interface}
        </Button>
      ))}
    </div>
  );
};

export const TemplateTag = (props: { template: string }) => {
  const { data } = useTemplateQuery({
    variables: {
      id: props.template,
    },
  });

  return (
    <div className="px-1 m-2 rounded rounded-md border-gray-200 bg-sidepane border">
      {data?.template?.interface}
    </div>
  );
};

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

  const bind = useCallback(
    (template: string) => {
      if (data.binds?.templates.includes(template)) {
        updateData(
          {
            binds: {
              templates: data.binds.templates.filter((x) => x !== template),
            },
          },
          id,
        );
        return;
      } else {
        updateData(
          { binds: { templates: [...data.binds.templates, template] } },
          id,
        );
      }
    },
    [id, updateData],
  );

  const errors = useEditNodeErrors(id);

  const description = useNodeDescription({
    description: data.description,
    variables: data.constantsMap,
  });

  const bound =
    data.binds?.templates.length == 1 ? data.binds.templates[0] : undefined;

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

      <div className="absolute top-0 left-[50%] translate-y-[-100%] translate-x-[-50%] opacity-0 group-hover:opacity-100">
        {data.binds?.templates.map((template) => (
          <TemplateTag template={template} />
        ))}
      </div>
      <CardHeader className="p-4">
        <CardTitle onDoubleClick={() => setExpanded(!expanded)}>
          <div className="flex justify-between">
            {data?.title}
            <div className="group-hover:opacity-100 opacity-0 transition-all duration-3000">
              <Popover>
                <PopoverTrigger className="mr-2">
                  <TbBurger />
                </PopoverTrigger>
                <PopoverContent className="border-gray-200 ">
                  <TemplateSelector data={data} bind={bind} />
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
              bound={bound}
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
