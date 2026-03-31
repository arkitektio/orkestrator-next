import { Canvas } from "@react-three/fiber";
import { useMemo, type ReactNode } from "react";
import { CameraMatrixSync } from "./CameraMatrixSync";
import { CameraController } from "./cameras/CameraController";
import { KeyboardModeController } from "./controllers/KeyboardModeController";
import { SceneAxis } from "./layers/SceneAxis";
import { SceneOverlay } from "./overlays/SceneOverlay";
import { PanelProvider } from "./PanelProvider";
import { ScenePanel } from "./panels/ScenePanel";
import { ScenePlane } from "./layers/ScenePlane";
import { createModeStore, ModeStoreContext } from "./store/modeStore";
import { createViewStore, ViewStoreContext } from "./store/viewStore";
import { SceneFragment } from "@/mikro-next/api/graphql";
import { createViewerStore, ViewerStoreContext } from "./store/viewerStore";
import { createSelectionStore, SelectionStoreContext } from "./store/layerStore";
import { SceneVolume } from "./layers/SceneVolume";
import { GizmoHelper, GizmoViewport} from '@react-three/drei'
import { createSceneStore, SceneStoreContext } from "./store/sceneStore";

export const SceneWrapper = ({ children }: { children: ReactNode }) => {
  return <Canvas>{children}</Canvas>;
};







export const Scene = (props: { scene: SceneFragment }) => {


  const scope = useMemo(() => {
        const localScope = {
      modeStore: createModeStore(),
      viewStore: createViewStore(),
      viewerStore: createViewerStore(),
      selectionStore: createSelectionStore(),
      sceneStore: createSceneStore({ scene: props.scene }),
    };
    return localScope;

  }, [props.scene]);




  return (
    <ModeStoreContext.Provider value={scope.modeStore}>
      <ViewStoreContext.Provider value={scope.viewStore}>
        <ViewerStoreContext.Provider value={scope.viewerStore}>
          <SelectionStoreContext.Provider value={scope.selectionStore}>
            <SceneStoreContext.Provider value={scope.sceneStore}>



        <div className="relative h-full w-full overflow-hidden rounded-lg bg-black">
          <PanelProvider>
            <KeyboardModeController />
            <SceneWrapper>
              <ambientLight intensity={0.7} />
              <pointLight position={[100, 100, 100]} />

              {/* The Camera Matrix Sync ensures that we can access the view matrix outside in html world */}
              <CameraMatrixSync />
              <CameraController />


              {/* Interaction Layers */}
              {/* The SceneAxis is a simple XYZ axis helper that also shows the scale of the scene */}
              <SceneAxis/>







              {/* Layers */}

              <ScenePlane />
              <SceneVolume />

            <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper>
            </SceneWrapper>


            <ScenePanel scene={props.scene} />


            <SceneOverlay />
          </PanelProvider>
        </div>
                </SceneStoreContext.Provider>
        </SelectionStoreContext.Provider>
          </ViewerStoreContext.Provider>
        </ViewStoreContext.Provider>
    </ModeStoreContext.Provider>
  );
};
