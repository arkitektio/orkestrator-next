import { CameraControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { button, buttonGroup, folder, useControls } from 'leva'
import { useRef } from 'react'
import { DEG2RAD } from 'three/src/math/MathUtils.js'


export const ComplexCameraControls = (props)    => {   
    
  const cameraControlsRef = useRef<CameraControls | null>(null)

  const { camera } = useThree()

  // All same options as the original "basic" example: https://yomotsu.github.io/camera-controls/examples/basic.html
  const { minDistance, enabled, verticalDragToForward, dollyToCursor, infinityDolly } = useControls({
    thetaGrp: buttonGroup({
      label: 'rotate theta',
      opts: {
        '+45º': () => cameraControlsRef.current?.rotate(45 * DEG2RAD, 0, true),
        '-90º': () => cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true),
        '+360º': () => cameraControlsRef.current?.rotate(360 * DEG2RAD, 0, true)
      }
    }),
    phiGrp: buttonGroup({
      label: 'rotate phi',
      opts: {
        '+20º': () => cameraControlsRef.current?.rotate(0, 20 * DEG2RAD, true),
        '-40º': () => cameraControlsRef.current?.rotate(0, -40 * DEG2RAD, true)
      }
    }),
    truckGrp: buttonGroup({
      label: 'truck',
      opts: {
        '(1,0)': () => cameraControlsRef.current?.truck(1, 0, true),
        '(0,1)': () => cameraControlsRef.current?.truck(0, 1, true),
        '(-1,-1)': () => cameraControlsRef.current?.truck(-1, -1, true)
      }
    }),
    dollyGrp: buttonGroup({
      label: 'dolly',
      opts: {
        '1': () => cameraControlsRef.current?.dolly(1, true),
        '-1': () => cameraControlsRef.current?.dolly(-1, true)
      }
    }),
    zoomGrp: buttonGroup({
      label: 'zoom',
      opts: {
        '/2': () => cameraControlsRef.current?.zoom(camera.zoom / 2, true),
        '/-2': () => cameraControlsRef.current?.zoom(-camera.zoom / 2, true)
      }
    }),
    minDistance: { value: 0 },
    moveTo: folder(
      {
        vec1: { value: [3, 5, 2], label: 'vec' },
        'moveTo(…vec)': button((get) => cameraControlsRef.current?.moveTo(...get('moveTo.vec1'), true))
      },
      { collapsed: true }
    ),
    setPosition: folder(
      {
        vec2: { value: [-5, 2, 1], label: 'vec' },
        'setPosition(…vec)': button((get) => cameraControlsRef.current?.setPosition(...get('setPosition.vec2'), true))
      },
      { collapsed: true }
    ),
    setTarget: folder(
      {
        vec3: { value: [3, 0, -3], label: 'vec' },
        'setTarget(…vec)': button((get) => cameraControlsRef.current?.setTarget(...get('setTarget.vec3'), true))
      },
      { collapsed: true }
    ),
    setLookAt: folder(
      {
        vec4: { value: [1, 2, 3], label: 'position' },
        vec5: { value: [1, 1, 0], label: 'target' },
        'setLookAt(…position, …target)': button((get) => cameraControlsRef.current?.setLookAt(...get('setLookAt.vec4'), ...get('setLookAt.vec5'), true))
      },
      { collapsed: true }
    ),
    lerpLookAt: folder(
      {
        vec6: { value: [-2, 0, 0], label: 'posA' },
        vec7: { value: [1, 1, 0], label: 'tgtA' },
        vec8: { value: [0, 2, 5], label: 'posB' },
        vec9: { value: [-1, 0, 0], label: 'tgtB' },
        t: { value: Math.random(), label: 't', min: 0, max: 1 },
        'f(…posA,…tgtA,…posB,…tgtB,t)': button((get) => {
          return cameraControlsRef.current?.lerpLookAt(
            ...get('lerpLookAt.vec6'),
            ...get('lerpLookAt.vec7'),
            ...get('lerpLookAt.vec8'),
            ...get('lerpLookAt.vec9'),
            get('lerpLookAt.t'),
            true
          )
        })
      },
      { collapsed: true }
    ),
    saveState: button(() => cameraControlsRef.current?.saveState()),
    reset: button(() => cameraControlsRef.current?.reset(true)),
    enabled: { value: false, label: 'controls on' },
    verticalDragToForward: { value: false, label: 'vert. drag to move forward' },
    dollyToCursor: { value: false, label: 'dolly to cursor' },
    infinityDolly: { value: false, label: 'infinity dolly' }
  }, {
    titlebar: false
  })
        
        
    return   <CameraControls
          ref={cameraControlsRef}
          minDistance={minDistance}
          enabled={enabled}
          verticalDragToForward={verticalDragToForward}
          dollyToCursor={dollyToCursor}
          infinityDolly={infinityDolly}

        />

}