import { useEffect, useRef, useState } from "react";
import uPlot from "uplot";
import { ExperimentFragment } from "../api/graphql";
import { ColumnData, RangeSelection } from "./store/experimentViewerStore";

// ─── Constants ────────────────────────────────────────────────────────────────

export const CHART_SYNC_KEY = "experiment-uplot-sync";

export const DEFAULT_RANGE: RangeSelection = { left: 0, right: null };

// ─── Range helpers ────────────────────────────────────────────────────────────

export const normalizeRange = (range?: RangeSelection): RangeSelection => ({
  left: range?.left ?? DEFAULT_RANGE.left,
  right: range?.right ?? DEFAULT_RANGE.right,
});

export const areRangesEqual = (
  left: RangeSelection,
  right: RangeSelection,
): boolean => left.left === right.left && left.right === right.right;

// ─── Data helpers ─────────────────────────────────────────────────────────────

export const getTraceLength = (experiment: ExperimentFragment): number =>
  experiment.timeTrace.store?.shape?.at(0) ?? 2000;

export const getStepSizeForRange = (
  totalLength: number,
  range: RangeSelection,
  preferredStepSize?: number | null,
): number => {
  if (preferredStepSize != null) {
    return preferredStepSize;
  }
  const start = range.left ?? 0;
  const end = range.right ?? totalLength;
  const windowLength = Math.max(1, end - start);
  return Math.max(1, Math.round(windowLength / 2000));
};

export const clampIndex = (index: number, length: number): number => {
  if (length <= 0) return 0;
  return Math.max(0, Math.min(index, length - 1));
};

/**
 * Build the detail (zoom) column data for uPlot from raw zarr arrays.
 * Raw array layout (matches the order in Promise.all in the loader):
 *   [rec0, rec1, ..., stim0, stim1, ..., timeTrace]
 * Returns: [timeTrace, rec0, rec1, ...] — uPlot x-first format.
 */
export const buildDetailData = (
  experiment: ExperimentFragment,
  rawArrays: number[][],
): { data: ColumnData; timeTrace: number[] } => {
  const timeTrace = (rawArrays[rawArrays.length - 1] ?? []) as number[];
  const recordingColumns = experiment.recordingViews.map(
    (_, i) => (rawArrays[i] ?? []) as number[],
  );
  return { data: [timeTrace, ...recordingColumns], timeTrace };
};

/**
 * Build the overview column data for uPlot from raw zarr arrays.
 * Returns: [timeTrace, stim0, stim1, ...] — uPlot x-first format.
 */
export const buildOverviewData = (
  experiment: ExperimentFragment,
  rawArrays: number[][],
): ColumnData => {
  const timeTrace = (rawArrays[rawArrays.length - 1] ?? []) as number[];
  const stimulusColumns = experiment.stimulusViews.map(
    (_, i) =>
      (rawArrays[experiment.recordingViews.length + i] ?? []) as number[],
  );
  return [timeTrace, ...stimulusColumns];
};

/**
 * Compute a padded [min, max] y-range from a list of column arrays.
 */
export const buildScaleRange = (
  seriesColumns: (number | null | undefined)[][],
  paddingRatio = 0.1,
): [number, number] => {
  let minValue = Number.POSITIVE_INFINITY;
  let maxValue = Number.NEGATIVE_INFINITY;

  for (const col of seriesColumns) {
    for (const value of col) {
      if (value == null || Number.isNaN(value)) continue;
      if (value < minValue) minValue = value;
      if (value > maxValue) maxValue = value;
    }
  }

  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) return [0, 1];

  if (minValue === maxValue) {
    const padding = Math.max(Math.abs(minValue) * paddingRatio, 1);
    return [minValue - padding, maxValue + padding];
  }

  const span = maxValue - minValue;
  const padding = Math.max(span * paddingRatio, Number.EPSILON);
  return [minValue - padding, maxValue + padding];
};

export const buildSpikeTimes = (
  experiment: ExperimentFragment,
  timeTrace: number[],
  stepSize: number,
): { value: number; label: string }[] => {
  const spikes: { value: number; label: string }[] = [];

  experiment.recordingViews.forEach((view) => {
    if (!view.recording.trace.rois) return;
    for (const roi of view.recording.trace.rois) {
      for (const indexVector of roi.vectors) {
        const timeIndex = Math.floor(indexVector[0] / stepSize);
        if (timeIndex >= 0 && timeIndex < timeTrace.length) {
          spikes.push({ value: timeTrace[timeIndex], label: roi.label || "No label" });
        }
      }
    }
  });

  return spikes;
};

// ─── uPlot series factories ───────────────────────────────────────────────────

export const createAxisStyle = (): uPlot.Axis => ({
  stroke: "hsl(var(--muted-foreground))",
  grid: { show: false },
  ticks: { stroke: "hsl(var(--border))" },
  font: "12px system-ui, sans-serif",
  labelFont: "12px system-ui, sans-serif",
  labelGap: 6,
  labelSize: 20,
});

export const createRecordingSeries = (
  label: string,
  color: string,
): uPlot.Series => ({
  label,
  stroke: color,
  width: 2,
  points: { show: false },
  value: (_self, rawValue) =>
    rawValue == null ? "" : Number(rawValue).toFixed(3),
});

export const createStimulusSeries = (
  label: string,
  color: string,
): uPlot.Series => ({
  label,
  stroke: color,
  width: 2,
  points: { show: false },
  paths: uPlot.paths.stepped?.({ align: 1 }),
  value: (_self, rawValue) =>
    rawValue == null ? "" : Number(rawValue).toFixed(3),
});

// ─── useElementSize hook ──────────────────────────────────────────────────────

export const useElementSize = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const nextWidth = Math.floor(entry.contentRect.width);
      const nextHeight = Math.floor(entry.contentRect.height);
      setSize((previous) => {
        if (previous.width === nextWidth && previous.height === nextHeight)
          return previous;
        return { width: nextWidth, height: nextHeight };
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
};

// ─── Label / colour helpers ───────────────────────────────────────────────────

export const recordingViewToLabel = (view: {
  id: string;
  recording: { label: string };
}) => `r:${view.recording.label}${view.id}`;

export const stimulusViewToLabel = (view: {
  id: string;
  stimulus: { label: string };
}) => `s:${view.stimulus.label}${view.id}`;

export const getColorForRecordingView = (
  view: { id: string },
  highlight?: string,
) => {
  if (highlight && highlight === view.id) {
    return "hsl(45, 70%, 60%)";
  }

  const hue = (parseInt(view.id) * 137.508) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

export const getColorForStimulusView = (
  view: { id: string },
  highlight?: string,
) => {
  if (highlight && highlight === view.id) {
    return "hsl(45, 70%, 60%)";
  }

  const hue = (parseInt(view.id) * 137.508) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};
