import { useMemo } from 'react'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { useSceneDockOrientation, type SceneDockOrientation } from '../SceneDock'
import { buildSliceMap, resolveCollapsedSelection } from '../../platform/coords/selection'
import { collapsibleDims } from '../../platform/model/sliceSignature'
import { useSceneStore } from '../../platform/stores/sceneStore'
import { useViewerStore } from '../../platform/stores/viewerStore'

/**
 * Scene-wide scrubbers for the COLLAPSIBLE dims (t, tau, … — everything not
 * mapped to x/y/z/intensity), one slider per dim NAME, in BOTH display modes
 * (unlike the 2D-only z-slider: z is a spatial brick axis, these select which
 * data to fetch). Where they sit is the host's call — see Scene.Dock; the
 * default composition keeps them bottom-centred, napari-style.
 *
 * Scrubbing writes `viewerStore.dimSelections[dim]`, which enters the slice
 * SIGNATURE of every layer carrying that dim → debounced replan → wholesale
 * pool flush + refetch (by design: a different t is different data in every
 * brick). Layers without the dim are untouched. Scrubbing back to a recently
 * visited index re-repacks from the decoded-chunk LRU without refetching.
 *
 * TWO SOURCES, because there are two kinds of layer. The brick layers declare
 * their dims through a LENS (`collapsibleDims` reads its axis names, shape and
 * slices), and that is where every dim but one comes from. A TRACK layer has no
 * lens at all — it is a table, and its time is a column — so it publishes the
 * extent it actually observed into `sceneStore.trackTimeExtents` once its read
 * lands, and that is folded in below under the same `t`. Without that second
 * fold a scene of only tracks would offer nothing to scrub, and its tail would
 * be frozen at the end of the data.
 */

/** The dim a track layer's time joins — the same one a brick layer's t uses. */
const TIME_DIM = 't'

type DimScrubber = {
  dim: string
  /** Slider range: 0 … max extent − 1 across layers carrying the dim. */
  maxIndex: number
  /** What renders when no selection exists (the lens' collapsed default). */
  defaultIndex: number
  /** Per-layer readouts: the layer-clamped index actually shown. */
  perLayer: { id: string; index: number; maxIndex: number }[]
}

/**
 * Follows its dock's orientation, falling back to horizontal — the shape it has
 * had since it lived hardcoded, bottom-centred. Pass `orientation` to override a
 * dock, or to place it outside one.
 */
export const DimSliderPanel = ({
  orientation: orientationProp
}: {
  orientation?: SceneDockOrientation
} = {}) => {
  const dockOrientation = useSceneDockOrientation('horizontal')
  const orientation = orientationProp ?? dockOrientation
  const layers = useSceneStore((s) => s.layers)
  const trackTimeExtents = useSceneStore((s) => s.trackTimeExtents)
  const dimSelections = useViewerStore((s) => s.dimSelections)
  const setDimSelection = useViewerStore((s) => s.setDimSelection)

  const scrubbers = useMemo((): DimScrubber[] => {
    const byDim = new Map<string, DimScrubber>()
    for (const layer of layers) {
      if (layer.visible === false) continue
      const sliceMap = buildSliceMap(layer.lens.slices)
      for (const dim of collapsibleDims(layer)) {
        const position = layer.lens.axisNames.indexOf(dim)
        const extent = layer.lens.shape[position] ?? 1
        const layerDefault = resolveCollapsedSelection(sliceMap[dim], extent)
        const selected = dimSelections[dim]
        const shown =
          selected !== undefined
            ? Math.max(0, Math.min(extent - 1, Math.round(selected)))
            : layerDefault
        const existing = byDim.get(dim)
        if (existing) {
          existing.maxIndex = Math.max(existing.maxIndex, extent - 1)
          existing.perLayer.push({ id: layer.id, index: shown, maxIndex: extent - 1 })
        } else {
          byDim.set(dim, {
            dim,
            maxIndex: extent - 1,
            defaultIndex: layerDefault,
            perLayer: [{ id: layer.id, index: shown, maxIndex: extent - 1 }]
          })
        }
      }
    }
    // The non-lens fold. A track layer joins whatever `t` scrubber the brick
    // layers already produced rather than minting its own — a track and the
    // image it was tracked on share one timeline, and two sliders labelled `t`
    // would be a lie about that. Its extent widens the shared range where the
    // table runs longer than the image.
    for (const [layerId, maxIndex] of Object.entries(trackTimeExtents)) {
      if (maxIndex < 1) continue
      const selected = dimSelections[TIME_DIM]
      const shown =
        selected !== undefined
          ? Math.max(0, Math.min(maxIndex, Math.round(selected)))
          : maxIndex
      const existing = byDim.get(TIME_DIM)
      if (existing) {
        existing.maxIndex = Math.max(existing.maxIndex, maxIndex)
        existing.perLayer.push({ id: layerId, index: shown, maxIndex })
      } else {
        byDim.set(TIME_DIM, {
          dim: TIME_DIM,
          maxIndex,
          // A track with no selection shows its whole trajectory, so the
          // default index is the END of its timeline rather than 0 — opening a
          // scene on an empty viewport would read as a broken layer.
          defaultIndex: maxIndex,
          perLayer: [{ id: layerId, index: shown, maxIndex }]
        })
      }
    }

    return [...byDim.values()].sort((a, b) => a.dim.localeCompare(b.dim))
  }, [layers, dimSelections, trackTimeExtents])

  if (scrubbers.length === 0) return null

  const vertical = orientation === 'vertical'

  // One tray per dim, stacked across the dock's short axis so the sliders stay
  // parallel to each other whichever edge they are on.
  return (
    <div className={cn('flex gap-1.5', vertical ? 'flex-row' : 'flex-col')}>
      {scrubbers.map((scrubber) => {
        const value = dimSelections[scrubber.dim] ?? scrubber.defaultIndex
        return (
          <div
            key={scrubber.dim}
            className={cn(
              'pointer-events-auto flex items-center bg-background/80 backdrop-blur-sm rounded-md shadow-md',
              vertical ? 'flex-col gap-1 px-1.5 py-2' : 'flex-row gap-2 px-2 py-1.5'
            )}
          >
            <span
              className={cn(
                'text-[10px] font-medium uppercase text-muted-foreground select-none',
                !vertical && 'w-8 text-right'
              )}
            >
              {scrubber.dim}
            </span>
            <div className={vertical ? 'h-48' : 'w-56'}>
              <Slider
                orientation={orientation}
                min={0}
                max={scrubber.maxIndex}
                step={1}
                value={[value]}
                onValueChange={([v]) => setDimSelection(scrubber.dim, v)}
              />
            </div>
            <span
              className={cn(
                'text-[10px] tabular-nums text-muted-foreground select-none',
                !vertical && 'w-14'
              )}
            >
              {value}/{scrubber.maxIndex}
            </span>
            {scrubber.perLayer.length > 1 && (
              <span
                className={cn(
                  'tabular-nums text-muted-foreground select-none text-[9px]',
                  vertical && 'flex flex-col items-center'
                )}
              >
                {vertical
                  ? scrubber.perLayer.map((entry) => (
                      <span key={entry.id}>
                        {entry.index}/{entry.maxIndex}
                      </span>
                    ))
                  : scrubber.perLayer
                      .map((entry) => `${entry.index}/${entry.maxIndex}`)
                      .join(' · ')}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
