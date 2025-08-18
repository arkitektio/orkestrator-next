import { Line } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'



export type RectangleDrawerProps = {
  onRectangleDrawn?: (start: THREE.Vector3, end: THREE.Vector3) => void
}

export function RectangleDrawer(props: RectangleDrawerProps) {
  const planeRef = useRef<THREE.Mesh>(null)

  const [start, setStart] = useState<THREE.Vector3 | null>(null)
  const [end, setEnd] = useState<THREE.Vector3 | null>(null)
  const [drawing, setDrawing] = useState(false)

  const handlePointerDown = (e) => {
    if (!e.shiftKey) return // 🟡 Require Shift to start

    e.stopPropagation()
    // Always start fresh
    setStart(e.point.clone())
    setEnd(e.point.clone())
    setDrawing(true)
  }

  const handlePointerMove = (e) => {
    if (!drawing || !start || !e.shiftKey) return // 🟡 Still require Shift while dragging
    e.stopPropagation()
    setEnd(e.point.clone())
  }

  const handlePointerUp = () => {
    setDrawing(false)
    if (start && end) {
      // Call the callback with the rectangle corners
      props.onRectangleDrawn?.(start.clone(), end.clone())
      // Clear the states after drawing is complete
      setStart(null)
      setEnd(null)
    }
  }

  const points = (() => {
    if (!start || !end) return []
    const a = new THREE.Vector3(start.x, start.y, 0)
    const b = new THREE.Vector3(end.x, start.y, 0)
    const c = new THREE.Vector3(end.x, end.y, 0)
    const d = new THREE.Vector3(start.x, end.y, 0)
    return [a, b, c, d, a]
  })()

  return (
    <>
      {/* Visible plane for debugging */}
      <mesh
        ref={planeRef}
        position={[0, 0, 1]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[10000, 10000]} />
        <meshStandardMaterial
          color="lightgray"
          opacity={0.001}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* The drawn rectangle line */}
      {points.length > 0 && <Line points={points} color="orange" lineWidth={1} />}
    </>
  )
}