import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Activity } from "lucide-react";
import { useMemo } from "react";
import { PostmanAssignationFragment } from "../../api/graphql";
import { useAssignations } from "../../hooks/useAssignations";
import { isTerminalEvent } from "../../lib/assignationTracker";
import { AssignationStatusLine } from "../assignation/AssignationStatusLine";

const isRunning = (a: PostmanAssignationFragment) =>
  !a.isDone && !isTerminalEvent(a.latestEventKind);

const TaskSection = (props: {
  title: string;
  assignations: PostmanAssignationFragment[];
}) => {
  if (props.assignations.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="px-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {props.title}
      </div>
      {props.assignations.map((assignation) => (
        <div
          key={assignation.id}
          className="rounded-md border border-muted-foreground/10 p-2"
        >
          <AssignationStatusLine
            assignation={assignation}
            compact
            showCancel
            showLink
          />
        </div>
      ))}
    </div>
  );
};

/**
 * Navigation-bar entry point for assignation status: shows how many tasks are
 * currently running and opens a panel listing running and recently finished
 * assignations.
 */
export const BackgroundTasksButton = () => {
  const { data } = useAssignations();

  const { running, recent } = useMemo(() => {
    const assignations = (data?.assignations || []).filter(
      (a) => !a.ephemeral,
    );

    return {
      running: assignations
        .filter(isRunning)
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      recent: assignations
        .filter((a) => !isRunning(a))
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 10),
    };
  }, [data?.assignations]);

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-12 w-12"
              aria-label="Background tasks"
            >
              <Activity
                className={
                  running.length > 0
                    ? "w-8 h-8 mx-auto text-foreground animate-pulse"
                    : "w-8 h-8 mx-auto text-foreground"
                }
              />
              {running.length > 0 && (
                <Badge
                  variant="default"
                  className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]"
                >
                  {running.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">Background tasks</TooltipContent>
      </Tooltip>
      <PopoverContent side="right" className="w-80 p-2">
        <ScrollArea className="max-h-96">
          <div className="flex flex-col gap-3">
            <TaskSection title="Running" assignations={running} />
            <TaskSection title="Recent" assignations={recent} />
            {running.length === 0 && recent.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No background tasks yet.
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
