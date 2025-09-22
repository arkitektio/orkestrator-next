import {
  Edit3,
  Eye,
  Layers,
  List,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import { ContextMenuPanel } from "./ContextMenuPanel";
import { DisplayStructuresPanel } from "./DisplayStructuresPanel";
import { LayerControlsPanel } from "./LayerControlsPanel";
import { ObjectInfoPanel } from "./ObjectInfoPanel";
import { RoiToolsPanel } from "./RoiToolsPanel";
import { PanelKind, ViewerPanelProps } from "./types";
import { ViewSettingsPanel } from "./ViewSettingsPanel";

// Helper function to get icon for panel kind
const getPanelKindIcon = (kind?: PanelKind) => {
  switch (kind) {
    case "roi_tools":
      return Edit3;
    case "layer_controls":
      return Layers;
    case "view_settings":
      return Settings;
    case "object_info":
      return Eye;
    case "context_menu":
      return MoreHorizontal;
    case "display_structures":
      return List;
    default:
      return Settings;
  }
};

export const PanelContent = (props: ViewerPanelProps) => {
  const { panel } = props;

  if (panel.isRightClick) {
    return (
      <ContextMenuPanel panel={panel} setOpenPanels={props.setOpenPanels} />
    );
  }

  switch (panel.kind) {
    case "roi_tools":
      return (
        <RoiToolsPanel
          allowRoiDrawing={props.allowRoiDrawing}
          setAllowRoiDrawing={props.setAllowRoiDrawing}
          showRois={props.showRois}
          setShowRois={props.setShowRois}
        />
      );

    case "layer_controls":
      return (
        <LayerControlsPanel
          showLayerEdges={props.showLayerEdges}
          setShowLayerEdges={props.setShowLayerEdges}
          showDebugText={props.showDebugText}
          setShowDebugText={props.setShowDebugText}
        />
      );

    case "view_settings":
      return <ViewSettingsPanel />;

    case "display_structures":
      return (
        <DisplayStructuresPanel
          showDisplayStructures={props.showDisplayStructures}
          setShowDisplayStructures={props.setShowDisplayStructures}
          displayStructures={props.displayStructures}
          removeDisplayStructure={props.removeDisplayStructure}
          clearDisplayStructures={props.clearDisplayStructures}
          rois={props.rois}
        />
      );

    case "object_info":
    default:
      return (
        <ObjectInfoPanel panel={panel} setOpenPanels={props.setOpenPanels} />
      );
  }
};

export { getPanelKindIcon };
