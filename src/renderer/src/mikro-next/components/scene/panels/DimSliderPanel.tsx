import { useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { buildSliceMap, resolveCollapsedSelection } from "../core/selection";
import { collapsibleDims } from "../core/sliceSignature";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";

/**
 * Scene-wide scrubbers for the COLLAPSIBLE dims (t, tau, … — everything not
 * mapped to x/y/z/intensity), one horizontal slider per dim NAME, bottom-
 * centered (napari-style), in BOTH display modes (unlike the 2D-only
 * z-slider: z is a spatial brick axis, these select which data to fetch).
 *
 * Scrubbing writes `viewerStore.dimSelections[dim]`, which enters the slice
 * SIGNATURE of every layer carrying that dim → debounced replan → wholesale
 * pool flush + refetch (by design: a different t is different data in every
 * brick). Layers without the dim are untouched. Scrubbing back to a recently
 * visited index re-repacks from the decoded-chunk LRU without refetching.
 */

type DimScrubber = {
  dim: string;
  /** Slider range: 0 … max extent − 1 across layers carrying the dim. */
  maxIndex: number;
  /** What renders when no selection exists (the lens' collapsed default). */
  defaultIndex: number;
  /** Per-layer readouts: the layer-clamped index actually shown. */
  perLayer: { id: string; index: number; maxIndex: number }[];
};

export const DimSliderPanel = () => {
  const layers = useSceneStore((s) => s.layers);
  const dimSelections = useViewerStore((s) => s.dimSelections);
  const setDimSelection = useViewerStore((s) => s.setDimSelection);

  const scrubbers = useMemo((): DimScrubber[] => {
    const byDim = new Map<string, DimScrubber>();
    for (const layer of layers) {
      if (layer.visible === false) continue;
      const sliceMap = buildSliceMap(layer.lens.slices);
      for (const dim of collapsibleDims(layer)) {
        const position = layer.lens.axisNames.indexOf(dim);
        const extent = layer.lens.shape[position] ?? 1;
        const layerDefault = resolveCollapsedSelection(sliceMap[dim], extent);
        const selected = dimSelections[dim];
        const shown =
          selected !== undefined
            ? Math.max(0, Math.min(extent - 1, Math.round(selected)))
            : layerDefault;
        const existing = byDim.get(dim);
        if (existing) {
          existing.maxIndex = Math.max(existing.maxIndex, extent - 1);
          existing.perLayer.push({ id: layer.id, index: shown, maxIndex: extent - 1 });
        } else {
          byDim.set(dim, {
            dim,
            maxIndex: extent - 1,
            defaultIndex: layerDefault,
            perLayer: [{ id: layer.id, index: shown, maxIndex: extent - 1 }],
          });
        }
      }
    }
    return [...byDim.values()].sort((a, b) => a.dim.localeCompare(b.dim));
  }, [layers, dimSelections]);

  if (scrubbers.length === 0) return null;

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex flex-col gap-1.5">
      {scrubbers.map((scrubber) => {
        const value = dimSelections[scrubber.dim] ?? scrubber.defaultIndex;
        return (
          <div
            key={scrubber.dim}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1.5 shadow-md"
          >
            <span className="w-8 text-right text-[10px] font-medium uppercase text-muted-foreground select-none">
              {scrubber.dim}
            </span>
            <div className="w-56">
              <Slider
                min={0}
                max={scrubber.maxIndex}
                step={1}
                value={[value]}
                onValueChange={([v]) => setDimSelection(scrubber.dim, v)}
              />
            </div>
            <span className="w-14 text-[10px] tabular-nums text-muted-foreground select-none">
              {value}/{scrubber.maxIndex}
            </span>
            {scrubber.perLayer.length > 1 && (
              <span className="text-[9px] tabular-nums text-muted-foreground select-none">
                {scrubber.perLayer.map((entry) => `${entry.index}/${entry.maxIndex}`).join(" · ")}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
