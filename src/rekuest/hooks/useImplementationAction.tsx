import { useSettings } from "@/providers/settings/SettingsContext";
import { useCallback } from "react";
import {
  AssignInput,
  AssignationEventKind,
  DetailImplementationFragment,
  PostmanAssignationFragment,
  ReserveMutationVariables,
  useAssignMutation,
  useAssignationsQuery,
  useCancelMutation,
  useImplementationQuery,
} from "../api/graphql";

export type ActionReserveVariables = Omit<
  ReserveMutationVariables,
  "instanceId"
>;
export type ActionAssignVariables = Omit<AssignInput, "instanceId">;

export type UseImplementationActionReturn<T> = {
  implementation?: DetailImplementationFragment;
  assign: (
    variables: ActionAssignVariables,
  ) => Promise<PostmanAssignationFragment>;
  reassign: () => Promise<PostmanAssignationFragment>;
  cancel: () => void;
  assignations?: PostmanAssignationFragment[];
  latestAssignation?: PostmanAssignationFragment;
};

export type UseImplementationAction<T> = {
  id: string;
};

export const useImplementationAction = <T extends any>(
  options: UseImplementationAction<T>,
): UseImplementationActionReturn<T> => {
  const { settings } = useSettings();

  const { data, variables, refetch } = useImplementationQuery({
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
    (x) => x.implementation?.id == data?.implementation.id,
  );

  const latestAssignation = data?.implementation.myLatestAssignation || assignations?.at(0);

  const assign = useCallback(
    async (vars: ActionAssignVariables) => {
      console.log("Assigning", vars);

      try {
        let mutation = await postAssign({
          variables: {
            input: {
              ...vars,
              implementation: options.id,
              args: vars.args,
              instanceId: settings.instanceId,
              hooks: [],
            },
          },
        });

        console.log(mutation);

        let assignation = mutation.data?.assign;

        if (!assignation) {
          throw Error(`Couldn't assign`);
        }

        return assignation;
      } catch (error: any) {
        throw Error(`Couldn't assign: ${error.message}`);
      }
    },
    [postAssign, settings.instanceId, options.id],
  );

  const reassign = useCallback(() => {
    console.log("Not");
    if (!latestAssignation) {
      throw Error("No latest assignation");
    }
    return assign({
      args: latestAssignation.args,
      implementation: latestAssignation?.implementation?.id,
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
    implementation: data?.implementation,
  };
};
