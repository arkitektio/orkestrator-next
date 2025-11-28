import { Html, OrbitControls, useCursor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { EffectComposer, Vignette } from '@react-three/postprocessing';
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { CompartmentFragment, DetailNeuronModelFragment, SectionFragment } from "../api/graphql";
import { AutoZoomCamera } from "@/mikro-next/components/render/cameras/AutoZoomCamera";

// --- Types & Helpers ---
type CompartmentMap = Record<string, CompartmentFragment>;

interface ProcessedSegment {
  id: string;
  uniqueKey: string;
  section: SectionFragment;
  start: THREE.Vector3;
  end: THREE.Vector3;
  direction: THREE.Vector3;
  color: string;
}

const getColorFromIndex = (index: number) => {
  const hue = (index * 137.508) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

const getParentInfo = (section: SectionFragment) => {
  if (!section.connections || section.connections.length === 0) return null;
  const conn = section.connections[0];
  return { id: conn.parent, location: conn.location ?? 1 };
};

const getPerpendicularVector = (vec: THREE.Vector3) => {
  const v = vec.clone().normalize();
  const helper = Math.abs(v.dot(new THREE.Vector3(0, 1, 0))) > 0.9
    ? new THREE.Vector3(1, 0, 0)
    : new THREE.Vector3(0, 1, 0);
  return new THREE.Vector3().crossVectors(v, helper).normalize();
};

// --- CORE LOGIC: Equidistant Spacing ---

const calculateBranchDirection = (
  parentDir: THREE.Vector3,
  location: number,
  siblingIndex: number,
  siblingCount: number,
  groupSeed: number
) => {
  const isStartTip = location < 0.05;
  const isEndTip = location > 0.95;
  const isTip = isStartTip || isEndTip;

  let poleVector: THREE.Vector3;

  if (isEndTip) {
    poleVector = parentDir.clone().normalize();
  } else if (isStartTip) {
    poleVector = parentDir.clone().normalize().negate();
  } else {
    const baseOrtho = getPerpendicularVector(parentDir);
    poleVector = baseOrtho;
  }

  const finalDir = poleVector.clone();

  if (isTip) {
    if (siblingCount <= 1) return finalDir;

    const hinge = getPerpendicularVector(poleVector);
    const azimuthalAngle = (siblingIndex * (Math.PI * 2)) / siblingCount;
    const groupPhase = (groupSeed % 100) * 0.01 * Math.PI * 2;

    hinge.applyAxisAngle(poleVector, azimuthalAngle + groupPhase);

    const spreadAngle = Math.PI / 4;
    finalDir.applyAxisAngle(hinge, spreadAngle);

    return finalDir;

  } else {
    if (siblingCount > 1) {
      const angleStep = (Math.PI * 2) / siblingCount;
      const groupPhase = (groupSeed % 100) * 0.01 * Math.PI * 2;
      finalDir.applyAxisAngle(parentDir.clone().normalize(), (siblingIndex * angleStep) + groupPhase);
    } else {
      const groupPhase = (groupSeed % 100) * 0.01 * Math.PI * 2;
      finalDir.applyAxisAngle(parentDir.clone().normalize(), groupPhase);
    }
    return finalDir;
  }
};

// --- Layout Hook ---

const useNeuronLayout = (model: DetailNeuronModelFragment) => {
  return useMemo(() => {
    const rawSections = model.config.cells.flatMap((cell) => cell.topology.sections);

    const sectionMap = new Map<string, SectionFragment>();
    const childrenMap = new Map<string, SectionFragment[]>();

    rawSections.forEach(sec => {
      sectionMap.set(sec.id, sec);
      const parentInfo = getParentInfo(sec);
      if (parentInfo) {
        if (!childrenMap.has(parentInfo.id)) childrenMap.set(parentInfo.id, []);
        childrenMap.get(parentInfo.id)?.push(sec);
      }
    });

    const segments: ProcessedSegment[] = [];
    const geometryMap = new Map<string, { start: THREE.Vector3, end: THREE.Vector3, direction: THREE.Vector3 }>();

    const processSection = (
      sectionId: string,
      parentGeom: { start: THREE.Vector3, end: THREE.Vector3, direction: THREE.Vector3 } | null,
      depth: number
    ) => {
      const section = sectionMap.get(sectionId);
      if (!section) return;

      const allChildren = childrenMap.get(sectionId) || [];
      const parentInfo = getParentInfo(section);

      let start: THREE.Vector3;
      let direction: THREE.Vector3;

      if (parentGeom && parentInfo) {
        const loc = parentInfo.location;

        start = new THREE.Vector3().lerpVectors(parentGeom.start, parentGeom.end, loc);

        const coLocatedSiblings = (childrenMap.get(parentInfo.id) || []).filter(s => {
          const p = getParentInfo(s);
          return p && Math.abs(p.location - loc) < 0.001;
        });

        coLocatedSiblings.sort((a, b) => a.id.localeCompare(b.id));

        const myIndex = coLocatedSiblings.findIndex(s => s.id === section.id);
        const siblingCount = coLocatedSiblings.length;

        const parentKey = `${parentInfo.id}-${loc.toFixed(2)}`;
        const groupSeed = parentKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

        direction = calculateBranchDirection(
          parentGeom.direction,
          loc,
          myIndex,
          siblingCount,
          groupSeed
        );

      } else {
        start = new THREE.Vector3(0, 0, 0);
        direction = new THREE.Vector3(0, 1, 0);
      }

      const length = section.length || 10;
      const end = start.clone().add(direction.clone().normalize().multiplyScalar(length));

      segments.push({
        id: section.id,
        uniqueKey: section.id,
        section,
        start,
        end,
        direction,
        color: getColorFromIndex(depth)
      });

      geometryMap.set(section.id, { start, end, direction });

      allChildren.forEach(child => {
        processSection(child.id, { start, end, direction }, depth + 1);
      });
    };

    const roots = rawSections.filter(s => !s.connections || s.connections.length === 0);
    const entryPoints = roots.length > 0 ? roots : [rawSections[0]];

    entryPoints.forEach(root => processSection(root.id, null, 0));

    return segments;
  }, [model]);
};

// --- Camera Controller ---

/**
 * Calculates the bounding box of the neuron and moves the camera
 * to fit it, while setting the OrbitControls target to the exact center.
 */
const AutoCenter = ({ bounds, center }: { bounds: THREE.Box3, center: THREE.Vector3 }) => {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (bounds.isEmpty()) return;

    // 1. Calculate distance needed to fit the box
    const size = new THREE.Vector3();
    bounds.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    // Simple heuristic for distance: Fit largest dimension within 45deg FOV
    // Distance = (Size / 2) / tan(FOV/2)
    const fov = 45 * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 1.5; // Add margin (zoom out a bit)

    // 2. Set Controls Target to the Geometric Center
    // This is the crucial part: Rotation happens around THIS point
    if (controls) {
      // @ts-ignore
      controls.target.copy(center);
      // @ts-ignore
      controls.update();
    }

    // 3. Move Camera back along Z axis relative to center
    camera.position.set(center.x, center.y, center.z + cameraZ);
    camera.lookAt(center);
    camera.updateProjectionMatrix();

  }, [bounds, center, camera, controls]);

  return null;
};

