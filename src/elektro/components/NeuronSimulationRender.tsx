import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Bounds, useCursor } from "@react-three/drei";
import * as THREE from "three";
import { CompartmentFragment, CoordFragment, DetailNeuronModelFragment, DetailSimulationFragment, SectionFragment } from "../api/graphql";
import { interpolateCoords } from "../model_render/utils";
import { RecordingMarker } from "../model_render/RecordingMarker";
import { StimulusMarker } from "../model_render/StimulusMarker";

const getColorFromIndex = (index: number) => {
  const hue = (index * 137.508) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

type CompartmentMap = Record<string, CompartmentFragment>;

const CylinderWithTooltip = ({
  section,
  start,
  end,
  color,
  compartmentMap,
  selectedId,
  setSelectedId,
}: {
  section: SectionFragment;
  start: CoordFragment;
  end: CoordFragment;
  color: string;
  compartmentMap: CompartmentMap;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const isSelected = selectedId === section.id;

  const startVec = new THREE.Vector3(start.x, start.y, start.z);
  const endVec = new THREE.Vector3(end.x, end.y, end.z);
  const dir = new THREE.Vector3().subVectors(endVec, startVec);
  const length = dir.length();
  const position = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  const orientation = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );

  const params = compartmentMap[section.category];

  useCursor(hovered);

  return (
    <group position={position.toArray()} quaternion={orientation}>
      {/* Interaction hitbox */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(section.id);
        }}
      >
        <cylinderGeometry args={[section.diam * 2, section.diam * 2, length * 2, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Visible geometry */}
      <mesh>
        <cylinderGeometry args={[section.diam / 2, section.diam / 2, length, 8]} />
        <meshStandardMaterial color={hovered  ? "hotpink" : color} />
      </mesh>

      {(isSelected) && (
        <Html center>
          <div
            style={{
              background: "rgba(0,0,0,0.8)",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              minWidth: "200px",
              maxHeight: "250px",
              overflowY: "auto",
            }}
          >
            <strong>Section: {section.id}</strong>
            <div>Category: <code>{section.category}</code></div>
            {params ? (
              <>
                <div style={{ marginTop: 4 }}>
                  <strong>Global Params:</strong>
                  <ul style={{ paddingLeft: 16 }}>
                    {params.globalParams.map(({ param, value }) => (
                      <li key={param}>{param}: {value}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ marginTop: 4 }}>
                  <strong>Section Params:</strong>
                  <ul style={{ paddingLeft: 16 }}>
                    {params.sectionParams.map(({ param, value }) => (
                      <li key={param}>{param}: {value}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div style={{ color: "#ccc" }}>No matching compartment data</div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};



export const NeuronSimulationVisualizer = ({ simulation }: { simulation: DetailSimulationFragment }) => {
  const cells = simulation.model.config.cells
  const compartmentMap = Object.fromEntries(
    simulation.model.config.cells.flatMap((cell) =>
      cell.biophysics.compartments.map((c) => [c.id, c])
    )
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <Canvas
      camera={{ position: [0, 0, 200], fov: 50 }}
      onPointerMissed={() => setSelectedId(null)}
    >
      <ambientLight />
      <directionalLight position={[20, 10, 10]} />
      <OrbitControls makeDefault />

      <Bounds fit clip observe margin={1.2}>
        {cells.map( cell => 
        <>
        {cell.topology.sections.flatMap((section, secIndex) => {
          const color = getColorFromIndex(secIndex);

          if (section.coords && section.coords.length > 1) {
            return section.coords.slice(1).map((end, i) => (
              <CylinderWithTooltip
                key={`${section.id}-${i}`}
                section={section}
                start={section.coords[i]}
                end={end}
                color={color}
                compartmentMap={compartmentMap}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            ));
          } else {
            const zStart = -(section.length || 10) / 2;
            const zEnd = (section.length || 10) / 2;
            const start: CoordFragment = { x: 0, y: 0, z: zStart };
            const end: CoordFragment = { x: 0, y: 0, z: zEnd };

            return (
              <CylinderWithTooltip
                key={`${section.id}-fallback`}
                section={section}
                start={start}
                end={end}
                color={color}
                compartmentMap={compartmentMap}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            );
          }
        }
        )}
        </>)}
        {simulation.recordings.map((rec, i) => {
            const cell = simulation.model.config.cells.find(c => c.id === rec.cell);
            const section = cell?.topology.sections.find(s => s.id === rec.location);

            if (!section || !section.coords || typeof rec.position !== "number") throw new Error(`Invalid recording data ${JSON.stringify(rec)}`);

            const point = interpolateCoords(section.coords, rec.position);

            return (
              <RecordingMarker key={`rec-marker-${i}`} recording={rec} position={point} />
            );
        })}
        {simulation.stimuli.map((stim, i) => {
            const cell = simulation.model.config.cells.find(c => c.id === stim.cell);
            const section = cell?.topology.sections.find(s => s.id === stim.location);

            if (!section || !section.coords || typeof stim.position !== "number") throw new Error(`Invalid stimulus data ${JSON.stringify(stim)}`);

            const point = interpolateCoords(section.coords, stim.position);

            return (
              <StimulusMarker key={`rec-marker-${i}`} stimulus={stim} position={point} />
            );
        })}

      </Bounds>
    </Canvas>
  );
};
