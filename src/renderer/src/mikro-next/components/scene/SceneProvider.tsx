import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";
import { SceneFragment } from "@/mikro-next/api/graphql";
import { AttributeServiceProvider } from "@/mikro-next/lib/attributes/AttributeServiceProvider";
import {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { resolveSceneCameraFrame } from "./core/cameraState";
import { resolvePreferredDisplayMode } from "./core/preferredView";
import { sceneStructureSignature } from "./core/sceneStructure";
import { assertWebGPUSupported } from "./render/gpu/webgpuSupport";
import {
  AnimationStoreContext,
  createAnimationStore,
} from "./store/animationStore";
import { ModeStoreContext, createModeStore } from "./store/modeStore";
import {
  RoiDrawSessionStoreContext,
  createRoiDrawSessionStore,
} from "./store/roiDrawSessionStore";
import {
  RoiDrawingStoreContext,
  createRoiDrawingStore,
} from "./store/roiDrawingStore";
import {
  RoiSelectionStoreContext,
  createRoiSelectionStore,
} from "./store/roiSelectionStore";
import { SceneStoreContext, createSceneStore } from "./store/sceneStore";
import {
  SelectionStoreContext,
  createSelectionStore,
} from "./store/selectionStore";
import { ViewStoreContext, createViewStore } from "./store/viewStore";
import { ViewerStoreContext, createViewerStore } from "./store/viewerStore";

/**
 * The scene's store scope: one vanilla zustand store per concern, all created
 * together for one scene and provided together. Everything under a
 * `SceneProvider` reaches them through the scoped store hooks.
 */
export type SceneScope = {
  modeStore: ReturnType<typeof createModeStore>;
  viewStore: ReturnType<typeof createViewStore>;
  viewerStore: Awaited<ReturnType<typeof createViewerStore>>;
  selectionStore: ReturnType<typeof createSelectionStore>;
  sceneStore: ReturnType<typeof createSceneStore>;
  animationStore: ReturnType<typeof createAnimationStore>;
  roiDrawingStore: ReturnType<typeof createRoiDrawingStore>;
  roiDrawSessionStore: ReturnType<typeof createRoiDrawSessionStore>;
  roiSelectionStore: ReturnType<typeof createRoiSelectionStore>;
};

/**
 * Where the scope build stands, carrying the scene fragment so consumers (the
 * viewport's fallback, the sidebar tab) need no separate scene prop.
 */
export type SceneScopeStatus =
  | { phase: "no-scene"; scene: null; error: null }
  | { phase: "initializing"; scene: SceneFragment; error: null }
  | { phase: "error"; scene: SceneFragment; error: Error }
  | { phase: "ready"; scene: SceneFragment; error: null };

const SceneScopeStatusContext = createContext<SceneScopeStatus | null>(null);
SceneScopeStatusContext.displayName = "SceneScopeStatusContext";


export const useSceneScopeStatus = (): SceneScopeStatus => {
  const status = useContext(SceneScopeStatusContext);
  if (!status) {
    throw new Error("Missing SceneProvider");
  }
  return status;
};

/**
 * Renders children only when the scene scope is ready — the ONLY sanctioned way
 * to gate store consumers. The scoped store hooks keep throwing on a missing
 * provider (softening them would hide real composition bugs), so anything that
 * reads a scene store and can render while the scope is absent must sit under a
 * guard: the viewport does this for the canvas tree, and sidebar tabs do it for
 * themselves.
 *
 * Children are keyed on the scene id so a scene switch can never feed new
 * stores into components primed for the old scene — they remount instead
 * (the "remount, don't repopulate" invariant).
 */
export const SceneGuard = (props: {
  fallback?: ReactNode;
  children: ReactNode;
}) => {
  const status = useSceneScopeStatus();
  if (status.phase !== "ready") return <>{props.fallback ?? null}</>;
  return <Fragment key={status.scene.id}>{props.children}</Fragment>;
};

/**
 * Builds the scene's store scope and provides it WITHOUT owning any layout —
 * so a page can wrap its whole ModelPage in it and compose scene panels into
 * places the old all-in-one Scene component could never reach (the page's
 * right-rail sidebar is a sibling panel of the content area).
 *
 * The store contexts are ALWAYS mounted, with null values until the scope is
 * ready: if the provider chain only appeared on readiness, the null→ready
 * transition would change every descendant's parent chain and remount the
 * entire page around it. Consumers are gated by `SceneGuard`, not by the
 * providers' presence.
 *
 * `scene` may be null ("no scene selected" — e.g. a dataset without scenes);
 * the scope build is skipped and the status says so.
 *
 * Rebuild contract: the scope is rebuilt only when `sceneStructureSignature`
 * changes (scene switch, layer add/remove/reorder, world change, registration
 * refinement). Content mutations fold their results into the stores at their
 * call sites and MUST keep doing so — the provider deliberately ignores the
 * fragment-identity churn they cause.
 */
export const SceneProvider = (props: {
  scene: SceneFragment | null | undefined;
  children: ReactNode;
}) => {
  const client = useMikro();
  const datalayer = useDatalayerEndpoint();
  const scene = props.scene ?? null;

  // The rebuild key. Content-only cache re-emissions (a saved render graph, a
  // pinned view, a new animation) change the fragment's identity but not this
  // string, so they no longer tear the scope down — see
  // `sceneStructureSignature`.
  const signature = useMemo(
    () => (scene ? sceneStructureSignature(scene) : null),
    [scene],
  );

  // The effect keys on the signature, not the fragment, so it must read the
  // CURRENT fragment through a ref — the build uses whatever data is live
  // when the structure changes.
  const sceneRef = useRef(scene);
  sceneRef.current = scene;

  // Both results remember WHICH structure they were built for: between a
  // structural change and the rebuild effect firing there is one commit where
  // the old scope still exists — matching signatures keeps the status honest
  // ("initializing", never "ready with the wrong stores") through that window.
  const [built, setBuilt] = useState<{
    signature: string;
    scope: SceneScope;
  } | null>(null);
  const [failure, setFailure] = useState<{
    signature: string;
    error: Error;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initializeSceneScope = async () => {
      setBuilt(null);
      setFailure(null);
      const scene = sceneRef.current;
      if (!scene || !signature) return;

      try {
        // Gate before anything expensive: a scene without WebGPU cannot render
        // at all, so fail here rather than mount a Canvas that would silently
        // downgrade itself to a backend we no longer support.
        await assertWebGPUSupported();

        if (!datalayer) {
          throw new Error("No datalayer endpoint configured");
        }

        const sceneStore = createSceneStore({ scene });
        // Both the opening view and the pose frame are facts about the scene AS
        // LOADED, so they are resolved from the normalized layers the scene
        // store just built rather than re-derived per consumer.
        const layers = sceneStore.getState().layers;

        const scope: SceneScope = {
          modeStore: createModeStore({
            displayMode: resolvePreferredDisplayMode(scene.preferredView, layers),
          }),
          viewStore: createViewStore(),
          viewerStore: await createViewerStore(scene, client, datalayer),
          selectionStore: createSelectionStore(),
          sceneStore,
          animationStore: createAnimationStore({
            scene,
            frame: resolveSceneCameraFrame(scene.worldCoordinateSystem, layers),
          }),
          roiDrawingStore: createRoiDrawingStore(),
          roiDrawSessionStore: createRoiDrawSessionStore(),
          roiSelectionStore: createRoiSelectionStore(),
        };

        if (!cancelled) {
          setBuilt({ signature, scope });
        }
      } catch (error) {
        if (!cancelled) {
          setFailure({
            signature,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      }
    };

    initializeSceneScope();

    return () => {
      cancelled = true;
    };
  }, [signature, client, datalayer]);

  // `status.scene` is always the LIVE fragment: content the viewport reads
  // reactively (backgroundColor, …) keeps updating without a rebuild.
  const status: SceneScopeStatus = !scene
    ? { phase: "no-scene", scene: null, error: null }
    : failure && failure.signature === signature
      ? { phase: "error", scene, error: failure.error }
      : built && built.signature === signature
        ? { phase: "ready", scene, error: null }
        : { phase: "initializing", scene, error: null };

  const scope = status.phase === "ready" ? built!.scope : null;

  return (
    <SceneScopeStatusContext.Provider value={status}>
      <ModeStoreContext.Provider value={scope?.modeStore ?? null}>
        <ViewStoreContext.Provider value={scope?.viewStore ?? null}>
          <ViewerStoreContext.Provider value={scope?.viewerStore ?? null}>
            <SelectionStoreContext.Provider value={scope?.selectionStore ?? null}>
              <SceneStoreContext.Provider value={scope?.sceneStore ?? null}>
                <AnimationStoreContext.Provider value={scope?.animationStore ?? null}>
                  <RoiDrawingStoreContext.Provider value={scope?.roiDrawingStore ?? null}>
                    <RoiDrawSessionStoreContext.Provider value={scope?.roiDrawSessionStore ?? null}>
                      <RoiSelectionStoreContext.Provider value={scope?.roiSelectionStore ?? null}>
                        {/* Shared (client, datalayer) attribute service: the
                            probe tracker holds the same refcounted instance, so
                            ROI lookups reuse its plan cache and DuckDB engine.
                            Needs no scene stores, so it mounts unconditionally. */}
                        <AttributeServiceProvider>
                          {props.children}
                        </AttributeServiceProvider>
                      </RoiSelectionStoreContext.Provider>
                    </RoiDrawSessionStoreContext.Provider>
                  </RoiDrawingStoreContext.Provider>
                </AnimationStoreContext.Provider>
              </SceneStoreContext.Provider>
            </SelectionStoreContext.Provider>
          </ViewerStoreContext.Provider>
        </ViewStoreContext.Provider>
      </ModeStoreContext.Provider>
    </SceneScopeStatusContext.Provider>
  );
};
