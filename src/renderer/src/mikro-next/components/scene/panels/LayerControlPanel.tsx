import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useUpdateLaterMutation } from "@/mikro-next/api/graphql";
import { useState } from "react";
import { isLayerOutOfPlane } from "../core/worldTransform";
import { useModeStore } from "../store/modeStore";
import { useSelectionStore } from "../store/selectionStore";
import { LayerState, useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";
import { LayerGraphFlyout } from "./layer/LayerGraphFlyout";
import { LayerRow } from "./layer/LayerRow";
import { useRenderGraphEditor } from "./layer/rendergraph/RenderNodeEditor";

/**
 * One expandable layer card. Owns the layer's render-graph editing state (so it
 * survives collapsing) and shares it between the header — which hosts the tiny
 * Save button — and the unfolded editor body.
 */
const LayerCard = ({
  layer,
  expanded,
  originalLayer,
  isArmed,
  viewportPercent,
  onSelect,
  onToggleArm,
  onUpdate,
  onFocus,
  onSaveDims,
  onClose,
}: {
  layer: LayerState;
  expanded: boolean;
  originalLayer: LayerState | undefined;
  isArmed: boolean;
  viewportPercent?: number;
  onSelect: () => void;
  onToggleArm: () => void;
  onUpdate: (updated: LayerState) => void;
  onFocus: (layerId: string) => void;
  onSaveDims: (layer: LayerState) => void;
  onClose: () => void;
}) => {
  const editor = useRenderGraphEditor(layer);
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
        onSelect={onSelect}
        onToggleArm={onToggleArm}
        onUpdate={onUpdate}
        onFocus={onFocus}
      />
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="border-t border-white/10">
          <LayerGraphFlyout
            inline
            editor={editor}
            layer={layer}
            originalLayer={originalLayer}
            isArmed={isArmed}
            onUpdate={onUpdate}
            onToggleArm={onToggleArm}
            onSave={onSaveDims}
            onClose={onClose}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const LayerControlPanel = () => {
  const layers = useSceneStore((s) => s.layers);
  const originalLayers = useSceneStore((s) => s.originalLayers);
  const updateLayer = useSceneStore((s) => s.updateLayer);
  const markLayerClean = useSceneStore((s) => s.markLayerClean);
  const armedLayerIds = useSelectionStore((s) => s.armedLayerIds);
  const selectedLayerId = useSelectionStore((s) => s.selectedLayerId);
  const setSelectedLayerId = useSelectionStore((s) => s.setSelectedLayerId);
  const toggleArmedLayerId = useSelectionStore((s) => s.toggleArmedLayerId);
  const fitToLayer = useViewerStore((s) => s.fitToLayer);
  const visibleLayers = useViewerStore((s) => s.visibleLayers);
  const layerViewRanges = useViewerStore((s) => s.layerViewRanges);
  const currentZ = useViewerStore((s) => s.currentZ);
  const displayMode = useModeStore((s) => s.displayMode);
  const [updateLater] = useUpdateLaterMutation();
  const [showOffscreen, setShowOffscreen] = useState(false);

  // Contrast/colormap/color live in the render graph (saved by the render-graph
  // editor); this persists only the dimension mapping.
  const saveLayer = (layer: LayerState) => {
    updateLater({
      variables: {
        input: {
          id: layer.id,
          xDim: layer.xDim,
          yDim: layer.yDim,
          zDim: layer.zDim,
          intensityDim: layer.intensityDim,
        },
      },
    });
    markLayerClean(layer.id);
  };

  if (layers.length === 0) return null;

  // A layer is "in view" when it is inside the camera frustum
  // (viewerStore.visibleLayers) AND — in 2D — its data intersects the current Z
  // plane. Out-of-plane layers (from scrubbing the Z slider) are treated like
  // off-screen ones. Not the per-layer on/off `visible` flag.
  const inViewSet = new Set(visibleLayers);
  const isInView = (l: LayerState) =>
    inViewSet.has(l.id) &&
    !(displayMode === "2D" && isLayerOutOfPlane(l, currentZ));

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
        onSelect={() =>
          setSelectedLayerId(layer.id === selectedLayerId ? null : layer.id)
        }
        onToggleArm={() => toggleArmedLayerId(layer.id)}
        onUpdate={updateLayer}
        onFocus={fitToLayer}
        onSaveDims={saveLayer}
        onClose={() => setSelectedLayerId(null)}
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
      </div>
    </div>
  );
};
