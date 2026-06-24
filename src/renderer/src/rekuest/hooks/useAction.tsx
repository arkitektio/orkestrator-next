import { useCallback } from "react";
import {
  AssignInput,
  DetailActionFragment,
  PostmanTaskFragment,
  useAssignMutation,
  useMyTasksQuery,
  useCancelMutation,
  useDetailActionQuery
} from "../api/graphql";

export type ActionAssignVariables = AssignInput;

export type useActionReturn<T> = {
  assign: (
    variables: ActionAssignVariables,
  ) => Promise<PostmanTaskFragment>;
  reassign: () => Promise<PostmanTaskFragment>;
  cancel: () => void;
  tasks?: PostmanTaskFragment[];
  latestTask?: PostmanTaskFragment;
  action: DetailActionFragment | undefined;
};

export type useActionOptions<T> = {
  id: string;
};

export const useAction = <T extends any>(
  options: useActionOptions<T>,
): useActionReturn<T> => {
  const { data, variables, refetch } = useDetailActionQuery({
    variables: {
      id: options.id,
    },
  });

  const { data: tasks_data } = useMyTasksQuery();

  const [postAssign] = useAssignMutation({});
  const [cancelAssign] = useCancelMutation({});

  const tasks = tasks_data?.myTasks.filter(
    (x) => x.action.id == options.id,
  );

  const latestTask = tasks?.at(-1);

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
        const errorMessages = mutation.errors || "Unknown error";
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
