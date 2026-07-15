import { useDialog } from "@/app/dialog";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { assessLayerPoolViability } from "../core/octree/poolViability";
import { isLayerOutOfPlane } from "../core/worldTransform";
import { perfMonitor } from "../managers/perfMonitor";
import { useModeStore } from "../store/modeStore";
import { useSelectionStore } from "../store/selectionStore";
import { LayerState, useSceneStore } from "../store/sceneStore";
import { useViewerStore, type UnplannableLayerInfo } from "../store/viewerStore";
import { LayerGraphFlyout } from "./layer/LayerGraphFlyout";
import { LayerRow } from "./layer/LayerRow";
import { useRenderGraphEditor } from "./layer/rendergraph/RenderNodeEditor";

const formatBytes = (bytes: number): string =>
  bytes >= 1024 ** 3
    ? `${(bytes / 1024 ** 3).toFixed(1)} GB`
    : `${Math.round(bytes / 1024 ** 2)} MB`;

/**
 * Warning strip for a layer refused by the pool-viability guard (P18): its
 * coarsest pyramid level's pinned atlas floor exceeds the GPU budget — usually
 * a dataset with no multiscale pyramid. Offers a one-click mode switch when the
 * OTHER display mode is affordable. Numbers live in the tooltip.
 */
const UnplannableNotice = ({
  layer,
  info,
}: {
  layer: LayerState;
  info: UnplannableLayerInfo;
}) => {
  const getArrayForStoreId = useViewerStore((s) => s.getArrayForStoreId);
  const setDisplayMode = useModeStore((s) => s.setDisplayMode);
  const otherMode = info.mode === "3D" ? "2D" : "3D";
  const otherViable = useMemo(
    () => assessLayerPoolViability(layer, getArrayForStoreId, otherMode)?.viable === true,
    [layer, getArrayForStoreId, otherMode],
  );

  return (
    <div
      className="flex items-center gap-2 border-t border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] text-amber-200"
      title={`This layer has no usable multiscale pyramid: keeping its coarsest level resident would need ${formatBytes(info.floorBytes)} of GPU memory (budget ${formatBytes(info.capBytes)}). Provide a pyramidal (multiscale) version of the data to render it in ${info.mode}.`}
    >
      <span className="min-w-0 flex-1 truncate">
        ⚠ too large for {info.mode} — no usable pyramid
      </span>
      {otherViable && (
        <button
          className="shrink-0 rounded border border-amber-400/40 px-1.5 py-0.5 font-medium transition-colors hover:bg-amber-400/20"
          onClick={() => setDisplayMode(otherMode)}
        >
          switch to {otherMode}
        </button>
      )}
    </div>
  );
};

/**
 * One expandable layer card. Owns the layer's render-graph editing state (so it
 * survives collapsing) and shares it between the header — which hosts the tiny
 * Save button — and the unfolded editor body.
 *
 * Memoized: the panel re-renders whenever `layerViewRanges` changes (which can
 * still happen when a layer's integer view range or LOD scale changes), but the
 * card owns the heavy `useRenderGraphEditor` hook and subtree, so it must only
 * re-render when ITS props change. All callbacks are passed in already-stable
 * (id-parameterized) so the shallow prop compare actually skips.
 */
