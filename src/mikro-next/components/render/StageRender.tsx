import {
  ImageFragment,
  ListRgbContextFragment,
  RgbViewFragment,
  StageFragment,
  useGetImageQuery,
  useGetStageQuery,
  WatchTransformationViewsDocument,
  WatchTransformationViewsSubscription,
  WatchTransformationViewsSubscriptionVariables,
} from "@/mikro-next/api/graphql";
import { OrbitControls, Select } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { Object3D, Object3DEventMap } from "three";
import { StageCamera } from "./cameras/StageCamera";
import {
  RectangleDrawer,
  RectangleDrawerProps,
} from "./controls/RectangleDrawer";
import { ChunkBitmapTexture } from "./final/ChunkMesh";
import { useArray } from "./final/useArray";
import { BasicIndexer, IndexerProjection, Slice } from "./indexer";

export type StageRenderProps = {
  stage: StageFragment;
  className?: string;
  follow?: "width" | "height";
  onValueClick?: (value: number) => void;
} & RectangleDrawerProps;

export type PassThroughProps = {
  setOpenPanels: Dispatch<SetStateAction<Panel[]>>;
};

export interface Panel {
  identifier: string;
  object: string;
  positionX: number;
  positionY: number;
}

export const calculateChunkGrid = (
  selection: (number | Slice | null)[],
  shape,
  chunks,
) => {
  let indexer = new BasicIndexer({
    selection,
    shape: shape,
    chunk_shape: chunks,
  });

  let chunk_loaders: {
    chunk_coords: number[];
    mapping: IndexerProjection[];
  }[] = [];

  for (const { chunk_coords, mapping } of indexer) {
    chunk_loaders.push({ chunk_coords, mapping });
  }

  return chunk_loaders;
};

export const useImageDimensions = (
  context: ListRgbContextFragment,
): [number, number, number] => {
  const width = context.image.store?.shape?.at(3);
  const height = context.image.store?.shape?.at(4);
  const depth = context.image.store?.shape?.at(2);
  if (width === undefined || height === undefined || depth === undefined) {
    return [1, 1, 1];
  }

  return [width, height, depth];
};

export const useAspectRatio = (context: ListRgbContextFragment) => {
  const width = context.image.store?.shape?.at(3);
  const height = context.image.store?.shape?.at(4);
  if (width === undefined || height === undefined) {
    return 1;
  }

  return width / height;
};

export const ScaleViewRender = (props: {
  derivedScaleView: ListRgbContextFragment["image"]["derivedScaleViews"][0];
  view: RgbViewFragment;
  z: number;
  t: number;
  xSize: number;
  ySize: number;
  availableScales?: number[];
}) => {
  const { derivedScaleView, view, z, t, xSize, ySize, availableScales } = props;

  const selection = [
    {
      start: view.cMin || null,
      stop: view.cMax || null,
      step: null,
    },
    t,
    z,
    { start: null, stop: null, step: null },
    { start: null, stop: null, step: null },
  ];

  const chunk_loaders = calculateChunkGrid(
    selection,
    derivedScaleView.image.store.shape,
    derivedScaleView.image.store.chunks,
  );

  const { renderView } = useArray({
    store: derivedScaleView.image.store,
  });

  if (!derivedScaleView.image.store.chunks) {
    return <div>Chunk shape not found</div>;
  }

  return (
    <group key={`${z}-${t}-${view.id}`}>
      {chunk_loaders.map((chunk_loader, index) => {
        return (
          <ChunkBitmapTexture
            renderFunc={renderView}
            chunk_coords={chunk_loader.chunk_coords}
            chunk_shape={derivedScaleView.image.store.chunks || []}
            key={`${index}-${z}-${t}-${view.id}`}
            view={view}
            t={t}
            z={z}
            cLimMin={view.contrastLimitMin}
            cLimMax={view.contrastLimitMax}
            imageWidth={xSize}
            imageHeight={ySize}
            scaleX={derivedScaleView.scaleX}
            scaleY={derivedScaleView.scaleY}
            availableScales={availableScales}
            enableCulling={true}
          />
        );
      })}
    </group>
  );
};

export const useScale = () => 0;
export const useZ = () => 0;
export const useT = () => 0;

export type ImageRenderProps = {
  image: ImageFragment;
  onImageContextMenu?: (event: any, image: ImageFragment) => void;
};

