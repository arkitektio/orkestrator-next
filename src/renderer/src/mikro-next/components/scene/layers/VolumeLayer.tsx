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
import { DimSliceFragment, RequestZarrAccessDocument, RequestZarrAccessMutation, RequestZarrAccessMutationVariables, SceneLayerFragment } from '@/mikro-next/api/graphql';
import { useDatalayerEndpoint, useMikro } from '@/app/Arkitekt';
import { ca } from 'date-fns/locale';
import { calculateChunkGrid } from '../zarr/utils';

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

  const client = useMikro();
  const datalayer = useDatalayerEndpoint()

  const storeBuilder = useViewerStore((s) => s.storeBuilder);

  const isSelected = useSelectionStore((s) => s.selectedLayerId === layer.id);
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


        const access = await client.mutate<RequestZarrAccessMutation, RequestZarrAccessMutationVariables>({
          mutation: RequestZarrAccessDocument,
          variables: { input: { storeId: zarrArray.store.id } },
        });

        console.log(`Requested Zarr access for Frame ${layer.id}`, access);

        const credentials = access.data?.requestZarrAccess;
        if (!credentials) {
          console.error(`Failed to obtain Zarr access for Frame ${layer.id}`);
          return;
        }

        if (!datalayer) {
          console.error(`Datalayer endpoint is not defined`);
          return;
        }

        const store = await storeBuilder(credentials, datalayer);
        const arr = await open.v3(store, { kind: "array" });


        const sliceMap = layer.lens.slices.reduce((acc, slice) => {
          acc[slice.dim] = slice
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




        console.log(`Opening Zarr for Frame ${layer.id} with selection:`, selection);
        const data = await get(arr, selection)

        if (!isMounted) return;
        console.log(`Initialized Zarr for Frame ${layer.id}: shape=${data.shape}, dtype=${arr.dtype}`);






        const shape = data.shape;
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
              store: store,
              chunkCoords: chunk_coords,
              chunkKey: chunk_coords.join("/"),
              indexer: mapping,
              chunk_shape: chunk_shape,
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
  }, [layer, storeBuilder, client]);

  // Extract Affine Matrix from metadata
  const affineMatrix = useMemo(() => {
    const mat = new THREE.Matrix4().identity();
    if (!layer.affineMatrix) return mat;

    const rawMat = layer.affineMatrix;
    if (rawMat.length === 3) {
      mat.set(
        rawMat[0][0], rawMat[0][1], 0, rawMat[0][2],
        rawMat[1][0], rawMat[1][1], 0, rawMat[1][2],
        0, 0, 1, 0,
        rawMat[2][0], rawMat[2][1], 0, rawMat[2][2]
      );
    } else if (rawMat.length === 4) {
      mat.set(
        rawMat[0][0], rawMat[0][1], rawMat[0][2], rawMat[0][3],
        rawMat[1][0], rawMat[1][1], rawMat[1][2], rawMat[1][3],
        rawMat[2][0], rawMat[2][1], rawMat[2][2], rawMat[2][3],
        rawMat[3][0], rawMat[3][1], rawMat[3][2], rawMat[3][3]
      );
    }
    return mat;
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
      <InvertedHullOutline enabled={isSelected}>
        {chunks.map((chunk) => (
          <ChunkVolume key={chunk.chunkKey} chunk={chunk} />
        ))}
      </InvertedHullOutline>
    </group>
  );
};
