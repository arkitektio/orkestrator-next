import { useCursor, Wireframe } from "@react-three/drei";

import { Card } from "@/components/ui/card";
import { DelegatingStructureWidget } from "@/components/widgets/returns/DelegatingStructureWidget";
import { MikroROI } from "@/linkers";
import {
  ColorMap,
  ListRgbContextFragment,
  ListRoiFragment,
  RgbImageFragment,
  RgbViewFragment,
} from "@/mikro-next/api/graphql";
import { PortKind, PortScope } from "@/rekuest/api/graphql";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useCallback,
  useRef,
  useState
} from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import {
  blueColormap,
  createColormapTexture,
  greenColormap,
  redColormap,
  viridisColormap,
} from "./final/colormaps";
import { useArray } from "./final/useArray";
import { useAsyncChunk } from "./final/useChunkTexture";
import { BasicIndexer, IndexerProjection, Slice } from "./indexer";
import { ROIPolygon } from "./final/ROIPolygon";
import { WireframeMaterial } from "@react-three/drei/materials/WireframeMaterial";
import { AutoZoomCamera } from "./final/AutoZoomCamera";
import { ChunkBitmapTexture } from "./final/ChunkMesh";

export interface RGBDProps {
  context: ListRgbContextFragment;
  rois: ListRoiFragment[];
  className?: string;
  follow?: "width" | "height";
  onValueClick?: (value: number) => void;
}

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







export const FinalRender = (props: RGBDProps) => {
  const [openPanels, setOpenPanels] = useState<Panel[]>([]);

  const [z, setZ] = useState(0);
  const [t, setT] = useState(0);

  const version = props.context.image.store.version;
  const cSize = props.context.image?.store.shape?.at(0) || 1;
  const zSize = props.context.image?.store.shape?.at(2) || 1;
  const tSize = props.context.image?.store.shape?.at(1) || 1;
  const xSize = props.context.image?.store.shape?.at(3) || 1;
  const ySize = props.context.image?.store.shape?.at(4) || 1;

   // Get image dimensions for the auto-zoom camera
   const imageDimensions = useImageDimensions(props.context);


  if (
    props.context.image.store.chunks?.length !=
    props.context.image.store.shape?.length
  ) {
    return (
      <div>This new chunk loader needs chunks to be present. update mikro </div>
    );
  }

  if (version != "3") {
    return <div>Rendering not implemented for Zarr Version other than 3</div>;
  }

  console.log("Views", props.context.views);

  // Calculate which chunks are needed for the view

  const { renderView } = useArray({
    store: props.context.image.store,
  });

  const chunk_shape = props.context.image.store.chunks;

  if (!chunk_shape) {
    return <div>Chunk shape not found</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">
      <div className="absolute top-0 right-0 z-10">
        <div className="flex flex-col">
          <div className="flex flex-row">
            {z > 0 && (
              <button
                onClick={() => setZ((z) => Math.max(z - 1, 0))}
                className="bg-blue-500 text-white"
              >
                - z
              </button>
            )}
            {z < zSize - 1 && (
              <button
                onClick={() => setZ((z) => z + 1)}
                className="bg-blue-500 text-white"
              >
                + z
              </button>
            )}
          </div>
          <div className="flex flex-row">
            {t > 0 && (
              <button
                onClick={() => setT((t) => Math.max(t - 1, 0))}
                className="bg-blue-500 text-white"
              >
                - z
              </button>
            )}
            {t < tSize - 1 && (
              <button
                onClick={() => setT((t) => t + 1)}
                className="bg-blue-500 text-white"
              >
                + T
              </button>
            )}
          </div>
        </div>
      </div>

      <Suspense
        fallback={<div className="w-full h-full bg-gray-100"> Loading</div>}
      >
        <Canvas style={{ width: "100%", height: "100%" }}>
          <AutoZoomCamera imageHeight={ySize} imageWidth={xSize} />
          <OrbitControls
            enableRotate={false}
            enablePan={true}
            regress={false}
          />

            {props.context.views.map((view, viewIndex) => {
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
                props.context.image.store.shape,
                chunk_shape,
              );

              return (
                <>
                  {chunk_loaders.map((chunk_loader, index) => {
                    return (
                      <ChunkBitmapTexture
                        renderFunc={renderView}
                        chunk_coords={chunk_loader.chunk_coords}
                        chunk_shape={chunk_shape}
                        key={`${index}-${z}-${t}-${viewIndex}`}
                        view={view}
                        t={t}
                        z={z}
                        imageWidth={xSize}
                        imageHeight={ySize}
                      />
                    );
                  })}
                </>
              );
            })}

            {props.rois.map((roi) => (
              <ROIPolygon
                key={roi.id}
                roi={roi}
                setOpenPanels={setOpenPanels}
                imageWidth={xSize}
                imageHeight={ySize}
              />
            ))}
        </Canvas>
      </Suspense>
      {openPanels.map((panel) => (
  <Card
    key={`panel-${panel.identifier}-${panel.object}`}
    style={{
      position: "fixed",
      top: `${panel.positionY}px`,
      left: `${panel.positionX}px`, // Removed the +20px offset
      zIndex: 10,
      transform: "translate(-50%, -50%)", // Center the card on the calculated position
    }}
    className="p-2 shadow-lg"
  >
    <button 
      className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
      onClick={() => setOpenPanels(panels => 
        panels.filter(p => !(p.identifier === panel.identifier && p.object === panel.object))
      )}
    >
      ×
    </button>
    <DelegatingStructureWidget
      port={{
        key: "x",
        nullable: false,
        kind: PortKind.Structure,
        identifier: panel.identifier,
        __typename: "Port",
        scope: PortScope.Global,
      }}
      value={panel.object}
    />
  </Card>
))}
    </div>
  );
};

export const ImageRGBD = (props: { image: RgbImageFragment }) => {
  const context = props.image.rgbContexts.at(0);

  return <>{context && <FinalRender context={context} rois={[]} />}</>;
};
