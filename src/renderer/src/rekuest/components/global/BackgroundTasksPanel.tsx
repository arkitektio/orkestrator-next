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
import { PostmanTaskFragment } from "../../api/graphql";
import { useTasks } from "../../hooks/useTasks";
import { isTerminalEvent } from "../../lib/taskTracker";
import { TaskStatusLine } from "../task/TaskStatusLine";

const isRunning = (a: PostmanTaskFragment) =>
  !a.isDone && !isTerminalEvent(a.latestEventKind);

const TaskSection = (props: {
  title: string;
  tasks: PostmanTaskFragment[];
}) => {
  if (props.tasks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="px-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {props.title}
      </div>
      {props.tasks.map((task) => (
        <div
          key={task.id}
          className="rounded-md border border-muted-foreground/10 p-2"
        >
          <TaskStatusLine
            task={task}
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
 * Navigation-bar entry point for task status: shows how many tasks are
 * currently running and opens a panel listing running and recently finished
 * tasks.
 */
export const BackgroundTasksButton = () => {
  const { data } = useTasks();

  const { running, recent } = useMemo(() => {
    const tasks = (data?.myTasks || []).filter(
      (a) => !a.ephemeral,
    );

    return {
      running: tasks
        .filter(isRunning)
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      recent: tasks
        .filter((a) => !isRunning(a))
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 10),
    };
  }, [data?.myTasks]);

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
            <TaskSection title="Running" tasks={running} />
            <TaskSection title="Recent" tasks={recent} />
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
