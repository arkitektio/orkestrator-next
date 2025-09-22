import { useSettings } from "@/providers/settings/SettingsContext";
import { useCallback } from "react";
import {
  AssignInput,
  PostmanAssignationFragment,
  ReserveMutationVariables,
  useAssignMutation,
} from "../api/graphql";

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

      let mutation = await postAssign({
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

      let assignation = mutation.data?.assign;

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
