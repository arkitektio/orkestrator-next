import { useSettings } from "@/providers/settings/SettingsContext";
import { useAssignationsQuery } from "../api/graphql";

export const useAssignations = () => {
  const { settings } = useSettings();
  const queryResult = useAssignationsQuery({
    variables: {
      instanceId: settings.instanceId,
    },
  });

  return queryResult;
};
