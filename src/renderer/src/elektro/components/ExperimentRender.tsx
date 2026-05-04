import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import uPlot from "uplot";
import UplotReact from "uplot-react";
import useUndoable from "use-undoable";
import {
  ExperimentFragment,
} from "../api/graphql";
import { useTraceArray } from "../lib/useTraceArray";
import {
  getColorForRecordingView,
  getColorForStimulusView,
  recordingViewToLabel,
  stimulusViewToLabel,
} from "./ExperimentRender.utils";
// @ts-expect-error Vite handles CSS side-effect imports for uPlot at runtime.
import "uplot/dist/uPlot.min.css";

const CHART_SYNC_KEY = "experiment-uplot-sync";

type HoverState = {
  time: number;
  values: { label: string; color: string; value: number | null }[];
} | null;

const useElementSize = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const nextWidth = Math.floor(entry.contentRect.width);
      const nextHeight = Math.floor(entry.contentRect.height);

      setSize((previous) => {
        if (
          previous.width === nextWidth &&
          previous.height === nextHeight
        ) {
          return previous;
        }

        return {
          width: nextWidth,
          height: nextHeight,
        };
      });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, size };
};

const buildAlignedData = (
  values: { [key: string]: number }[],
  keys: string[],
): uPlot.AlignedData => {
  const xValues = values.map((point, index) => point.t ?? index);

  return [
    xValues,
    ...keys.map((key) => values.map((point) => point[key] ?? null)),
  ];
};

const createAxisStyle = (): uPlot.Axis => ({
  stroke: "hsl(var(--muted-foreground))",
  grid: { show: false },
  ticks: { stroke: "hsl(var(--border))" },
  font: "12px system-ui, sans-serif",
});

