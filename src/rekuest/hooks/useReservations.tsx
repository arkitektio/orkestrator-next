import { useSettings } from "@/providers/settings/SettingsContext";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { useReservationsQuery } from "../api/graphql";

export const useReservations = () => {
  const { settings } = useSettings();
  const queryResult = withRekuest(useReservationsQuery)({
    variables: {
      instanceId: settings.instanceId,
    },
  });

  return queryResult;
};