const LayerCard = memo(function LayerCard({
  layer,
  expanded,
  originalLayer,
  isArmed,
  viewportPercent,
  unplannable,
  onSelect,
  onToggleArm,
  onUpdate,
  onFocus,
  onClose,
}: {
  layer: LayerState;
  expanded: boolean;
  originalLayer: LayerState | undefined;
  isArmed: boolean;
  viewportPercent?: number;
  unplannable?: UnplannableLayerInfo;
  onSelect: (id: string) => void;
  onToggleArm: (id: string) => void;
  onUpdate: (updated: LayerState) => void;
  onFocus: (layerId: string) => void;
  onClose: () => void;
}) {
  perfMonitor.countRender("LayerCard"); // no-op unless a perf recording is armed
  const editor = useRenderGraphEditor(layer);
  // Adapt the stable id-parameterized panel handlers to the zero-arg forms the
  // children expect. Created inside the memoized card, so they only churn when
  // the card actually re-renders.
  const handleSelect = () => onSelect(layer.id);
  const handleToggleArm = () => onToggleArm(layer.id);
  return (
    <Collapsible
      open={expanded}
      className={`overflow-hidden rounded-lg border backdrop-blur-md bg-black transition-colors ${
        expanded
          ? "border-black/10 bg-black/60"
          : "border-black/10 bg-black/40 hover:border-black/20 hover:bg-black/70"
      }`}
    >
      <LayerRow
        embedded
        layer={layer}
        originalLayer={originalLayer}
        isArmed={isArmed}
        isSelected={expanded}
        viewportPercent={viewportPercent}
        graphDirty={editor.dirty}
        savingGraph={editor.loading}
        onSaveGraph={editor.save}
        onSelect={handleSelect}
        onToggleArm={handleToggleArm}
        onUpdate={onUpdate}
        onFocus={onFocus}
      />
      {unplannable && <UnplannableNotice layer={layer} info={unplannable} />}
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="border-t border-white/10">
          <LayerGraphFlyout
            inline
            editor={editor}
            layer={layer}
            isArmed={isArmed}
            onUpdate={onUpdate}
            onToggleArm={handleToggleArm}
            onClose={onClose}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
});

export const LayerControlPanel = ({ sceneId }: { sceneId: string }) => {
  perfMonitor.countRender("LayerControlPanel"); // no-op unless a perf recording is armed
  const { openDialog } = useDialog();
  const layers = useSceneStore((s) => s.layers);
  const originalLayers = useSceneStore((s) => s.originalLayers);
  const updateLayer = useSceneStore((s) => s.updateLayer);
  const armedLayerIds = useSelectionStore((s) => s.armedLayerIds);
  const selectedLayerId = useSelectionStore((s) => s.selectedLayerId);
  const setSelectedLayerId = useSelectionStore((s) => s.setSelectedLayerId);
  const toggleArmedLayerId = useSelectionStore((s) => s.toggleArmedLayerId);
  const fitToLayer = useViewerStore((s) => s.fitToLayer);
  const visibleLayers = useViewerStore((s) => s.visibleLayers);
  const layerViewRanges = useViewerStore((s) => s.layerViewRanges);
  // Rarely changes (only when the viability verdict flips) — P17-clean.
  const unplannableLayers = useViewerStore((s) => s.unplannableLayers);
  const currentZ = useViewerStore((s) => s.currentZ);
  const displayMode = useModeStore((s) => s.displayMode);
  const [showOffscreen, setShowOffscreen] = useState(false);

  // Stable handlers so the memoized LayerCard actually skips re-render during a
  // pan/orbit. The zustand actions (setSelectedLayerId, toggleArmedLayerId,
  // updateLayer, fitToLayer) are already stable refs; these wrap
  // them without capturing per-render values (selection is read via a ref).
  const selectedRef = useRef(selectedLayerId);
  selectedRef.current = selectedLayerId;

  const handleSelect = useCallback(
    (id: string) => setSelectedLayerId(selectedRef.current === id ? null : id),
    [setSelectedLayerId],
  );
  const handleToggleArm = useCallback(
    (id: string) => toggleArmedLayerId(id),
    [toggleArmedLayerId],
  );
  const handleClose = useCallback(
    () => setSelectedLayerId(null),
    [setSelectedLayerId],
  );

  // A layer is "in view" when it is inside the camera frustum
  // (viewerStore.visibleLayers) AND — in 2D — its data intersects the current Z
  // plane. Out-of-plane layers (from scrubbing the Z slider) are treated like
  // off-screen ones. Not the per-layer on/off `visible` flag.
  const inViewSet = new Set(visibleLayers);
  const isInView = (l: LayerState) =>
    (inViewSet.has(l.id) &&
      !(displayMode === "2D" && isLayerOutOfPlane(l, currentZ))) ||
    // Unplannable layers never mount a mesh, so they are never "visible" —
    // but their warning must not hide behind the off-view toggle.
    unplannableLayers[l.id] !== undefined;

  // Rough share of the viewport each layer covers (see LayerViewRange
  // viewportFraction); missing = off-view, which sorts to the bottom.
  const coverageOf = (id: string) => layerViewRanges[id]?.viewportFraction ?? -1;
  const byCoverageDesc = (a: LayerState, b: LayerState) =>
    coverageOf(b.id) - coverageOf(a.id);

  // Layers are listed most-covering first, so the dominant layer is on top.
  const inViewLayers = layers.filter(isInView).sort(byCoverageDesc);
  const offscreenLayers = layers.filter((l) => !isInView(l));
  // Only layers currently in view are shown by default; the rest stay collapsed
  // behind the "+N off-view" toggle.
  const shownLayers = showOffscreen
    ? [...layers].sort(byCoverageDesc)
    : inViewLayers;

  // A layer's editor is unfolded when the user explicitly selected it, when it
  // is the only layer in view, or when it covers more than 60% of the viewport.
  // The last case is per-layer, so several overlapping layers can be unfolded at
  // the same time (no single "selected" fallback).
  const isExpanded = (layer: LayerState) =>
    layer.id === selectedLayerId ||
    inViewLayers.length === 1 ||
    coverageOf(layer.id) > 0.45;

  // The row IS the button: selecting it unfolds the editor inline within the
  // same card (one border around header + body), rather than popping a
  // separate flyout window.
  const renderRow = (layer: LayerState) => {
    const fraction = layerViewRanges[layer.id]?.viewportFraction;
    return (
      <LayerCard
        key={layer.id}
        layer={layer}
        expanded={isExpanded(layer)}
        originalLayer={originalLayers.find((o) => o.id === layer.id)}
        isArmed={armedLayerIds.includes(layer.id)}
        viewportPercent={fraction != null ? Math.round(fraction * 100) : undefined}
        unplannable={unplannableLayers[layer.id]}
        onSelect={handleSelect}
        onToggleArm={handleToggleArm}
        onUpdate={updateLayer}
        onFocus={fitToLayer}
        onClose={handleClose}
      />
    );
  };

  return (
    <div className="pointer-events-none flex min-h-0 flex-1 flex-col items-stretch">
      <div className="pointer-events-auto flex max-h-full flex-col gap-1 overflow-y-auto">
        {shownLayers.map(renderRow)}

        {offscreenLayers.length > 0 && (
          <button
            className="self-end rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] text-white/60 backdrop-blur-md transition-colors hover:border-white/20 hover:text-white/90"
            onClick={() => setShowOffscreen((v) => !v)}
          >
            {showOffscreen
              ? "Hide off-view"
              : `+${offscreenLayers.length} off-view`}
          </button>
        )}

        <button
          className="self-end rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] text-white/60 backdrop-blur-md transition-colors hover:border-white/20 hover:text-white/90"
          onClick={() =>
            openDialog("addlayer", { scene: sceneId }, { className: "max-w-3xl" })
          }
        >
          + Add layer
        </button>
      </div>
    </div>
  );
};
