import { useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Reusable inverted-hull outline effect.
 *
 * Wraps children in a group, traverses meshes on every frame,
 * and lazily adds / removes BackSide outline duplicates so that
 * highlights survive React-driven mesh re-mounts.
 */
export const InvertedHullOutline = ({
  children,
  color = "#10b981",
  thickness = 1.03,
  opacity = 0.22,
  enabled = true,
}: {
  children: React.ReactNode;
  color?: string;
  thickness?: number;
  opacity?: number;
  enabled?: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const outlinesRef = useRef<Map<THREE.Mesh, THREE.Mesh>>(new Map());
  const prevEnabled = useRef(enabled);
  const prevColor = useRef(color);
  const prevThickness = useRef(thickness);
  const prevOpacity = useRef(opacity);

  const removeAll = useCallback(() => {
    for (const outline of outlinesRef.current.values()) {
      outline.parent?.remove(outline);
      (outline.material as THREE.Material).dispose();
    }
    outlinesRef.current.clear();
  }, []);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    // If disabled, tear down any existing outlines and bail
    if (!enabled) {
      if (outlinesRef.current.size > 0) removeAll();
      prevEnabled.current = false;
      return;
    }

    // If params changed, tear down and rebuild from scratch
    const paramsChanged =
      prevEnabled.current !== enabled ||
      prevColor.current !== color ||
      prevThickness.current !== thickness ||
      prevOpacity.current !== opacity;

    if (paramsChanged) {
      removeAll();
      prevEnabled.current = enabled;
      prevColor.current = color;
      prevThickness.current = thickness;
      prevOpacity.current = opacity;
    }

    // Collect current source meshes
    const currentMeshes = new Set<THREE.Mesh>();
    group.traverse((child) => {
      if (child instanceof THREE.Mesh && !child.userData.isOutline) {
        currentMeshes.add(child);
      }
    });

    // Remove outlines whose source mesh is gone
    for (const [src, outline] of outlinesRef.current) {
      if (!currentMeshes.has(src)) {
        outline.parent?.remove(outline);
        (outline.material as THREE.Material).dispose();
        outlinesRef.current.delete(src);
      }
    }

    // Add outlines for new source meshes
    for (const mesh of currentMeshes) {
      if (outlinesRef.current.has(mesh)) continue;

      const outlineMesh = new THREE.Mesh(mesh.geometry);
      outlineMesh.material = new THREE.MeshBasicMaterial({
        color,
        side: THREE.BackSide,
        transparent: true,
        opacity,
        depthWrite: false,
        depthTest: true,
        blending: THREE.NormalBlending,
      });
      outlineMesh.scale.copy(mesh.scale).multiplyScalar(thickness);
      outlineMesh.position.copy(mesh.position);
      outlineMesh.rotation.copy(mesh.rotation);
      outlineMesh.userData.isOutline = true;

      mesh.parent?.add(outlineMesh);
      outlinesRef.current.set(mesh, outlineMesh);
    }
  });

  return <group ref={groupRef}>{children}</group>;
};
