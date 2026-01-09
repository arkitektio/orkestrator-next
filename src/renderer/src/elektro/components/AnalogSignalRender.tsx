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
  AnalogSignalChannelFragment,
  AnalogSignalFragment,
  ExperimentStimulusView,
} from "../api/graphql";
import { useTraceArray } from "../lib/useTraceArray";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const channelToLabel = (channel: AnalogSignalChannelFragment) =>
  `r:${channel.index}`;

export const getColorForChannel = (
  channel: AnalogSignalChannelFragment,
  highlight?: string,
) => {
  if (highlight) {
    if (highlight === channel.id) {
      return "hsl(45, 70%, 60%)";
    } else {
      return "hsl(0, 0%, 70%)";
    }
  }
  const hue = (parseInt(channel.id) * 137.508) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

export const getColorForStimulusView = (
  view: ExperimentStimulusView,
  highlight?: string,
) => {
  if (highlight && highlight === view.id) {
    return "hsl(45, 70%, 60%)";
  }
  const hue = (parseInt(view.id) * 137.508) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

const useValuesForBlockSegment = (block: AnalogSignalFragment) => {
  const { renderView } = useTraceArray();
  const [values, setValues] = useState<{ [key: string]: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [stepSize, setStepSize] = useState(
    Math.max(
      1,
      Math.round((block.timeTrace.store?.shape?.at(0) || 2000) / 2000),
    ),
  );

  const render = async () => {
    if (block) {
      Promise.all([
        ...block.channels.map((view) => {
          return renderView(view.trace, stepSize);
        }),
        renderView(block.timeTrace, stepSize),
      ]).then((data) => {
        const values = data.map((x) => ({}));

        block.channels.forEach((view, recordIndex: number) => {
          const array = data[recordIndex];

          array.forEach((value, index) => {
            values[index] = {
              ...values[index],
              [channelToLabel(view)]: value,
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
        setValues(values);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    if (block) {
      render();
    }
  }, [block, stepSize]);

  return { values, loading, setStepSize, stepSize };
};

export const AnalogSignalRender = (props: {
  signal: AnalogSignalFragment;
  hidden?: string[];
  hiddenStimuli?: string[];
  highlight?: string;
}) => {
  const { loading, values, stepSize, setStepSize } = useValuesForBlockSegment(
    props.signal,
  );
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

  const visibleChannels = useMemo(() => {
    return props.signal.channels.filter(
      (view) => !props.hidden || !props.hidden.includes(view.id),
    );
  }, [props.signal.channels, props.hidden]);

  if (loading) {
    return (
      <div className="flex flex-col w-full max-h-[70vh] my-auto relative items-center justify-center">
        <div className="">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-h-[70vh] my-auto relative">
      <ChartContainer config={chartConfig} className="flex-grow">
        {/* Chart 1: Recordings */}
        <LineChart
          data={filteredValues}
          height={400}
          margin={{ left: 10, right: 10 }}
          className="relative"
          syncId="simulation-chart"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="t"
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
          {visibleChannels.map((view) => (
            <Line
              key={channelToLabel(view)}
              dataKey={channelToLabel(view)}
              type="natural"
              stroke={getColorForChannel(view, props.highlight)}
              fillOpacity={0.4}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}

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
