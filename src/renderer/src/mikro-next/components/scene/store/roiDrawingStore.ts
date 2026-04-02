import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { createScopedStoreHooks } from "./createScopedStore";
import { RoiKind } from "@/mikro-next/api/graphql";

/**
 * The drawing tool types that make sense for interactive 2D drawing.
 * Each maps to a RoiKind for the mutation.
 */
export type DrawingTool =
  | "RECTANGLE"
  | "ELLIPSIS"
  | "POINT"
  | "LINE"
  | "POLYGON"
  | "PATH";

export const DRAWING_TOOL_TO_ROI_KIND: Record<DrawingTool, RoiKind> = {
  RECTANGLE: RoiKind.Rectangle,
  ELLIPSIS: RoiKind.Ellipsis,
  POINT: RoiKind.Point,
  LINE: RoiKind.Line,
  POLYGON: RoiKind.Polygon,
  PATH: RoiKind.Path,
};

export interface DrawnRoi {
  id: string;
  layerId: string;
  kind: RoiKind;
  /** Voxel-space vectors (image coordinates) */
  vectors: Array<{ x: number; y: number; z: number }>;
  /** World-space vectors for rendering */
  worldVectors: Array<{ x: number; y: number; z: number }>;
}

export interface RoiDrawingState {
  activeTool: DrawingTool | null;
  drawnRois: DrawnRoi[];
  setActiveTool: (tool: DrawingTool | null) => void;
  addDrawnRoi: (roi: DrawnRoi) => void;
  removeDrawnRoi: (id: string) => void;
  clearDrawnRois: () => void;
}

export const createRoiDrawingStore = () =>
  createStore<RoiDrawingState>()(
    immer((set) => ({
      activeTool: null,
      drawnRois: [],
      setActiveTool: (tool) =>
        set((state) => {
          state.activeTool = tool;
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
