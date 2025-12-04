import { OrbitControls, Html, useCursor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useState, useRef } from "react";
import * as THREE from "three";
import { DetailNeuronModelFragment, SectionFragment } from "../api/graphql";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, GitBranch, X } from "lucide-react";
import { toast } from "sonner";

// --- Types & Helpers ---

interface ProcessedSegment {
  id: string;
  uniqueKey: string;
  section: SectionFragment;
  start: THREE.Vector3;
  end: THREE.Vector3;
  direction: THREE.Vector3;
  color: string;
  depth: number;
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

// --- CORE LOGIC: Equidistant Spacing (Copied from NeuronRenderer) ---

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

const useNeuronLayout = (sections: SectionFragment[]) => {
  return useMemo(() => {
    const sectionMap = new Map<string, SectionFragment>();
    const childrenMap = new Map<string, SectionFragment[]>();

    sections.forEach(sec => {
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
        color: getColorFromIndex(depth),
        depth
      });

      geometryMap.set(section.id, { start, end, direction });

      allChildren.forEach(child => {
        processSection(child.id, { start, end, direction }, depth + 1);
      });
    };

    const roots = sections.filter(s => !s.connections || s.connections.length === 0);
    const entryPoints = roots.length > 0 ? roots : [sections[0]];

    entryPoints.forEach(root => processSection(root.id, null, 0));

    return segments;
  }, [sections]);
};


