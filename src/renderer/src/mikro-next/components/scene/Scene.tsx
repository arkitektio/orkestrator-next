import { Canvas } from "@react-three/fiber";
import { WebGPURenderer } from "three/webgpu";
import { useEffect, useState, type ReactNode } from "react";
import { CameraMatrixSync } from "./CameraMatrixSync";
import { PerfFrameProbe } from "./PerfFrameProbe";
import { QualityAdapter } from "./cameras/QualityAdapter";
import { CameraController } from "./cameras/CameraController";
import { InitialCameraFit } from "./cameras/InitialCameraFit";
import { AnimationPlayer } from "./cameras/AnimationPlayer";
import { CanvasSync } from "./cameras/CanvasSync";
import { KeyboardModeController } from "./controllers/KeyboardModeController";
import { SceneAxis } from "./layers/SceneAxis";
import { SceneOverlay } from "./overlays/SceneOverlay";
import { SceneScreenshot } from "./overlays/SceneScreenshot";
import { ScaleBar } from "./ScaleBar";
import { ScaleGrid } from "./ScaleGrid";
import { PanelProvider } from "./PanelProvider";
import {
  SceneColumn,
  SceneColumnPanels,
  SceneColumnTrigger,
} from "./SceneColumn";
import { SceneDock } from "./SceneDock";
import { LayerControlPanel } from "./panels/LayerControlPanel";
import { AnimationPanel } from "./panels/AnimationPanel";
import { SelectedPointPanel } from "./panels/SelectedPointPanel";
import { DebugPanel } from "./panels/DebugPanel";
import { SelectedRoiPanel } from "./panels/SelectedRoiPanel";
import { ZSliderPanel } from "./panels/ZSliderPanel";
import { DimSliderPanel } from "./panels/DimSliderPanel";
import { createModeStore, ModeStoreContext, useModeStore } from "./store/modeStore";
import { createViewStore, ViewStoreContext } from "./store/viewStore";
import { SceneFragment } from "@/mikro-next/api/graphql";
import { createViewerStore, ViewerStoreContext, useViewerStore } from "./store/viewerStore";
import { createSelectionStore, SelectionStoreContext } from "./store/selectionStore";
import { GizmoHelper, GizmoViewport} from '@react-three/drei'
import {
  createSceneStore,
  SceneStoreContext,
  useSceneStore,
} from "./store/sceneStore";
import {
  createAnimationStore,
  AnimationStoreContext,
} from "./store/animationStore";
import { resolveSceneCameraFrame } from "./core/cameraState";
import { resolvePreferredDisplayMode } from "./core/preferredView";
import { VisibilityManager } from "./managers/VisibilityManager";
import { ProbeValueTracker } from "./managers/ProbeValueTracker";
import { AttributeProbeTracker } from "./managers/AttributeProbeTracker";
import { BrickSystemProvider } from "./managers/BrickSystemProvider";
import { BrickResidencyOverlay } from "./overlays/BrickResidencyOverlay";
import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";
import { createRoiDrawingStore, RoiDrawingStoreContext } from "./store/roiDrawingStore";
import { createRoiSelectionStore, RoiSelectionStoreContext } from "./store/roiSelectionStore";
import { RoiToolbar } from "./overlays/RoiToolbar";
import { TwoDScene } from "./TwoDScene";
import { ThreeDScene } from "./ThreeDScene";
import {
  assertWebGPUSupported,
  WebGPUUnavailableError,
} from "./render/gpu/webgpuSupport";

