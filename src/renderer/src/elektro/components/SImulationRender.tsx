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
  selectedRange,
}: {
  simulation: DetailSimulationFragment;
  selectedRange?: { left?: number | null; right?: number | null };
}) => {
  const { renderView } = useTraceArray();
  const [stepSize, setStepSize] = useState(
    1
  );

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
  }

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
    if (simulation) {

      let stepSize = Math.max(
        1,
        Math.round((simulation.timeTrace.store?.shape?.at(0) || 2000) / 2000),
      );

      if (range.left !== null || range.right !== null) {
        stepSize = Math.max(
          1,
          Math.round(
            ((range.right || simulation.timeTrace.store?.shape?.at(0) || 2000) -
              (range.left || 0)) / 2000,
          ),
        );
      }


      Promise.all([
        ...simulation.recordings.map((recording: RecordingFragment) => {
          return renderView(recording.trace, stepSize, range?.left, range?.right);
        }),
        ...simulation.stimuli.map((stimulus: StimulusFragment) => {
          return renderView(stimulus.trace, stepSize, range?.left, range?.right);
        }),
        renderView(simulation.timeTrace, stepSize, range?.left, range?.right),
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
        setStepSize(stepSize);
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
  }, [simulation, stepSize, range?.left, range?.right]);

  return { values, loading, spikeTimes, setStepSize, stepSize, zoomOnRange, canRedo, canUndo, redo, undo, reset };
};

export const SimulationRender = (props: {
  simulation: DetailSimulationFragment;
  highlight?: string[];
  hidden?: string[];
  hiddenStimuli?: string[];
}) => {
  const {
    loading,
    values,
    spikeTimes,
    setStepSize,
    stepSize,
    zoomOnRange,
    canRedo,
    canUndo,
    redo,
    undo,
    reset, // Now available
  } = useValuesForSimulation({
    simulation: props.simulation,
    selectedRange: { left: 0, right: null },
  });

  const [selection, setSelection] = useState<{
    left: number | null;
    right: number | null;
  }>({ left: null, right: null });
  const [selecting, setSelecting] = useState(false);

  // --- REMOVED THE BAD USEEFFECT HERE ---

  const handleMouseDown = useCallback(
    (e: CategoricalChartState) => {
      // Use activeTooltipIndex for O(1) exact index lookup
      if (e && e.activeTooltipIndex !== undefined) {
        setSelection({
          left: e.activeTooltipIndex,
          right: e.activeTooltipIndex, // Initialize right same as left
        });
        setSelecting(true);
      }
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: CategoricalChartState) => {
      if (selecting && e && e.activeTooltipIndex !== undefined) {
        setSelection((prev) => ({
          ...prev,
          right: e.activeTooltipIndex,
        }));
      }
    },
    [selecting]
  );

  const handleMouseUp = useCallback(
    () => {
      if (selecting && selection.left !== null && selection.right !== null) {
        // Only zoom if there is a meaningful difference
        if (Math.abs(selection.left - selection.right) > 1) {
          zoomOnRange({ left: selection.left, right: selection.right });
        }
      }
      setSelection({ left: null, right: null });
      setSelecting(false);
    },
    [selection, selecting, zoomOnRange]
  );

  const visibleRecordings = useMemo(() => {
    return props.simulation.recordings.filter(
      (view) => !props.hidden || !props.hidden.includes(view.id)
    );
  }, [props.simulation.recordings, props.hidden]);

  const visibleStimuli = useMemo(() => {
    return props.simulation.stimuli.filter(
      (view) => !props.hiddenStimuli || !props.hiddenStimuli?.includes(view.id)
    );
  }, [props.simulation.stimuli, props.hiddenStimuli]);


  return (
    <div className="flex flex-col relative h-full w-full" onMouseUp={handleMouseUp}>
      {/* Added global mouseUp to container to catch drags that end outside chart lines */}

      <ChartContainer config={chartConfig} className="h-[85%]">
        <LineChart
          data={values}
          margin={{ left: 10, right: 10 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          syncId="simulation-chart"
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="t"
            type="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => `${v.toFixed(1)}`}
            domain={['auto', 'auto']}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />

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

          {/* Render Selection Box */}
          {selection.left !== null && selection.right !== null && values[selection.left] && values[selection.right] && (
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
          syncId="simulation-chart"
        // Add handlers here too if you want the bottom chart to be selectable
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="t"
            type="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => `${v.toFixed(1)}`}
            domain={['auto', 'auto']}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />

          {/* Render Selection Box */}
          {selection.left !== null && selection.right !== null && values[selection.left] && values[selection.right] && (
            <ReferenceArea
              x1={values[selection.left].t}
              x2={values[selection.right].t}
              strokeOpacity={0.3}
              fill="hsl(45, 70%, 60%)"
              fillOpacity={0.2}
            />
          )}


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
