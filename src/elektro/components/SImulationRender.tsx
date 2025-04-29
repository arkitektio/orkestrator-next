import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DetailSimulationFragment, DetailTraceFragment, RecordingFragment, RecordingKind, StimulusFragment } from "../api/graphql";
import { Plot, useTraceArray } from "../lib/useTraceArray";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Car, TrendingUp } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, CartesianGrid, XAxis, AreaChart, LineChart, Line, ReferenceLine, Brush, ReferenceArea } from "recharts";
import { cn } from "@/lib/utils";
import { ElektroRecording } from "@/linkers";
import { CategoricalChartState } from "recharts/types/chart/types";
import { Button } from "@/components/ui/button";
import useUndoable from "use-undoable";
import { ReloadIcon } from "@radix-ui/react-icons";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const getColorForRecording = (recording: RecordingFragment, highlight?: string[]) => {
  const hue = highlight == undefined ? (parseInt(recording.id) * 137.508) % 360 : (highlight.includes(recording.id) ? 0 : (parseInt(recording.id) * 137.508) % 360);
  return `hsl(${hue}, 70%, 60%)`;
}

export const getColorForStimulus= (stimulus: StimulusFragment, highlight?: string[]) => {
  const hue = highlight == undefined ? (parseInt(stimulus.id) * 137.508) % 360 : (highlight.includes(stimulus.id) ? 0 : (parseInt(stimulus.id) * 137.508) % 360);
  return `hsl(${hue}, 70%, 60%)`;
}


const recordingToLabel = (rec: RecordingFragment) => rec.label 
const stimulusToLabel = (rec: StimulusFragment) => rec.label 

