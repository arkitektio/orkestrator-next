import { Button } from "@/components/ui/button";
import { Crosshair, Eye, EyeOff, Focus, Save, Trash2 } from "lucide-react";
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
  onRemove,
  embedded = false,
  viewportPercent,
  graphDirty = false,
  savingGraph = false,
  onSaveGraph,
}: {
  layer: LayerState;
  originalLayer: LayerState | undefined;
  isArmed: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggleArm: () => void;
  onUpdate: (updated: LayerState) => void;
  onFocus: (layerId: string) => void;
  /** Remove the layer from its scene. */
  onRemove?: () => void;
  /**
   * Rough percentage of the viewport this layer occupies, shown as a small
   * badge. Undefined for off-view layers (no coverage entry).
   */
  viewportPercent?: number;
  /**
   * When true the row is the header of an already-styled card (the expandable
   * layer card), so it drops its own border / background / rounding and just
   * renders the flex header inline.
   */
  embedded?: boolean;
  /** The render graph has unsaved edits — surfaces a tiny Save button. */
  graphDirty?: boolean;
  /** Save mutation in flight (disables the button). */
  savingGraph?: boolean;
  /** Persist the unsaved render-graph edits. */
  onSaveGraph?: () => void;
}) => {
  const dirty = isLayerDirty(layer, originalLayer);
  const label =
    layer.lens.activeAnchors.filter((a) => a.channelLabel)?.[0]?.channelLabel
      ?.label ?? "Untitled Layer";
  const hidden = layer.visible === false;

  return (
    <div
      className={`group flex items-center gap-2 px-2 py-1.5 cursor-pointer ${
        embedded
          ? "transition-colors"
          : `rounded-lg border backdrop-blur-md transition-colors ${
              isSelected
                ? "border-white/40 bg-white/10"
                : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5"
            }`
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
      {graphDirty && onSaveGraph && (
        <button
          className="shrink-0 rounded p-0.5 text-yellow-300/90 transition-colors hover:text-yellow-200 disabled:opacity-50"
          title="Save changes"
          disabled={savingGraph}
          onClick={(e) => {
            e.stopPropagation();
            onSaveGraph();
          }}
        >
          <Save className="h-3 w-3" />
        </button>
      )}
      {viewportPercent != null && (
        <span
          className="shrink-0 text-[10px] tabular-nums text-white/40"
          title="Rough share of the viewport this layer covers"
        >
          {viewportPercent > 0 ? `${viewportPercent}%` : "<1%"}
        </span>
      )}
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
        {onRemove && (
          <Button
            variant="ghost"
            size="xs"
            className="h-6 w-6 p-0 text-white/70 hover:text-red-400"
            title="Remove layer from scene"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};
