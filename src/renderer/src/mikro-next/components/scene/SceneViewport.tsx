import {
  Canvas,
  events as createPointerEvents,
  useStore as useThreeStore,
} from "@react-three/fiber";
import { useEffect, type ReactNode } from "react";
import { LongCommitProfiler } from "./core/commitProfiler";
import { useViewStoreApi } from "./store/viewStore";
import { WebGPURenderer } from "three/webgpu";
import { CameraMatrixSync } from "./CameraMatrixSync";
import { PerfFrameProbe } from "./PerfFrameProbe";
import { ScaleBar } from "./ScaleBar";
import { ScaleGrid } from "./ScaleGrid";
import { SceneDock } from "./SceneDock";
import { SceneGuard, useSceneScopeStatus } from "./SceneProvider";
import { ThreeDScene } from "./ThreeDScene";
import { TwoDScene } from "./TwoDScene";
import { AnimationPlayer } from "./cameras/AnimationPlayer";
import { CameraController } from "./cameras/CameraController";
import { CanvasSync } from "./cameras/CanvasSync";
import { LinePickTuning } from "./primitives/LinePickTuning";
import { InitialCameraFit } from "./cameras/InitialCameraFit";
import { QualityAdapter } from "./cameras/QualityAdapter";
import { KeyboardLayerVisibility } from "./interactions/KeyboardLayerVisibility";
import { KeyboardModeController } from "./interactions/KeyboardModeController";
import { KeyboardSceneNavigation } from "./interactions/KeyboardSceneNavigation";
import { ModeCompatGuard } from "./interactions/ModeCompatGuard";
import { SceneAxis } from "./layers/SceneAxis";
import { AttributeProbeTracker } from "./managers/AttributeProbeTracker";
import { BrickSystemProvider } from "./managers/BrickSystemProvider";
import { VisibilityManager } from "./managers/VisibilityManager";
import { BrickResidencyOverlay } from "./overlays/BrickResidencyOverlay";
import { SceneModeControls } from "./overlays/SceneModeControls";
import { SceneShortcuts } from "./overlays/SceneShortcuts";
import { DrawSizeReadout } from "./overlays/DrawSizeReadout";
import { RoiToolbar } from "./overlays/RoiToolbar";
import { SceneScreenshot } from "./overlays/SceneScreenshot";
import { CanvasHueProbe } from "./theme/CanvasHueProbe";
import { DebugPanel } from "./panels/DebugPanel";
import { DimSliderPanel } from "./panels/DimSliderPanel";
import { SelectedPointPanel } from "./panels/SelectedPointPanel";
import { RoiDeleteKeybinding } from "./interactions/RoiDeleteKeybinding";
import { ZSliderPanel } from "./panels/ZSliderPanel";
import { WebGPUUnavailableError } from "./render/gpu/webgpuSupport";
import { useModeStore } from "./store/modeStore";
import { useViewerStore } from "./store/viewerStore";

/**
 * R3F's default event manager raycasts the ENTIRE interaction set for every
 * DOM event it handles — including plain `wheel`, which nothing in this scene
 * subscribes to (no R3F `onWheel` props in the scene tree). Trackpad zoom
 * fires 60–120 wheel events/s, and with annotations mounted each raycast
 * walks every Line2 outline segment-by-segment — pure per-tick main-thread
 * waste, concurrent with the zoom itself. Dropping the handler here removes
 * the DOM wheel listener entirely; OrbitControls zooms through its own
 * listener and is unaffected.
 */
/**
 * Per-canvas gate for suppressing pointermove raycasts while the CAMERA is
 * navigating: a pan/orbit drag produces 60–120 pointermoves/s, and each one
 * raycasts the entire interaction set — with annotations mounted that walks
 * every Line2 outline segment-by-segment, concurrently with the gesture. The
 * gate reads `viewStore.cameraMoving`, so it goes exactly as long as the
 * camera actually moves: drag-drawing tools (RoiDrawer/RectangleDrawer hold a
 * button while the camera is still) and hover probes (no buttons) are
 * untouched. Registered by `PointerMoveGate` below, keyed by the R3F root
 * store so multiple mounted canvases stay independent.
 */
const pointerMoveGates = new WeakMap<object, () => boolean>();

