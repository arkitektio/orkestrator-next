import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SliderTooltip } from "@/components/ui/slider-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StructureInfo } from "@/kraph/components/mini/StructureInfo";
import * as THREE from "three";
import {
  Eye,
  EyeOff,
  Layers,
  Settings,
  ChevronDown,
  Check,
  Grid3X3,
  Type,
  Edit3,
  Square,
  Circle,
  Minus,
  MoreHorizontal,
  MapPin,
} from "lucide-react";

import {
  ListRgbContextFragment,
  ListRoiFragment,
  RgbImageFragment,
  RgbViewFragment,
  RoiKind,
} from "@/mikro-next/api/graphql";
import { OrbitControls } from "@react-three/drei";
import { Canvas as ThreeCanvas } from "@react-three/fiber";
import { Dispatch, SetStateAction, Suspense, useState } from "react";
import { AutoZoomCamera } from "./final/AutoZoomCamera";
import { ChunkBitmapTexture } from "./final/ChunkMesh";
import { ROIPolygon } from "./final/ROIPolygon";
import { useArray } from "./final/useArray";
import { BasicIndexer, IndexerProjection, Slice } from "./indexer";
import { RoiDrawerCanvas } from "./RoiDrawer";
import { ObjectButton, SmartContext } from "@/rekuest/buttons/ObjectButton";
import { ViewerStateProvider, useViewerState } from "./ViewerStateProvider";

// Helper function to get icon for ROI type
const getRoiIcon = (roiKind: RoiKind) => {
  switch (roiKind) {
    case RoiKind.Rectangle:
      return Square;
    case RoiKind.Ellipsis:
      return Circle;
    case RoiKind.Line:
      return Minus;
    case RoiKind.Point:
      return MapPin;
    case RoiKind.Polygon:
      return MoreHorizontal;
    case RoiKind.Path:
      return Edit3;
    default:
      return Square;
  }
};

// Helper function to get icon for panel kind
const getPanelKindIcon = (kind?: PanelKind) => {
  switch (kind) {
    case "roi_tools":
      return Edit3;
    case "layer_controls":
      return Layers;
    case "view_settings":
      return Settings;
    case "object_info":
      return Eye;
    case "context_menu":
      return MoreHorizontal;
    default:
      return Settings;
  }
};

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

export type PanelKind =
  | "roi_tools"
  | "layer_controls"
  | "view_settings"
  | "object_info"
  | "context_menu";

export interface Panel {
  identifier: string;
  object: string;
  positionX: number;
  positionY: number;
  kind?: PanelKind; // Optional to maintain backward compatibility
  isRightClick?: boolean; // Optional, used for right-click context menu
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

export const LayerRender = (props: {
  derivedScaleView: ListRgbContextFragment["image"]["derivedScaleViews"][0];
  view: RgbViewFragment;
  z: number;
  t: number;
  xSize: number;
  ySize: number;
  enabledScales: Set<number>;
  showLayerEdges: boolean;
  showDebugText: boolean;
}) => {
  const {
    derivedScaleView,
    view,
    z,
    t,
    xSize,
    ySize,
    enabledScales,
    showLayerEdges,
    showDebugText,
  } = props;

  // Don't render if this scale is disabled
  if (!enabledScales.has(derivedScaleView.scaleX)) {
    return null;
  }

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
    <group key={`${z}-${t}-${view.id}-${derivedScaleView.id}`}>
      {chunk_loaders.map((chunk_loader) => {
        return (
          <ChunkBitmapTexture
            renderFunc={renderView}
            chunk_coords={chunk_loader.chunk_coords}
            chunk_shape={derivedScaleView.image.store.chunks || []}
            key={`${chunk_loader.chunk_coords.join("-")}-${z}-${t}-${view.id}-${view.contrastLimitMax}-${view.contrastLimitMin}-${view.colorMap}-${view.baseColor?.join("-")}`}
            view={view}
            t={t}
            z={z}
            cLimMin={view.contrastLimitMin}
            cLimMax={view.contrastLimitMax}
            imageWidth={xSize}
            imageHeight={ySize}
            scaleX={derivedScaleView.scaleX}
            scaleY={derivedScaleView.scaleY}
            enableCulling={true}
            showEdges={showLayerEdges}
            showDebugText={showDebugText}
          />
        );
      })}
    </group>
  );
};