const SceneWrapper = ({ children }: { children: ReactNode }) => {
  // `select-none` on the canvas surface stops a drag (pan / ROI draw / probe)
  // from ever turning into a text selection. Overlays keep normal selection.
  //
  // Renderer: three's WebGPURenderer (async init via R3F v9's gl factory).
  // WebGPU is required — SceneRoot gates on assertWebGPUSupported() before this
  // ever mounts. On macOS this is native Metal, which is what kills the ANGLE
  // texSubImage3D upload stalls (P19).
  return <Canvas
        className="select-none [-webkit-user-select:none]"
        frameloop="demand"
        gl={async (props) => {
          const renderer = new WebGPURenderer({
            ...(props as Record<string, unknown>),
            antialias: true,
          });

          // three 0.184 has no forceWebGPU, and WebGPURenderer's constructor
          // unconditionally overwrites parameters.getFallback with its own
          // WebGL2 closure (three.webgpu.js:82651), so a caller-supplied one is
          // discarded. Nulling the private field the base Renderer read it into
          // (three.webgpu.js:58077) is the only lever: init() then rejects at
          // three.webgpu.js:58528 instead of silently swapping in a WebGL2
          // backend we no longer carry upload paths for. Re-verify on any three
          // upgrade.
          (renderer as unknown as { _getFallback: unknown })._getFallback = null;

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

          // Tripwire, not a UX path: if a three upgrade reintroduces a fallback
          // route, fail loudly rather than render a scene that lies about its
          // backend. R3F v9 fire-and-forgets this factory's promise
          // (react-three-fiber.esm.js:111), so this surfaces only as an
          // unhandled rejection — the user-facing gate is
          // assertWebGPUSupported() in SceneRoot.
          if (anyRenderer.backend?.isWebGPUBackend !== true) {
            throw new Error(
              "[scene] WebGPURenderer initialized on a non-WebGPU backend — " +
                "three's WebGL2 fallback should be unreachable.",
            );
          }

          console.info("[scene] renderer initialized — backend: WebGPU");
          return renderer;
        }}>{children}</Canvas>;
};

const SceneModeContent = () => {
  const displayMode = useModeStore((state) => state.displayMode);

  return displayMode === "2D" ? <TwoDScene /> : <ThreeDScene />;
};

/**
 * The scene's `backgroundColor` as an inline style, or nothing at all.
 *
 * Null means "the viewer keeps its own", so it must fall through to the
 * `bg-black` class rather than resolve to a colour here. Components are RGBA in
 * 0..1 (the schema's own convention, as on `SceneSnapshot.majorColor`); alpha
 * is optional and defaults to opaque. The Canvas itself stays transparent, so
 * this div showing through IS the background.
 */
const backgroundStyle = (
  color: readonly number[] | null | undefined,
): { backgroundColor: string } | undefined => {
  if (!color || color.length < 3) return undefined;
  const [r, g, b, a = 1] = color;
  const channel = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 255);
  return { backgroundColor: `rgba(${channel(r)}, ${channel(g)}, ${channel(b)}, ${a})` };
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
  animationStore: ReturnType<typeof createAnimationStore>;
  roiDrawingStore: ReturnType<typeof createRoiDrawingStore>;
  roiSelectionStore: ReturnType<typeof createRoiSelectionStore>;
};



/**
 * The layer list, reading its scene from the store rather than a prop, so it can
 * be composed anywhere inside a <Scene> without the host threading an id down.
 */
const SceneLayers = () => {
  const sceneId = useSceneStore((state) => state.id);
  return <LayerControlPanel sceneId={sceneId} />;
};

/**
 * The panel stack a scene gets when its host composes nothing: everything on
 * the left, foldable. Exported as Scene.DefaultPanels so a host that only wants
 * to *add* a panel can render it alongside its own instead of restating it.
 */
const DefaultScenePanels = () => (
  <>
    <SceneColumn>
      <SceneColumnTrigger />
      <SceneColumnPanels>
        <SceneOverlay />
        <SelectedPointPanel />
        <SceneLayers />
        <AnimationPanel />
      </SceneColumnPanels>
    </SceneColumn>
    {/* Z docks right, opposite the panel column: both defaulting left would
        stack the scrubber on top of the layer list. */}
    <SceneDock side="right">
      <ZSliderPanel />
    </SceneDock>
    <SceneDock side="bottom">
      <DimSliderPanel />
    </SceneDock>
  </>
);

