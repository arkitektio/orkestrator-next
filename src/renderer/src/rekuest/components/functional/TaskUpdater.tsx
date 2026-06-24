import { useRekuest } from "@/app/Arkitekt";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useTask,
  useLiveTask,
} from "@/rekuest/hooks/useTasks";
import { WrappedReturnsContainer } from "@/rekuest/widgets/tailwind";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { X } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import type { ApolloClient } from "@apollo/client";
import {
  PostmanTaskFragment,
  TaskChangeFragment,
  TaskDocument,
  TaskEventChangeFragment,
  TaskEventFragment,
  TaskEventKind,
  TaskQuery,
  TaskQueryVariables,
  TasksDocument,
  TasksQuery,
  useDetailActionQuery,
  WatchMyTasksDocument,
  WatchMyTasksSubscription,
  WatchMyTasksSubscriptionVariables,
} from "../../api/graphql";
import {
  bufferEvent,
  forgetId,
  isTerminalEvent,
  mapReference,
  referenceForId,
  registeredCallbacks,
  takeBufferedEvents,
  taskEventChangeToEvent,
} from "../../lib/taskTracker";
import { TaskStatusLine } from "../task/TaskStatusLine";

export { registeredCallbacks } from "../../lib/taskTracker";

export const DynamicYieldDisplay = (props: {
  values: any[];
  actionId: string;
}) => {
  const { data } = useDetailActionQuery({
    variables: {
      id: props.actionId,
    },
  });

  const { registry } = useWidgetRegistry();

  if (!data) {
    return <> Loaaading </>;
  }

  return (
    <div className="w-full h-full overflow-hidden p-2 flex bg-muted/50 rounded-md border border-muted-foreground/10 flex-col gap-2 items-center justify-center">
      <WrappedReturnsContainer
        ports={data.action.returns}
        values={props.values}
        registry={registry}
        className="p-2"
      />
    </div>
  );
};

export const borderColorForAss = (ass: any) => {
  if (ass.error) {
    return "border-red-500";
  }
  if (ass.cancelled) {
    return "border-orange-500";
  }
  if (ass.done) {
    return "border-green-500";
  }
  if (ass.yield) {
    return "border-blue-500";
  }

  return "border-muted-foreground/10";
};

// Tracks dismissed task ids so their toast isn't re-shown. Bounded with
// FIFO eviction so it doesn't grow unbounded over a long session (one entry would
// otherwise leak per dismissed toast forever).
const MAX_DISMISSED_TOASTS = 200;
const dismissedToasts = new Set<string>();

const rememberDismissed = (id: string) => {
  if (dismissedToasts.size >= MAX_DISMISSED_TOASTS) {
    const oldest = dismissedToasts.values().next().value;
    if (oldest !== undefined) dismissedToasts.delete(oldest);
  }
  dismissedToasts.add(id);
};

const dismissTaskToast = (id: string) => {
  rememberDismissed(id);
  toast.dismiss(id);
};

const showTaskToast = (id: string) => {
  if (dismissedToasts.has(id)) {
    return;
  }
  toast.custom(() => <TaskToast id={id} />, {
    id,
    duration: Infinity, // Dismissal is driven by TaskToast
    dismissible: true,
    onDismiss: () => rememberDismissed(id),
  });
};

