import { SceneGuard, useSceneScopeStatus } from "../SceneProvider";
import { useSceneStore } from "../store/sceneStore";
import { AnimationPanel } from "./AnimationPanel";
import { LayerControlPanel } from "./LayerControlPanel";

/**
 * Scene panels as ModelPage sidebar tabs
 * (`additionalSidebars={<Sidebars.Tab label="Layers"><SceneLayersSidebar /></Sidebars.Tab>}`).
 * They require the page to be wrapped in a `SceneProvider` — the rail renders
 * OUTSIDE the content area, which is exactly why the provider is a separate
 * component from the viewport.
 */

/**
 * What a scene tab says while there is nothing to show: the sidebar exists for
 * the page's whole lifetime (it is a sibling of the content area), so it sees
 * every scope phase — a dataset with no scene, a scene still initializing, a
 * WebGPU failure.
 */
const SidebarFallback = () => {
  const status = useSceneScopeStatus();
  const message =
    status.phase === "no-scene"
      ? "No scene selected."
      : status.phase === "error"
        ? `Scene unavailable: ${status.error.message}`
        : "Loading scene…";
  return (
    <div className="p-4 text-center text-xs text-muted-foreground">{message}</div>
  );
};

const SceneLayersSidebarBody = () => {
  // Safe: only rendered under SceneGuard, so the store scope exists.
  const sceneId = useSceneStore((s) => s.id);
  return <LayerControlPanel sceneId={sceneId} variant="sidebar" />;
};

/** The layer list as a sidebar tab. */
export const SceneLayersSidebar = () => (
  <SceneGuard fallback={<SidebarFallback />}>
    <SceneLayersSidebarBody />
  </SceneGuard>
);

/** The camera-tour editor/player as a sidebar tab. */
export const SceneAnimationsSidebar = () => (
  <SceneGuard fallback={<SidebarFallback />}>
    <AnimationPanel variant="sidebar" />
  </SceneGuard>
);
