import { useEffect } from 'react'
import { useSceneStoreApi } from '../store/sceneStore'
import { useViewerStoreApi } from '../store/viewerStore'
import { useViewStoreApi } from '../store/viewStore'
import { startVisibilityTracking } from './visibilityTracker'
import { startChunkPlanTracking } from './chunkPlanTracker'

/**
 * Mount point for the store-level scene managers: the visibility tracker
 * (camera → per-layer visible voxel ranges) and the chunk-plan tracker
 * (ranges + rendered-chunk feedback → declarative per-layer chunk plans).
 * Holds no reactive state — the store APIs are stable — so this component
 * renders once and never again; all reactivity lives in the trackers'
 * subscriptions and the pure math in `core/visibility.ts` /
 * `core/chunkPlanning.ts`.
 */
export function VisibilityManager() {
  const viewStore = useViewStoreApi()
  const viewerStore = useViewerStoreApi()
  const sceneStore = useSceneStoreApi()

  useEffect(() => {
    const stopVisibility = startVisibilityTracking({ viewStore, viewerStore, sceneStore })
    const stopChunkPlans = startChunkPlanTracking({ viewerStore, sceneStore })
    return () => {
      stopVisibility()
      stopChunkPlans()
    }
  }, [viewStore, viewerStore, sceneStore])

  return null
}
