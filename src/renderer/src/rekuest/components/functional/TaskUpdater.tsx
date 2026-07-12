import { useRekuest } from "@/app/Arkitekt";
import { useEffect } from "react";
import {
  MyTasksDocument,
  MyTasksQuery,
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
