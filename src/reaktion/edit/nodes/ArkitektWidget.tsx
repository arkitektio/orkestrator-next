import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { NodeDescription, useWidgetRegistry } from "@jhnnsrs/rekuest-next";
import { PopoverContent } from "@radix-ui/react-popover";
import React from "react";
import { Handle, Position } from "reactflow";
import { ArkitektNodeProps } from "../../types";
import { notEmpty } from "../../utils";
import { useEditRiver } from "../context";
import { NodeShowLayout } from "../layout/NodeShow";
import {
  NodeKind,
  PortFragment,
  PortsFragmentDoc,
} from "@/rekuest/api/graphql";
import { usePortForm } from "@/rekuest/hooks/usePortForm";

export const InStream: React.FC<{
  stream: PortFragment[];
  id: number;
  onClick: (instream: number, onposition: number) => void;
}> = ({ stream, id, onClick }) => {
  return (
    <Popover>
      <Handle
        type="target"
        position={Position.Left}
        id={"arg_" + id}
        style={{
          top: "50%",
          cursor: "pointer",
          //boxShadow: "0px 0px 10px #ff1493",
        }}
      >
        <PopoverTrigger className="opacity-0 group-hover:opacity-100 transition-opacity easy-in-out duration-300 text-xs p-0 translate-y-[-50%]  translate-x-[-50%] rotate-90 px-3 bg-background">
          ins
        </PopoverTrigger>
      </Handle>

      <PopoverContent side="left" className="mr-2 bg-background ">
        {" "}
        <Card className="p-3 max-w-xs ">
          <div className="grid grid-cols-1 gap-4">
            {stream.length > 0 ? (
              stream?.map((s, index) => (
                <div className="flex flex-row gap-2 justify-between">
                  <div>
                    <h4 className="font-medium leading-none">{s?.key}</h4>
                    <p className="text-sm text-muted-foreground inline">
                      {s?.identifier || s.kind}
                    </p>
                    <div className="text-xs mt-0"> {s?.description}</div>
                  </div>
                  <Button
                    variant="outline"
                    className="inline my-auto px-2 h-full"
                    onClick={() => onClick(id, index)}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground inline">
                No Items in Stream{" "}
              </div>
            )}
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export const OutStream: React.FC<{
  stream: PortFragment[];
  id: number;
  onClick: (instream: number, onposition: number) => void;
}> = ({ stream, id, onClick }) => {
  return (
    <Popover>
      <Handle
        type="source"
        position={Position.Right}
        id={"return_" + id}
        style={{
          top: "50%",
          cursor: "pointer",
          //boxShadow: "0px 0px 10px #ff1493",
        }}
      >
        <PopoverTrigger className="opacity-0 group-hover:opacity-100 transition-opacity easy-in-out duration-300 text-xs p-0 translate-y-[-50%]  translate-x-[-50%] rotate-90 px-3 bg-background">
          outs
        </PopoverTrigger>
      </Handle>

      <PopoverContent side="right" className="ml-2 bg-background ">
        {" "}
        <Card className="p-3  max-w-xs">
          <div className="grid grid-cols-1 gap-4">
            {stream.length > 0 ? (
              stream?.map((s, index) => (
                <div className="flex flex-row flex-row-reverse gap-2 justify-between">
                  <div>
                    <h4 className="font-medium leading-none">{s?.key}</h4>
                    <p className="text-sm text-muted-foreground inline">
                      {s?.identifier}
                    </p>
                    <div className="text-xs mt-0"> {s?.description}</div>
                  </div>
                  <Button
                    variant="outline"
                    className="inline my-auto px-2 h-full"
                    onClick={() => onClick(id, index)}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      className="rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground inline">
                No Stream{" "}
              </div>
            )}
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export const Constants = (props: {
  ports: PortFragment[];
  overwrites: { [key: string]: any };
  onClick: (instream: number, onposition: number) => void;
}) => {
  const form = usePortForm({
    ports: props.ports,
    overwrites: props.overwrites,
  });

  function onSubmit(data: any) {
    console.log(data);
  }

  const { registry } = useWidgetRegistry();

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, () => {
            toast({
              title: "Error",
              description: "Something went wrong",
            });
          })}
          className="space-y-6 mt-4"
        >
          <ArgsContainer registry={registry} ports={props.ports} />
        </form>
      </Form>
    </>
  );
};

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
              : s
          ) || [],
        constants: [...constants, item],
      },
      id
    );
  };

  const onClickOut = (stream_index: number, onposition: number) => {
    updateData(
      {
        outs:
          outs?.map((s, index) =>
            index == stream_index
              ? s?.filter((i, index) => index != onposition) || []
              : s
          ) || [],
      },
      id
    );
  };

  const onClickCon = (onposition: number, to: number) => {
    let item = constants[onposition] as PortFragment;
    updateData(
      {
        constants: constants.filter((i, index) => index != onposition) || [],
        ins: [[...(ins?.at(to) || []), item]],
      },
      id
    );
  };

  return (
    <NodeShowLayout
      id={id}
      color={data.nodeKind == NodeKind.Generator ? "pink" : "red"}
      selected={selected}
    >
      {ins.map((s, index) => (
        <InStream stream={s} id={index} onClick={onClickIn} />
      ))}
      <CardHeader className="p-4">
        <CardTitle>{data?.title}</CardTitle>
        <CardDescription>
          <NodeDescription
            description={data.description}
            variables={data.constantsMap}
          />
        </CardDescription>
        <Constants
          ports={constants}
          overwrites={data.constantsMap}
          onClick={onClickCon}
        />

        <Tooltip></Tooltip>
      </CardHeader>
      {outs.map((s, index) => (
        <OutStream stream={s} id={index} onClick={onClickOut} />
      ))}
    </NodeShowLayout>
  );
};
