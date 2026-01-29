import { DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { RoiKind } from "@/mikro-next/api/graphql";
import {
  Check,
  Circle,
  Edit3,
  MapPin,
  Minus,
  MoreHorizontal,
  Square,
} from "lucide-react";
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

interface ContextMenu {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  x: number;
  y: number;
}

export const ContextMenu = ({ open, onOpenChange, x, y }: ContextMenu) => {
  const {
    allowRoiDrawing,
    roiDrawMode,
    setShowRois,
    setAllowRoiDrawing,
    setRoiDrawMode,
  } = useViewerState();

  const handleRoiKindClick = (kind: RoiKind) => {
    // Auto-toggle: enable ROI drawing, show ROIs, and set the mode
    setShowRois(true);
    setAllowRoiDrawing(true);
    setRoiDrawMode(kind);
    onOpenChange(false); // Close the menu
  };

  if (!open) return null;

  return (
    <div
      className="fixed z-50 bg-gray-900 border border-gray-700 rounded-md shadow-lg"
      style={{
        left: x,
        top: y,
      }}
    >
      <div className="w-56 p-1">
        <DropdownMenuLabel className="text-gray-400 px-3 py-2">
          ROI Drawing Tools
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
            <div
              key={kind}
              onClick={() => handleRoiKindClick(kind)}
              className={`flex items-center px-3 py-2 text-sm cursor-pointer rounded ${
                isActive
                  ? "bg-green-800 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {kind.charAt(0) + kind.slice(1).toLowerCase()}
              {isActive && <Check className="w-3 h-3 ml-auto" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
