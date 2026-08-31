import { useEffect, useState } from "react";
import { Brush, Droplet, Eye, EyeOff, Plus, Redo2, Trash2, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Slider } from "@/components/ui/slider";
import { useDialog } from "@/app/dialog";
import { useModeStore } from "../../platform/stores/modeStore";
import { useSceneStore } from "../../platform/stores/sceneStore";
import { useRoiDrawingStore, type AnnotateTool } from "../annotations/roiDrawingStore";
import { applicableEnhancers } from "../annotations/enhancers/registry";
import { useBrushSkeletonStoreApi } from "../annotations/enhancers/brushSkeletonStore";
import { simplifyGeometry } from "./simplify";
import {
  DESIGN_TRIANGLE_BUDGET,
  totalTriangles,
  useMeshDesignStore,
  useMeshDesignStoreApi,
  type DesignMesh,
} from "./store/meshDesignStore";

/**
 * The designer's toolbar — the DESIGN-mode sibling of `RoiToolbar`.
 *
 * The extraction tools are the SAME brush and blob the annotator has (same
 * `roiDrawingStore.activeTool`, same enhancer panels, same in-canvas
 * capture); what differs is where an accepted candidate goes: into the
 * design session as a mesh, never into an annotation. Below the tools sits
 * the session — every mesh with its triangle count, a simplify slider, and
 * the commit that bakes them all into one fabriks collection.
 */

const DESIGN_TOOLS: { tool: AnnotateTool; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { tool: "BRUSH", label: "Tube", icon: Brush },
  { tool: "BLOB", label: "Blob", icon: Droplet },
];

const isDesignTool = (tool: AnnotateTool | null): boolean => tool === "BRUSH" || tool === "BLOB";

