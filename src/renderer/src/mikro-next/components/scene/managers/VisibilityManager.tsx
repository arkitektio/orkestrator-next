import { useEffect } from 'react'
import { useModeStoreApi } from '../store/modeStore'
import { useSceneStoreApi } from '../store/sceneStore'
import { useViewerStoreApi } from '../store/viewerStore'
import { useViewStoreApi } from '../store/viewStore'
import { startVisibilityTracking } from './visibilityTracker'
import { startChunkPlanTracking } from './chunkPlanTracker'
import { startNodePlanTracking } from './nodePlanTracker'

/**
 * Mount point for the store-level scene managers: the visibility tracker
 * (camera → per-layer visible voxel ranges), the chunk-plan tracker
 * (ranges + rendered-chunk feedback → declarative per-layer chunk plans) and
 * the octree node-plan tracker (ranges + camera + residency → per-layer brick
 * plans; inert until `useOctreeRenderer` is on).
 * Holds no reactive state — the store APIs are stable — so this component
 * renders once and never again; all reactivity lives in the trackers'
 * subscriptions and the pure math in `core/visibility.ts` /
 * `core/chunkPlanning.ts` / `core/octree/nodePlanning.ts`.
 */
export function VisibilityManager() {
  const viewStore = useViewStoreApi()
  const viewerStore = useViewerStoreApi()
  const sceneStore = useSceneStoreApi()
  const modeStore = useModeStoreApi()

  useEffect(() => {
    const stopVisibility = startVisibilityTracking({ viewStore, viewerStore, sceneStore })
    const stopChunkPlans = startChunkPlanTracking({ viewerStore, sceneStore })
    const stopNodePlans = startNodePlanTracking({ viewerStore, sceneStore, viewStore, modeStore })
    return () => {
      stopVisibility()
      stopChunkPlans()
      stopNodePlans()
    }
  }, [viewStore, viewerStore, sceneStore, modeStore])

  return null
}
