import { Button } from "@/components/ui/button";
import { Crosshair, Eye, EyeOff, Focus, Save, Trash2 } from "lucide-react";
import { LayerState } from "../../store/sceneStore";
import { useViewerStore } from "../../store/viewerStore";
import {
  FLAVOR_BADGE_CLASSES,
  layerDisplayLabel,
  layerFlavor,
} from "./layerIdentity";
import { layerSwatchBackground } from "./renderGraphSwatch";

/**
 * A single compact layer row for the right-hand Layers panel. Displays a
 * colormap swatch, the layer name and quick toggles (probe target, visibility,
 * focus). Clicking the row selects the layer, which unfolds the render graph
 * inside the same card. All detailed editing lives there, never here.
 *
 * The row is width-adaptive against its CARD (`@container/card`, set by
 * `LayerControlPanel`), not the window: the name always survives, and the
 * secondary badges join back in as the container earns the room for them. A
 * narrow in-viewport column and a dragged-open sidebar rail therefore get
 * genuinely different rows out of one component.
 */
export const LayerRow = ({
  layer,
  isSelected,
  onSelect,
  onUpdate,
  onFocus,
  onRemove,
  embedded = false,
  graphDirty = false,
  savingGraph = false,
  onSaveGraph,
}: {
  layer: LayerState;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updated: LayerState) => void;
  onFocus: (layerId: string) => void;
  /** Remove the layer from its scene. */
  onRemove?: () => void;
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
  const label = layerDisplayLabel(layer);
  const flavor = layerFlavor(layer);
  const hidden = layer.visible === false;
  // Selected down to a boolean, so pinning re-renders only the two rows whose
  // answer actually changed rather than every row in the list.
  const isProbeTarget = useViewerStore((s) => s.probeLayerId === layer.id);
  const setProbeLayerId = useViewerStore((s) => s.setProbeLayerId);

  return (
    <div
      className={`group flex items-center gap-1.5 px-2 py-1.5 cursor-pointer @xs/card:gap-2 @xs/card:px-2.5 ${
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
      {/* Secondary to the name: the flavor badge only competes for width once
          the card is wide enough to seat both without truncating. */}
      <span
        className={`hidden shrink-0 rounded-full border px-1.5 text-[9px] leading-4 @3xs/card:inline-block ${FLAVOR_BADGE_CLASSES[flavor]}`}
        title="What kind of data this layer paints"
      >
        {flavor}
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
      {/* Always reachable at every width — a row you cannot hide or focus from
          is worse than a cramped one. Only the hit area grows with the card. */}
      <div className="flex shrink-0 items-center opacity-60 transition-opacity group-hover:opacity-100 @md/card:opacity-100">
        {/* Pin the probe to this layer. Stacked layers otherwise let the
            front-most one claim every pointer event, so this is how you read
            the one underneath. Pinning also enters PROBE — clicking "probe
            this layer" while navigating and having nothing happen would be a
            dead end. */}
        <Button
          variant="ghost"
          size="xs"
          className={
            isProbeTarget
              ? "h-6 w-6 p-0 text-sky-300 hover:text-sky-200 @md/card:h-7 @md/card:w-7"
              : "h-6 w-6 p-0 text-white/70 hover:text-white @md/card:h-7 @md/card:w-7"
          }
          // A hidden layer draws no mesh, so it can answer no probe — pinning
          // it would silence probing entirely (`layerAnswersProbe`).
          disabled={hidden}
          title={
            hidden
              ? "A hidden layer cannot be probed"
              : isProbeTarget
                ? "Only this layer answers the probe — click to read the front-most layer again"
                : "Probe this layer, whatever is drawn in front of it"
          }
          onClick={(e) => {
            e.stopPropagation();
            // Pin ONLY: choosing which layer answers the probe must not yank
            // the whole scene into PROBE mode — the user may be mid-navigation
            // or mid-annotation and just setting up the target for later.
            setProbeLayerId(isProbeTarget ? null : layer.id);
          }}
        >
          <Crosshair className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="xs"
          className="h-6 w-6 p-0 text-white/70 hover:text-white @md/card:h-7 @md/card:w-7"
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
          className="h-6 w-6 p-0 text-white/70 hover:text-white @md/card:h-7 @md/card:w-7"
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
            className="h-6 w-6 p-0 text-white/70 hover:text-red-400 @md/card:h-7 @md/card:w-7"
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
