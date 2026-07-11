import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  TaskEventFragment,
  AssignInput,
  PostmanTaskFragment,
  useAssignMutation
} from "../api/graphql";
import { trackTask } from "../lib/taskTracker";
export type ActionAssignVariables = AssignInput;

export type useActionReturn = {
  assign: (
    variables: ActionAssignVariables,
  ) => Promise<PostmanTaskFragment>;
};

export type useActionOptions = {
  id: string;
};

export const useAssign = (): useActionReturn => {
  const [postAssign] = useAssignMutation({});

  const assign = useCallback(
    async (vars: ActionAssignVariables) => {
      const mutation = await postAssign({
        variables: {
          input: {
            ...vars,
            args: vars.args,
            hooks: [],
            reference: vars.reference || "",
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

  return {
    assign,
  };
};


export const useAssignWithCallback = ({ onDone }: {
  onDone?: (event: TaskEventFragment) => void,

}): useActionReturn => {
  const { assign } = useAssign();


  const assignWithCallback = useCallback(
    async (vars: ActionAssignVariables) => {
      const reference = vars.reference || uuidv4();

      const untrack = trackTask(
        reference,
        (event: TaskEventFragment) => {
          onDone?.(event);
        },
      );

      try {
        return await assign({ ...vars, reference });
      } catch (error) {
        untrack();
        throw error;
      }
    },
    [assign, onDone],
  );

  return {
    assign: assignWithCallback,
  };
}
