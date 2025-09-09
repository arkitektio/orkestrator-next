import { Button } from "@/components/ui/button";
import { Eye, EyeOff, List } from "lucide-react";
import { ViewerPanelProps } from "./types";
import { SmartContext } from "@/rekuest/buttons/ObjectButton";

export const DisplayStructuresPanel = ({
  showDisplayStructures,
  setShowDisplayStructures,
  displayStructures,
  removeDisplayStructure,
  clearDisplayStructures,
  rois,
}: Pick<
  ViewerPanelProps,
  | "showDisplayStructures"
  | "setShowDisplayStructures"
  | "displayStructures"
  | "removeDisplayStructure"
  | "clearDisplayStructures"
  | "rois"
>) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <List className="w-4 h-4" />
        <span className="text-sm font-medium">Display Structures</span>
      </div>
      <div className="text-xs text-gray-400 mb-2">
        ROIs added with Shift+Click
      </div>

      {/* Toggle display structures visibility */}
      <Button
        size="sm"
        variant={showDisplayStructures ? "default" : "outline"}
        onClick={() => setShowDisplayStructures(!showDisplayStructures)}
        className="w-full justify-start"
      >
        {showDisplayStructures ? (
          <Eye className="w-4 h-4 mr-2" />
        ) : (
          <EyeOff className="w-4 h-4 mr-2" />
        )}
        {showDisplayStructures ? "Hide Structures" : "Show Structures"}
      </Button>

      {/* Clear all structures */}
      {displayStructures.length > 0 && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => clearDisplayStructures()}
          className="w-full justify-start text-red-600 hover:text-red-700"
        >
          Clear All ({displayStructures.length})
        </Button>
      )}

      {/* List of display structures */}
      {displayStructures.length > 0 && (
        <div className="max-h-32 overflow-y-auto">
          <div className="text-xs text-gray-500 mb-1">Structures:</div>

          <SmartContext
            objects={displayStructures.map(r => ({ identifier: "@mikro/roi", object: r }))}

          />
        </div>
      )}

      {displayStructures.length === 0 && (
        <div className="text-xs text-gray-500 italic">
          No structures added yet. Shift+click on ROIs to add them.
        </div>
      )}
    </div>
  );
};
