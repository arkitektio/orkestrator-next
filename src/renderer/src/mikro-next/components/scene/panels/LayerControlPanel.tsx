import { useDialog } from "@/app/dialog";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useDeleteLayerMutation } from "@/mikro-next/api/graphql";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { LongCommitProfiler } from "../core/commitProfiler";
import { fitsExpanded } from "../core/layerListLayout";
import { assessLayerPoolViability } from "../core/octree/poolViability";
import { perfMonitor } from "../managers/perfMonitor";
import { useModeStore } from "../store/modeStore";
import { useSelectionStore } from "../store/selectionStore";
import { LayerState, useSceneStore } from "../store/sceneStore";
import {
  useViewerStore,
  type UnplannableLayerInfo,
} from "../store/viewerStore";
import { LayerGraphFlyout } from "./layer/LayerGraphFlyout";
import { LayerRow } from "./layer/LayerRow";
import { useRenderGraphEditor } from "./layer/rendergraph/RenderNodeEditor";

const formatBytes = (bytes: number): string =>
  bytes >= 1024 ** 3
    ? `${(bytes / 1024 ** 3).toFixed(1)} GB`
    : `${Math.round(bytes / 1024 ** 2)} MB`;

// Viewport coverage is deliberately GONE from this panel (and from
// LayerViewRange entirely). It used to arrive as a bucketed Record and flow
// into each card as a `viewportPercent` prop — and a changing prop defeats
// `memo(LayerCard)`, so every bucket crossing during a zoom re-rendered the
// card's whole render-graph editor subtree (measured 54–174 ms commits, the
// sidebar's share of gesture jank).

/**
 * The panel's own box, for the auto-expand decision. Bucketed to 32px and
 * compared before commit so dragging the rail's resize handle doesn't re-render
 * the whole layer list on every observer tick — only when a bucket boundary is
 * crossed, which is also the only granularity `fitsExpanded` can act on.
 *
 * `{0, 0}` means "not measured yet" and reads as no space, so the first paint
 * is collapsed rather than briefly unfolding everything.
 */
const useBucketedSize = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const width = Math.round(entry.contentRect.width / 32) * 32;
      const height = Math.round(entry.contentRect.height / 32) * 32;
      setSize((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height },
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
};

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
 * Memoized: the panel re-renders only when a layer's coarse coverage bucket
 * changes (see `layerCoverage`), but the card owns the heavy
 * `useRenderGraphEditor`
 * hook and subtree, so it must only re-render when ITS props change. All
 * callbacks are passed in already-stable (id-parameterized) so the shallow
 * prop compare actually skips.
 */
