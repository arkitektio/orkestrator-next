import { Card } from "@/components/ui/card";
import { SliderTooltip } from "@/components/ui/slider-tooltip";
import * as THREE from "three";

import { notEmpty } from "@/lib/utils";
import {
  DimSelectorKind,
  ListRgbContextFragment,
  ListRoiFragment,
  RgbImageFragment,
  RgbViewFragment,
  useActiveImageViewsQuery,
  ViewKind
} from "@/mikro-next/api/graphql";
import { OrbitControls } from "@react-three/drei";
import { Canvas as ThreeCanvas } from "@react-three/fiber";
import { Suspense } from "react";
import AcquisitionViewCard from "../cards/AcquisitionViewCard";
import ChannelViewCard from "../cards/ChannelViewCard";
import DerivedViewCard from "../cards/DerivedViewCard";
import FileViewCard from "../cards/FileViewCard";
import HistogramViewCard from "../cards/HistogramViewCard";
import InstanceMaskViewCard from "../cards/InstanceMaskViewCard";
import LabelViewCard from "../cards/LabelViewCard";
import LightpathViewCard from "../cards/LightpathViewCard";
import MaskViewCard from "../cards/MaskViewCard";
import OpticsViewCard from "../cards/OpticsViewCard";
import ROIViewCard from "../cards/ROIViewCard";
import TransformationViewCard from "../cards/TransformationViewCard";
import WellPositionViewCard from "../cards/WellPositionViewCard";
import { AutoZoomCamera } from "./cameras/AutoZoomCamera";
import { CameraFieldOfViewDebug, ChunkBitmapTexture } from "./final/ChunkMesh";
import { ROIPolygon } from "./final/ROIPolygon";
import { useArray } from "./final/useArray";
import { BasicIndexer, IndexerProjection, Slice } from "./indexer";
import { EventPlane } from "./overlays/invisible/EventPlane";
import { PanelContent } from "./panels";
import { RenderControlsMenu } from "./RenderControlsMenu";
import { ROIContextMenu } from "./ROIContextMenu";
import { RoiDrawerCanvas } from "./RoiDrawer";
import { useViewerState, ViewerStateProvider } from "./ViewerStateProvider";

