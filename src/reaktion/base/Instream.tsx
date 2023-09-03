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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const InStream: React.FC<{
  stream: PortFragment[];
  id: number;
  length: number;
}> = ({ stream, id, length }) => {

  const [popoverOpen, setPopoverOpen] = useState(false);
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onMouseEnter={() => setPopoverOpen(true)}
        onMouseLeave={() => setPopoverOpen(false)}
        id={"arg_" + id}
        className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 bg-gray-200"
        style={{
          top: `calc(50% + ${(100 / (length - 1)) * id - 50}%)`,
          left: "-10px",
          cursor: "pointer",
          height: "20px",
          width: "18px",
          borderRadius: "3px",
          border: "10px solid hsl(var(--secondary))",

          //boxShadow: "0px 0px 10px #ff1493",
        }}
      ><Tooltip delayDuration={10} open={popoverOpen} >
      <TooltipTrigger/>
    <TooltipContent side="top" sideOffset={25} className="bg-background text-foreground border border-1 border-foreground" >
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
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground inline">
            No In Stream{" "}
          </div>
        )}
      </div>
      </TooltipContent>
      </Tooltip>
      </Handle>
      </>
  );
};
