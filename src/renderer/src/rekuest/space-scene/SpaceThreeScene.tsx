import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Grid,
  OrbitControls,
} from "@react-three/drei";
import { useSpaceScene } from "./context";
import { MovableMembership, MembershipFallback } from "./MovableMembership";
import { MembershipEntry } from "./store";
import {
  AddMembershipDialog,
  CreateAgentSceneDialog,
} from "./AddMembershipPanel";

const MembershipObject = ({ membership }: { membership: MembershipEntry }) => {
  const hasMedia = membership.media?.key;
  if (!hasMedia) {
    return <MembershipFallback membership={membership} />;
  }
  return (
    <Suspense
      fallback={<MembershipFallback membership={membership} />}
    >
      <MovableMembership membership={membership} />
    </Suspense>
  );
};

const SceneContent = () => {
  const memberships = useSpaceScene((s) => s.memberships);
  const selectMembership = useSpaceScene((s) => s.selectMembership);

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

      {memberships.map((m) => (
        <MembershipObject key={m.id} membership={m} />
      ))}

      {/* Click on empty space to deselect */}
      <mesh
        position={[0, -0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => selectMembership(null)}
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
  const selectedId = useSpaceScene((s) => s.selectedMembershipId);
  const memberships = useSpaceScene((s) => s.memberships);
  const selected = memberships.find((m) => m.id === selectedId);

  if (!selected) return null;

  return (
    <div className="absolute bottom-4 left-4 z-20 rounded-lg border bg-background/80 px-4 py-3 text-sm backdrop-blur-sm">
      <div className="font-semibold">{selected.name}</div>
      <div className="text-muted-foreground">
        Agent: {selected.agentName} &middot; Scene: {selected.sceneName}
      </div>
      <div className="mt-1 font-mono text-xs text-muted-foreground">
        pos: [{selected.position.map((v) => v.toFixed(2)).join(", ")}]
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
        <CreateAgentSceneDialog />
        <AddMembershipDialog />
      </div>

      {/* Canvas */}
      <div className="relative flex-1">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [4, 4, 8], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          className="!absolute inset-0"
        >
          <SceneContent />
        </Canvas>
        <SelectedInfo />
      </div>
    </div>
  );
};