const InteractiveSegment = ({
  segment,
  isSelected,
  onSelect,
  onAddChild,
}: {
  segment: ProcessedSegment,
  isSelected: boolean,
  onSelect: (id: string) => void,
  onAddChild: (parentId: string, location?: number) => void,
  onUpdateLength: (id: string, newLength: number) => void
}) => {
  const { start, end, direction, section, color } = segment;
  const length = start.distanceTo(end);
  const mid = start.clone().add(end).multiplyScalar(0.5);

  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const [hoverLocation, setHoverLocation] = useState<number | null>(null);
  useCursor(hovered);

  useFrame((state) => {
    if (isSelected && materialRef.current) {
      const t = state.clock.getElapsedTime();
      const intensity = (Math.sin(t * 10) + 1) / 2;
      materialRef.current.emissive.setHSL(0.9, 1, 0.2 * intensity);
    } else if (materialRef.current) {
      materialRef.current.emissive.setHex(0x000000);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSegmentClick = (e: any) => {
    e.stopPropagation();
    if (isSelected && e.shiftKey) {
      // Add child at location
      const point = e.point.clone();
      const vec = point.sub(start);
      const projectedLength = vec.dot(direction.clone().normalize());
      const location = Math.max(0, Math.min(1, projectedLength / length));
      onAddChild(segment.id, location);
    } else {
      onSelect(segment.id);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePointerMove = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    const point = e.point.clone();
    const vec = point.sub(start);
    const projectedLength = vec.dot(direction.clone().normalize());
    const location = Math.max(0, Math.min(1, projectedLength / length));
    setHoverLocation(location);
  };

  return (
    <group>
      <mesh
        position={mid}
        quaternion={quaternion}
        onClick={handleSegmentClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => { setHovered(false); setHoverLocation(null); }}
        onPointerMove={handlePointerMove}
      >
        <cylinderGeometry args={[section.diam / 2, section.diam / 2, length, 8]} />
        <meshStandardMaterial ref={materialRef} color={isSelected ? "hotpink" : color} />
      </mesh>

      {/* Hover Location Info */}
      {hovered && hoverLocation !== null && (
        <Html position={start.clone().add(direction.clone().normalize().multiplyScalar(length * hoverLocation))}>
          <div className="pointer-events-none bg-black/80 text-white text-xs px-1 rounded">
            {(hoverLocation * 100).toFixed(0)}%
          </div>
        </Html>
      )}

      {/* Add Child Button (Visual cue) */}
      {isSelected && (
        <Html position={end}>
          <div className="pointer-events-none flex flex-col items-center">
            <div className="pointer-events-auto">
              <Button size="sm" variant="secondary" className="h-6 w-6 rounded-full p-0" onClick={() => onAddChild(segment.id)}>+</Button>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};


export const NeuronEditor = ({
  initialModel,
  onSave
}: {
  initialModel: DetailNeuronModelFragment,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (config: any) => void
}) => {
  // Flatten all sections from all cells for editing
  // We assume single cell for simplicity or merge them?
  // The fragment has `config.cells`.

  const [cells, setCells] = useState(initialModel.config.cells);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [rebranchingId, setRebranchingId] = useState<string | null>(null);

  // We need a way to update a specific section in the deep structure
  // Or we just flatten them into a list and reconstruct?
  // The layout hook expects a flat list of sections.

  // Let's maintain a flat list of sections for the active cell (assuming 1 cell for now)
  // If multiple cells, we might need to select a cell first.

  const activeCellId = cells[0]?.id;
  const activeCell = cells.find(c => c.id === activeCellId);
  const compartments = activeCell?.biophysics.compartments || [];

  const sections = useMemo(() => {
    return cells.find(c => c.id === activeCellId)?.topology.sections || [];
  }, [cells, activeCellId]);

  const updateSection = (id: string, update: Partial<SectionFragment>) => {
    setCells(prev => prev.map(cell => {
      if (cell.id !== activeCellId) return cell;
      return {
        ...cell,
        topology: {
          ...cell.topology,
          sections: cell.topology.sections.map(s => s.id === id ? { ...s, ...update } : s)
        }
      };
    }));
  };

  const addSection = (parentId: string, location: number = 1) => {
    const newId = uuidv4();
    const newSection: SectionFragment = {
      id: newId,
      diam: 1,
      length: 10,
      category: "dendrite", // Default
      coords: [],
      connections: [{ parent: parentId, location: location }]
    };

    setCells(prev => prev.map(cell => {
      if (cell.id !== activeCellId) return cell;
      return {
        ...cell,
        topology: {
          ...cell.topology,
          sections: [...cell.topology.sections, newSection]
        }
      };
    }));
    setSelectedSectionId(newId);
  };

  const deleteSection = (id: string) => {
    const sectionToDelete = sections.find(s => s.id === id);
    if (!sectionToDelete) return;

    const parentConnection = sectionToDelete.connections?.[0];

    setCells(prev => prev.map(cell => {
      if (cell.id !== activeCellId) return cell;

      const newSections = cell.topology.sections
        .filter(s => s.id !== id)
        .map(s => {
          const conn = s.connections?.[0];
          if (conn?.parent === id) {
            // This is a child of the deleted section
            if (parentConnection) {
              // Glue to grandparent
              return {
                ...s,
                connections: [{
                  parent: parentConnection.parent,
                  location: parentConnection.location
                }]
              };
            } else {
              // Becomes a root
              return {
                ...s,
                connections: []
              };
            }
          }
          return s;
        });

      return {
        ...cell,
        topology: {
          ...cell.topology,
          sections: newSections
        }
      };
    }));

    if (selectedSectionId === id) setSelectedSectionId(null);
    toast.success("Section deleted");
  };

  const handleRebranch = (childId: string, newParentId: string) => {
    if (childId === newParentId) {
      toast.error("Cannot rebranch to itself");
      return;
    }

    // Check if newParentId is a descendant of childId
    let current = sections.find(s => s.id === newParentId);
    let isCycle = false;
    while (current) {
      const parentId = current.connections?.[0]?.parent;
      if (!parentId) break;
      if (parentId === childId) {
        isCycle = true;
        break;
      }
      current = sections.find(s => s.id === parentId);
    }

    if (isCycle) {
      toast.error("Cannot rebranch to a descendant (cycle detected)");
      return;
    }

    updateSection(childId, {
      connections: [{ parent: newParentId, location: 1 }]
    });
    setRebranchingId(null);
    toast.success("Section rebranched");
  };

  const handleSegmentSelect = (id: string) => {
    if (rebranchingId) {
      handleRebranch(rebranchingId, id);
    } else {
      setSelectedSectionId(id);
    }
  };

  const segments = useNeuronLayout(sections);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 w-80 max-h-[calc(100vh-2rem)]">
        <Card className="p-4 flex flex-col gap-4 h-full">
          <div className="flex-none">
            <h3 className="font-bold">Neuron Editor</h3>
            {rebranchingId && (
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded text-xs flex justify-between items-center mt-2">
                <span>Select new parent...</span>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setRebranchingId(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            <Button className="w-full mt-2" onClick={() => onSave({ cells })}>Save Model</Button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <Accordion type="single" collapsible value={selectedSectionId || ""} onValueChange={setSelectedSectionId}>
              {sections.map(section => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="text-sm py-2 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span>{section.id.slice(0, 8)}</span>
                      <span className="text-muted-foreground text-xs">({section.category || "dendrite"})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-4 pt-2 px-1">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-xs">Length</Label>
                          <span className="text-xs text-muted-foreground">{section.length?.toFixed(1)}</span>
                        </div>
                        <Slider
                          value={[section.length || 10]}
                          min={1} max={100} step={0.1}
                          onValueChange={([val]) => updateSection(section.id, { length: val })}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-xs">Diameter</Label>
                          <span className="text-xs text-muted-foreground">{section.diam?.toFixed(1)}</span>
                        </div>
                        <Slider
                          value={[section.diam || 1]}
                          min={0.1} max={10} step={0.1}
                          onValueChange={([val]) => updateSection(section.id, { diam: val })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Compartment</Label>
                        <Select
                          value={section.category || "dendrite"}
                          onValueChange={(val) => updateSection(section.id, { category: val })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {compartments.map(c => (
                              <SelectItem key={c.id} value={c.id}>{c.id}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant={rebranchingId === section.id ? "secondary" : "outline"}
                          className="flex-1"
                          onClick={() => setRebranchingId(rebranchingId === section.id ? null : section.id)}
                        >
                          <GitBranch className="w-3 h-3 mr-2" />
                          {rebranchingId === section.id ? "Cancel" : "Rebranch"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-none px-2"
                          onClick={() => deleteSection(section.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Card>
      </div>

      <Canvas camera={{ position: [50, 50, 50], fov: 50 }} onPointerMissed={() => setSelectedSectionId(null)}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls makeDefault />

        {segments.map(segment => (
          <InteractiveSegment
            key={segment.uniqueKey}
            segment={segment}
            isSelected={segment.id === selectedSectionId}
            onSelect={handleSegmentSelect}
            onAddChild={addSection}
            onUpdateLength={(id, len) => updateSection(id, { length: len })}
          />
        ))}
      </Canvas>
    </div>
  );
};
