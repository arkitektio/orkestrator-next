import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ReturnsContainer } from "@/components/widgets/returns/ReturnsContainer";
import { RekuestTask, RekuestImplementation, RekuestAgent } from "@/linkers";
import {
  TaskEventFragment,
  TaskEventKind,
  DetailTaskFragment,
} from "@/rekuest/api/graphql";
import { Clock } from "lucide-react";
import { Fragment, ReactNode, useEffect, useMemo, useState } from "react";
import Timestamp from "react-timestamp";
import { useWidgetRegistry } from "../../widgets/WidgetsContext";
import { deriveLiveState } from "../../hooks/useTasks";
import { isTerminalEvent } from "../../lib/taskTracker";
import {
  TaskStatusIcon,
  formatEventKind,
  statusTheme,
} from "../../lib/taskStatus";
import { TaskStatusLine } from "./TaskStatusLine";

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

const formatWalltime = (task: DetailTaskFragment) => {
  if (!task.finishedAt) return null;
  const seconds =
    (new Date(task.finishedAt).getTime() -
      new Date(task.createdAt).getTime()) /
    1000;
  return `${seconds.toFixed(2)}s`;
};

const formatSeconds = (ms: number) => {
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${Math.floor(seconds % 60)}s`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

/** Ticking elapsed-time readout for a still-running task. */
const ElapsedTime = ({ since }: { since: string }) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-sm font-semibold tabular-nums text-foreground">
      {formatSeconds(Math.max(0, now - new Date(since).getTime()))}
    </span>
  );
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
          {running && <ElapsedTime since={task.createdAt} />}
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

const formatArgValue = (value: unknown): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  return JSON.stringify(value);
};

/**
 * The inputs this task was called with: one row per arg port, matched against
 * the raw `args` map. Rendered as plain text (not assign widgets) so it stays
 * a read-only record of the call.
 */
export const TaskArgsSection = (props: { task: DetailTaskFragment }) => {
  const ports = props.task.action.args;
  if (!ports || ports.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Inputs
      </h3>
      <div className="rounded-md border divide-y">
        {ports.map((port) => {
          const value = props.task.args?.[port.key];
          return (
            <div
              key={port.key}
              className="flex items-baseline gap-4 px-3 py-2 text-sm"
            >
              <div className="w-1/3 min-w-0 shrink-0">
                <div className="truncate font-medium">
                  {port.label || port.key}
                </div>
                {port.identifier && (
                  <div className="truncate font-mono text-[10px] text-muted-foreground">
                    {port.identifier}
                  </div>
                )}
              </div>
              <div
                className={cn(
                  "min-w-0 flex-1 truncate font-mono text-xs",
                  value === null || value === undefined
                    ? "text-muted-foreground"
                    : "text-foreground",
                )}
                title={formatArgValue(value)}
              >
                {formatArgValue(value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * The task's most recent yielded result, surfaced above the event log so the
 * output is visible without scrolling through progress/log noise.
 */
export const TaskResultSection = (props: { task: DetailTaskFragment }) => {
  const { registry } = useWidgetRegistry();
  const latestYield = props.task.events
    .filter((e) => e.kind === TaskEventKind.Yield)
    .at(0);

  if (!latestYield?.returns || props.task.action.returns.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Latest Result
      </h3>
      <div className="rounded-md border bg-muted/40 p-3">
        <ReturnsContainer
          registry={registry}
          ports={props.task.action.returns}
          values={latestYield.returns}
          options={{ labels: true }}
        />
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

export const DefaultRenderer = (props: {
  task: DetailTaskFragment;
}) => {
  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="flex w-full flex-col gap-6 p-4">
        <TaskStatusHero task={props.task} />
        <TaskResultSection task={props.task} />
        <TaskArgsSection task={props.task} />
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
