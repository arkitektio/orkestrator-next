import React, { useCallback, useEffect, useMemo, useRef } from "react";
import uPlot from "uplot";
import UplotReact from "uplot-react";
import {
  buildScaleRange,
  CHART_SYNC_KEY,
  clampIndex,
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
  const range = useExperimentViewerStore((s) => s.range);
  const overviewStepSize = useExperimentViewerStore((s) => s.overviewStepSize);

  const overviewChartInstanceRef = useRef<uPlot | null>(null);
  const { ref: chartRef, size: chartSize } = useElementSize<HTMLDivElement>();

  const visibleStimuli = useMemo(
    () =>
      experiment.stimulusViews.filter(
        (view) => !hiddenStimuli.includes(view.id),
      ),
    [experiment.stimulusViews, hiddenStimuli],
  );

  // Map each visible stimulus to its column index in overviewData
  // overviewData layout: [timeTrace, stim0, stim1, ...] (all stimuli, in order)
  const stimulusEntries = useMemo(
    () =>
      visibleStimuli.map((view) => ({
        // +1 because overviewData[0] is the time trace
        colIndex: experiment.stimulusViews.indexOf(view) + 1,
        label: view.stimulus.label,
        color: getColorForStimulusView(view, highlight),
      })),
    [experiment.stimulusViews, highlight, visibleStimuli],
  );

  // Assemble only visible columns in uPlot order: [time, visibleStim0, ...]
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

  const axes = useMemo(() => {
    const xAxis: uPlot.Axis = {
      ...createAxisStyle(),
      label: "Time (s)",
      values: (_self, splits) =>
        splits.map((value) => Number(value).toFixed(1)),
    };
    const yAxis: uPlot.Axis = {
      ...createAxisStyle(),
      label: "Stimulus value",
    };
    return { xAxis, yAxis };
  }, []);

  const clearChartSelection = useCallback((chart: uPlot) => {
    chart.setSelect({ left: 0, top: 0, width: 0, height: 0 }, false);
  }, []);

  const handleSelection = useCallback(
    (chart: uPlot) => {
      if (chart.select.width <= 1) return;

      const leftIndex = chart.posToIdx(chart.select.left);
      const rightIndex = chart.posToIdx(
        chart.select.left + chart.select.width,
      );

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
          // stimulusData[0] = time, stimulusData[i+1] = series i
          value: (stimulusData[i + 1] as number[])?.[idx] ?? null,
        })),
      });
    },
    [overviewData, stimulusData, stimulusEntries, store],
  );

  // Draw brush selection on overview chart when range changes
  useEffect(() => {
    const chart = overviewChartInstanceRef.current;
    const xValues = overviewData[0];
    if (!chart || !xValues || xValues.length === 0) return;

    if (range.right == null) {
      clearChartSelection(chart);
      return;
    }

    const leftIndex = clampIndex(
      Math.floor((range.left ?? 0) / overviewStepSize),
      xValues.length,
    );
    const rightIndex = clampIndex(
      Math.ceil(range.right / overviewStepSize),
      xValues.length,
    );
    const leftValue = xValues[leftIndex];
    const rightValue = xValues[rightIndex] ?? xValues[leftIndex];
    const leftPosition = chart.valToPos(leftValue, "x");
    const rightPosition = chart.valToPos(rightValue, "x");

    chart.setSelect(
      {
        left: Math.min(leftPosition, rightPosition),
        top: 0,
        width: Math.abs(rightPosition - leftPosition),
        height: chartSize.height,
      },
      false,
    );
  }, [clearChartSelection, overviewData, overviewStepSize, range, chartSize.height]);

  const stimulusOptions = useMemo<uPlot.Options | null>(() => {
    if (chartSize.width < 10 || chartSize.height < 10) return null;

    return {
      width: chartSize.width,
      height: chartSize.height,
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
      axes: [axes.xAxis, axes.yAxis],
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
    axes.xAxis,
    axes.yAxis,
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
      className="relative h-32 flex-none overflow-hidden rounded-md border border-border/50 bg-background text-xs [&_.u-axis]:text-muted-foreground [&_.u-grid]:border-border/50 [&_.u-over]:cursor-crosshair [&_.u-select]:border [&_.u-select]:border-amber-300/40 [&_.u-select]:bg-amber-300/20"
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

