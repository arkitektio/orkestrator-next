import { Html } from "@react-three/drei";
import { Recording } from "../api/graphql"; // adjust path as needed
import * as THREE from "three";
import { getColorForRecording } from "../components/SImulationRender";

export const RecordingMarker = ({ recording, position }: { recording: Recording; position: THREE.Vector3 }) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[0.6, 12, 12]} />
      <meshStandardMaterial color="green" emissive="green" emissiveIntensity={1} />
    </mesh>
    <Html center>
      <div
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          color: getColorForRecording(recording),
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          whiteSpace: "nowrap",
        }}
      >
        {recording.label}
      </div>
    </Html>
  </group>
);