export const TaskToast = (props: { id: string }) => {
  const task = useTask({ task: props.id });
  const live = useLiveTask({ task: props.id });

  // Success and cancellation auto-dismiss after a short delay; errors persist
  // until closed via the X button.
  useEffect(() => {
    if (live.done || live.cancelled) {
      const timer = setTimeout(() => {
        dismissTaskToast(props.id);
      }, 3000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [live.done, live.cancelled, props.id]);

  // Sonner measures a toast's height only when the toast itself is updated
  // (its jsx/title props change). Our content re-renders in place as events
  // arrive, so the recorded height goes stale — and hovering, which applies
  // `height: var(--initial-height)`, would visibly resize the toast. Re-issue
  // the toast whenever the rendered layout changes shape to force a
  // re-measure.
  const layoutKey = [
    live.progress != null,
    live.message,
    live.error,
    live.yield != null,
    live.latestEventKind,
  ].join("|");

  useEffect(() => {
    showTaskToast(props.id);
  }, [layoutKey, props.id]);

  if (!task) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative w-[var(--width)] flex flex-col gap-2 rounded-md border bg-background p-3 shadow-lg",
        borderColorForAss(live),
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 text-muted-foreground hover:text-foreground"
        onClick={() => dismissTaskToast(props.id)}
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="pr-7">
        <TaskStatusLine task={task} showCancel showLink />
      </div>

      {live.error && (
        <div className="w-full rounded bg-red-500/10 p-2 text-xs text-red-500">
          {live.error}
        </div>
      )}

      {live.yield && live.actionId && (
        <DynamicYieldDisplay values={live.yield} actionId={live.actionId} />
      )}
    </div>
  );
};

type RekuestClient = ApolloClient<unknown>;

/**
 * Merge a single (synthesized) task event into the normalized `Task:<id>` entity.
 * Works for any cached task — top-level or child — and returns whether the
 * entity existed (so the caller can buffer events that raced ahead of hydration).
 */
const writeEventToCache = (
  client: RekuestClient,
  event: TaskEventChangeFragment,
  synth: TaskEventFragment,
): boolean =>
  client.cache.modify({
    id: client.cache.identify({ __typename: "Task", id: event.task }),
    fields: {
      events(existing, { toReference, readField }) {
        const list: readonly any[] = Array.isArray(existing) ? existing : [];
        if (list.some((ref) => readField("id", ref) === synth.id)) {
          return list;
        }
        const ref = toReference(synth, true);
        return ref ? [ref, ...list] : list;
      },
      latestEventKind: () => event.kind,
      isDone: (prev: boolean) =>
        prev || event.kind === TaskEventKind.Completed,
      finishedAt: (prev: any) =>
        isTerminalEvent(event.kind) ? event.createdAt : prev,
    },
  });

/** Flush events that were buffered before the task was hydrated. */
const flushBufferedEvents = (client: RekuestClient, id: string) => {
  const buffered = takeBufferedEvents(id);
  if (!buffered.length) return;
  const reference = referenceForId(id);
  // Buffered oldest-first; apply in order so the newest ends up at the front.
  for (const change of buffered) {
    writeEventToCache(client, change, taskEventChangeToEvent(change, reference));
  }
};

/**
 * A thin `create` carries only ids, so fetch the full task once and insert it
 * into the global list cache. Returns the hydrated task (for the toast decision).
 */
const hydrateAndInsert = async (
  client: RekuestClient,
  create: TaskChangeFragment,
): Promise<PostmanTaskFragment | undefined> => {
  let task: PostmanTaskFragment | undefined;
  try {
    const result = await client.query<TaskQuery, TaskQueryVariables>({
      query: TaskDocument,
      variables: { id: create.id },
      fetchPolicy: "network-only",
    });
    task = result.data?.task ?? undefined;
  } catch (error) {
    console.error("Failed to hydrate task", create.id, error);
    return undefined;
  }
  if (!task) return undefined;

  // Apply any events that arrived during the hydration round-trip.
  flushBufferedEvents(client, create.id);

  client.cache.updateQuery<TasksQuery>({ query: TasksDocument }, (data) => {
    if (!data) return { tasks: [task!] };
    if (data.tasks.some((t) => t.id === task!.id)) return data;
    return { tasks: data.tasks.concat([task!]) };
  });

  return task;
};

export const TaskUpdater = () => {
  const client = useRekuest();
  useEffect(() => {
    if (!client) return undefined;

    const subscription = client
      .subscribe<WatchMyTasksSubscription, WatchMyTasksSubscriptionVariables>({
        query: WatchMyTasksDocument,
        variables: {},
      })
      .subscribe((res) => {
        const event = res.data?.mytasks.event;
        const create = res.data?.mytasks.create;

        if (event) {
          const reference = referenceForId(event.task);
          const synth = taskEventChangeToEvent(event, reference);

          // Deliver to locally tracking components outside the cache update
          // (cache writes no-op when the entity isn't cached yet).
          if (reference) {
            registeredCallbacks.get(reference)?.(synth);
            if (isTerminalEvent(event.kind)) {
              registeredCallbacks.delete(reference);
              forgetId(event.task);
            }
          }

          const existed = writeEventToCache(client, event, synth);
          if (!existed) {
            // The event arrived before its task was hydrated; replay it once
            // the create/hydration completes.
            bufferEvent(event.task, event);
          }
        }

        if (create) {
          mapReference(create.id, create.reference);

          const existing = client.readQuery<TasksQuery>({
            query: TasksDocument,
          });
          if (existing?.tasks.some((t) => t.id === create.id)) {
            flushBufferedEvents(client, create.id);
            return;
          }

          void hydrateAndInsert(client, create).then((task) => {
            if (!task || task.ephemeral) {
              // Ephemeral tasks do not get a notification.
              return;
            }
            if (
              create.reference &&
              registeredCallbacks.has(create.reference)
            ) {
              // Already tracked locally by a component, skip the global toast.
              return;
            }
            showTaskToast(create.id);
          });
        }
      });

    return () => subscription.unsubscribe();
  }, [client]);

  return <></>;
};