const SceneRoot = (props: { scene: SceneFragment; children?: ReactNode }) => {

  const client = useMikro();
  const datalayer = useDatalayerEndpoint();
  const [scope, setScope] = useState<SceneScope | null>(null);
  const [sceneInitializationError, setSceneInitializationError] =
    useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initializeSceneScope = async () => {
      setScope(null);
      setSceneInitializationError(null);

      try {
        // Gate before anything expensive: a scene without WebGPU cannot render
        // at all, so fail here rather than mount a Canvas that would silently
        // downgrade itself to a backend we no longer support.
        await assertWebGPUSupported();

        if (!datalayer) {
          throw new Error("No datalayer endpoint configured");
        }

        const sceneStore = createSceneStore({ scene: props.scene });
        // Both the opening view and the pose frame are facts about the scene AS
        // LOADED, so they are resolved from the normalized layers the scene
        // store just built rather than re-derived per consumer.
        const layers = sceneStore.getState().originalLayers;

        const localScope: SceneScope = {
          modeStore: createModeStore({
            displayMode: resolvePreferredDisplayMode(props.scene.preferredView, layers),
          }),
          viewStore: createViewStore(),
          viewerStore: await createViewerStore(props.scene, client, datalayer),
          selectionStore: createSelectionStore(),
          sceneStore,
          animationStore: createAnimationStore({
            scene: props.scene,
            frame: resolveSceneCameraFrame(props.scene.worldCoordinateSystem, layers),
          }),
          roiDrawingStore: createRoiDrawingStore(),
          roiSelectionStore: createRoiSelectionStore(),
        };

        if (!cancelled) {
          setScope(localScope);
        }
      } catch (error) {
        if (!cancelled) {
          setSceneInitializationError(
            error instanceof Error ? error : new Error(String(error)),
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
      // A missing GPU is an environment problem, not a scene problem — saying
      // "scene initialization failed" would send the reader hunting in the
      // wrong place.
      const prefix =
        sceneInitializationError instanceof WebGPUUnavailableError
          ? "This scene cannot be rendered"
          : "Scene initialization failed";
      return (
        <div className="relative h-full w-full overflow-hidden rounded-lg bg-black">
          <div className="flex h-full w-full items-center justify-center px-8 text-center text-sm text-zinc-300">
            {sceneInitializationError
              ? `${prefix}: ${sceneInitializationError.message}`
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
            <AnimationStoreContext.Provider value={scope.animationStore}>
            <RoiDrawingStoreContext.Provider value={scope.roiDrawingStore}>
            <RoiSelectionStoreContext.Provider value={scope.roiSelectionStore}>



        <div
          className="relative h-full w-full overflow-hidden rounded-lg bg-black"
          style={backgroundStyle(props.scene.backgroundColor)}
        >
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
              {/* Also after CameraController: drives the camera along a playing
                  tour. Idle (and free) until something calls `play`. */}
              <AnimationPlayer />
              <QualityAdapter />
              <CanvasSync />
              <SceneScreenshot />

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

            {/* The panel stack is the host's to compose — see DefaultScenePanels
                for the shape, and Scene.Column for what positions it. Panels
                below this line are the renderer's own (they answer to the
                canvas, not to a layout choice) and are not composable. */}
            {props.children ?? <DefaultScenePanels />}

            <WhenDebug>
              <DebugPanel />
            </WhenDebug>
            <SelectedRoiPanel />
            <VisibilityManager/>
            <ProbeValueTracker />
            <AttributeProbeTracker />
            <ScaleBar />

            <RoiToolbar />
          </PanelProvider>
        </div>
                </RoiSelectionStoreContext.Provider>
                </RoiDrawingStoreContext.Provider>
                </AnimationStoreContext.Provider>
                </SceneStoreContext.Provider>
        </SelectionStoreContext.Provider>
          </ViewerStoreContext.Provider>
        </ViewStoreContext.Provider>
    </ModeStoreContext.Provider>
  );
};

/**
 * Composable scene renderer.
 *
 * `<Scene scene={scene} />` gives the default panel stack. To compose, pass
 * children — they render inside the scene's stores, so every panel below works
 * with no props:
 *
 *   <Scene scene={scene}>
 *     <Scene.Column side="left">
 *       <Scene.Trigger />
 *       <Scene.Panels>
 *         <MyOwnCard />
 *         <Scene.Controls />
 *         <Scene.Probe />
 *         <Scene.Layers />
 *       </Scene.Panels>
 *     </Scene.Column>
 *     <Scene.Dock side="bottom">
 *       <Scene.ZSlider />
 *       <Scene.DimSliders />
 *     </Scene.Dock>
 *   </Scene>
 *
 * A dock's side decides its sliders' orientation, so moving a scrubber to
 * another edge is a one-word change.
 */
export const Scene = Object.assign(SceneRoot, {
  Column: SceneColumn,
  Trigger: SceneColumnTrigger,
  Panels: SceneColumnPanels,
  DefaultPanels: DefaultScenePanels,
  Controls: SceneOverlay,
  Probe: SelectedPointPanel,
  Layers: SceneLayers,
  Animations: AnimationPanel,
  Dock: SceneDock,
  ZSlider: ZSliderPanel,
  DimSliders: DimSliderPanel,
});

