import { useSettings } from "@/providers/settings/SettingsContext";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { useCallback, useMemo } from "react";
import {
  AssignMutationVariables,
  AssignNodeQuery,
  AssignationEventKind,
  PostmanAssignationFragment,
  PostmanReservationFragment,
  ReserveMutationVariables,
  useAssignMutation,
  useAssignNodeQuery,
  useAssignationsQuery,
  useCancelMutation,
  useReservationsQuery,
  useReserveMutation,
  useUnreserveMutation,
} from "../api/graphql";
import { buildZodSchema } from "../widgets/utils";

export const useUsage = (options: {
  hash?: string;
  template?: string;
}): [PostmanReservationFragment | undefined, () => void] => {
  const { settings } = useSettings();
  const { data } = withRekuest(useReservationsQuery)({
    variables: {
      instanceId: settings.instanceId,
    },
  });

  const [reserve, _] = withRekuest(useReserveMutation)();
  const [unreserve, __] = withRekuest(useUnreserveMutation)();

  const isUsed = data?.reservations.find((r) => r.node.hash == options.hash);

  const toggle = useCallback(() => {
    console.log(isUsed ? "Unreserving" : "Reserving");
    if (!isUsed) {
      reserve({
        variables: {
          instanceId: settings.instanceId,
          node: options.hash,
          template: options.template,
        },
      });
    } else {
      unreserve({
        variables: {
          reservation: isUsed.id,
        },
      });
    }
  }, [options.hash, isUsed]);

  return [isUsed, toggle];
};

export type ActionReserveVariables = Omit<
  ReserveMutationVariables,
  "instanceId"
>;
export type ActionAssignVariables = Omit<AssignMutationVariables, "instanceId">;

export type useActionReturn<T> = {
  node?: AssignNodeQuery["node"];
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
  template?: string;
  reservation?: string;
};

export const useAction = <T extends any>(
  options: useActionOptions<T>,
): useActionReturn<T> => {
  const { settings } = useSettings();

  const { data } = withRekuest(useAssignNodeQuery)({
    variables: {
      ...options,
    },
  });

  const { data: assignations_data } = withRekuest(useAssignationsQuery)({
    variables: {
      instanceId: settings.instanceId,
    },
  });

  const [postAssign] = withRekuest(useAssignMutation)({});
  const [cancelAssign] = withRekuest(useCancelMutation)({});

  let assignations = assignations_data?.assignations.filter(
    (x) => x.node.hash == data?.node.hash,
  );

  const latestAssignation = assignations?.at(0);

  const assign = useCallback(
    async (vars: ActionAssignVariables) => {
      console.log("Assigning", vars);

      let mutation = await postAssign({
        variables: {
          ...vars,
          args: vars.args,
          instanceId: settings.instanceId,
          hooks: [],
        },
      });

      console.log(mutation);

      let assignation = mutation.data?.assign;

      if (!assignation) {
        console.error(mutation);
        throw Error("Couln't assign");
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
      node: latestAssignation?.node.id,
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
        assignation: latestAssignation.id,
      },
    });

    let assignation = mutation.data?.cancel;

    if (!assignation) {
      console.error(mutation);
      throw Error("Couln't assign");
    }

    return assignation;
  }, [cancelAssign, latestAssignation]);

  return {
    assign,
    reassign,
    latestAssignation,
    cancel,
    assignations,
    node: data?.node,
  };
};
