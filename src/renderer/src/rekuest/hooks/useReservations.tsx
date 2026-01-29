import { useSettings } from "@/providers/settings/SettingsContext";
import { useReservationsQuery } from "../api/graphql";

export const useReservations = () => {
  const { settings } = useSettings();
  const queryResult = useReservationsQuery({
    variables: {
      instanceId: settings.instanceId,
    },
  });

  return queryResult;
};
