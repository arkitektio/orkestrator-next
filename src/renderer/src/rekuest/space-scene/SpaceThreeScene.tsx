import {
  Environment,
  Grid,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { SpacePlacementFragment } from "../api/graphql";
import { useSpaceScene } from "./context";
import { MoveablePlacement, PlacementFallback } from "./MoveablePlacement";





const PlacementObject = ({ placement }: { placement: SpacePlacementFragment }) => {
  const hasMedia = placement.model?.file
  if (!hasMedia) {
    return <PlacementFallback placement={placement} />;
  }
  return (
    <Suspense
      fallback={<PlacementFallback placement={placement} />}
    >
      <MoveablePlacement placement={placement} />
    </Suspense>
  );
};

const SceneContent = () => {
  const placements = useSpaceScene((s) => s.placements);
  const selectPlacement = useSpaceScene((s) => s.selectPlacement);

  return (
    <>
      <color attach="background" args={["#0a0a0f"]} />
      <fog attach="fog" args={["#0a0a0f", 12, 28]} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 10, 5]} intensity={1.8} color="#fff8e7" />
      <directionalLight
        position={[-5, 3, -4]}
        intensity={0.5}
        color="#93c5fd"
      />
      <spotLight
        position={[0, 12, 0]}
        intensity={12}
        angle={0.4}
        penumbra={0.8}
        color="#818cf8"
      />

      <Grid
        infiniteGrid
        fadeDistance={20}
        fadeStrength={3}
        cellSize={1}
        sectionSize={5}
        cellColor="#1e1e2e"
        sectionColor="#2e2e4e"
        cellThickness={0.5}
        sectionThickness={1}
        position={[0, -0.01, 0]}
      />

      {placements.map((p) => (
        <PlacementObject key={p.id} placement={p} />
      ))}

      {/* Click on empty space to deselect */}
      <mesh
        position={[0, -0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => selectPlacement(null)}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
      </mesh>

      <Environment preset="city" />
      <OrbitControls
        enablePan
        enableZoom
        makeDefault
        maxPolarAngle={Math.PI / 2.05}
        minDistance={2}
        maxDistance={20}
      />
    </>
  );
};

const SelectedInfo = () => {
  const selectedId = useSpaceScene((s) => s.selectedPlacementId);
  const placements = useSpaceScene((s) => s.placements);
  const selected = placements.find((p) => p.id === selectedId);

  if (!selected) return null;

  return (
    <div className="absolute bottom-4 left-4 z-20 rounded-lg border bg-background/80 px-4 py-3 text-sm backdrop-blur-sm">
      <div className="font-semibold">{selected.name}</div>
      <div className="text-muted-foreground">
        Agent: {selected.agent.id} &middot;
      </div>
    </div>
  );
};

export const SpaceThreeScene = () => {
  return (
    <div className="relative flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Space Scene
        </div>
        <div className="flex-1" />
      </div>

      {/* Canvas */}
      <div className="relative flex-1">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [4, 4, 8], fov: 45 }}
          frameloop="demand"

          className="!absolute inset-0"
        >
          <SceneContent />
        </Canvas>
        <SelectedInfo />
      </div>
    </div>
  );
};
