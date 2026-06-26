import { useCallback } from "react";
import { DetailTraceFragment } from "../api/graphql";
import {
  ArraySelection,
  Slice,
  useElektroZarrStoreApi,
} from "../components/store/zarrStore";

// Re-exported for existing consumers.
export type { ArraySelection, DownloadedArray, Slice } from "../components/store/zarrStore";

export type Plot = { [key: string]: number }[];

export const viewToSlices = (
  t: number | null,
  left?: number | undefined | null,
  right?: number | undefined | null,
): Slice[] => [
  {
    _slice: true,
    step: t,
    start: left ?? null,
    stop: right ?? null,
  },
];

export const slicesToString = (slice: Slice[]): string =>
  slice.map(x => x.start + ":" + x.stop).join(",");

/**
 * Reads trace data through the elektro-scoped zarr store (general access +
 * shared open-store registry). Public API is unchanged: `renderView` returns the
 * raw sample array for a trace over an optional [left, right] range at step `t`.
 */
export const useTraceArray = () => {
  const api = useElektroZarrStoreApi();

  const renderView = useCallback(
    async (
      trace: DetailTraceFragment,
      t: number | null,
      left?: number | undefined | null,
      right?: number | undefined | null,
      signal?: AbortSignal,
    ): Promise<number[]> => {
      const selection: ArraySelection = viewToSlices(t, left, right);
      const result = await api.getState().getSelection(trace.store, selection, signal);
      return result.out.data as number[];
    },
    [api],
  );

  return { renderView };
};
