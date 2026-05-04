import { useTraceArray } from "@/elektro/lib/useTraceArray";
import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import { ExperimentFragment } from "../api/graphql";
import {
  areRangesEqual,
  buildDetailData,
  buildOverviewData,
  buildSpikeTimes,
  getStepSizeForRange,
  getTraceLength,
  normalizeRange,
} from "./ExperimentRender.utils";
import {
  createExperimentViewerStore,
  DEFAULT_RANGE,
  ExperimentViewerStoreContext,
  RangeSelection,
  useExperimentViewerStore,
  useExperimentViewerStoreApi,
} from "./store/experimentViewerStore";

// ─── Data loader (null-render) ────────────────────────────────────────────────

const ExperimentDataLoader: React.FC = () => {
  const { renderView } = useTraceArray();
  const store = useExperimentViewerStoreApi();
  const experiment = useExperimentViewerStore((s) => s.experiment);
  const range = useExperimentViewerStore((s) => s.range);
  const forcedStepSize = useExperimentViewerStore((s) => s.forcedStepSize);

  // Load overview data (full trace, downsampled)
  useEffect(() => {
    if (!experiment) return;
    let cancelled = false;
    store.getState().setOverviewLoading(true);

    const load = async () => {
      try {
        const totalLength = getTraceLength(experiment);
        const nextStepSize = getStepSizeForRange(totalLength, DEFAULT_RANGE);

        const data = await Promise.all([
          ...experiment.recordingViews.map((view) =>
            renderView(
              view.recording.trace,
              nextStepSize,
              DEFAULT_RANGE.left,
              DEFAULT_RANGE.right,
            ),
          ),
          ...experiment.stimulusViews.map((view) =>
            renderView(
              view.stimulus.trace,
              nextStepSize,
              DEFAULT_RANGE.left,
              DEFAULT_RANGE.right,
            ),
          ),
          renderView(
            experiment.timeTrace,
            nextStepSize,
            DEFAULT_RANGE.left,
            DEFAULT_RANGE.right,
          ),
        ]);

        if (cancelled) return;

        const overviewData = buildOverviewData(experiment, data);
        store.getState().setOverviewData(overviewData, nextStepSize);
      } finally {
        if (!cancelled) store.getState().setOverviewLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [experiment, renderView, store]);

  // Load detail data (zoomed range)
  useEffect(() => {
    if (!experiment) return;
    let cancelled = false;
    store.getState().setDetailLoading(true);

    const load = async () => {
      try {
        const totalLength = getTraceLength(experiment);
        const nextStepSize = getStepSizeForRange(
          totalLength,
          range,
          forcedStepSize,
        );

        const rawArrays = await Promise.all([
          ...experiment.recordingViews.map((view) =>
            renderView(
              view.recording.trace,
              nextStepSize,
              range.left,
              range.right,
            ),
          ),
          ...experiment.stimulusViews.map((view) =>
            renderView(
              view.stimulus.trace,
              nextStepSize,
              range.left,
              range.right,
            ),
          ),
          renderView(
            experiment.timeTrace,
            nextStepSize,
            range.left,
            range.right,
          ),
        ]);

        if (cancelled) return;

        const { data, timeTrace } = buildDetailData(experiment, rawArrays);
        const spikes = buildSpikeTimes(
          experiment,
          timeTrace,
          nextStepSize,
        );

        store.getState().setDetailData(data, nextStepSize);
        store.getState().setSpikeTimes(spikes);
      } finally {
        if (!cancelled) store.getState().setDetailLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [experiment, forcedStepSize, range, renderView, store]);

  return null;
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export type ExperimentRenderProviderProps = {
  experiment: ExperimentFragment;
  highlight?: string;
  hidden?: string[];
  hiddenStimuli?: string[];
  selectedRange?: RangeSelection;
  onSelectedRangeChange?: (range: RangeSelection) => void;
  children: ReactNode;
};

export const ExperimentRenderProvider: React.FC<
  ExperimentRenderProviderProps
> = ({
  experiment,
  hidden = [],
  hiddenStimuli = [],
  highlight,
  selectedRange,
  onSelectedRangeChange,
  children,
}) => {
  const store = useMemo(
    () =>
      createExperimentViewerStore({
        experiment,
        hidden,
        hiddenStimuli,
        highlight,
        initialRange: normalizeRange(selectedRange),
      }),
    // Re-create only if the experiment identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [experiment],
  );

  // Sync prop changes that don't warrant a store recreation
  useEffect(() => {
    store.setState({ hidden });
  }, [hidden, store]);

  useEffect(() => {
    store.setState({ hiddenStimuli });
  }, [hiddenStimuli, store]);

  useEffect(() => {
    store.setState({ highlight });
  }, [highlight, store]);

  // Sync external selectedRange → store (without adding to history)
  const syncingExternalRef = useRef(false);
  useEffect(() => {
    const normalized = normalizeRange(selectedRange);
    const current = store.getState().range;
    if (!areRangesEqual(normalized, current)) {
      syncingExternalRef.current = true;
      store.getState().setRangeExternal(normalized);
    }
  }, [selectedRange, store]);

  // Sync store range → onSelectedRangeChange
  useEffect(() => {
    const unsubscribe = store.subscribe((state, prevState) => {
      if (state.range === prevState.range) return;
      if (syncingExternalRef.current) {
        syncingExternalRef.current = false;
        return;
      }
      const normalized = normalizeRange(selectedRange);
      if (!areRangesEqual(state.range, normalized)) {
        onSelectedRangeChange?.(state.range);
      }
    });
    return unsubscribe;
  }, [onSelectedRangeChange, selectedRange, store]);

  return (
    <ExperimentViewerStoreContext.Provider value={store}>
      <ExperimentDataLoader />
      {children}
    </ExperimentViewerStoreContext.Provider>
  );
};
