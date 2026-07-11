import {
  TaskEventKind,
  AssignInput,
  PostmanTaskFragment,
  useMyTasksQuery,
  useAssignMutation,
  useCancelMutation,
} from "@/rekuest/api/graphql";
import { buildAssignInput } from "@/rekuest/assign";
import { useCallback, useState } from "react";

export type ActionAssignVariables = AssignInput;

export type PartialTemplateOptions = Partial<ActionAssignVariables>;

export type UseActionReturn = {
  assign: (
    variables: ActionAssignVariables,
  ) => Promise<PostmanTaskFragment>;
  reassign: () => Promise<PostmanTaskFragment>;
  cancel: () => void;
  tasks?: PostmanTaskFragment[];
  latestTask?: PostmanTaskFragment;
};

export const useAction = (
  options: PartialTemplateOptions,
): UseActionReturn => {
  const [currentAssign, setCurrentAssign] =
    useState<PostmanTaskFragment | null>(null);

  const { data: tasks_data } = useMyTasksQuery();

  const [postAssign] = useAssignMutation({});
  const [cancelAssign] = useCancelMutation({});

  const tasks = tasks_data?.myTasks.filter(
    (x) => x.id == currentAssign?.id,
  );

  const latestTask = tasks?.at(0);

  const assign = useCallback(
    async (vars: ActionAssignVariables) => {
      try {
        const mutation = await postAssign({
          variables: {
            input: {
              ...vars,
              ...options,
              hooks: [],
            },
          },
        });

        const task = mutation.data?.assign;

        if (!task) {
          throw Error(`Couldn't assign`);
        }

        setCurrentAssign(task);

        return task;
      } catch (error: any) {
        throw Error(`Couldn't assign: ${error.message}`);
      }
    },
    [postAssign, options],
  );

  const reassign = useCallback(() => {
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
      throw Error(`Couldn't assign: ${errorMessages}`);
    }

    return task;
  }, [cancelAssign, latestTask]);

  return {
    assign,
    reassign,
    latestTask,
    cancel,
  };
};
