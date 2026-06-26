import { useRekuest } from "@/app/Arkitekt";
import {
  DetailTaskDocument,
  DetailTaskQuery,
  TaskChangeFragment,
  TaskDocument,
  TaskQuery,
  TaskQueryVariables,
  useDetailTaskQuery,
  WatchChildTasksDocument,
  WatchChildTasksSubscription,
  WatchChildTasksSubscriptionVariables,
} from "@/rekuest/api/graphql";
import { mapReference } from "@/rekuest/lib/taskTracker";
import type { ApolloClient } from "@apollo/client";
import { useEffect } from "react";

type RekuestClient = ApolloClient<unknown>;

/**
 * A child `update` is a non-traversable `TaskChange` (`__typename: "TaskChange"`),
 * so it does NOT auto-normalize into the `Task:<id>` entity. Write its hot
 * scalars onto the normalized task explicitly — the DetailTask `children`
 * reference that entity, so the timeline updates in place.
 */
const applyChildScalars = (client: RekuestClient, change: TaskChangeFragment) => {
  client.cache.modify({
    id: client.cache.identify({ __typename: "Task", id: change.id }),
    fields: {
      latestEventKind: () => change.latestEventKind,
      isDone: () => change.isDone,
      finishedAt: () => change.finishedAt ?? null,
    },
  });
};

/**
 * A new child arrives non-traversable, so fetch its full graph once and append
 * it to the parent's `children`. Timeline/store readers need the full child.
 */
const hydrateChild = async (
  client: RekuestClient,
  childId: string,
  parentId: string,
) => {
  let child;
  try {
    const res = await client.query<TaskQuery, TaskQueryVariables>({
      query: TaskDocument,
      variables: { id: childId },
      fetchPolicy: "network-only",
    });
    child = res.data?.task;
  } catch (error) {
    console.error("Failed to hydrate child task", childId, error);
    return;
  }
  if (!child) return;

  client.cache.updateQuery<DetailTaskQuery>(
    { query: DetailTaskDocument, variables: { id: parentId } },
    (prev) => {
      if (!prev?.task) return prev;
      if ((prev.task.children || []).some((c) => c.id === child.id)) {
        return prev;
      }
      return {
        ...prev,
        task: {
          ...prev.task,
          children: [...(prev.task.children || []), child],
        },
      };
    },
  );
};

export const ChildTaskUpdater = (props: { taskId: string }) => {
  const { taskId } = props;
  const client = useRekuest();
  const { subscribeToMore } = useDetailTaskQuery({ variables: { id: taskId } });

  useEffect(() => {
    if (!client) return undefined;
    const unsubscribe = subscribeToMore<
      WatchChildTasksSubscription,
      WatchChildTasksSubscriptionVariables
    >({
      document: WatchChildTasksDocument,
      variables: { parentId: taskId },
      updateQuery: (prev, { subscriptionData }) => {
        const change = subscriptionData.data?.childTasks;
        if (!change) return prev;

        if (change.update) {
          mapReference(change.update.id, change.update.reference);
          applyChildScalars(client, change.update);
          return prev;
        }

        if (change.create) {
          mapReference(change.create.id, change.create.reference);
          // Hydrate + append asynchronously; the cache write updates the query.
          void hydrateChild(client, change.create.id, taskId);
          return prev;
        }

        return prev;
      },
    });
    return () => {
      unsubscribe();
    };
  }, [taskId, subscribeToMore, client]);

  return <> </>;
};
