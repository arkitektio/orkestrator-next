import { Canvas } from "@react-three/fiber";
import { useEffect, useState, type ReactNode } from "react";
import { CameraMatrixSync } from "./CameraMatrixSync";
import { CameraController } from "./cameras/CameraController";
import { CanvasSync } from "./cameras/CanvasSync";
import { KeyboardModeController } from "./controllers/KeyboardModeController";
import { SceneAxis } from "./layers/SceneAxis";
import { SceneOverlay } from "./overlays/SceneOverlay";
import { LayerViewRangesOverlay } from "./overlays/LayerViewRangesOverlay";
import { ScaleBar } from "./ScaleBar";
import { ScaleGrid } from "./ScaleGrid";
import { PanelProvider } from "./PanelProvider";
import { ScenePanel } from "./panels/ScenePanel";
import { LayerControlPanel } from "./panels/LayerControlPanel";
import { DebugPanel } from "./panels/DebugPanel";
import { SelectedRoiPanel } from "./panels/SelectedRoiPanel";
import { ZSliderPanel } from "./panels/ZSliderPanel";
import { ScenePlane } from "./layers/two_d/ScenePlane";
import { createModeStore, ModeStoreContext } from "./store/modeStore";
import { createViewStore, ViewStoreContext } from "./store/viewStore";
import { SceneFragment } from "@/mikro-next/api/graphql";
import { createViewerStore, ViewerStoreContext } from "./store/viewerStore";
import { createSelectionStore, SelectionStoreContext } from "./store/layerStore";
import { SceneVolume } from "./layers/SceneVolume";
import { GizmoHelper, GizmoViewport} from '@react-three/drei'
import { createSceneStore, SceneStoreContext } from "./store/sceneStore";
import { VisibilityManager } from "./managers/VisibilityManager";
import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";
import { createRoiDrawingStore, RoiDrawingStoreContext } from "./store/roiDrawingStore";
import { createRoiSelectionStore, RoiSelectionStoreContext } from "./store/roiSelectionStore";
import { RectangleDrawer } from "./interactions/RectangleDrawer";
import { RoiDrawer } from "./interactions/RoiDrawer";
import { RoiToolbar } from "./overlays/RoiToolbar";
import { SceneDataRois } from "./layers/SceneDataRois";
import { CullingDebugRing } from "./layers/debug/CullingDebugRing";

export const SceneWrapper = ({ children }: { children: ReactNode }) => {
  return <Canvas
        frameloop="demand">{children}</Canvas>;
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
              <CameraController />
              <CanvasSync />

              {/* Interaction Layers */}
              {/* The SceneAxis is a simple XYZ axis helper that also shows the scale of the scene */}
              <SceneAxis/>
              <ScaleGrid />

              <CullingDebugRing />

              {/* Layers */}
              <ScenePlane />
              <SceneVolume />
              <SceneDataRois />
              <RectangleDrawer />
              <RoiDrawer />

              <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
                <GizmoViewport labelColor="white" axisHeadScale={1} axisColors={["rgba(78, 78, 78, 0.5)", "rgba(78, 78, 78, 0.5)", "rgba(78, 78, 78, 0.5)"]}/>
              </GizmoHelper>
            </SceneWrapper>

            <ScenePanel/>
            <LayerControlPanel />
            <DebugPanel />
            <SelectedRoiPanel />
            <ZSliderPanel />
            <VisibilityManager/>
            <ScaleBar />

            <SceneOverlay />
            <RoiToolbar />
            <LayerViewRangesOverlay />
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

