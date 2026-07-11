import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { buildAssignInput } from "@/rekuest/assign";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  Clock,
  Images
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogButton } from "@/components/ui/dialogbutton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReturnsContainer } from "@/components/widgets/returns/ReturnsContainer";
import { RekuestTask, RekuestImplementation, RekuestAgent } from "@/linkers";
import { useRunForTaskQuery } from "@/reaktion/api/graphql";
import { TrackFlow } from "@/reaktion/track/TrackFlow";
import {
  TaskEventFragment,
  TaskEventKind,
  DetailTaskFragment,
  useCancelMutation,
  useDetailTaskQuery,
  useInterruptMutation,
} from "@/rekuest/api/graphql";
import { ChevronDown } from "lucide-react";
import { Fragment, ReactNode, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Timestamp from "react-timestamp";
import { useAction } from "../hooks/useAction";
import { useWidgetRegistry } from "../widgets/WidgetsContext";
import { ChildTaskUpdater } from "../components/updaters/ChildTaskUpdater";
import { TaskStatusLine } from "../components/task/TaskStatusLine";
import { TaskStatusIcon, formatEventKind } from "../components/hovers/status";
import { deriveLiveState } from "../hooks/useTasks";
import { isTerminalEvent } from "../lib/taskTracker";

export const TaskFlow = (props: {
  id: string;
  task: DetailTaskFragment;
}) => {
  const { data, error, refetch } = useRunForTaskQuery({
    variables: {
      id: props.task.id,
    },
  });

  useEffect(() => {
    if (!error) return;
    console.error(error);
    const t = setTimeout(refetch, 1000);
    return () => clearTimeout(t);
  }, [error]);

  return (
    <>
      {data?.runForTask && (
        <TrackFlow
          run={data.runForTask}
          task={props.task}
        />
      )}
      {error && <div>Error: {error.message}</div>}
    </>
  );
};

type EventTone = "muted" | "success" | "error" | "primary";

const toneDot: Record<EventTone, string> = {
  muted: "bg-muted-foreground/40",
  success: "bg-green-500",
  error: "bg-destructive",
  primary: "bg-primary",
};

/**
 * One full-width row in the event log: a left dot + connector rail, a compact
 * kind/timestamp header, and arbitrary body content. `compact` tightens the
 * spacing for high-frequency system messages (progress / log).
 */
const EventRow = (props: {
  kind: TaskEventKind;
  createdAt: string;
  tone?: EventTone;
  compact?: boolean;
  children?: ReactNode;
}) => {
  const { kind, createdAt, tone = "muted", compact, children } = props;
  return (
    <li className="relative flex w-full gap-3">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "mt-1 h-2 w-2 shrink-0 rounded-full",
            toneDot[tone],
          )}
        />
        <span className="w-px flex-1 bg-border" />
      </div>
      <div className={cn("min-w-0 flex-1", compact ? "pb-2" : "pb-4")}>
        <div className="flex items-center gap-2 text-[11px] leading-none text-muted-foreground">
          <span className="font-medium uppercase tracking-wide text-foreground/60">
            {formatEventKind(kind)}
          </span>
          <Timestamp date={createdAt} relative />
        </div>
        {children != null && <div className="mt-1.5">{children}</div>}
      </div>
    </li>
  );
};

export const LogItem = (props: { event: TaskEventFragment }) => {
  return (
    <EventRow kind={props.event.kind} createdAt={props.event.createdAt} compact>
      <div className="flex items-center gap-2">
        {props.event.progress != null && (
          <>
            <Progress value={props.event.progress} className="h-1 w-24" />
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {props.event.progress}%
            </span>
          </>
        )}
        {props.event.message && (
          <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
            {props.event.message}
          </p>
        )}
      </div>
    </EventRow>
  );
};

export const DelegateItem = (props: { event: TaskEventFragment }) => {
  const { delegatedTo } = props.event;
  return (
    <EventRow
      kind={props.event.kind}
      createdAt={props.event.createdAt}
      tone="primary"
      compact
    >
      <p className="text-xs text-muted-foreground">
        Delegated to {delegatedTo?.implementation.action.name}
        {delegatedTo && (
          <RekuestTask.DetailLink
            object={delegatedTo}
            className="ml-1 font-medium text-foreground underline-offset-2 hover:underline"
          >
            (details)
          </RekuestTask.DetailLink>
        )}
      </p>
    </EventRow>
  );
};

