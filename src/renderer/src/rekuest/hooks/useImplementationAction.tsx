import { formatApolloError } from "@/lib/errorHandler";
import { useCallback } from "react";
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
  error?: any;
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
  const { data, variables, refetch, error } = useImplementationQuery({
    variables: {
      id: options.id,
    },
  });

  const { data: assignations_data } = useAssignationsQuery();

  const [postAssign] = useAssignMutation({});
  const [cancelAssign] = useCancelMutation({});

  const assignations = assignations_data?.assignations.filter(
    (x) => x.implementation?.id == data?.implementation.id,
  );

  const latestAssignation = data?.implementation.myLatestAssignation || assignations?.at(0);

  const assign = useCallback(
    async (vars: ActionAssignVariables) => {
      console.log("Assigning", vars);

      try {
        const mutation = await postAssign({
          variables: {
            input: {
              ...vars,
              implementation: options.id,
              args: vars.args,
              hooks: [],
            },
          },
        });

        console.log(mutation);

        const assignation = mutation.data?.assign;

        if (!assignation) {
          throw Error("Couldn't assign: no assignation was returned by the GraphQL API");
        }

        return assignation;
        } catch (error: unknown) {
          throw Error(`Couldn't assign: ${formatApolloError(error, "rekuest")}`);
      }
    },
    [postAssign, options.id],
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
      throw Error(`Couldn't cancel assignation: ${errorMessages}`);
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
    error,
  };
};
