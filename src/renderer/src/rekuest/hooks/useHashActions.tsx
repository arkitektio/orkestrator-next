import { useCallback } from "react";
import {
  AssignActionQuery,
  AssignationEventKind,
  AssignInput,
  PostmanAssignationFragment,
  useAssignActionQuery,
  useAssignationsQuery,
  useAssignMutation,
  useCancelMutation,
} from "../api/graphql";

export type ActionAssignVariables = AssignInput;

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
  const { data } = useAssignActionQuery({
    variables: {
      ...options,
    },
  });

  const { data: assignations_data } = useAssignationsQuery();

  const [postAssign] = useAssignMutation({});
  const [cancelAssign] = useCancelMutation({});

  const assignations = assignations_data?.assignations.filter(
    (x) => x.action.hash == data?.action.hash,
  );

  const latestAssignation = assignations?.at(0);

  const assign = useCallback(
    async (vars: ActionAssignVariables) => {
      console.log("Assigning", vars);

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

      return assignation;
    },
    [postAssign],
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
    assignations,
    action: data?.action,
  };
};
