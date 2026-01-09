import { Button } from "@/components/ui/button";
import { Edit3, Eye, EyeOff } from "lucide-react";
import { ViewerPanelProps } from "./types";

export const RoiToolsPanel = ({
  allowRoiDrawing,
  setAllowRoiDrawing,
  showRois,
  setShowRois,
}: Pick<
  ViewerPanelProps,
  "allowRoiDrawing" | "setAllowRoiDrawing" | "showRois" | "setShowRois"
>) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <Edit3 className="w-4 h-4" />
        <span className="text-sm font-medium">ROI Tools</span>
      </div>
      <div className="text-xs text-gray-400 mb-2">Click to open ROI tools</div>

      {/* ROI Drawing Toggle */}
      <Button
        size="sm"
        variant={allowRoiDrawing ? "default" : "outline"}
        onClick={() => setAllowRoiDrawing(!allowRoiDrawing)}
        className="w-full justify-start"
      >
        <Edit3 className="w-4 h-4 mr-2" />
        {allowRoiDrawing ? "Disable Drawing" : "Enable Drawing"}
      </Button>

      {/* ROI Visibility Toggle */}
      <Button
        size="sm"
        variant={showRois ? "default" : "outline"}
        onClick={() => setShowRois(!showRois)}
        className="w-full justify-start"
      >
        {showRois ? (
          <Eye className="w-4 h-4 mr-2" />
        ) : (
          <EyeOff className="w-4 h-4 mr-2" />
        )}
        {showRois ? "Hide ROIs" : "Show ROIs"}
      </Button>
    </div>
  );
};
