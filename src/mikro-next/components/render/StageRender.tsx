import {
  ImageFragment,
  StageFragment,
  useGetImageQuery,
  useGetStageQuery,
  WatchTransformationViewsDocument,
  WatchTransformationViewsSubscription,
  WatchTransformationViewsSubscriptionVariables
} from "@/mikro-next/api/graphql";
import { OrbitControls, Select } from "@react-three/drei";
import { Canvas as ThreeCanvas } from "@react-three/fiber";

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
import { RGBContextRender } from "./FInalRender";
import { ViewerStateProvider } from "./ViewerStateProvider";

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

export const useZSize = () => 1;
export const useTSize = () => 1;

const AsyncImageRender = ({
  imageId,
  matrix,
}: {
  imageId: string;
  matrix: THREE.Matrix4;
}) => {
  const { data, loading, error } = useGetImageQuery({
    variables: {
      id: imageId,
    },
  });

  const context = data?.image.rgbContexts.at(0);

  if (loading) return null;
  if (!context) return null;

  return <RGBContextRender context={context} matrix={matrix} />;
};

export const StageRender = ({ stage, onRectangleDrawn }: StageRenderProps) => {
  const [selected, setSelected] = useState<Object3D<Object3DEventMap>[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    image: ImageFragment;
  } | null>(null);

  const availableScales = [];

  return (
    <ViewerStateProvider
      availableScales={availableScales}
      initialState={{
        // Only most downscaled version enabled by default
        enabledScales: new Set([Math.max(...availableScales)]),
        showRois: true,
        z: 0,
        t: 0,
        allowRoiDrawing: false,
      }}
    >
      <div
        style={{ width: "100%", height: "100%", }}
        className="relative bg-black"
        ref={containerRef}
      >
        <Suspense
          fallback={<div className="w-full h-full bg-gray-100"> Loading</div>}
        >
          <ThreeCanvas style={{ width: "100%", height: "100%" }}>
            <StageCamera stage={stage} />

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
                    <AsyncImageRender imageId={view.image.id} matrix={matrix} />
                  </group>
                );
              })}
            </Select>
            <RectangleDrawer onRectangleDrawn={onRectangleDrawn} />
          </ThreeCanvas>
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
    </ViewerStateProvider>
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
