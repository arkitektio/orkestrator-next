import { Canvas } from "@react-three/fiber";
import { WebGPURenderer } from "three/webgpu";
import { useEffect, useState, type ReactNode } from "react";
import { CameraMatrixSync } from "./CameraMatrixSync";
import { PerfFrameProbe } from "./PerfFrameProbe";
import { QualityAdapter } from "./cameras/QualityAdapter";
import { CameraController } from "./cameras/CameraController";
import { InitialCameraFit } from "./cameras/InitialCameraFit";
import { CanvasSync } from "./cameras/CanvasSync";
import { KeyboardModeController } from "./controllers/KeyboardModeController";
import { SceneAxis } from "./layers/SceneAxis";
import { SceneOverlay } from "./overlays/SceneOverlay";
import { ScaleBar } from "./ScaleBar";
import { ScaleGrid } from "./ScaleGrid";
import { PanelProvider } from "./PanelProvider";
import { LayerControlPanel } from "./panels/LayerControlPanel";
import { ProbeThresholdPanel } from "./panels/ProbeThresholdPanel";
import { DebugPanel } from "./panels/DebugPanel";
import { SelectedRoiPanel } from "./panels/SelectedRoiPanel";
import { ZSliderPanel } from "./panels/ZSliderPanel";
import { createModeStore, ModeStoreContext, useModeStore } from "./store/modeStore";
import { createViewStore, ViewStoreContext } from "./store/viewStore";
import { SceneFragment } from "@/mikro-next/api/graphql";
import { createViewerStore, ViewerStoreContext, useViewerStore } from "./store/viewerStore";
import { createSelectionStore, SelectionStoreContext } from "./store/selectionStore";
import { GizmoHelper, GizmoViewport} from '@react-three/drei'
import { createSceneStore, SceneStoreContext } from "./store/sceneStore";
import { VisibilityManager } from "./managers/VisibilityManager";
import { BrickSystemProvider } from "./managers/BrickSystemProvider";
import { BrickResidencyOverlay } from "./overlays/BrickResidencyOverlay";
import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";
import { createRoiDrawingStore, RoiDrawingStoreContext } from "./store/roiDrawingStore";
import { createRoiSelectionStore, RoiSelectionStoreContext } from "./store/roiSelectionStore";
import { RoiToolbar } from "./overlays/RoiToolbar";
import { TwoDScene } from "./TwoDScene";
import { ThreeDScene } from "./ThreeDScene";

export const SceneWrapper = ({ children }: { children: ReactNode }) => {
  // `select-none` on the canvas surface stops a drag (pan / ROI draw / probe)
  // from ever turning into a text selection. Overlays keep normal selection.
  //
  // Renderer: three's WebGPURenderer (async init via R3F v9's gl factory).
  // On macOS this is native Metal — killing the ANGLE texSubImage3D upload
  // stalls (P19) — and where WebGPU is unavailable it transparently falls back
  // to its WebGL2 backend; the TSL brick shaders compile for both.
  return <Canvas
        className="select-none [-webkit-user-select:none]"
        frameloop="demand"
        gl={async (props) => {
          const renderer = new WebGPURenderer({
            ...(props as Record<string, unknown>),
            antialias: true,
          });
          await renderer.init();

          const anyRenderer = renderer as unknown as {
            backend?: { isWebGPUBackend?: boolean };
            capabilities?: { getMaxAnisotropy?: () => number };
            getMaxAnisotropy?: () => number;
          };

          // drei compat shim: several drei components (GizmoViewport's
          // AxisHead, …) read `gl.capabilities.getMaxAnisotropy()`, which only
          // exists on WebGLRenderer. WebGPURenderer exposes a top-level
          // getMaxAnisotropy() — bridge it.
          if (!anyRenderer.capabilities) {
            anyRenderer.capabilities = {
              getMaxAnisotropy: () => anyRenderer.getMaxAnisotropy?.() ?? 1,
            };
          } else if (typeof anyRenderer.capabilities.getMaxAnisotropy !== "function") {
            anyRenderer.capabilities.getMaxAnisotropy = () =>
              anyRenderer.getMaxAnisotropy?.() ?? 1;
          }

          const isWebGPU = anyRenderer.backend?.isWebGPUBackend === true;
          const gpuApiPresent =
            typeof navigator !== "undefined" && "gpu" in navigator;
          console.info(
            `[scene] renderer initialized — backend: ${isWebGPU ? "WebGPU" : "WebGL2 fallback"}` +
              (isWebGPU
                ? ""
                : gpuApiPresent
                  ? " (navigator.gpu present but no adapter — GPU/driver rejected WebGPU)"
                  : " (navigator.gpu missing — Chromium flags not active; on Linux the main-process switches need a full Electron restart)"),
          );
          return renderer;
        }}>{children}</Canvas>;
};

const SceneModeContent = () => {
  const displayMode = useModeStore((state) => state.displayMode);

  return displayMode === "2D" ? <TwoDScene /> : <ThreeDScene />;
};

