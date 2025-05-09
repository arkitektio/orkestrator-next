import { useSettings } from "@/providers/settings/SettingsContext";
import { useCallback } from "react";
import {
  AssignInput,
  AssignActionQuery,
  AssignationEventKind,
  PostmanAssignationFragment,
  ReserveMutationVariables,
  useAssignMutation,
  useAssignActionQuery,
  useAssignationsQuery,
  useCancelMutation,
} from "../api/graphql";

export type ActionReserveVariables = Omit<
  ReserveMutationVariables,
  "instanceId"
>;
export type ActionAssignVariables = Omit<AssignInput, "instanceId">;

export type useActionReturn<T> = {
  action?: AssignActionQuery["action"];
  assign: (
    variables: ActionAssignVariables,
  ) => Promise<PostmanAssignationFragment>;
  reassign: () => Promise<PostmanAssignationFragment>;
  cancel: () => void;
  assignations?: PostmanAssignationFragment[];
  latestAssignation?: PostmanAssignationFragment;
};

export type useActionOptions<T> = {
  hash?: string;
};

export const useHashAction = <T extends any>(
  options: useActionOptions<T>,
): useActionReturn<T> => {
  const { settings } = useSettings();

  const { data } = useAssignActionQuery({
    variables: {
      ...options,
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
    (x) => x.action.hash == data?.action.hash,
  );

  const latestAssignation = assignations?.at(0);

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
        const errorMessages =
          mutation.errors?.map((error) => error.message).join(", ") ||
          "Unknown error";
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

    if (latestAssignation.status == AssignationEventKind.Done) {
      throw Error("Cannot Cancel as it is done");
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
