import React from "react";
import { Handle, Position } from "reactflow";
import { ArkitektNodeProps } from "../../types";
import { NodeShowLayout } from "../layout/NodeShow";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { notEmpty } from "../../utils";
import { Port, PortFragment, StreamItem } from "../../api/graphql";
import { useEditRiver } from "../context";

export const InStream: React.FC<{
  stream: PortFragment[];
  id: number;
  onClick: (instream: number, onposition: number) => {};
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
  onClick: (instream: number, onposition: number) => {};
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

export const ArkitektTrackNodeWidget: React.FC<ArkitektNodeProps> = ({
  data: { instream, outstream, ...data },
  id,
  selected,
}) => {
  const { updateData } = useEditRiver();
  const [unfolded, setUnfolded] = React.useState(false);

  const onClickIn = (stream_index: number, onposition: number) => {
    let item = instream?.[stream_index]?.[onposition] as PortFragment;

    updateData(
      {
        instream:
          instream?.map((s, index) =>
            index == stream_index
              ? s?.filter((i, index) => index != onposition) || []
              : s
          ) || [],
        constream: [[...(data.constream?.at(0) || []), item]],
      },
      id
    );
  };

  const onClickOut = (stream_index: number, onposition: number) => {
    updateData(
      {
        outstream:
          outstream?.map((s, index) =>
            index == stream_index
              ? s?.filter((i, index) => index != onposition) || []
              : s
          ) || [],
      },
      id
    );
  };

  const onClickCon = (stream_index: number, onposition: number) => {
    let item = data.constream?.[stream_index]?.[onposition] as PortFragment;
    updateData(
      {
        constream:
          data.constream?.map((s, index) =>
            index == stream_index
              ? s?.filter((i, index) => index != onposition) || []
              : s
          ) || [],
        instream: [[...(instream?.at(0) || []), item]],
      },
      id
    );
  };

  return (
    <NodeShowLayout
      id={id}
      color={data.kind == "generator" ? "pink" : "red"}
      selected={selected}
    >
      {instream.filter(notEmpty).map((s, index) => (
        <InStream stream={s.filter(notEmpty)} id={index} onClick={onClickIn} />
      ))}
      <CardHeader className="p-4">
        <CardTitle>{data?.name}</CardTitle>
        <CardDescription>{data?.description}</CardDescription>
        {data.constream?.map((s, sindex) => (
          <div className="flex flex-row gap-2 justify-between">
            <div>
              {s?.map((s, index) => (
                <Button onClick={() => onClickCon(sindex, index)}>
                  {s?.key}
                </Button>
              ))}
            </div>
          </div>
        ))}

        <Tooltip></Tooltip>
      </CardHeader>
      {outstream.filter(notEmpty).map((s, index) => (
        <OutStream
          stream={s.filter(notEmpty)}
          id={index}
          onClick={onClickOut}
        />
      ))}
    </NodeShowLayout>
  );
};
