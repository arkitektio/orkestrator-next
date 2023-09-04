import { Button } from "@/components/ui/button";
import { PortFragment, PortScope } from "@/rekuest/api/graphql";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Args = ({
  stream,
  onClick,
  id,
}: {
  id: number;
  instream: PortFragment[];
  constream: PortFragment[];
  onClick?: (instream: number, onposition: number) => void;
}) => {
  return (
    <>
      <div className="flex flex-row gap-2">
        {stream.length > 0 ? (
          stream?.map((s, index) => (
            <Tooltip delayDuration={100}>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  className="inline my-auto px-2 h-full flex flex-row py-1 disabled:opacity-50"
                  onClick={() => onClick && onClick(id, index)}
                  disabled={s.scope == PortScope.Local && s.nullable == false}
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
                  {s?.key}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-background text-foreground border border-1 border-foreground">
                <p className="text-sm inline">{s?.identifier || s.kind}</p>
                <div className="text-xs mt-0"> {s?.description}</div>
                {s.scope == PortScope.Local && s.nullable == false && (
                  <div className="text-xs mt-0 text-muted-foreground">
                    {" "}
                    Local non-nullable Ports cannot be constants
                  </div>
                )}
              </TooltipContent>
            </Tooltip>
          ))
        ) : (
          <div className="text-sm text-muted-foreground inline">
            No In Stream{" "}
          </div>
        )}
      </div>
    </>
  );
};
