import { useRekuest } from "@/app/Arkitekt";
import { WrappedReturnsContainer } from "@/rekuest/widgets/tailwind";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { useEffect } from "react";
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
  MyTasksDocument,
  MyTasksQuery,
  useDetailActionQuery,
  useMyTasksQuery,
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
import { notify as notifyTask } from "../../lib/taskNotifications";

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
        // Write the nested task back-ref as id-only so Apollo's merge never
        // clobbers the real `reference` already on the normalized Task entity.
        const ref = toReference(
          { ...synth, task: { __typename: "Task", id: event.task } },
          true,
        );
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

  client.cache.updateQuery<MyTasksQuery>(
    { query: MyTasksDocument },
    (data) => {
      if (!data) return { myTasks: [task!] };
      if (data.myTasks.some((t) => t.id === task!.id)) return data;
      return { myTasks: data.myTasks.concat([task!]) };
    },
  );

  return task;
};

export const TaskUpdater = () => {
  const client = useRekuest();

  // The single network query for the global "my tasks" list: TaskUpdater is
  // mounted exactly once at the app root, so this fires once on startup (and on
  // a full reload) to seed the list before any view renders. The subscription
  // below keeps the cache live afterwards, and every consumer reads from cache
  // (`useTasks` is cache-first) so they never re-query and clobber it.
  useMyTasksQuery({ fetchPolicy: "cache-and-network" });

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

          const existing = client.readQuery<MyTasksQuery>({
            query: MyTasksDocument,
          });
          if (existing?.myTasks.some((t) => t.id === create.id)) {
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
              // Already tracked locally by a component, skip the global
              // notification.
              return;
            }
            notifyTask(create.id);
          });
        }
      });

    return () => subscription.unsubscribe();
  }, [client]);

  return <></>;
};
