import { Button } from "@/components/ui/button";
import { PortFragment } from "@/rekuest/api/graphql";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Returns = ({
  stream,
  onClick,
  id,
}: {
  id: number;
  stream: PortFragment[];
  onClick?: (instream: number, onposition: number) => void;
}) => {
  return (
    <div className="flex flex-row gap-2">
      {stream.length > 0 ? (
        stream?.map((s, index) => (
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="outline"
                className="inline my-auto px-2 h-full flex flex-row py-1"
                onClick={() => onClick && onClick(id, index)}
              >
                {s?.key}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm text-muted-foreground inline">
                {s?.identifier || s.kind}
              </p>
              <div className="text-xs mt-0"> {s?.description}</div>
            </TooltipContent>
          </Tooltip>
        ))
      ) : (
        <div className="text-sm text-muted-foreground inline">
          No In Stream{" "}
        </div>
      )}
    </div>
  );
};
