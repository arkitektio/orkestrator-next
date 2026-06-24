import { useCallback } from "react";
import {
  AssignActionQuery,
  TaskEventKind,
  AssignInput,
  PostmanTaskFragment,
  useAssignActionQuery,
  useMyTasksQuery,
  useAssignMutation,
  useCancelMutation,
} from "../api/graphql";

export type ActionAssignVariables = AssignInput;

export type useActionReturn<T> = {
  action?: AssignActionQuery["action"];
  assign: (
    variables: ActionAssignVariables,
  ) => Promise<PostmanTaskFragment>;
  reassign: () => Promise<PostmanTaskFragment>;
  cancel: () => void;
  tasks?: PostmanTaskFragment[];
  latestTask?: PostmanTaskFragment;
};

export type useActionOptions<T> = {
  hash?: string;
};

export const useHashAction = <T extends any>(
  options: useActionOptions<T>,
): useActionReturn<T> => {
  const { data } = useAssignActionQuery({
    variables: {
      ...options,
    },
  });

  const { data: tasks_data } = useMyTasksQuery();

  const [postAssign] = useAssignMutation({});
  const [cancelAssign] = useCancelMutation({});

  const tasks = tasks_data?.myTasks.filter(
    (x) => x.action.hash == data?.action.hash,
  );

  const latestTask = tasks?.at(0);

  const assign = useCallback(
    async (vars: ActionAssignVariables) => {
      console.log("Assigning", vars);

      const mutation = await postAssign({
        variables: {
          input: {
            ...vars,
            args: vars.args,
            hooks: [],
          },
        },
      });

      console.log(mutation);

      const task = mutation.data?.assign;

      if (!task) {
        console.error(mutation);
        const errorMessages =
          mutation.errors?.map((error) => error.message).join(", ") ||
          "Unknown error";
        throw Error(`Couldn't assign: ${errorMessages}`);
      }

      return task;
    },
    [postAssign],
  );

  const reassign = useCallback(() => {
    console.log("Not");
    if (!latestTask) {
      throw Error("No latest task");
    }
    return assign({
      args: latestTask.args,
      action: latestTask?.action.id,
      hooks: [],
    });
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
      throw Error(`Couldn't assign: ${errorMessages}`);
    }

    return task;
  }, [cancelAssign, latestTask]);

  return {
    assign,
    reassign,
    latestTask,
    cancel,
    tasks,
    action: data?.action,
  };
};
