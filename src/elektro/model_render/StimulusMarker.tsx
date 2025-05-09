import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ListStimulusFragment } from "../api/graphql"; // adjust path as needed
import { getColorForStimulus } from "../components/SImulationRender";

export const StimulusMarker = ({ stimulus, position }: { stimulus: ListStimulusFragment; position: THREE.Vector3 }) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[0.6, 12, 12]} />
      <meshStandardMaterial color="green" emissive="green" emissiveIntensity={1} />
    </mesh>
    <Html center>
      <div
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          color: getColorForStimulus(stimulus),
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          whiteSpace: "nowrap",
        }}
      >
        {stimulus.label}
      </div>
    </Html>
  </group>
);