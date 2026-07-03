import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Html, OrbitControls, useCursor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Check, Copy, GitBranch, HelpCircle, Pencil, Save, Trash2, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import * as THREE from "three";
import { v4 as uuidv4 } from 'uuid';
import { useDialog } from "@/app/dialog";
import { DetailNeuronModelFragment, SectionFragment } from "../api/graphql";
import { computeRootCentroidFit, FitCamera } from "../lib/fitCamera";
import {
  EditableCompartment,
  EditableModelConfig,
  EditableModelWide,
} from "../lib/modelSerialization";
import { rgbaToCss } from "../lib/color";
import { toBase } from "../lib/quantities";
import { CompartmentEditor } from "./editor/CompartmentEditor";
import { MechanismCatalogProvider } from "./editor/MechanismCatalog";
import { ModelConfigPanel } from "./editor/ModelConfigPanel";
import { QuantityInput } from "./QuantityInput";

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
  if (!section.parent) return null;
  const conn = section.parent;
  return { id: conn.parent, location: conn.parentLocation ?? 1 };
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
  const axis = parentDir.clone().normalize();
  const groupPhase = (groupSeed % 100) * 0.01 * Math.PI * 2;

  // Perpendicular "side" direction, with co-located siblings spread evenly
  // around the parent axis.
  const radial = getPerpendicularVector(axis);
  const azimuth = siblingCount > 1 ? (siblingIndex * (Math.PI * 2)) / siblingCount : 0;
  radial.applyAxisAngle(axis, azimuth + groupPhase);

  // Axial bias runs smoothly from -1 (points back, at the parent's start) through
  // 0 (points sideways, mid-segment) to +1 (points forward, at the parent's end).
  // This lets a branch swing continuously onto the side of its parent as it is
  // moved away from a tip — no dead zone, no discontinuous jump.
  const axialBias = (location - 0.5) * 2;

  // Split between axial and radial so the result stays unit length.
  let radialMag = Math.sqrt(Math.max(0, 1 - axialBias * axialBias));

  // Stop co-located siblings collapsing onto each other at the tips by forcing a
  // minimum sideways spread — this re-creates the classic bifurcation cone.
  if (siblingCount > 1) radialMag = Math.max(radialMag, Math.sin(Math.PI / 4));
  const axialMag = Math.sign(axialBias) * Math.sqrt(Math.max(0, 1 - radialMag * radialMag));

  const finalDir = axis.multiplyScalar(axialMag).add(radial.multiplyScalar(radialMag));
  if (finalDir.lengthSq() < 1e-6) return radial.clone().normalize();
  return finalDir.normalize();
};

// --- Layout Hook ---

