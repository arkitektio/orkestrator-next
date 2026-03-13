import { useSettings } from "@/providers/settings/SettingsContext";
import {
  AssignationEventKind,
  AssignInput,
  PostmanAssignationFragment,
  ReserveMutationVariables,
  useAssignationsQuery,
  useAssignMutation,
  useCancelMutation,
} from "@/rekuest/api/graphql";
import { useCallback, useState } from "react";

export type ActionReserveVariables = Omit<
  ReserveMutationVariables,
  "instanceId"
>;
export type ActionAssignVariables = Omit<AssignInput, "instanceId">;

export type PartialTemplateOptions = Partial<ActionAssignVariables>;

export type UseActionReturn<T> = {
  assign: (
    variables: ActionAssignVariables,
  ) => Promise<PostmanAssignationFragment>;
  reassign: () => Promise<PostmanAssignationFragment>;
  cancel: () => void;
  assignations?: PostmanAssignationFragment[];
  latestAssignation?: PostmanAssignationFragment;
};

export const useAction = <T extends any>(
  options: PartialTemplateOptions,
): UseActionReturn<T> => {
  const { settings } = useSettings();
  const [currentAssign, setCurrentAssign] =
    useState<PostmanAssignationFragment | null>(null);

  const { data: assignations_data } = useAssignationsQuery({
    variables: {
      instanceId: settings.instanceId,
    },
  });

  const [postAssign] = useAssignMutation({});
  const [cancelAssign] = useCancelMutation({});

  const assignations = assignations_data?.assignations.filter(
    (x) => x.id == currentAssign?.id,
  );

  const latestAssignation = assignations?.at(0);

  const assign = useCallback(
    async (vars: ActionAssignVariables) => {
      console.log("Assigning", vars);

      try {
        const mutation = await postAssign({
          variables: {
            input: {
              ...vars,
              ...options,
              instanceId: settings.instanceId,
              hooks: [],
            },
          },
        });

        console.log(mutation);

        const assignation = mutation.data?.assign;

        if (!assignation) {
          throw Error(`Couldn't assign`);
        }

        setCurrentAssign(assignation);

        return assignation;
      } catch (error: any) {
        throw Error(`Couldn't assign: ${error.message}`);
      }
    },
    [postAssign, settings.instanceId, options.agent, options.template, options],
  );

  const reassign = useCallback(() => {
    console.log("Not");
    if (!latestAssignation) {
      throw Error("No latest assignation");
    }
    return assign({
      args: latestAssignation.args,
      template: latestAssignation?.template?.id,
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

    const mutation = await cancelAssign({
      variables: {
        input: { assignation: latestAssignation.id },
      },
    });

    const assignation = mutation.data?.cancel;

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
  };
};