const createRecordingSeries = (
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

const createStimulusSeries = (
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

const useHoverState = (
  values: { [key: string]: number }[],
  entries: { key: string; label: string; color: string }[],
) => {
  return useCallback(
    (index: number | null): HoverState => {
      if (index == null || index < 0 || index >= values.length) {
        return null;
      }

      const point = values[index];
      if (!point || point.t == null) {
        return null;
      }

      return {
        time: point.t,
        values: entries.map((entry) => ({
          label: entry.label,
          color: entry.color,
          value: point[entry.key] ?? null,
        })),
      };
    },
    [entries, values],
  );
};

const useValuesForExperiment = ({
  experiment,
  selectedRange,
}: {
  experiment: ExperimentFragment;
  selectedRange?: { left?: number | null; right?: number | null };
}) => {
  const { renderView } = useTraceArray();
  const [stepSize, setStepSize] = useState(1);

  const [range, setRange, { redo, undo, canRedo, canUndo }] = useUndoable<{
    left: number | null;
    right: number | null;
  }>({
    left: selectedRange?.left || 0,
    right: selectedRange?.right || null,
  });

  const [values, setValues] = useState<{ [key: string]: number }[]>([]);
  const [spikeTimes, setSpikeTimes] = useState<
    { value: number; label: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const reset = () => {
    setRange({
      left: selectedRange?.left || 0,
      right: selectedRange?.right || null,
    });
  };

  const zoomOnRange = async ({
    left,
    right,
  }: {
    left: number;
    right: number;
  }) => {
    // Ensure left is always smaller than right
    const start = Math.min(left, right);
    const end = Math.max(left, right);

    // Calculate global indices based on current view's start (range.left) and stepSize
    const actualLeft = start * stepSize + (range.left || 0);
    const actualRight = end * stepSize + (range.left || 0);

    setRange({ left: actualLeft, right: actualRight });
  };

  useEffect(() => {
    if (!experiment) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      let nextStepSize = Math.max(
        1,
        Math.round((experiment.timeTrace.store?.shape?.at(0) || 2000) / 2000),
      );

      if (range.left !== null || range.right !== null) {
        nextStepSize = Math.max(
          1,
          Math.round(
            ((range.right || experiment.timeTrace.store?.shape?.at(0) || 2000) -
              (range.left || 0)) / 2000,
          ),
        );
      }

      const data = await Promise.all([
        ...experiment.recordingViews.map((view) => {
          return renderView(
            view.recording.trace,
            nextStepSize,
            range.left,
            range.right,
          );
        }),
        ...experiment.stimulusViews.map((view) => {
          return renderView(
            view.stimulus.trace,
            nextStepSize,
            range.left,
            range.right,
          );
        }),
        renderView(experiment.timeTrace, nextStepSize, range.left, range.right),
      ]);

      if (cancelled) {
        return;
      }

      const values = data.map(() => ({}));

      experiment.recordingViews.forEach((view, recordIndex: number) => {
        const array = data[recordIndex];
        const recId = recordingViewToLabel(view);

        array.forEach((value, index) => {
          values[index] = {
            ...values[index],
            [recId]: value,
          };
        });
      });

      experiment.stimulusViews.forEach((view, stimulusIndex: number) => {
        const array = data[stimulusIndex + experiment.recordingViews.length];
        const stimulusId = stimulusViewToLabel(view);

        array.forEach((value, index) => {
          values[index] = {
            ...values[index],
            [stimulusId]: value,
          };
        });
      });

      const timeTrace = data[data.length - 1];
      timeTrace.forEach((value, index) => {
        values[index] = {
          ...values[index],
          t: value,
        };
      });

      const spikes: { value: number; label: string }[] = [];
      experiment.recordingViews.forEach((view) => {
        if (view.recording.trace.rois) {
          for (const roi of view.recording.trace.rois) {
            for (const idx of roi.vectors) {
              const timeIndex = Math.floor(idx[0] / (nextStepSize || 1));
              if (timeIndex >= 0) {
                spikes.push({
                  value: timeTrace[timeIndex],
                  label: roi.label || "No label",
                });
              }
            }
          }
        }
      });

      setStepSize(nextStepSize);
      setValues(values);
      setSpikeTimes(spikes);
      setLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [experiment, range, renderView]);

  return {
    values,
    loading,
    spikeTimes,
    setStepSize,
    stepSize,
    zoomOnRange,
    canRedo,
    canUndo,
    redo,
    undo,
    reset,
  };
};





export const ExperimentRender = (props: {
  experiment: ExperimentFragment;
  highlight?: string;
  hidden?: string[];
  hiddenStimuli?: string[];
}) => {
  const {
    loading,
    values,
    setStepSize,
    stepSize,
    zoomOnRange,
    canRedo,
    canUndo,
    redo,
    undo,
    reset,
  } = useValuesForExperiment({
    experiment: props.experiment,
    selectedRange: { left: 0, right: null },
  });

  const visibleRecordings = useMemo(() => {
    return props.experiment.recordingViews.filter(
      (view) => !props.hidden || !props.hidden.includes(view.id),
    );
  }, [props.experiment.recordingViews, props.hidden]);

  const visibleStimuli = useMemo(() => {
    return props.experiment.stimulusViews.filter(
      (view) => !props.hiddenStimuli || !props.hiddenStimuli?.includes(view.id),
    );
  }, [props.experiment.stimulusViews, props.hiddenStimuli]);

  const recordingEntries = useMemo(
    () =>
      visibleRecordings.map((view) => ({
        key: recordingViewToLabel(view),
        label: view.recording.label,
        color: getColorForRecordingView(view, props.highlight),
      })),
    [props.highlight, visibleRecordings],
  );

  const stimulusEntries = useMemo(
    () =>
      visibleStimuli.map((view) => ({
        key: stimulusViewToLabel(view),
        label: view.stimulus.label,
        color: getColorForStimulusView(view, props.highlight),
      })),
    [props.highlight, visibleStimuli],
  );

  const hoverForRecordings = useHoverState(values, recordingEntries);
  const hoverForStimuli = useHoverState(values, stimulusEntries);
  const [hover, setHover] = useState<HoverState>(null);

  const { ref: mainChartRef, size: mainChartSize } = useElementSize<HTMLDivElement>();
  const { ref: stimulusChartRef, size: stimulusChartSize } =
    useElementSize<HTMLDivElement>();

  const sharedAxes = useMemo(() => {
    const xAxis: uPlot.Axis = {
      ...createAxisStyle(),
      values: (_self, splits) =>
        splits.map((value) => Number(value).toFixed(1)),
    };

    const yAxis: uPlot.Axis = createAxisStyle();

    return { xAxis, yAxis };
  }, []);

  const handleSelection = useCallback(
    (chart: uPlot) => {
      if (chart.select.width <= 1) {
        return;
      }

      const leftIndex = chart.posToIdx(chart.select.left);
      const rightIndex = chart.posToIdx(chart.select.left + chart.select.width);

      if (Math.abs(leftIndex - rightIndex) > 1) {
        zoomOnRange({ left: leftIndex, right: rightIndex });
      }

      chart.setSelect({ left: 0, top: 0, width: 0, height: 0 }, false);
    },
    [zoomOnRange],
  );

  const mainData = useMemo(
    () => buildAlignedData(values, recordingEntries.map((entry) => entry.key)),
    [recordingEntries, values],
  );

  const stimulusData = useMemo(
    () => buildAlignedData(values, stimulusEntries.map((entry) => entry.key)),
    [stimulusEntries, values],
  );

  const mainOptions = useMemo<uPlot.Options | null>(() => {
    if (mainChartSize.width < 10 || mainChartSize.height < 10) {
      return null;
    }

    return {
      width: mainChartSize.width,
      height: mainChartSize.height,
      legend: { show: false },
      select: { show: true, over: true, left: 0, top: 0, width: 0, height: 0 },
      cursor: {
        drag: { x: true, y: false, setScale: false, dist: 4 },
        sync: { key: CHART_SYNC_KEY, setSeries: false, scales: ["x", null] },
        points: { show: false },
      },
      scales: {
        x: { time: false },
      },
      axes: [sharedAxes.xAxis, sharedAxes.yAxis],
      series: [
        { label: "Time" },
        ...recordingEntries.map((entry) =>
          createRecordingSeries(entry.label, entry.color),
        ),
      ],
      hooks: {
        setCursor: [
          (chart) => {
            setHover(hoverForRecordings(chart.cursor.idx ?? null));
          },
        ],
        setSelect: [handleSelection],
      },
    };
  }, [
    handleSelection,
    hoverForRecordings,
    mainChartSize.height,
    mainChartSize.width,
    recordingEntries,
    sharedAxes.xAxis,
    sharedAxes.yAxis,
  ]);

  const stimulusOptions = useMemo<uPlot.Options | null>(() => {
    if (stimulusChartSize.width < 10 || stimulusChartSize.height < 10) {
      return null;
    }

    return {
      width: stimulusChartSize.width,
      height: stimulusChartSize.height,
      legend: { show: false },
      select: { show: true, over: true, left: 0, top: 0, width: 0, height: 0 },
      cursor: {
        drag: { x: true, y: false, setScale: false, dist: 4 },
        sync: { key: CHART_SYNC_KEY, setSeries: false, scales: ["x", null] },
        points: { show: false },
      },
      scales: {
        x: { time: false },
      },
      axes: [sharedAxes.xAxis, sharedAxes.yAxis],
      series: [
        { label: "Time" },
        ...stimulusEntries.map((entry) =>
          createStimulusSeries(entry.label, entry.color),
        ),
      ],
      hooks: {
        setCursor: [
          (chart) => {
            setHover(hoverForStimuli(chart.cursor.idx ?? null));
          },
        ],
        setSelect: [handleSelection],
      },
    };
  }, [
    handleSelection,
    hoverForStimuli,
    sharedAxes.xAxis,
    sharedAxes.yAxis,
    stimulusChartSize.height,
    stimulusChartSize.width,
    stimulusEntries,
  ]);

  if (loading) {
    return (
      <div className="flex flex-col w-full max-h-[70vh] my-auto relative items-center justify-center">
        <div className="">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-[32rem] w-full flex-col gap-2 overflow-hidden">
      <div
        ref={mainChartRef}
        className="min-h-[18rem] flex-1 overflow-hidden rounded-md border border-border/50 bg-background text-xs [&_.u-axis]:text-muted-foreground [&_.u-grid]:border-border/50 [&_.u-over]:cursor-crosshair [&_.u-select]:border [&_.u-select]:border-amber-300/40 [&_.u-select]:bg-amber-300/20"
      >
        {mainOptions ? (
          <UplotReact options={mainOptions} data={mainData} />
        ) : null}
      </div>

      <div
        ref={stimulusChartRef}
        className="h-32 flex-none overflow-hidden rounded-md border border-border/50 bg-background text-xs [&_.u-axis]:text-muted-foreground [&_.u-grid]:border-border/50 [&_.u-over]:cursor-crosshair [&_.u-select]:border [&_.u-select]:border-amber-300/40 [&_.u-select]:bg-amber-300/20"
      >
        {stimulusOptions ? (
          <UplotReact options={stimulusOptions} data={stimulusData} />
        ) : null}
      </div>

      {hover ? (
        <div className="absolute left-2 top-2 z-10 min-w-[10rem] rounded-lg border border-border/50 bg-background/95 px-3 py-2 text-xs shadow-sm backdrop-blur-sm">
          <div className="font-medium">t: {hover.time.toFixed(3)}</div>
          <div className="mt-1 flex flex-col gap-1">
            {hover.values.map((entry) => (
              <div key={entry.label} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.label}
                </span>
                <span className="font-mono text-foreground tabular-nums">
                  {entry.value == null ? "-" : entry.value.toFixed(3)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="absolute top-0 right-0 mr-2 mt-2 flex gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            undo();
          }}
          disabled={!canUndo}
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            redo();
          }}
          disabled={!canRedo}
        >
          <ArrowRight />
        </Button>
        <Button onClick={() => reset()} variant="outline">
          <ReloadIcon />
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setStepSize(1);
          }}
        >
          Raw {stepSize}
        </Button>
      </div>
    </div>
  );
};
