import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { CategoricalChartState } from "recharts/types/chart/types";
import useUndoable from "use-undoable";
import {
  DetailSimulationFragment,
  ListRecordingFragment,
  ListStimulusFragment,
  RecordingFragment,
  StimulusFragment,
} from "../api/graphql";
import { useTraceArray } from "../lib/useTraceArray";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const getColorForRecording = (
  recording: ListRecordingFragment,
  highlight?: string[],
) => {
  const hue =
    highlight == undefined
      ? (parseInt(recording.id) * 137.508) % 360
      : highlight.includes(recording.id)
        ? 0
        : (parseInt(recording.id) * 137.508) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

export const getColorForStimulus = (
  stimulus: ListStimulusFragment,
  highlight?: string[],
) => {
  const hue =
    highlight == undefined
      ? (parseInt(stimulus.id) * 37.508) % 360
      : highlight.includes(stimulus.id)
        ? 0
        : (parseInt(stimulus.id) * 137.508) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

export const recordingToID = (rec: RecordingFragment) => `r:${rec.label}`;
export const stimulusToID = (s: StimulusFragment) => `s:${s.label}`;

export const recordingToLabel = (rec: RecordingFragment) => rec.label;
export const stimulusToLabel = (rec: StimulusFragment) => rec.label;

const useValuesForSimulation = ({
  simulation,
}: {
  simulation: DetailSimulationFragment;
}) => {
  const { renderView } = useTraceArray();
  const [stepSize, setStepSize] = useState(
    Math.max(
      1,
      Math.round((simulation.timeTrace.store?.shape?.at(0) || 2000) / 2000),
    ),
  );

  const [values, setValues] = useState<{ [key: string]: number }[]>([]);
  const [spikeTimes, setSpikeTimes] = useState<
    { value: number; label: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const render = async () => {
    if (simulation) {
      console.log(
        "Step size",
        stepSize,
        simulation.timeTrace.store?.shape?.at(0),
      );

      Promise.all([
        ...simulation.recordings.map((recording: RecordingFragment) => {
          return renderView(recording.trace, stepSize);
        }),
        ...simulation.stimuli.map((stimulus: StimulusFragment) => {
          return renderView(stimulus.trace, stepSize);
        }),
        renderView(simulation.timeTrace, stepSize),
      ]).then((data) => {
        const values = data.map((x) => ({}));

        simulation.recordings.forEach(
          (recording: RecordingFragment, recordIndex: number) => {
            const array = data[recordIndex];

            const recId = recordingToID(recording);

            array.forEach((value, index) => {
              values[index] = {
                ...values[index],
                [recId]: value,
              };
            });
          },
        );

        simulation.stimuli.forEach(
          (stimulus: StimulusFragment, stimIndex: number) => {
            const array = data[stimIndex + simulation.recordings.length];

            const recId = stimulusToID(stimulus);

            array.forEach((value, index) => {
              values[index] = {
                ...values[index],
                [recId]: value,
              };
            });
          },
        );

        const timeTrace = data[data.length - 1];
        timeTrace.forEach((value, index) => {
          values[index] = {
            ...values[index],
            ["t"]: value,
          };
        });

        // Extract spikes
        const spikes: { value: number; label: string }[] = [];
        simulation.recordings.forEach((recording, recordIndex) => {
          if (recording.trace.rois) {
            for (const roi of recording.trace.rois) {
              for (const idx of roi.vectors) {
                let idt = Math.floor(idx[0] / (stepSize || 1));
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

        console.log("Spikes", spikes);

        setValues(values);
        setSpikeTimes(spikes);
        setLoading(false);
        setValues(values);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    if (simulation) {
      render();
    }
  }, [simulation, stepSize]);

  return { values, loading, spikeTimes, setStepSize, stepSize };
};

export const SimulationRender = (props: {
  simulation: DetailSimulationFragment;
  highlight?: string[];
  hidden?: string[];
  hiddenStimuli?: string[];
}) => {
  const { loading, values, spikeTimes, setStepSize, stepSize } =
    useValuesForSimulation({
      simulation: props.simulation,
    });
  const [range, setRange, { redo, undo, canRedo, canUndo }] = useUndoable<{
    left: number;
    right: number;
  }>({
    left: 0,
    right: values.length - 1,
  });

  const [selection, setSelection] = useState<{
    left: number | null;
    right: number | null;
  }>({ left: null, right: null });
  const [selecting, setSelecting] = useState(false);

  const reset = useCallback(() => {
    setRange({ left: 0, right: values.length - 1 });
  }, [values]);

  useEffect(() => {
    if (values.length > 0) {
      setRange({ left: 0, right: values.length - 1 }, undefined, true);
    }
  }, [values]);

  const handleMouseDown = useCallback(
    (e: CategoricalChartState, event) => {
      if (e.activeLabel) {
        setSelection({
          left: values.findIndex(
            (d) => d.t === (e.activeLabel as unknown as number),
          ),
          right: null,
        });
        setSelecting(true);
      }
      event.preventDefault();
      event.stopPropagation();
    },
    [values],
  );

  const handleMouseMove = useCallback(
    (e: CategoricalChartState, event) => {
      if (selecting && e.activeLabel) {
        setSelection((prev) => ({
          ...prev,
          right: values.findIndex(
            (d) => d.t === (e.activeLabel as unknown as number),
          ),
        }));
      }
      event.preventDefault();
      event.stopPropagation();
    },
    [selecting, values],
  );

  const handleMouseUp = useCallback(
    (e: CategoricalChartState, event) => {
      if (selection.left !== null && selection.right !== null) {
        const [tempLeft, tempRight] = [selection.left, selection.right].sort(
          (a, b) => a - b,
        );
        setRange({ left: tempLeft, right: tempRight });
      }
      setSelection({ left: null, right: null });
      setSelecting(false);
      event.preventDefault();
      event.stopPropagation();
    },
    [selection],
  );

  const filteredValues = useMemo(() => {
    return values;
  }, [values]);

  const visibleRecordings = useMemo(() => {
    return props.simulation.recordings.filter(
      (view) => !props.hidden || !props.hidden.includes(view.id),
    );
  }, [props.simulation.recordings, props.hidden]);

  const visibleStimuli = useMemo(() => {
    return props.simulation.stimuli.filter(
      (view) => !props.hiddenStimuli || !props.hiddenStimuli?.includes(view.id),
    );
  }, [props.simulation.stimuli, props.hiddenStimuli]);

  const spikeLines = useMemo(() => {
    return spikeTimes.map((spikeTime, index) => (
      <ReferenceLine
        key={`spike-${index}`}
        x={spikeTime.value}
        stroke="green"
        strokeDasharray="3 3"
        strokeOpacity={0.6}
        label={spikeTime.label}
      />
    ));
  }, [spikeTimes]);

  if (loading) {
    return (
      <div className="flex flex-col w-full">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Loading simulation data</CardDescription>
        </CardHeader>
      </div>
    );
  }

  return (
    <div className="flex flex-col  relative">
      <ChartContainer config={chartConfig} className="flex-grow">
        {/* Chart 1: Recordings */}
        <LineChart
          data={filteredValues}
          margin={{ left: 10, right: 10 }}

          syncId="simulation-chart"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="t"
            type="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => `${v.toFixed(1)}`}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />

          {/* Recording traces */}
          {visibleRecordings.map((rec) => (
            <Line
              key={recordingToID(rec)}
              dataKey={recordingToID(rec)}
              type="linear"
              stroke={getColorForRecording(rec, props.highlight)}
              fillOpacity={0.4}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}

          {/* Spike times */}
          {spikeLines}

          <ReferenceLine
            key={`spike0`}
            x1={1500}
            stroke="hsl(45, 70%, 60%)"
            strokeOpacity={0.6}
            strokeWidth={89}
          />

          {/* Selection highlight */}
          {selection.left !== null && selection.right !== null && (
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
            travellerStroke="#181212"
            travellerFill="#181212"
            startIndex={range.left}
            endIndex={range.right}
            onChange={(e) =>
              setRange({
                left: e?.startIndex ?? 0,
                right: e?.endIndex ?? values.length - 1,
              })
            }
          />
        </LineChart>
      </ChartContainer>
      <ChartContainer config={chartConfig} className="h-12 flex-initial ">
        {/* Chart 2: Stimuli (e.g. current injections) */}
        <LineChart
          data={filteredValues}
          height={100}
          margin={{ left: 12, right: 12 }}
          syncId="simulation-chart"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="t"
            type="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => `${v.toFixed(1)}`}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />

          {/* Stimuli traces */}
          {visibleStimuli.map((s) => (
            <Line
              key={stimulusToID(s)}
              dataKey={stimulusToID(s)}
              type="stepAfter"
              stroke={getColorForStimulus(s, props.highlight)}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}

          {/* Brush for zooming */}
          <Brush
            dataKey="t"
            height={30}
            stroke="#1b1b25"
            fill="transparent"
            travellerWidth={5}
            travellerStroke="#181212"
            travellerFill="#181212"
            startIndex={range.left}
            endIndex={range.right}
            onChange={(e) =>
              setRange({
                left: e?.startIndex ?? 0,
                right: e?.endIndex ?? values.length - 1,
              })
            }
          />
          {/* Selection highlight */}
          {selection.left !== null && selection.right !== null && (
            <ReferenceArea
              x1={values[selection.left].t}
              x2={values[selection.right].t}
              strokeOpacity={0.3}
              fill="hsl(45, 70%, 60%)"
              fillOpacity={0.2}
            />
          )}
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
