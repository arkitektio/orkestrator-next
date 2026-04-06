

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useViewStore } from '../store/viewStore'
import { useViewerStore, type LayerViewRange } from '../store/viewerStore'
import { useSceneStore } from '../store/sceneStore'
import { affineToMatrix4 } from '../panels/layer/affine-utils'

export function VisibilityManager() {
  const trackables = useViewerStore((s) => s.trackables)
  const setVisible = useViewerStore((s) => s.setVisible)
  const setLayerViewRanges = useViewerStore((s) => s.setLayerViewRanges)
  const layers = useSceneStore((s) => s.layers)

  // Subscribe to the matrix from your CameraSync component
  const projScreenMatrix = useViewStore((s) => s.viewProjectionMatrix)
  const viewportSize = useViewStore((s) => s.viewportSize)

  // Pre-allocate to prevent GC pressure
  const frustum = useMemo(() => new THREE.Frustum(), [])
  const box = useMemo(() => new THREE.Box3(), [])

  // This effect only runs when the camera stops moving (after debounce)
  useEffect(() => {
    if (!projScreenMatrix) return

    frustum.setFromProjectionMatrix(projScreenMatrix)

    // Compute frustum AABB in world space
    const invPV = projScreenMatrix.clone().invert()
    const frustumBox = new THREE.Box3()
    const corner = new THREE.Vector3()
    for (let x = -1; x <= 1; x += 2) {
      for (let y = -1; y <= 1; y += 2) {
        for (let z = -1; z <= 1; z += 2) {
          corner.set(x, y, z).applyMatrix4(invPV)
          frustumBox.expandByPoint(corner)
        }
      }
    }

    const nextVisible = new Set<string>()
    const nextRanges: Record<string, LayerViewRange> = {}

    trackables.forEach((ref) => {
      if (ref.ref.current) {
        // Compute the bounding box of the Group/Mesh
        box.setFromObject(ref.ref.current)

        if (frustum.intersectsBox(box)) {
          nextVisible.add(ref.id)

          // Compute visible voxel ranges for layer trackables
          if (ref.kind === 'layer') {
            const layer = layers.find((l) => l.id === ref.id)
            if (layer) {
              const visibleBox = box.clone().intersect(frustumBox)
              if (!visibleBox.isEmpty()) {
                const invAffine = affineToMatrix4(layer.affineMatrix).invert()
                const voxelBox = new THREE.Box3()
                const c = new THREE.Vector3()
                for (let ix = 0; ix <= 1; ix++) {
                  for (let iy = 0; iy <= 1; iy++) {
                    for (let iz = 0; iz <= 1; iz++) {
                      c.set(
                        ix === 0 ? visibleBox.min.x : visibleBox.max.x,
                        iy === 0 ? visibleBox.min.y : visibleBox.max.y,
                        iz === 0 ? visibleBox.min.z : visibleBox.max.z,
                      )
                      c.applyMatrix4(invAffine)
                      voxelBox.expandByPoint(c)
                    }
                  }
                }

                const xIdx = layer.lens.dims.indexOf(layer.xDim)
                const yIdx = layer.lens.dims.indexOf(layer.yDim)
                const xMax = xIdx >= 0 ? layer.lens.shape[xIdx] : 0
                const yMax = yIdx >= 0 ? layer.lens.shape[yIdx] : 0

                let zRange: [number, number] | null = null
                if (layer.zDim) {
                  const zIdx = layer.lens.dims.indexOf(layer.zDim)
                  const zMax = zIdx >= 0 ? layer.lens.shape[zIdx] : 0
                  zRange = [
                    Math.max(0, Math.floor(voxelBox.min.z)),
                    Math.min(zMax, Math.ceil(voxelBox.max.z)),
                  ]
                }

                // Compute screen-pixels-per-image-pixel scale
                // Transform two voxel-space points 1 pixel apart through affine + PV
                const affine = affineToMatrix4(layer.affineMatrix)
                const p0 = new THREE.Vector3(0, 0, 0).applyMatrix4(affine).applyMatrix4(projScreenMatrix)
                const p1 = new THREE.Vector3(1, 0, 0).applyMatrix4(affine).applyMatrix4(projScreenMatrix)
                // NDC to screen pixels
                const hw = viewportSize.width / 2
                const hh = viewportSize.height / 2
                const sx0 = (p0.x + 1) * hw
                const sy0 = (p0.y + 1) * hh
                const sx1 = (p1.x + 1) * hw
                const sy1 = (p1.y + 1) * hh
                const scale = Math.sqrt((sx1 - sx0) ** 2 + (sy1 - sy0) ** 2)

                nextRanges[ref.id] = {
                  xRange: [
                    Math.max(0, Math.floor(voxelBox.min.x)),
                    Math.min(xMax, Math.ceil(voxelBox.max.x)),
                  ],
                  yRange: [
                    Math.max(0, Math.floor(voxelBox.min.y)),
                    Math.min(yMax, Math.ceil(voxelBox.max.y)),
                  ],
                  zRange,
                  scale,
                }
              }
            }
          }
        }
      }
    })

    console.log("Visible layers:", Array.from(nextVisible))
    setVisible(nextVisible)
    setLayerViewRanges(nextRanges)
  }, [projScreenMatrix, viewportSize, trackables, layers, frustum, box, setVisible, setLayerViewRanges])

  return null
}
