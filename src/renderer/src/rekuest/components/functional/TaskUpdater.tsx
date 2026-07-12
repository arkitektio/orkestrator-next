import { useRekuest } from "@/app/Arkitekt";
import { WrappedReturnsContainer } from "@/rekuest/widgets/tailwind";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { useEffect } from "react";
import {
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
  taskEventChangeToEvent,
} from "../../lib/taskTracker";
import {
  flushBufferedEvents,
  hydrateAndInsertMyTask,
  writeTaskEventToCache,
} from "../../lib/taskCache";
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

          const existed = writeTaskEventToCache(client, event, synth);
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

          void hydrateAndInsertMyTask(client, create).then((task) => {
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
