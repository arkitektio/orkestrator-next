import { useCallback, useState } from "react";
import {
  AssignInput,
  AssignationEventKind,
  DetailImplementationFragment,
  PostmanAssignationFragment,
  useAssignMutation,
  useAssignationsQuery,
  useCancelMutation,
  useImplementationQuery,
} from "../api/graphql";

export type ActionAssignVariables = AssignInput;

export type UseImplementationActionReturn<T> = {
  implementation?: DetailImplementationFragment;
  assign: (
    variables: ActionAssignVariables,
  ) => Promise<PostmanAssignationFragment>;
  reassign: () => Promise<PostmanAssignationFragment>;
  cancel: () => void;
  assignations?: PostmanAssignationFragment[];
  causedAssignation?: PostmanAssignationFragment;
};

export type UseImplementationAction<T> = {
  id: string;
};

export const useImplementationSubscribeAction = <T extends any>(
  options: UseImplementationAction<T>,
): UseImplementationActionReturn<T> => {
  const [causedAssignation, setCausedAssignation] =
    useState<PostmanAssignationFragment | null>(null);

  const { data } = useImplementationQuery({
    variables: {
      ...options,
    },
  });

  const { data: assignations_data } = useAssignationsQuery();

  const [postAssign] = useAssignMutation({});
  const [cancelAssign] = useCancelMutation({});

  const assignations = assignations_data?.assignations.filter(
    (x) => x.reference == causedAssignation?.reference,
  );

  const latestAssignation = assignations?.at(0);

  const assign = useCallback(
    async (vars: ActionAssignVariables) => {
      const mutation = await postAssign({
        variables: {
          input: {
            ...vars,
            args: vars.args,
            hooks: [],
          },
        },
      });

      console.log(mutation);

      const assignation = mutation.data?.assign;

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
    [postAssign],
  );

  const reassign = useCallback(() => {
    console.log("Not");
    if (!causedAssignation) {
      throw Error("No latest assignation");
    }
    return assign({
      args: causedAssignation.args,
      action: latestAssignation?.action.id,
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

    const mutation = await cancelAssign({
      variables: {
        input: { assignation: causedAssignation.id },
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

    setCausedAssignation(null);

    return assignation;
  }, [cancelAssign, causedAssignation]);

  return {
    assign,
    reassign,
    causedAssignation: latestAssignation,
    cancel,
    assignations,
    implementation: data?.implementation,
  };
};