const useNeuronLayout = (
  sections: SectionFragment[],
  categoryColor?: Map<string, string>,
) => {
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

      // `length` is now a `Length` quantity string ("10 µm"); normalise to µm.
      const length = toBase(section.length, "length", 10);
      const end = start.clone().add(direction.clone().normalize().multiplyScalar(length));

      segments.push({
        id: section.id,
        uniqueKey: section.id,
        section,
        start,
        end,
        direction,
        // Tint by the section's compartment color (matched on `category`) when
        // set; otherwise fall back to the depth-based hue.
        color: categoryColor?.get(section.category ?? "") ?? getColorFromIndex(depth),
        depth
      });

      geometryMap.set(section.id, { start, end, direction });

      allChildren.forEach(child => {
        processSection(child.id, { start, end, direction }, depth + 1);
      });
    };

    const roots = sections.filter(s => !s.parent);
    const entryPoints = roots.length > 0 ? roots : [sections[0]];

    entryPoints.forEach(root => processSection(root.id, null, 0));

    return segments;
  }, [sections, categoryColor]);
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
}) => {
  const { start, end, direction, section, color } = segment;
  // `diam` is a `Length` quantity string ("1 µm"); normalise to µm for geometry.
  const diamUm = toBase(section.diam, "length", 1);
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

  // Hit-zone radius: a comfortable minimum so thin branches stay easy to click,
  // and always a bit fatter than the visible cylinder.
  const hitRadius = Math.max(diamUm / 2 + 1.5, 2);

  return (
    <group>
      {/* Invisible, fatter cylinder that captures pointer events. */}
      <mesh
        position={mid}
        quaternion={quaternion}
        onClick={handleSegmentClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => { setHovered(false); setHoverLocation(null); }}
        onPointerMove={handlePointerMove}
      >
        <cylinderGeometry args={[hitRadius, hitRadius, length, 12]} />
        <meshStandardMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Visible cylinder (non-interactive; the hit-zone above handles input). */}
      <mesh position={mid} quaternion={quaternion} raycast={() => null}>
        <cylinderGeometry args={[diamUm / 2, diamUm / 2, length, 8]} />
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
  onSave: (config: EditableModelConfig) => void
}) => {
  // Flatten all sections from all cells for editing
  // We assume single cell for simplicity or merge them?
  // The fragment has `config.cells`.

  const { openSheet } = useDialog();
  const [cells, setCells] = useState(initialModel.config.cells);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [rebranchingId, setRebranchingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Model-wide config lives in its own state (the editor mutates only `cells`
  // for topology/biophysics; these scalars + lists round-trip via the Model tab).
  const [modelWide, setModelWide] = useState<EditableModelWide>(() => ({
    temperature: initialModel.config.temperature,
    vInit: initialModel.config.vInit,
    label: initialModel.config.label,
    ra: initialModel.config.ra,
    cm: initialModel.config.cm,
    ions: initialModel.config.ions ?? [],
    mechanismGlobals: initialModel.config.mechanismGlobals ?? [],
  }));
  const patchModelWide = (update: Partial<EditableModelWide>) =>
    setModelWide(prev => ({ ...prev, ...update }));

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

  const updateCompartment = (compartmentId: string, update: Partial<EditableCompartment>) => {
    setCells(prev => prev.map(cell => {
      if (cell.id !== activeCellId) return cell;
      return {
        ...cell,
        biophysics: {
          ...cell.biophysics,
          compartments: cell.biophysics.compartments.map(c =>
            c.id === compartmentId ? { ...c, ...update } : c
          )
        }
      };
    }));
  };

  const addSection = (parentId: string, location: number = 1) => {
    const newId = uuidv4();
    const newSection: SectionFragment = {
      id: newId,
      diam: "1 µm",
      nseg: 10,
      length: "10 µm",
      category: "dendrite", // Default
      coords: [],
      parent: { parent: parentId, parentLocation: location, childEnd: 0 }
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

  const duplicateSection = (id: string) => {
    const original = sections.find(s => s.id === id);
    if (!original) return;

    // Roots have no parent connection; a duplicate would be a second free-floating
    // root rather than a copy in place, so disallow it.
    if (!getParentInfo(original)) {
      toast.error("Root sections cannot be duplicated");
      return;
    }

    const newId = uuidv4();
    // Copy every parameter verbatim, including the parent connection, so the
    // duplicate sits exactly where the original does. Deep-copy the nested
    // arrays so the two sections don't share mutable references.
    const newSection: SectionFragment = {
      ...original,
      id: newId,
      coords: original.coords ? original.coords.map(c => ({ ...c })) : [],
      parent: original.parent ? { ...original.parent } : null,
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
    toast.success("Section duplicated");
  };

  const renameSection = (oldId: string, newId: string) => {
    setCells(prev => prev.map(cell => {
      if (cell.id !== activeCellId) return cell;
      return {
        ...cell,
        topology: {
          ...cell.topology,
          sections: cell.topology.sections.map(s => {
            if (s.id === oldId) return { ...s, id: newId };
            // Re-point any child that referenced the old id as its parent.
            if (s.parent?.parent === oldId) {
              return { ...s, parent: { ...s.parent, parent: newId } };
            }
            return s;
          })
        }
      };
    }));
    if (selectedSectionId === oldId) setSelectedSectionId(newId);
  };

  const commitRename = (oldId: string) => {
    const next = renameValue.trim();
    if (!next) {
      toast.error("Name cannot be empty");
      return;
    }
    if (next === oldId) {
      setRenamingId(null);
      return;
    }
    if (sections.some(s => s.id === next)) {
      toast.error("A section with that name already exists");
      return;
    }
    renameSection(oldId, next);
    setRenamingId(null);
    toast.success("Section renamed");
  };

  const deleteSection = (id: string) => {
    const sectionToDelete = sections.find(s => s.id === id);
    if (!sectionToDelete) return;

    const parentConnection = sectionToDelete.parent;

    setCells(prev => prev.map(cell => {
      if (cell.id !== activeCellId) return cell;

      const newSections = cell.topology.sections
        .filter(s => s.id !== id)
        .map(s => {
          if (s.parent?.parent === id) {
            // This is a child of the deleted section
            if (parentConnection) {
              // Glue to grandparent
              return {
                ...s,
                parent: {
                  parent: parentConnection.parent,
                  parentLocation: parentConnection.parentLocation,
                  childEnd: parentConnection.childEnd,
                }
              };
            } else {
              // Becomes a root
              return { ...s, parent: null };
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
      const parentId = current.parent?.parent;
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
      parent: { parent: newParentId, parentLocation: 1, childEnd: 0 }
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

  // Compartment id → CSS color, so the live 3D view (and the section swatches)
  // reflect compartment colors as they're edited.
  const categoryColor = useMemo(() => {
    const map = new Map<string, string>();
    compartments.forEach((c) => {
      const css = rgbaToCss(c.color);
      if (css) map.set(c.id, css);
    });
    return map;
  }, [compartments]);

  const segments = useNeuronLayout(sections, categoryColor);
  const colorMap = useMemo(() => new Map(segments.map(s => [s.id, s.color])), [segments]);
  const { points, target } = useMemo(() => computeRootCentroidFit(segments), [segments]);

  return (
    <MechanismCatalogProvider>
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 w-80 max-h-[calc(100vh-2rem)]">
        <Card className="p-4 flex flex-col gap-4 h-full bg-card/95 backdrop-blur-sm">
          <div className="flex-none space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-bold leading-tight">Neuron Editor</h3>
                <p className="text-xs text-muted-foreground truncate">{initialModel.name}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 flex-none text-muted-foreground"
                title="How does this work?"
                onClick={() => openSheet("neuroneditorhelp", {})}
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              {sections.length} section{sections.length === 1 ? "" : "s"}
            </p>

            {rebranchingId && (
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded text-xs flex justify-between items-center gap-2">
                <span className="flex items-center gap-1.5">
                  <GitBranch className="w-3 h-3 flex-none" />
                  Select the new parent in the view…
                </span>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 flex-none" onClick={() => setRebranchingId(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <Button
              className="w-full"
              onClick={() => onSave({ cells, ...modelWide })}
            >
              <Save className="w-4 h-4 mr-2" />
              Save as new model
            </Button>
          </div>

          <Tabs defaultValue="topology" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid grid-cols-3 flex-none">
              <TabsTrigger value="topology">Topology</TabsTrigger>
              <TabsTrigger value="biophysics">Biophysics</TabsTrigger>
              <TabsTrigger value="model">Model</TabsTrigger>
            </TabsList>

            <TabsContent value="topology" className="flex-1 overflow-y-auto pr-2 -mr-2 mt-2">
            {sections.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-8 px-2">
                No sections yet. Add one in the 3D view to start building.
              </div>
            ) : (
            <Accordion
              type="single"
              collapsible
              value={selectedSectionId || ""}
              onValueChange={(val) => {
                // While rebranching, clicking another section in the pane picks it
                // as the new parent — mirroring the click-in-3D-view behaviour.
                if (rebranchingId && val && val !== rebranchingId) {
                  handleRebranch(rebranchingId, val);
                } else {
                  setSelectedSectionId(val);
                }
              }}
            >
              {sections.map(section => {
                const isRootSection = !getParentInfo(section);
                return (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="text-sm py-2 hover:no-underline">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-none ring-1 ring-black/10"
                        style={{ background: colorMap.get(section.id) ?? "#888" }}
                      />
                      <span className="font-mono truncate">{section.id.slice(0, 8)}</span>
                      <span className="text-muted-foreground text-xs truncate">({section.category || "dendrite"})</span>
                      {isRootSection && (
                        <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground border rounded px-1 py-0.5 flex-none">
                          root
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-4 pt-2 px-1">
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        {renamingId === section.id ? (
                          <div className="flex items-center gap-1">
                            <Input
                              autoFocus
                              value={renameValue}
                              className="h-7 font-mono"
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") commitRename(section.id);
                                if (e.key === "Escape") setRenamingId(null);
                              }}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 flex-none"
                              title="Confirm rename"
                              onClick={() => commitRename(section.id)}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 flex-none"
                              title="Cancel"
                              onClick={() => setRenamingId(null)}
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-mono truncate flex-1">{section.id}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 flex-none"
                              title="Rename section"
                              onClick={() => {
                                setRenamingId(section.id);
                                setRenameValue(section.id);
                              }}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Length</Label>
                        <QuantityInput
                          dimension="length"
                          value={section.length}
                          onChange={(val) => updateSection(section.id, { length: val })}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Diameter</Label>
                        <QuantityInput
                          dimension="length"
                          value={section.diam}
                          onChange={(val) => updateSection(section.id, { diam: val })}
                        />
                      </div>

                      {(() => {
                        const parentInfo = getParentInfo(section);
                        if (!parentInfo) return null;
                        const conn = section.parent!;
                        // Absolute distance of the connection point from the parent's
                        // start, in µm — location is a 0–1 fraction of the parent length.
                        const parentLength = toBase(
                          sections.find(s => s.id === parentInfo.id)?.length,
                          "length",
                          0,
                        );
                        const absoluteUm = parentInfo.location * parentLength;
                        return (
                          <div className="space-y-1">
                            <Label className="text-xs">Location on parent (0–1)</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min={0} max={1} step={0.01}
                                className="w-20 flex-none"
                                value={parentInfo.location}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (isNaN(val)) return;
                                  const clamped = Math.max(0, Math.min(1, val));
                                  updateSection(section.id, {
                                    parent: { ...conn, parent: parentInfo.id, parentLocation: clamped }
                                  });
                                }}
                              />
                              <div className="relative flex-1 pt-5">
                                <div
                                  className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white"
                                  style={{ left: `${parentInfo.location * 100}%` }}
                                  title="Distance from the parent's start"
                                >
                                  {absoluteUm.toFixed(1)} µm
                                </div>
                                <Slider
                                  value={[parentInfo.location]}
                                  min={0} max={1} step={0.01}
                                  onValueChange={([val]) =>
                                    updateSection(section.id, {
                                      parent: { ...conn, parent: parentInfo.id, parentLocation: val }
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })()}

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
                          variant="outline"
                          className="flex-none px-2"
                          disabled={isRootSection}
                          title={isRootSection ? "Root sections cannot be duplicated" : "Duplicate section"}
                          onClick={() => duplicateSection(section.id)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-none px-2"
                          title="Delete section"
                          onClick={() => deleteSection(section.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                );
              })}
            </Accordion>
            )}
            </TabsContent>

            <TabsContent value="biophysics" className="flex-1 overflow-y-auto pr-2 -mr-2 mt-2">
              {compartments.length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-8 px-2">
                  No compartments defined for this cell.
                </div>
              ) : (
                <Accordion type="single" collapsible>
                  {compartments.map(compartment => (
                    <AccordionItem key={compartment.id} value={compartment.id}>
                      <AccordionTrigger className="text-sm py-2 hover:no-underline">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono truncate">{compartment.id}</span>
                          <span className="text-muted-foreground text-xs truncate">
                            ({compartment.mechanisms.length} mech, {compartment.ions.length} ion{compartment.ions.length === 1 ? "" : "s"})
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CompartmentEditor
                          compartment={compartment}
                          onChange={(update) => updateCompartment(compartment.id, update)}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </TabsContent>

            <TabsContent value="model" className="flex-1 overflow-y-auto pr-2 -mr-2 mt-2">
              <ModelConfigPanel value={modelWide} patch={patchModelWide} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <Canvas camera={{ position: [50, 50, 50], fov: 50 }} onPointerMissed={() => setSelectedSectionId(null)}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls makeDefault />
        <FitCamera points={points} target={target} />

        {segments.map(segment => (
          <InteractiveSegment
            key={segment.uniqueKey}
            segment={segment}
            isSelected={segment.id === selectedSectionId}
            onSelect={handleSegmentSelect}
            onAddChild={addSection}
          />
        ))}
      </Canvas>
    </div>
    </MechanismCatalogProvider>
  );
};
