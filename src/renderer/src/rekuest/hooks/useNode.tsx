import { useCallback } from "react";
import {
  PostmanReservationFragment,
  useReservationsQuery,
  useReserveMutation,
  useUnreserveMutation,
} from "../api/graphql";

export const useUsage = (options: {
  hash?: string;
  implementation?: string;
}): [PostmanReservationFragment | undefined, () => void] => {
  const { data } = useReservationsQuery();

  const [reserve, _] = useReserveMutation();
  const [unreserve, __] = useUnreserveMutation();

  const isUsed = data?.reservations.find((r) => r.action.hash == options.hash);

  const toggle = useCallback(() => {
    console.log(isUsed ? "Unreserving" : "Reserving");
    if (!isUsed) {
      reserve({
        variables: {
          action: options.hash,
          implementation: options.implementation,
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