// PanelContent component to render different panel types
const PanelContent = ({
  panel,
  roiDrawMode,
  setRoiDrawMode,
  allowRoiDrawing,
  setAllowRoiDrawing,
  setOpenPanels,
  showRois,
  setShowRois,
  showLayerEdges,
  setShowLayerEdges,
  showDebugText,
  setShowDebugText,
}: {
  panel: Panel;
  roiDrawMode: RoiKind;
  setRoiDrawMode: (mode: RoiKind) => void;
  allowRoiDrawing: boolean;
  setAllowRoiDrawing: (allow: boolean) => void;
  showRois: boolean;
  setOpenPanels: Dispatch<SetStateAction<Panel[]>>;
  setShowRois: (show: boolean) => void;
  showLayerEdges: boolean;
  setShowLayerEdges: (show: boolean) => void;
  showDebugText: boolean;
  setShowDebugText: (show: boolean) => void;
}) => {
  const PanelIcon = getPanelKindIcon(panel.kind);

  if (panel.isRightClick) {
    return (
      <SmartContext
        identifier={panel.identifier}
        object={panel.object}
        onDone={() => setOpenPanels([])}
      />
    );
  }

  switch (panel.kind) {
    case "roi_tools":
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <PanelIcon className="w-4 h-4" />
            <span className="text-sm font-medium">ROI Tools</span>
          </div>
          <div className="text-xs text-gray-400 mb-2">
            Click to open ROI tools • Shift+Click for Layer Controls •
            Ctrl+Click for View Settings
          </div>

          {/* ROI Drawing Toggle */}
          <Button
            size="sm"
            variant={allowRoiDrawing ? "default" : "outline"}
            onClick={() => setAllowRoiDrawing(!allowRoiDrawing)}
            className="w-full justify-start"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {allowRoiDrawing ? "Disable Drawing" : "Enable Drawing"}
          </Button>

          {/* ROI Drawing Mode Selection */}
          {allowRoiDrawing && (
            <div className="grid grid-cols-2 gap-1">
              {[
                RoiKind.Rectangle,
                RoiKind.Ellipsis,
                RoiKind.Polygon,
                RoiKind.Line,
                RoiKind.Point,
                RoiKind.Path,
              ].map((kind) => {
                const IconComponent = getRoiIcon(kind);
                return (
                  <Button
                    key={kind}
                    size="sm"
                    variant={roiDrawMode === kind ? "default" : "outline"}
                    onClick={() => setRoiDrawMode(kind)}
                    className="p-2"
                    title={kind.charAt(0) + kind.slice(1).toLowerCase()}
                  >
                    <IconComponent className="w-3 h-3" />
                  </Button>
                );
              })}
            </div>
          )}

          {/* ROI Visibility Toggle */}
          <Button
            size="sm"
            variant={showRois ? "default" : "outline"}
            onClick={() => setShowRois(!showRois)}
            className="w-full justify-start"
          >
            {showRois ? (
              <Eye className="w-4 h-4 mr-2" />
            ) : (
              <EyeOff className="w-4 h-4 mr-2" />
            )}
            {showRois ? "Hide ROIs" : "Show ROIs"}
          </Button>
        </div>
      );

    case "layer_controls":
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <PanelIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Layer Controls</span>
          </div>
          <div className="text-xs text-gray-400 mb-2">
            Opened with Shift+Click on image
          </div>

          <Button
            size="sm"
            variant={showLayerEdges ? "default" : "outline"}
            onClick={() => setShowLayerEdges(!showLayerEdges)}
            className="w-full justify-start"
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            {showLayerEdges ? "Hide Edges" : "Show Edges"}
          </Button>

          <Button
            size="sm"
            variant={showDebugText ? "default" : "outline"}
            onClick={() => setShowDebugText(!showDebugText)}
            className="w-full justify-start"
          >
            <Type className="w-4 h-4 mr-2" />
            {showDebugText ? "Hide Debug" : "Show Debug"}
          </Button>
        </div>
      );

    case "view_settings":
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <PanelIcon className="w-4 h-4" />
            <span className="text-sm font-medium">View Settings</span>
          </div>
          <div className="text-xs text-gray-400 mb-2">
            Opened with Ctrl+Click on image
          </div>
          <div className="text-xs text-gray-500">
            View configuration options would go here
          </div>
        </div>
      );

    case "object_info":
    default:
      return (
        <>
          <ObjectButton
            identifier={panel.identifier}
            object={panel.object}
            onDone={() => setOpenPanels([])}
          >
            <Button variant={"outline"} className="w-6 h-9 text-white">
              Do
            </Button>
          </ObjectButton>

          <div className="text-xs text-gray-500"> Knowledge </div>
          <StructureInfo identifier={panel.identifier} object={panel.object} />
        </>
      );
  }
};

