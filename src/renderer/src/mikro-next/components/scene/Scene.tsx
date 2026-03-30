import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";
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

export const SceneWrapper = ({ children }: { children: ReactNode }) => {
  return <Canvas>{children}</Canvas>;
};




const localScope = {
  modeStore: createModeStore(),
  viewStore: createViewStore(),
  viewerStore: createViewerStore(),
  selectionStore: createSelectionStore(),
};


export const Scene = (props: { scene: SceneFragment }) => {

  return (
    <ModeStoreContext.Provider value={localScope.modeStore}>
      <ViewStoreContext.Provider value={localScope.viewStore}>
        <ViewerStoreContext.Provider value={localScope.viewerStore}>
          <SelectionStoreContext.Provider value={localScope.selectionStore}>



        <div className="relative h-full w-full overflow-hidden rounded-lg bg-black">
          <PanelProvider>
            <KeyboardModeController />
            <SceneWrapper>
              <color attach="background" args={["#020617"]} />
              <ambientLight intensity={0.7} />
              <pointLight position={[100, 100, 100]} />

              {/* The Camera Matrix Sync ensures that we can access the view matrix outside in html world */}
              <CameraMatrixSync />
              <CameraController />


              {/* Interaction Layers */}
              {/* The SceneAxis is a simple XYZ axis helper that also shows the scale of the scene */}
              <SceneAxis/>







              {/* Layers */}

              <ScenePlane scene={props.scene} />

            </SceneWrapper>


            <ScenePanel scene={props.scene} />

            <SceneOverlay />
          </PanelProvider>
        </div>
        </SelectionStoreContext.Provider>
          </ViewerStoreContext.Provider>
        </ViewStoreContext.Provider>
    </ModeStoreContext.Provider>
  );
};
