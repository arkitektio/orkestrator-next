import { useSettings } from "@/providers/settings/SettingsContext";
import { useCallback } from "react";
import {
  PostmanReservationFragment,
  useReservationsQuery,
  useReserveMutation,
  useUnreserveMutation,
} from "../api/graphql";

export const useUsage = (options: {
  hash?: string;
  template?: string;
}): [PostmanReservationFragment | undefined, () => void] => {
  const { settings } = useSettings();
  const { data } = useReservationsQuery({
    variables: {
      instanceId: settings.instanceId,
    },
  });

  const [reserve, _] = useReserveMutation();
  const [unreserve, __] = useUnreserveMutation();

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
