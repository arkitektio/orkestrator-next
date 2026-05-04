import React, { useCallback, useMemo, useRef } from "react";
import uPlot from "uplot";
import UplotReact from "uplot-react";
import {
  buildScaleRange,
  CHART_SYNC_KEY,
  createAxisStyle,
  createStimulusSeries,
  getColorForStimulusView,
  useElementSize,
} from "./ExperimentRender.utils";
import {
  useExperimentViewerStore,
  useExperimentViewerStoreApi,
} from "./store/experimentViewerStore";

export const ExperimentOverviewChart: React.FC = () => {
  const store = useExperimentViewerStoreApi();

  const experiment = useExperimentViewerStore((s) => s.experiment);
  const hiddenStimuli = useExperimentViewerStore((s) => s.hiddenStimuli);
  const highlight = useExperimentViewerStore((s) => s.highlight);
  const overviewData = useExperimentViewerStore((s) => s.overviewData);
  const overviewLoading = useExperimentViewerStore((s) => s.overviewLoading);

  const overviewChartInstanceRef = useRef<uPlot | null>(null);
  const { ref: chartRef, size: chartSize } = useElementSize<HTMLDivElement>();

  const visibleStimuli = useMemo(
    () =>
      experiment.stimulusViews.filter(
        (view) => !hiddenStimuli.includes(view.id),
      ),
    [experiment.stimulusViews, hiddenStimuli],
  );

  // overviewData layout: [timeTrace, stim0, stim1, ...] (all stimuli, in order)
  const stimulusEntries = useMemo(
    () =>
      visibleStimuli.map((view) => ({
        colIndex: experiment.stimulusViews.indexOf(view) + 1,
        label: view.stimulus.label,
        color: getColorForStimulusView(view, highlight),
      })),
    [experiment.stimulusViews, highlight, visibleStimuli],
  );

  // [time, visibleStim0, ...]
  const stimulusData = useMemo<uPlot.AlignedData>(() => {
    const timeCol = overviewData[0] ?? [];
    const yCols = stimulusEntries.map(
      (e) => (overviewData[e.colIndex] ?? []) as number[],
    );
    return [timeCol, ...yCols] as uPlot.AlignedData;
  }, [overviewData, stimulusEntries]);

  const stimulusYRange = useMemo(
    () =>
      buildScaleRange(
        stimulusEntries.map((e) => overviewData[e.colIndex] ?? []),
        0.05,
      ),
    [overviewData, stimulusEntries],
  );

  const clearChartSelection = useCallback((chart: uPlot) => {
    chart.setSelect({ left: 0, top: 0, width: 0, height: 0 }, false);
  }, []);

  const handleSelection = useCallback(
    (chart: uPlot) => {
      if (chart.select.width <= 1) return;
      const leftIndex = chart.posToIdx(chart.select.left);
      const rightIndex = chart.posToIdx(chart.select.left + chart.select.width);
      if (Math.abs(leftIndex - rightIndex) > 1) {
        store.getState().zoomOnRange({
          left: leftIndex,
          right: rightIndex,
          baseOffset: 0,
          sourceStepSize: store.getState().overviewStepSize,
        });
      }
      clearChartSelection(chart);
    },
    [clearChartSelection, store],
  );

  const onCursorMove = useCallback(
    (chart: uPlot) => {
      const idx = chart.cursor.idx ?? null;
      const timeTrace = overviewData[0];
      if (idx == null || !timeTrace || idx >= timeTrace.length) {
        store.getState().setHover(null);
        return;
      }
      const timeVal = timeTrace[idx];
      if (timeVal == null) {
        store.getState().setHover(null);
        return;
      }
      store.getState().setHover({
        time: timeVal,
        values: stimulusEntries.map((entry, i) => ({
          label: entry.label,
          color: entry.color,
          value: (stimulusData[i + 1] as number[])?.[idx] ?? null,
        })),
      });
    },
    [overviewData, stimulusData, stimulusEntries, store],
  );

  // Rebuild options (and re-resolve CSS vars) whenever size or series change
  const stimulusOptions = useMemo<uPlot.Options | null>(() => {
    if (chartSize.width < 10 || chartSize.height < 10) return null;

    const xAxis: uPlot.Axis = {
      ...createAxisStyle(),
      label: "Time (s)",
      values: (_self, splits) =>
        splits.map((value) => Number(value).toFixed(2)),
    };
    const yAxis: uPlot.Axis = {
      ...createAxisStyle(),
      label: "Stimulus value",
    };

    return {
      width: chartSize.width,
      height: chartSize.height,
      padding: [8, 10, 0, 0],
      legend: { show: false },
      select: {
        show: true,
        over: true,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      },
      cursor: {
        drag: { x: true, y: false, setScale: false, dist: 4 },
        sync: { key: CHART_SYNC_KEY, setSeries: false, scales: ["x", null] },
        points: { show: false },
      },
      scales: {
        x: { time: false },
        y: { range: stimulusYRange as [number, number] },
      },
      axes: [xAxis, yAxis],
      series: [
        { label: "Time" },
        ...stimulusEntries.map((entry) =>
          createStimulusSeries(entry.label, entry.color),
        ),
      ],
      hooks: {
        setCursor: [onCursorMove],
        setSelect: [handleSelection],
      },
    };
  }, [
    chartSize.height,
    chartSize.width,
    handleSelection,
    onCursorMove,
    stimulusEntries,
    stimulusYRange,
  ]);

  return (
    <div
      ref={chartRef}
      className="relative h-32 flex-none overflow-hidden rounded-md border border-border/50 bg-background text-xs [&_.u-over]:cursor-crosshair [&_.u-select]:border [&_.u-select]:border-amber-300/40 [&_.u-select]:bg-amber-300/20"
    >
      {overviewLoading ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
          <span className="text-xs text-muted-foreground">Loading...</span>
        </div>
      ) : null}
      {stimulusOptions ? (
        <div className="absolute inset-0 overflow-hidden">
          <UplotReact
            options={stimulusOptions}
            data={stimulusData}
            onCreate={(chart) => {
              overviewChartInstanceRef.current = chart;
            }}
            onDelete={() => {
              overviewChartInstanceRef.current = null;
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
