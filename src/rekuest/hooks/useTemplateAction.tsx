import { useSettings } from "@/providers/settings/SettingsContext";
import { useCallback } from "react";
import { toast } from "sonner";
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
  latestAssignation?: PostmanAssignationFragment;
};

export type UseTemplateAction<T> = {
  id: string;
};

export const useTemplateAction = <T extends any>(
  options: UseTemplateAction<T>,
): UseTemplateActionReturn<T> => {
  const { settings } = useSettings();

  const { data, variables, refetch } = useTemplateQuery({
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
    (x) => x.template?.id == data?.template.id,
  );

  const latestAssignation = assignations?.at(0);

  const assign = useCallback(
    async (vars: ActionAssignVariables) => {
      console.log("Assigning", vars);

      try {
        let mutation = await postAssign({
          variables: {
            input: {
              ...vars,
              template: options.id,
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
    template: data?.template,
  };
};