/**
 * Mount-gate for debug consumers. The DebugPanel and BrickResidencyOverlay
 * subscribe to streaming-cadence state (`residencyVersion`, `nodePlans`); when
 * mounted with debug off they still re-render (to null) on every bump. Gating
 * the MOUNT here means those subscriptions don't exist at all outside debug.
 */
const WhenDebug = ({ children }: { children: ReactNode }) => {
  const debug = useViewerStore((s) => s.debug);
  return debug ? <>{children}</> : null;
};


type SceneScope = {
  modeStore: ReturnType<typeof createModeStore>;
  viewStore: ReturnType<typeof createViewStore>;
  viewerStore: Awaited<ReturnType<typeof createViewerStore>>;
  selectionStore: ReturnType<typeof createSelectionStore>;
  sceneStore: ReturnType<typeof createSceneStore>;
  roiDrawingStore: ReturnType<typeof createRoiDrawingStore>;
  roiSelectionStore: ReturnType<typeof createRoiSelectionStore>;
};



export const Scene = (props: { scene: SceneFragment }) => {

  const client = useMikro();
  const datalayer = useDatalayerEndpoint();
  const [scope, setScope] = useState<SceneScope | null>(null);
  const [sceneInitializationError, setSceneInitializationError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initializeSceneScope = async () => {
      setScope(null);
      setSceneInitializationError(null);

      try {
        if (!datalayer) {
          throw new Error("No datalayer endpoint configured");
        }

        const localScope: SceneScope = {
          modeStore: createModeStore(),
          viewStore: createViewStore(),
          viewerStore: await createViewerStore(props.scene, client, datalayer),
          selectionStore: createSelectionStore(),
          sceneStore: createSceneStore({ scene: props.scene }),
          roiDrawingStore: createRoiDrawingStore(),
          roiSelectionStore: createRoiSelectionStore(),
        };

        if (!cancelled) {
          setScope(localScope);
        }
      } catch (error) {
        if (!cancelled) {
          setSceneInitializationError(
            error instanceof Error ? error.message : String(error),
          );
        }
      }
    };

    initializeSceneScope();

    return () => {
      cancelled = true;
    };
  }, [props.scene, client, datalayer]);


    if (!scope) {
      return (
        <div className="relative h-full w-full overflow-hidden rounded-lg bg-black">
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-300">
            {sceneInitializationError
              ? `Scene initialization failed: ${sceneInitializationError}`
              : "Initializing scene data..."}
          </div>
        </div>
      );
    }




  return (
    <ModeStoreContext.Provider value={scope.modeStore}>
      <ViewStoreContext.Provider value={scope.viewStore}>
        <ViewerStoreContext.Provider value={scope.viewerStore}>
          <SelectionStoreContext.Provider value={scope.selectionStore}>
            <SceneStoreContext.Provider value={scope.sceneStore}>
            <RoiDrawingStoreContext.Provider value={scope.roiDrawingStore}>
            <RoiSelectionStoreContext.Provider value={scope.roiSelectionStore}>



        <div className="relative h-full w-full overflow-hidden rounded-lg bg-black">
          <PanelProvider>
            <KeyboardModeController />
            <SceneWrapper>
              <ambientLight intensity={0.7} />
              <pointLight position={[100, 100, 100]} />

              {/* The Camera Matrix Sync ensures that we can access the view matrix outside in html world */}
              <CameraMatrixSync />
              <PerfFrameProbe />
              <CameraController />
              {/* Must follow CameraController: fits the as-loaded scene extent
                  before the first painted frame (and on 2D/3D remounts). */}
              <InitialCameraFit />
              <QualityAdapter />
              <CanvasSync />

              {/* Interaction Layers */}
              {/* The SceneAxis is a simple XYZ axis helper that also shows the scale of the scene */}
              <SceneAxis/>
              <ScaleGrid />

              <SceneModeContent />

              <BrickSystemProvider />
              <WhenDebug>
                <BrickResidencyOverlay />
              </WhenDebug>

              <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
                <GizmoViewport labelColor="white" axisHeadScale={1} axisColors={["rgb(78, 78, 78)", "rgb(78, 78, 78)", "rgb(78, 78, 78)"]}/>
              </GizmoHelper>
            </SceneWrapper>

            {/* Scene controls + layer list stack as one top-right column, so the
                control card can be any height (2D/3D) without overlapping the
                layer list, which just takes the remaining space. */}
            <div className="pointer-events-none absolute right-3 top-3 bottom-3 z-30 flex w-72 flex-col gap-2">
              <SceneOverlay />
              <ProbeThresholdPanel />
              <LayerControlPanel />
            </div>
            <WhenDebug>
              <DebugPanel />
            </WhenDebug>
            <SelectedRoiPanel />
            <ZSliderPanel />
            <VisibilityManager/>
            <ScaleBar />

            <RoiToolbar />
          </PanelProvider>
        </div>
                </RoiSelectionStoreContext.Provider>
                </RoiDrawingStoreContext.Provider>
                </SceneStoreContext.Provider>
        </SelectionStoreContext.Provider>
          </ViewerStoreContext.Provider>
        </ViewStoreContext.Provider>
    </ModeStoreContext.Provider>
  );
};