const ImageRender = (props: {
  image: ImageFragment;
  onImageContextMenu?: (event: any, image: ImageFragment) => void;
}) => {
  const selectedScale = useScale();
  const z = useZ();
  const t = useT();

  const rgbContext = props.image.rgbContexts.at(0);
  if (!rgbContext) {
    return <div>No RGB context found for the image</div>;
  }

  const version = props.image.store.version;
  const cSize = props.image?.store.shape?.at(0) || 1;
  const zSize = props.image?.store.shape?.at(2) || 1;
  const tSize = props.image?.store.shape?.at(1) || 1;
  const xSize = props.image?.store.shape?.at(3) || 1;
  const ySize = props.image?.store.shape?.at(4) || 1;

  const layers = rgbContext.image.derivedScaleViews.concat({
    image: props.image,
    scaleX: 1,
    scaleY: 1,
    scaleC: 1,
    scaleT: 1,
    scaleZ: 1,
    __typename: "ScaleView",
    id: "extra",
  });

  const selectedScales = [layers.at(selectedScale)];

  return (
    <>
      {rgbContext.views.map((view, viewIndex) => {
        return (
          <group
            key={view.id}
            onContextMenu={(event) => {
              event.stopPropagation();
              props.onImageContextMenu?.(event, props.image);
            }}
          >
            {selectedScales.map((layer) => {
              return (
                <ScaleViewRender
                  key={`${z}-${t}-${viewIndex}-${layer.id}`}
                  derivedScaleView={layer}
                  view={view}
                  z={z}
                  t={t}
                  xSize={xSize}
                  ySize={ySize}
                />
              );
            })}
          </group>
        );
      })}
    </>
  );
};

export const StageToolbar = (props: { stage: StageFragment }) => {
  return <div className="flex flex-col gap-2">Not implemented yet</div>;
};

export const useZSize = () => 1;
export const useTSize = () => 1;

const AsyncImageRender = ({
  imageId,
  ...props
}: { imageId: string } & Omit<ImageRenderProps, "image">) => {
  const { data, loading, error } = useGetImageQuery({
    variables: {
      id: imageId,
    },
  });

  if (loading) return null;
  if (!data) return <div>Error loading image: {error?.message}</div>;

  return <ImageRender image={data.image} {...props} />;
};

export const StageRender = ({ stage, onRectangleDrawn }: StageRenderProps) => {
  const [selected, setSelected] = useState<Object3D<Object3DEventMap>[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    image: ImageFragment;
  } | null>(null);

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      className="relative"
      ref={containerRef}
    >
      <Leva isRoot collapsed />

      <Suspense
        fallback={<div className="w-full h-full bg-gray-100"> Loading</div>}
      >
        <Canvas style={{ width: "100%", height: "100%" }}>
          <StageCamera />

          <OrbitControls
            enableRotate={false}
            enablePan={true}
            regress={false}
            mouseButtons={{
              LEFT: THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.ROTATE,
              RIGHT: THREE.MOUSE.DOLLY,
            }}
          />
          <Select multiple onChange={setSelected}>
            {stage.affineViews.map((view) => {
              const flattenMatrix: number[] = view.affineMatrix.reduce(
                (acc, row) => acc.concat(row),
                [],
              );
              console.log("Flattened Matrix", flattenMatrix);

              const matrix = new THREE.Matrix4();
              matrix.set(...flattenMatrix);
              return (
                <group key={view.id} matrixAutoUpdate={false} matrix={matrix}>
                  <AsyncImageRender
                    imageId={view.image.id}
                    onImageContextMenu={(event, image) => {
                      event.stopPropagation();

                      const containerBounds =
                        containerRef.current?.getBoundingClientRect();
                      const x = event.clientX - (containerBounds?.left || 0);
                      const y = event.clientY - (containerBounds?.top || 0);

                      setContextMenu({
                        x,
                        y,
                        image,
                      });
                    }}
                  />
                </group>
              );
            })}
          </Select>
          <RectangleDrawer onRectangleDrawn={onRectangleDrawn} />
        </Canvas>
      </Suspense>
      {contextMenu && (
        <div
          className="absolute bg-white border border-gray-300 rounded shadow-lg p-2"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <h3 className="font-bold mb-2">Image Context Menu</h3>
          <p>{contextMenu.image.name}</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => {
              setContextMenu(null);
              // Handle any action here, like opening a modal or redirecting
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export const AsyncStageRender = ({
  stageId,
  ...props
}: { stageId: string } & Omit<StageRenderProps, "stage">) => {
  const { data, loading, error, subscribeToMore } = useGetStageQuery({
    variables: {
      id: stageId,
    },
  });

  useEffect(() => {
    const unsubscribe = subscribeToMore<
      WatchTransformationViewsSubscription,
      WatchTransformationViewsSubscriptionVariables
    >({
      document: WatchTransformationViewsDocument,
      variables: { stage: stageId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const stage = prev.stage;
        if (!stage) return prev;
        if (!stage.affineViews) {
          stage.affineViews = [];
        }

        let newView = subscriptionData.data.affineTransformationViews.create;

        if (!subscriptionData.data.affineTransformationViews.create)
          return prev;

        const affineViews = [...(stage.affineViews || []), newView];

        return {
          ...prev,
          stage: {
            ...stage,
            affineViews: affineViews,
          },
        };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [stageId, subscribeToMore]);

  if (loading) return <div>Loading Stage...</div>;
  if (!data) return <div>Error loading stage: {error?.message}</div>;

  return <StageRender stage={data.stage} {...props} />;
};
