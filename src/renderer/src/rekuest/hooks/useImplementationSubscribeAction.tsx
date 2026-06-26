import { useCallback, useState } from "react";
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
  assign: (
    variables: ActionAssignVariables,
  ) => Promise<PostmanTaskFragment>;
  reassign: () => Promise<PostmanTaskFragment>;
  cancel: () => void;
  tasks?: PostmanTaskFragment[];
  causedTask?: PostmanTaskFragment;
};

export type UseImplementationAction<T> = {
  id: string;
};

export const useImplementationSubscribeAction = <T extends any>(
  options: UseImplementationAction<T>,
): UseImplementationActionReturn<T> => {
  const [causedTask, setCausedTask] =
    useState<PostmanTaskFragment | null>(null);

  const { data } = useImplementationQuery({
    variables: {
      ...options,
    },
  });

  const { data: tasks_data } = useMyTasksQuery();

  const [postAssign] = useAssignMutation({});
  const [cancelAssign] = useCancelMutation({});

  const tasks = tasks_data?.myTasks.filter(
    (x) => x.reference == causedTask?.reference,
  );

  const latestTask = tasks?.at(0);

  const assign = useCallback(
    async (vars: ActionAssignVariables) => {
      const mutation = await postAssign({
        variables: {
          input: {
            ...vars,
            args: vars.args,
            hooks: [],
          },
        },
      });

      const task = mutation.data?.assign;

      if (!task) {
        console.error(mutation);
        const errorMessages =
          mutation.errors?.map((error) => error.message).join(", ") ||
          "Unknown error";
        throw Error(`Couldn't assign: ${errorMessages}`);
      }

      setCausedTask(task);
      return task;
    },
    [postAssign],
  );

  const reassign = useCallback(() => {
    console.log("Not");
    if (!causedTask) {
      throw Error("No latest task");
    }
    return assign({
      args: causedTask.args,
      action: latestTask?.action.id,
      hooks: [],
    });
  }, [assign]);

  const cancel = useCallback(async () => {
    if (!causedTask) {
      throw Error("Cannot Reassign");
    }

    if (causedTask.latestEventKind == TaskEventKind.Completed) {
      throw Error("Cannot Cancel as it is done");
    }

    const mutation = await cancelAssign({
      variables: {
        input: { task: causedTask.id },
      },
    });

    const task = mutation.data?.cancel;

    if (!task) {
      console.error(mutation);
      const errorMessages =
        mutation.errors?.map((error) => error.message).join(", ") ||
        "Unknown error";
      throw Error(`Couldn't assign: ${errorMessages}`);
    }

    setCausedTask(null);

    return task;
  }, [cancelAssign, causedTask]);

  return {
    assign,
    reassign,
    causedTask: latestTask,
    cancel,
    tasks,
    implementation: data?.implementation,
  };
};
