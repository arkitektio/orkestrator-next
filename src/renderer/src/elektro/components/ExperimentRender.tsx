import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Brush,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  XAxis,
  YAxis,
} from "recharts";
import { CategoricalChartState } from "recharts/types/chart/types";
import useUndoable from "use-undoable";
import {
  ExperimentFragment,
} from "../api/graphql";
import { useTraceArray } from "../lib/useTraceArray";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

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

  const render = async () => {
    if (experiment) {
      let stepSize = Math.max(
        1,
        Math.round((experiment.timeTrace.store?.shape?.at(0) || 2000) / 2000),
      );

      if (range.left !== null || range.right !== null) {
        stepSize = Math.max(
          1,
          Math.round(
            ((range.right || experiment.timeTrace.store?.shape?.at(0) || 2000) -
              (range.left || 0)) / 2000,
          ),
        );
      }

      Promise.all([
        ...experiment.recordingViews.map((view) => {
          return renderView(
            view.recording.trace,
            stepSize,
            range?.left,
            range?.right,
          );
        }),
        ...experiment.stimulusViews.map((view) => {
          return renderView(
            view.stimulus.trace,
            stepSize,
            range?.left,
            range?.right,
          );
        }),
        renderView(experiment.timeTrace, stepSize, range?.left, range?.right),
      ]).then((data) => {
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

        experiment.stimulusViews.forEach((view, sIndex: number) => {
          const array = data[sIndex + experiment.recordingViews.length];
          const stimId = stimulusViewToLabel(view);

          array.forEach((value, index) => {
            values[index] = {
              ...values[index],
              [stimId]: value,
            };
          });
        });

        const timeTrace = data[data.length - 1];
        timeTrace.forEach((value, index) => {
          values[index] = {
            ...values[index],
            ["t"]: value,
          };
        });

        // Extract spikes
        const spikes: { value: number; label: string }[] = [];
        experiment.recordingViews.forEach((view) => {
          if (view.recording.trace.rois) {
            for (const roi of view.recording.trace.rois) {
              for (const idx of roi.vectors) {
                const idt = Math.floor(idx[0] / (stepSize || 1));
                if (idt >= 0) {
                  spikes.push({
                    value: timeTrace[idt],
                    label: roi.label || "No label",
                  });
                }
              }
            }
          }
        });

        setStepSize(stepSize);
        setValues(values);
        setSpikeTimes(spikes);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    if (experiment) {
      render();
    }
  }, [experiment, stepSize, range?.left, range?.right]);

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

  const [selection, setSelection] = useState<{
    left: number | null;
    right: number | null;
  }>({ left: null, right: null });
  const [selecting, setSelecting] = useState(false);

  const handleMouseDown = useCallback((e: CategoricalChartState) => {
    if (e && e.activeTooltipIndex !== undefined) {
      setSelection({
        left: e.activeTooltipIndex,
        right: e.activeTooltipIndex,
      });
      setSelecting(true);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: CategoricalChartState) => {
      if (selecting && e && e.activeTooltipIndex !== undefined) {
        setSelection((prev) => ({
          ...prev,
          right: e.activeTooltipIndex ?? null,
        }));
      }
    },
    [selecting],
  );

  const handleMouseUp = useCallback(() => {
    if (selecting && selection.left !== null && selection.right !== null) {
      if (Math.abs(selection.left - selection.right) > 1) {
        zoomOnRange({ left: selection.left, right: selection.right });
      }
    }
    setSelection({ left: null, right: null });
    setSelecting(false);
  }, [selection, selecting, zoomOnRange]);

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

  if (loading) {
    return (
      <div className="flex flex-col w-full max-h-[70vh] my-auto relative items-center justify-center">
        <div className="">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col relative h-full w-full"
      onMouseUp={handleMouseUp}
    >
      <ChartContainer config={chartConfig} className="h-[85%]">
        <LineChart
          data={values}
          margin={{ left: 10, right: 10 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          syncId="experiment-chart"
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="t"
            type="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => `${v.toFixed(1)}`}
            domain={["auto", "auto"]}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />

          {visibleRecordings.map((view) => (
            <Line
              key={recordingViewToLabel(view)}
              dataKey={recordingViewToLabel(view)}
              type="linear"
              stroke={getColorForRecordingView(view, props.highlight)}
              fillOpacity={0.4}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}

          {selection.left !== null &&
            selection.right !== null &&
            values[selection.left] &&
            values[selection.right] && (
              <ReferenceArea
                x1={values[selection.left].t}
                x2={values[selection.right].t}
                strokeOpacity={0.3}
                fill="hsl(45, 70%, 60%)"
                fillOpacity={0.2}
              />
            )}

          <Brush
            dataKey="t"
            height={0}
            stroke="#1b1b25"
            fill="transparent"
            travellerWidth={5}
          />
        </LineChart>
      </ChartContainer>

      <ChartContainer config={chartConfig} className="h-[15%] flex-initial">
        <LineChart
          data={values}
          height={100}
          margin={{ left: 12, right: 12 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          syncId="experiment-chart"
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="t"
            type="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => `${v.toFixed(1)}`}
            domain={["auto", "auto"]}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />

          {selection.left !== null &&
            selection.right !== null &&
            values[selection.left] &&
            values[selection.right] && (
              <ReferenceArea
                x1={values[selection.left].t}
                x2={values[selection.right].t}
                strokeOpacity={0.3}
                fill="hsl(45, 70%, 60%)"
                fillOpacity={0.2}
              />
            )}

          {visibleStimuli.map((view) => (
            <Line
              key={stimulusViewToLabel(view)}
              dataKey={stimulusViewToLabel(view)}
              type="stepAfter"
              stroke={getColorForStimulusView(view, props.highlight)}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ChartContainer>

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
