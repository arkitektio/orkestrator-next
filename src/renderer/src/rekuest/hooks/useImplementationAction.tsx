import { formatApolloError } from "@/lib/errorHandler";
import { buildAssignInput } from "@/rekuest/assign";
import { useCallback } from "react";
import {
  AssignInput,
  TaskEventKind,
  DetailImplementationFragment,
  PostmanTaskFragment,
  useAssignMutation,
  useMyTasksQuery,
  useCancelMutation,
  useImplementationQuery,
} from "../api/graphql";

export type ActionAssignVariables = AssignInput;

export type UseImplementationActionReturn<T> = {
  implementation?: DetailImplementationFragment;
  error?: any;
  assign: (
    variables: ActionAssignVariables,
  ) => Promise<PostmanTaskFragment>;
  reassign: () => Promise<PostmanTaskFragment>;
  cancel: () => void;
  tasks?: PostmanTaskFragment[];
  latestTask?: PostmanTaskFragment;
};

export type UseImplementationAction<T> = {
  id: string;
};

export const useImplementationAction = <T extends any>(
  options: UseImplementationAction<T>,
): UseImplementationActionReturn<T> => {
  const { data, variables, refetch, error } = useImplementationQuery({
    variables: {
      id: options.id,
    },
  });

  const { data: tasks_data } = useMyTasksQuery();

  const [postAssign] = useAssignMutation({});
  const [cancelAssign] = useCancelMutation({});

  const tasks = tasks_data?.myTasks.filter(
    (x) => x.implementation?.id == data?.implementation.id,
  );

  const latestTask = data?.implementation.myLatestTask || tasks?.at(0);

  const assign = useCallback(
    async (vars: ActionAssignVariables) => {
      try {
        const mutation = await postAssign({
          variables: {
            input: {
              ...vars,
              implementation: options.id,
              args: vars.args,
              hooks: [],
            },
          },
        });

        const task = mutation.data?.assign;

        if (!task) {
          throw Error("Couldn't assign: no task was returned by the GraphQL API");
        }

        return task;
        } catch (error: unknown) {
          throw Error(`Couldn't assign: ${formatApolloError(error, "rekuest")}`);
      }
    },
    [postAssign, options.id],
  );

  const reassign = useCallback(() => {
    console.log("Not");
    if (!latestTask) {
      throw Error("No latest task");
    }
    return assign(buildAssignInput({
      args: latestTask.args,
      implementation: latestTask?.implementation?.id,
      hooks: [],
    }));
  }, [assign]);

  const cancel = useCallback(async () => {
    if (!latestTask) {
      throw Error("Cannot Reassign");
    }

    if (latestTask.latestEventKind == TaskEventKind.Completed) {
      throw Error("Cannot Cancel as it is done");
    }

    const mutation = await cancelAssign({
      variables: {
        input: { task: latestTask.id },
      },
    });

    const task = mutation.data?.cancel;

    if (!task) {
      console.error(mutation);
      const errorMessages =
        mutation.errors?.map((error) => error.message).join(", ") ||
        "Unknown error";
      throw Error(`Couldn't cancel task: ${errorMessages}`);
    }

    return task;
  }, [cancelAssign, latestTask]);

  return {
    assign,
    reassign,
    latestTask,
    cancel,
    tasks,
    implementation: data?.implementation,
    error,
  };
};
