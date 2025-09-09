import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  ChevronDown,
  Circle,
  Edit3,
  Eye,
  EyeOff,
  Grid3X3,
  Layers,
  MapPin,
  Minus,
  MoreHorizontal,
  Settings,
  Square,
  Type,
} from "lucide-react";
import { RoiKind } from "@/mikro-next/api/graphql";
import { useViewerState } from "./ViewerStateProvider";

// Helper function to get icon for ROI type
const getRoiIcon = (roiKind: RoiKind) => {
  switch (roiKind) {
    case RoiKind.Rectangle:
      return Square;
    case RoiKind.Ellipsis:
      return Circle;
    case RoiKind.Line:
      return Minus;
    case RoiKind.Point:
      return MapPin;
    case RoiKind.Polygon:
      return MoreHorizontal;
    case RoiKind.Path:
      return Edit3;
    default:
      return Square;
  }
};

interface RenderControlsMenuProps {
  availableScales: number[];
}

export const RenderControlsMenu = ({
  availableScales,
}: RenderControlsMenuProps) => {
  const {
    showRois,
    showLayerEdges,
    showDebugText,
    enabledScales,
    allowRoiDrawing,
    roiDrawMode,
    setShowRois,
    setShowLayerEdges,
    setShowDebugText,
    setAllowRoiDrawing,
    setRoiDrawMode,
    toggleScale,
  } = useViewerState();

  const handleRoiKindClick = (kind: RoiKind) => {
    // Auto-toggle: enable ROI drawing, show ROIs, and set the mode
    setShowRois(true);
    setAllowRoiDrawing(true);
    setRoiDrawMode(kind);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="bg-gray-800 text-gray-300 hover:bg-gray-700"
          title="Toggle controls menu"
        >
          <Settings className="w-4 h-4" />
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-gray-900 border-gray-700">
        {/* ROI Controls */}
        <DropdownMenuLabel className="text-gray-400">
          ROI Tools
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setShowRois(!showRois)}
          className={`cursor-pointer ${
            showRois
              ? "bg-blue-800 text-white"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          {showRois ? (
            <Eye className="w-4 h-4 mr-2" />
          ) : (
            <EyeOff className="w-4 h-4 mr-2" />
          )}
          {showRois ? "Hide ROIs" : "Show ROIs"}
        </DropdownMenuItem>

        {/* Direct ROI Drawing Mode Selection */}
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuLabel className="text-gray-400">
          Draw ROI (Auto-enables)
        </DropdownMenuLabel>
        {[
          RoiKind.Rectangle,
          RoiKind.Ellipsis,
          RoiKind.Polygon,
          RoiKind.Line,
          RoiKind.Point,
          RoiKind.Path,
        ].map((kind) => {
          const IconComponent = getRoiIcon(kind);
          const isActive = allowRoiDrawing && roiDrawMode === kind;
          return (
            <DropdownMenuItem
              key={kind}
              onClick={() => handleRoiKindClick(kind)}
              className={`cursor-pointer ${
                isActive
                  ? "bg-green-800 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {kind.charAt(0) + kind.slice(1).toLowerCase()}
              {isActive && <Check className="w-3 h-3 ml-auto" />}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator className="bg-gray-700" />

        {/* Layer Display Controls */}
        <DropdownMenuLabel className="text-gray-400">
          Layer Display
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setShowLayerEdges(!showLayerEdges)}
          className={`cursor-pointer ${
            showLayerEdges
              ? "bg-blue-800 text-white"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <Grid3X3 className="w-4 h-4 mr-2" />
          {showLayerEdges ? "Hide Layer Edges" : "Show Layer Edges"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setShowDebugText(!showDebugText)}
          className={`cursor-pointer ${
            showDebugText
              ? "bg-blue-800 text-white"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <Type className="w-4 h-4 mr-2" />
          {showDebugText ? "Hide Debug Text" : "Show Debug Text"}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700" />

        {/* Scale Selection Controls */}
        {availableScales.length > 1 && (
          <>
            <DropdownMenuLabel className="text-gray-400">
              Render Scales
            </DropdownMenuLabel>
            {availableScales.map((scale) => (
              <DropdownMenuItem
                key={scale}
                onClick={() => toggleScale(scale)}
                className={`cursor-pointer ${
                  enabledScales.has(scale)
                    ? "bg-green-800 text-white"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                <Layers className="w-3 h-3 mr-2" />
                {scale}x
                {enabledScales.has(scale) && (
                  <Check className="w-3 h-3 ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