const useValuesForSimulation = (
  simulation: DetailSimulationFragment
): {
  values: { [key: string]: number }[];
  loading: boolean;
  spikeTimes: number[];
} => {
  const { renderView } = useTraceArray();
  const [values, setValues] = useState<{ [key: string]: number }[]>([]);
  const [spikeTimes, setSpikeTimes] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  

  const render = async () => {
    if (simulation) {
      Promise.all(
        [...simulation.recordings.map((recording: RecordingFragment) => {
          return renderView(recording.trace, 0);
        }),...simulation.stimuli.map((stimulus: RecordingFragment) => {
          return renderView(stimulus.trace, 0);
        }), renderView(simulation.timeTrace, 0)]
      ).then((data) => {

        

        const values = data.map((x) => ({})) ;

        simulation.recordings.forEach((recording: RecordingFragment, recordIndex: number) => {
          const array = data[recordIndex];

          array.forEach((value, index) => {
            values[index] = {
              ...values[index],
              [recording.label]: value,
            };
          }
          );
        });

        simulation.recordings.forEach((recording: RecordingFragment, recordIndex: number) => {
          const array = data[recordIndex];

          array.forEach((value, index) => {
            values[index] = {
              ...values[index],
              [recording.label]: value,
            };
          }
          );
        });

        simulation.stimuli.forEach((stimulus: StimulusFragment, stimIndex: number) => {
          const array = data[stimIndex + simulation.recordings.length];

          array.forEach((value, index) => {
            values[index] = {
              ...values[index],
              [stimulus.label]: value,
            };
          }
          );
        });


        const timeTrace = data[data.length - 1];
        timeTrace.forEach((value, index) => {
          values[index] = {
            ...values[index],
            ["t"]: value,
          };
        });

          // Extract spikes
        const spikes: number[] = [];
        simulation.recordings.forEach((recording, recordIndex) => {
          if (recording.trace.rois) {
            for (const roi of recording.trace.rois) {
              for (const idx of roi.vectors) {
                let idt = idx[0];
                if (idt >= 0 && idt < timeTrace.length) {
                  spikes.push(timeTrace[idt]);
                }
              }
            }
          }
        });

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
  }, [simulation]);

  return { values, loading, spikeTimes};
}


export const SimulationRender = (props: { simulation: DetailSimulationFragment, highlight?: string[] }) => {
  const { loading, values, spikeTimes } = useValuesForSimulation(props.simulation);
  const [hidden, setHidden] = useState<string[]>([]);
  const [range, setRange, { redo, undo, canRedo, canUndo }] =
    useUndoable<{ left: number; right: number }>({
      left: 0,
      right: values.length - 1,
    });

  const [selection, setSelection] = useState<{ left: number | null; right: number | null }>({ left: null, right: null });
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
          left: values.findIndex((d) => d.t === (e.activeLabel as unknown as number)),
          right: null,
        });
        setSelecting(true);
      }
      event.preventDefault();
      event.stopPropagation();
    },
    [values]
  );

  const handleMouseMove = useCallback(
    (e: CategoricalChartState, event) => {
      if (selecting && e.activeLabel) {
        setSelection((prev) => ({
          ...prev,
          right: values.findIndex((d) => d.t === (e.activeLabel as unknown as number)),
        }));
      }
      event.preventDefault();
      event.stopPropagation();
    },
    [selecting, values]
  );

  const handleMouseUp = useCallback(
    (e: CategoricalChartState, event) => {
      if (selection.left !== null && selection.right !== null) {
        const [tempLeft, tempRight] = [selection.left, selection.right].sort((a, b) => a - b);
        setRange({ left: tempLeft, right: tempRight });
      }
      setSelection({ left: null, right: null });
      setSelecting(false);
      event.preventDefault();
      event.stopPropagation();
    },
    [selection]
  );

  const filteredValues = useMemo(() => {
    return values
  }, [values]);

  const visibleRecordings = useMemo(() => {
    return props.simulation.recordings.filter((view) => !hidden.includes(view.id));
  }, [props.simulation.recordings, hidden]);

  const visibleStimuli = useMemo(() => {
    return props.simulation.stimuli.filter((view) => !hidden.includes(view.id));
  }, [props.simulation.stimuli, hidden]);

  const spikeLines = useMemo(() => {
    return spikeTimes.map((spikeTime, index) => (
      <ReferenceLine
        key={`spike-${index}`}
        x={spikeTime}
        stroke="red"
        strokeDasharray="3 3"
        strokeOpacity={0.6}
      />
    ));
  }, [spikeTimes]);

  if (loading) {
    return (
      <Card className="p-3">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Loading simulation data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="p-3 relative pointer-events-auto">
      <ChartContainer config={chartConfig}>
        <LineChart
          data={filteredValues}
          margin={{ left: 12, right: 12 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey={"t"} tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />

          {visibleRecordings.map((view) => (
            <Line
              key={view.id}
              dataKey={recordingToLabel(view)}
              type="natural"
              stroke={getColorForRecording(view, props.highlight)}
              fillOpacity={0.4}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}

          {visibleStimuli.map((s) => (
            <Line
              key={s.id}
              dataKey={stimulusToLabel(s)}
              type="natural"
              stroke={getColorForStimulus(s, props.highlight)}
              fillOpacity={0.4}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}

          {spikeLines}

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
            height={30}
            stroke="hsl(var(--foreground))"
            fill="transparent"
            travellerWidth={5}
            travellerStroke="hsl(var(--foreground))"
            travellerFill="hsl(var(--card))"
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

      <CardFooter>
        <div className="flex flex-row gap-2 mt-2">
          {props.simulation.recordings.map((view, index) => (
            <div
              className={cn("px-2 flex-1 cursor-pointer", hidden.includes(view.id) && "opacity-20")}
              key={index}
              onClick={() => {
                setHidden((prev) =>
                  prev.find((x) => x === view.id)
                    ? prev.filter((x) => x !== view.id)
                    : [...prev, view.id]
                );
              }}
            >
              <div className="flex flex-row gap-2 my-auto">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getColorForRecording(view, props.highlight) }}
                />
                <div className="text-sm text-muted-foreground my-auto">
                  {recordingToLabel(view)}
                </div>
                <div className="text-sm text-muted-foreground my-auto">
                  <ElektroRecording.DetailLink
                    object={view?.id}
                    key={index}
                    style={{ color: getColorForRecording(view, props.highlight) }}
                  >
                    Open
                  </ElektroRecording.DetailLink>
                </div>
                </div>
            </div>
          ))}
        </div>
        <div className="flex flex-row gap-2 mt-2">
          {props.simulation.stimuli.map((view, index) => (
            <div
              className={cn("px-2 flex-1 cursor-pointer", hidden.includes(view.id) && "opacity-20")}
              key={index}
              onClick={() => {
                setHidden((prev) =>
                  prev.find((x) => x === view.id)
                    ? prev.filter((x) => x !== view.id)
                    : [...prev, view.id]
                );
              }}
            >
              <div className="flex flex-row gap-2 my-auto">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getColorForStimulus(view, props.highlight) }}
                />
                <div className="text-sm text-muted-foreground my-auto">
                  {stimulusToLabel(view)}
                </div>
                <div className="text-sm text-muted-foreground my-auto">
                  <ElektroRecording.DetailLink
                    object={view?.id}
                    key={index}
                    style={{ color: getColorForStimulus(view, props.highlight) }}
                  >
                    Open
                  </ElektroRecording.DetailLink>
                </div>
                </div>
            </div>
          ))}
        </div>
      </CardFooter>

      <div className="absolute top-0 right-0 mr-2 mt-2 flex gap-1">
        <Button variant="outline" size="icon" onClick={(e) => { e.preventDefault(); undo(); }} disabled={!canUndo}>
          <ArrowLeft />
        </Button>
        <Button variant="outline" size="icon" onClick={(e) => { e.preventDefault(); redo(); }} disabled={!canRedo}>
          <ArrowRight />
        </Button>
        <Button onClick={() => reset()} variant="outline">
          <ReloadIcon />
        </Button>
      </div>
    </Card>
  );
};