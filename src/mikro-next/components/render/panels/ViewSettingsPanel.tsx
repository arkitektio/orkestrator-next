import { Settings } from "lucide-react";

export const ViewSettingsPanel = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-4 h-4" />
        <span className="text-sm font-medium">View Settings</span>
      </div>
      <div className="text-xs text-gray-400 mb-2">
        Opened with Ctrl+Click on image
      </div>
      <div className="text-xs text-gray-500">
        View configuration options would go here
      </div>
    </div>
  );
};