export const YieldItem = (props: {
  task: DetailTaskFragment;
  event: TaskEventFragment;
}) => {
  const { registry } = useWidgetRegistry();

  return (
    <EventRow
      kind={props.event.kind}
      createdAt={props.event.createdAt}
      tone="success"
    >
      <div className="w-full rounded-md border bg-muted/40 p-3">
        <ReturnsContainer
          registry={registry}
          ports={props.task.action.returns}
          values={props.event.returns}
          options={{ labels: true }}
        />
      </div>
    </EventRow>
  );
};

export const ErrorItem = (props: {
  task: DetailTaskFragment;
  event: TaskEventFragment;
}) => {
  return (
    <EventRow
      kind={props.event.kind}
      createdAt={props.event.createdAt}
      tone="error"
    >
      <div className="w-full rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
        {props.event.message}
      </div>
    </EventRow>
  );
};

export const ChildTasksSection = (props: {
  task: DetailTaskFragment;
}) => {
  const children = (props.task.children ?? [])
    .slice()
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  if (children.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Child Tasks ({children.length})
      </h3>
      <div className="flex flex-col gap-2">
        {children.map((child) => (
          <div
            key={child.id}
            className="rounded-md border border-muted-foreground/10 p-2"
          >
            <TaskStatusLine task={child} compact showLink />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Maps a task's terminal/running state to a subtle color theme for the hero
 * panel, reusing the same status vocabulary as {@link TaskStatusIcon}.
 */
const statusTheme = (task: DetailTaskFragment) => {
  const kind = task.latestEventKind;
  if (task.isDone || kind === TaskEventKind.Completed) {
    return {
      ring: "ring-green-500/20",
      bg: "bg-green-500/5",
      text: "text-green-600 dark:text-green-400",
      label: "Completed",
    };
  }
  if (kind === TaskEventKind.Failed || kind === TaskEventKind.Critical) {
    return {
      ring: "ring-destructive/20",
      bg: "bg-destructive/5",
      text: "text-destructive",
      label: formatEventKind(kind),
    };
  }
  if (
    kind === TaskEventKind.Cancelled ||
    kind === TaskEventKind.Cancelling ||
    kind === TaskEventKind.Interrupted ||
    kind === TaskEventKind.Interrupting
  ) {
    return {
      ring: "ring-muted-foreground/20",
      bg: "bg-muted/40",
      text: "text-muted-foreground",
      label: formatEventKind(kind),
    };
  }
  return {
    ring: "ring-primary/20",
    bg: "bg-primary/5",
    text: "text-primary",
    label: formatEventKind(kind),
  };
};

const formatWalltime = (task: DetailTaskFragment) => {
  if (!task.finishedAt) return null;
  const seconds =
    (new Date(task.finishedAt).getTime() -
      new Date(task.createdAt).getTime()) /
    1000;
  return `${seconds.toFixed(2)}s`;
};

/**
 * At-a-glance status panel: status icon + label, reference, live progress,
 * latest message / error, timing, and the implementation / agent / lineage
 * context — everything you'd otherwise have to hunt for in the event log.
 */
export const TaskStatusHero = (props: { task: DetailTaskFragment }) => {
  const { task } = props;
  const live = useMemo(() => deriveLiveState(task), [task]);
  const theme = statusTheme(task);
  const running = !task.isDone && !isTerminalEvent(task.latestEventKind);
  const walltime = formatWalltime(task);
  const agent = task.implementation.agent;

  return (
    <div className={cn("rounded-xl border p-5 ring-1", theme.ring, theme.bg)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <TaskStatusIcon
            kind={task.latestEventKind}
            isDone={task.isDone}
            className="h-8 w-8 shrink-0"
          />
          <div className="min-w-0">
            <div className={cn("text-lg font-semibold leading-tight", theme.text)}>
              {theme.label}
            </div>
            {task.reference && (
              <div className="truncate font-mono text-xs text-muted-foreground">
                {task.reference}
              </div>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Started&nbsp;<Timestamp date={task.createdAt} relative />
          </div>
          {task.finishedAt && (
            <div>
              Finished&nbsp;<Timestamp date={task.finishedAt} relative />
            </div>
          )}
          {walltime && (
            <div className="text-sm font-semibold text-foreground">{walltime}</div>
          )}
        </div>
      </div>

      {running && (
        <div className="mt-4">
          {live.progress != null ? (
            <div className="flex items-center gap-2">
              <Progress value={live.progress} className="h-1.5 flex-1" />
              <span className="w-9 text-right text-xs text-muted-foreground">
                {live.progress}%
              </span>
            </div>
          ) : (
            <div className="h-1.5 w-full animate-pulse rounded-full bg-primary/30" />
          )}
        </div>
      )}

      {live.error ? (
        <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {live.error}
        </div>
      ) : (
        live.message && (
          <p className="mt-3 text-sm text-muted-foreground">{live.message}</p>
        )
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3 text-xs">
        <RekuestImplementation.DetailLink object={task.implementation}>
          <Badge variant="outline" className="cursor-pointer font-mono">
            {task.implementation.interface}
          </Badge>
        </RekuestImplementation.DetailLink>
        {agent && (
          <RekuestAgent.DetailLink object={agent}>
            <Badge variant="secondary" className="cursor-pointer">
              {agent.name}
            </Badge>
          </RekuestAgent.DetailLink>
        )}
        {task.parent && (
          <RekuestTask.DetailLink object={task.parent}>
            <Badge variant="outline" className="cursor-pointer">
              ← Parent task
            </Badge>
          </RekuestTask.DetailLink>
        )}
        {task.children && task.children.length > 0 && (
          <Badge variant="outline">
            {task.children.length} child{task.children.length === 1 ? "" : "ren"}
          </Badge>
        )}
      </div>
    </div>
  );
};

export const DefaultRenderer = (props: {
  task: DetailTaskFragment;
}) => {
  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="flex w-full flex-col gap-6 p-4">
        <TaskStatusHero task={props.task} />
        <ChildTasksSection task={props.task} />
        {props.task.events.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Event Log
            </h3>
            <TaskTimeLine task={props.task} />
          </div>
        )}
      </div>
    </div>
  );
};

export const TaskTimeLine = (props: {
  task: DetailTaskFragment;
}) => {
  return (
    <ol className="flex w-full flex-col">
      {props.task?.events.map((e) => (
        <Fragment key={e.id}>
          {e.kind === TaskEventKind.Yield && (
            <YieldItem task={props.task} event={e} />
          )}
          {e.kind === TaskEventKind.Delegate && (
            <DelegateItem event={e} />
          )}

          {e.kind === TaskEventKind.Failed && (
            <ErrorItem task={props.task} event={e} />
          )}

          {e.kind === TaskEventKind.Critical && (
            <ErrorItem task={props.task} event={e} />
          )}

          {[
            TaskEventKind.Log,
            TaskEventKind.Progress,
          ].includes(e.kind) && <LogItem event={e} />}
        </Fragment>
      ))}
    </ol>
  );
};

export const useReassign = ({
  task,
}: {
  task: DetailTaskFragment;
}) => {
  const { assign } = useAction({
    id: task?.implementation.id || "",
  });
  const navigate = useNavigate();

  const reassign = async (options?: { capture: boolean }) => {
    const x = await assign(buildAssignInput({
      args: task.args,
      implementation: task?.implementation.id || "",
      dependencies: task.dependencies,
      hooks: [],
      capture: options?.capture || false,
    }));

    navigate(RekuestTask.linkBuilder(x.id));
  };

  return reassign;
};

export const isCancalable = (task: DetailTaskFragment) => {
  return task.isDone !== true;
};
export const isInterruptable = (task: DetailTaskFragment) => {
  return task.isDone !== true;
};




export const TaskStatsSidebar = (props: { task: DetailTaskFragment }) => {


  // Calculate additional metrics from available data
  const endTime = props.task.finishedAt
  const startTime = props.task.createdAt;

  const statsCards = [
    {
      title: "Total Waltime",
      value: !endTime ? "..." : `${((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000).toFixed(2)}s`,
      description: "Total walltime taken for this task",
      icon: Images,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Task Overview</h2>
        <p className="text-sm text-muted-foreground">
          Some basic statistics about this task.
        </p>
      </div>
      {statsCards.map((card) => (
        <div
          key={card.title}
          className="p-4 rounded-lg border dark:border-gray-700 flex items-center gap-4"
        >
          <div
            className={`p-3 rounded-lg ${card.bgColor} ${card.color}`}
          >
            <card.icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{card.title}</p>
            <p className="text-2xl font-semibold">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TPage = asDetailQueryRoute(
  useDetailTaskQuery,
  ({ data }) => {
    const reassign = useReassign({ task: data.task });

    const [cancel, _] = useCancelMutation();
    const [interrupt, __] = useInterruptMutation();

    return (
      <RekuestTask.ModelPage
        title={
          <div className="flex flex-row gap-2">
            {data?.task?.action.name}
            <p className="text-md font-light text-muted-foreground">
              <Timestamp date={data.task.createdAt} relative />
            </p>
          </div>
        }
        additionalSidebars={{ "Stats": <TaskStatsSidebar task={data.task} /> }}
        object={data.task}
        pageActions={
          <div className="flex gap-2">
            <RekuestTask.DetailLink
              object={data?.task}
              subroute="log"
              className="font-semibold"
            >
              <Button
                variant={"outline"}
                size={"sm"}
              >
                Logs
              </Button>
            </RekuestTask.DetailLink>
            <RekuestTask.DetailLink
              object={data?.task}
              subroute="timeline"
              className="font-semibold"
            >
              <Button
                variant={"outline"}
                size={"sm"}
              >
                Timeline
              </Button>
            </RekuestTask.DetailLink>
            <RekuestTask.DetailLink
              object={data?.task}
              subroute="space"
              className="font-semibold"
            >
              <Button
                variant={"outline"}
                size={"sm"}
              >
                Space
              </Button>
            </RekuestTask.DetailLink>
            {data.task.parent && <RekuestTask.DetailLink
              object={data?.task?.parent}
              subroute="log"
              className="font-semibold"
            >
              <Button
                variant={"outline"}
                size={"sm"}
              >
                Logs
              </Button>
            </RekuestTask.DetailLink>}
            <div className="flex">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => {
                  reassign();
                }}
                className="rounded-r-none"
              >
                Rerun
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="rounded-l-none border-l-0 px-2"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      reassign({ capture: true });
                    }}
                  >
                    Rerun with Capture
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {isCancalable(data.task) && (
              <Button
                onClick={() =>
                  cancel({
                    variables: { input: { task: data.task.id } },
                  })
                }
                variant={"destructive"}
                size={"sm"}
              >
                Cancel
              </Button>
            )}
            {isInterruptable(data.task) && (
              <Button
                onClick={() =>
                  interrupt({
                    variables: { input: { task: data.task.id } },
                  })
                }
                variant={"destructive"}
                size={"sm"}
              >
                Interrupt
              </Button>
            )}

            <DialogButton name="reportbug" variant="outline" size="sm"
              dialogProps={{ taskId: data?.task.id }}
            >
              Report Bug
            </DialogButton>
          </div>
        }
      >
        <div className="flex h-full w-full relative">
          <ChildTaskUpdater taskId={data.task.id} />
          {data?.task?.implementation?.higherOrderFor?.action?.interfaces?.includes(
            "run_flow",
          ) ? (
            <>
              <Tabs className="flex-grow flex flex-col " defaultValue="flow">
                <TabsList className="h-8 flex-initial">
                  <TabsTrigger value="flow">Flow</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="flow" className="flex-grow">
                  <TaskFlow
                    id={data?.task?.implementation?.interface}
                    task={data.task}
                  />
                </TabsContent>
                <TabsContent value="logs" className="h-full w-full">
                  <TaskTimeLine task={data?.task} />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <DefaultRenderer task={data?.task} />
          )}
        </div>
      </RekuestTask.ModelPage>
    );
  },
);


export default TPage;
