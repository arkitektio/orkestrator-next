import { withRekuest } from "@jhnnsrs/rekuest-next";
import { useAssignationsQuery } from "../api/graphql";
import { useSettings } from "@/providers/settings/SettingsContext";

export const useAssignations = () => {
  const { settings } = useSettings();
  const queryResult = withRekuest(useAssignationsQuery)({
    variables: {
      instanceId: settings.instanceId,
    },
  });

  return queryResult;
};
