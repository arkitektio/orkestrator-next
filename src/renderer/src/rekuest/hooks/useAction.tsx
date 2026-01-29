import { useSettings } from "@/providers/settings/SettingsContext";
import { useCallback } from "react";
import {
  AssignInput,
  DetailActionFragment,
  PostmanAssignationFragment,
  ReserveMutationVariables,
  useAssignMutation,
  useAssignationsQuery,
  useCancelMutation,
  useDetailActionQuery
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
  reassign: () => Promise<PostmanAssignationFragment>;
  cancel: () => void;
  assignations?: PostmanAssignationFragment[];
  latestAssignation?: PostmanAssignationFragment;
  action: DetailActionFragment | undefined;
};

export type useActionOptions<T> = {
  id: string;
};

export const useAction = <T extends any>(
  options: useActionOptions<T>,
): useActionReturn<T> => {
  const { settings } = useSettings();

  const { data, variables, refetch } = useDetailActionQuery({
    variables: {
      id: options.id,
    },
  });

  const { data: assignations_data } = useAssignationsQuery({
    variables: {
      instanceId: settings.instanceId,
    },
  });

  const [postAssign] = useAssignMutation({});
  const [cancelAssign] = useCancelMutation({});

  let assignations = assignations_data?.assignations.filter(
    (x) => x.action.id == options.id,
  );

  const latestAssignation = assignations?.at(-1);

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

  const reassign = useCallback(() => {
    console.log("Not");
    if (!latestAssignation) {
      throw Error("No latest assignation");
    }
    return assign({
      args: latestAssignation.args,
      action: latestAssignation?.action.id,
      hooks: [],
    });
  }, [assign]);

  const cancel = useCallback(async () => {
    if (!latestAssignation) {
      throw Error("Cannot Reassign");
    }


    let mutation = await cancelAssign({
      variables: {
        input: { assignation: latestAssignation.id },
      },
    });

    let assignation = mutation.data?.cancel;

    if (!assignation) {
      console.error(mutation);
      const errorMessages =
        mutation.errors?.map((error) => error.message).join(", ") ||
        "Unknown error";
      throw Error(`Couldn't assign: ${errorMessages}`);
    }

    return assignation;
  }, [cancelAssign, latestAssignation]);

  return {
    assign,
    reassign,
    latestAssignation,
    cancel,
    assignations,
    action: data?.action,
  };
};
