import { useSettings } from "@/providers/settings/SettingsContext";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  AssignationEventFragment,
  AssignInput,
  PostmanAssignationFragment,
  ReserveMutationVariables,
  useAssignMutation
} from "../api/graphql";
import { trackAssignation } from "../lib/assignationTracker";
export type ActionReserveVariables = Omit<
  ReserveMutationVariables,
  "instanceId"
>;
export type ActionAssignVariables = Omit<AssignInput, "instanceId">;

export type useActionReturn<T> = {
  assign: (
    variables: ActionAssignVariables,
  ) => Promise<PostmanAssignationFragment>;
};

export type useActionOptions<T> = {
  id: string;
};

export const useAssign = <T extends any>(): useActionReturn<T> => {
  const { settings } = useSettings();

  const [postAssign] = useAssignMutation({});

  const assign = useCallback(
    async (vars: ActionAssignVariables) => {
      console.log("Assigning", vars);

      const mutation = await postAssign({
        variables: {
          input: {
            ...vars,
            args: vars.args,
            instanceId: settings.instanceId,
            hooks: [],
            reference: vars.reference || "",
          },
        },
      });

      console.log(mutation);

      const assignation = mutation.data?.assign;

      if (!assignation) {
        console.error(mutation);
        const errorMessages = mutation.errors || "Unknown error";
        throw Error(`Couldn't assign: ${errorMessages}`);
      }

      return assignation;
    },
    [postAssign, settings],
  );

  return {
    assign,
  };
};


export const useAssignWithCallback = <T extends any>({ onDone }: {
  onDone?: (event: AssignationEventFragment) => void,

}): useActionReturn<T> => {
  const { assign } = useAssign();


  const assignWithCallback = useCallback(
    async (vars: ActionAssignVariables) => {
      const reference = vars.reference || uuidv4();

      const untrack = trackAssignation(
        reference,
        (event: AssignationEventFragment) => {
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