// --- Visual Components ---

const CylinderWithTooltip = ({
  section, start, end, color, compartmentMap, selectedId, setSelectedId
}: any) => {
  const [hovered, setHovered] = useState(false);
  const isSelected = selectedId === section.id;
  const dir = new THREE.Vector3().subVectors(end, start);
  const length = dir.length();

  if (length < 0.001) return null;

  const position = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const orientation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  useCursor(hovered);

  return (
    <group position={position.toArray()} quaternion={orientation}>
      <mesh onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)} onClick={(e) => { e.stopPropagation(); setSelectedId(section.id); }}>
        <cylinderGeometry args={[Math.max(section.diam, 2), Math.max(section.diam, 2), length, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[section.diam / 2, section.diam / 2, length, 8]} />
        <meshStandardMaterial color={hovered ? "hotpink" : color} roughness={0.3} />
      </mesh>
      {isSelected && <Html center><div style={{ background: "rgba(0,0,0,0.8)", color: "white", padding: "8px", borderRadius: "4px" }}><strong>{section.id}</strong><br />Type: {section.category}</div></Html>}
    </group>
  );
};

// ... imports (same as before)

// --- Camera Controller (UPDATED) ---



// --- Main Component ---

export const NeuronVisualizer = ({ model }: { model: DetailNeuronModelFragment }) => {
  const segments = useNeuronLayout(model);

  // Calculate Bounding Box and Center
  const { bounds, center } = useMemo(() => {
    const box = new THREE.Box3();
    if (segments.length === 0) return { bounds: box, center: new THREE.Vector3(0, 0, 0) };

    segments.forEach(seg => {
      box.expandByPoint(seg.start);
      box.expandByPoint(seg.end);
    });

    const c = new THREE.Vector3();
    box.getCenter(c);

    return { bounds: box, center: c };
  }, [segments]);

  const compartmentMap = useMemo(() => Object.fromEntries(model.config.cells.flatMap((cell) => cell.biophysics.compartments.map((c) => [c.id, c]))), [model]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "500px" }}>
      <Canvas camera={{ fov: 34 }} onPointerMissed={() => setSelectedId(null)}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 50, 20]} />

        {/* Controls: Target is controlled by AutoCenter */}
        <OrbitControls makeDefault />

        <AutoCenter bounds={bounds} center={center} />

        {segments.map((seg) => (
          <CylinderWithTooltip
            key={seg.uniqueKey}
            section={seg.section}
            start={seg.start}
            end={seg.end}
            color={seg.color}
            compartmentMap={compartmentMap}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        ))}

        <EffectComposer>
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
