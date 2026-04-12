import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Reusable inverted-hull outline effect.
 *
 * Wraps children in a group, traverses meshes, and adds a slightly
 * scaled-up BackSide duplicate for each to create an outline/glow.
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

  useEffect(() => {
    if (!enabled || !groupRef.current) return;

    const outlines: THREE.Mesh[] = [];

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && !child.userData.isOutline) {
        // skip very transparent materials
        if (
          child.material instanceof THREE.Material &&
          "transparent" in child.material &&
          child.material.transparent &&
          "opacity" in child.material &&
          (child.material as THREE.MeshBasicMaterial).opacity < 0.5
        ) {
          return;
        }

        const outlineMesh = new THREE.Mesh(child.geometry);
        outlineMesh.material = new THREE.MeshBasicMaterial({
          color,
          side: THREE.BackSide,
          transparent: true,
          opacity,
          depthWrite: false,
          depthTest: true,
          blending: THREE.NormalBlending,
        });

        outlineMesh.scale.copy(child.scale).multiplyScalar(thickness);
        outlineMesh.position.copy(child.position);
        outlineMesh.rotation.copy(child.rotation);
        outlineMesh.userData.isOutline = true;

        child.parent?.add(outlineMesh);
        outlines.push(outlineMesh);
      }
    });

    return () => {
      outlines.forEach((mesh) => {
        mesh.parent?.remove(mesh);
        (mesh.material as THREE.Material).dispose();
      });
    };
  }, [enabled, color, thickness, opacity]);

  return <group ref={groupRef}>{children}</group>;
};
