import { Badge } from "@/components/ui/badge";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Html, OrbitControls, Stage, useGLTF } from "@react-three/drei";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { Suspense, useMemo, useRef } from "react";
import type { Group } from "three";
import { Box3, Vector2, Vector3 } from "three";

const AGENT_SCENE_URL = "https://files.catbox.moe/sgdtnt.gltf";

const AgentModel = () => {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(AGENT_SCENE_URL);
  const { normalizedScene, offsetY } = useMemo(() => {
    const clone = scene.clone(true);
    const box = new Box3().setFromObject(clone);
    const size = new Vector3();
    const center = new Vector3();

    box.getSize(size);
    box.getCenter(center);

    const largestDimension = Math.max(size.x, size.y, size.z) || 1;
    const scale = 3.4 / largestDimension;

    clone.scale.setScalar(scale);
    clone.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

    return {
      normalizedScene: clone,
      offsetY: (-size.y * scale) / 2,
    };
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y += delta * 0.45;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.45}>
      <group ref={groupRef} position={[1.95, offsetY - 0.1, 0]}>
        <primitive object={normalizedScene} />
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
    <div className="absolute right-0 w-[400px] h-full rounded-lg overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full bg-[linear-gradient(90deg,rgba(248,250,252,0.94)_0%,rgba(248,250,252,0.82)_22%,rgba(248,250,252,0.46)_42%,rgba(248,250,252,0.12)_58%,rgba(248,250,252,0.03)_70%,transparent_82%)] dark:bg-[linear-gradient(90deg,rgba(2,6,23,0.90)_0%,rgba(2,6,23,0.78)_22%,rgba(15,23,42,0.42)_42%,rgba(15,23,42,0.14)_58%,rgba(15,23,42,0.03)_70%,transparent_82%)]" />


      <div className="absolute inset-0 "/>
      <Canvas
        dpr={[1, 2]}
        camera={{  fov: 27 }}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <fog attach="fog" args={["#020617", 8, 16]} />

        <Suspense fallback={<AgentSceneFallback />}>
          <Environment preset="city" />
          <Stage intensity={0.9} environment={null} shadows="contact" adjustCamera={false} preset="portrait">
            <AgentModel />
          </Stage>
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          target={[1.8, 0.2, 0]}
        />

        <EffectComposer>
          <Bloom luminanceThreshold={0.18} luminanceSmoothing={0.8} intensity={0.85} />
          <ChromaticAberration offset={new Vector2(0.0014, 0.001)} />
          <Noise opacity={0.045} />
          <Vignette eskil={false} offset={0.18} darkness={0.95} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

useGLTF.preload(AGENT_SCENE_URL);
