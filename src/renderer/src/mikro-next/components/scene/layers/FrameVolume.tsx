import { useViewerStore } from '@/store/viewerStore';
import { open } from 'zarrita';
import type { AbsolutePath } from '@zarrita/storage';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Frame } from '../zarr/types';
import type { ChunkData } from '../stores/types';
import { mapDTypeToMinMax } from '../stores/utils';
import { ChunkVolume } from './ChunkVolume';
import { redColormap } from '../zarr/colormaps';
import { useSelectionStore } from '@/store/imageStore';
import { affineToMatrix4 } from '../panels/layer/affine-utils';

const InvertedHullOutline = ({
  children,
  color = '#10b981',
  thickness = 1.03,
  enabled = true,
}: {
  children: React.ReactNode;
  color?: string;
  thickness?: number;
  enabled?: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!enabled || !groupRef.current) return;

    const outlines: THREE.Mesh[] = [];

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && !child.userData.isOutline) {
        if (
          child.material instanceof THREE.Material &&
          'transparent' in child.material &&
          child.material.transparent &&
          'opacity' in child.material &&
          child.material.opacity < 0.5
        ) {
          return;
        }

        const outlineMesh = new THREE.Mesh(child.geometry);
        outlineMesh.material = new THREE.MeshBasicMaterial({
          color,
          side: THREE.BackSide,
          transparent: true,
          opacity: 0.22,
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
  }, [enabled, color, thickness]);

  return <group ref={groupRef}>{children}</group>;
};


// --- 2. The Main Frame Plane ---

export const FrameVolume = ({ frame }: { frame: Frame }) => {
  const [chunks, setChunks] = useState<ChunkData[] | null>(null);

  const storeBuilder = useViewerStore((s) => s.storeBuilder);

  const isSelected = useSelectionStore((s) => s.selectedFrameId === frame.id);
  const setSelectedFrameId = useSelectionStore((s) => s.setSelectedFrameId);

  useEffect(() => {
    let isMounted = true;

    const initializeZarr = async () => {
      try {
        const store = storeBuilder(frame);
        const arr = await open.v3(store, { kind: "array" });

        if (!isMounted) return;
        console.log(`Initialized Zarr for Frame ${frame.id}: shape=${arr.shape}, dtype=${arr.dtype}`);

        const shape = arr.shape;
        const dtype = arr.dtype;
        const chunk_shape = arr.chunks;

        const [min_val, max_val] = mapDTypeToMinMax(dtype);

        // Explicitly map the 3D shape (Z, Y, X)
        const [zDim, yDim, xDim] = shape;
        const [zChunk, yChunk, xChunk] = chunk_shape;

        const generatedChunks: ChunkData[] = [];

        const colormapTexture = redColormap;

        for (let z = 0; z < Math.ceil(zDim / zChunk); z++) {
          for (let y = 0; y < Math.ceil(yDim / yChunk); y++) {
            for (let x = 0; x < Math.ceil(xDim / xChunk); x++) {
              generatedChunks.push({
                frame_id: frame.id,
                store: store,
                chunk_coord: `${z},${y},${x}`,
                chunk_key: `/c/${z}/${y}/${x}` as AbsolutePath,
                chunk_shape: [zChunk, yChunk, xChunk],
                z_index: z,
                min_value: frame.metadata.min_value ?? min_val,
                max_value: frame.metadata.max_value ?? max_val,
                metadata: frame.metadata,
                array_metadata: frame.array_metadata,
                colormapTexture: colormapTexture
              });
            }
          }
        }

        setChunks(generatedChunks);
      } catch (error) {
        console.error(`Failed to initialize Frame: ${frame.id}`, error);
      }
    };

    initializeZarr();

    return () => {
      isMounted = false;
    };
  }, [frame, storeBuilder]);

  // Extract Affine Matrix from metadata
  const affineMatrix = useMemo(() => {
    return affineToMatrix4(frame.metadata.affine_matrix);
  }, [frame]);

  if (!chunks) {
    return null;
  }

  return (
    <group matrix={affineMatrix} matrixAutoUpdate={false} onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                  setSelectedFrameId(null);
                } else {
                  setSelectedFrameId(frame.id);
                }
              }}>
      <InvertedHullOutline enabled={isSelected}>
        {chunks.map((chunk) => (
          <ChunkVolume key={chunk.chunk_key} chunk={chunk} />
        ))}
      </InvertedHullOutline>
    </group>
  );
};