const sceneEvents: typeof createPointerEvents = (store) => {
  const manager = createPointerEvents(store);
  delete (manager.handlers as Partial<Record<"onWheel", unknown>> | undefined)?.onWheel;
  const handlers = manager.handlers as
    | Partial<Record<"onPointerMove", (event: PointerEvent) => void>>
    | undefined;
  const originalMove = handlers?.onPointerMove;
  if (handlers && originalMove) {
    handlers.onPointerMove = (event: PointerEvent) => {
      if (event.buttons !== 0 && (pointerMoveGates.get(store)?.() ?? false)) return;
      originalMove(event);
    };
  }
  return manager;
};

/** Registers this canvas's camera-motion gate (see pointerMoveGates). */
const PointerMoveGate = () => {
  const store = useThreeStore();
  const viewApi = useViewStoreApi();
  useEffect(() => {
    pointerMoveGates.set(store, () => viewApi.getState().cameraMoving);
    return () => void pointerMoveGates.delete(store);
  }, [store, viewApi]);
  return null;
};

const SceneWrapper = ({ children }: { children: ReactNode }) => {
  // `select-none` on the canvas surface stops a drag (pan / ROI draw / probe)
  // from ever turning into a text selection. Overlays keep normal selection.
  //
  // Renderer: three's WebGPURenderer (async init via R3F v9's gl factory).
  // WebGPU is required — SceneProvider gates on assertWebGPUSupported() before
  // this ever mounts. On macOS this is native Metal, which is what kills the
  // ANGLE texSubImage3D upload stalls (P19).
  return <Canvas
        className="select-none [-webkit-user-select:none]"
        frameloop="demand"
        events={sceneEvents}
        gl={async (props) => {
          const renderer = new WebGPURenderer({
            ...(props as Record<string, unknown>),
            // No MSAA: the dominant pixel cost is the full-screen volume
            // raymarch, which has zero geometric edges (the proxy box is
            // invisible and the shader Discards, defeating early-Z) — MSAA
            // there is pure color/depth bandwidth, plus 4× the realloc cost
            // on every DPR switch. Line furniture (Line2 fat lines, gizmo)
            // is screen-space quads, the least MSAA-sensitive geometry.
            antialias: false,
            // GPU frame timing for the perf monitor. Constructing with the
            // flag on is required so init() can validate feature support
            // (three self-clears it when the adapter lacks timestamp-query);
            // it is switched OFF again right after init — see below.
            trackTimestamp: true,
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

          // Timestamp writes land in a 2048-slot query pool that ONLY a
          // resolveTimestampsAsync call drains — and nobody resolves outside a
          // perf recording, so leaving the flag on floods the pool (three
          // warns "Maximum number of queries exceeded"). Park it off and
          // remember whether the device actually supports it; PerfFrameProbe
          // flips it on for a recording's lifetime and drains on stop. The
          // per-pass check in three reads the backend property live, so this
          // runtime toggle is safe.
          const tsBackend = (
            renderer as unknown as {
              backend?: { trackTimestamp?: boolean; __timestampQuerySupported?: boolean };
            }
          ).backend;
          if (tsBackend) {
            tsBackend.__timestampQuerySupported = tsBackend.trackTimestamp === true;
            tsBackend.trackTimestamp = false;
          }

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
          // assertWebGPUSupported() in SceneProvider.
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

/**
 * The panel stack a viewport gets when its host composes nothing: the two
 * scrubbers, docked at the edges the dimensions they scrub read along. Exported
 * as Scene.DefaultPanels so a host that only wants to *add* a panel can render
 * it alongside its own instead of restating it.
 *
 * There is no floating panel column any more. The view settings that used to
 * fill it are a gear in the bottom-right HUD (`SceneModeControls`), and the
 * layer list and animations live in the page's right-rail sidebar
 * (`sceneSidebarTabs.tsx`) — both outside the viewport. `Scene.Column` remains
 * for a host that has a panel of its own to float.
 */
export const DefaultScenePanels = () => (
  <>
    <SceneDock side="right">
      <ZSliderPanel />
    </SceneDock>
    <SceneDock side="bottom">
      <DimSliderPanel />
    </SceneDock>
  </>
);

/**
 * The rendered scene: the WebGPU canvas plus its overlay chrome, filling its
 * host. Must sit under a `SceneProvider`; until that scope is ready it renders
 * the matching message inside its own frame, so a missing GPU or a loading
 * scene never blanks the page around it.
 *
 * `children` compose the overlay panel stack (see `DefaultScenePanels` for the
 * default shape and `Scene.Column` for what positions it).
 */
export const SceneViewport = (props: { children?: ReactNode }) => {
  const status = useSceneScopeStatus();

  if (status.phase !== "ready") {
    // A missing GPU is an environment problem, not a scene problem — saying
    // "scene initialization failed" would send the reader hunting in the
    // wrong place.
    const message =
      status.phase === "no-scene"
        ? "No scene selected."
        : status.phase === "error"
          ? `${
              status.error instanceof WebGPUUnavailableError
                ? "This scene cannot be rendered"
                : "Scene initialization failed"
            }: ${status.error.message}`
          : "Initializing scene data...";
    return (
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-black">
        <div className="flex h-full w-full items-center justify-center px-8 text-center text-sm text-zinc-300">
          {message}
        </div>
      </div>
    );
  }

  return (
    <SceneGuard>
      <div
        className="relative h-full w-full overflow-hidden rounded-lg bg-black"
        style={backgroundStyle(status.scene.backgroundColor)}
      >
        <KeyboardModeController />
        <KeyboardLayerVisibility />
        <ModeCompatGuard />
        <SceneWrapper>
          <LongCommitProfiler id="scene-canvas">
          <ambientLight intensity={0.7} />
          <pointLight position={[100, 100, 100]} />

          {/* The Camera Matrix Sync ensures that we can access the view matrix outside in html world */}
          <CameraMatrixSync />
          <PointerMoveGate />
          <PerfFrameProbe />
          <CameraController />
          {/* Also after CameraController: needs the installed controls to pan
              and dolly against. Arrow keys, so it lives in the canvas rather
              than with the other keyboard components outside it. */}
          <KeyboardSceneNavigation />
          {/* Must follow CameraController: fits the as-loaded scene extent
              before the first painted frame (and on 2D/3D remounts). */}
          <InitialCameraFit />
          {/* Also after CameraController: drives the camera along a playing
              tour. Idle (and free) until something calls `play`. */}
          <AnimationPlayer />
          <QualityAdapter />
          <CanvasSync />
          {/* Annotation outlines are hairline-thin to pick without this. */}
          <LinePickTuning />
          <SceneScreenshot />
          {/* Feeds SceneBrandTheme the majority hue of the rendered pixels. */}
          <CanvasHueProbe />

          {/* Interaction Layers */}
          {/* The SceneAxis is a simple XYZ axis helper that also shows the scale of the scene */}
          <SceneAxis />
          <ScaleGrid />

          <SceneModeContent />

          <BrickSystemProvider />
          <WhenDebug>
            <BrickResidencyOverlay />
          </WhenDebug>

          {/* Local, not drei's GizmoHelper: that one calls gl.clearDepth()
              between the scene and hud renders, which under this renderer's
              tone-mapped output path costs a full-screen colour blit every
              frame. See SceneGizmo. */}

          </LongCommitProfiler>
        </SceneWrapper>

        {/* The panel stack is the host's to compose — see DefaultScenePanels
            for the shape, and Scene.Column for what positions it. Panels
            below this line are the renderer's own (they answer to the
            canvas, not to a layout choice) and are not composable. */}
        <LongCommitProfiler id="scene-chrome">
          {props.children ?? <DefaultScenePanels />}
        </LongCommitProfiler>

        <WhenDebug>
          <DebugPanel />
        </WhenDebug>
        {/* Selection details live in the Annotations sidebar tab; only the
            Backspace-delete keybinding stays viewport-owned (sidebar tabs
            unmount when inactive, a keybinding must not). */}
        <RoiDeleteKeybinding />
        <VisibilityManager />
        <AttributeProbeTracker />
        <ScaleBar />
        <DrawSizeReadout />
        {/* Both dock bottom-right: the probe readout sits directly above the
            mode controls that turn probing on. */}
        <SelectedPointPanel />
        <SceneModeControls />

        <RoiToolbar />
        {/* Last, and the only overlay that covers the canvas: on top of
            everything it documents. */}
        <SceneShortcuts />
      </div>
    </SceneGuard>
  );
};
