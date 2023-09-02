import { Card } from "@/components/ui/card";
import { PortFragment } from "@/rekuest/api/graphql";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Handle, Position } from "reactflow";
import { useState } from "react";
import { PopoverAnchor } from "@radix-ui/react-popover";

export const InStream: React.FC<{
  stream: PortFragment[];
  id: number;
  length: number;
  onClick?: (instream: number, onposition: number) => void;
  open?: boolean | undefined;
}> = ({ stream, id, onClick, length, open }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        id={"arg_" + id}
        className="group-hover:opacity-100 opacity-0 transition-opacity duration-300"
        style={{
          top: `calc(50% + ${(100 / (length - 1)) * id - 50}%)`,
          left: "-10px",
          cursor: "pointer",
          height: "20px",
          width: "18px",
          borderRadius: "3px",
          border: "1px solid hsl(var(--secondary))",
          padding: "4px 4px 4px 4px",
          zIndex: 1,

          //boxShadow: "0px 0px 10px #ff1493",
        }}
      ></Handle>
      <Popover open={open}>
        <PopoverAnchor />

        <PopoverContent side="left" className="mr-2 bg-background ">
          <div className="grid grid-cols-1 gap-4">
            {stream.length > 0 ? (
              stream?.map((s, index) => (
                <div className="flex flex-row gap-2 justify-between">
                  <div className="ml-auto text-right">
                    <h4 className="font-medium leading-none">{s?.key}</h4>
                    <p className="text-sm text-muted-foreground inline">
                      {s?.identifier || s.kind}
                    </p>
                    <div className="text-xs mt-0"> {s?.description}</div>
                  </div>
                  {onClick && (
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
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground inline">
                No In Stream{" "}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
