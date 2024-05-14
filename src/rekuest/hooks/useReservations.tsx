import { withRekuest } from "@jhnnsrs/rekuest-next";
import { useAssignationsQuery, useReservationsQuery } from "../api/graphql";
import { useSettings } from "@/providers/settings/SettingsContext";

export const useReservations = () => {
  const { settings } = useSettings();
  const queryResult = withRekuest(useReservationsQuery)({
    variables: {
      instanceId: settings.instanceId,
    },
  });

  return queryResult;
};
