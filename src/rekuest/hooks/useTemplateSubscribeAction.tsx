import { useSettings } from "@/providers/settings/SettingsContext";
import { useCallback, useState } from "react";
import {
  AssignInput,
  AssignationEventKind,
  DetailTemplateFragment,
  PostmanAssignationFragment,
  ReserveMutationVariables,
  useAssignMutation,
  useAssignationsQuery,
  useCancelMutation,
  useTemplateQuery,
} from "../api/graphql";
import { v4 } from "uuid";

export type ActionReserveVariables = Omit<
  ReserveMutationVariables,
  "instanceId"
>;
export type ActionAssignVariables = Omit<AssignInput, "instanceId">;

export type UseTemplateActionReturn<T> = {
  template?: DetailTemplateFragment;
  assign: (
    variables: ActionAssignVariables,
  ) => Promise<PostmanAssignationFragment>;
  reassign: () => Promise<PostmanAssignationFragment>;
  cancel: () => void;
  assignations?: PostmanAssignationFragment[];
  causedAssignation?: PostmanAssignationFragment;
};

export type UseTemplateAction<T> = {
  id: string;
};

export const useTemplateSubscribeAction = <T extends any>(
  options: UseTemplateAction<T>,
): UseTemplateActionReturn<T> => {
  const { settings } = useSettings();
  const [causedAssignation, setCausedAssignation] =
    useState<PostmanAssignationFragment | null>(null);

  const { data } = useTemplateQuery({
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
    (x) => x.reference == causedAssignation?.reference,
  );

  const latestAssignation = assignations?.at(0);

  const assign = useCallback(
    async (vars: ActionAssignVariables) => {
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

      setCausedAssignation(assignation);
      return assignation;
    },
    [postAssign, settings],
  );

  const reassign = useCallback(() => {
    console.log("Not");
    if (!causedAssignation) {
      throw Error("No latest assignation");
    }
    return assign({
      args: causedAssignation.args,
      node: latestAssignation?.node.id,
      hooks: [],
    });
  }, [assign]);

  const cancel = useCallback(async () => {
    console.log("Cancelling", causedAssignation);
    if (!causedAssignation) {
      throw Error("Cannot Reassign");
    }

    if (causedAssignation.status == AssignationEventKind.Done) {
      throw Error("Cannot Cancel as it is done");
    }

    console.log("Cancelling", causedAssignation);

    let mutation = await cancelAssign({
      variables: {
        input: { assignation: causedAssignation.id },
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

    setCausedAssignation(null);

    return assignation;
  }, [cancelAssign, causedAssignation]);

  return {
    assign,
    reassign,
    causedAssignation: latestAssignation,
    cancel,
    assignations,
    template: data?.template,
  };
};
