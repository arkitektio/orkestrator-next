import { ListRoiFragment } from "@/mikro-next/api/graphql";
import { Dispatch, SetStateAction } from "react";

export type PanelKind =
  | "roi_tools"
  | "layer_controls"
  | "view_settings"
  | "object_info"
  | "context_menu"
  | "display_structures";

export interface Panel {
  identifier: string;
  object: string;
  positionX: number;
  positionY: number;
  kind?: PanelKind;
  isRightClick?: boolean;
}

export interface BasePanelProps {
  panel: Panel;
  setOpenPanels: Dispatch<SetStateAction<Panel[]>>;
}

export interface ViewerPanelProps extends BasePanelProps {
  allowRoiDrawing: boolean;
  setAllowRoiDrawing: (allow: boolean) => void;
  showRois: boolean;
  setShowRois: (show: boolean) => void;
  showLayerEdges: boolean;
  setShowLayerEdges: (show: boolean) => void;
  showDebugText: boolean;
  setShowDebugText: (show: boolean) => void;
  showDisplayStructures: boolean;
  setShowDisplayStructures: (show: boolean) => void;
  displayStructures: string[];
  removeDisplayStructure: (roiId: string) => void;
  clearDisplayStructures: () => void;
  rois: ListRoiFragment[];
}
