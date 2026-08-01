import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { createScopedStoreHooks } from "@/lib/generic/createScopedStore";
import { RoiKind } from "@/mikro-next/api/graphql";
import { SPHERE_KIND } from "../core/primitiveDraw";

/**
 * The drawing tool types the drawer implements. Each maps to a RoiKind for
 * the mutation. SPHERE and CUBE are the volumetric (3D-only) tools: a probe
 * click anchors their center, a second click sets the radius
 * (`core/primitiveDraw.ts`).
 */
export type DrawingTool =
  | "RECTANGLE"
  | "ELLIPSIS"
  | "POINT"
  | "LINE"
  | "POLYGON"
  | "PATH"
  | "SPHERE"
  | "CUBE";

/** The volumetric tools, anchored by a probe click rather than the draw plane. */
export const isPrimitiveTool = (
  tool: AnnotateTool | null | undefined,
): tool is "SPHERE" | "CUBE" => tool === "SPHERE" || tool === "CUBE";

/**
 * The tools whose 3D placement comes from the probe: the volume hover-probes
 * for them in ANNOTATE mode, and its click either places (POINT) or anchors
 * (SPHERE/CUBE) at the probed coordinate.
 */
export const isProbeDerivedTool = (
  tool: AnnotateTool | null | undefined,
): tool is "POINT" | "SPHERE" | "CUBE" =>
  tool === "POINT" || isPrimitiveTool(tool);

export const DRAWING_TOOL_TO_ROI_KIND: Record<DrawingTool, RoiKind> = {
  RECTANGLE: RoiKind.Rectangle,
  ELLIPSIS: RoiKind.Ellipsis,
  POINT: RoiKind.Point,
  LINE: RoiKind.Line,
  POLYGON: RoiKind.Polygon,
  PATH: RoiKind.Path,
  SPHERE: SPHERE_KIND,
  CUBE: RoiKind.Cube,
};

/**
 * What the pointer does in ANNOTATE mode. "SELECT" is the marquee pointer
 * (`interactions/RectangleDrawer.tsx`); every other value is a shape the
 * `RoiDrawer` draws.
 *
 * Deliberately a separate union from `DrawingTool`: `DRAWING_TOOL_TO_ROI_KIND`
 * is a *total* `Record<DrawingTool, RoiKind>` that the drawer indexes unguarded,
 * so widening `DrawingTool` would force either a lying `RoiKind` entry for
 * SELECT or a partial map for all six real tools.
 *
 * Drawing and marquee are then mutually exclusive by construction: exactly one
 * of `activeTool === "SELECT"` and `isDrawingTool(activeTool)` can hold.
 */
export type AnnotateTool = "SELECT" | DrawingTool;

export const isDrawingTool = (
  tool: AnnotateTool | null | undefined,
): tool is DrawingTool => tool != null && tool !== "SELECT";

/**
 * A shape the user just drew, held only until the server confirms it. Drawing
 * targets the SCENE, whose annotation collection is registered into the world,
 * so world coordinates are both what is rendered and what is submitted — there
 * is no per-layer voxel copy to keep any more.
 */
export interface DrawnRoi {
  id: string;
  kind: RoiKind;
  /**
   * The tool that drew it, kept so the local preview can be re-stroked with the
   * right outline. `RoiKind` alone is not enough to invert — it has values with
   * no drawing tool — and this state never leaves the client.
   */
  tool: DrawingTool;
  /** World-space vectors, for rendering and for the mutation */
  worldVectors: Array<{ x: number; y: number; z: number }>;
}

export interface RoiDrawingState {
  activeTool: AnnotateTool | null;
  drawnRois: DrawnRoi[];
  /**
   * World-space first vertex for the next PATH session — set by "draw path
   * from probe", consumed (and cleared) by `RoiDrawer` after its reset effect.
   * Store-held rather than an imperative handle so it survives both the
   * drawer's tool/mode reset and its remount on a 2D↔3D display flip.
   */
  pendingPathSeed: [number, number, number] | null;
  /**
   * World-space center for the next SPHERE/CUBE session — seeded by a probe
   * click on the volume, consumed (and cleared) by `RoiDrawer` the same way
   * `pendingPathSeed` is.
   */
  pendingPrimitiveAnchor: [number, number, number] | null;
  /**
   * True while the drawer is sizing an anchored SPHERE/CUBE. The volume's
   * click handler checks it (plus a null `pendingPrimitiveAnchor`) before
   * seeding, so the COMMIT click — which may also hit the volume mesh — can
   * never re-anchor. A store flag rather than R3F stopPropagation because
   * raycast ordering between the draw plane and the volume is
   * camera-dependent.
   */
  primitiveSessionActive: boolean;
  setActiveTool: (tool: AnnotateTool | null) => void;
  addDrawnRoi: (roi: DrawnRoi) => void;
  removeDrawnRoi: (id: string) => void;
  clearDrawnRois: () => void;
  setPendingPathSeed: (seed: [number, number, number] | null) => void;
  setPendingPrimitiveAnchor: (anchor: [number, number, number] | null) => void;
  setPrimitiveSessionActive: (active: boolean) => void;
}

export const createRoiDrawingStore = () =>
  createStore<RoiDrawingState>()(
    immer((set) => ({
      activeTool: "RECTANGLE",
      drawnRois: [],
      pendingPathSeed: null,
      pendingPrimitiveAnchor: null,
      primitiveSessionActive: false,
      setActiveTool: (tool) =>
        set((state) => {
          state.activeTool = tool;
        }),
      setPendingPathSeed: (seed) =>
        set((state) => {
          state.pendingPathSeed = seed;
        }),
      setPendingPrimitiveAnchor: (anchor) =>
        set((state) => {
          state.pendingPrimitiveAnchor = anchor;
        }),
      setPrimitiveSessionActive: (active) =>
        set((state) => {
          state.primitiveSessionActive = active;
        }),
      addDrawnRoi: (roi) =>
        set((state) => {
          state.drawnRois.push(roi);
        }),
      removeDrawnRoi: (id) =>
        set((state) => {
          state.drawnRois = state.drawnRois.filter((r) => r.id !== id);
        }),
      clearDrawnRois: () =>
        set((state) => {
          state.drawnRois = [];
        }),
    })),
  );

const {
  StoreContext: RoiDrawingStoreContext,
  useScopedStore: useRoiDrawingStore,
  useStoreApi: useRoiDrawingStoreApi,
} = createScopedStoreHooks<RoiDrawingState>("RoiDrawingStore");

export {
  RoiDrawingStoreContext,
  useRoiDrawingStore,
  useRoiDrawingStoreApi,
};
