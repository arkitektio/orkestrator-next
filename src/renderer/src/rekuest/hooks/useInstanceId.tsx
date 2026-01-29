import { useSettings } from "@/providers/settings/SettingsContext";

export const useInstancId = () => {
  const { settings } = useSettings();
  return settings.instanceId;
};