// Clickable plane component for handling background clicks
const ClickablePlane = ({
  xSize,
  ySize,
  setOpenPanels,
}: {
  xSize: number;
  ySize: number;
  setOpenPanels: Dispatch<SetStateAction<Panel[]>>;
}) => {
  const handleClick = (event: any) => {
    // Determine panel type based on click modifier keys
    let panelKind: PanelKind = "roi_tools"; // default

    // Check for modifier keys to determine panel type
    if (event.altKey) {
      panelKind = "layer_controls";
    } else if (event.ctrlKey || event.metaKey) {
      panelKind = "view_settings";
    } else {
      return; // Do nothing if Alt is pressed
    }

    event.stopPropagation();

    // Calculate position - use center of screen as fallback
    const positionX = window.innerWidth / 2;
    const positionY = window.innerHeight / 2;

    // Close all existing panels and create a new one
    setOpenPanels([
      {
        identifier: "image_click_panel",
        object: `canvas_${Date.now()}`, // unique object id
        positionX,
        positionY,
        kind: panelKind,
      },
    ]);
  };

  return (
    <mesh position={[0, 0, -0.001]} onClick={handleClick}>
      <planeGeometry args={[xSize, ySize]} />
      <meshBasicMaterial transparent={true} opacity={0} depthWrite={false} />
    </mesh>
  );
};

