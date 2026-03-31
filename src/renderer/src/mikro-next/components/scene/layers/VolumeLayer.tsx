import { get, open } from 'zarrita';
import type { AbsolutePath } from '@zarrita/storage';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { ChunkData } from '../stores/types';
import { mapDTypeToMinMax } from '../stores/utils';
import { ChunkVolume } from './ChunkVolume';
import { getColorMapTexture, redColormap } from '../zarr/colormaps';
import { Slice } from "zarrita"
import { useSelectionStore } from '../store/layerStore';
import { useViewerStore } from '../store/viewerStore';
import { DimSliceFragment, SceneLayerFragment } from '@/mikro-next/api/graphql';
import { calculateChunkGrid } from '../zarr/utils';
import { buildAffineMatrix } from '../panels/layer/affine-utils';

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

export const VolumeLayer = ({ layer }: { layer: SceneLayerFragment }) => {
  const [chunks, setChunks] = useState<ChunkData[] | null>(null);

  const storeBuilder = useViewerStore((s) => s.storeBuilder);

  const isSelected = useSelectionStore((s) => s.selectedLayerId === layer.id);
  const isDebug = useViewerStore((state) => state.debug);
  const setSelectedLayerId = useSelectionStore((s) => s.setSelectedLayerId);

  useEffect(() => {
    let isMounted = true;

    const initializeZarr = async () => {
      try {
        const zarrArray = layer.lens.dataset.dataArrays.at(0);
        const dims = layer.lens.dataset.dims;
        if (!zarrArray) {
          console.warn(`No data arrays found for Frame ${layer.id}`);
          return;
        }

        const store = await storeBuilder(zarrArray.store.id);
        const arr = await open.v3(store, { kind: "array" });

        const sliceMap = layer.lens.slices.reduce((acc, slice) => {
          acc[slice.dim] = slice;
          return acc;
        }, {} as Record<string, DimSliceFragment>);

        const selection: (null | Slice | number)[] = dims.map(dim => {
          const slice = sliceMap[dim];
          if (slice) {
            return {
              start: slice.start ?? 0,
              stop: slice.stop ?? undefined,
              step: slice.step ?? 1
            } as Slice;
          } else {
            return null;
          }
        });

        if (!isMounted) return;

        const xDim = layer.xDim;
        const yDim = layer.yDim;
        const zDim = layer.zDim;

        if (xDim === undefined || yDim === undefined) {
          console.error(`Missing dimension information for Frame ${layer.id}`);
          return;
        }

        const XPos = dims.indexOf(xDim);
        const YPos = dims.indexOf(yDim);
        const ZPos = zDim ? dims.indexOf(zDim) : -1;

        if (XPos === -1 || YPos === -1) {
          console.error(`Invalid spatial dimension names for Frame ${layer.id}`);
          return;
        }

        const shape = arr.shape;
        const dtype = arr.dtype;
        const chunk_shape = arr.chunks;

        const [min_val, max_val] = mapDTypeToMinMax(dtype);

        const cMinAbsolute = Math.ceil(min_val * (layer.climMin || 0));
        const cMaxAbsolute = Math.floor(max_val * (layer.climMax || 1));

        const generatedChunks: ChunkData[] = [];
        const colormapTexture = getColorMapTexture(layer);

        const chunks = calculateChunkGrid(selection, shape, chunk_shape);

        for (const { chunk_coords, mapping } of chunks) {
            generatedChunks.push({
              frame_id: layer.id,
              dimensionOrder: [XPos, YPos, ZPos], // FIX: Passed ZPos instead of IntensityPos
              store: store,
              chunkCoords: chunk_coords,
              chunkKey: chunk_coords.join("/"),
              indexer: mapping,
              chunk_shape: chunk_shape,
              arrayShape: shape,
              min_value: min_val,
              max_value: max_val,
              cLimMin: cMinAbsolute,
              cLimMax: cMaxAbsolute,
              colormapTexture: colormapTexture
            });
        }

        setChunks(generatedChunks);
      } catch (error) {
        console.error(`Failed to initialize Frame: ${layer.id}`, error);
      }
    };

    initializeZarr();

    return () => {
      isMounted = false;
    };
  }, [layer, storeBuilder]);

  const affineMatrix = useMemo(() => {
    return buildAffineMatrix(layer);
  }, [layer]);

  if (!chunks) {
    return null;
  }

  return (
    <group matrix={affineMatrix} matrixAutoUpdate={false} onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                  setSelectedLayerId(null);
                } else {
                  setSelectedLayerId(layer.id);
                }
              }}>
      <InvertedHullOutline enabled={isSelected && isDebug}>
        {chunks.map((chunk) => (
          <ChunkVolume key={chunk.chunkKey} chunk={chunk} />
        ))}
      </InvertedHullOutline>
    </group>
  );
};
