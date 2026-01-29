import { Button } from "@/components/ui/button";
import { Grid3X3, Layers, Type } from "lucide-react";
import { ViewerPanelProps } from "./types";

export const LayerControlsPanel = ({
  showLayerEdges,
  setShowLayerEdges,
  showDebugText,
  setShowDebugText,
}: Pick<
  ViewerPanelProps,
  "showLayerEdges" | "setShowLayerEdges" | "showDebugText" | "setShowDebugText"
>) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <Layers className="w-4 h-4" />
        <span className="text-sm font-medium">Layer Controls</span>
      </div>
      <div className="text-xs text-gray-400 mb-2">
        Opened with Alt+Click on image
      </div>

      <Button
        size="sm"
        variant={showLayerEdges ? "default" : "outline"}
        onClick={() => setShowLayerEdges(!showLayerEdges)}
        className="w-full justify-start"
      >
        <Grid3X3 className="w-4 h-4 mr-2" />
        {showLayerEdges ? "Hide Edges" : "Show Edges"}
      </Button>

      <Button
        size="sm"
        variant={showDebugText ? "default" : "outline"}
        onClick={() => setShowDebugText(!showDebugText)}
        className="w-full justify-start"
      >
        <Type className="w-4 h-4 mr-2" />
        {showDebugText ? "Hide Debug" : "Show Debug"}
      </Button>
    </div>
  );
};
