import { Reservation, usePostman } from "@jhnnsrs/rekuest-next";
import { useCallback } from "react";
import {
  PostmanReservationFragment,
  useReservationsQuery,
  useReserveMutation,
  useUnreserveMutation,
} from "../api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";

export const useUsage = (options: {
  hash?: string;
  template?: string;
}): [PostmanReservationFragment | undefined, () => void] => {
  const { data } = withRekuest(useReservationsQuery)({
    variables: {
      instanceId: "default",
    },
  });

  const [reserve, _] = withRekuest(useReserveMutation)();
  const [unreserve, __] = withRekuest(useUnreserveMutation)();

  const isUsed = data?.myreservations.find((r) => r.node.hash == options.hash);

  const toggle = useCallback(() => {
    console.log(isUsed ? "Unreserving" : "Reserving");
    if (!isUsed) {
      reserve({
        variables: {
          instanceId: "default",
          node: options.hash,
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
