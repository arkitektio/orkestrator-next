import { useSettings } from "@/providers/settings/SettingsContext";
import { SpaceGroup } from "./types";
import { createSpaceViewStore, SpaceViewStoreContext } from "./store";
import { Suspense, useState } from "react";
import { CameraMatrixSync } from "./syncs/CameraMatrixSync";
import { Canvas } from "@react-three/fiber";
import { PlacementObject } from "./elements/PlacementObject";
import { StageFloor } from "./elements/StageFloor";
import { Environment, OrbitControls } from "@react-three/drei";
import { AgentPanel } from "./panels/AgentPanel";
import { DetailAssignationFragment } from "@/rekuest/api/graphql";
import { Slider } from "@/components/ui/slider";
import { TimeSlider } from "./panels/TimeSlider";
import { TaskTimeline } from "./panels/TaskTimeline";

export const SpaceScene = ({ group, task }: { group: SpaceGroup, task: DetailAssignationFragment }) => {
  const { settings } = useSettings();
  const brandHue = settings.brandHue ?? 267.256;
  const [store] = useState(() => createSpaceViewStore(task));

  return (
    <SpaceViewStoreContext.Provider value={store}>
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden rounded-2xl">
        <div className="flex-grow relative">
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [2, 2.8, 5], fov: 38 }}
            shadows
            className="!absolute inset-0"
          >
            <CameraMatrixSync />
            <color attach="background" args={["#08080c"]} />
            <fog attach="fog" args={["#08080c", 8, 20]} />
            <ambientLight intensity={0.3} />
            <spotLight
              position={[0, 8, 0]}
              intensity={40}
              angle={0.5}
              penumbra={1}
              color="#c4b5fd"
              castShadow
            />
            <spotLight
              position={[-4, 5, 3]}
              intensity={15}
              angle={0.4}
              penumbra={0.8}
              color="#818cf8"
            />
            <spotLight
              position={[4, 5, -2]}
              intensity={10}
              angle={0.4}
              penumbra={0.8}
              color="#38bdf8"
            />
            <spotLight
              position={[0, 6, 4]}
              intensity={25}
              angle={0.6}
              penumbra={0.9}
              color="#e0e0e0"
              castShadow
            />
            <directionalLight
              position={[5, 3, 5]}
              intensity={0.4}
              color="#fde68a"
            />
            <Suspense fallback={null}>
              {group.placements.map((p) => (
                <PlacementObject key={p.id} placement={p} />
              ))}
              <StageFloor brandHue={brandHue} />
              <Environment preset="night" />
            </Suspense>
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={2}
              maxDistance={14}
              maxPolarAngle={Math.PI / 2.05}
              minPolarAngle={Math.PI / 6}
            />
          </Canvas>
          <AgentPanel placements={group.placements} />
          <TimeSlider></TimeSlider>

        </div>
         <TaskTimeline task={task} />
      </div>

    </SpaceViewStoreContext.Provider>
  );
}
