import { Badge } from "@/components/ui/badge";
import { Canvas, type ThreeElements, useFrame } from "@react-three/fiber";
import { Center, Environment, Float, Html, OrbitControls, Stage, useGLTF } from "@react-three/drei";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
} from "@react-three/postprocessing";
import { Suspense, useMemo, useRef } from "react";
import type { Group } from "three";
import { Box3, Vector2, Vector3 } from "three";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

const AGENT_SCENE_URL = "https://files.catbox.moe/sgdtnt.gltf";

const AgentModel = () => {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(AGENT_SCENE_URL);

  return (
    <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.45}>
      <group ref={groupRef}>
        <Center>
          <primitive object={scene} />
        </Center>
      </group>
    </Float>
  );
};

const AgentSceneFallback = () => {
  return (
    <Html center>
      <div className="rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
        Loading scene...
      </div>
    </Html>
  );
};

export const AgentHeroScene = (props: { clientId: string }) => {
  return (
    <div className="absolute inset-y-0 right-0 w-[40%] overflow-hidden rounded-lg bg-black">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.78)_18%,rgba(0,0,0,0.38)_38%,rgba(0,0,0,0.10)_56%,transparent_76%)]" />

      <div className="pointer-events-none absolute right-4 top-4 z-20">
        <Badge variant="secondary" className="border border-white/20 bg-background/50 backdrop-blur-md dark:border-white/10 dark:bg-background/30">
          {props.clientId}
        </Badge>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.16),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_46%,rgba(0,0,0,0.22)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(0,0,0,0.08)_56%,rgba(0,0,0,0.22)_76%,rgba(0,0,0,0.46)_100%)]" />

      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.15, 6.6], fov: 28 }}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#434343", 7.5, 13]} />

        <Suspense fallback={<AgentSceneFallback />}>
          <Environment preset="studio" />
          <Stage intensity={1} environment={null} shadows="contact" adjustCamera={false} preset="portrait">
            <AgentModel />
          </Stage>
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          target={[0, 0.1, 0]}
        />

        <EffectComposer>
          <Bloom luminanceThreshold={0.18} luminanceSmoothing={0.8} intensity={0.85} />
          <ChromaticAberration
            offset={new Vector2(0.0014, 0.001)}
            radialModulation={false}
            modulationOffset={0}
          />
          <Noise opacity={0.045} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

useGLTF.preload(AGENT_SCENE_URL);
