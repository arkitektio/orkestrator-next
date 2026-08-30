import { useEffect, useMemo } from "react";
import * as THREE from "three";

import { useModeStore } from "../../platform/stores/modeStore";
import { useMeshDesignStore, type DesignMesh } from "./store/meshDesignStore";

/**
 * The designer's in-canvas overlay: one MUTABLE mesh per design entry.
 *
 * Deliberately not the fabriks `BatchedMesh`: that renderer is append-only
 * and LRU-owned, built for thousands of frozen cells. A design session holds
 * a handful of meshes that change with every slider move, so a plain
 * `<mesh>` each — rebuilt when its geometry identity changes — is the honest
 * representation. They carry an `onClick` (selection) only while the mode is
 * DESIGN, which is the only time this component mounts (P20: nothing joins
 * the raycast set outside its mode).
 */

const colorFor = (hue: number, selected: boolean): THREE.Color =>
  new THREE.Color().setHSL(hue / 360, 0.65, selected ? 0.6 : 0.5);

const DesignMeshView = ({ mesh, selected, onSelect }: { mesh: DesignMesh; selected: boolean; onSelect: () => void }) => {
  const { current, hue, visible } = mesh;
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(current.positions, 3));
    g.setIndex(new THREE.BufferAttribute(current.indices, 1));
    g.computeVertexNormals();
    return g;
  }, [current]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const color = useMemo(() => colorFor(hue, selected), [hue, selected]);

  if (!visible) return null;
  return (
    <group>
      <mesh
        geometry={geometry}
        renderOrder={9}
        frustumCulled={false}
        onClick={(event) => {
          // A click, not the end of an orbit drag — DESIGN navigates with the
          // left button, so only a still pointer picks a mesh.
          if (event.delta > 4) return;
          event.stopPropagation();
          onSelect();
        }}
      >
        <meshStandardMaterial
          color={color}
          flatShading={false}
          transparent
          opacity={selected ? 0.75 : 0.55}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {selected && (
        <mesh geometry={geometry} renderOrder={10} frustumCulled={false}>
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.25} depthTest={false} />
        </mesh>
      )}
    </group>
  );
};

export const MeshDesignSession = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const meshes = useMeshDesignStore((s) => s.meshes);
  const selectedId = useMeshDesignStore((s) => s.selectedId);
  const select = useMeshDesignStore((s) => s.select);

  if (interactionMode !== "DESIGN") return null;
  return (
    <>
      {meshes.map((mesh) => (
        <DesignMeshView key={mesh.id} mesh={mesh} selected={mesh.id === selectedId} onSelect={() => select(mesh.id)} />
      ))}
    </>
  );
};
