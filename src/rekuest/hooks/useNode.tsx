import { useSettings } from "@/providers/settings/SettingsContext";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { useCallback, useMemo } from "react";
import {
  AssignationEventKind,
  PostmanAssignationFragment,
  PostmanReservationFragment,
  useAssignMutation,
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

export type useActionReturn<T> = {
  latestAssignation?: PostmanAssignationFragment;
  latestReservation?: PostmanReservationFragment;
  reservations?: PostmanReservationFragment[];
  assignations?: PostmanAssignationFragment[];
  assign: (variables: T) => Promise<PostmanAssignationFragment>;
  reassign: () => Promise<PostmanAssignationFragment>;
  cancel: () => void;
  reserve: () => Promise<PostmanReservationFragment>;
  unreserve: () => void;
};

export type useActionOptions<T> = {
  hash?: string;
  template?: string;
};

export const useAction = <T extends any>(
  options: useActionOptions<T>,
): useActionReturn<T> => {
  const { settings } = useSettings();
  const { data } = withRekuest(useReservationsQuery)({
    variables: {
      instanceId: settings.instanceId,
    },
  });

  const { data: assigndata } = withRekuest(useAssignationsQuery)({
    variables: {
      instanceId: settings.instanceId,
    },
  });

  const [postAssign] = withRekuest(useAssignMutation)({});
  const [cancelAssign] = withRekuest(useCancelMutation)({});

  const [postReserve, _] = withRekuest(useReserveMutation)();
  const [postUnreserve, __] = withRekuest(useUnreserveMutation)();

  const reservations = data?.reservations.filter(
    (r) => r.node.hash == options.hash,
  );

  const latestReservation = reservations?.at(0);

  const assignations = assigndata?.assignations.filter((a) =>
    reservations?.map((r) => r.id).includes(a.reservation?.id),
  );

  const latestAssignation = assignations?.at(0);

  const toggle = useCallback(() => {
    console.log(latestReservation ? "Unreserving" : "Reserving");
    if (!latestReservation) {
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
          reservation: latestReservation.id,
        },
      });
    }
  }, [options.hash, latestReservation]);

  const reserve = useCallback(async () => {
    let mutation = await postReserve({
      variables: {
        instanceId: settings.instanceId,
        node: options.hash,
        template: options.template,
      },
    });

    let reservation = mutation.data?.reserve;
    if (!reservation) {
      throw Error("Fuck all of that");
    }
    return reservation;
  }, [postReserve]);

  const unreserve = useCallback(async () => {
    if (!latestReservation) {
      throw Error("Nothing reserved");
    }
    let mutation = await postUnreserve({
      variables: {
        reservation: latestReservation.id,
      },
    });

    let unresrf = mutation.data?.unreserve;
    if (!unresrf) {
      throw Error("Fuck all of that");
    }
    return unresrf;
  }, [postReserve]);

  let ports = data?.reservations.at(0)?.node.args;

  const schema = useMemo(() => {
    return ports && buildZodSchema(ports);
  }, [data]);

  const assign = useCallback(
    async (vars: T) => {
      if (!schema) {
        throw Error("No schema specificied, Maybe no Resrevation active");
      }
      if (!latestReservation) {
        throw Error("No active resrevation");
      }

      let result = await schema.parseAsync(vars);

      let mutation = await postAssign({
        variables: {
          args: ports?.map((p) => result[p.key]) || [],
          reservation: latestReservation.id,
        },
      });

      let assignation = mutation.data?.assign;

      if (!assignation) {
        console.error(mutation);
        throw Error("Couln't assign");
      }

      return assignation;
    },
    [postAssign, schema, latestReservation],
  );

  const reassign = useCallback(() => {
    if (!latestAssignation) {
      throw Error("Cannot Reassign");
    }

    return assign(latestAssignation.args);
  }, [assign, latestAssignation]);

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
    reserve,
    unreserve,
    assign,
    reassign,
    latestAssignation,
    latestReservation,
    cancel,
    reservations,
    assignations,
  };
};
