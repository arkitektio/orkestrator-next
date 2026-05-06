import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useViewerStore } from '../../store/viewerStore';

export const CullingDebugRing = () => {
  const isDebug = useViewerStore((state) => state.debug);
  const cullRadius = useViewerStore((state) => state.cullRadius);

  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!isDebug || cullRadius <= 0 || !meshRef.current) return;

    const camera = state.camera;
    let zoomScale = 1;

    if (camera instanceof THREE.OrthographicCamera) {
      zoomScale = camera.zoom;
    } else if (camera instanceof THREE.PerspectiveCamera) {
      // Assuming the planes are near Z=0, estimate distance from camera
      const distance = Math.abs(camera.position.z);
      zoomScale = 1 / Math.max(0.001, distance);
    }

    const effectiveRadius = cullRadius / zoomScale;

    // 1. Update position to follow camera perfectly every frame
    meshRef.current.position.set(camera.position.x, camera.position.y, -0.05);

    // 2. Scale the ring dynamically instead of recreating the geometry
    // Assuming base ring geometry has an inner radius of 1
    meshRef.current.scale.set(effectiveRadius, effectiveRadius, 1);
  });

  if (!isDebug || cullRadius <= 0) return null;

  return (
    <mesh ref={meshRef}>
      {/*
        Base geometry with radius 1.
        We scale the mesh natively in useFrame rather than
        re-mounting the geometry when zoom changes.
      */}
      <ringGeometry args={[1, 1.05, 64]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#ff0000"
        opacity={0.6}
        transparent={true}
        side={THREE.DoubleSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};