// Grid overlay component with milestone positions
const GridOverlay = ({
  imageWidth,
  imageHeight,
}: {
  imageWidth: number;
  imageHeight: number;
}) => {
  const { showGrid } = useViewerState();

  if (!showGrid) {
    return null;
  }

  const gridSize = 50; // Grid spacing in image units

  return (
    <group position={[0, 0, 0.01]}>
      {/* Grid lines as individual meshes */}
      {Array.from({ length: Math.ceil(imageWidth / gridSize) + 1 }, (_, i) => {
        const x = i * gridSize - imageWidth / 2;
        return (
          <mesh key={`grid-v-${i}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.5, imageHeight, 0.1]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>
        );
      })}

      {Array.from({ length: Math.ceil(imageHeight / gridSize) + 1 }, (_, i) => {
        const y = i * gridSize - imageHeight / 2;
        return (
          <mesh key={`grid-h-${i}`} position={[0, y, 0]}>
            <boxGeometry args={[imageWidth, 0.5, 0.1]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
};

export interface RGBDProps {
  context: ListRgbContextFragment;
  rois: ListRoiFragment[];
  className?: string;
  follow?: "width" | "height";
  hideControls?: boolean;
  z?: number;
  t?: number;
  xStart?: number;
  xEnd?: number;
  yStart?: number;
  yEnd?: number;
  // Callback when a value is clicked, e.g., for updating external state
  onValueClick?: (value: number) => void;
  // Milestone options
  milestones?: Array<{ x: number; y: number; label: string; color?: string }>;
}

export const calculateChunkGrid = (
  selection: (number | Slice | null)[],
  shape,
  chunks,
) => {
  const indexer = new BasicIndexer({
    selection,
    shape: shape,
    chunk_shape: chunks,
  });

  const chunk_loaders: {
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

export type ScaledView =
  ListRgbContextFragment["image"]["derivedScaleViews"][0];

export const ActiveImageViews = (props: {
  context: ListRgbContextFragment;
}) => {
  const { t, z } = useViewerState();

  const { data, error } = useActiveImageViewsQuery({
    variables: {
      image: props.context.image.id,
      selector: {
        t: { kind: DimSelectorKind.Index, index: t },
        z: { kind: DimSelectorKind.Index, index: z },
        c: {
          kind: DimSelectorKind.Indices,
          indices: props.context.views
            .filter((v) => v.active)
            .map((v) => v.cMax)
            .filter(notEmpty),
        },
      },
      exclude: [ViewKind.Rgb],
    },
  });

  if (error) {
    return <div>Error loading active views: {error.message}</div>;
  }

  if (!data) {
    return null;
  }

  if (data.activeViews.length == 0) {
    return <div>No active views found for this image.</div>;
  }

  return (
    <div className="w-full h-full overflow-y-auto p-2 flex flex-col gap-2">
      {data?.activeViews.map((view, index) => (
        <>
          {view.__typename == "AffineTransformationView" && (
            <TransformationViewCard view={view} key={"affine-" + view.id} />
          )}
          {view.__typename == "LightpathView" && (
            <LightpathViewCard view={view} key={"lightpath-" + view.id} />
          )}
          {view.__typename == "LabelView" && (
            <LabelViewCard view={view} key={"label-" + view.id} />
          )}
          {view.__typename == "InstanceMaskView" && (
            <InstanceMaskViewCard item={view} key={"label-" + view.id} />
          )}
          {view.__typename == "MaskView" && (
            <MaskViewCard item={view} key={"label-" + view.id} />
          )}
          {view.__typename == "ChannelView" && (
            <ChannelViewCard view={view} key={"channel-" + view.id} />
          )}
          {view.__typename == "AcquisitionView" && (
            <AcquisitionViewCard view={view} key={"acquisition-" + view.id} />
          )}
          {view.__typename == "WellPositionView" && (
            <WellPositionViewCard
              view={view}
              key={"well-position-" + view.id}
            />
          )}
          {view.__typename == "ROIView" && (
            <ROIViewCard view={view} key={"roi-" + view.id} />
          )}
          {view.__typename == "FileView" && (
            <FileViewCard view={view} key={"file-" + view.id} />
          )}
          {view.__typename == "DerivedView" && (
            <DerivedViewCard view={view} key={"derived-" + view.id} />
          )}
          {view.__typename == "HistogramView" && (
            <HistogramViewCard view={view} key={"histogram-" + view.id} />
          )}
        </>
      ))}
    </div>
  );
};

export const LayerRender = (props: {
  derivedScaleView: ScaledView;
  view: RgbViewFragment;
  z: number;
  affineScaleX: number;
  affineScaleY: number;
  t: number;
  xSize: number;
  availableScales: ScaledView[];
  ySize: number;
}) => {
  const { derivedScaleView, view, xSize, ySize } = props;

  const { z, t } = useViewerState();

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

  // Calculate z-position based on scale: higher resolution (lower scaleX) should be on top
  // Use negative values so 1x is at z=0, 2x at z=-0.001, 4x at z=-0.002, etc.
  const zPosition = (derivedScaleView.scaleX - 1) * 0.001;

  return (
    <group key={`${view.id}-${derivedScaleView.id}`}>
      {/* 1) Depth pre-pass for the blocker */}
      {chunk_loaders.map((chunk_loader) => {
        return (
          <ChunkBitmapTexture
            availableScales={props.availableScales}
            renderFunc={renderView}
            chunk_coords={chunk_loader.chunk_coords}
            chunk_shape={derivedScaleView.image.store.chunks || []}
            key={`${chunk_loader.chunk_coords.join("-")}-${z}-${t}-${view.id}-${view.contrastLimitMax}-${view.contrastLimitMin}-${view.colorMap}-${view.baseColor?.join("-")}`}
            view={view}
            z={z}
            t={t}
            cLimMin={view.contrastLimitMin}
            cLimMax={view.contrastLimitMax}
            affineScaleX={props.affineScaleX}
            affineScaleY={props.affineScaleY}
            imageWidth={xSize}
            imageHeight={ySize}
            derivedScaleView={derivedScaleView}
            scaleX={derivedScaleView.scaleX}
            scaleY={derivedScaleView.scaleY}
            enableCulling={true}
          />
        );
      })}
    </group>
  );
};

export const Controls = ({
  zSize,
  tSize,
  availableScales,
}: {
  zSize: number;
  tSize: number;
  availableScales: number[];
}) => {
  const { z, t, setZ, setT } = useViewerState();

  return (
    <div className="absolute z-100 w-full bottom-0 px-6 bg-gradient-to-t from-black to-transparent py-3 z-20">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <div className="my-auto mx-2 w-12">z: {z}</div>
          {zSize > 1 && (
            <SliderTooltip
              value={[z]}
              onValueChange={(value) => setZ(value[0])}
              min={0}
              max={zSize - 1}
              step={1}
              className="w-full"
              defaultValue={[0]}
            />
          )}

          {/* Controls Menu Button */}
          <RenderControlsMenu availableScales={availableScales} />
        </div>
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
  );
};

export const Panels = () => {
  const {
    openPanels,
    setOpenPanels,
    allowRoiDrawing,
    setAllowRoiDrawing,
    showRois,
    setShowRois,
    showLayerEdges,
    setShowLayerEdges,
    showDebugText,
    setShowDebugText,
    showDisplayStructures,
    setShowDisplayStructures,
    displayStructures,
    removeDisplayStructure,
    clearDisplayStructures,
  } = useViewerState();

  return (
    <>
      {openPanels.map((panel) => (
        <Card
          key={`panel-${panel.identifier}-${panel.object}`}
          style={{
            position: "fixed",
            top: `${panel.positionY}px`,
            left: `${panel.positionX + 200}px`, // Removed the +20px offset
            maxWidth: "300px",
            zIndex: 10,
            transform: "translate(-50%, -50%)", // Center the card on the calculated position
          }}
          className="p-2 shadow-lg"
        >
          <button
            className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
            onClick={() => {
              setOpenPanels([]);
            }}
            title="Close Panel"
          >
            ×
          </button>

          <PanelContent
            panel={panel}
            setOpenPanels={setOpenPanels}
            allowRoiDrawing={allowRoiDrawing}
            setAllowRoiDrawing={setAllowRoiDrawing}
            showRois={showRois}
            setShowRois={setShowRois}
            showLayerEdges={showLayerEdges}
            setShowLayerEdges={setShowLayerEdges}
            showDebugText={showDebugText}
            setShowDebugText={setShowDebugText}
            showDisplayStructures={showDisplayStructures}
            setShowDisplayStructures={setShowDisplayStructures}
            displayStructures={displayStructures}
            removeDisplayStructure={removeDisplayStructure}
            clearDisplayStructures={clearDisplayStructures}
          />
        </Card>
      ))}
    </>
  );
};

export const RoiContextMenu = () => {
  const { roiContextMenu, setRoiContextMenu } = useViewerState();

  {
    /* ROI Context Menu */
  }

  return (
    <>
      {roiContextMenu && (
        <ROIContextMenu
          open={roiContextMenu.open}
          onOpenChange={(open) => {
            if (!open) {
              setRoiContextMenu(null);
            }
          }}
          x={roiContextMenu.x}
          y={roiContextMenu.y}
        />
      )}
    </>
  );
};

export const RGBContextRender = (props: {
  context: ListRgbContextFragment;
  matrix?: THREE.Matrix4;
}) => {
  const rbgContext = props.context;

  const matrix = props.matrix || new THREE.Matrix4().identity();

  const version = rbgContext.image.store.version;
  const zSize = rbgContext.image?.store.shape?.at(2) || 1;
  const tSize = rbgContext.image?.store.shape?.at(1) || 1;
  const xSize = rbgContext.image?.store.shape?.at(3) || 1;
  const ySize = rbgContext.image?.store.shape?.at(4) || 1;

  const affineScaleX = matrix.elements[0];
  const affineScaleY = matrix.elements[5];

  // Get available scales from layers
  const allLayers = rbgContext.image.derivedScaleViews;
  const availableScales = Array.from(
    new Set([1, ...allLayers.map((layer) => layer.scaleX)]),
  ).sort((a, b) => a - b);

  // Get image dimensions for the auto-zoom camera

  if (
    rbgContext.image.store.chunks?.length !=
    rbgContext.image.store.shape?.length
  ) {
    return null;
  }

  if (version != "3") {
    return null;
  }

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

  const selectedLayers = layers;
  // Calculate which chunks are needed for the view

  const chunk_shape = props.context.image.store.chunks;

  if (!chunk_shape) {
    return <div>Chunk shape not found</div>;
  }
  return (
    <>
      {props.context.views.map((view, viewIndex) => {
        // Calculate available scales from all layers
        if (!view.active) {
          return null;
        }

        return (
          <group key={view.id}>
            {selectedLayers.map((layer) => {
              return (
                <LayerRender
                  key={`${viewIndex}-${layer.id}`}
                  derivedScaleView={layer}
                  view={view}
                  affineScaleX={affineScaleX}
                  affineScaleY={affineScaleY}
                  xSize={xSize}
                  ySize={ySize}
                  availableScales={selectedLayers}
                />
              );
            })}
          </group>
        );
      })}
    </>
  );
};

export const FinalRenderInner = (props: RGBDProps) => {
  const rbgContext = props.context;

  const { setZ, z, showGrid } = useViewerState();

  const version = rbgContext.image.store.version;
  const zSize = rbgContext.image?.store.shape?.at(2) || 1;
  const tSize = rbgContext.image?.store.shape?.at(1) || 1;
  const xSize = rbgContext.image?.store.shape?.at(3) || 1;
  const ySize = rbgContext.image?.store.shape?.at(4) || 1;

  // Get available scales from layers
  const allLayers = rbgContext.image.derivedScaleViews;
  const availableScales = Array.from(
    new Set([1, ...allLayers.map((layer) => layer.scaleX)]),
  ).sort((a, b) => a - b);

  // Get image dimensions for the auto-zoom camera

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

  // Handle Alt+scroll for z-stack navigation
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.altKey) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 1 : -1;
      const newZ = Math.max(0, Math.min(zSize - 1, z + delta));
      setZ(newZ);
    }
  };

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

  // Calculate which chunks are needed for the view

  const chunk_shape = props.context.image.store.chunks;

  if (!chunk_shape) {
    return <div>Chunk shape not found</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">


      <Suspense
        fallback={<div className="w-full h-full bg-gray-100"> Loading</div>}
      >
        {/* @ts-expect-error - ThreeCanvas type issue */}
        <ThreeCanvas
          style={{ width: "100%", height: "100%" }}
          data-nonbreaker
          onWheel={handleWheel}
        >
          <AutoZoomCamera
            imageHeight={ySize}
            imageWidth={xSize}
            xEnd={props.xEnd}
            xStart={props.xStart}
            yEnd={props.yEnd}
            yStart={props.yStart}
            follow={props.follow || "width"}
          />
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

          <RGBContextRender context={props.context} />

          {/* Grid overlay with milestone positions */}
          {showGrid && <GridOverlay imageWidth={xSize} imageHeight={ySize} />}

          {/* Clickable background plane for creating panels */}
          <EventPlane xSize={xSize} ySize={ySize} />

          {/* Debug visualization for camera field of view */}
          <CameraFieldOfViewDebug />

          <>
            {props.rois.map((roi) => (
              <ROIPolygon
                key={roi.id}
                roi={roi}
                imageWidth={xSize}
                imageHeight={ySize}
              />
            ))}
            <RoiDrawerCanvas
              imageHeight={ySize}
              imageWidth={xSize}
              image={props.context.image}
              event_key="ctrl"
            />
          </>
        </ThreeCanvas>

        {!props.hideControls && (
          <div className="absolute top-0 right-4 z-10 w-[20%]  py-3 h-[100vh] ">
            <ActiveImageViews context={props.context} />
          </div>
        )}

        <Panels />

        {!props.hideControls && (
          <Controls
            zSize={zSize}
            tSize={tSize}
            availableScales={availableScales}
          />
        )}
      </Suspense>
    </div>
  );
};

// Main component that provides the viewer state context
export const FinalRender = (props: RGBDProps) => {
  // Get available scales from layers for provider initialization
  const allLayers = props.context.image.derivedScaleViews;
  const availableScales = Array.from(
    new Set([1, ...allLayers.map((layer) => layer.scaleX)]),
  ).sort((a, b) => a - b);

  const onCoordinatedClick = (x: number, y: number, z: number) => {
    console.log(`Clicked at image coordinates: x=${x}, y=${y}, z=${z}`);
    // You can extend this to call props.onValueClick if needed
    // or add custom coordinate handling logic here
  };

  return (
    <ViewerStateProvider
      availableScales={availableScales}
      onCoordinatedClick={onCoordinatedClick}
      initialState={{
        // Only most downscaled version enabled by default
        enabledScales: new Set([Math.max(...availableScales)]),
        showRois: true,
        showGrid: false,
        z: props.z || 0,
        t: props.t || 0,
        allowRoiDrawing: false,
      }}
    >
      <FinalRenderInner {...props} />
    </ViewerStateProvider>
  );
};

export const ImageRGBD = (props: { image: RgbImageFragment }) => {
  const context = props.image.rgbContexts.at(0);

  return <>{context && <FinalRender context={context} rois={[]} />}</>;
};
