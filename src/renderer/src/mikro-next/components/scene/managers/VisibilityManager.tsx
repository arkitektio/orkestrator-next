import { useEffect } from 'react'
import { useSceneStoreApi } from '../store/sceneStore'
import { useViewerStoreApi } from '../store/viewerStore'
import { useViewStoreApi } from '../store/viewStore'
import { startVisibilityTracking } from './visibilityTracker'

/**
 * Mount point for the store-level visibility tracker. Holds no reactive
 * state — the store APIs are stable — so this component renders once and
 * never again; all reactivity lives in `visibilityTracker.ts` subscriptions
 * and the pure math in `core/visibility.ts`.
 */
export function VisibilityManager() {
  const viewStore = useViewStoreApi()
  const viewerStore = useViewerStoreApi()
  const sceneStore = useSceneStoreApi()

  useEffect(
    () => startVisibilityTracking({ viewStore, viewerStore, sceneStore }),
    [viewStore, viewerStore, sceneStore],
  )

  return null
}
