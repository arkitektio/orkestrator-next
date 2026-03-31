

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useViewStore } from '../store/viewStore'
import { useViewerStore } from '../store/viewerStore'

export function VisibilityManager() {
  const trackables = useViewerStore((s) => s.trackables)
  const setVisible = useViewerStore((s) => s.setVisible)

  // Subscribe to the matrix from your CameraSync component
  const projScreenMatrix = useViewStore((s) => s.viewProjectionMatrix)

  // Pre-allocate to prevent GC pressure
  const frustum = useMemo(() => new THREE.Frustum(), [])
  const box = useMemo(() => new THREE.Box3(), [])

  // This effect only runs when the camera stops moving (after debounce)
  useEffect(() => {
    if (!projScreenMatrix) return

    frustum.setFromProjectionMatrix(projScreenMatrix)
    const nextVisible = new Set<string>()

    trackables.forEach((ref) => {
      if (ref.ref.current) {
        // Compute the bounding box of the Group/Mesh
        box.setFromObject(ref.ref.current)

        if (frustum.intersectsBox(box)) {
          nextVisible.add(ref.id)
        }
      }
    })

    console.log("Visible layers:", Array.from(nextVisible))
    setVisible(nextVisible)
  }, [projScreenMatrix, trackables, frustum, box, setVisible])

  return null
}
