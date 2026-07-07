import { Button } from "@/components/ui/button";
import { Crosshair, Eye, EyeOff, Focus } from "lucide-react";
import { LayerState } from "../../store/sceneStore";
import { isLayerDirty } from "./colormap-utils";
import { layerSwatchBackground } from "./renderGraphSwatch";

/**
 * A single compact layer row for the right-hand Layers panel. Displays a
 * colormap swatch, the layer name and quick toggles (visibility, focus, arm).
 * Clicking the row selects the layer, which opens the render-graph flyout to
 * the left. All detailed editing lives in that flyout, never here.
 */
export const LayerRow = ({
  layer,
  originalLayer,
  isArmed,
  isSelected,
  onSelect,
  onToggleArm,
  onUpdate,
  onFocus,
}: {
  layer: LayerState;
  originalLayer: LayerState | undefined;
  isArmed: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggleArm: () => void;
  onUpdate: (updated: LayerState) => void;
  onFocus: (layerId: string) => void;
}) => {
  const dirty = isLayerDirty(layer, originalLayer);
  const label =
    layer.lens.activeAnchors.filter((a) => a.channelLabel)?.[0]?.channelLabel
      ?.label ?? "Untitled Layer";
  const hidden = layer.visible === false;

  return (
    <div
      className={`group flex items-center gap-2 rounded-lg border px-2 py-1.5 backdrop-blur-md transition-colors cursor-pointer ${
        isSelected
          ? "border-white/40 bg-white/10"
          : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5"
      } ${hidden ? "opacity-50" : ""}`}
      onClick={onSelect}
    >
      <span
        className="h-3 w-3 shrink-0 rounded-full ring-1 ring-black/30"
        style={{ background: layerSwatchBackground(layer.channels) }}
      />
      <span className="min-w-0 flex-1 truncate text-xs font-medium text-white/90">
        {label}
      </span>
      {dirty && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400"
          title="Unsaved changes"
        />
      )}
      <div className="flex shrink-0 items-center opacity-60 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="xs"
          className={`h-6 w-6 p-0 ${
            isArmed
              ? "text-cyan-200 hover:text-cyan-100"
              : "text-white/70 hover:text-white"
          }`}
          title={isArmed ? "Disarm ROI constraints" : "Arm for ROI constraints"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleArm();
          }}
        >
          <Crosshair className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="xs"
          className="h-6 w-6 p-0 text-white/70 hover:text-white"
          title="Fit camera to layer"
          onClick={(e) => {
            e.stopPropagation();
            onFocus(layer.id);
          }}
        >
          <Focus className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="xs"
          className="h-6 w-6 p-0 text-white/70 hover:text-white"
          title="Toggle visibility"
          onClick={(e) => {
            e.stopPropagation();
            onUpdate({ ...layer, visible: hidden ? true : false });
          }}
        >
          {hidden ? (
            <EyeOff className="h-3 w-3 text-white/50" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
};