const MeshRow = ({ mesh, selected }: { mesh: DesignMesh; selected: boolean }) => {
  const api = useMeshDesignStoreApi();
  const [ratio, setRatio] = useState(mesh.simplifyRatio);
  const [busy, setBusy] = useState(false);
  // Re-sync the slider when the store's ratio moves under it (a reset, an
  // import) — adjusted during render, the React-sanctioned form of "derive
  // state from a prop", rather than in an effect.
  const [seenRatio, setSeenRatio] = useState(mesh.simplifyRatio);
  if (seenRatio !== mesh.simplifyRatio) {
    setSeenRatio(mesh.simplifyRatio);
    setRatio(mesh.simplifyRatio);
  }

  const applyRatio = async (value: number) => {
    setBusy(true);
    try {
      const current = await simplifyGeometry(mesh.original, value);
      if (api.getState().meshes.some((m) => m.id === mesh.id)) api.getState().setCurrent(mesh.id, current, value);
    } catch (error) {
      api.getState().setStatus("editing", `Simplification failed: ${String(error)}`);
    } finally {
      setBusy(false);
    }
  };

  const triangles = mesh.current.indices.length / 3;
  return (
    <div
      className={`flex items-center gap-2 rounded px-1 py-0.5 ${selected ? "bg-white/10" : ""}`}
      onClick={() => api.getState().select(mesh.id)}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: `hsl(${mesh.hue} 65% 55%)` }} />
      {selected && (
        <span className="rounded bg-emerald-500/30 px-1 text-[9px] uppercase text-emerald-200" title="Strokes add to this mesh">
          active
        </span>
      )}
      <input
        className="w-20 bg-transparent text-[10px] outline-none"
        value={mesh.name}
        onChange={(event) => api.getState().renameMesh(mesh.id, event.target.value)}
        onClick={(event) => event.stopPropagation()}
      />
      <span className="w-14 text-right text-[10px] tabular-nums text-muted-foreground">{triangles.toLocaleString()} tri</span>
      <div className="w-20" title="Simplify — how much of the extracted detail to keep" onClick={(event) => event.stopPropagation()}>
        <Slider
          min={0.02}
          max={1}
          step={0.02}
          value={[ratio]}
          disabled={busy}
          onValueChange={([value]) => setRatio(value)}
          onValueCommit={([value]) => void applyRatio(value)}
        />
      </div>
      <Button
        size="xs"
        variant="ghost"
        className="h-5 w-5 p-0"
        title={mesh.visible ? "Hide" : "Show"}
        onClick={(event) => {
          event.stopPropagation();
          api.getState().setVisible(mesh.id, !mesh.visible);
        }}
      >
        {mesh.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
      </Button>
      <Button
        size="xs"
        variant="ghost"
        className="h-5 w-5 p-0"
        title="Remove from the design"
        onClick={(event) => {
          event.stopPropagation();
          api.getState().removeMesh(mesh.id);
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export const MeshDesignToolbar = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const displayMode = useModeStore((s) => s.displayMode);
  const activeTool = useRoiDrawingStore((s) => s.activeTool);
  const setActiveTool = useRoiDrawingStore((s) => s.setActiveTool);
  const brushApi = useBrushSkeletonStoreApi();
  const meshes = useMeshDesignStore((s) => s.meshes);
  const selectedId = useMeshDesignStore((s) => s.selectedId);
  const status = useMeshDesignStore((s) => s.status);
  const message = useMeshDesignStore((s) => s.message);
  const origin = useMeshDesignStore((s) => s.origin);
  const reset = useMeshDesignStore((s) => s.reset);
  const undo = useMeshDesignStore((s) => s.undo);
  const redo = useMeshDesignStore((s) => s.redo);
  const canUndo = useMeshDesignStore((s) => s.history.length > 0);
  const canRedo = useMeshDesignStore((s) => s.future.length > 0);
  const newMesh = useMeshDesignStore((s) => s.newMesh);
  const designModifier = useModeStore((s) => s.designModifier);
  const designApi = useMeshDesignStoreApi();
  const sceneId = useSceneStore((s) => s.id);
  const patchSceneLayer = useSceneStore((s) => s.patchSceneLayer);
  const world = useSceneStore((s) => s.transformContext.worldCoordinateSystem);
  const { openDialog } = useDialog();

  const inDesign = interactionMode === "DESIGN";

  // Undo/redo over the sculpt history — DESIGN only, and never from an input.
  useEffect(() => {
    if (!inDesign) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") return;
      const target = event.target as { tagName?: string; isContentEditable?: boolean } | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) return;
      event.preventDefault();
      if (event.shiftKey) designApi.getState().redo();
      else designApi.getState().undo();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [inDesign, designApi]);

  // Entering DESIGN lands on a design tool; the annotator's shapes are inert here.
  useEffect(() => {
    if (inDesign && !isDesignTool(activeTool)) setActiveTool("BRUSH");
  }, [inDesign, activeTool, setActiveTool]);

  if (!inDesign) return null;

  const enhancers = applicableEnhancers({ tool: activeTool, displayMode });
  const triangles = totalTriangles(meshes);
  const committing = status === "baking" || status === "uploading" || status === "committing";

  return (
    <div className="absolute bottom-12 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1">
      {enhancers.map(({ id, ParamsPanel }) => (
        <ParamsPanel key={id} />
      ))}
      {meshes.length > 0 && (
        <div className="pointer-events-auto flex flex-col gap-0.5 rounded-md bg-background/80 px-2 py-1.5 shadow-md backdrop-blur-sm">
          {meshes.map((mesh) => (
            <MeshRow key={mesh.id} mesh={mesh} selected={mesh.id === selectedId} />
          ))}
          <div className="mt-1 flex items-center gap-1">
            <Button
              size="xs"
              variant="default"
              disabled={committing || !world}
              onClick={() => {
                if (!world) return;
                brushApi.getState().clear();
                // Dialogs render outside the scene scope: hand the session over
                // as props, take the outcome back through callbacks.
                openDialog(
                  "commitmeshdesign",
                  {
                    sceneId,
                    world,
                    meshes: designApi.getState().meshes,
                    origin: designApi.getState().origin,
                    onProgress: (progress) => designApi.getState().setStatus(progress.status, progress.message),
                    onCommitted: () => {
                      // A new version replaces the old on screen: hide the
                      // layer this session was loaded from (session-local, the
                      // server keeps both versions).
                      const source = designApi.getState().origin?.layerId;
                      if (source) patchSceneLayer(source, { visible: false });
                      designApi.getState().reset();
                    },
                    onFailed: (message) => designApi.getState().setStatus("error", message),
                  },
                  { size: "small" },
                );
              }}
            >
              {committing ? "Committing…" : origin ? "Commit as new version" : "Commit collection"}
            </Button>
            <Button size="xs" variant="ghost" className="h-6 w-6 p-0" title="Undo the last sculpt (⌘Z)" disabled={committing || !canUndo} onClick={undo}>
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button size="xs" variant="ghost" className="h-6 w-6 p-0" title="Redo (⇧⌘Z)" disabled={committing || !canRedo} onClick={redo}>
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
            <Button size="xs" variant="outline" disabled={committing} onClick={reset}>
              Discard all
            </Button>
            <span
              className={`text-[10px] tabular-nums ${triangles > DESIGN_TRIANGLE_BUDGET ? "text-amber-300/90" : "text-muted-foreground"}`}
              title={
                triangles > DESIGN_TRIANGLE_BUDGET
                  ? "A designed collection is drawn in full — simplify before committing"
                  : "Triangles across the session"
              }
            >
              {triangles.toLocaleString()} tri
            </span>
          </div>
        </div>
      )}
      <span className="text-[10px] text-white/50">
        {message ? (
          <span className="text-amber-300/90">{message}</span>
        ) : designModifier === "erase" ? (
          <span className="text-rose-300/90">Removing — drag over the mesh to take brushed areas away</span>
        ) : designModifier === "add" ? (
          <span className="text-emerald-300/90">
            {activeTool === "BRUSH" ? "Brushing — drag along a structure to add it to the mesh" : "Click a structure to grow it onto the mesh"}
          </span>
        ) : selectedId && meshes.some((m) => m.id === selectedId) ? (
          `Brushing into ${meshes.find((m) => m.id === selectedId)?.name} · click a mesh or its row to change · hold C/V to add, X to remove`
        ) : (
          "Navigate freely · hold C and drag to brush · V to grow a blob · X to remove"
        )}
      </span>
      <ButtonGroup>
        <Button size="xs" variant="outline" title="Start a new mesh — the next C/V stroke goes there" onClick={() => newMesh()}>
          <Plus className="h-3.5 w-3.5" />
          <span className="text-[10px]">New mesh</span>
        </Button>
        {DESIGN_TOOLS.map(({ tool, label, icon: Icon }) => (
          <Button
            key={tool}
            variant={activeTool === tool ? "default" : "outline"}
            size="xs"
            onClick={() => setActiveTool(tool)}
            title={label}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="text-[10px]">{label}</span>
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};
