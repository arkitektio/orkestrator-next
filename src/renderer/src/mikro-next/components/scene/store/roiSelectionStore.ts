import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { RoiKind } from "@/mikro-next/api/graphql";
import { createScopedStoreHooks } from "@/lib/generic/createScopedStore";

export interface SelectedRoi {
  id: string;
  layerId: string;
  name: string | null | undefined;
  kind: RoiKind;
}

export interface RoiBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface VisibleRoi extends SelectedRoi {
  bounds: RoiBounds;
}

interface RoiSelectionState {
  selectedRois: SelectedRoi[];
  visibleRois: Record<string, VisibleRoi>;
  selectOnlyRoi: (roi: SelectedRoi) => void;
  replaceSelectedRois: (rois: SelectedRoi[]) => void;
  mergeSelectedRois: (rois: SelectedRoi[]) => void;
  toggleSelectedRoi: (roi: SelectedRoi) => void;
  removeSelectedRoi: (roiId: string) => void;
  clearSelectedRois: () => void;
  setVisibleLayerRois: (layerId: string, rois: VisibleRoi[]) => void;
  clearVisibleLayerRois: (layerId: string) => void;
}

export const createRoiSelectionStore = () =>
  createStore<RoiSelectionState>()(
    immer((set) => ({
      selectedRois: [],
      visibleRois: {},
      selectOnlyRoi: (roi) =>
        set((state) => {
          state.selectedRois = [roi];
        }),
      replaceSelectedRois: (rois) =>
        set((state) => {
          state.selectedRois = rois;
        }),
      mergeSelectedRois: (rois) =>
        set((state) => {
          const next = new Map(state.selectedRois.map((roi) => [roi.id, roi]));
          rois.forEach((roi) => {
            next.set(roi.id, roi);
          });
          state.selectedRois = Array.from(next.values());
        }),
      toggleSelectedRoi: (roi) =>
        set((state) => {
          const index = state.selectedRois.findIndex((selected) => selected.id === roi.id);
          if (index === -1) {
            state.selectedRois.push(roi);
            return;
          }

          state.selectedRois.splice(index, 1);
        }),
      removeSelectedRoi: (roiId) =>
        set((state) => {
          state.selectedRois = state.selectedRois.filter((roi) => roi.id !== roiId);
        }),
      clearSelectedRois: () =>
        set((state) => {
          state.selectedRois = [];
        }),
      setVisibleLayerRois: (layerId, rois) =>
        set((state) => {
          Object.keys(state.visibleRois).forEach((roiId) => {
            if (state.visibleRois[roiId]?.layerId === layerId) {
              delete state.visibleRois[roiId];
            }
          });

          rois.forEach((roi) => {
            state.visibleRois[roi.id] = roi;
          });
        }),
      clearVisibleLayerRois: (layerId) =>
        set((state) => {
          Object.keys(state.visibleRois).forEach((roiId) => {
            if (state.visibleRois[roiId]?.layerId === layerId) {
              delete state.visibleRois[roiId];
            }
          });
        }),
    })),
  );

const {
  StoreContext: RoiSelectionStoreContext,
  useScopedStore: useRoiSelectionStore,
  useStoreApi: useRoiSelectionStoreApi,
} = createScopedStoreHooks<RoiSelectionState>("RoiSelectionStore");

export {
  RoiSelectionStoreContext,
  useRoiSelectionStore,
  useRoiSelectionStoreApi,
};