export const FinalRenderInner = (props: RGBDProps) => {
  const [openPanels, setOpenPanels] = useState<Panel[]>([]);
  const rbgContext = props.context;

  // Use the viewer state from context
  const {
    z,
    t,
    showRois,
    showLayerEdges,
    showDebugText,
    enabledScales,
    allowRoiDrawing,
    roiDrawMode,
    setZ,
    setT,
    setShowRois,
    setShowLayerEdges,
    setShowDebugText,
    setAllowRoiDrawing,
    setRoiDrawMode,
    toggleScale,
  } = useViewerState();

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

  const selectedLayers = layers;
  // Calculate which chunks are needed for the view

  const chunk_shape = props.context.image.store.chunks;

  if (!chunk_shape) {
    return <div>Chunk shape not found</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">
      <div className="absolute bottom-0 z-10 w-full mb-4 px-6 bg-gradient-to-t from-black to-transparent py-3">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-gray-800 text-gray-300 hover:bg-gray-700"
                  title="Toggle controls menu"
                >
                  <Settings className="w-4 h-4" />
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-gray-900 border-gray-700">
                <>
                  <DropdownMenuLabel className="text-gray-400">
                    Enable Rois
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => setShowRois(!showRois)}
                    className={`cursor-pointer ${
                      showRois
                        ? "bg-blue-800 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    {showRois ? (
                      <Eye className="w-4 h-4 mr-2" />
                    ) : (
                      <EyeOff className="w-4 h-4 mr-2" />
                    )}
                    {showRois ? "Hide ROIs" : "Show ROIs"}
                  </DropdownMenuItem>

                  {/* ROI Drawing Controls */}
                  <DropdownMenuItem
                    onClick={() => setAllowRoiDrawing(!allowRoiDrawing)}
                    className={`cursor-pointer ${
                      allowRoiDrawing
                        ? "bg-green-800 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {allowRoiDrawing
                      ? "Disable ROI Drawing"
                      : "Enable ROI Drawing"}
                  </DropdownMenuItem>

                  {/* ROI Drawing Mode Selection */}
                  {allowRoiDrawing && (
                    <>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuLabel className="text-gray-400">
                        Drawing Mode
                      </DropdownMenuLabel>
                      {[
                        RoiKind.Rectangle,
                        RoiKind.Ellipsis,
                        RoiKind.Polygon,
                        RoiKind.Line,
                        RoiKind.Point,
                        RoiKind.Path,
                      ].map((kind) => {
                        const IconComponent = getRoiIcon(kind);
                        return (
                          <DropdownMenuItem
                            key={kind}
                            onClick={() => setRoiDrawMode(kind)}
                            className={`cursor-pointer ${
                              roiDrawMode === kind
                                ? "bg-green-800 text-white"
                                : "text-gray-300 hover:bg-gray-800"
                            }`}
                          >
                            <IconComponent className="w-4 h-4 mr-2" />
                            {kind.charAt(0) + kind.slice(1).toLowerCase()}
                            {roiDrawMode === kind && (
                              <Check className="w-3 h-3 ml-auto" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </>
                  )}

                  <DropdownMenuSeparator className="bg-gray-700" />
                </>

                {/* Layer Display Controls */}
                <DropdownMenuLabel className="text-gray-400">
                  Layer Display
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setShowLayerEdges(!showLayerEdges)}
                  className={`cursor-pointer ${
                    showLayerEdges
                      ? "bg-blue-800 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  {showLayerEdges ? "Hide Layer Edges" : "Show Layer Edges"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDebugText(!showDebugText)}
                  className={`cursor-pointer ${
                    showDebugText
                      ? "bg-blue-800 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <Type className="w-4 h-4 mr-2" />
                  {showDebugText ? "Hide Debug Text" : "Show Debug Text"}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />

                {/* Scale Selection Controls */}
                {availableScales.length > 1 && (
                  <>
                    <DropdownMenuLabel className="text-gray-400">
                      Render Scales
                    </DropdownMenuLabel>
                    {availableScales.map((scale) => (
                      <DropdownMenuItem
                        key={scale}
                        onClick={() => toggleScale(scale)}
                        className={`cursor-pointer ${
                          enabledScales.has(scale)
                            ? "bg-green-800 text-white"
                            : "text-gray-400 hover:bg-gray-800"
                        }`}
                      >
                        <Layers className="w-3 h-3 mr-2" />
                        {scale}x
                        {enabledScales.has(scale) && (
                          <Check className="w-3 h-3 ml-auto" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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

      <Suspense
        fallback={<div className="w-full h-full bg-gray-100"> Loading</div>}
      >
        {/* @ts-expect-error - ThreeCanvas type issue */}
        <ThreeCanvas style={{ width: "100%", height: "100%" }}>
          <AutoZoomCamera
            imageHeight={ySize}
            imageWidth={xSize}
            contextId={props.context.id}
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

          {props.context.views.map((view, viewIndex) => {
            // Calculate available scales from all layers

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
                      enabledScales={enabledScales}
                      showLayerEdges={showLayerEdges}
                      showDebugText={showDebugText}
                    />
                  );
                })}
              </group>
            );
          })}

          {/* Clickable background plane for creating panels */}
          <ClickablePlane
            xSize={xSize}
            ySize={ySize}
            setOpenPanels={setOpenPanels}
          />

          {showRois && (
            <>
              {props.rois.map((roi) => (
                <ROIPolygon
                  key={roi.id}
                  roi={roi}
                  setOpenPanels={setOpenPanels}
                  imageWidth={xSize}
                  imageHeight={ySize}
                />
              ))}

              {allowRoiDrawing && (
                <RoiDrawerCanvas
                  imageHeight={ySize}
                  imageWidth={xSize}
                  z={z}
                  t={t}
                  c={0}
                  image={props.context.image}
                />
              )}
            </>
          )}
        </ThreeCanvas>
      </Suspense>

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
            roiDrawMode={roiDrawMode}
            setRoiDrawMode={setRoiDrawMode}
            allowRoiDrawing={allowRoiDrawing}
            setAllowRoiDrawing={setAllowRoiDrawing}
            showRois={showRois}
            setShowRois={setShowRois}
            showLayerEdges={showLayerEdges}
            setShowLayerEdges={setShowLayerEdges}
            showDebugText={showDebugText}
            setShowDebugText={setShowDebugText}
          />
        </Card>
      ))}
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

  return (
    <ViewerStateProvider
      availableScales={availableScales}
      initialState={{
        // Only most downscaled version enabled by default
        enabledScales: new Set([Math.max(...availableScales)]),
        showRois: true,
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