const LayerCard = memo(function LayerCard({
  layer,
  expanded,
  unplannable,
  onSelect,
  onUpdate,
  onFocus,
  onRemove,
  onClose,
}: {
  layer: LayerState;
  expanded: boolean;
  unplannable?: UnplannableLayerInfo;
  /**
   * Toggle this card. Takes the CURRENT expanded state so the panel's handler
   * can stay stable — the card already knows whether it is open, so the panel
   * never has to read that back out of a ref during render.
   */
  onSelect: (id: string, currentlyExpanded: boolean) => void;
  onUpdate: (updated: LayerState) => void;
  onFocus: (layerId: string) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}) {
  perfMonitor.countRender("LayerCard"); // no-op unless a perf recording is armed
  const editor = useRenderGraphEditor(layer);
  // Adapt the stable id-parameterized panel handlers to the zero-arg forms the
  // children expect. Created inside the memoized card, so they only churn when
  // the card actually re-renders.
  const handleSelect = () => onSelect(layer.id, expanded);
  const handleRemove = () => onRemove(layer.id);
  return (
    <Collapsible
      open={expanded}
      // `@container/card`: the card is its own query context, so a row and its
      // editor adapt to the width the CARD got — which in a multi-column list
      // is not the panel's width. See the panel's container note below.
      className={`@container/card overflow-hidden rounded-lg border backdrop-blur-md bg-black transition-colors ${
        expanded
          ? "border-black/10 bg-black/60"
          : "border-black/10 bg-black/40 hover:border-black/20 hover:bg-black/70"
      }`}
    >
      <LayerRow
        embedded
        layer={layer}
        isSelected={expanded}
        graphDirty={editor.dirty}
        savingGraph={editor.loading}
        onSaveGraph={editor.save}
        onSelect={handleSelect}
        onUpdate={onUpdate}
        onFocus={onFocus}
        onRemove={handleRemove}
      />
      {unplannable && <UnplannableNotice layer={layer} info={unplannable} />}
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="border-t border-white/10">
          <LayerGraphFlyout
            inline
            editor={editor}
            layer={layer}
            onUpdate={onUpdate}
            onClose={onClose}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
});

export const LayerControlPanel = ({
  sceneId,
  variant = "floating",
}: {
  sceneId: string;
  /**
   * Where the panel is hosted. "floating" is the in-viewport overlay stack
   * (pointer events opt back in per card, height bounded by the column);
   * "sidebar" fills a page-rail tab, which hands the panel a plain full-height
   * flex box and expects it to own its scroll.
   */
  variant?: "floating" | "sidebar";
}) => {
  perfMonitor.countRender("LayerControlPanel"); // no-op unless a perf recording is armed
  const { openDialog } = useDialog();
  const layers = useSceneStore((s) => s.layers);
  const updateLayer = useSceneStore((s) => s.updateLayer);
  const selectedLayerId = useSelectionStore((s) => s.selectedLayerId);
  const setSelectedLayerId = useSelectionStore((s) => s.setSelectedLayerId);
  const fitToLayer = useViewerStore((s) => s.fitToLayer);
  // Rarely changes (only when the viability verdict flips) — P17-clean.
  const unplannableLayers = useViewerStore((s) => s.unplannableLayers);
  const [panelRef, panelSize] = useBucketedSize();
  // Per-layer explicit open/closed, keyed by id. Absent = follow the
  // space-derived default; present = the user has said otherwise for that card
  // and resizing the rail must not overrule them.
  const [expandOverrides, setExpandOverrides] = useState<Record<string, boolean>>({});

  // Deleting refetches GetScene, which reinitializes the scene stores so the
  // removed layer drops out — the same store-free path layer creation uses.
  const [deleteLayer] = useDeleteLayerMutation({
    refetchQueries: ["GetScene"],
    awaitRefetchQueries: true,
  });

  // Stable handlers so the memoized LayerCard actually skips re-render during a
  // pan/orbit. The zustand actions (setSelectedLayerId, updateLayer,
  // fitToLayer) are already stable refs; these wrap
  // them without capturing per-render values (selection is read via a ref).
  const selectedRef = useRef(selectedLayerId);
  selectedRef.current = selectedLayerId;

  // Toggling records an explicit choice for that card and moves the selection
  // with it (the 3D layer reads `selectedLayerId` for its highlight). Stable:
  // the card supplies its own current state, so nothing per-render is captured.
  const handleSelect = useCallback(
    (id: string, currentlyExpanded: boolean) => {
      setExpandOverrides((prev) => ({ ...prev, [id]: !currentlyExpanded }));
      setSelectedLayerId(currentlyExpanded ? null : id);
    },
    [setSelectedLayerId],
  );
  const handleClose = useCallback(
    () => setSelectedLayerId(null),
    [setSelectedLayerId],
  );
  const handleRemove = useCallback(
    (id: string) => {
      // Drop the selection first if it points at the layer being removed, so
      // the panel doesn't try to keep an unfolded editor for a gone layer.
      if (selectedRef.current === id) setSelectedLayerId(null);
      void deleteLayer({ variables: { input: { id } } }).catch((e) =>
        toast.error("Could not remove layer: " + (e as Error).message),
      );
    },
    [deleteLayer, setSelectedLayerId],
  );

  // EVERY layer is listed, in scene order — the order NEVER changes while you
  // work. The list used to hide off-view layers behind a "+N off-view" toggle,
  // and then to sort by viewport coverage; both meant the panel's contents moved
  // as you panned, so the layer you were reaching for slid out from under the
  // cursor. Coverage still shows as a per-row badge, it just no longer decides
  // position.
  const shownLayers = layers;

  // Unfold everything when the panel can actually seat it (see
  // `core/layerListLayout.ts`): a wide rail showing three layers has no reason
  // to make you click each one open. What this is NOT is a visibility rule —
  // coverage and frustum no longer open or close anything, so nothing pops open
  // mid-zoom or shuts on the layer you are editing.
  const autoExpand = fitsExpanded(panelSize, layers.length);

  // Explicit choice first, then the space-derived default, then the selection —
  // so a click still unfolds a card in a rail too small to auto-expand.
  const isExpanded = (layer: LayerState) =>
    expandOverrides[layer.id] ?? (autoExpand || layer.id === selectedLayerId);

  // The row IS the button: selecting it unfolds the editor inline within the
  // same card (one border around header + body), rather than popping a
  // separate flyout window.
  const renderRow = (layer: LayerState) => {
    return (
      <LayerCard
        key={layer.id}
        layer={layer}
        expanded={isExpanded(layer)}
        unplannable={unplannableLayers[layer.id]}
        onSelect={handleSelect}
        onUpdate={updateLayer}
        onFocus={fitToLayer}
        onRemove={handleRemove}
        onClose={handleClose}
      />
    );
  };

  return (
    // `@container/layers`: the panel sizes itself to whatever hosts it — the
    // page rail is user-resizable from 10% to 80% of the window — and the list
    // answers to THAT width, not the viewport's. No media queries: the same
    // component in the narrow in-viewport column and in a dragged-open sidebar
    // lays itself out from its own box.
    <LongCommitProfiler id="layers-panel">
    <div
      ref={panelRef}
      className={
        variant === "sidebar"
          ? "@container/layers flex h-full min-h-0 flex-col p-2"
          : "@container/layers pointer-events-none flex min-h-0 flex-1 flex-col items-stretch"
      }
    >
      <div
        className={
          variant === "sidebar"
            ? "flex min-h-0 flex-1 flex-col overflow-y-auto"
            : "pointer-events-auto flex max-h-full flex-col overflow-y-auto"
        }
      >
        {/* One column while narrow; a wide rail unfolds into two and then three
            so the cards stay readable instead of stretching to a full page
            width. `items-start` keeps an unfolded card from dragging its row
            mates taller. */}
        <div className="grid grid-cols-1 items-start gap-1 @2xl/layers:grid-cols-2 @5xl/layers:grid-cols-3">
          {shownLayers.map(renderRow)}
        </div>

        <button
          className="mt-1 self-end rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] text-white/60 backdrop-blur-md transition-colors hover:border-white/20 hover:text-white/90"
          onClick={() =>
            openDialog("addlayer", { scene: sceneId }, { className: "max-w-3xl" })
          }
        >
          + Add layer
        </button>
      </div>
    </div>
    </LongCommitProfiler>
  );
};
