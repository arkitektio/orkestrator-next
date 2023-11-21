import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PortFragment } from "@/rekuest/api/graphql";
import { portToLabel } from "@jhnnsrs/rekuest-next";
import { useState } from "react";
import { Handle, Position } from "reactflow";

export const OutStream: React.FC<{
  stream: PortFragment[];
  id: number;
  length: number;
  onClick?: (instream: number, onposition: number) => void;
  open?: boolean | undefined;
}> = ({ stream, id, onClick, length, open }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  return (
    <>
      <Handle
        type="source"
        position={Position.Right}
        onMouseEnter={() => setPopoverOpen(true)}
        onMouseLeave={() => setPopoverOpen(false)}
        id={"return_" + id}
        className="group-hover:opacity-100 opacity-0 transition-opacity duration-300"
        style={{
          top: `calc(50% + ${(100 / (length - 1)) * id - 50}%)`,
          right: "-10px",
          cursor: "pointer",
          height: "20px",
          width: "18px",
          borderRadius: "3px",
          border: "1px solid hsl(var(--secondary))",
          padding: "4px",
          zIndex: 1,

          //boxShadow: "0px 0px 10px #ff1493",
        }}
      >
        <Tooltip delayDuration={10} open={popoverOpen}>
          <TooltipTrigger />
          <TooltipContent
            side="top"
            sideOffset={25}
            className="bg-background text-foreground border border-1 border-gray-300"
          >
            <div className="grid grid-cols-1 gap-4">
              {stream.length > 0 ? (
                stream?.map((s, index) => (
                  <div className="flex flex-row gap-2 justify-between">
                    <div className="ml-auto text-right">
                      <h4 className="font-medium leading-none">{s?.key}</h4>
                      <p className="text-sm text-muted-foreground inline">
                        {portToLabel(s)}
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
