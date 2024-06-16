import { useSettings } from "@/providers/settings/SettingsContext";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { useAssignationsQuery } from "../api/graphql";

export const useAssignations = () => {
  const { settings } = useSettings();
  const queryResult = withRekuest(useAssignationsQuery)({
    variables: {
      instanceId: settings.instanceId,
    },
  });

  return queryResult;
};
