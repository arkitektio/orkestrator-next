import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SliderTooltip } from "@/components/ui/slider-tooltip";
import { StructureInfo } from "@/kraph/components/mini/StructureInfo";
import {
  ListRgbContextFragment,
  ListRoiFragment,
  RgbImageFragment,
  RgbViewFragment,
} from "@/mikro-next/api/graphql";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Dispatch, SetStateAction, Suspense, useState } from "react";
import { AutoZoomCamera } from "./final/AutoZoomCamera";
import { ChunkBitmapTexture } from "./final/ChunkMesh";
import { ROIPolygon } from "./final/ROIPolygon";
import { useArray } from "./final/useArray";
import { BasicIndexer, IndexerProjection, Slice } from "./indexer";
import { RectangleDrawer } from "./controls/RectangleDrawer";
import { notEmpty } from "@/lib/utils";

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

export const LayerRender = (props: {
  derivedScaleView: ListRgbContextFragment["image"]["derivedScaleViews"][0];
  view: RgbViewFragment;
  z: number;
  t: number;
  xSize: number;
  ySize: number;
}) => {
  const { derivedScaleView, view, z, t, xSize, ySize } = props;

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
            chunk_shape={derivedScaleView.image.store.chunks}
            key={`${index}-${z}-${t}-${view.id}-${view.contrastLimitMax}-${view.contrastLimitMin}-${view.colorMap}-${view.baseColor?.join("-")}`}
            view={view}
            t={t}
            z={z}
            cLimMin={view.contrastLimitMin}
            cLimMax={view.contrastLimitMax}
            imageWidth={xSize}
            imageHeight={ySize}
            scaleX={derivedScaleView.scaleX}
            scaleY={derivedScaleView.scaleY}
          />
        );
      })}
    </group>
  );
};
export const FinalRender = (props: RGBDProps) => {
  const [openPanels, setOpenPanels] = useState<Panel[]>([]);

  const [rbgContext, setRgbContext] = useState(props.context);

  const [z, setZ] = useState(0);
  const [t, setT] = useState(0);
  const [selectedScale, setSelectedScale] = useState(0);

  const version = rbgContext.image.store.version;
  const cSize = rbgContext.image?.store.shape?.at(0) || 1;
  const zSize = rbgContext.image?.store.shape?.at(2) || 1;
  const tSize = rbgContext.image?.store.shape?.at(1) || 1;
  const xSize = rbgContext.image?.store.shape?.at(3) || 1;
  const ySize = rbgContext.image?.store.shape?.at(4) || 1;

  // Get image dimensions for the auto-zoom camera
  const imageDimensions = useImageDimensions(props.context);






  if (
    rbgContext.image.store.chunks?.length !=
    rbgContext.image.store.shape?.length
  ) {
    return (
      <div>This new chunk loader needs chunks to be present. update mikro </div>
    );
  }

  if (version != "3") {
    return <div>Rendering not implemented for Zarr Version other than 3</div>;
  }

  console.log("Views", props.context.views);

  const layers = props.context.image.derivedScaleViews.concat({
    image: props.context.image,
    scaleX: 1,
    scaleY: 1,
    scaleC: 1,
    scaleT: 1,
    scaleZ: 1,
    __typename: "ScaleView",
    id: "extra",
  });

  const selectedLayers = [layers.at(selectedScale)].filter(notEmpty);
  // Calculate which chunks are needed for the view

  const chunk_shape = props.context.image.store.chunks;

  if (!chunk_shape) {
    return <div>Chunk shape not found</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">
      <div className="absolute bottom-0 z-10 w-full mb-4 px-6 bg-gradient-to-t from-black to-transparent py-3">
        <div className="flex flex-col gap-2">
          {zSize > 1 && (
            <div className="flex flex-row">
              <div className="my-auto mx-2 w-12">z: {z}</div>
              <SliderTooltip
                value={[z]}
                onValueChange={(value) => setZ(value[0])}
                min={0}
                max={zSize - 1}
                step={1}
                className="w-full"
                defaultValue={[0]}
              />
              <div className="flex flex-col ml-2">
                {layers.length > 1 && (
                  <>
                    <div className="flex flex-row gap-2">
                      {layers.map((layer, index) => {
                        return (
                          <Button
                            key={index}
                            onClick={() => {
                              setSelectedScale(index);
                            }}
                            size={"sm"}
                            variant="ghost"
                            className={
                              selectedScale === index
                                ? "bg-gray-800"
                                : "bg-gray-900"
                            }
                          >
                            {layer.scaleX} x
                          </Button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {tSize > 1 && (
            <div className="flex flex-row">
              <div className="my-auto mr-2 w-12">t: {t}</div>
              <SliderTooltip
                value={[t]}
                onValueChange={(value) => setT(value[0])}
                min={0}
                max={tSize - 1}
                step={1}
                className="w-full"
                defaultValue={[0]}
              />
            </div>
          )}
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
            return (
              <group key={view.id}>
                {selectedLayers.map((layer) => {
                  return (
                    <LayerRender
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
            onClick={() =>
              setOpenPanels((panels) =>
                panels.filter(
                  (p) =>
                    !(
                      p.identifier === panel.identifier &&
                      p.object === panel.object
                    ),
                ),
              )
            }
          >
            ×
          </button>
          <div className="text-xs text-gray-500"> Knowledge </div>
          <StructureInfo identifier={panel.identifier} object={panel.object} />
        </Card>
      ))}
    </div>
  );
};

export const ImageRGBD = (props: { image: RgbImageFragment }) => {
  const context = props.image.rgbContexts.at(0);

  return <>{context && <FinalRender context={context} rois={[]} />}</>;
};
