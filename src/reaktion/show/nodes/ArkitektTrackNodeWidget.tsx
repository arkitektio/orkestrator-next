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
import { NodeKind } from "@/rekuest/api/graphql";

export const ArkitektTrackNodeWidget: React.FC<ArkitektNodeProps> = ({
  data,
  id,
  selected,
}) => {
  return (
    <NodeShowLayout
      id={id}
      color={data.nodeKind == NodeKind.Generator ? "pink" : "red"}
      selected={selected}
    >
      {data.ins.map((s, index) => (
        <Popover>
          <Handle
            type="target"
            position={Position.Left}
            id={"arg_" + index}
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
            <Card className="p-3">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  {s?.map((s) => (
                    <>
                      {" "}
                      <h4 className="font-medium leading-none">{s?.key}</h4>
                      <p className="text-sm text-muted-foreground">
                        {s?.identifier}
                      </p>
                    </>
                  ))}
                </div>
              </div>
            </Card>
          </PopoverContent>
        </Popover>
      ))}
      <CardHeader className="p-4">
        <CardTitle>{data?.title}</CardTitle>
        <CardDescription>Card Description</CardDescription>
        <Tooltip></Tooltip>
      </CardHeader>
      {data.outs.map((s, index) => (
        <Popover>
          <Handle
            type="source"
            position={Position.Right}
            id={"return_" + index}
            style={{
              top: "50%",
              cursor: "pointer",
              //boxShadow: "0px 0px 10px #ff1493",
            }}
            data-tip={
              s && s.length > 0
                ? s.map((s) => `${s?.kind} ${s?.key}`).join("|")
                : "Event"
            }
          >
            <PopoverTrigger className="opacity-0 group-hover:opacity-100 transition-opacity easy-in-out duration-300 text-xs p-0 translate-y-[-50%]  translate-x-[-50%] rotate-90 px-3 bg-background">
              ins
            </PopoverTrigger>
          </Handle>

          <PopoverContent side="right" className="ml-1 w-20 bg-background ">
            {" "}
            <Card className="p-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  {s?.map((s) => (
                    <>
                      {" "}
                      <h4 className="font-medium leading-none">{s?.key}</h4>
                      <p className="text-sm text-muted-foreground">
                        Set the dimensions for the layer.
                      </p>
                    </>
                  ))}
                </div>
              </div>
            </Card>
          </PopoverContent>
        </Popover>
      ))}
    </NodeShowLayout>
  );
};
